/**
 * Imagery registry.
 *
 * The official source photographs live in `attached_assets/source-imagery/` and are
 * preserved byte-for-byte. What ships is a set of WebP derivatives generated from
 * them — the originals totalled 27 MB, which made the homepage LCP a 3.6 MB JPEG.
 * Each entry records the widths that actually exist so `ResponsiveImage` can build
 * an honest `srcset` (a few sources were narrower than 2400px and have no 2400 variant).
 */
export interface ImageAsset {
  readonly base: string;
  readonly widths: readonly number[];
  readonly ratio: number;
  readonly alt: string;
}

const scenery = (base: string, widths: readonly number[], alt: string): ImageAsset => ({
  base,
  widths,
  ratio: 1600 / 1067,
  alt,
});

export const media = {
  heroBirds: scenery('hero-birds', [1600, 2400], 'Seabirds crossing open water at first light'),
  forestMist: scenery('forest-mist', [1600, 2400], 'Dense forest canopy held in morning mist'),
  mountainSunset: scenery('mountain-sunset', [1600], 'Mountain ridgeline at sunset'),
  volcano: scenery('volcano', [1600, 2400], 'Volcanic landscape under low cloud'),
  cliff: scenery('cliff', [1600, 2400], 'Coastal cliff face meeting the sea'),
  mountain: scenery('mountain', [1600, 2400], 'Mountain range above the treeline'),
  iceberg: scenery('iceberg', [1600], 'Iceberg drifting in cold open water'),
} as const;

export const portraits: Record<string, ImageAsset> = {
  'team-pallavi': { base: 'team-pallavi', widths: [760], ratio: 1, alt: 'Pallavi Priya' },
  'team-ananya': { base: 'team-ananya', widths: [760], ratio: 1, alt: 'Ananya A' },
  'team-bichitra': { base: 'team-bichitra', widths: [760], ratio: 1, alt: 'Bichitra Nanda' },
  'team-sanskar': { base: 'team-sanskar', widths: [760], ratio: 1, alt: 'Sanskar' },
  'team-sheetal': { base: 'team-sheetal', widths: [760], ratio: 1, alt: 'Sheetal' },
  'team-yanika': { base: 'team-yanika', widths: [760], ratio: 1, alt: 'Yanika Manikantha' },
};

/** The official RevifyEarth mark, used exactly as supplied. */
export const brandMark = '/assets/revify/revify-mark-white.png';

export const assetUrl = (file: string) => `/assets/revify/${file}`;
