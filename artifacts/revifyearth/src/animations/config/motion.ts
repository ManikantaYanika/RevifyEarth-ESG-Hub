/**
 * Motion configuration — timing, easing and distances shared by every reveal,
 * hero entrance, image and interaction. Tune the feel of the whole site here.
 */
export const motionConfig = {
  /** Breakpoints that define the motion tiers (match Tailwind's md / lg). */
  breakpoints: { tablet: 768, desktop: 1024 },

  ease: {
    /** Entrances: fast start, long soft landing. */
    out: 'expo.out',
    /** Text and masks. */
    reveal: 'power4.out',
    /** Hover and pointer follow. */
    hover: 'power3.out',
  },

  /** Scroll-triggered reveals. */
  reveal: {
    duration: 1.1,
    /** Seconds between items sharing a group (the `order` prop). */
    stagger: 0.09,
    /** Travel distance in px for slide variants. */
    distance: 46,
    /** Starting scale for the `scale` variant. */
    scale: 0.92,
    /** ScrollTrigger start: element top reaches 88% of the viewport. */
    start: 'top 88%',
  },

  /** Line-by-line headline reveal. */
  text: { duration: 1.15, stagger: 0.1 },

  /** Image reveal: clip-path wipe plus a settle from enlarged. */
  image: { duration: 1.4, fromScale: 1.18, parallax: 12 },

  /** Hero entrance timeline. */
  hero: {
    delay: 0.15,
    mediaDuration: 2.2,
    mediaFromScale: 1.22,
    /** Continuous slow push-in after the entrance, seconds per direction. */
    kenBurns: 26,
    /** How far the hero copy drifts up and fades as it scrolls away, px. */
    scrollOut: 120,
  },

  /** Cards and buttons. */
  interaction: {
    lift: 6,
    tilt: 4,
    magnetic: 0.28,
    magneticRadius: 90,
  },

  /** Lenis smooth scroll. */
  scroll: {
    lerp: 0.1,
    wheelMultiplier: 1,
    /** Offset for anchor targets so they land below the sticky header, px. */
    anchorOffset: -96,
  },
} as const;
