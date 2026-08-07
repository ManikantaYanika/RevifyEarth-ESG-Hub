import { industries } from '@/data/industries';
import { media } from '@/data/media';
import { ArrowLink, QuoteBand, SectionLabel } from '@/components/site/Primitives';
import { PageHero } from '@/components/site/PageHero';
import { ResponsiveImage } from '@/components/site/ResponsiveImage';
import { Reveal } from '@/components/site/Reveal';
import { CtaBand } from '@/components/sections/Bands';

export function Industries() {
  return (
    <>
      <PageHero
        eyebrow="Industries we serve"
        title={
          <>
            Context makes
            <br />
            <em>the difference.</em>
          </>
        }
        intro="Different sectors carry different evidence, language and stakeholder expectations. We start from the disclosure profile of the sector, not a template."
        image={media.volcano}
      />

      <section className="mx-auto max-w-[1440px] px-5 py-14 sm:py-16 md:px-10 md:py-28">
        <SectionLabel>Six sectors</SectionLabel>
        <p className="max-w-2xl text-sm leading-7 text-[#3d5a5f]">
          The reporting challenges described below are properties of each sector’s disclosure profile under GRI and
          BRSR. Engagements are scoped to the specific organisation, not the category.
        </p>

        <div className="mt-14 space-y-px bg-[#b8c9bd]">
          {industries.map((industry, index) => (
            <Reveal
              as="article"
              key={industry.id}
              order={index % 3}
              className="scroll-mt-24 bg-[#f2f0e8]"
            >
              <div id={industry.id} className="grid gap-8 p-7 md:grid-cols-[.55fr_1.45fr] md:p-10">
                <div className="relative h-52 overflow-hidden bg-[#24626b] md:h-full md:min-h-[220px]">
                  <ResponsiveImage
                    asset={industry.image}
                    alt=""
                    sizes="(max-width: 768px) 100vw, 30vw"
                    className="h-full w-full object-cover opacity-85"
                  />
                  <span className="absolute bottom-4 left-4 font-mono-custom text-xs text-white">
                    0{index + 1}
                  </span>
                </div>

                <div>
                  <h2 className="font-display text-3xl leading-tight text-[#24626b] md:text-4xl">{industry.name}</h2>
                  <p className="mt-3 text-lg leading-relaxed">{industry.lede}</p>
                  <p className="mt-5 max-w-2xl text-sm leading-7 text-[#3d5a5f]">{industry.challenge}</p>
                  <div className="mt-7">
                    <p className="eyebrow text-[#24626b]">Where reporting effort concentrates</p>
                    <ul className="mt-4 flex flex-wrap gap-2">
                      {industry.focus.map((item) => (
                        <li
                          key={item}
                          className="border border-[#b8c9bd] px-3 py-2 font-mono-custom text-xs text-[#24626b] lg:text-[10px]"
                        >
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <div className="mt-12">
          <ArrowLink href="/contact">Discuss your sector</ArrowLink>
        </div>
      </section>

      <QuoteBand>Every organisation has a story. The work is finding its most useful shape.</QuoteBand>
      <CtaBand />
    </>
  );
}
