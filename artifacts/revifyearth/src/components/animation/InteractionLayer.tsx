import { useEffect } from 'react';

import { motionConfig } from '@/animations/config/motion';
import { gsap, hasFinePointer, prefersReducedMotion } from '@/animations/core/gsap';
import { useMotionPreferences } from '@/animations/core/useMotionPreferences';

type Magnet = { x: gsap.QuickToFunc; y: gsap.QuickToFunc };

/**
 * Pointer-driven micro-interactions for the whole site, from two delegated
 * listeners — no per-card React state, no listeners per element:
 *
 * - `.fx-card`: writes the pointer position as --mx/--my, which the card's
 *   spotlight gradient follows (index.css).
 * - `[data-magnetic]`: the element leans toward the pointer within
 *   motionConfig.interaction.magneticRadius and springs back on leave.
 *
 * Fine pointers only — touch has no hover position — and off under reduced motion.
 */
export function InteractionLayer() {
  const { reduced } = useMotionPreferences();

  useEffect(() => {
    if (reduced || prefersReducedMotion() || !hasFinePointer()) return;

    const magnets = new WeakMap<HTMLElement, Magnet>();
    const magnetFor = (element: HTMLElement) => {
      let magnet = magnets.get(element);
      if (!magnet) {
        magnet = {
          x: gsap.quickTo(element, 'x', {
            duration: 0.5,
            ease: motionConfig.ease.hover,
          }),
          y: gsap.quickTo(element, 'y', {
            duration: 0.5,
            ease: motionConfig.ease.hover,
          }),
        };
        magnets.set(element, magnet);
      }
      return magnet;
    };

    let active: HTMLElement | null = null;
    let frame = 0;
    let lastEvent: PointerEvent | null = null;

    const update = () => {
      frame = 0;
      const event = lastEvent;
      if (!event) return;
      const target = event.target instanceof Element ? event.target : null;

      const card = target?.closest<HTMLElement>('.fx-card');
      if (card) {
        const rect = card.getBoundingClientRect();
        card.style.setProperty('--mx', `${event.clientX - rect.left}px`);
        card.style.setProperty('--my', `${event.clientY - rect.top}px`);
      }

      const magnetic = target?.closest<HTMLElement>('[data-magnetic]') ?? null;
      if (active && active !== magnetic) {
        const previous = magnetFor(active);
        previous.x(0);
        previous.y(0);
      }
      active = magnetic;
      if (magnetic) {
        const rect = magnetic.getBoundingClientRect();
        const dx = event.clientX - (rect.left + rect.width / 2);
        const dy = event.clientY - (rect.top + rect.height / 2);
        const { magnetic: strength, magneticRadius } = motionConfig.interaction;
        const clamp = gsap.utils.clamp(-magneticRadius, magneticRadius);
        const magnet = magnetFor(magnetic);
        magnet.x(clamp(dx) * strength);
        magnet.y(clamp(dy) * strength);
      }
    };

    const onMove = (event: PointerEvent) => {
      lastEvent = event;
      if (!frame) frame = requestAnimationFrame(update);
    };
    const onLeave = () => {
      if (active) {
        const magnet = magnetFor(active);
        magnet.x(0);
        magnet.y(0);
        active = null;
      }
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    document.documentElement.addEventListener('pointerleave', onLeave);
    return () => {
      window.removeEventListener('pointermove', onMove);
      document.documentElement.removeEventListener('pointerleave', onLeave);
      cancelAnimationFrame(frame);
    };
  }, [reduced]);

  return null;
}
