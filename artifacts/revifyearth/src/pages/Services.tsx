import { media } from '@/data/media';
import { services } from '@/data/services';
import { SectionLabel } from '@/components/site/Primitives';
import { PageHero } from '@/components/site/PageHero';
import { ServiceCard } from '@/components/sections/ServiceCard';
import { CtaBand, EcosystemFlow } from '@/components/sections/Bands';
import { InclusionsExclusions } from '@/components/sections/Methodology';

export function Services() {
  return (
    <>
      <PageHero
        eyebrow="ESG reporting services"
        title={
          <>
            Build the
            <br />
            <em>ecosystem.</em>
          </>
        }
        intro="From content review to web, print and video, each service is designed to carry the same strategic intent. Expand any service for its full scope, deliverables and process."
        image={media.volcano}
      />

      <section className="bg-[#dce5d0] px-5 py-14 sm:py-16 md:px-10 md:py-28">
        <div className="mx-auto max-w-[1440px]">
          <SectionLabel as="h2">Seven services</SectionLabel>
          <div className="mt-4 border-t border-[#8ba59a]">
            {services.map((service, index) => (
              <ServiceCard key={service.slug} service={service} defaultOpen={index === 0} />
            ))}
          </div>
        </div>
      </section>

      <EcosystemFlow />
      <InclusionsExclusions />
      <CtaBand body="Engagements are scoped to the brief — start with one workstream or commission the whole ecosystem." />
    </>
  );
}
