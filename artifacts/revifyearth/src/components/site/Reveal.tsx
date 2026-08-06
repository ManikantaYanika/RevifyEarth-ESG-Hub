import { createElement, useEffect, useRef, useState, type ReactNode } from 'react';

import { usePrefersReducedMotion } from '@/hooks/use-reduced-motion';

interface RevealProps {
  children: ReactNode;
  className?: string;
  /** Stagger position within a group — each step delays the entrance by 90ms. */
  order?: number;
  as?: 'div' | 'section' | 'article' | 'li';
}

/**
 * Scroll-triggered entrance.
 *
 * The previous implementation ran a CSS animation on mount, so anything below the
 * fold had finished animating before the visitor ever reached it. This fires when
 * the element actually enters the viewport.
 *
 * Deliberately built on IntersectionObserver rather than framer-motion: this
 * component is used on every page including the landing route, and keeping it
 * dependency-free is what lets framer-motion stay out of the initial bundle.
 */
export function Reveal({ children, className = '', order = 0, as = 'div' }: RevealProps) {
  const ref = useRef<HTMLElement>(null);
  const reduceMotion = usePrefersReducedMotion();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (reduceMotion) {
      setVisible(true);
      return;
    }
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0]?.isIntersecting) return;
        setVisible(true);
        observer.disconnect();
      },
      { rootMargin: '0px 0px -12% 0px', threshold: 0.05 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [reduceMotion]);

  return createElement(
    as,
    {
      ref,
      className: `reveal-item ${visible ? 'is-visible' : ''} ${className}`.trim(),
      style: visible && !reduceMotion ? { transitionDelay: `${order * 90}ms` } : undefined,
    },
    children,
  );
}
