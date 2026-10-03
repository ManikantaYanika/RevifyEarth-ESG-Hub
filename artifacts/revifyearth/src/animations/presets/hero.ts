import type { RefObject } from 'react';

import { motionConfig } from '../config/motion';
import { gsap, prefersReducedMotion, SplitText, useGSAP } from '../core/gsap';

/**
 * Cinematic hero entrance, shared by the Home hero and PageHero.
 *
 * Targets are found by data attributes inside the hero, so the markup and copy can
 * change freely:
 *
 *   data-hero="media"    background photo — settles from enlarged, then a slow
 *                        endless push-in, and drifts with scroll
 *   data-hero="eyebrow"  label — fades up first
 *   data-hero="title"    headline — split into masked lines that rise in sequence
 *   data-hero="rule"     divider — draws from the left
 *   data-hero="copy"     supporting text
 *   data-hero="actions"  CTA group — its children rise in a stagger
 *   data-hero="content"  wrapper that eases up and fades as the hero scrolls away
 *
 * Any missing target is skipped. Under reduced motion nothing runs and the hero
 * renders in its final state.
 */
export function useHeroEntrance(scope: RefObject<HTMLElement | null>) {
  useGSAP(
    () => {
      const root = scope.current;
      if (!root || prefersReducedMotion()) return;
      const q = gsap.utils.selector(root);
      const { hero, ease } = motionConfig;
      const one = (name: string) => q(`[data-hero="${name}"]`)[0] as HTMLElement | undefined;

      const media = one('media');
      const title = one('title');
      const actions = one('actions');
      const content = one('content');

      const tl = gsap.timeline({
        delay: hero.delay,
        defaults: { ease: ease.out },
      });

      if (media) {
        // Opacity comes *from* 0 to whatever the markup sets (the photos are deliberately
        // translucent); scale settles exactly where the push-in loop begins, so the
        // hand-over is seamless.
        tl.from(
          media,
          {
            autoAlpha: 0,
            duration: hero.mediaDuration * 0.6,
            ease: 'power1.out',
          },
          0,
        );
        tl.fromTo(
          media,
          { scale: hero.mediaFromScale },
          { scale: 1.04, duration: hero.mediaDuration, ease: 'power2.out' },
          0,
        );
        tl.add(() => {
          gsap.fromTo(
            media,
            { scale: 1.04, xPercent: 0, yPercent: 0 },
            {
              scale: 1.16,
              xPercent: -2.6,
              yPercent: -1.8,
              duration: hero.kenBurns,
              ease: 'sine.inOut',
              yoyo: true,
              repeat: -1,
            },
          );
        }, hero.mediaDuration);
        gsap.to(media, {
          y: () => root.offsetHeight * 0.18,
          ease: 'none',
          scrollTrigger: {
            trigger: root,
            start: 'top top',
            end: 'bottom top',
            scrub: true,
            invalidateOnRefresh: true,
          },
        });
      }

      // Copy and CTAs fade with opacity, not autoAlpha, so the buttons can be clicked
      // the moment they are visible rather than after the entrance finishes.
      const eyebrow = one('eyebrow');
      if (eyebrow) tl.from(eyebrow, { opacity: 0, y: 24, duration: 1 }, 0.25);

      if (title) {
        const split = SplitText.create(title, { type: 'lines', mask: 'lines' });
        tl.from(
          split.lines,
          {
            yPercent: 115,
            rotate: 2.5,
            duration: motionConfig.text.duration * 1.1,
            stagger: motionConfig.text.stagger * 1.4,
            ease: ease.reveal,
            onComplete: () => split.revert(),
          },
          0.35,
        );
      }

      const rule = one('rule');
      if (rule) tl.from(rule, { scaleX: 0, transformOrigin: 'left center', duration: 1.4 }, 0.8);

      const copy = one('copy');
      if (copy) tl.from(copy, { opacity: 0, y: 28, duration: 1.1 }, 0.95);

      if (actions?.children.length) {
        tl.from(
          actions.children,
          {
            opacity: 0,
            y: 26,
            scale: 0.96,
            duration: 1,
            stagger: 0.12,
            clearProps: 'transform',
          },
          1.05,
        );
      }

      if (content) {
        gsap.to(content, {
          y: -hero.scrollOut,
          opacity: 0.15,
          ease: 'none',
          scrollTrigger: {
            trigger: root,
            start: 'center top+=35%',
            end: 'bottom top',
            scrub: true,
          },
        });
      }
    },
    { scope },
  );
}
