import { useEffect } from 'react';

/**
 * Body scroll lock for full-screen overlays.
 *
 * `overflow: hidden` on the body is not enough on iOS Safari — the page still
 * rubber-band scrolls behind the overlay and, worse, scrolling the page under a
 * fixed sheet moves the address bar and resizes the visual viewport mid-interaction.
 * Pinning the body with `position: fixed` and a negative `top` is the approach that
 * actually holds, at the cost of having to restore the scroll offset by hand.
 *
 * Locks are reference-counted at module scope. The mobile nav and the assistant
 * sheet can both be mounted (the nav closes on navigation, the assistant does not),
 * and two independent effects each restoring "the previous value" would otherwise
 * leave the body pinned after the first one unmounted.
 */
let lockCount = 0;
let restore: (() => void) | null = null;

function lock() {
  lockCount += 1;
  if (lockCount > 1) return;

  const { body, documentElement } = document;
  const scrollY = window.scrollY;
  const previous = {
    position: body.style.position,
    top: body.style.top,
    width: body.style.width,
    overflowY: body.style.overflowY,
    scrollBehavior: documentElement.style.scrollBehavior,
  };

  // `scroll-behavior: smooth` is set globally; without suppressing it the restore
  // below animates the page back to where it started, in view, over ~500ms.
  documentElement.style.scrollBehavior = 'auto';
  body.style.position = 'fixed';
  body.style.top = `${-scrollY}px`;
  body.style.width = '100%';
  // Keeps the scrollbar gutter on desktop, so locking does not shift the layout
  // sideways by the scrollbar width.
  body.style.overflowY = 'scroll';

  restore = () => {
    body.style.position = previous.position;
    body.style.top = previous.top;
    body.style.width = previous.width;
    body.style.overflowY = previous.overflowY;
    window.scrollTo(0, scrollY);
    documentElement.style.scrollBehavior = previous.scrollBehavior;
  };
}

function unlock() {
  lockCount = Math.max(0, lockCount - 1);
  if (lockCount > 0) return;
  restore?.();
  restore = null;
}

/** Locks page scroll while `active` is true. Safe to nest. */
export function useBodyScrollLock(active: boolean) {
  useEffect(() => {
    if (!active) return;
    lock();
    return unlock;
  }, [active]);
}
