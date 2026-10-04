import { media } from '@/data/media';
import { ArrowLink, SectionLabel } from '@/components/site/Primitives';
import { PageHero } from '@/components/site/PageHero';
import { ResponsiveImage } from '@/components/site/ResponsiveImage';
import { MotionImage } from '@/components/animation/MotionImage';
import { Reveal } from '@/components/site/Reveal';
import { CtaBand, FrameworkStrip, WhyRevify } from '@/components/sections/Bands';

const standards = [
  {
    title: 'Disclosure completeness',
    body: 'Missing, partial and weak disclosures identified against GRI Universal and Topic Standards, chapter by chapter.',
  },
  {
    title: 'Data integrity',
    body: 'Inconsistencies in data, units, reporting boundaries, terminology and year-on-year comparability surfaced before publication.',
  },
  {
    title: 'Climate & environment',
    body: 'Environment and climate-related disclosures, water stewardship narrative and the decarbonisation journey strengthened with proper context.',
  },
  {
    title: 'Narrative coherence',
    body: 'Repetition and fragmented narratives resolved; cross-references and section linkages made to work as a whole.',
  },
];

export function Expertise() {
  return (
    <>
      <PageHero
        eyebrow="ESG expertise"
        title={
          <>
            The rigour
            <br />
            <em>behind the</em>
            <br />
            beauty.
          </>
        }
        intro="Technical confidence is what makes creative communication land. Deep understanding of reporting frameworks, climate disclosures and environmental performance lets us review reports well beyond visual presentation."
        image={media.heroBirds}
        dark
      />

      <FrameworkStrip />

      {/* What technical review covers */}
      <section className="mx-auto max-w-[1440px] px-5 py-16 sm:py-20 md:px-10 md:py-32">
        <SectionLabel>What a technical review covers</SectionLabel>
        <div className="grid gap-10 md:grid-cols-[.9fr_1.1fr]">
          <h2 className="font-display max-w-md text-5xl leading-[.98] text-[#24626b] md:text-7xl">
            Beyond
            <br />
            <em>proofreading.</em>
          </h2>
          <div className="max-w-xl md:pt-6">
            <p className="text-sm leading-7 text-[#3d5a5f]">
              A review assesses whether the information presented is complete, coherent, adequately substantiated and
              communicated in a manner appropriate for your stakeholders — not just whether the sentences are correct.
            </p>
            <div className="mt-8">
              <ArrowLink href="/services/content-review">Content review &amp; gap assessment</ArrowLink>
            </div>
          </div>
        </div>

        <div className="mt-14 grid gap-px border border-[#b8c9bd] bg-[#b8c9bd] sm:grid-cols-2">
          {standards.map((item, index) => (
            <Reveal key={item.title} order={index % 2} className="bg-[#f2f0e8] p-8">
              <h3 className="text-lg font-bold">{item.title}</h3>
              <p className="mt-3 text-sm leading-7 text-[#3d5a5f]">{item.body}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <WhyRevify />

      {/* Splits at `lg`, not `md`: a 320px column cannot hold a single line of
          7xl display type, which is what pushed this page 27px wide on tablets. */}
      <section className="mx-auto grid max-w-[1440px] gap-12 px-5 py-16 sm:py-20 md:px-10 md:py-32 lg:grid-cols-2">
        <MotionImage className="h-[420px] w-full" reveal="right">
          <ResponsiveImage
            asset={media.forestMist}
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="h-full w-full object-cover"
          />
        </MotionImage>
        <div className="flex flex-col justify-center">
          <SectionLabel>The point of view</SectionLabel>
          <h2 className="font-display text-5xl leading-[.96] text-[#24626b] md:text-7xl">
            Make the
            <br />
            <em>information</em>
            <br />
            land.
          </h2>
          <p className="mt-8 max-w-md text-sm leading-7 text-[#3d5a5f]">
            The challenge is rarely a lack of information. It is making the information land — with the right context,
            confidence and creative signal.
          </p>
          <div className="mt-8">
            <ArrowLink href="/resources#insights">Perspectives from the work</ArrowLink>
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
