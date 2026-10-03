import { useRef, type ReactNode } from 'react';

import { motionConfig } from '@/animations/config/motion';
import { gsap, prefersReducedMotion, useGSAP } from '@/animations/core/gsap';
import { float } from '@/animations/presets/continuous';

interface MotionImageProps {
  /** Any image — <ResponsiveImage>, <img>, <picture>. The motion never inspects it. */
  children: ReactNode;
  /** Sizing/positioning classes for the frame (aspect ratio, height, rounding). */
  className?: string;
  /** Clip-path wipe plus settle-from-enlarged as it enters view. */
  reveal?: 'up' | 'left' | 'right' | false;
  /** Inner image drifts against scroll, px per side. 0 disables. */
  parallax?: number;
  /** Gentle continuous bob of the whole frame. */
  floating?: boolean;
  /** Slow zoom while hovered (fine pointers). */
  hover?: boolean;
  /** Content layered over the image that must stay put (labels, gradients). */
  overlay?: ReactNode;
}

const clipFrom = {
  up: 'inset(100% 0% 0% 0%)',
  left: 'inset(0% 0% 0% 100%)',
  right: 'inset(0% 100% 0% 0%)',
} as const;

/**
 * Image motion wrapper.
 *
 * Every effect is applied to two wrapper elements — the frame and an oversized
 * inner layer — never to the image itself. Swapping the asset (or replacing
 * ResponsiveImage with anything else) leaves the motion working unchanged.
 */
export function MotionImage({
  children,
  className = '',
  reveal = 'up',
  parallax = motionConfig.image.parallax,
  floating = false,
  hover = true,
  overlay,
}: MotionImageProps) {
  const frame = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!frame.current || !inner.current || prefersReducedMotion()) return;
      const { duration, fromScale } = motionConfig.image;

      if (reveal) {
        gsap
          .timeline({
            scrollTrigger: {
              trigger: frame.current,
              start: motionConfig.reveal.start,
              once: true,
            },
          })
          .from(frame.current, {
            clipPath: clipFrom[reveal],
            duration,
            ease: motionConfig.ease.reveal,
            clearProps: 'clipPath',
          })
          // No clearProps here: clearing a transform component clears the whole
          // transform, which would drop the scrubbed parallax offset mid-scroll.
          .from(
            inner.current,
            {
              scale: fromScale,
              duration: duration * 1.2,
              ease: motionConfig.ease.out,
            },
            0,
          );
      }

      if (parallax) {
        gsap.fromTo(
          inner.current,
          { yPercent: -parallax / 2 },
          {
            yPercent: parallax / 2,
            ease: 'none',
            scrollTrigger: {
              trigger: frame.current,
              start: 'top bottom',
              end: 'bottom top',
              scrub: true,
            },
          },
        );
      }

      if (floating) float(frame.current, { y: 10, duration: 5 });
    },
    { scope: frame, dependencies: [reveal, parallax, floating] },
  );

  return (
    <div ref={frame} className={`motion-image ${className}`} data-hover={hover}>
      <div ref={inner} className="motion-image-inner">
        {children}
      </div>
      {overlay}
    </div>
  );
}
