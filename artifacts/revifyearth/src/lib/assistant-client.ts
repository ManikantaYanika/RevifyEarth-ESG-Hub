/**
 * Transport for the assistant endpoint.
 *
 * Uses fetch + ReadableStream rather than EventSource: EventSource is GET-only and
 * the conversation has to travel in a request body. The SSE framing is parsed by
 * hand, which is a few lines and avoids a dependency.
 */

export interface AssistantMessage {
  readonly role: 'user' | 'assistant';
  readonly content: string;
}

export interface AssistantStatus {
  readonly available: boolean;
  readonly maxMessageLength: number;
  readonly maxHistoryMessages: number;
}

export class AssistantError extends Error {
  readonly code: string;
  readonly retryAfterSeconds?: number;

  constructor(code: string, message: string, retryAfterSeconds?: number) {
    super(message);
    this.name = 'AssistantError';
    this.code = code;
    this.retryAfterSeconds = retryAfterSeconds;
  }
}

const API_BASE = '/api/assistant';

/**
 * Memoised so the launcher and the panel share one probe instead of issuing two.
 * Cleared on failure so a transient network error does not disable the assistant
 * for the rest of the session.
 */
let statusPromise: Promise<AssistantStatus> | null = null;

export function fetchAssistantStatus(signal?: AbortSignal): Promise<AssistantStatus> {
  statusPromise ??= (async () => {
    // Deliberately not passing `signal` to the shared fetch: one caller unmounting
    // must not abort the request the other caller is awaiting.
    const response = await fetch(`${API_BASE}/status`);
    if (!response.ok) throw new AssistantError('status_unavailable', 'Assistant status unavailable.');
    return (await response.json()) as AssistantStatus;
  })().catch((error: unknown) => {
    statusPromise = null;
    throw error;
  });

  const pending = statusPromise;

  if (!signal) return pending;

  // Give each caller its own cancellation without disturbing the shared request.
  return new Promise<AssistantStatus>((resolve, reject) => {
    const onAbort = () => reject(signal.reason ?? new DOMException('Aborted', 'AbortError'));
    if (signal.aborted) return onAbort();
    signal.addEventListener('abort', onAbort, { once: true });
    pending.then(resolve, reject).finally(() => signal.removeEventListener('abort', onAbort));
  });
}

interface StreamHandlers {
  readonly onDelta: (text: string) => void;
  readonly onDone: (result: { truncated: boolean }) => void;
}

/**
 * Splits a raw SSE buffer into complete events.
 *
 * Events are separated by a blank line, so a trailing partial event is left in the
 * buffer for the next chunk. Comment lines (`: keep-alive`) are ignored.
 */
function parseEvents(buffer: string): { events: Array<{ event: string; data: string }>; rest: string } {
  const events: Array<{ event: string; data: string }> = [];
  const parts = buffer.split('\n\n');
  const rest = parts.pop() ?? '';

  for (const part of parts) {
    let event = 'message';
    const dataLines: string[] = [];

    for (const line of part.split('\n')) {
      if (line.startsWith(':')) continue;
      if (line.startsWith('event:')) event = line.slice(6).trim();
      else if (line.startsWith('data:')) dataLines.push(line.slice(5).trimStart());
    }

    if (dataLines.length > 0) events.push({ event, data: dataLines.join('\n') });
  }

  return { events, rest };
}

export async function streamChat(
  messages: readonly AssistantMessage[],
  { onDelta, onDone }: StreamHandlers,
  signal: AbortSignal,
): Promise<void> {
  const response = await fetch(`${API_BASE}/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages }),
    signal,
  });

  // Failures before the stream opens arrive as a normal JSON error response.
  if (!response.ok) {
    let code = 'request_failed';
    let message = 'The assistant could not be reached. Please try again.';
    let retryAfterSeconds: number | undefined;

    try {
      const body = (await response.json()) as {
        code?: string;
        message?: string;
        retryAfterSeconds?: number;
      };
      code = body.code ?? code;
      message = body.message ?? message;
      retryAfterSeconds = body.retryAfterSeconds;
    } catch {
      // Non-JSON error body (a proxy error page, say) — keep the generic message.
    }

    throw new AssistantError(code, message, retryAfterSeconds);
  }

  if (!response.body) {
    throw new AssistantError('stream_unsupported', 'Streaming is not supported by this browser.');
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';
  let completed = false;

  try {
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;

      // `stream: true` keeps multi-byte characters intact across chunk boundaries.
      buffer += decoder.decode(value, { stream: true });

      const { events, rest } = parseEvents(buffer);
      buffer = rest;

      for (const item of events) {
        if (item.event === 'delta') {
          const { text } = JSON.parse(item.data) as { text: string };
          onDelta(text);
        } else if (item.event === 'done') {
          const payload = JSON.parse(item.data) as { truncated: boolean };
          completed = true;
          onDone(payload);
        } else if (item.event === 'error') {
          const payload = JSON.parse(item.data) as { code: string; message: string };
          throw new AssistantError(payload.code, payload.message);
        }
      }
    }
  } finally {
    reader.cancel().catch(() => {
      // Cancelling an already-closed stream is not an error worth surfacing.
    });
  }

  // A stream that ends without `done` means the connection dropped mid-reply.
  if (!completed && !signal.aborted) {
    throw new AssistantError('stream_interrupted', 'The response was cut short. Please try again.');
  }
}
