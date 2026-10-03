import { createElement, useRef, type ReactNode } from 'react';

import { motionConfig } from '@/animations/config/motion';
import { gsap, prefersReducedMotion, SplitText, useGSAP } from '@/animations/core/gsap';

interface TextRevealProps {
  children: ReactNode;
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span' | 'div';
  className?: string;
  /** Seconds before the first line starts once triggered. */
  delay?: number;
  /** 'scroll' waits for the element to enter view; 'mount' plays immediately. */
  trigger?: 'scroll' | 'mount';
}

/**
 * Headline reveal: the text is split into lines, each masked, and the lines rise
 * into place one after another.
 *
 * Works on any content — <br>, <em> and nested markup are preserved — so replacing
 * the copy later needs no change here. `autoSplit` re-splits when fonts finish
 * loading or the width changes mid-animation; once the reveal has finished the
 * split is reverted, leaving the original DOM (and screen-reader text) untouched.
 */
export function TextReveal({ children, as = 'h2', className, delay = 0, trigger = 'scroll' }: TextRevealProps) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const element = ref.current;
      if (!element || prefersReducedMotion()) return;
      SplitText.create(element, {
        type: 'lines',
        mask: 'lines',
        autoSplit: true,
        onSplit: (self) =>
          gsap.from(self.lines, {
            yPercent: 110,
            rotate: 2,
            duration: motionConfig.text.duration,
            stagger: motionConfig.text.stagger,
            delay,
            ease: motionConfig.ease.reveal,
            onComplete: () => self.revert(),
            ...(trigger === 'scroll'
              ? {
                  scrollTrigger: {
                    trigger: element,
                    start: motionConfig.reveal.start,
                    once: true,
                  },
                }
              : {}),
          }),
      });
    },
    { scope: ref, dependencies: [delay, trigger] },
  );

  return createElement(as, { ref, className }, children);
}
