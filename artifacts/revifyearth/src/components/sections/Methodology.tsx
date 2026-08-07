import { Check, ChevronDown, X } from 'lucide-react';
import { useState } from 'react';

import { exclusions, inclusions, milestones, phases, timelineNote } from '@/data/methodology';
import { SectionLabel } from '@/components/site/Primitives';
import { Reveal } from '@/components/site/Reveal';

const ownerTone: Record<string, string> = {
  Revify: 'border-[#a8c95a] text-[#24626b]',
  Client: 'border-[#8ba59a] text-[#3d5a5f]',
  Both: 'border-[#24626b] text-[#142b32]',
};

/**
 * The five delivery phases.
 *
 * Replaces a flat list of eight steps whose detail panel printed the same generated
 * sentence for every one of them. Each phase now carries its own steps, ownership
 * and a real explanation of what happens in it.
 */
export function MethodologyTimeline() {
  const [active, setActive] = useState(0);

  return (
    <section className="mx-auto max-w-[1440px] px-5 py-16 sm:py-20 md:px-10 md:py-32">
      <div className="grid gap-12 md:grid-cols-[.7fr_1.3fr]">
        <div>
          <SectionLabel>The sequence</SectionLabel>
          <h2 className="font-display text-4xl leading-[.98] text-[#24626b] md:text-6xl">
            Five phases.
            <br />
            <em>One thread.</em>
          </h2>
          <p className="mt-8 max-w-sm text-sm leading-7 text-[#3d5a5f]">{timelineNote}</p>

          <div className="mt-10 border-t border-[#b8c9bd] pt-6">
            <p className="eyebrow text-[#24626b]">Milestones</p>
            <ul className="mt-4 space-y-2.5">
              {milestones.map((milestone) => (
                <li key={milestone.key} className="flex items-center gap-3 text-xs text-[#3d5a5f]">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-[#a8c95a] font-mono-custom text-xs text-[#24626b] lg:text-[10px]">
                    {milestone.key}
                  </span>
                  {milestone.title}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div>
          <div className="border-t border-[#b8c9bd]">
            {phases.map((phase, index) => {
              const open = active === index;
              return (
                <div key={phase.index} className="border-b border-[#b8c9bd]">
                  <h3>
                    <button
                      type="button"
                      onClick={() => setActive(open ? -1 : index)}
                      aria-expanded={open}
                      aria-controls={`phase-${phase.index}`}
                      className="focus-ring flex w-full items-center gap-4 rounded-sm py-5 text-left"
                      data-testid={`button-phase-${phase.index}`}
                    >
                      <span className="font-mono-custom text-xs text-[#24626b] lg:text-[10px]">{phase.index}</span>
                      <span className="flex-1 text-sm font-semibold">{phase.title}</span>
                      <span
                        className={`hidden shrink-0 rounded-full border px-3 py-1 font-mono-custom text-[11px] uppercase tracking-widest sm:block lg:text-[10px] ${ownerTone[phase.owner]}`}
                      >
                        {phase.owner}
                      </span>
                      <ChevronDown className={`h-4 w-4 shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} />
                    </button>
                  </h3>
                  {open && (
                    <div id={`phase-${phase.index}`} className="border-l-2 border-[#a8c95a] pb-7 pl-6">
                      <p className="max-w-2xl text-sm leading-7 text-[#3d5a5f]">{phase.detail}</p>
                      <ul className="mt-5 flex flex-wrap gap-2">
                        {phase.steps.map((step) => (
                          <li
                            key={step}
                            className="border border-[#b8c9bd] px-3 py-2 font-mono-custom text-xs text-[#24626b] lg:text-[10px]"
                          >
                            {step}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * Scope boundaries.
 *
 * Publishing what is *not* included is one of the strongest enterprise trust
 * signals available, and it was missing from the site entirely.
 */
export function InclusionsExclusions() {
  return (
    <section className="bg-[#e7dfd0] px-5 py-16 sm:py-20 md:px-10 md:py-32">
      <div className="mx-auto max-w-[1440px]">
        <SectionLabel>Scope, stated plainly</SectionLabel>
        <div className="grid gap-10 md:grid-cols-[.9fr_1.1fr]">
          <h2 className="font-display max-w-md text-4xl leading-[.98] text-[#24626b] md:text-6xl">
            What’s in.
            <br />
            <em>What isn’t.</em>
          </h2>
          <p className="max-w-xl text-sm leading-7 text-[#3d5a5f] md:pt-4">
            Clear boundaries make engagements easier to plan and easier to trust. These are the standard inclusions and
            the dependencies that sit outside a typical scope — surfaced up front rather than discovered mid-project.
          </p>
        </div>

        <div className="mt-14 grid gap-10 lg:grid-cols-2">
          <Reveal className="border-t-2 border-[#a8c95a] pt-7">
            <p className="eyebrow text-[#24626b]">Inclusions</p>
            <ul className="mt-6 space-y-3.5">
              {inclusions.map((item) => (
                <li key={item} className="flex gap-3 text-sm leading-6 text-[#3d5a5f]">
                  <Check className="mt-1 h-4 w-4 shrink-0 text-[#24626b]" aria-hidden="true" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal order={1} className="border-t-2 border-[#bbaf9d] pt-7">
            <p className="eyebrow text-[#24626b]">Exclusions & dependencies</p>
            <ul className="mt-6 space-y-3.5">
              {exclusions.map((item) => (
                <li key={item} className="flex gap-3 text-sm leading-6 text-[#3d5a5f]">
                  <X className="mt-1 h-4 w-4 shrink-0 text-[#8b7b66]" aria-hidden="true" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
