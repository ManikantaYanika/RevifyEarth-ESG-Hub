import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ArrowUpRight, Check, Minus, Plus } from 'lucide-react';
import { useId, useState } from 'react';
import { Link } from 'wouter';

import { serviceBySlug, type Service } from '@/data/services';
import { ActionButton } from '@/components/site/Primitives';

function Column({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="eyebrow text-[#24626b]">{title}</p>
      <div className="mt-4">{children}</div>
    </div>
  );
}

function Bullets({ items, check = false }: { items: readonly string[]; check?: boolean }) {
  return (
    <ul className="space-y-2.5">
      {items.map((item) => (
        <li key={item} className="flex gap-3 text-xs leading-6 text-[#3d5a5f]">
          {check ? (
            <Check className="mt-1 h-3.5 w-3.5 shrink-0 text-[#24626b]" aria-hidden="true" />
          ) : (
            <span className="mt-2.5 h-1 w-1 shrink-0 rounded-full bg-[#a8c95a]" aria-hidden="true" />
          )}
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

/**
 * Expandable service card.
 *
 * Collapsed it shows index, title and summary. Expanded it reveals the full
 * proposal deep-dive — overview, business value, deliverables, process stages,
 * benefits, timeline, ideal clients, FAQs and related services. Driven by a real
 * button with `aria-expanded`/`aria-controls` so it works from the keyboard.
 */
export function ServiceCard({ service, defaultOpen = false }: { service: Service; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  const reduceMotion = useReducedMotion();
  const panelId = useId();

  return (
    <article className="border-b border-[#8ba59a] bg-transparent">
      <h3>
        <button
          type="button"
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          aria-controls={panelId}
          className="focus-ring group flex w-full items-start justify-between gap-6 rounded-sm py-8 text-left md:py-10"
          data-testid={`button-service-${service.slug}`}
        >
          <span className="flex flex-1 flex-col gap-3 md:flex-row md:gap-10">
            <span className="font-mono-custom text-xs text-[#24626b] md:pt-2">{service.index}</span>
            <span className="flex-1">
              <span className="font-display block text-2xl leading-tight tracking-[-.02em] md:text-4xl">
                {service.title}
              </span>
              <span className="mt-3 block max-w-2xl text-sm leading-7 text-[#3d5a5f]">{service.summary}</span>
              {service.complementary && (
                <span className="mt-3 inline-block border border-[#a8c95a] px-2.5 py-1 font-mono-custom text-xs uppercase tracking-widest text-[#24626b] lg:text-[10px]">
                  Complementary
                </span>
              )}
            </span>
          </span>
          <span className="mt-1 shrink-0 rounded-full border border-[#8ba59a] p-2 text-[#24626b] transition-colors group-hover:border-[#24626b]">
            {open ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
          </span>
        </button>
      </h3>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={panelId}
            initial={reduceMotion ? false : { height: 0, opacity: 0 }}
            animate={reduceMotion ? {} : { height: 'auto', opacity: 1 }}
            exit={reduceMotion ? {} : { height: 0, opacity: 0 }}
            transition={{ duration: 0.45, ease: [0.2, 0.8, 0.2, 1] }}
            className="overflow-hidden"
          >
            <div className="border-t border-[#c3d2c4] pb-12 pt-9">
              <p className="font-display max-w-3xl text-xl leading-snug text-[#24626b] md:text-2xl">
                {service.tagline}
              </p>

              <div className="mt-9 grid gap-10 lg:grid-cols-3">
                <Column title="Overview">
                  <div className="space-y-4">
                    {service.overview.map((paragraph) => (
                      <p key={paragraph} className="text-xs leading-6 text-[#3d5a5f]">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </Column>
                <Column title="Business value">
                  <Bullets items={service.businessValue} />
                </Column>
                <Column title="Deliverables">
                  <Bullets items={service.deliverables} check />
                </Column>
              </div>

              <div className="mt-12">
                <p className="eyebrow text-[#24626b]">Process</p>
                <ol className="mt-5 grid gap-px border border-[#c3d2c4] bg-[#c3d2c4] md:grid-cols-2 xl:grid-cols-3">
                  {service.stages.map((stage) => (
                    <li key={stage.index} className="bg-[#eef1e6] p-6">
                      <span className="font-mono-custom text-xs text-[#24626b] lg:text-[10px]">{stage.index}</span>
                      <p className="mt-3 text-sm font-bold">{stage.title}</p>
                      <ul className="mt-3 space-y-2">
                        {stage.points.map((point) => (
                          <li key={point} className="flex gap-2.5 text-xs leading-6 text-[#3d5a5f]">
                            <span className="mt-2.5 h-1 w-1 shrink-0 rounded-full bg-[#a8c95a]" aria-hidden="true" />
                            <span>{point}</span>
                          </li>
                        ))}
                      </ul>
                    </li>
                  ))}
                </ol>
              </div>

              <div className="mt-12 grid gap-10 lg:grid-cols-3">
                <Column title="Benefits">
                  <Bullets items={service.benefits} check />
                </Column>
                <Column title="Timeline">
                  <p className="text-xs leading-6 text-[#3d5a5f]">{service.timeline}</p>
                  <p className="eyebrow mt-7 text-[#24626b]">Ideal clients</p>
                  <p className="mt-4 text-xs leading-6 text-[#3d5a5f]">{service.idealClients}</p>
                </Column>
                <Column title="Questions">
                  <dl className="space-y-5">
                    {service.faqs.map((faq) => (
                      <div key={faq.question}>
                        <dt className="text-xs font-bold">{faq.question}</dt>
                        <dd className="mt-2 text-xs leading-6 text-[#3d5a5f]">{faq.answer}</dd>
                      </div>
                    ))}
                  </dl>
                </Column>
              </div>

              {service.related.length > 0 && (
                <div className="mt-12 border-t border-[#c3d2c4] pt-7">
                  <p className="eyebrow text-[#24626b]">Related services</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {service.related.map((slug) => {
                      const related = serviceBySlug(slug);
                      if (!related) return null;
                      return (
                        <Link
                          key={slug}
                          href={`/services/${slug}`}
                          className="focus-ring inline-flex min-h-11 items-center gap-2 rounded-full border border-[#8ba59a] px-4 py-2 text-[11px] font-bold uppercase tracking-widest text-[#24626b] lg:text-[10px] transition-colors hover:border-[#24626b] hover:bg-[#24626b] hover:text-[#f2f0e8]"
                        >
                          {related.shortTitle}
                          <ArrowUpRight className="h-3 w-3" />
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="mt-10 flex flex-wrap gap-3">
                <ActionButton href="/contact" variant="dark" icon={<ArrowUpRight className="h-3.5 w-3.5" />}>
                  Book a consultation
                </ActionButton>
                <ActionButton href={`/services/${service.slug}`} variant="outline">
                  Read the full service
                </ActionButton>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </article>
  );
}
