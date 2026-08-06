import OpenAI, { APIError } from "openai";

import { env } from "../config/env";
import { buildInstructions, PROMPT_CACHE_KEY } from "./prompt";
import type { ChatMessage } from "./schema";

/**
 * OpenAI integration.
 *
 * The client is created lazily so the module can be imported (and the server can
 * boot) without an API key present. `timeout` and `maxRetries` are handled by the
 * SDK: it retries connection errors, 408, 409, 429 and 5xx with exponential backoff
 * and jitter, which is exactly the retry policy we want and better than hand-rolling
 * one around a streaming call.
 */

let client: OpenAI | null = null;

function getClient(): OpenAI {
  if (!env.OPENAI_API_KEY) {
    throw new AssistantUnavailableError("OPENAI_API_KEY is not configured.");
  }

  client ??= new OpenAI({
    apiKey: env.OPENAI_API_KEY,
    ...(env.OPENAI_BASE_URL ? { baseURL: env.OPENAI_BASE_URL } : {}),
    timeout: env.OPENAI_TIMEOUT_MS,
    maxRetries: env.OPENAI_MAX_RETRIES,
  });

  return client;
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
 * visitor. Upstream detail is never forwarded — it can contain account, quota or
 * request metadata that has no business reaching the browser.
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

  if (error instanceof APIError) {
    if (error.status === 429) {
      return {
        status: 429,
        code: "upstream_rate_limited",
        message: "The assistant is handling a lot of requests right now. Please try again shortly.",
      };
    }

    /**
     * Operator faults, not visitor faults: a missing/revoked key, an exhausted
     * credit balance, or a hard quota stop. The visitor can do nothing about any of
     * them, so they get the neutral "unavailable" message while the cause is logged
     * for whoever runs the deployment.
     */
    const isOperatorFault =
      error.status === 401 ||
      error.status === 403 ||
      error.status === 402 ||
      error.code === "credit_balance_exhausted" ||
      error.code === "insufficient_quota";

    if (isOperatorFault) {
      return {
        status: 503,
        code: "assistant_unavailable",
        message:
          "The assistant is temporarily unavailable. Please email info@revifyearth.com and we will come back to you.",
      };
    }

    if (error.status === 400) {
      return {
        status: 400,
        code: "invalid_request",
        message: "That request could not be processed. Try rephrasing your question.",
      };
    }

    if (typeof error.status === "number" && error.status >= 500) {
      return {
        status: 502,
        code: "upstream_error",
        message: "The assistant is temporarily unavailable. Please try again in a moment.",
      };
    }

    return {
      status: 502,
      code: "upstream_error",
      message: "The assistant could not complete that request.",
    };
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
 * Conversation history is passed as Responses API input items; the persona and the
 * retrieved company knowledge go in `instructions`, which keeps them outside the
 * conversation transcript and therefore harder to overwrite from a user turn.
 */
export async function streamAssistantReply(
  { messages, signal }: StreamOptions,
  onDelta: (delta: string) => void,
): Promise<StreamResult> {
  const openai = getClient();

  const latest = messages[messages.length - 1];
  if (!latest) throw new Error("streamAssistantReply requires at least one message.");

  const stream = await openai.responses.create(
    {
      model: env.OPENAI_MODEL,
      instructions: buildInstructions(latest.content),
      input: messages.map((message) => ({
        role: message.role,
        content: message.content,
      })),
      max_output_tokens: env.OPENAI_MAX_OUTPUT_TOKENS,
      stream: true,
      // Nothing is retained on OpenAI's side: the browser owns the transcript and
      // the server is stateless, so there is no reason to persist a copy.
      store: false,
      prompt_cache_key: PROMPT_CACHE_KEY,
    },
    { signal },
  );

  let text = "";
  let truncated = false;

  for await (const event of stream) {
    switch (event.type) {
      case "response.output_text.delta": {
        text += event.delta;
        onDelta(event.delta);
        break;
      }
      case "response.incomplete": {
        truncated = true;
        break;
      }
      case "response.failed": {
        const message = event.response.error?.message ?? "The model failed to produce a response.";
        throw new Error(message);
      }
      case "error": {
        throw new Error(event.message);
      }
      default:
        break;
    }
  }

  return { text, truncated };
}
