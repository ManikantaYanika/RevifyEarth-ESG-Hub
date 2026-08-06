import { useEffect, useState } from 'react';

/**
 * Tracks `prefers-reduced-motion` without pulling in an animation library.
 *
 * Starts pessimistic (assume reduced) so the very first paint never animates before
 * the media query has been read.
 */
export function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(true);

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(query.matches);
    const onChange = (event: MediaQueryListEvent) => setReduced(event.matches);
    query.addEventListener('change', onChange);
    return () => query.removeEventListener('change', onChange);
  }, []);

  return reduced;
}
