import { assetUrl, type ImageAsset } from '@/data/media';

interface ResponsiveImageProps {
  asset: ImageAsset;
  className?: string;
  /** Overrides the asset's own alt text. Pass "" for purely decorative imagery. */
  alt?: string;
  sizes?: string;
  /** Set on the LCP image only — loads eagerly and asks the browser to prioritise it. */
  priority?: boolean;
  /** Motion hook for hero entrances (animations/presets/hero.ts). */
  'data-hero'?: string;
}

/**
 * Renders a WebP derivative set with intrinsic dimensions.
 *
 * Explicit width/height are what stop the layout shifting while a full-bleed
 * background image decodes; `sizes` keeps phones from downloading the 2400px file.
 */
export function ResponsiveImage({
  asset,
  className,
  alt,
  sizes = '100vw',
  priority = false,
  'data-hero': dataHero,
}: ResponsiveImageProps) {
  const widest = asset.widths[asset.widths.length - 1];
  const srcSet = asset.widths.map((w) => `${assetUrl(`${asset.base}-${w}.webp`)} ${w}w`).join(', ');

  return (
    <img
      src={assetUrl(`${asset.base}-${widest}.webp`)}
      srcSet={srcSet}
      sizes={sizes}
      alt={alt ?? asset.alt}
      width={widest}
      height={Math.round(widest / asset.ratio)}
      loading={priority ? 'eager' : 'lazy'}
      decoding={priority ? 'sync' : 'async'}
      fetchPriority={priority ? 'high' : 'auto'}
      className={className}
      data-hero={dataHero}
    />
  );
}
