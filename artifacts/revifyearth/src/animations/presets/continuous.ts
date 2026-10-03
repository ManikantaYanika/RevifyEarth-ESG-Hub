import { backgroundConfig } from '../config/background';
import { between, gsap } from '../core/gsap';

/**
 * Continuous motion presets.
 *
 * `wander` is what keeps the background from ever looking like a loop: instead of
 * one timeline that plays and restarts, every leg picks a fresh random target and
 * eases into it from wherever the previous leg ended. Sine easing makes each change
 * of direction a smooth turn, so there is no visible start, stop or reset.
 */
export interface WanderOptions {
  /** Max offset each way, px. */
  x: number;
  y: number;
  scale?: readonly [number, number];
  rotate?: number;
  opacity?: readonly [number, number];
  /** Seconds per leg [min, max], before the global speed multiplier. */
  duration: readonly [number, number];
}

export function wander(target: Element, options: WanderOptions) {
  const speed = backgroundConfig.motion.speed || 1;
  let tween: gsap.core.Tween | null = null;
  let stopped = false;
  let paused = false;

  const leg = () => {
    if (stopped) return;
    tween = gsap.to(target, {
      paused,
      x: gsap.utils.random(-options.x, options.x),
      y: gsap.utils.random(-options.y, options.y),
      ...(options.scale ? { scale: between(options.scale) } : {}),
      ...(options.rotate ? { rotation: gsap.utils.random(-options.rotate, options.rotate) } : {}),
      ...(options.opacity ? { opacity: between(options.opacity) } : {}),
      duration: between(options.duration) / speed,
      ease: backgroundConfig.motion.ease,
      onComplete: leg,
    });
  };
  leg();

  return {
    /** Freezes the current leg in place; resuming continues from that exact point. */
    pause(value: boolean) {
      paused = value;
      tween?.paused(value);
    },
    kill() {
      stopped = true;
      tween?.kill();
    },
  };
}

export type Wanderer = ReturnType<typeof wander>;

/** Gentle vertical bob — floating visuals and badges. */
export function float(target: Element, { y = 12, duration = 4.5, rotate = 0 } = {}) {
  return gsap.to(target, {
    y: -y,
    rotation: rotate,
    duration,
    ease: 'sine.inOut',
    yoyo: true,
    repeat: -1,
  });
}

/**
 * Endless horizontal travel for a pattern drawn twice its visible width: moving
 * by exactly -50% lands on an identical frame, so `repeat: -1` never shows a seam.
 */
export function seamlessLoop(target: Element, { duration, direction = 1 }: { duration: number; direction?: 1 | -1 }) {
  const speed = backgroundConfig.motion.speed || 1;
  return gsap.fromTo(
    target,
    { xPercent: direction === 1 ? 0 : -50 },
    {
      xPercent: direction === 1 ? -50 : 0,
      duration: duration / speed,
      ease: 'none',
      repeat: -1,
    },
  );
}

/** Slow full rotation, seamless by construction (0° ≡ 360°). */
export function spin(target: Element, { duration, direction = 1 }: { duration: number; direction?: 1 | -1 }) {
  const speed = backgroundConfig.motion.speed || 1;
  return gsap.to(target, {
    rotation: 360 * direction,
    duration: duration / speed,
    ease: 'none',
    repeat: -1,
  });
}

/** Breathing scale, yoyo — used for the atmosphere field. */
export function breathe(target: Element, { scale, duration }: { scale: readonly [number, number]; duration: number }) {
  const speed = backgroundConfig.motion.speed || 1;
  return gsap.fromTo(
    target,
    { scale: scale[0] },
    {
      scale: scale[1],
      duration: duration / speed,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1,
    },
  );
}
