import type { PaletteToken } from './theme';

/**
 * Background configuration — every tunable value of the animated background.
 *
 * The engine (animations/background) contains no colours, sizes or speeds of its
 * own; it renders and animates whatever is declared here. Typical edits:
 *
 *   - re-colour:        change `color` tokens below, or the palette in theme.ts
 *   - calmer / livelier: `motion.speed` and `motion.intensity`
 *   - fewer / more orbs: add or remove entries in a variant's `orbs`
 *   - per section:      each variant (page, heroDark, heroLight) is independent
 *
 * Units: positions are % of the layer's box, sizes are vmax, blur is px, durations
 * are seconds (before `motion.speed` is applied), drift is % of the layer's box.
 */

/** A device class the motion is tuned for. `none` is prefers-reduced-motion. */
export type MotionTier = 'desktop' | 'tablet' | 'mobile';

export interface OrbConfig {
  color: PaletteToken;
  /** Centre position, % of the layer. */
  x: number;
  y: number;
  /** Diameter in vmax. */
  size: number;
  /** Peak opacity, 0–1. Scaled by `motion.intensity`. */
  opacity: number;
  /** Softening blur in px, on top of the gradient's own falloff. 0 is cheapest. */
  blur?: number;
  /** How far it wanders, % of the layer box, each way. */
  drift: { x: number; y: number };
  /** Scale range while wandering. */
  scale?: [number, number];
  /** Seconds per wander leg [min, max]; each leg picks a new random target. */
  duration: [number, number];
  /** Parallax depth: px moved per unit of pointer offset, and per 1000px scrolled. */
  depth: number;
  /** Lowest tier this orb renders on (default: all). */
  minTier?: MotionTier;
}

export interface BlobConfig {
  /** Index into the organic shape library (animations/background/shapes.ts). Drawn
   *  as a soft gradient body with a hairline contour; `opacity` scales both. */
  shape: number;
  color: PaletteToken;
  x: number;
  y: number;
  size: number;
  opacity: number;
  /** Degrees per full rotation cycle direction: 1 clockwise, -1 counter. */
  spin: 1 | -1;
  /** Seconds for one full rotation. */
  rotation: number;
  drift: { x: number; y: number };
  duration: [number, number];
  depth: number;
  minTier?: MotionTier;
}

export interface FlowConfig {
  color: PaletteToken;
  opacity: number;
  /** Seconds to travel one full pattern width. */
  duration: number;
  /** 1 travels left, -1 right. */
  direction: 1 | -1;
  /** Vertical offset of the band, % of the layer. */
  top: number;
  height: number;
  depth: number;
  minTier?: MotionTier;
}

export interface ParticleConfig {
  /** Points per 100,000 px² of layer area, before tier scaling. */
  density: number;
  /** Hard cap per tier. */
  max: Record<MotionTier, number>;
  /** px per second [min, max]. */
  speed: [number, number];
  /** Upward lift in px/s — seeds rising. */
  lift: number;
  size: [number, number];
  color: PaletteToken;
  linkColor: PaletteToken;
  /** px; 0 disables connection lines. Ignored on mobile. */
  linkDistance: number;
  linkOpacity: number;
  /** CSS mask that thins particles behind the copy. */
  mask?: string;
}

export interface BackgroundVariant {
  /** Layer 1: the base gradient atmosphere, slowly rotating and breathing. */
  atmosphere: {
    /** Gradient stops as [token, opacity] pairs, laid out as a soft conic field. */
    stops: Array<[PaletteToken, number]>;
    opacity: number;
    /** Seconds per full rotation of the field. */
    rotation: number;
    /** Breathing scale range. */
    scale: [number, number];
  };
  /** Layer 2: large soft light sources. */
  orbs: OrbConfig[];
  /** Layer 3a: organic leaf/blob shapes. */
  blobs: BlobConfig[];
  /** Layer 3b: flowing contour lines. */
  flows: FlowConfig[];
  /** Layer 4: particle / energy field; null to omit. */
  particles: ParticleConfig | null;
  /** Light sweep across the layer; null to omit. */
  sweep: { opacity: number; duration: number } | null;
  /** Soft scrim keeping the copy zone calm: [token, opacity, CSS position]. */
  calm?: [PaletteToken, number, string];
  /** Layer 5: pointer parallax on/off (fine pointers only). */
  pointerParallax: boolean;
  /** Layer 5: scroll parallax on/off. */
  scrollParallax: boolean;
}

