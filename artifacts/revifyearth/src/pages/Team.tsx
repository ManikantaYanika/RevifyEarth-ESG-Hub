import { designTeam, foundingTeam, teamPositioning, type TeamMember } from '@/data/company';
import { media } from '@/data/media';
import { SectionLabel } from '@/components/site/Primitives';
import { PageHero } from '@/components/site/PageHero';
import { ResponsiveImage } from '@/components/site/ResponsiveImage';
import { Reveal } from '@/components/site/Reveal';
import { CtaBand } from '@/components/sections/Bands';

function MemberGrid({ members, label }: { members: readonly TeamMember[]; label: string }) {
  return (
    <div>
      <SectionLabel as="h2">{label}</SectionLabel>
      <ul className="grid gap-x-5 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
        {members.map((member, index) => (
          <Reveal as="li" key={member.name} order={index % 3} className="group border-t border-[#bbaf9d] pt-5">
            <div className="relative mb-5 flex h-[290px] items-end justify-center overflow-hidden bg-[#c8d0ca]">
              <div className="absolute inset-0 bg-gradient-to-t from-[#24626b]/25 to-transparent" />
              <ResponsiveImage
                asset={member.image}
                alt={member.name}
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="relative h-full w-full object-contain object-bottom transition-transform duration-500 group-hover:scale-[1.04]"
              />
            </div>
            <h3 className="text-lg font-extrabold">{member.name}</h3>
            <p className="mt-1 font-mono-custom text-[10px] uppercase tracking-wider text-[#24626b]">{member.role}</p>
            {member.bio && <p className="mt-3 text-xs leading-6 text-[#3d5a5f]">{member.bio}</p>}
          </Reveal>
        ))}
      </ul>
    </div>
  );
}

export function Team() {
  return (
    <>
      <PageHero
        eyebrow="The people"
        title={
          <>
            A partner at
            <br />
            <em>every level</em>
            <br />
            of the story.
          </>
        }
        intro={teamPositioning}
        image={media.heroBirds}
      />

      <section className="bg-[#e7dfd0] px-5 py-24 md:px-10 md:py-32">
        <div className="mx-auto flex max-w-[1440px] flex-col gap-20">
          <MemberGrid members={foundingTeam} label="Founding team" />
          <MemberGrid members={designTeam} label="Core designing team" />
        </div>
      </section>

      <CtaBand body="The same people who review the disclosure design the report, cut the film and build the page." />
    </>
  );
}
