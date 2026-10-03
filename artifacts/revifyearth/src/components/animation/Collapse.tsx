import { useLayoutEffect, useRef, useState, type ReactNode } from 'react';

import { motionConfig } from '@/animations/config/motion';
import { gsap, prefersReducedMotion } from '@/animations/core/gsap';

interface CollapseProps {
  open: boolean;
  id?: string;
  className?: string;
  children: ReactNode;
}

/**
 * Height-animated disclosure panel. Mounts its content when opening and unmounts it
 * after the closing animation, so closed panels cost nothing — the same behaviour
 * framer-motion's AnimatePresence provided, on the site's single animation engine.
 */
export function Collapse({ open, id, className = '', children }: CollapseProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(open);
  const first = useRef(true);

  if (open && !mounted) setMounted(true);

  useLayoutEffect(() => {
    const element = ref.current;
    const initial = first.current;
    first.current = false;
    if (!element || initial) return;

    if (prefersReducedMotion()) {
      if (!open) setMounted(false);
      return;
    }

    const tween = open
      ? gsap.fromTo(
          element,
          { height: 0, opacity: 0 },
          {
            height: 'auto',
            opacity: 1,
            duration: 0.5,
            ease: motionConfig.ease.out,
            clearProps: 'height,opacity',
          },
        )
      : gsap.to(element, {
          height: 0,
          opacity: 0,
          duration: 0.4,
          ease: 'power3.inOut',
          onComplete: () => setMounted(false),
        });
    return () => {
      tween.kill();
    };
  }, [open]);

  if (!mounted) return null;
  return (
    <div ref={ref} id={id} className={`overflow-hidden ${className}`}>
      {children}
    </div>
  );
}
