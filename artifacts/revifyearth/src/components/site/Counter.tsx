import { useEffect, useRef, useState } from 'react';

import { usePrefersReducedMotion } from '@/hooks/use-reduced-motion';

interface CounterProps {
  to: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
}

/**
 * Counts up once the number scrolls into view.
 *
 * The final value is rendered immediately for reduced-motion visitors and is always
 * present in the DOM, so assistive technology never reads a half-finished number.
 */
export function Counter({ to, suffix = '', prefix = '', duration = 1400 }: CounterProps) {
  const reduceMotion = usePrefersReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const [value, setValue] = useState(reduceMotion ? to : 0);

  useEffect(() => {
    if (reduceMotion) {
      setValue(to);
      return;
    }
    const node = ref.current;
    if (!node) return;

    let frame = 0;
    let started = false;

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0]?.isIntersecting || started) return;
        started = true;
        const start = performance.now();
        const tick = (now: number) => {
          const progress = Math.min(1, (now - start) / duration);
          // easeOutCubic — fast start, settles gently on the final figure
          setValue(Math.round(to * (1 - Math.pow(1 - progress, 3))));
          if (progress < 1) frame = requestAnimationFrame(tick);
        };
        frame = requestAnimationFrame(tick);
        observer.disconnect();
      },
      { threshold: 0.4 },
    );

    observer.observe(node);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [to, duration, reduceMotion]);

  return (
    <span ref={ref}>
      {prefix}
      {value}
      {suffix}
    </span>
  );
}
