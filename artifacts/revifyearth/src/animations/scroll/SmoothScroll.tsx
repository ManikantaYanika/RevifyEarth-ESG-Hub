import { useEffect } from 'react';
import { useLocation } from 'wouter';

import { ScrollTrigger } from '../core/gsap';
import { useMotionPreferences } from '../core/useMotionPreferences';
import { getLenis, startSmoothScroll, stopSmoothScroll } from './lenis';

/**
 * Mounts Lenis for the app shell and keeps ScrollTrigger measurements honest.
 *
 * - Starts Lenis unless reduced motion is on, and tears it down if that changes.
 * - After every route change, re-measures triggers once the new page has rendered —
 *   routes are code-split, so their height is not known until the chunk arrives.
 * - Watches the document for late height changes (images, accordions, the service
 *   card panels) and refreshes Lenis' limit and ScrollTrigger positions, debounced.
 */
export function SmoothScroll() {
  const { reduced } = useMotionPreferences();
  const [location] = useLocation();

  useEffect(() => {
    if (reduced) {
      stopSmoothScroll();
      return;
    }
    startSmoothScroll();
    return stopSmoothScroll;
  }, [reduced]);

  useEffect(() => {
    let frame = requestAnimationFrame(() => {
      frame = requestAnimationFrame(() => ScrollTrigger.refresh());
    });
    return () => cancelAnimationFrame(frame);
  }, [location]);

  useEffect(() => {
    let timer = 0;
    let lastHeight = document.documentElement.scrollHeight;
    const observer = new ResizeObserver(() => {
      const height = document.documentElement.scrollHeight;
      if (height === lastHeight) return;
      lastHeight = height;
      window.clearTimeout(timer);
      timer = window.setTimeout(() => {
        getLenis()?.resize();
        ScrollTrigger.refresh();
      }, 200);
    });
    observer.observe(document.body);
    return () => {
      observer.disconnect();
      window.clearTimeout(timer);
    };
  }, []);

  return null;
}
