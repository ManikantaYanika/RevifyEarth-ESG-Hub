import { ArrowUpRight, Play } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'wouter';

import { company } from '@/data/company';
import { industries } from '@/data/industries';
import { media } from '@/data/media';
import { services } from '@/data/services';
import { ActionButton, ArrowLink, Atmosphere, QuoteBand, SectionLabel } from '@/components/site/Primitives';
import { Modal } from '@/components/site/Modal';
import { ResponsiveImage } from '@/components/site/ResponsiveImage';
import { Reveal } from '@/components/site/Reveal';
import { CtaBand, EcosystemFlow, FrameworkStrip, StatsBand, WhyRevify } from '@/components/sections/Bands';
import { PendingTrustSections } from '@/components/sections/Faq';

function VideoApproachModal({ onClose }: { onClose: () => void }) {
  return (
    <Modal onClose={onClose} label="Video report approach">
      <p className="eyebrow">Video report / approach</p>
      <h2 className="font-display mt-6 text-4xl leading-none md:text-5xl">
        Not page-by-page.
        <br />
        <em>A visual narrative.</em>
      </h2>
      <p className="mt-6 max-w-lg text-sm leading-7 text-[#3d5a5f]">
        Narrative and creative concept, script, storyboard, motion graphics, animated ESG KPIs and data visualisations,
        report graphics, provided footage and photos, licensed stock, on-screen text, in-house background music,
        voice-over where included, editing, transitions and final render.
      </p>
      <div className="mt-8 flex flex-wrap gap-2">
        {['5–7 minutes', 'Full HD 1080p', '2 × 30-second social cutdowns', 'Report identity'].map((item) => (
          <span key={item} className="border border-[#b8c9bd] px-3 py-2 font-mono-custom text-[10px]">
            {item}
          </span>
        ))}
      </div>
      <div className="mt-9 flex flex-wrap gap-3">
        <ActionButton href="/services/video-report" variant="dark">
          Explore video reports
        </ActionButton>
        <ActionButton href="/contact" variant="outline">
          Talk to an expert
        </ActionButton>
      </div>
    </Modal>
  );
}

