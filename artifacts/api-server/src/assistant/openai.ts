import OpenAI, { APIError } from "openai";
import type { Stream } from "openai/core/streaming";
import type { ChatCompletionChunk } from "openai/resources/chat/completions";

import { env } from "../config/env";
import { logger } from "../lib/logger";
import { buildInstructions, buildRetrievalQuery } from "./prompt";
import type { ChatMessage } from "./schema";
import { diagnoseUpstream, normaliseProviderBody, toLogFields } from "./upstream-error";

/**
 * Provider integration.
 *
 * The client is created lazily so the module can be imported (and the server can
 * boot) without an API key present.
 *
 * Retries are handled here rather than by the SDK. The SDK's own policy is sound,
 * but it cannot see a provider-specific retry hint that arrives in the *body*
 * (Google sends `RetryInfo.retryDelay` there, not as a `Retry-After` header), and it
 * cannot tell a per-minute rate limit from a per-day quota — retrying the latter
 * only consumes the remaining allowance faster. `maxRetries: 0` below hands that
 * decision to `withRetries`.
 */

let client: OpenAI | null = null;

/**
 * Repairs the provider's error envelope before the SDK parses it.
 *
 * Google answers with a JSON array, `[{ "error": {...} }]`. The SDK expects an
 * object and gives up, which is why real 429s carrying an exact quota name and
 * retry delay were logged as "429 status code (no body)".
 */
const diagnosticFetch: typeof fetch = async (input, init) => {
  const response = await fetch(input, init);
  if (response.ok) return response;

  const text = await response.text();
  const normalised = normaliseProviderBody(text);

  return new Response(normalised, {
    status: response.status,
    statusText: response.statusText,
    headers: response.headers,
  });
};

function getClient(): OpenAI {
  if (!env.OPENAI_API_KEY) {
    throw new AssistantUnavailableError("OPENAI_API_KEY is not configured.");
  }

  client ??= new OpenAI({
    apiKey: env.OPENAI_API_KEY,
    ...(env.OPENAI_BASE_URL ? { baseURL: env.OPENAI_BASE_URL } : {}),
    timeout: env.OPENAI_TIMEOUT_MS,
    maxRetries: 0,
    fetch: diagnosticFetch,
  });

  return client;
}

const BASE_BACKOFF_MS = 500;
const MAX_BACKOFF_MS = 8_000;

/**
 * Exponential backoff with full jitter, capped, honouring the provider's own hint.
 *
 * Jitter matters under load: without it every rejected caller retries on the same
 * schedule and the provider gets a second synchronised burst.
 */
function backoffFor(attempt: number, retryAfterMs?: number): number {
  const exponential = Math.min(BASE_BACKOFF_MS * 2 ** attempt, MAX_BACKOFF_MS);
  const jittered = Math.random() * exponential;
  return Math.max(retryAfterMs ?? 0, jittered);
}

/**
 * Runs `attemptFn` with up to `OPENAI_MAX_RETRIES` retries.
 *
 * Every attempt that fails is logged with the provider's verbatim status, message
 * and quota detail, so an operator can tell a quota problem from an auth, model,
 * endpoint or network one without reproducing it.
 */
async function withRetries<T>(
  attemptFn: () => Promise<T>,
  signal: AbortSignal,
): Promise<T> {
  const maxRetries = env.OPENAI_MAX_RETRIES;
  let lastError: unknown;

  for (let attempt = 0; attempt <= maxRetries; attempt += 1) {
    try {
      return await attemptFn();
    } catch (error) {
      lastError = error;
      if (signal.aborted) throw error;

      const diagnosis = diagnoseUpstream(error);
      const isLast = attempt === maxRetries;
      const willRetry = diagnosis.retryable && !isLast;

      logger.error(
        {
          ...toLogFields(diagnosis),
          attempt: attempt + 1,
          maxAttempts: maxRetries + 1,
          willRetry,
          model: env.OPENAI_MODEL,
          baseUrl: env.OPENAI_BASE_URL ?? "https://api.openai.com/v1",
        },
        willRetry
          ? "Assistant upstream attempt failed, retrying"
          : "Assistant upstream attempt failed, giving up",
      );

      if (!willRetry) throw error;

      const delay = backoffFor(attempt, diagnosis.retryAfterMs);
      await new Promise<void>((resolve, reject) => {
        const timer = setTimeout(() => {
          signal.removeEventListener("abort", onAbort);
          resolve();
        }, delay);
        const onAbort = () => {
          clearTimeout(timer);
          reject(signal.reason ?? new Error("aborted"));
        };
        signal.addEventListener("abort", onAbort, { once: true });
      });
    }
  }

  throw lastError;
}

