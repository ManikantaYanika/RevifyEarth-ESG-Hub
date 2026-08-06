import { ArrowUpRight, ChevronDown } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Link } from 'wouter';

import { navGroups } from '@/data/navigation';
import { company } from '@/data/company';

/**
 * Below `lg` the mega-menu becomes an accordion sheet.
 *
 * Body scroll is locked while it is open and focus is moved into the panel, so the
 * menu behaves like a dialog rather than a long list appended to the page.
 */
export function MobileNav({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [expanded, setExpanded] = useState<string | null>(navGroups[0]?.label ?? null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    panelRef.current?.querySelector<HTMLElement>('button, a')?.focus();
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  if (!open) return null;

  return (
    <div
      id="mobile-nav"
      ref={panelRef}
      className="fixed inset-x-0 bottom-0 top-[65px] z-50 overflow-y-auto overscroll-contain border-t border-white/10 bg-[#142b32] lg:hidden"
    >
      <nav aria-label="Primary mobile" className="px-5 pb-10 pt-2">
        {navGroups.map((group) => {
          const isOpen = expanded === group.label;
          return (
            <div key={group.label} className="border-b border-white/10">
              <button
                type="button"
                aria-expanded={isOpen}
                onClick={() => setExpanded(isOpen ? null : group.label)}
                className="focus-ring flex w-full items-center justify-between rounded-sm py-4 text-left text-xs font-bold uppercase tracking-[.14em] text-[#f2f0e8]"
              >
                {group.label}
                <ChevronDown className={`h-4 w-4 text-[#a8c95a] transition-transform ${isOpen ? 'rotate-180' : ''}`} />
              </button>
              {isOpen && (
                <ul className="pb-4">
                  <li>
                    <Link
                      href={group.href}
                      onClick={onClose}
                      className="focus-ring block rounded-sm py-2.5 text-[13px] font-bold text-[#a8c95a]"
                    >
                      {group.label} overview
                    </Link>
                  </li>
                  {group.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        onClick={onClose}
                        className="focus-ring block rounded-sm py-2.5 text-[13px] text-white/75"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          );
        })}

        <Link
          href="/contact"
          onClick={onClose}
          className="focus-ring mt-7 inline-flex items-center gap-2 rounded-full bg-[#a8c95a] px-6 py-4 text-[10px] font-extrabold uppercase tracking-[.14em] text-[#142b32]"
        >
          Book a consultation <ArrowUpRight className="h-3.5 w-3.5" />
        </Link>

        <a
          href={`mailto:${company.email}`}
          className="focus-ring mt-6 block rounded-sm text-sm text-white/60"
        >
          {company.email}
        </a>
      </nav>
    </div>
  );
}
