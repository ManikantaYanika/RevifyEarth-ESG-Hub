import { ActionButton } from '@/components/site/Primitives';
import { Atmosphere } from '@/components/site/Primitives';

export function NotFound() {
  return (
    <section className="relative isolate flex min-h-[70vh] items-center overflow-hidden bg-[#142b32] px-5 py-24 text-[#f2f0e8] md:px-10">
      <Atmosphere dark />
      <div className="mx-auto w-full max-w-[1440px]">
        <p className="eyebrow text-[#a8c95a]">404</p>
        <h1 className="font-display mt-6 max-w-3xl text-[clamp(3rem,8vw,7rem)] leading-[.9] tracking-[-.05em]">
          This page
          <br />
          <em>went quiet.</em>
        </h1>
        <p className="mt-8 max-w-md text-sm leading-7 text-white/80">
          The page you are looking for is not available. The services, process and contact routes below are the fastest
          way back into the work.
        </p>
        <div className="mt-10 flex flex-wrap gap-3">
          <ActionButton href="/" variant="accent">
            Back to home
          </ActionButton>
          <ActionButton href="/services" variant="light">
            Explore services
          </ActionButton>
          <ActionButton href="/contact" variant="light">
            Contact us
          </ActionButton>
        </div>
      </div>
    </section>
  );
}