export function Home() {
  const [showVideo, setShowVideo] = useState(false);

  return (
    <>
      {/* Hero */}
      <section className="relative isolate flex min-h-[640px] items-end overflow-hidden bg-[#142b32] text-[#f2f0e8] md:min-h-[850px]">
        <ResponsiveImage
          asset={media.heroBirds}
          alt=""
          priority
          sizes="100vw"
          className="absolute inset-0 -z-20 h-full w-full object-cover opacity-55"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-[#142b32] via-[#142b32]/40 to-transparent" />
        <Atmosphere dark />
        <div className="mx-auto w-full max-w-[1440px] px-5 pb-16 md:px-10 md:pb-24">
          <Reveal>
            <p className="eyebrow mb-7 text-[#d3dfb2]">Sustainability communication / {company.legalName}</p>
          </Reveal>
          <Reveal order={1}>
            <h1 className="font-display max-w-5xl text-[clamp(3rem,9vw,9rem)] leading-[.87] tracking-[-.06em]">
              Make the work
              <br />
              <em>impossible</em>
              <br />
              to overlook.
            </h1>
          </Reveal>
          <Reveal order={2}>
            <div className="mt-10 flex flex-col justify-between gap-8 border-t border-white/25 pt-6 md:flex-row md:items-end">
              <p className="max-w-md text-sm leading-7 text-white/85">{company.positioning}</p>
              <div className="flex flex-wrap gap-3">
                <ActionButton href="/contact" variant="accent" icon={<ArrowUpRight className="h-3.5 w-3.5" />}>
                  Book a consultation
                </ActionButton>
                <ActionButton href="/services" variant="light">
                  Explore solutions
                </ActionButton>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Proposition */}
      <section className="mx-auto grid max-w-[1440px] gap-12 px-5 py-24 md:grid-cols-[.8fr_1.2fr] md:px-10 md:py-36">
        <div>
          <SectionLabel>The proposition</SectionLabel>
          <p className="font-display text-4xl leading-[1.05] tracking-[-.035em] text-[#24626b] md:text-6xl">
            One story.
            <br />
            <em>Many ways</em>
            <br />
            to meet it.
          </p>
        </div>
        <div className="max-w-2xl md:pt-10">
          <Reveal>
            <p className="text-2xl font-medium leading-[1.35] tracking-[-.025em] md:text-4xl">
              From writing a healthcare enterprise’s first sustainability report to building complete ESG branding and
              communication ecosystems.
            </p>
          </Reveal>
          <Reveal order={1}>
            <p className="mt-8 max-w-xl text-sm leading-7 text-[#3d5a5f]">
              RevifyEarth delivers an Integrated Sustainability Branding &amp; Communication Program that extends
              beyond report preparation — bringing sustainability consulting, strategic communication and creative
              excellence together under one engagement model.
            </p>
            <div className="mt-10 flex flex-wrap gap-3">
              <ArrowLink href="/about">Why we exist</ArrowLink>
            </div>
          </Reveal>
        </div>
      </section>

      <EcosystemFlow />

      {/* Services preview */}
      <section className="mx-auto max-w-[1440px] px-5 py-24 md:px-10 md:py-32">
        <SectionLabel>What we do</SectionLabel>
        <div className="grid gap-10 md:grid-cols-[.8fr_1.2fr]">
          <h2 className="font-display max-w-md text-5xl leading-[.98] md:text-7xl">
            Seven
            <br />
            <em>connected</em>
            <br />
            workstreams.
          </h2>
          <div className="max-w-lg md:pt-6">
            <p className="text-sm leading-7 text-[#3d5a5f]">
              Sustainability reporting is a strategic communication exercise — one that builds stakeholder confidence
              and strengthens corporate reputation. Each service below carries the same narrative architecture.
            </p>
            <div className="mt-8">
              <ArrowLink href="/services">Explore all services</ArrowLink>
            </div>
          </div>
        </div>

        <div className="mt-16 grid gap-px border-t border-[#b8c9bd] bg-[#b8c9bd] md:grid-cols-2 lg:grid-cols-3">
          {services.map((service, index) => (
            <Reveal
              as="article"
              key={service.slug}
              order={index % 3}
              className="group bg-[#f2f0e8] p-7 transition-colors hover:bg-[#eef1e6] lg:min-h-[260px]"
            >
              <Link href={`/services/${service.slug}`} className="focus-ring block rounded-sm">
                <span className="flex items-center justify-between">
                  <span className="font-mono-custom text-xs text-[#24626b]">{service.index}</span>
                  <ArrowUpRight className="h-5 w-5 text-[#24626b] transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                </span>
                <h3 className="mt-12 max-w-xs text-lg font-bold leading-snug">{service.title}</h3>
                <p className="mt-4 max-w-sm text-xs leading-6 text-[#3d5a5f]">{service.summary}</p>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      <WhyRevify />
      <FrameworkStrip />
      <StatsBand />

      <QuoteBand>Clarity is a form of leadership.</QuoteBand>

      {/* Industries preview */}
      <section className="mx-auto max-w-[1440px] px-5 py-24 md:px-10 md:py-32">
        <div className="flex flex-wrap items-end justify-between gap-8">
          <div>
            <SectionLabel>Industries we serve</SectionLabel>
            <h2 className="font-display max-w-lg text-5xl leading-[.98] text-[#24626b] md:text-7xl">
              Context makes
              <br />
              <em>the difference.</em>
            </h2>
          </div>
          <ArrowLink href="/industries">See all sectors</ArrowLink>
        </div>
        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {industries.slice(0, 3).map((industry, index) => (
            <Reveal as="article" key={industry.id} order={index} className="group border-t border-[#9db5ab] pt-5">
              <Link href={`/industries#${industry.id}`} className="focus-ring block rounded-sm">
                <span className="relative mb-7 block h-56 overflow-hidden bg-[#24626b]">
                  <ResponsiveImage
                    asset={industry.image}
                    alt=""
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="h-full w-full object-cover opacity-80 transition-transform duration-700 group-hover:scale-105"
                  />
                </span>
                <h3 className="font-display text-2xl text-[#24626b]">{industry.name}</h3>
                <p className="mt-3 text-sm leading-7 text-[#3d5a5f]">{industry.lede}</p>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Video report */}
      <section className="relative isolate overflow-hidden bg-[#142b32] px-5 py-24 text-[#f2f0e8] md:px-10 md:py-32">
        <ResponsiveImage
          asset={media.mountainSunset}
          alt=""
          sizes="100vw"
          className="absolute inset-0 -z-10 h-full w-full object-cover opacity-20"
        />
        <div className="relative mx-auto grid max-w-[1440px] gap-12 md:grid-cols-[1fr_.8fr] md:items-end">
          <div>
            <SectionLabel light>Go beyond the report</SectionLabel>
            <h2 className="font-display max-w-3xl text-5xl leading-[.95] md:text-8xl">
              Give the work
              <br />
              <em>a wider life.</em>
            </h2>
          </div>
          <div>
            <p className="max-w-sm text-sm leading-7 text-white/80">
              A 5–7 minute visual narrative gives the reporting year a different kind of reach — concept, script,
              storyboard, motion graphics and animated ESG KPIs, plus two 30-second cutdowns for social.
            </p>
            <button
              type="button"
              onClick={() => setShowVideo(true)}
              className="focus-ring mt-8 inline-flex items-center gap-3 rounded-full bg-[#a8c95a] px-5 py-3 text-[10px] font-extrabold uppercase tracking-widest text-[#142b32] transition-transform hover:-translate-y-0.5"
              data-testid="button-video-preview"
            >
              <Play className="h-3.5 w-3.5 fill-current" /> Watch the approach
            </button>
          </div>
        </div>
      </section>

      <PendingTrustSections />
      <CtaBand body="Tell us where you are in the reporting cycle and we will tell you what the next useful step looks like." />

      {showVideo && <VideoApproachModal onClose={() => setShowVideo(false)} />}
    </>
  );
}