export class AssistantUnavailableError extends Error {
  readonly name = "AssistantUnavailableError";
}

export interface StreamOptions {
  readonly messages: readonly ChatMessage[];
  /** Aborts the upstream request when the browser disconnects. */
  readonly signal: AbortSignal;
}

export interface StreamResult {
  readonly text: string;
  readonly truncated: boolean;
}

/**
 * Maps an upstream failure onto a status code and a message that is safe to show a
 * visitor.
 *
 * The classification lives in `diagnoseUpstream`; this only chooses the wording.
 * Upstream detail is never forwarded — quota names, model ids and account metadata
 * have no business reaching the browser, and the operator has all of it in the log.
 */
export function describeError(error: unknown): {
  status: number;
  code: string;
  message: string;
} {
  if (error instanceof AssistantUnavailableError) {
    return {
      status: 503,
      code: "assistant_unavailable",
      message: "The assistant is not configured on this environment.",
    };
  }

  const UNAVAILABLE =
    "The assistant is temporarily unavailable. Please email info@revifyearth.com and we will come back to you.";

  if (error instanceof APIError || (error instanceof Error && /^API/.test(error.name))) {
    const { kind, retryable } = diagnoseUpstream(error);

    switch (kind) {
      case "quota":
        /**
         * Only a limit that actually clears on its own gets the "try again shortly"
         * wording. A per-day quota or an exhausted balance does not, and telling a
         * visitor to retry it produces exactly the repeated tapping that wording is
         * meant to prevent.
         */
        return retryable
          ? {
              status: 429,
              code: "upstream_rate_limited",
              message: "The assistant is handling a lot of requests right now. Please try again shortly.",
            }
          : { status: 503, code: "assistant_unavailable", message: UNAVAILABLE };

      case "auth":
      case "model":
      case "endpoint":
      case "bad_request":
        // All configuration faults. Nothing the visitor can do, nothing a retry fixes.
        return { status: 503, code: "assistant_unavailable", message: UNAVAILABLE };

      case "timeout":
        return {
          status: 504,
          code: "timeout",
          message: "The assistant took too long to respond. Please try again.",
        };

      case "network":
      case "server":
        return {
          status: 502,
          code: "upstream_error",
          message: "The assistant is temporarily unavailable. Please try again in a moment.",
        };

      default:
        return {
          status: 502,
          code: "upstream_error",
          message: "The assistant could not complete that request.",
        };
    }
  }

  if (error instanceof Error && error.name === "APIConnectionTimeoutError") {
    return {
      status: 504,
      code: "timeout",
      message: "The assistant took too long to respond. Please try again.",
    };
  }

  return {
    status: 500,
    code: "internal_error",
    message: "Something went wrong. Please try again.",
  };
}

/**
 * Streams a completion, invoking `onDelta` for each text fragment.
 *
 * Uses Chat Completions rather than the Responses API. Responses is OpenAI-only —
 * OpenAI-compatible gateways (Tokligence, OpenRouter, LiteLLM, vLLM and the rest)
 * implement `/v1/chat/completions` and return 404 for `/v1/responses`. Chat
 * Completions works against OpenAI *and* every gateway, so the deployment can change
 * provider by changing `OPENAI_BASE_URL` and `OPENAI_MODEL`, with no code change.
 *
 * What that costs: `instructions` is not available, so the persona and retrieved
 * knowledge go in a leading `system` message instead. The injection guarantee is
 * unchanged — request validation rejects the `system` role outright, so a visitor
 * cannot supply one, and the server always puts its own first.
 */
