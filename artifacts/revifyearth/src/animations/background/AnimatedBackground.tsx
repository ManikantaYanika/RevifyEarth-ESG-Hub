import { useId, useRef, type CSSProperties } from 'react';

import {
  backgroundConfig,
  type BackgroundVariant,
  type BackgroundVariantName,
  type MotionTier,
} from '../config/background';
import { cssVar } from '../config/theme';
import { gsap, hasFinePointer, ScrollTrigger, tierAllows, useGSAP } from '../core/gsap';
import { useMotionPreferences } from '../core/useMotionPreferences';
import { breathe, seamlessLoop, spin, wander, type Wanderer } from '../presets/continuous';
import { FlowLines } from './FlowLines';
import { ParticleField } from './ParticleField';
import { organicShapes } from './shapes';

/** `color-mix` keeps every colour a palette variable, so theme.ts re-colours it all. */
const tint = (token: Parameters<typeof cssVar>[0], opacity: number) =>
  `color-mix(in srgb, ${cssVar(token)} ${Math.round(opacity * 100)}%, transparent)`;

/** Layer 1: the stops become soft radial fields arranged around the centre. */
function atmosphereBackground(stops: BackgroundVariant['atmosphere']['stops']) {
  return stops
    .map(([token, opacity], index) => {
      if (opacity <= 0) return null;
      const angle = (index / stops.length) * Math.PI * 2;
      const x = 50 + Math.cos(angle) * 26;
      const y = 50 + Math.sin(angle) * 26;
      return `radial-gradient(circle at ${x.toFixed(1)}% ${y.toFixed(1)}%, ${tint(token, opacity)}, transparent 34%)`;
    })
    .filter(Boolean)
    .join(', ');
}

const depthStyle = (depth: number, extra?: CSSProperties): CSSProperties =>
  ({ '--depth': depth, ...extra }) as CSSProperties;

interface AnimatedBackgroundProps {
  variant: BackgroundVariantName;
  /** Fixed behind the viewport (page-wide) rather than filling its parent (hero). */
  fixed?: boolean;
}

/**
 * The background engine. Renders the layers a variant declares and animates them:
 *
 *   1 atmosphere  — multi-field gradient, rotating and breathing   (spin + breathe)
 *   2 orbs        — soft light sources, each wandering on its own   (wander)
 *   3 blobs/flows — organic shapes turning; contour lines travelling (wander, spin, loop)
 *   4 particles   — canvas energy field                              (ParticleField)
 *   5 parallax    — every `.bg-depth` layer follows pointer and scroll by its depth
 *   6 noise       — the site-wide grain overlay (index.css, backgroundConfig.noiseOpacity)
 *
 * No values live here: everything comes from backgroundConfig and the theme palette.
 * Animations are rebuilt only when the tier or the reduced-motion setting changes,
 * pause while a hero is off-screen, and are fully torn down on unmount.
 */
