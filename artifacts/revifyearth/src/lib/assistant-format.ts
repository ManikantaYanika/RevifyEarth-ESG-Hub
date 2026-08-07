/**
 * Follow-up extraction.
 *
 * The assistant closes each reply with `[[FOLLOWUPS]]` followed by two or three
 * suggested questions. The marker is a transport detail, never shown: the body is
 * rendered as markdown and the questions become tappable chips.
 *
 * Must stay in step with `FOLLOWUP_MARKER` in
 * `artifacts/api-server/src/assistant/prompt.ts`.
 */
export const FOLLOWUP_MARKER = '[[FOLLOWUPS]]';

const MAX_FOLLOWUPS = 3;
/** Long enough to be a question, short enough to fit a chip on a 320px screen. */
const MAX_FOLLOWUP_LENGTH = 90;

export interface ParsedReply {
  readonly body: string;
  readonly followUps: readonly string[];
}

/**
 * Hides a marker that is still arriving.
 *
 * Deltas land a few characters at a time, so mid-stream the transcript legitimately
 * ends with `[`, `[[FOLL`, and so on. Without this the marker visibly types itself
 * out at the end of every answer before disappearing.
 */
function stripPartialMarker(text: string): string {
  const maxOverlap = Math.min(text.length, FOLLOWUP_MARKER.length - 1);
  for (let length = maxOverlap; length > 0; length -= 1) {
    if (FOLLOWUP_MARKER.startsWith(text.slice(text.length - length))) {
      return text.slice(0, text.length - length);
    }
  }
  return text;
}

export function splitReply(content: string, streaming = false): ParsedReply {
  const markerAt = content.indexOf(FOLLOWUP_MARKER);

  if (markerAt === -1) {
    return { body: streaming ? stripPartialMarker(content) : content, followUps: [] };
  }

  const body = content.slice(0, markerAt).trimEnd();
  const followUps = content
    .slice(markerAt + FOLLOWUP_MARKER.length)
    .split('|')
    .map((question) => question.trim().replace(/^[-*\s]+/, ''))
    .filter((question) => question.length > 0 && question.length <= MAX_FOLLOWUP_LENGTH)
    .slice(0, MAX_FOLLOWUPS);

  return { body, followUps };
}
