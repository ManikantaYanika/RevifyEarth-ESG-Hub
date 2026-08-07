import { AlertCircle, ArrowUp, Loader2, Square, Trash2, X } from 'lucide-react';
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';

import { Message } from './Message';
import { useAssistantChat } from '@/hooks/use-assistant-chat';
import { useVisualViewportHeight } from '@/hooks/use-visual-viewport';

/**
 * The assistant conversation surface.
 *
 * Lazy-loaded from `Assistant.tsx`: this module pulls in react-markdown and
 * remark-gfm, which have no business in the initial bundle of a marketing site.
 *
 * Below `sm` it is a full-height sheet rather than a floating card — a 370px card
 * pinned above a launcher button leaves roughly nine lines of readable transcript on
 * a phone.
 */

const SUGGESTIONS = [
  'What does an integrated ESG engagement cover?',
  'How do you review a draft against GRI Standards?',
  'What is the difference between BRSR and GRI reporting?',
  'How long does a reporting cycle take?',
  'What is included in the video report?',
] as const;

/** Opening prompts sit two-up on wider phones; five stacked pushes the composer off-screen. */
const SUGGESTION_GRID = 'grid grid-cols-1 gap-2 min-[400px]:grid-cols-2 sm:grid-cols-1';

const FOCUSABLE =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])';

