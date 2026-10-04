import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { Link } from 'wouter';

import { frameworks, valueAdds } from '@/data/company';
import { ecosystemPillars } from '@/data/services';
import { ActionButton, ArrowLink, SectionLabel } from '@/components/site/Primitives';
import { Counter } from '@/components/site/Counter';
import { Reveal } from '@/components/site/Reveal';
import { TextReveal } from '@/components/animation/TextReveal';

/** Closing call to action. Two routes out: talk to us, or keep reading. */
export function CtaBand({
  title = (
    <>
      Your story
      <br />
      <em>deserves</em>
      <br />a system.
    </>
  ),
  body,
}: {
  title?: React.ReactNode;
  body?: string;
}) {
  return (
    <section className="bg-[#a8c95a] px-5 py-14 sm:py-16 text-[#142b32] md:px-10 md:py-28">
      {/* Side-by-side from `lg`, not `md`. At 768 the headline and the button pair
          were sharing one row, leaving the buttons less width than their own labels
          and pushing the page 3px sideways. */}
      <div className="mx-auto flex max-w-[1440px] flex-col justify-between gap-9 lg:flex-row lg:items-end">
        <div>
          <TextReveal className="font-display max-w-3xl text-5xl leading-[.94] md:text-7xl">{title}</TextReveal>
          {body && <p className="mt-6 max-w-md text-sm leading-7 text-[#142b32]/80">{body}</p>}
        </div>
        <div className="flex shrink-0 flex-wrap gap-3">
          <ActionButton href="/contact" variant="dark" icon={<ArrowUpRight className="h-3.5 w-3.5" />} testId="link-cta-consultation">
            Book a consultation
          </ActionButton>
          <ActionButton href="/services" variant="outline" testId="link-cta-services">
            Explore services
          </ActionButton>
        </div>
      </div>
    </section>
  );
}

/**
 * Engagement facts.
 *
 * Every figure is a scope commitment from the proposal — theme directions, video
 * duration, social cutdowns, GSM range. None of them are performance claims about
 * past work, which the source material does not support.
 */
export function StatsBand() {
  const stats = [
    { value: 5, suffix: '', label: 'creative theme directions', note: 'presented for every report' },
    { value: 7, suffix: '', label: 'connected workstreams', note: 'under one engagement model' },
    { value: 3, suffix: '', label: 'reporting frameworks', note: 'GRI, BRSR and the UN SDGs' },
    { value: 6, suffix: ' wks', label: 'assumed for data collection', note: 'the one dependency that moves the plan' },
  ];

  return (
    <section className="bg-gradient-deep px-5 py-14 sm:py-16 text-[#f2f0e8] md:px-10 md:py-24">
      <div className="mx-auto max-w-[1440px]">
        <SectionLabel light>What an engagement commits to</SectionLabel>
        <dl className="grid gap-px border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            // A <dl> group must be dt then dd, with nothing else inside: the term comes
            // first in the markup and `order-first` keeps the figure on top visually.
            <Reveal key={stat.label} order={index} className="fx-card fx-card-tile flex flex-col bg-[#142b32] p-8">
              <dt className="mt-5 text-sm font-bold">{stat.label}</dt>
              <dd className="order-first font-display text-6xl leading-none tracking-[-.04em] text-[#a8c95a] md:text-7xl">
                <Counter to={stat.value} suffix={stat.suffix} />
              </dd>
              <dd className="mt-2 text-xs leading-6 text-white/70">{stat.note}</dd>
            </Reveal>
          ))}
        </dl>
      </div>
    </section>
  );
}

/**
 * GRI / BRSR / UN SDGs — the credibility signal the site was missing entirely.
 * `link` adds an onward route under the intro; omitted where the strip would point
 * at the page it is already on.
 */
