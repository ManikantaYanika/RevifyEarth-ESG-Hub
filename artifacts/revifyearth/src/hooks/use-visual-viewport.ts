import { useEffect, useState } from 'react';

/**
 * Tracks the visual viewport height so a fixed panel can sit above the on-screen
 * keyboard.
 *
 * On mobile browsers the layout viewport does not shrink when the keyboard opens, so
 * a `100dvh` panel keeps its full height and the composer ends up underneath the
 * keyboard. `window.visualViewport` reports the actually-visible region, which is
 * what a chat surface needs.
 *
 * Returns `null` where the API is unavailable, letting callers fall back to CSS.
 */
export function useVisualViewportHeight(active: boolean): number | null {
  const [height, setHeight] = useState<number | null>(null);

  useEffect(() => {
    const viewport = window.visualViewport;
    if (!active || !viewport) {
      setHeight(null);
      return;
    }

    const update = () => setHeight(viewport.height);
    update();

    viewport.addEventListener('resize', update);
    // Scrolling the visual viewport (iOS does this when focusing an input near the
    // bottom) changes the visible region too.
    viewport.addEventListener('scroll', update);

    return () => {
      viewport.removeEventListener('resize', update);
      viewport.removeEventListener('scroll', update);
    };
  }, [active]);

  return height;
}
