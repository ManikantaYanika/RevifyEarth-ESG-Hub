import { ChevronDown, Instagram, Linkedin, Mail } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'wouter';

import { company, contacts } from '@/data/company';
import { navGroups, type NavGroup } from '@/data/navigation';
import { Logo } from '@/components/site/Primitives';
import { useMediaQuery } from '@/hooks/use-media-query';

/**
 * One footer column.
 *
 * Below `lg` it is a disclosure, not a column. Thirty destinations at a comfortable
 * 44px row is roughly 1,400px of footer to scroll past on a phone; collapsed, the
 * five group headings fit in one screen and the visitor opens only the one they
 * want. From `lg` the panel is always open and the disclosure button becomes a
 * plain heading, which is the layout the footer was designed as.
 */
function FooterGroup({ group }: { group: NavGroup }) {
  const [open, setOpen] = useState(false);
  // From `lg` the panel is a permanently open column, so its links must stay in the
  // tab order regardless of the disclosure state the mobile layout tracks.
  const isColumn = useMediaQuery('(min-width: 1024px)');
  const expanded = open || isColumn;
  const panelId = `footer-group-${group.label.toLowerCase()}`;

  return (
    <div className="border-b border-white/10 lg:border-0">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-expanded={expanded}
        aria-controls={panelId}
        className="focus-ring flex min-h-13 w-full items-center justify-between gap-3 rounded-sm text-left lg:pointer-events-none lg:min-h-0"
        data-testid={`button-footer-group-${group.label.toLowerCase()}`}
      >
        <span className="eyebrow text-[#a8c95a]">{group.label}</span>
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-[#a8c95a] transition-transform duration-300 lg:hidden ${
            open ? 'rotate-180' : ''
          }`}
          aria-hidden="true"
        />
      </button>

      <div
        id={panelId}
        className={`grid transition-[grid-template-rows] duration-300 ease-out ${
          expanded ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
        }`}
      >
        <div className="overflow-hidden">
          <ul className="pb-2 lg:mt-4 lg:space-y-2.5 lg:pb-0">
            {group.links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  tabIndex={expanded ? undefined : -1}
                  className="focus-ring flex min-h-11 items-center rounded-sm text-[13px] leading-6 text-white/60 transition-colors hover:text-[#f2f0e8] lg:min-h-0 lg:text-xs"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

/**
 * Full site footer.
 *
 * The previous footer carried a logo, one sentence and two social icons pointing at
 * linkedin.com and instagram.com — network homepages, not company profiles. Those
 * are omitted until real profile URLs exist rather than shipped as dead links.
 */
export function Footer() {
  return (
    <footer className="bg-[#10252b] px-5 pb-10 pt-16 text-[#eef1e9] md:px-10 md:pt-20">
      <div className="mx-auto max-w-[1440px]">
        <div className="grid gap-8 border-b border-white/10 pb-8 lg:grid-cols-[1.1fr_2.4fr] lg:gap-12 lg:pb-12">
          <div>
            <Logo light />
            <p className="mt-5 max-w-xs text-sm leading-7 text-white/65">
              {company.legalName} — {company.discipline}.
            </p>
            <a
              href={`mailto:${company.email}`}
              className="focus-ring mt-6 inline-flex min-h-11 items-center gap-2 rounded-sm text-sm text-white/80 hover:text-[#a8c95a]"
            >
              <Mail className="h-4 w-4" /> {company.email}
            </a>
            <div className="mt-6 space-y-3">
              {contacts.map((contact) => (
                <div key={contact.name} className="text-[13px] leading-6 text-white/60 lg:text-xs">
                  <p>
                    <span className="font-semibold text-white/80">{contact.name}</span> — {contact.role}
                  </p>
                  {/* `inline-flex min-h-11` rather than a bare inline link: a phone
                      number is the most likely thing to be tapped on a phone, and as
                      inline text it was a 17px target. */}
                  <a
                    href={`tel:${contact.phone}`}
                    className="focus-ring inline-flex min-h-11 items-center rounded-sm transition-colors hover:text-[#a8c95a] lg:min-h-0"
                  >
                    {contact.phone}
                  </a>
                </div>
              ))}
            </div>
          </div>

          <nav aria-label="Footer" className="grid gap-0 lg:grid-cols-5 lg:gap-8">
            {navGroups.map((group) => (
              <FooterGroup key={group.label} group={group} />
            ))}
          </nav>
        </div>

        <div className="flex flex-col gap-5 pt-7 md:flex-row md:items-center md:justify-between">
          <p className="font-mono-custom text-xs lg:text-[11px] text-white/60">{company.copyright}</p>
          <div className="flex items-center gap-5">
            <span className="font-mono-custom text-xs lg:text-[11px] text-white/45">
              {/* Social profiles pending verified URLs */}
            </span>
            <Linkedin className="h-4 w-4 text-white/25" aria-hidden="true" />
            <Instagram className="h-4 w-4 text-white/25" aria-hidden="true" />
          </div>
        </div>
      </div>
    </footer>
  );
}
