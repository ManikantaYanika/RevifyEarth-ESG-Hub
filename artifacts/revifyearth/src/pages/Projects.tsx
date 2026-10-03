import { ecosystemPillars } from '@/data/services';
import { media } from '@/data/media';
import { ArrowLink, SectionLabel } from '@/components/site/Primitives';
import { PageHero } from '@/components/site/PageHero';
import { Reveal } from '@/components/site/Reveal';
import { CtaBand } from '@/components/sections/Bands';

/**
 * The engagement model, shown honestly.
 *
 * The previous page presented three vague cards with a decorative letter standing in
 * for project imagery and a filter with a dead branch. Until client work is cleared
 * for publication, this page explains how an engagement is actually constructed —
 * which is verifiable.
 */
export function Projects() {
  return (
    <>
      <PageHero
        eyebrow="Work & engagement model"
        title={
          <>
            Work that
            <br />
            <em>travels.</em>
          </>
        }
        intro="Our project lens is simple: create communication that holds together from evidence to executive room to public conversation."
        image={media.mountainSunset}
      />

      <section className="mx-auto max-w-[1440px] px-5 py-16 sm:py-20 md:px-10 md:py-32">
        <SectionLabel>How an engagement is built</SectionLabel>
        <div className="grid gap-10 md:grid-cols-[.9fr_1.1fr]">
          <h2 className="font-display max-w-md text-5xl leading-[.98] text-[#24626b] md:text-7xl">
            Five moves,
            <br />
            <em>one narrative.</em>
          </h2>
          <p className="max-w-xl text-sm leading-7 text-[#3d5a5f] md:pt-6">
            Each engagement assembles the same five components in the order that suits the reporting cycle. The
            sequence matters: review before design, design before film, film before web — so every output inherits an
            approved narrative rather than reinterpreting it.
          </p>
        </div>

        <ol className="mt-16 grid gap-px bg-[#b8c9bd] md:grid-cols-2 lg:grid-cols-5">
          {ecosystemPillars.map((pillar, index) => (
            <Reveal as="li" key={pillar.index} order={index} className="bg-[#f2f0e8] p-7">
              <span className="font-mono-custom text-xs text-[#24626b]">{pillar.index}</span>
              <h3 className="font-display mt-10 text-2xl leading-tight">{pillar.title}</h3>
              <p className="mt-3 text-xs uppercase tracking-[.14em] text-[#24626b]">{pillar.headline}</p>
            </Reveal>
          ))}
        </ol>

        <div className="mt-14 max-w-3xl border-l-2 border-[#a8c95a] pl-6">
          <p className="text-sm leading-7 text-[#3d5a5f]">
            Client-specific commercial scope and fees are intentionally not presented here. Projects are scoped to the
            brief, and published engagement detail requires client permission.
          </p>
          <div className="mt-7">
            <ArrowLink href="/process">See the full process</ArrowLink>
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
