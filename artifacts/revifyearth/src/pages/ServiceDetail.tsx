import { ArrowUpRight, Check } from 'lucide-react';
import { Link } from 'wouter';

import { serviceBySlug, type Service } from '@/data/services';
import { serviceContextLinks } from '@/data/topics';
import { ActionButton, ArrowLink, SectionLabel } from '@/components/site/Primitives';
import { PageHero } from '@/components/site/PageHero';
import { Reveal } from '@/components/site/Reveal';
import { CtaBand } from '@/components/sections/Bands';
import { NotFound } from './NotFound';

/**
 * Full page per service — the structure asked for in the brief: hero, overview,
 * benefits, deliverables, workflow, industries, timeline, FAQ, CTA.
 */
export function ServiceDetail({ slug }: { slug: string }) {
  const service = serviceBySlug(slug);
  if (!service) return <NotFound />;
  const context = serviceContextLinks[service.slug];

  return (
    <>
      <PageHero
        eyebrow={`Service ${service.index}`}
        title={<em>{service.shortTitle}</em>}
        intro={service.tagline}
        image={service.image}
        dark
        eyebrowInHeading={false}
      >
        <div className="mt-8 flex flex-wrap gap-3">
          <ActionButton href="/contact" variant="accent" icon={<ArrowUpRight className="h-3.5 w-3.5" />}>
            Book a consultation
          </ActionButton>
          <ActionButton href="/services" variant="light">
            All services
          </ActionButton>
        </div>
      </PageHero>

      {/* Overview + business value */}
      <section className="mx-auto grid max-w-[1440px] gap-12 px-5 py-16 sm:py-20 md:grid-cols-[.8fr_1.2fr] md:px-10 md:py-32">
        <div>
          <SectionLabel>Overview</SectionLabel>
          <h2 className="font-display text-4xl leading-[.98] text-[#24626b] md:text-6xl">
            What this
            <br />
            <em>actually is.</em>
          </h2>
        </div>
        <div className="max-w-2xl">
          {service.overview.map((paragraph, index) => (
            <Reveal key={paragraph} order={index}>
              <p className={`text-lg leading-relaxed ${index > 0 ? 'mt-6' : ''}`}>{paragraph}</p>
            </Reveal>
          ))}
          <Reveal order={2}>
            <div className="mt-10 border-t border-[#b8c9bd] pt-7">
              <p className="eyebrow text-[#24626b]">Business value</p>
              <ul className="mt-5 space-y-3">
                {service.businessValue.map((item) => (
                  <li key={item} className="flex gap-3 text-sm leading-7 text-[#3d5a5f]">
                    <Check className="mt-1.5 h-4 w-4 shrink-0 text-[#24626b]" aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Workflow */}
      <section className="bg-[#24626b] px-5 py-16 sm:py-20 text-[#f2f0e8] md:px-10 md:py-32">
        <div className="mx-auto max-w-[1440px]">
          <SectionLabel light>Workflow</SectionLabel>
          <h2 className="font-display max-w-2xl text-5xl leading-[.98] md:text-7xl">
            How it
            <br />
            <em>runs.</em>
          </h2>
          <ol className="mt-14 grid gap-px bg-white/15 md:grid-cols-2 xl:grid-cols-3">
            {service.stages.map((stage, index) => (
              <Reveal as="li" key={stage.index} order={index % 3} className="bg-[#24626b] p-8">
                <span className="font-mono-custom text-xs text-[#a8c95a] lg:text-[10px]">{stage.index}</span>
                <h3 className="mt-6 text-lg font-bold">{stage.title}</h3>
                <ul className="mt-4 space-y-2.5">
                  {stage.points.map((point) => (
                    <li key={point} className="flex gap-2.5 text-xs leading-6 text-white/80">
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

      {/* Deliverables + timeline */}
      <section className="mx-auto max-w-[1440px] px-5 py-16 sm:py-20 md:px-10 md:py-32">
        <div className="grid gap-12 lg:grid-cols-[1.2fr_.8fr]">
          <div>
            <SectionLabel as="h2">Deliverables</SectionLabel>
            <ul className="grid gap-px border border-[#b8c9bd] bg-[#b8c9bd] sm:grid-cols-2">
              {service.deliverables.map((item) => (
                <li key={item} className="flex gap-3 bg-[#f2f0e8] p-5 text-sm leading-6 text-[#3d5a5f]">
                  <Check className="mt-1 h-4 w-4 shrink-0 text-[#24626b]" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <SectionLabel as="h2">Timeline &amp; fit</SectionLabel>
            <div className="border-l-2 border-[#a8c95a] pl-6">
              <p className="text-sm leading-7 text-[#3d5a5f]">{service.timeline}</p>
              <p className="eyebrow mt-8 text-[#24626b]">Ideal clients</p>
              <p className="mt-3 text-sm leading-7 text-[#3d5a5f]">{service.idealClients}</p>
              <p className="eyebrow mt-8 text-[#24626b]">Benefits</p>
              <ul className="mt-3 space-y-2.5">
                {service.benefits.map((item) => (
                  <li key={item} className="flex gap-2.5 text-xs leading-6 text-[#3d5a5f]">
                    <span className="mt-2.5 h-1 w-1 shrink-0 rounded-full bg-[#a8c95a]" aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
              <div className="mt-8 flex flex-wrap gap-x-10">
                <ArrowLink href="/process">How the engagement runs</ArrowLink>
                {/* Up to the page that owns this service's wider subject (src/data/topics.ts). */}
                {context && <ArrowLink href={context.href}>{context.label}</ArrowLink>}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ + related */}
      <section className="bg-[#e7dfd0] px-5 py-16 sm:py-20 md:px-10 md:py-32">
        <div className="mx-auto grid max-w-[1440px] gap-12 md:grid-cols-[.7fr_1.3fr]">
          <div>
            <SectionLabel>Questions</SectionLabel>
            <h2 className="font-display text-4xl leading-[.98] text-[#24626b] md:text-6xl">
              Before
              <br />
              <em>you ask.</em>
            </h2>
          </div>
          <div>
            <dl className="border-t border-[#bbaf9d]">
              {service.faqs.map((faq) => (
                <div key={faq.question} className="border-b border-[#bbaf9d] py-6">
                  <dt className="text-base font-semibold">{faq.question}</dt>
                  <dd className="mt-3 max-w-2xl text-sm leading-7 text-[#3d5a5f]">{faq.answer}</dd>
                </div>
              ))}
            </dl>

            {service.related.length > 0 && (
              <div className="mt-10">
                <p className="eyebrow text-[#24626b]">Related services</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {service.related.map((relatedSlug) => {
                    const related: Service | undefined = serviceBySlug(relatedSlug);
                    if (!related) return null;
                    return (
                      <Link
                        key={relatedSlug}
                        href={`/services/${relatedSlug}`}
                        // min-h-11: these pills are the primary route between service
                        // pages on a phone, and py-2 left them at 33px.
                        className="focus-ring inline-flex min-h-11 items-center gap-2 rounded-full border border-[#bbaf9d] px-4 py-2 text-[11px] font-bold uppercase tracking-widest text-[#24626b] lg:text-[10px] transition-colors hover:bg-[#24626b] hover:text-[#f2f0e8]"
                      >
                        {related.shortTitle}
                        <ArrowUpRight className="h-3 w-3" />
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      <CtaBand
        title={
          <>
            Start with
            <br />
            <em>{service.shortTitle.toLowerCase()}.</em>
          </>
        }
        body="Tell us where you are in the reporting cycle and we will scope it to the brief."
      />
    </>
  );
}
