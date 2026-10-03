/**
 * RevifyEarth motion system.
 *
 *   config/      theme.ts (palette, gradients) · background.ts (every background
 *                value, per tier and per section) · motion.ts (timing, easing)
 *   core/        GSAP + plugin registration, motion tiers, reduced-motion state
 *   presets/     reveal · continuous (wander, float, loop, spin, breathe) · hero
 *   scroll/      Lenis smooth scroll bridged to ScrollTrigger
 *   background/  the layered background engine and its parts
 *
 * Components built on it live in components/animation (Reveal, TextReveal,
 * MotionImage, Collapse, InteractionLayer).
 */
import { backgroundConfig } from './config/background';
import { applyTheme } from './config/theme';

export { backgroundConfig } from './config/background';
export { motionConfig } from './config/motion';
export { gradients, palette } from './config/theme';

/** Runs once before the first render: writes the theme and background tokens. */
export function initMotionSystem() {
  applyTheme();
  document.documentElement.style.setProperty('--re-noise', String(backgroundConfig.noiseOpacity));
}
