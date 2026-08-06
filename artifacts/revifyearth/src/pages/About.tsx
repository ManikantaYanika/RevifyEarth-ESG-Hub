import { company, teamPositioning } from '@/data/company';
import { maturityStages } from '@/data/methodology';
import { media } from '@/data/media';
import { ArrowLink, QuoteBand, SectionLabel } from '@/components/site/Primitives';
import { PageHero } from '@/components/site/PageHero';
import { Reveal } from '@/components/site/Reveal';
import { CtaBand, WhyRevify } from '@/components/sections/Bands';

export function About() {
  return (
    <>
      <PageHero
        eyebrow="The proposition"
        title={
          <>
            The work behind
            <br />
            <em>the story.</em>
          </>
        }
        intro={`${company.legalName} is an ESG branding and sustainability communication partner. We make complex sustainability information useful, credible and memorable.`}
        image={media.forestMist}
      />

      {/* Mission & vision */}
      <section className="mx-auto grid max-w-[1440px] gap-12 px-5 py-24 md:grid-cols-[.8fr_1.2fr] md:px-10 md:py-36">
        <div>
          <SectionLabel>Why we exist</SectionLabel>
          <h2 className="font-display text-5xl leading-[.95] text-[#24626b] md:text-7xl">
            Not just
            <br />
            <em>reporting.</em>
          </h2>
        </div>
        <div className="max-w-2xl">
          <Reveal>
            <p className="text-2xl font-medium leading-[1.3] md:text-4xl">{company.mission}</p>
          </Reveal>
          <Reveal order={1}>
            <div className="mt-10 grid gap-8 border-t border-[#b8c9bd] pt-8 sm:grid-cols-2">
              <div>
                <p className="eyebrow text-[#24626b]">Vision</p>
                <p className="mt-4 text-sm leading-7 text-[#3d5a5f]">{company.vision}</p>
              </div>
              <div>
                <p className="eyebrow text-[#24626b]">Brand story</p>
                <p className="mt-4 text-sm leading-7 text-[#3d5a5f]">{company.origin}</p>
              </div>
            </div>
            <div className="mt-10">
              <ArrowLink href="/sustainability-branding">Discover the approach</ArrowLink>
            </div>
          </Reveal>
        </div>
      </section>

      {/* How the engagement matures */}
      <section className="bg-[#dce5d0] px-5 py-24 md:px-10 md:py-32">
        <div className="mx-auto max-w-[1440px]">
          <SectionLabel>The ESG journey</SectionLabel>
          <div className="grid gap-10 md:grid-cols-[.9fr_1.1fr]">
            <h2 className="font-display max-w-md text-5xl leading-[.98] md:text-7xl">
              Partnerships
              <br />
              <em>that compound.</em>
            </h2>
            <p className="max-w-xl text-sm leading-7 text-[#3d5a5f] md:pt-6">
              An engagement deepens with every reporting cycle. Familiarity with a sustainability journey enables
              continuity, consistency and faster execution — while still introducing fresh perspective each year.
            </p>
          </div>

          <ol className="mt-16 grid gap-px bg-[#8ba59a] md:grid-cols-3">
            {maturityStages.map((stage, index) => (
              <Reveal as="li" key={stage.stage} order={index} className="bg-[#dce5d0] p-8">
                <span className="font-mono-custom text-[10px] uppercase tracking-widest text-[#24626b]">
                  {stage.stage}
                </span>
                <h3 className="font-display mt-6 text-3xl leading-tight text-[#24626b]">{stage.title}</h3>
                <ul className="mt-5 space-y-2.5">
                  {stage.points.map((point) => (
                    <li key={point} className="flex gap-2.5 text-xs leading-6 text-[#3d5a5f]">
                      <span className="mt-2.5 h-1 w-1 shrink-0 rounded-full bg-[#a8c95a]" aria-hidden="true" />
                      {point}
                    </li>
                  ))}
                </ul>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      <WhyRevify />
      <QuoteBand>One coherent story, wherever it lands.</QuoteBand>

      {/* Careers */}
      <section id="careers" className="mx-auto max-w-[1440px] scroll-mt-24 px-5 py-24 md:px-10 md:py-32">
        <div className="grid gap-12 md:grid-cols-[.8fr_1.2fr]">
          <div>
            <SectionLabel>Careers</SectionLabel>
            <h2 className="font-display text-5xl leading-[.95] text-[#24626b] md:text-7xl">
              Work on
              <br />
              <em>what counts.</em>
            </h2>
          </div>
          <div className="max-w-2xl">
            <p className="text-lg leading-relaxed">{teamPositioning}</p>
            <p className="mt-6 text-sm leading-7 text-[#3d5a5f]">
              We hire across two tracks: ESG and sustainability reporting, and editorial design and motion. There are no
              published openings at present — if the work resonates, write to us and tell us what you would want to
              build here.
            </p>
            <div className="mt-9">
              <ArrowLink href="/contact">Introduce yourself</ArrowLink>
            </div>
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