export async function streamAssistantReply(
  { messages, signal }: StreamOptions,
  onDelta: (delta: string) => void,
): Promise<StreamResult> {
  const openai = getClient();

  const latest = messages[messages.length - 1];
  if (!latest) throw new Error("streamAssistantReply requires at least one message.");

  const systemPrompt = buildInstructions(buildRetrievalQuery(messages));
  const candidates = [env.OPENAI_MODEL, ...env.OPENAI_MODEL_FALLBACKS];

  /**
   * Model failover.
   *
   * Some limits are scoped to a single model — Gemini's free tier allows 20 requests
   * per day *per model*, so one exhausted model would otherwise take the assistant
   * down while others are still serving. `withRetries` handles failures that clear
   * on their own; this moves on when they cannot.
   *
   * Only quota and model faults fall through. An auth failure or a bad request would
   * fail identically on every candidate, so trying them all just delays the error.
   */
  let stream: Stream<ChatCompletionChunk> | undefined;
  let servedBy = "";
  let lastError: unknown;

  for (const [index, model] of candidates.entries()) {
    try {
      // Retried around the *creation* of the stream only. Once deltas are flowing the
      // visitor has partial text on screen, and restarting would rewrite it mid-read.
      stream = await withRetries(
        () =>
          openai.chat.completions.create(
            {
              model,
              messages: [
                { role: "system", content: systemPrompt },
                ...messages.map((message) => ({
                  role: message.role,
                  content: message.content,
                })),
              ],
              max_tokens: env.OPENAI_MAX_OUTPUT_TOKENS,
              stream: true,
              // Omitted entirely unless configured — a provider that does not know
              // the field rejects the whole request with a 400 rather than ignoring it.
              ...(env.OPENAI_REASONING_EFFORT
                ? { reasoning_effort: env.OPENAI_REASONING_EFFORT as "low" | "medium" | "high" }
                : {}),
            },
            { signal },
          ),
        signal,
      );
      servedBy = model;
      if (index > 0) {
        logger.warn(
          { model, primaryModel: env.OPENAI_MODEL, fallbackIndex: index },
          "Assistant served by a fallback model",
        );
      }
      break;
    } catch (error) {
      lastError = error;
      if (signal.aborted) throw error;

      const { kind } = diagnoseUpstream(error);
      const canFailOver = (kind === "quota" || kind === "model") && index < candidates.length - 1;
      if (!canFailOver) throw error;

      logger.warn(
        { model, nextModel: candidates[index + 1], reason: kind },
        "Assistant model unavailable, failing over",
      );
    }
  }

  if (!stream) throw lastError ?? new Error("No model produced a stream.");

  let text = "";
  let truncated = false;

  for await (const chunk of stream) {
    const choice = chunk.choices[0];
    if (!choice) continue;

    // Only `content` is forwarded. Reasoning models served through these gateways
    // (GLM, Kimi, DeepSeek) also emit `reasoning_content` deltas — that is the
    // model's scratchpad, not its answer, and must never reach the transcript.
    const delta = choice.delta?.content;
    if (delta) {
      text += delta;
      onDelta(delta);
    }

    // `length` means the reply was cut off at max_tokens; the client flags it.
    if (choice.finish_reason === "length") truncated = true;
  }

  /**
   * A stream that ends cleanly having produced nothing. Providers do this when a
   * safety filter drops the candidate, and reasoning models can do it by spending
   * the whole token budget thinking. Either way an empty assistant bubble is not an
   * answer — fail loudly so the client shows an error the visitor can retry from.
   */
  if (text.trim() === "") {
    throw new Error("The model returned an empty response.");
  }

  return { text, truncated };
}