export default function AssistantPanel({ onClose }: { onClose: () => void }) {
  const { entries, phase, error, status, busy, send, stop, clear, regenerate, retry } =
    useAssistantChat();

  const [draft, setDraft] = useState('');
  const panelRef = useRef<HTMLDivElement>(null);
  const logRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const restoreFocusRef = useRef<HTMLElement | null>(null);
  /** False once the visitor scrolls up, so streaming text cannot yank them back down. */
  const followRef = useRef(true);

  const viewportHeight = useVisualViewportHeight(true);
  const maxLength = status?.maxMessageLength ?? 2000;

  // --- Dialog behaviour: focus trap, Escape, focus restore -------------------

  useEffect(() => {
    restoreFocusRef.current = document.activeElement as HTMLElement | null;
    // Deferred so the panel is laid out before focus moves, which stops iOS
    // scrolling the page to an element it considers off-screen.
    const timer = window.setTimeout(() => inputRef.current?.focus(), 60);

    return () => {
      window.clearTimeout(timer);
      restoreFocusRef.current?.focus?.();
    };
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.stopPropagation();
        onClose();
        return;
      }

      if (event.key !== 'Tab') return;

      const panel = panelRef.current;
      if (!panel) return;

      const focusable = Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
        (element) => element.offsetParent !== null,
      );
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (!first || !last) return;

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown, true);
    return () => document.removeEventListener('keydown', onKeyDown, true);
  }, [onClose]);

  // --- Auto-scroll -----------------------------------------------------------

  const handleScroll = useCallback(() => {
    const log = logRef.current;
    if (!log) return;
    const distanceFromBottom = log.scrollHeight - log.scrollTop - log.clientHeight;
    followRef.current = distanceFromBottom < 60;
  }, []);

  // Layout effect so the scroll lands in the same frame the text paints; with a
  // passive effect the view visibly lags a fast stream.
  useLayoutEffect(() => {
    if (!followRef.current) return;
    const log = logRef.current;
    if (!log) return;
    log.scrollTop = log.scrollHeight;
  }, [entries, phase, error]);

  // --- Composer --------------------------------------------------------------

  const submit = useCallback(() => {
    const text = draft.trim();
    if (!text || busy) return;
    followRef.current = true;
    send(text);
    setDraft('');
    // Reset the autosized height; the value change alone will not shrink it.
    if (inputRef.current) inputRef.current.style.height = 'auto';
  }, [draft, busy, send]);

  const onInput = useCallback((event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDraft(event.target.value);
    const element = event.target;
    element.style.height = 'auto';
    element.style.height = `${Math.min(element.scrollHeight, 120)}px`;
  }, []);

  const onKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
      // Enter sends; Shift+Enter breaks the line — the convention visitors expect.
      if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        submit();
      }
    },
    [submit],
  );

  const askFollowUp = useCallback(
    (question: string) => {
      if (busy) return;
      followRef.current = true;
      send(question);
    },
    [busy, send],
  );

  const lastReplyIndex = entries.reduce(
    (found, entry, index) => (entry.role === 'assistant' ? index : found),
    -1,
  );

  const empty = entries.length === 0;
  const remaining = maxLength - draft.length;
  /**
   * `status` is `null` until the capability probe resolves, so this stays false for
   * that first moment — the panel must not flash "unavailable" before it knows.
   */
  const unavailable = status?.available === false;

  return (
    <div
      ref={panelRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby="assistant-title"
      style={
        // Fixed pixel height on mobile so the composer stays above the keyboard.
        // `sm:` classes below override this for the floating desktop card.
        viewportHeight ? { height: `${viewportHeight}px` } : undefined
      }
      className="fixed inset-0 z-[70] flex flex-col overflow-hidden border-white/15 bg-[#142b32] text-[#f2f0e8] shadow-2xl sm:inset-auto sm:bottom-24 sm:right-7 sm:!h-[min(620px,calc(100dvh-9rem))] sm:w-[400px] sm:rounded-lg sm:border sm:backdrop-blur-xl"
    >
      {/* Header ------------------------------------------------------------ */}
      <div
        className="flex shrink-0 items-start justify-between gap-3 border-b border-white/15 px-5 py-4"
        style={{ paddingTop: 'max(1rem, env(safe-area-inset-top))' }}
      >
        <div className="min-w-0">
          <p className="eyebrow text-[#a8c95a]">Revify assistant</p>
          <p id="assistant-title" className="mt-1.5 text-sm font-bold">
            ESG reporting consultant
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-1">
          {!empty && (
            <button
              type="button"
              onClick={clear}
              aria-label="Clear conversation"
              className="focus-ring flex h-9 w-9 items-center justify-center rounded-sm text-white/50 transition-colors hover:text-[#a8c95a]"
            >
              <Trash2 className="h-4 w-4" aria-hidden="true" />
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close assistant"
            className="focus-ring flex h-9 w-9 items-center justify-center rounded-sm text-white/70 transition-colors hover:text-[#a8c95a]"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* Transcript -------------------------------------------------------- */}
      <div
        ref={logRef}
        onScroll={handleScroll}
        className="flex-1 space-y-4 overflow-y-auto overscroll-contain px-5 py-4"
      >
        {/* Service unreachable. Shown in place of the composer's affordances rather
            than instead of the panel, so the visitor gets an explanation and a way to
            reach a human instead of a control that silently does nothing. */}
        {unavailable && (
          <div role="status" className="space-y-4">
            <div className="flex items-start gap-2.5 rounded-sm border border-white/15 bg-white/3 px-3.5 py-3.5">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-[#a8c95a]" aria-hidden="true" />
              <div className="min-w-0">
                <p className="text-[13px] font-bold text-[#f2f0e8] sm:text-xs">
                  Assistant temporarily unavailable
                </p>
                <p className="mt-1.5 text-[13px] leading-6 text-white/70 sm:text-xs">
                  The ESG assistant cannot be reached right now. Everything else on the site works
                  normally, and the team is happy to answer the same questions directly.
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <a
                href="mailto:info@revifyearth.com"
                className="focus-ring flex min-h-11 w-full items-center justify-center gap-2 rounded-full bg-[#a8c95a] px-4 text-[11px] font-extrabold uppercase tracking-[.14em] text-[#142b32]"
              >
                Email info@revifyearth.com
              </a>
              <a
                href="/contact"
                className="focus-ring flex min-h-11 w-full items-center justify-center rounded-full border border-white/25 px-4 text-[11px] font-extrabold uppercase tracking-[.14em] text-[#f2f0e8] transition-colors hover:border-[#a8c95a] hover:text-[#a8c95a]"
              >
                Book a consultation
              </a>
            </div>
          </div>
        )}

        {empty && !unavailable && (
          <div className="space-y-5">
            <p className="text-[13px] leading-6 text-white/70 sm:text-xs">
              Ask about sustainability reporting, GRI and BRSR alignment, or how a RevifyEarth
              engagement works. Answers cover our services and general ESG practice — not legal or
              assurance advice.
            </p>

            <div>
              <p className="eyebrow mb-2.5 text-white/40">Suggested</p>
              <div className={SUGGESTION_GRID}>
                {SUGGESTIONS.map((prompt) => (
                  <button
                    type="button"
                    key={prompt}
                    onClick={() => askFollowUp(prompt)}
                    className="focus-ring flex min-h-11 w-full items-center rounded-sm border border-white/15 px-3 py-3 text-left text-[12.5px] leading-5 text-white/85 transition-colors hover:border-[#a8c95a] hover:bg-white/3 sm:text-[11px]"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Screen readers get the transcript; the live region is scoped to the
            reply in progress so earlier turns are not re-announced. */}
        {entries.map((entry, index) => (
          <Message
            key={entry.id}
            entry={entry}
            isLastEntry={index === entries.length - 1 && !busy}
            busy={busy}
            streaming={phase === 'streaming' && index === entries.length - 1}
            errored={Boolean(error)}
            onRegenerate={regenerate}
            onFollowUp={askFollowUp}
          />
        ))}

        <div aria-live="polite" aria-atomic="false" className="sr-only">
          {phase === 'waiting' ? 'Assistant is thinking' : ''}
          {phase === 'idle' && lastReplyIndex >= 0 ? 'Response complete' : ''}
        </div>

        {phase === 'waiting' && (
          <div className="flex items-center gap-2 text-[11px] text-white/55">
            <Loader2 className="h-3.5 w-3.5 animate-spin text-[#a8c95a]" aria-hidden="true" />
            <span>Thinking</span>
            <span className="typing-dots" aria-hidden="true">
              •••
            </span>
          </div>
        )}

        {error && (
          <div
            role="alert"
            className="flex items-start gap-2.5 rounded-sm border border-[#c2704f]/40 bg-[#c2704f]/10 px-3 py-3"
          >
            <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#e0a184]" aria-hidden="true" />
            <div className="min-w-0 flex-1">
              <p className="text-[12px] leading-5 text-white/85 sm:text-[11px]">{error.message}</p>
              {/* `assistant_unavailable` is an operator fault — no key, no credit,
                  bad key. Retrying cannot clear it, and offering the button invites
                  a visitor to tap the same question repeatedly for nothing. */}
              {error.code !== 'assistant_unavailable' && (
                <button
                  type="button"
                  onClick={retry}
                  className="focus-ring mt-2 min-h-11 rounded-sm text-[10px] font-extrabold uppercase tracking-[.12em] text-[#a8c95a] hover:underline"
                >
                  Try again
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Composer ---------------------------------------------------------- */}
      <form
        onSubmit={(event) => {
          event.preventDefault();
          submit();
        }}
        className="shrink-0 border-t border-white/15 px-4 pt-3"
        style={{ paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom))' }}
      >
        <div className="flex items-end gap-2">
          <label htmlFor="assistant-input" className="sr-only">
            Ask the RevifyEarth assistant
          </label>
          <textarea
            id="assistant-input"
            ref={inputRef}
            rows={1}
            value={draft}
            onChange={onInput}
            onKeyDown={onKeyDown}
            maxLength={maxLength}
            disabled={busy || unavailable}
            placeholder={unavailable ? 'Assistant unavailable' : 'Ask about ESG reporting…'}
            aria-describedby="assistant-input-hint"
            className="focus-ring min-h-[44px] w-full flex-1 resize-none rounded-sm bg-white/5 px-3 py-3 text-[16px] leading-5 text-white placeholder:text-white/40 disabled:opacity-50 sm:text-xs"
          />

          {busy ? (
            <button
              type="button"
              onClick={stop}
              aria-label="Stop generating"
              className="focus-ring flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/25 text-white/80 transition-colors hover:border-[#a8c95a] hover:text-[#a8c95a]"
            >
              <Square className="h-3.5 w-3.5 fill-current" aria-hidden="true" />
            </button>
          ) : (
            <button
              type="submit"
              disabled={!draft.trim() || unavailable}
              aria-label="Send message"
              className="focus-ring flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#a8c95a] text-[#142b32] transition-opacity disabled:opacity-35"
            >
              <ArrowUp className="h-4 w-4" aria-hidden="true" />
            </button>
          )}
        </div>

        <p id="assistant-input-hint" className="mt-1.5 flex justify-between text-[10px] text-white/35">
          <span>
            {unavailable
              ? 'Chat is offline — use the links above to reach the team'
              : 'Enter to send · Shift+Enter for a new line'}
          </span>
          {remaining < 200 && <span aria-live="polite">{remaining} left</span>}
        </p>
      </form>
    </div>
  );
}