export const backgroundConfig = {
  motion: {
    /** Global speed multiplier. 2 = twice as fast, 0.5 = half. */
    speed: 1,
    /** Global intensity: scales orb opacity and drift distance. */
    intensity: 1,
    /** Ease for every wander leg — sine keeps direction changes invisible. */
    ease: 'sine.inOut',
    /** Pointer parallax: px per depth unit at the viewport edge. */
    pointerStrength: 1,
    /** Scroll parallax: px per depth unit per 1000px scrolled. */
    scrollStrength: 1,
  },

  /** Per-tier scaling. Desktop is the reference; lower tiers shed cost. */
  tiers: {
    desktop: { drift: 1, blur: 1, particles: 1, parallax: 1 },
    tablet: { drift: 0.85, blur: 0.6, particles: 0.65, parallax: 0.6 },
    mobile: { drift: 0.7, blur: 0, particles: 0.4, parallax: 0 },
  } satisfies Record<MotionTier, { drift: number; blur: number; particles: number; parallax: number }>,

  /** Film-grain overlay across the whole site (Layer 6). 0 disables. */
  noiseOpacity: 0.035,

  variants: {
    /** Page-wide field behind every route, seen through the cream sections. */
    page: {
      atmosphere: {
        stops: [
          ['sage', 0.55],
          ['cream', 0],
          ['cyan', 0.18],
          ['cream', 0],
          ['lime', 0.22],
          ['cream', 0],
          ['sage', 0.55],
        ],
        opacity: 1,
        rotation: 140,
        scale: [1, 1.12],
      },
      orbs: [
        {
          color: 'lime',
          x: 84,
          y: 8,
          size: 58,
          opacity: 0.3,
          drift: { x: 18, y: 14 },
          scale: [0.9, 1.15],
          duration: [9, 14],
          depth: 10,
        },
        {
          color: 'tealLight',
          x: 6,
          y: 55,
          size: 52,
          opacity: 0.2,
          drift: { x: 16, y: 16 },
          scale: [0.9, 1.2],
          duration: [10, 16],
          depth: 18,
        },
        {
          color: 'sage',
          x: 70,
          y: 92,
          size: 46,
          opacity: 0.7,
          drift: { x: 20, y: 12 },
          duration: [8, 13],
          depth: 14,
        },
        {
          color: 'cyan',
          x: 40,
          y: 30,
          size: 26,
          opacity: 0.16,
          drift: { x: 24, y: 18 },
          duration: [7, 11],
          depth: 26,
          minTier: 'tablet',
        },
      ],
      blobs: [
        {
          shape: 0,
          color: 'emerald',
          x: 92,
          y: 62,
          size: 30,
          opacity: 0.22,
          spin: 1,
          rotation: 90,
          drift: { x: 6, y: 8 },
          duration: [12, 18],
          depth: 22,
          minTier: 'tablet',
        },
        {
          shape: 2,
          color: 'tealLight',
          x: 4,
          y: 14,
          size: 24,
          opacity: 0.2,
          spin: -1,
          rotation: 110,
          drift: { x: 6, y: 6 },
          duration: [12, 18],
          depth: 16,
          minTier: 'desktop',
        },
      ],
      flows: [
        {
          color: 'teal',
          opacity: 0.09,
          duration: 44,
          direction: 1,
          top: 12,
          height: 76,
          depth: 8,
        },
      ],
      particles: null,
      sweep: null,
      pointerParallax: false,
      scrollParallax: true,
    },

    /** Dark heroes: Home and 404. The strongest composition on the site. */
    heroDark: {
      atmosphere: {
        stops: [
          ['emerald', 0.55],
          ['navy', 0],
          ['ocean', 0.5],
          ['navy', 0],
          ['teal', 0.55],
          ['forest', 0],
          ['emerald', 0.55],
        ],
        opacity: 0.9,
        rotation: 90,
        scale: [1.05, 1.25],
      },
      orbs: [
        {
          color: 'lime',
          x: 62,
          y: 18,
          size: 46,
          opacity: 0.42,
          blur: 24,
          drift: { x: 22, y: 18 },
          scale: [0.85, 1.25],
          duration: [7, 11],
          depth: 18,
        },
        {
          color: 'tealLight',
          x: 12,
          y: 78,
          size: 52,
          opacity: 0.6,
          blur: 24,
          drift: { x: 24, y: 14 },
          scale: [0.9, 1.2],
          duration: [8, 12],
          depth: 12,
        },
        {
          color: 'cyan',
          x: 86,
          y: 62,
          size: 24,
          opacity: 0.28,
          blur: 16,
          drift: { x: 16, y: 20 },
          duration: [6, 9],
          depth: 30,
        },
        {
          color: 'sage',
          x: 34,
          y: 30,
          size: 22,
          opacity: 0.22,
          blur: 16,
          drift: { x: 20, y: 16 },
          duration: [6, 10],
          depth: 36,
          minTier: 'tablet',
        },
        {
          color: 'ocean',
          x: 48,
          y: 96,
          size: 40,
          opacity: 0.5,
          blur: 24,
          drift: { x: 18, y: 8 },
          duration: [9, 14],
          depth: 8,
          minTier: 'desktop',
        },
      ],
      blobs: [
        {
          shape: 1,
          color: 'lime',
          x: 82,
          y: 22,
          size: 34,
          opacity: 0.4,
          spin: 1,
          rotation: 70,
          drift: { x: 8, y: 10 },
          duration: [10, 15],
          depth: 24,
        },
        {
          shape: 0,
          color: 'cyan',
          x: 18,
          y: 30,
          size: 26,
          opacity: 0.32,
          spin: -1,
          rotation: 85,
          drift: { x: 10, y: 8 },
          duration: [10, 15],
          depth: 32,
          minTier: 'tablet',
        },
      ],
      flows: [
        {
          color: 'lime',
          opacity: 0.18,
          duration: 38,
          direction: -1,
          top: -8,
          height: 100,
          depth: 20,
        },
        {
          color: 'sage',
          opacity: 0.24,
          duration: 26,
          direction: 1,
          top: 0,
          height: 100,
          depth: 40,
          minTier: 'tablet',
        },
      ],
      particles: {
        density: 3.4,
        max: { desktop: 70, tablet: 42, mobile: 22 },
        speed: [6, 20],
        lift: 4,
        size: [0.8, 2.6],
        color: 'sage',
        linkColor: 'lime',
        linkDistance: 130,
        linkOpacity: 0.28,
        mask: 'radial-gradient(ellipse 75% 85% at 72% 32%, #000 35%, rgba(0,0,0,.25) 100%)',
      },
      sweep: { opacity: 1, duration: 16 },
      calm: ['ink', 0.62, 'ellipse 62% 55% at 20% 80%'],
      pointerParallax: true,
      scrollParallax: true,
    },

    /** Light heroes: every inner page through PageHero. */
    heroLight: {
      atmosphere: {
        stops: [
          ['lime', 0.4],
          ['cream', 0],
          ['cyan', 0.28],
          ['cream', 0],
          ['tealLight', 0.3],
          ['cream', 0],
          ['lime', 0.4],
        ],
        opacity: 0.85,
        rotation: 100,
        scale: [1.05, 1.2],
      },
      orbs: [
        {
          color: 'lime',
          x: 66,
          y: 16,
          size: 44,
          opacity: 0.5,
          drift: { x: 22, y: 16 },
          scale: [0.85, 1.2],
          duration: [7, 11],
          depth: 18,
        },
        {
          color: 'tealLight',
          x: 10,
          y: 80,
          size: 46,
          opacity: 0.34,
          drift: { x: 22, y: 14 },
          scale: [0.9, 1.2],
          duration: [8, 12],
          depth: 12,
        },
        {
          color: 'cream',
          x: 86,
          y: 70,
          size: 30,
          opacity: 0.75,
          drift: { x: 16, y: 18 },
          duration: [6, 9],
          depth: 28,
        },
        {
          color: 'cyan',
          x: 40,
          y: 34,
          size: 20,
          opacity: 0.26,
          drift: { x: 20, y: 16 },
          duration: [6, 10],
          depth: 34,
          minTier: 'tablet',
        },
      ],
      blobs: [
        {
          shape: 1,
          color: 'emerald',
          x: 84,
          y: 26,
          size: 30,
          opacity: 0.3,
          spin: 1,
          rotation: 80,
          drift: { x: 8, y: 10 },
          duration: [10, 15],
          depth: 24,
        },
        {
          shape: 2,
          color: 'teal',
          x: 22,
          y: 20,
          size: 22,
          opacity: 0.26,
          spin: -1,
          rotation: 95,
          drift: { x: 8, y: 8 },
          duration: [10, 15],
          depth: 30,
          minTier: 'tablet',
        },
      ],
      flows: [
        {
          color: 'teal',
          opacity: 0.13,
          duration: 38,
          direction: -1,
          top: -8,
          height: 100,
          depth: 20,
        },
        {
          color: 'teal',
          opacity: 0.22,
          duration: 26,
          direction: 1,
          top: 0,
          height: 100,
          depth: 40,
          minTier: 'tablet',
        },
      ],
      particles: {
        density: 3,
        max: { desktop: 60, tablet: 36, mobile: 18 },
        speed: [6, 18],
        lift: 4,
        size: [0.8, 2.2],
        color: 'teal',
        linkColor: 'tealLight',
        linkDistance: 130,
        linkOpacity: 0.26,
        mask: 'radial-gradient(ellipse 75% 85% at 72% 32%, #000 35%, rgba(0,0,0,.25) 100%)',
      },
      sweep: { opacity: 1, duration: 18 },
      calm: ['cream', 0.55, 'ellipse 55% 60% at 22% 72%'],
      pointerParallax: true,
      scrollParallax: true,
    },
  } satisfies Record<string, BackgroundVariant>,
};

export type BackgroundVariantName = keyof typeof backgroundConfig.variants;
