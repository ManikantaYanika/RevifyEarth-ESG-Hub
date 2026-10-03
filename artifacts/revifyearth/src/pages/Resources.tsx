import { insightTopics } from '@/data/resources';
import { media } from '@/data/media';
import { ArrowLink, SectionLabel } from '@/components/site/Primitives';
import { PageHero } from '@/components/site/PageHero';
import { Reveal } from '@/components/site/Reveal';
import { CtaBand, FrameworkStrip } from '@/components/sections/Bands';
import { FaqAccordion } from '@/components/sections/Faq';

export function Resources() {
  return (
    <>
      <PageHero
        eyebrow="Resources"
        title={
          <>
            Reference for
            <br />
            <em>the cycle ahead.</em>
          </>
        }
        intro="Frameworks, scope answers and perspectives for teams preparing a sustainability reporting cycle."
        image={media.iceberg}
      />

      <FrameworkStrip />

      <section id="insights" className="mx-auto max-w-[1440px] scroll-mt-24 px-5 py-16 sm:py-20 md:px-10 md:py-32">
        <div className="flex flex-wrap items-end justify-between gap-8">
          <div>
            <SectionLabel>Insights</SectionLabel>
            <h2 className="font-display max-w-lg text-5xl leading-[.98] text-[#24626b] md:text-7xl">
              Perspectives
              <br />
              <em>from the work.</em>
            </h2>
          </div>
          <ArrowLink href="/contact">Request the full note</ArrowLink>
        </div>

        <p className="mt-8 max-w-2xl text-sm leading-7 text-[#3d5a5f]">
          Short pieces drawn from live reporting engagements. Full articles are published as the editorial calendar
          rolls out — until then, ask and we will send the underlying note.
        </p>

        <div className="mt-14 grid gap-px border border-[#b8c9bd] bg-[#b8c9bd] md:grid-cols-3">
          {insightTopics.map((topic, index) => (
            <Reveal as="article" key={topic.title} order={index} className="bg-[#f2f0e8] p-8">
              <p className="eyebrow text-[#24626b]">{topic.kicker}</p>
              <h3 className="font-display mt-6 text-2xl leading-tight">{topic.title}</h3>
              <p className="mt-4 text-sm leading-7 text-[#3d5a5f]">{topic.body}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <FaqAccordion />
      <CtaBand body="If a question here is not answered, it is probably specific to your reporting cycle — which is exactly the conversation worth having." />
    </>
  );
}
