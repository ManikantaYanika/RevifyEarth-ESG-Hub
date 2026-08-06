import { media } from '@/data/media';
import { PageHero } from '@/components/site/PageHero';
import { CtaBand } from '@/components/sections/Bands';
import { InclusionsExclusions, MethodologyTimeline } from '@/components/sections/Methodology';

export function Process() {
  return (
    <>
      <PageHero
        eyebrow="A considered process"
        title={
          <>
            From first
            <br />
            <em>evidence</em>
            <br />
            to final frame.
          </>
        }
        intro="A collaborative, practical process that keeps the work moving and the narrative honest — with clear ownership at every phase."
        image={media.forestMist}
        dark
      />

      <MethodologyTimeline />
      <InclusionsExclusions />
      <CtaBand body="Every engagement starts with confirming scope and boundaries. That conversation is free." />
    </>
  );
}
