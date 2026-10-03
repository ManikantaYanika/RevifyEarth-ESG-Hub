/**
 * Colour and gradient system — the single place the visual palette is defined.
 *
 * Every background layer, gradient utility and interaction glow reads these values
 * through CSS custom properties (`--re-*`), written onto :root by `applyTheme()`
 * before the first render. To re-colour the whole motion system — say green/blue to
 * purple/blue — change the hex values in `palette`; nothing else needs editing.
 *
 * The brand anchors (ink, teal, lime, sage, cream) are the existing RevifyEarth
 * colours. Emerald, ocean, navy and cyan extend them for depth and are only used in
 * gradients and light, never as flat text or UI colours.
 */
export const palette = {
  /** Deepest tone — gradient floors, dark hero base. */
  navy: '#0b1c26',
  /** Brand ink — dark sections and type. */
  ink: '#142b32',
  /** Deep forest green — the shadowed side of dark gradients. */
  forest: '#123a33',
  /** Emerald — the living, green body of the atmosphere. */
  emerald: '#1f7a5c',
  /** Brand teal. */
  teal: '#24626b',
  /** Lighter teal — mid-tones and ambient light. */
  tealLight: '#3e8290',
  /** Ocean blue — cool depth alongside the greens. */
  ocean: '#2a6f8f',
  /** Cyan highlight — used sparingly, at low opacity, for glints. */
  cyan: '#7fd3d1',
  /** Brand lime — the accent light and CTA colour. */
  lime: '#a8c95a',
  /** Brand sage — soft atmospheric highlight. */
  sage: '#d3dfb2',
  /** Brand cream — page base and light highlights. */
  cream: '#f2f0e8',
} as const;

export type PaletteToken = keyof typeof palette;

/**
 * Named gradients, composed from palette tokens. Exposed as `--re-gradient-<name>`
 * and the `.bg-gradient-<name>` utilities in index.css.
 */
export const gradients = {
  /** Dark hero / dark band: navy floor rising through forest into teal. */
  deep: `linear-gradient(160deg, var(--re-navy) 0%, var(--re-ink) 38%, var(--re-forest) 70%, var(--re-teal) 100%)`,
  /** Brand teal band with an ocean edge. */
  teal: `linear-gradient(135deg, var(--re-teal) 0%, var(--re-ocean) 55%, var(--re-forest) 100%)`,
  /** Light sections: cream warmed by sage and a breath of cyan. */
  mist: `linear-gradient(180deg, var(--re-cream) 0%, color-mix(in srgb, var(--re-sage) 35%, var(--re-cream)) 60%, color-mix(in srgb, var(--re-cyan) 12%, var(--re-cream)) 100%)`,
  /** Moving card border: lime → cyan → emerald → lime (rotated by CSS). */
  border: `conic-gradient(from var(--re-angle, 0deg), var(--re-lime), var(--re-cyan), var(--re-emerald), var(--re-lime))`,
  /** Primary button sheen. */
  sheen: `linear-gradient(110deg, transparent 20%, color-mix(in srgb, white 55%, transparent) 50%, transparent 80%)`,
} as const;

/** Writes the palette and gradients as CSS custom properties. Idempotent. */
export function applyTheme(root: HTMLElement = document.documentElement) {
  for (const [token, value] of Object.entries(palette)) {
    root.style.setProperty(`--re-${token.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`)}`, value);
  }
  for (const [name, value] of Object.entries(gradients)) {
    root.style.setProperty(`--re-gradient-${name}`, value);
  }
}

/** CSS reference for a palette token, for inline styles: `cssVar('emerald')`. */
export const cssVar = (token: PaletteToken) => `var(--re-${token.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`)})`;
