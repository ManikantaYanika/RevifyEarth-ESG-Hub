import { z } from "zod";

/**
 * Request validation for the assistant endpoint.
 *
 * Bounds are deliberately tight. The client is untrusted: message length, history
 * depth and role values all cap what an attacker can push into a billed prompt.
 */

export const MAX_MESSAGE_LENGTH = 2000;
export const MAX_HISTORY_MESSAGES = 20;

const TAB = 0x09;
const LINE_FEED = 0x0a;
const C0_END = 0x1f;
const C1_START = 0x7f;
const C1_END = 0x9f;
const BIDI_EMBED_START = 0x202a;
const BIDI_EMBED_END = 0x202e;
const BIDI_ISOLATE_START = 0x2066;
const BIDI_ISOLATE_END = 0x2069;

/**
 * Removes characters that have no place in a chat message.
 *
 * C0/C1 control codes (tab and line feed excepted) can corrupt log output and
 * terminal rendering downstream; Unicode bidirectional overrides can make text
 * display differently from how it parses. Carriage returns are dropped too, which
 * normalises CRLF input to LF.
 *
 * Written with code-point comparisons rather than an escaped character class so the
 * source stays plain ASCII and cannot be mangled in transit.
 */
const sanitise = (value: string): string => {
  let output = "";

  for (const char of value) {
    const code = char.codePointAt(0) ?? 0;

    const isControl =
      (code <= C0_END && code !== LINE_FEED && code !== TAB) ||
      (code >= C1_START && code <= C1_END);

    const isBidiOverride =
      (code >= BIDI_EMBED_START && code <= BIDI_EMBED_END) ||
      (code >= BIDI_ISOLATE_START && code <= BIDI_ISOLATE_END);

    if (!isControl && !isBidiOverride) output += char;
  }

  return output.trim();
};

const Message = z.object({
  role: z.enum(["user", "assistant"]),
  content: z
    .string()
    .max(MAX_MESSAGE_LENGTH, `Message must be ${MAX_MESSAGE_LENGTH} characters or fewer.`)
    .transform(sanitise)
    .pipe(z.string().min(1, "Message cannot be empty.")),
});

export const ChatRequest = z.object({
  /**
   * Full conversation including the message being sent, oldest first. The server
   * derives the prompt from this rather than holding session state, so the API stays
   * stateless and horizontally scalable.
   */
  messages: z
    .array(Message)
    .min(1, "At least one message is required.")
    .max(MAX_HISTORY_MESSAGES, `Conversation is limited to ${MAX_HISTORY_MESSAGES} messages.`)
    .refine(
      (messages) => messages[messages.length - 1]?.role === "user",
      "The final message must be from the user.",
    ),
});

export type ChatRequestBody = z.infer<typeof ChatRequest>;
export type ChatMessage = z.infer<typeof Message>;
