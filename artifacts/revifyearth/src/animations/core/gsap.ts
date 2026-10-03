import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';

import type { MotionTier } from '../config/background';
import { motionConfig } from '../config/motion';

/**
 * The one place GSAP plugins are registered. Import gsap, ScrollTrigger and
 * SplitText from here rather than from the packages directly, so registration has
 * always happened before use.
 */
gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText);

// Lenis drives the ticker (scroll/SmoothScroll), and a hidden tab must not replay
// a burst of catch-up frames when it returns.
gsap.ticker.lagSmoothing(500, 33);

export { gsap, ScrollTrigger, SplitText, useGSAP };

export const REDUCED_MOTION = '(prefers-reduced-motion: reduce)';

export const prefersReducedMotion = () => typeof window !== 'undefined' && window.matchMedia(REDUCED_MOTION).matches;

/** Fine pointer with hover — where pointer parallax and magnetic effects apply. */
export const hasFinePointer = () =>
  typeof window !== 'undefined' && window.matchMedia('(hover: hover) and (pointer: fine)').matches;

export function getMotionTier(width = window.innerWidth): MotionTier {
  if (width >= motionConfig.breakpoints.desktop) return 'desktop';
  if (width >= motionConfig.breakpoints.tablet) return 'tablet';
  return 'mobile';
}

const tierRank: Record<MotionTier, number> = {
  mobile: 0,
  tablet: 1,
  desktop: 2,
};

/** True when `tier` is at least `minimum` (e.g. an orb with minTier 'tablet'). */
export const tierAllows = (tier: MotionTier, minimum: MotionTier | undefined) =>
  !minimum || tierRank[tier] >= tierRank[minimum];

/** Random value in a [min, max] range. */
export const between = ([min, max]: readonly [number, number]) => gsap.utils.random(min, max);
