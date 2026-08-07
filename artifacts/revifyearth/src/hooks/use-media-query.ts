import { useEffect, useState } from 'react';

/**
 * Reactive media query.
 *
 * Components that change *behaviour* — not just styling — across a breakpoint need
 * to know which side of it they are on. Reading `matchMedia` once on mount is not
 * enough: rotating a phone or resizing a window has to re-evaluate, or a collapsed
 * mobile panel stays keyboard-inert after it becomes a visible desktop column.
 *
 * Starts `false` so server-rendered and first-paint markup takes the mobile branch,
 * then corrects in the effect.
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const list = window.matchMedia(query);
    const update = () => setMatches(list.matches);
    update();
    list.addEventListener('change', update);
    return () => list.removeEventListener('change', update);
  }, [query]);

  return matches;
}
