import { Check, Copy, RotateCcw } from 'lucide-react';
import { memo, useCallback, useEffect, useState } from 'react';

import { Markdown } from './Markdown';
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
  /** Only the final reply offers regeneration — earlier turns are history. */
  readonly isLastReply: boolean;
  readonly busy: boolean;
  readonly onRegenerate: () => void;
}

export const Message = memo(function Message({
  entry,
  isLastReply,
  busy,
  onRegenerate,
}: MessageProps) {
  if (entry.role === 'user') {
    return (
      <div className="flex justify-end">
        <div className="max-w-[85%] rounded-lg rounded-br-sm bg-[#a8c95a] px-3.5 py-2.5 text-xs leading-6 text-[#142b32]">
          <p className="whitespace-pre-wrap break-words">{entry.content}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-start">
      <div className="w-full max-w-full rounded-lg rounded-bl-sm border border-white/10 bg-white/[0.04] px-3.5 py-3">
        <Markdown content={entry.content} />
        {entry.incomplete && (
          <p className="mt-2 border-t border-white/10 pt-2 text-[10px] uppercase tracking-[.12em] text-white/40">
            Response ended early
          </p>
        )}
      </div>

      {!busy && (
        <div className="mt-1 flex items-center gap-1">
          <CopyButton text={entry.content} />
          {isLastReply && (
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
    </div>
  );
});