export function FrameworkStrip({
  light = false,
  link,
}: {
  light?: boolean;
  link?: { href: string; label: string };
}) {
  return (
    <section
      id="frameworks"
      className={`scroll-mt-24 px-5 py-14 sm:py-16 md:px-10 md:py-28 ${light ? 'bg-[#142b32] text-[#f2f0e8]' : 'bg-[#e5ebdf] text-[#142b32]'}`}
    >
      <div className="mx-auto max-w-[1440px]">
        <div className="grid gap-10 md:grid-cols-[.8fr_1.2fr]">
          <div>
            <SectionLabel light={light}>Frameworks we work across</SectionLabel>
            <TextReveal className="font-display text-4xl leading-[.98] md:text-6xl">
              Referenced
              <br />
              <em>with intent.</em>
            </TextReveal>
          </div>
          <div className="max-w-xl md:pt-12">
            <p className={`text-sm leading-7 ${light ? 'text-white/75' : 'text-[#3d5a5f]'}`}>
              Framework references only build trust when they are accurate, relevant and integrated into the narrative —
              not appended as a standalone compliance exercise. Every draft is mapped, cross-referenced and checked.
            </p>
            {link && (
              <div className="mt-8">
                <ArrowLink href={link.href} light={light}>
                  {link.label}
                </ArrowLink>
              </div>
            )}
          </div>
        </div>

        <div className={`mt-14 grid gap-px ${light ? 'bg-white/10' : 'bg-[#b8c9bd]'} sm:grid-cols-3`}>
          {frameworks.map((framework, index) => (
            <Reveal
              key={framework.code}
              order={index}
              className={`fx-card fx-card-tile p-8 ${light ? 'bg-[#142b32]' : 'bg-[#e5ebdf]'}`}
            >
              <p className="font-display text-4xl tracking-[-.03em] text-[#24626b] md:text-5xl">
                <span className={light ? 'text-[#a8c95a]' : ''}>{framework.code}</span>
              </p>
              <p className={`mt-4 text-sm font-bold ${light ? 'text-[#f2f0e8]' : ''}`}>{framework.name}</p>
              <p className={`mt-3 text-xs leading-6 ${light ? 'text-white/70' : 'text-[#3d5a5f]'}`}>{framework.body}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/** "One story. Multiple stakeholder touchpoints." — the five-pillar ecosystem. */
export function EcosystemFlow() {
  return (
    <section className="bg-[#dce5d0] px-5 py-16 sm:py-20 md:px-10 md:py-32">
      <div className="mx-auto max-w-[1440px]">
        <SectionLabel>The ecosystem</SectionLabel>
        <div className="grid gap-10 md:grid-cols-[.9fr_1.1fr]">
          <TextReveal className="font-display max-w-md text-5xl leading-[.98] md:text-7xl">
            One story.
            <br />
            <em>Multiple</em>
            <br />
            touchpoints.
          </TextReveal>
          <div className="max-w-xl md:pt-6">
            <p className="text-sm leading-7 text-[#3d5a5f]">
              Rather than creating independent deliverables, we build an ecosystem where every output reinforces a
              single sustainability narrative — moving from print to video to web, serving different channels and
              different stakeholders without losing the thread.
            </p>
            <div className="mt-8">
              <ArrowLink href="/sustainability-branding">See how it connects</ArrowLink>
            </div>
          </div>
        </div>

        <ol className="mt-16 grid gap-px bg-[#8ba59a] md:grid-cols-3 lg:grid-cols-5">
          {ecosystemPillars.map((pillar, index) => (
            <Reveal as="li" key={pillar.index} order={index} className="fx-card fx-card-tile group relative bg-[#dce5d0] p-7">
              <Link href={`/services/${pillar.slug}`} className="focus-ring block rounded-sm">
                <span className="flex items-center justify-between">
                  <span className="font-mono-custom text-xs text-[#24626b]">{pillar.index}</span>
                  {index < ecosystemPillars.length - 1 && (
                    <ArrowRight className="hidden h-4 w-4 text-[#8ba59a] lg:block" aria-hidden="true" />
                  )}
                </span>
                <span className="mt-10 block font-display text-2xl leading-tight">{pillar.title}</span>
                <span className="mt-3 block text-xs uppercase tracking-[.14em] text-[#24626b]">{pillar.headline}</span>
              </Link>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}

/** "Why Revify" — the six value-adds from the proposal. */
export function WhyRevify() {
  return (
    <section className="bg-gradient-teal px-5 py-16 sm:py-20 text-[#f2f0e8] md:px-10 md:py-32">
      <div className="mx-auto max-w-[1440px]">
        <SectionLabel light>Why RevifyEarth</SectionLabel>
        <div className="grid gap-10 md:grid-cols-[.9fr_1.1fr]">
          <TextReveal className="font-display max-w-md text-5xl leading-[.98] md:text-7xl">
            Domain depth
            <br />
            <em>and creative</em>
            <br />
            execution.
          </TextReveal>
          <p className="max-w-xl text-sm leading-7 text-white/80 md:pt-6">
            We approach sustainability reporting as a strategic communication exercise that builds stakeholder
            confidence and strengthens corporate reputation — not as a design assignment handed over at the end.
          </p>
        </div>

        <div className="mt-16 grid gap-px bg-white/15 sm:grid-cols-2 lg:grid-cols-3">
          {valueAdds.map((value, index) => (
            <Reveal key={value.index} order={index % 3} className="fx-card fx-card-tile bg-[#24626b] p-8">
              <span className="font-mono-custom text-xs text-[#a8c95a] lg:text-[10px]">{value.index}</span>
              <h3 className="mt-6 text-lg font-bold leading-snug">{value.title}</h3>
              <p className="mt-3 text-xs leading-6 text-white/80">{value.body}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
