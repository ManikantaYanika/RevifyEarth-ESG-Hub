import { Instagram, Linkedin, Mail } from 'lucide-react';
import { Link } from 'wouter';

import { company, contacts } from '@/data/company';
import { navGroups } from '@/data/navigation';
import { Logo } from '@/components/site/Primitives';

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
        <div className="grid gap-12 border-b border-white/10 pb-12 lg:grid-cols-[1.1fr_2.4fr]">
          <div>
            <Logo light />
            <p className="mt-5 max-w-xs text-sm leading-7 text-white/65">
              {company.legalName} — {company.discipline}.
            </p>
            <a
              href={`mailto:${company.email}`}
              className="focus-ring mt-6 inline-flex items-center gap-2 rounded-sm text-sm text-white/80 hover:text-[#a8c95a]"
            >
              <Mail className="h-4 w-4" /> {company.email}
            </a>
            <div className="mt-6 space-y-2">
              {contacts.map((contact) => (
                <p key={contact.name} className="text-xs leading-6 text-white/60">
                  <span className="font-semibold text-white/80">{contact.name}</span> — {contact.role}
                  <br />
                  <a href={`tel:${contact.phone}`} className="focus-ring rounded-sm hover:text-[#a8c95a]">
                    {contact.phone}
                  </a>
                </p>
              ))}
            </div>
          </div>

          <nav aria-label="Footer" className="grid gap-8 sm:grid-cols-2 xl:grid-cols-5">
            {navGroups.map((group) => (
              <div key={group.label}>
                <p className="eyebrow text-[#a8c95a]">{group.label}</p>
                <ul className="mt-4 space-y-2.5">
                  {group.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="focus-ring rounded-sm text-xs leading-6 text-white/60 transition-colors hover:text-[#f2f0e8]"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        <div className="flex flex-col gap-5 pt-7 md:flex-row md:items-center md:justify-between">
          <p className="font-mono-custom text-[11px] text-white/60">{company.copyright}</p>
          <div className="flex items-center gap-5">
            <span className="font-mono-custom text-[11px] text-white/45">
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
