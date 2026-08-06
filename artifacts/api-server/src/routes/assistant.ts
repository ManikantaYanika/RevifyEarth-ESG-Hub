import { Router, type IRouter } from "express";

import { env, assistantEnabled } from "../config/env";
import { clientKey, createRateLimiter } from "../middleware/rate-limit";
import { describeError, streamAssistantReply } from "../assistant/openai";
import { ChatRequest, MAX_HISTORY_MESSAGES, MAX_MESSAGE_LENGTH } from "../assistant/schema";

const router: IRouter = Router();

const rateLimit = createRateLimiter({
  windowMs: env.ASSISTANT_RATE_LIMIT_WINDOW_MS,
  max: env.ASSISTANT_RATE_LIMIT_MAX,
  dailyMax: env.ASSISTANT_DAILY_MAX_REQUESTS,
});

/** Comment line that keeps intermediaries from closing an idle connection. */
const HEARTBEAT_MS = 15_000;

/**
 * Capability probe. Lets the UI hide or disable the assistant when the environment
 * has no key configured, rather than offering a control that always fails.
 */
router.get("/assistant/status", (_req, res) => {
  res.json({
    available: assistantEnabled,
    maxMessageLength: MAX_MESSAGE_LENGTH,
    maxHistoryMessages: MAX_HISTORY_MESSAGES,
  });
});

/**
 * POST /api/assistant/chat — Server-Sent Events.
 *
 * SSE over POST rather than EventSource, because EventSource is GET-only and the
 * conversation has to go in a body. The browser reads the stream with fetch +
 * ReadableStream.
 *
 * Event protocol:
 *   event: delta  data: {"text": "..."}   incremental output
 *   event: done   data: {"truncated": bool}
 *   event: error  data: {"code": "...", "message": "..."}
 *
 * Once headers are sent the status code is fixed at 200, so any later failure has to
 * be reported as an `error` event rather than an HTTP status.
 */
router.post("/assistant/chat", async (req, res) => {
  const log = req.log;

  if (!assistantEnabled) {
    res.status(503).json({
      code: "assistant_unavailable",
      message: "The assistant is not configured on this environment.",
    });
    return;
  }

  const limit = rateLimit(clientKey(req));
  if (!limit.allowed) {
    log.warn({ reason: limit.reason }, "Assistant request rate limited");
    res.setHeader("Retry-After", String(limit.retryAfterSeconds));
    res.status(429).json({
      code: limit.reason === "daily" ? "daily_limit_reached" : "rate_limited",
      message:
        limit.reason === "daily"
          ? "The assistant has reached today's usage limit. Please contact info@revifyearth.com."
          : `Too many messages. Please wait ${limit.retryAfterSeconds}s and try again.`,
      retryAfterSeconds: limit.retryAfterSeconds,
    });
    return;
  }

  const parsed = ChatRequest.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({
      code: "invalid_request",
      message: parsed.error.issues[0]?.message ?? "The request could not be validated.",
    });
    return;
  }

  const { messages } = parsed.data;

  res.writeHead(200, {
    "Content-Type": "text/event-stream; charset=utf-8",
    "Cache-Control": "no-cache, no-transform",
    Connection: "keep-alive",
    // Tells nginx-style proxies not to buffer, which would defeat streaming.
    "X-Accel-Buffering": "no",
  });
  res.flushHeaders();

  const send = (event: string, data: unknown): void => {
    if (res.writableEnded) return;
    res.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
  };

  const heartbeat = setInterval(() => {
    if (!res.writableEnded) res.write(": keep-alive\n\n");
  }, HEARTBEAT_MS);

  // Cancels the upstream request the moment the visitor navigates away or presses
  // stop, so an abandoned conversation is not billed to completion.
  const controller = new AbortController();
  const onClose = () => controller.abort();
  res.on("close", onClose);

  const startedAt = Date.now();

  try {
    const { text, truncated } = await streamAssistantReply(
      { messages, signal: controller.signal },
      (delta) => send("delta", { text: delta }),
    );

    send("done", { truncated });

    log.info(
      {
        durationMs: Date.now() - startedAt,
        turns: messages.length,
        replyChars: text.length,
        truncated,
        model: env.OPENAI_MODEL,
      },
      "Assistant reply completed",
    );
  } catch (error) {
    if (controller.signal.aborted) {
      log.info({ durationMs: Date.now() - startedAt }, "Assistant stream aborted by client");
    } else {
      const described = describeError(error);
      // Log the real error server-side; send only the sanitised message onward.
      log.error({ err: error, code: described.code }, "Assistant stream failed");
      send("error", { code: described.code, message: described.message });
    }
  } finally {
    clearInterval(heartbeat);
    res.off("close", onClose);
    if (!res.writableEnded) res.end();
  }
});

export default router;
