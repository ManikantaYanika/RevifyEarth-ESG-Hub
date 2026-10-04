import { useRef, type ReactNode } from 'react';

import { useHeroEntrance } from '@/animations/presets/hero';

import type { ImageAsset } from '@/data/media';
import { Atmosphere } from './Primitives';
import { ResponsiveImage } from './ResponsiveImage';

interface PageHeroProps {
  eyebrow: string;
  title: ReactNode;
  intro: string;
  image?: ImageAsset;
  dark?: boolean;
  /**
   * Make the eyebrow part of the h1. Off where the eyebrow is only a label and the
   * headline already names the topic (a service page's "Service 02").
   */
  eyebrowInHeading?: boolean;
  children?: ReactNode;
}

export function PageHero({
  eyebrow,
  title,
  intro,
  image,
  dark = false,
  eyebrowInHeading = true,
  children,
}: PageHeroProps) {
  const heroRef = useRef<HTMLElement>(null);
  useHeroEntrance(heroRef);

  return (
    <section
      ref={heroRef}
      className={`relative isolate overflow-hidden ${dark ? 'bg-gradient-deep text-[#f2f0e8]' : 'bg-[#e5ebdf] text-[#142b32]'}`}
    >
      <Atmosphere dark={dark} />
      {image && (
        <ResponsiveImage
          asset={image}
          alt=""
          priority
          sizes="100vw"
          className="hero-media absolute inset-0 -z-20 h-full w-full object-cover opacity-25 mix-blend-multiply"
          data-hero="media"
        />
      )}
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#142b32]/70 via-transparent to-transparent opacity-50" />
      {/* The two-column split waits for `lg`. At the md breakpoint the headline
          column is only ~372px wide, which is narrower than a single line of 8vw
          display type — that combination pushed 27px of horizontal overflow. */}
      <div
        className="relative mx-auto grid min-h-[520px] max-w-[1440px] items-end gap-10 px-5 pb-16 pt-24 md:min-h-[570px] md:px-10 md:pb-24 lg:grid-cols-[1.15fr_.85fr]"
        data-hero="content"
      >
        <div className="max-w-4xl">
          {eyebrowInHeading ? (
            // The eyebrow is the first line of the h1 rather than a paragraph above it:
            // it names the page topic ("ESG reporting expertise") while the headline is
            // the brand line, so the heading needs both. Each span keeps the classes and
            // motion hook its element had, so rendering and the entrance are unchanged.
            <h1>
              <span className={`eyebrow mb-7 block ${dark ? 'text-[#a8c95a]' : ''}`} data-hero="eyebrow">
                {eyebrow}
              </span>{' '}
              <span
                className="font-display block wrap-break-word text-[clamp(2.9rem,8vw,8rem)] leading-[.88] tracking-[-.055em]"
                data-hero="title"
              >
                {title}
              </span>
            </h1>
          ) : (
            <>
              <p className={`eyebrow mb-7 ${dark ? 'text-[#a8c95a]' : ''}`} data-hero="eyebrow">
                {eyebrow}
              </p>
              <h1
                className="font-display wrap-break-word text-[clamp(2.9rem,8vw,8rem)] leading-[.88] tracking-[-.055em]"
                data-hero="title"
              >
                {title}
              </h1>
            </>
          )}
        </div>
        <div data-hero="copy">
          <p className={`max-w-sm text-sm leading-7 ${dark ? 'text-white/80' : 'text-[#3d5a5f]'}`}>{intro}</p>
          {children}
        </div>
      </div>
    </section>
  );
}