export function AnimatedBackground({ variant: variantName, fixed = false }: AnimatedBackgroundProps) {
  const root = useRef<HTMLDivElement>(null);
  const uid = useId().replace(/:/g, '');
  const { tier, reduced } = useMotionPreferences();
  const variant: BackgroundVariant = backgroundConfig.variants[variantName];
  const { intensity } = backgroundConfig.motion;
  const tierScale = backgroundConfig.tiers[tier];
  const allowed = <T extends { minTier?: MotionTier }>(items: T[]) => items.filter((i) => tierAllows(tier, i.minTier));
  const orbs = allowed(variant.orbs);
  const blobs = allowed(variant.blobs);
  const flows = allowed(variant.flows);

  useGSAP(
    () => {
      const element = root.current;
      if (!element || reduced) return;

      const rect = element.getBoundingClientRect();
      const width = rect.width || window.innerWidth;
      const height = rect.height || window.innerHeight;
      const drift = tierScale.drift * intensity;
      const wanderers: Wanderer[] = [];
      const loops: gsap.core.Tween[] = [];
      const pct = (value: number, of: number) => (value / 100) * of * drift;

      const atmosphere = element.querySelector('.bg-atmosphere');
      if (atmosphere) {
        loops.push(spin(atmosphere, { duration: variant.atmosphere.rotation }));
        loops.push(
          breathe(atmosphere, {
            scale: variant.atmosphere.scale,
            duration: variant.atmosphere.rotation / 6,
          }),
        );
      }

      element.querySelectorAll<HTMLElement>('.bg-orb').forEach((orb, i) => {
        const config = orbs[i];
        wanderers.push(
          wander(orb, {
            x: pct(config.drift.x, width),
            y: pct(config.drift.y, height),
            scale: config.scale ?? [0.92, 1.12],
            opacity: [0.65, 1],
            duration: config.duration,
          }),
        );
      });

      element.querySelectorAll<HTMLElement>('.bg-blob').forEach((blob, i) => {
        const config = blobs[i];
        wanderers.push(
          wander(blob, {
            x: pct(config.drift.x, width),
            y: pct(config.drift.y, height),
            scale: [0.9, 1.15],
            duration: config.duration,
          }),
        );
        const shape = blob.firstElementChild;
        if (shape) loops.push(spin(shape, { duration: config.rotation, direction: config.spin }));
      });

      element.querySelectorAll<SVGSVGElement>('.bg-flow').forEach((flow, i) => {
        loops.push(
          seamlessLoop(flow, {
            duration: flows[i].duration,
            direction: flows[i].direction,
          }),
        );
      });

      const sweep = element.querySelector('.bg-sweep');
      if (sweep && variant.sweep) {
        loops.push(
          gsap.fromTo(
            sweep,
            { xPercent: -10 },
            {
              xPercent: 250,
              duration: variant.sweep.duration / (backgroundConfig.motion.speed || 1),
              ease: 'sine.inOut',
              yoyo: true,
              repeat: -1,
            },
          ),
        );
      }

      // Layer 5 — parallax. One driver writes x/y on every depth layer through
      // quickTo, combining pointer offset and scroll offset so they never fight.
      const layers = Array.from(element.querySelectorAll<HTMLElement>('.bg-depth')).map((layer) => ({
        depth: Number(layer.style.getPropertyValue('--depth')) || 0,
        x: gsap.quickTo(layer, 'x', { duration: 1.2, ease: 'power3.out' }),
        y: gsap.quickTo(layer, 'y', { duration: 1.2, ease: 'power3.out' }),
      }));
      const parallax = tierScale.parallax;
      let pointerX = 0;
      let pointerY = 0;
      let scrolled = 0;
      const apply = () => {
        for (const layer of layers) {
          const pointer = layer.depth * parallax * backgroundConfig.motion.pointerStrength;
          // Fixed backdrop: gentle and clamped over long pages. Hero: stronger, bounded
          // by the hero's own height.
          const scrollFactor = fixed ? 0.001 : 0.006;
          const scroll = gsap.utils.clamp(
            -220,
            220,
            -scrolled * layer.depth * scrollFactor * backgroundConfig.motion.scrollStrength * (parallax || 0.5),
          );
          layer.x(-pointerX * pointer);
          layer.y(-pointerY * pointer + scroll);
        }
      };

      const cleanups: Array<() => void> = [];
      if (variant.pointerParallax && parallax > 0 && hasFinePointer()) {
        let frame = 0;
        const onMove = (event: PointerEvent) => {
          pointerX = (event.clientX / window.innerWidth) * 2 - 1;
          pointerY = (event.clientY / window.innerHeight) * 2 - 1;
          if (!frame) frame = requestAnimationFrame(() => ((frame = 0), apply()));
        };
        window.addEventListener('pointermove', onMove, { passive: true });
        cleanups.push(() => {
          window.removeEventListener('pointermove', onMove);
          cancelAnimationFrame(frame);
        });
      }

      if (variant.scrollParallax) {
        ScrollTrigger.create({
          trigger: fixed ? document.documentElement : element,
          start: 'top top',
          end: fixed ? 'bottom bottom' : 'bottom top',
          onUpdate: (self) => {
            scrolled = fixed ? self.scroll() : self.scroll() - self.start;
            apply();
          },
        });
      }

      // A hero that has scrolled away stops animating entirely.
      if (!fixed) {
        const observer = new IntersectionObserver(([entry]) => {
          const hidden = !entry.isIntersecting;
          for (const w of wanderers) w.pause(hidden);
          for (const loop of loops) loop.paused(hidden);
        });
        observer.observe(element);
        cleanups.push(() => observer.disconnect());
      }

      return () => {
        for (const w of wanderers) w.kill();
        for (const cleanup of cleanups) cleanup();
      };
    },
    {
      scope: root,
      dependencies: [tier, reduced, variantName, fixed],
      revertOnUpdate: true,
    },
  );

  const blur = tierScale.blur;

  return (
    <div ref={root} className={`bg-engine ${fixed ? 'bg-engine-fixed' : 'bg-engine-local'}`} aria-hidden="true">
      <div className="bg-depth" style={depthStyle(6)}>
        <div
          className="bg-atmosphere"
          style={{
            backgroundImage: atmosphereBackground(variant.atmosphere.stops),
            opacity: variant.atmosphere.opacity,
          }}
        />
      </div>

      {orbs.map((orb, i) => (
        <div
          key={`orb-${i}`}
          className="bg-depth bg-anchor"
          style={depthStyle(orb.depth, { left: `${orb.x}%`, top: `${orb.y}%` })}
        >
          <div
            className="bg-orb"
            style={{
              width: `${orb.size}vmax`,
              height: `${orb.size}vmax`,
              backgroundImage: `radial-gradient(closest-side, ${cssVar(orb.color)}, transparent)`,
              opacity: Math.min(1, orb.opacity * intensity),
              filter: orb.blur && blur ? `blur(${orb.blur * blur}px)` : undefined,
            }}
          />
        </div>
      ))}

      {blobs.map((blob, i) => (
        <div
          key={`blob-${i}`}
          className="bg-depth bg-anchor"
          style={depthStyle(blob.depth, {
            left: `${blob.x}%`,
            top: `${blob.y}%`,
          })}
        >
          <div
            className="bg-blob"
            style={{
              width: `${blob.size}vmax`,
              height: `${blob.size}vmax`,
              opacity: blob.opacity * intensity,
            }}
          >
            {/* A soft body that fades to nothing before the edge, outlined by a
                hairline contour — an organic form, not a flat translucent disc. */}
            <svg viewBox="0 0 200 200" focusable="false">
              <defs>
                <radialGradient id={`${uid}-blob-${i}`} cx="45%" cy="40%" r="60%">
                  <stop offset="0%" stopColor={cssVar(blob.color)} stopOpacity="0.55" />
                  <stop offset="65%" stopColor={cssVar(blob.color)} stopOpacity="0.14" />
                  <stop offset="100%" stopColor={cssVar(blob.color)} stopOpacity="0" />
                </radialGradient>
              </defs>
              <path
                d={organicShapes[blob.shape % organicShapes.length]}
                fill={`url(#${uid}-blob-${i})`}
                stroke={cssVar(blob.color)}
                strokeOpacity="0.55"
                strokeWidth="1"
                vectorEffect="non-scaling-stroke"
              />
            </svg>
          </div>
        </div>
      ))}

      {flows.map((flow, i) => (
        <div
          key={`flow-${i}`}
          className="bg-depth bg-flow-band"
          style={depthStyle(flow.depth, {
            top: `${flow.top}%`,
            height: `${flow.height}%`,
            opacity: flow.opacity,
          })}
        >
          <FlowLines set={i} color={cssVar(flow.color)} />
        </div>
      ))}

      {variant.sweep && !reduced && <div className="bg-sweep" style={{ opacity: variant.sweep.opacity }} />}

      {variant.particles && (
        <div className="bg-depth bg-fill" style={depthStyle(54)}>
          <ParticleField config={variant.particles} tier={tier} reduced={reduced} />
        </div>
      )}

      {variant.calm && (
        <div
          className="bg-calm"
          style={{
            backgroundImage: `radial-gradient(${variant.calm[2]}, ${tint(variant.calm[0], variant.calm[1])}, transparent 72%)`,
          }}
        />
      )}
    </div>
  );
}
