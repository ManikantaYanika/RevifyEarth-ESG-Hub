import { motionConfig } from '../config/motion';
import { gsap, ScrollTrigger } from '../core/gsap';

/**
 * Reveal presets — the vocabulary every scroll-triggered entrance is built from.
 * Each returns the state an element animates *from*; the target is always its
 * natural state, so content is never left half-styled if a tween is killed.
 */
export type RevealVariant = 'fade' | 'up' | 'down' | 'left' | 'right' | 'scale' | 'clip' | 'blur';

// Opacity, never autoAlpha: autoAlpha sets visibility:hidden until the tween starts,
// which made links and buttons unclickable while they waited to reveal. Opacity keeps
// every element interactive from the first frame it is visible.
export function revealFrom(variant: RevealVariant): gsap.TweenVars {
  const { distance, scale } = motionConfig.reveal;
  switch (variant) {
    case 'fade':
      return { opacity: 0 };
    case 'up':
      return { opacity: 0, y: distance };
    case 'down':
      return { opacity: 0, y: -distance };
    case 'left':
      return { opacity: 0, x: distance };
    case 'right':
      return { opacity: 0, x: -distance };
    case 'scale':
      return { opacity: 0, scale, y: distance / 2 };
    case 'clip':
      return { clipPath: 'inset(0% 0% 100% 0%)', y: distance / 2 };
    case 'blur':
      return { opacity: 0, y: distance / 2, filter: 'blur(10px)' };
  }
}

const clearAfter = 'transform,opacity,visibility,clipPath,filter';

export interface RevealOptions {
  variant?: RevealVariant;
  /** Seconds before this element starts once triggered. */
  delay?: number;
  duration?: number;
  /** When `targets` is a list, seconds between each. */
  stagger?: number;
  /** ScrollTrigger start; defaults to motionConfig.reveal.start. */
  start?: string;
  /** Trigger element when it differs from the targets (e.g. a parent grid). */
  trigger?: Element;
}

/**
 * Scroll-triggered entrance, played once. Elements already in view on load play
 * immediately. Inline styles are cleared afterwards so hover transforms and
 * responsive CSS take over cleanly.
 */
export function scrollReveal(targets: gsap.TweenTarget, options: RevealOptions = {}) {
  const {
    variant = 'up',
    delay = 0,
    duration = motionConfig.reveal.duration,
    stagger = motionConfig.reveal.stagger,
  } = options;
  const elements = gsap.utils.toArray<Element>(targets);
  if (!elements.length) return null;

  return gsap.from(elements, {
    ...revealFrom(variant),
    duration,
    delay,
    stagger,
    ease: variant === 'clip' ? motionConfig.ease.reveal : motionConfig.ease.out,
    clearProps: clearAfter,
    scrollTrigger: {
      trigger: options.trigger ?? elements[0],
      start: options.start ?? motionConfig.reveal.start,
      once: true,
    },
  });
}

/** Re-measure every trigger — after route changes and late layout shifts. */
export const refreshScroll = () => ScrollTrigger.refresh();
