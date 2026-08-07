import { useState } from 'react';

import { media } from '@/data/media';
import { QuoteBand, SectionLabel } from '@/components/site/Primitives';
import { PageHero } from '@/components/site/PageHero';
import { Reveal } from '@/components/site/Reveal';
import { CtaBand, EcosystemFlow } from '@/components/sections/Bands';

interface Format {
  readonly key: string;
  readonly headline: string;
  readonly body: string;
  readonly points: readonly string[];
}

const formats: readonly Format[] = [
  {
    key: 'Report',
    headline: 'The editorial spine',
    body: 'An editorial report that makes disclosure legible, authoritative and worth spending time with. Everything else in the ecosystem inherits its theme, typography and data language.',
    points: [
      'Five creative theme directions',
      'Cover and chapter-opening concepts',
      'Custom infographics, charts and timelines',
      'Interactive PDF where technically appropriate',
    ],
  },
  {
    key: 'Print',
    headline: 'The physical object',
    body: 'Considered stock, proofing and production choices for a report that feels as responsible as its content — the version that ends up on the boardroom table.',
    points: [
      'FSC-certified and/or recycled stock',
      '75–130 GSM matched to page count',
      'Premium cover stock and finishing',
      'Print proof review before the run',
    ],
  },
  {
    key: 'Board',
    headline: 'The executive cut',
    body: 'The reporting year distilled into a decision-maker format, built in the approved report identity so leadership sees one consistent story.',
    points: [
      'Reporting-year highlights',
      'Key ESG performance indicators',
      'Progress against commitments',
      'Strategic forward-looking priorities',
    ],
  },
  {
    key: 'Video',
    headline: 'The narrative in motion',
    body: 'A 5–7 minute visual narrative with script, storyboard, motion graphics and animated KPIs — for the audiences who will never open the document.',
    points: [
      'Concept, script and storyboard',
      'Animated ESG KPIs',
      'Full HD 1080p output',
      'Two 30-second social cutdowns',
    ],
  },
  {
    key: 'Web',
    headline: 'The permanent gateway',
    body: 'A responsive digital home for sustainability overview, thematic content, film and downloadable access — discoverable long after launch week.',
    points: [
      'Interactive report overview',
      'ESG performance dashboard',
      'Embedded sustainability video',
      'Mobile-responsive report access',
    ],
  },
];

export function Branding() {
  const [active, setActive] = useState(formats[0].key);
  const current = formats.find((format) => format.key === active) ?? formats[0];

  return (
    <>
      <PageHero
        eyebrow="Sustainability branding"
        title={
          <>
            One identity.
            <br />
            <em>Many formats.</em>
          </>
        }
        intro="A sustainability report can become a platform for a year of communication — not a document that disappears after publication."
        image={media.mountainSunset}
      />

      <section className="mx-auto max-w-[1440px] px-5 py-16 sm:py-20 md:px-10 md:py-32">
        <SectionLabel>The connected system</SectionLabel>

        <div role="tablist" aria-label="Communication formats" className="flex flex-wrap gap-2 border-b border-[#b8c9bd] pb-5">
          {formats.map((format) => {
            const selected = active === format.key;
            return (
              <button
                key={format.key}
                type="button"
                role="tab"
                id={`tab-${format.key}`}
                aria-selected={selected}
                aria-controls={`panel-${format.key}`}
                onClick={() => setActive(format.key)}
                className={`focus-ring min-h-11 rounded-full border px-5 py-3 text-[11px] font-bold uppercase tracking-widest lg:text-[10px] transition-colors ${
                  selected
                    ? 'border-[#142b32] bg-[#142b32] text-[#f2f0e8]'
                    : 'border-[#b8c9bd] text-[#24626b] hover:border-[#24626b]'
                }`}
                data-testid={`button-format-${format.key.toLowerCase()}`}
              >
                {format.key}
              </button>
            );
          })}
        </div>

        <div
          role="tabpanel"
          id={`panel-${current.key}`}
          aria-labelledby={`tab-${current.key}`}
          className="grid gap-12 py-14 md:grid-cols-[.7fr_1.3fr]"
        >
          <h2 className="font-display text-5xl leading-none text-[#24626b] md:text-7xl">
            {current.key}
            <br />
            <em>with intent.</em>
          </h2>
          <div className="max-w-xl">
            <p className="text-2xl font-medium leading-[1.3]">{current.headline}</p>
            <p className="mt-6 text-sm leading-7 text-[#3d5a5f]">{current.body}</p>
            <ul className="mt-8 grid gap-px border border-[#b8c9bd] bg-[#b8c9bd] sm:grid-cols-2">
              {current.points.map((point) => (
                <li key={point} className="bg-[#f2f0e8] p-4 text-xs leading-6 text-[#3d5a5f]">
                  {point}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <Reveal className="mt-6 max-w-3xl border-l-2 border-[#a8c95a] pl-6">
          <p className="text-sm leading-7 text-[#3d5a5f]">
            Every format carries the same narrative architecture, visual language and strategic priorities. That is what
            makes the ecosystem hold together rather than reading as five separate projects.
          </p>
        </Reveal>
      </section>

      <EcosystemFlow />
      <QuoteBand>The same story, wherever it lands.</QuoteBand>
      <CtaBand />
    </>
  );
}
