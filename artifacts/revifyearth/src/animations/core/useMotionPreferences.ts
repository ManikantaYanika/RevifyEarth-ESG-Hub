import { useEffect, useState } from 'react';

import type { MotionTier } from '../config/background';
import { motionConfig } from '../config/motion';
import { REDUCED_MOTION, getMotionTier, prefersReducedMotion } from './gsap';

export interface MotionPreferences {
  tier: MotionTier;
  reduced: boolean;
}

const read = (): MotionPreferences => ({
  tier: getMotionTier(),
  reduced: prefersReducedMotion(),
});

/**
 * Reactive motion tier and reduced-motion state.
 *
 * Changes only at breakpoint crossings or when the OS setting flips — not on every
 * resize — so animation setups keyed on it rebuild rarely. Read synchronously on
 * first render, so the first paint already uses the right tier.
 */
export function useMotionPreferences(): MotionPreferences {
  const [prefs, setPrefs] = useState(read);

  useEffect(() => {
    const { tablet, desktop } = motionConfig.breakpoints;
    const queries = [REDUCED_MOTION, `(min-width: ${tablet}px)`, `(min-width: ${desktop}px)`].map((q) =>
      window.matchMedia(q),
    );
    const update = () =>
      setPrefs((current) => {
        const next = read();
        return next.tier === current.tier && next.reduced === current.reduced ? current : next;
      });
    for (const query of queries) query.addEventListener('change', update);
    return () => {
      for (const query of queries) query.removeEventListener('change', update);
    };
  }, []);

  return prefs;
}
