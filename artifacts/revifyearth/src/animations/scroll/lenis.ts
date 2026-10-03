import Lenis from 'lenis';

import { motionConfig } from '../config/motion';
import { gsap, prefersReducedMotion, ScrollTrigger } from '../core/gsap';

/**
 * Lenis smooth scroll, bridged to GSAP.
 *
 * One instance for the app. GSAP's ticker drives Lenis (no second rAF loop), and
 * every Lenis scroll updates ScrollTrigger, so scrubbed and triggered animations
 * stay in lock-step with the smoothed position rather than the raw one.
 *
 * Not created under prefers-reduced-motion: native scrolling is the right answer
 * there. Touch input keeps native scrolling everywhere (`syncTouch` off), which is
 * what phones expect and what keeps inputs and pull-to-refresh behaving.
 *
 * Callers never need to know whether Lenis exists: `scrollToTarget`, `stopScroll`
 * and `startScroll` fall back to native behaviour.
 */
let lenis: Lenis | null = null;
let tick: ((time: number) => void) | null = null;

export function startSmoothScroll() {
  if (lenis || prefersReducedMotion()) return lenis;

  lenis = new Lenis({
    lerp: motionConfig.scroll.lerp,
    wheelMultiplier: motionConfig.scroll.wheelMultiplier,
    smoothWheel: true,
    syncTouch: false,
    // Scrollable panels inside the page (assistant thread, mobile nav, modals)
    // scroll natively instead of being captured by Lenis.
    allowNestedScroll: true,
    // Route and hash navigation is handled by ScrollToTop, which calls scrollToTarget.
    anchors: false,
    autoRaf: false,
  });

  lenis.on('scroll', ScrollTrigger.update);
  tick = (time: number) => lenis?.raf(time * 1000);
  gsap.ticker.add(tick);
  return lenis;
}

export function stopSmoothScroll() {
  if (tick) gsap.ticker.remove(tick);
  tick = null;
  lenis?.destroy();
  lenis = null;
}

export const getLenis = () => lenis;

/** Pause wheel scrolling of the page (overlays). Native fallback: no-op. */
export const stopScroll = () => lenis?.stop();
/** Resume after `stopScroll`. Must run before restoring a scroll position. */
export const startScroll = () => lenis?.start();

/**
 * Where an element sits in the document, by layout — offsetTop up the chain rather
 * than getBoundingClientRect, which includes transforms. An element waiting for its
 * scroll reveal is still shifted down by the reveal's travel distance; measuring
 * that would land the anchor short by exactly that much once the reveal plays.
 */
function layoutTop(element: HTMLElement) {
  let top = 0;
  for (let node: HTMLElement | null = element; node; node = node.offsetParent as HTMLElement | null) {
    top += node.offsetTop;
  }
  return top;
}

/** The scroll position that brings an anchor below the sticky header. */
export function anchorPosition(element: HTMLElement) {
  const margin = Number.parseFloat(getComputedStyle(element).scrollMarginTop) || -motionConfig.scroll.anchorOffset;
  return Math.max(0, layoutTop(element) - margin);
}

/**
 * Scroll to a position or element. `smooth: false` jumps — used on route changes so
 * a new page opens at its top (or its anchor) instantly.
 */
export function scrollToTarget(target: number | HTMLElement, { smooth = true } = {}) {
  const top = typeof target === 'number' ? target : anchorPosition(target);
  if (lenis) {
    // Lenis clamps to its last measured scroll limit. Right after a route change that
    // is still the previous page's height, so a deep anchor would stop short.
    lenis.resize();
    lenis.scrollTo(top, { immediate: !smooth, force: true, lock: smooth });
    return;
  }
  window.scrollTo({ top, behavior: smooth ? 'smooth' : 'instant' });
}
