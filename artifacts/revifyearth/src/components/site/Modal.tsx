import { X } from 'lucide-react';
import { useEffect, useRef, type ReactNode } from 'react';

const FOCUSABLE =
  'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';

/**
 * Accessible dialog shell.
 *
 * Traps Tab within the panel, closes on Escape and restores focus to whatever
 * opened it. The previous modal had none of these — opening it left keyboard focus
 * behind on the page underneath.
 */
export function Modal({
  onClose,
  label,
  children,
}: {
  onClose: () => void;
  label: string;
  children: ReactNode;
}) {
  const panelRef = useRef<HTMLDivElement>(null);
  const restoreTo = useRef<HTMLElement | null>(null);

  useEffect(() => {
    restoreTo.current = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    panelRef.current?.querySelector<HTMLElement>(FOCUSABLE)?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
        return;
      }
      if (event.key !== 'Tab') return;

      const focusable = panelRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE);
      if (!focusable || focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previousOverflow;
      restoreTo.current?.focus();
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-[#10252b]/85 p-5 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label={label}
      onClick={onClose}
    >
      <div
        ref={panelRef}
        className="relative max-h-[85vh] w-full max-w-2xl overflow-y-auto bg-[#f2f0e8] p-7 text-[#142b32] md:p-12"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          className="focus-ring absolute right-5 top-5 rounded-sm"
          onClick={onClose}
          aria-label="Close dialog"
        >
          <X className="h-5 w-5" />
        </button>
        {children}
      </div>
    </div>
  );
}
