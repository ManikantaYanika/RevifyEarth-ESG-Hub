import { ArrowUpRight, Check, Copy, RotateCcw } from 'lucide-react';
import { memo, useCallback, useEffect, useState } from 'react';

import { Markdown } from './Markdown';
import { splitReply } from '@/lib/assistant-format';
import type { ChatEntry } from '@/hooks/use-assistant-chat';

/**
 * One turn of the conversation.
 *
 * The visitor's own words are rendered as plain text — never through the markdown
 * pipeline — so nothing typed into the composer can influence how the panel renders.
 */

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timer = window.setTimeout(() => setCopied(false), 2000);
    return () => window.clearTimeout(timer);
  }, [copied]);

  const copy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
    } catch {
      // Clipboard access is denied outside a secure context; fail quietly rather
      // than interrupting the conversation with an error the visitor cannot act on.
    }
  }, [text]);

  return (
    <button
      type="button"
      onClick={copy}
      className="focus-ring inline-flex min-h-[32px] items-center gap-1.5 rounded-sm px-2 py-1 text-[10px] font-bold uppercase tracking-[.12em] text-white/45 transition-colors hover:text-[#a8c95a]"
    >
      {copied ? <Check className="h-3 w-3" aria-hidden="true" /> : <Copy className="h-3 w-3" aria-hidden="true" />}
      {copied ? 'Copied' : 'Copy'}
    </button>
  );
}

interface MessageProps {
  readonly entry: ChatEntry;
  /**
   * True only when this reply is the last thing in the transcript — not merely the
   * most recent assistant turn. A send that fails leaves a user message after the
   * reply, and the reply's controls must stand down while that is unanswered.
   */
  readonly isLastEntry: boolean;
  readonly busy: boolean;
  /** True while this entry is the one currently receiving deltas. */
  readonly streaming: boolean;
  /** Suppresses the suggested questions while an error is on screen. */
  readonly errored: boolean;
  readonly onRegenerate: () => void;
  readonly onFollowUp: (question: string) => void;
}

export const Message = memo(function Message({
  entry,
  isLastEntry,
  busy,
  streaming,
  errored,
  onRegenerate,
  onFollowUp,
}: MessageProps) {
  if (entry.role === 'user') {
    return (
      <div className="flex justify-end">
        <div className="max-w-[85%] rounded-lg rounded-br-sm bg-[#a8c95a] px-3.5 py-2.5 text-[13px] leading-6 text-[#142b32] sm:text-xs">
          <p className="whitespace-pre-wrap break-words">{entry.content}</p>
        </div>
      </div>
    );
  }

  // Completed replies have already been split by the hook, so this is a no-op for
  // them. It matters mid-stream, where it hides the follow-up marker as it arrives.
  const { body, followUps } = streaming
    ? splitReply(entry.content, true)
    : { body: entry.content, followUps: entry.followUps ?? [] };

  // Gated on "last entry", not "last reply". When a send fails, the transcript ends
  // with the unanswered user message; leaving the previous reply's chips live let a
  // visitor tap the same question repeatedly and stack identical turns with nothing
  // in between. Once something has gone wrong, "Try again" is the only way forward.
  const showFollowUps = isLastEntry && !busy && !errored && followUps.length > 0 && !entry.incomplete;

  return (
    <div className="flex flex-col items-start">
      <div className="w-full max-w-full rounded-lg rounded-bl-sm border border-white/10 bg-white/[0.04] px-3.5 py-3">
        <Markdown content={body} />
        {entry.incomplete && (
          <p className="mt-2 border-t border-white/10 pt-2 text-[10px] uppercase tracking-[.12em] text-white/40">
            Response ended early
          </p>
        )}
      </div>

      {!busy && (
        <div className="mt-1 flex items-center gap-1">
          <CopyButton text={body} />
          {isLastEntry && (
            <button
              type="button"
              onClick={onRegenerate}
              className="focus-ring inline-flex min-h-[32px] items-center gap-1.5 rounded-sm px-2 py-1 text-[10px] font-bold uppercase tracking-[.12em] text-white/45 transition-colors hover:text-[#a8c95a]"
            >
              <RotateCcw className="h-3 w-3" aria-hidden="true" />
              Regenerate
            </button>
          )}
        </div>
      )}

      {/* Suggested next questions. A consultant closes by opening the next door;
          these are the assistant's own, generated from what was just discussed. */}
      {showFollowUps && (
        <div className="mt-2.5 w-full">
          <p className="eyebrow mb-2 text-white/35">Ask next</p>
          <div className="flex flex-col gap-1.5">
            {followUps.map((question) => (
              <button
                key={question}
                type="button"
                onClick={() => onFollowUp(question)}
                data-testid="button-followup"
                className="focus-ring group flex min-h-10 w-full items-center justify-between gap-2 rounded-sm border border-white/10 bg-white/2 px-3 py-2 text-left text-[12.5px] leading-5 text-white/75 transition-colors hover:border-[#a8c95a]/60 hover:bg-white/5 hover:text-[#f2f0e8] sm:text-[11px]"
              >
                {question}
                <ArrowUpRight
                  className="h-3.5 w-3.5 shrink-0 text-[#a8c95a] opacity-0 transition-opacity group-hover:opacity-100"
                  aria-hidden="true"
                />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
});
