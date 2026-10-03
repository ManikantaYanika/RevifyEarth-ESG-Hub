import { createElement, useRef, type ReactNode } from 'react';

import { motionConfig } from '@/animations/config/motion';
import { prefersReducedMotion, useGSAP } from '@/animations/core/gsap';
import { scrollReveal, type RevealVariant } from '@/animations/presets/reveal';

interface RevealProps {
  children: ReactNode;
  className?: string;
  /** Stagger position within a group — each step adds motionConfig.reveal.stagger. */
  order?: number;
  /** Entrance style; defaults to a rise. */
  variant?: RevealVariant;
  /** Extra delay in seconds, on top of `order`. */
  delay?: number;
  as?: 'div' | 'section' | 'article' | 'li';
}

/**
 * Scroll-triggered entrance, on GSAP ScrollTrigger.
 *
 * Same API as before, so every existing usage upgraded in place. The hidden start
 * state is applied in a layout effect (before paint) and only when motion is
 * allowed; nothing is hidden by CSS, so without scripting or with reduced motion
 * the content is simply there.
 */
export function Reveal({ children, className = '', order = 0, variant = 'up', delay = 0, as = 'div' }: RevealProps) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (!ref.current || prefersReducedMotion()) return;
      scrollReveal(ref.current, {
        variant,
        delay: delay + order * motionConfig.reveal.stagger,
      });
    },
    { scope: ref, dependencies: [variant, order, delay] },
  );

  return createElement(as, { ref, className: className || undefined }, children);
}
