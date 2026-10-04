import { insightTopics } from '@/data/resources';
import { media } from '@/data/media';
import { topicClusters } from '@/data/topics';
import { ArrowLink, SectionLabel } from '@/components/site/Primitives';
import { PageHero } from '@/components/site/PageHero';
import { Reveal } from '@/components/site/Reveal';
import { CtaBand, FrameworkStrip } from '@/components/sections/Bands';
import { FaqAccordion } from '@/components/sections/Faq';

export function Resources() {
  return (
    <>
      <PageHero
        eyebrow="ESG reporting resources"
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
              <div className="mt-6">
                <ArrowLink href={topic.link.href}>{topic.link.label}</ArrowLink>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Topic guide: each subject and the one page that owns it (src/data/topics.ts),
          so a visitor — and a crawler — can reach the right depth from the hub. */}
      <section id="topics" className="scroll-mt-24 bg-[#e5ebdf] px-5 py-16 sm:py-20 md:px-10 md:py-32">
        <div className="mx-auto grid max-w-[1440px] gap-12 md:grid-cols-[.7fr_1.3fr]">
          <div>
            <SectionLabel>Browse by topic</SectionLabel>
            <h2 className="font-display text-4xl leading-[.98] text-[#24626b] md:text-6xl">
              Start from
              <br />
              <em>the question.</em>
            </h2>
            <p className="mt-8 max-w-sm text-sm leading-7 text-[#3d5a5f]">
              Each subject is covered in full on one page, with the pages that go deeper alongside it.
            </p>
          </div>

          <ul className="border-t border-[#b8c9bd]">
            {topicClusters.map((cluster) => (
              <li key={cluster.id} className="border-b border-[#b8c9bd] py-7">
                <h3 className="text-base font-semibold">{cluster.name}</h3>
                <p className="mt-2 max-w-2xl text-sm leading-7 text-[#3d5a5f]">{cluster.summary}</p>
                <div className="mt-3 flex flex-wrap gap-x-10">
                  <ArrowLink href={cluster.pillar.href}>{cluster.pillar.label}</ArrowLink>
                  {cluster.supporting.map((link) => (
                    <ArrowLink key={link.href} href={link.href}>
                      {link.label}
                    </ArrowLink>
                  ))}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <FaqAccordion />
      <CtaBand body="If a question here is not answered, it is probably specific to your reporting cycle — which is exactly the conversation worth having." />
    </>
  );
}
