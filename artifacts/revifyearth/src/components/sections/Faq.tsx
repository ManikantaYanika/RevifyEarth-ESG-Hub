import { ChevronDown, FileClock } from 'lucide-react';
import { useState } from 'react';

import { faqs, pendingContent, type PendingSection } from '@/data/resources';
import { SectionLabel } from '@/components/site/Primitives';
import { Reveal } from '@/components/site/Reveal';

export function FaqAccordion() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faqs" className="scroll-mt-24 px-5 py-24 md:px-10 md:py-32">
      <div className="mx-auto max-w-[1440px]">
        <div className="grid gap-12 md:grid-cols-[.7fr_1.3fr]">
          <div>
            <SectionLabel>Frequently asked</SectionLabel>
            <h2 className="font-display text-4xl leading-[.98] text-[#24626b] md:text-6xl">
              The questions
              <br />
              <em>that matter.</em>
            </h2>
          </div>

          <dl className="border-t border-[#b8c9bd]">
            {faqs.map((faq, index) => {
              const isOpen = open === index;
              return (
                <div key={faq.question} className="border-b border-[#b8c9bd]">
                  <dt>
                    <button
                      type="button"
                      onClick={() => setOpen(isOpen ? null : index)}
                      aria-expanded={isOpen}
                      aria-controls={`faq-${index}`}
                      className="focus-ring flex w-full items-start justify-between gap-6 rounded-sm py-6 text-left"
                      data-testid={`button-faq-${index}`}
                    >
                      <span className="max-w-2xl text-base font-semibold">{faq.question}</span>
                      <ChevronDown
                        className={`mt-1 h-4 w-4 shrink-0 text-[#24626b] transition-transform ${isOpen ? 'rotate-180' : ''}`}
                      />
                    </button>
                  </dt>
                  {isOpen && (
                    <dd id={`faq-${index}`} className="max-w-2xl border-l-2 border-[#a8c95a] pb-7 pl-5 text-sm leading-7 text-[#3d5a5f]">
                      {faq.answer}
                    </dd>
                  )}
                </div>
              );
            })}
          </dl>
        </div>
      </div>
    </section>
  );
}

function PendingCard({ section, order }: { section: PendingSection; order: number }) {
  return (
    <Reveal order={order} className="border border-dashed border-[#8ba59a] bg-[#eef1e6]/60 p-7">
      <div className="flex items-center gap-3">
        <FileClock className="h-4 w-4 text-[#24626b]" aria-hidden="true" />
        <span className="font-mono-custom text-[10px] uppercase tracking-widest text-[#24626b]">
          Awaiting verified content
        </span>
      </div>
      <h3 className="font-display mt-6 text-2xl leading-tight text-[#24626b]">{section.title}</h3>
      <p className="mt-3 text-xs leading-6 text-[#3d5a5f]">{section.intro}</p>
      <p className="eyebrow mt-6 text-[#24626b]">Needed to publish</p>
      <ul className="mt-3 space-y-2">
        {section.needed.map((item) => (
          <li key={item} className="flex gap-2.5 text-xs leading-6 text-[#3d5a5f]">
            <span className="mt-2.5 h-1 w-1 shrink-0 rounded-full bg-[#8ba59a]" aria-hidden="true" />
            {item}
          </li>
        ))}
      </ul>
    </Reveal>
  );
}

/**
 * Trust sections held open for real material.
 *
 * The source proposal contains no testimonials, awards, partners or published
 * metrics. These render the finished layout with an explicit "awaiting verified
 * content" state rather than fabricated claims about a real company — swap the data
 * in `resources.ts` and the sections fill themselves.
 */
export function PendingTrustSections() {
  return (
    <section className="bg-[#dce5d0] px-5 py-24 md:px-10 md:py-32">
      <div className="mx-auto max-w-[1440px]">
        <SectionLabel>Proof & recognition</SectionLabel>
        <div className="grid gap-10 md:grid-cols-[.9fr_1.1fr]">
          <h2 className="font-display max-w-md text-4xl leading-[.98] text-[#24626b] md:text-6xl">
            Earned,
            <br />
            <em>not claimed.</em>
          </h2>
          <p className="max-w-xl text-sm leading-7 text-[#3d5a5f] md:pt-4">
            These sections are built and ready. They stay empty until the underlying material is verified and cleared
            for publication — we would rather show an honest gap than an invented credential.
          </p>
        </div>
        <div className="mt-14 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {pendingContent.map((section, index) => (
            <PendingCard key={section.id} section={section} order={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
