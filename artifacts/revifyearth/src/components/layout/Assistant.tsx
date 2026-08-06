import { MessageCircle, X } from 'lucide-react';
import { Suspense, lazy, useEffect, useState } from 'react';

import { fetchAssistantStatus } from '@/lib/assistant-client';

/**
 * Assistant launcher.
 *
 * Lives in the app shell so the conversation survives navigation — mounted per page
 * it used to be torn down on every route change.
 *
 * The panel is code-split: react-markdown and remark-gfm are roughly 60 kB gzipped
 * and would otherwise sit in the initial bundle of a marketing site whose visitors
 * mostly never open the chat. The chunk is fetched on first open.
 */

const AssistantPanel = lazy(() => import('@/components/assistant/AssistantPanel'));

function PanelSkeleton() {
  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-[#142b32] sm:inset-auto sm:bottom-24 sm:right-7 sm:h-[min(620px,calc(100dvh-9rem))] sm:w-[400px] sm:rounded-lg sm:border sm:border-white/15"
      role="status"
    >
      <span className="sr-only">Loading assistant</span>
      <span className="route-loader" aria-hidden="true" />
    </div>
  );
}

export function Assistant() {
  const [open, setOpen] = useState(false);
  /** `null` until the capability probe resolves, so the button never flashes in and out. */
  const [available, setAvailable] = useState<boolean | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    fetchAssistantStatus(controller.signal)
      .then((status) => setAvailable(status.available))
      .catch(() => {
        // No endpoint, or no key configured. Offering a launcher that always fails
        // is worse than not offering one.
        if (!controller.signal.aborted) setAvailable(false);
      });
    return () => controller.abort();
  }, []);

  // Body scroll lock while the mobile sheet covers the page. Desktop keeps the page
  // scrollable behind the floating card, so this only applies below `sm`.
  useEffect(() => {
    if (!open) return;
    const isSheet = window.matchMedia('(max-width: 639px)').matches;
    if (!isSheet) return;

    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  if (available === false) return null;

  return (
    <>
      {open && (
        <Suspense fallback={<PanelSkeleton />}>
          <AssistantPanel onClose={() => setOpen(false)} />
        </Suspense>
      )}

      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-expanded={open}
        aria-label={open ? 'Close the RevifyEarth assistant' : 'Open the RevifyEarth assistant'}
        // Hidden behind the mobile sheet, which has its own close control.
        className={`focus-ring fixed bottom-5 right-5 z-[60] flex min-h-[44px] items-center gap-2.5 rounded-full bg-[#a8c95a] px-4 py-3 text-[10px] font-extrabold uppercase tracking-widest text-[#142b32] shadow-lg transition-transform hover:-translate-y-1 md:bottom-7 md:right-7 ${
          open ? 'hidden sm:flex' : 'flex'
        }`}
        style={{ marginBottom: 'env(safe-area-inset-bottom)' }}
      >
        {open ? (
          <X className="h-4 w-4" aria-hidden="true" />
        ) : (
          <MessageCircle className="h-4 w-4" aria-hidden="true" />
        )}
        {open ? 'Close' : 'Ask Revify'}
      </button>
    </>
  );
}
