import { ArrowUpRight, ChevronDown, Menu, X } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'wouter';

import { navGroups } from '@/data/navigation';
import { Logo } from '@/components/site/Primitives';
import { MobileNav } from './MobileNav';

/**
 * Enterprise navigation.
 *
 * Five grouped mega-menu panels on desktop, an accordion sheet below `lg`. Panels
 * open on hover for pointer users and on click/keyboard for everyone else, which is
 * what makes the same markup work on touch screens where hover does not exist.
 */
export function Header() {
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [location, navigate] = useLocation();
  const headerRef = useRef<HTMLElement>(null);
  const closeTimer = useRef<number | undefined>(undefined);
  const canHover = useRef(false);

  // On a hover-capable pointer the panel opens on hover, so activating the trigger
  // means "take me to the overview". Without hover (touch), activation is the only
  // way in, so it toggles the panel instead. Without this split, hovering then
  // clicking would open and immediately re-close the panel.
  useEffect(() => {
    canHover.current = window.matchMedia('(hover: hover)').matches;
  }, []);

  // Any navigation dismisses whatever was open.
  useEffect(() => {
    setOpenGroup(null);
    setMobileOpen(false);
  }, [location]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      setOpenGroup(null);
      setMobileOpen(false);
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, []);

  // Close when focus or the pointer leaves the header entirely.
  const scheduleClose = useCallback(() => {
    window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => setOpenGroup(null), 120);
  }, []);

  const cancelClose = useCallback(() => window.clearTimeout(closeTimer.current), []);

  const isActive = (href: string) => location === href || (href !== '/' && location.startsWith(href));

  return (
    <header
      ref={headerRef}
      className="sticky top-0 z-40 border-b border-white/10 bg-[#142b32]/95 text-[#f2f0e8] backdrop-blur-xl"
      onMouseLeave={scheduleClose}
      onMouseEnter={cancelClose}
    >
      <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-6 px-5 py-4 md:px-10">
        <Logo light />

        <nav aria-label="Primary" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {navGroups.map((group) => {
              const open = openGroup === group.label;
              const panelId = `nav-panel-${group.label.toLowerCase()}`;
              return (
                <li key={group.label}>
                  <button
                    type="button"
                    aria-expanded={open}
                    aria-controls={panelId}
                    aria-current={isActive(group.href) ? 'page' : undefined}
                    onClick={() => {
                      if (canHover.current) {
                        navigate(group.href);
                        setOpenGroup(null);
                        return;
                      }
                      setOpenGroup((current) => (current === group.label ? null : group.label));
                    }}
                    onMouseEnter={() => {
                      cancelClose();
                      setOpenGroup(group.label);
                    }}
                    onFocus={() => setOpenGroup(group.label)}
                    className={`focus-ring flex items-center gap-1.5 rounded-sm px-3 py-2 text-[10px] font-bold uppercase tracking-[.13em] transition-colors ${
                      open || isActive(group.href) ? 'text-[#a8c95a]' : 'text-white/75 hover:text-[#a8c95a]'
                    }`}
                    data-testid={`button-nav-${group.label.toLowerCase()}`}
                  >
                    {group.label}
                    <ChevronDown className={`h-3 w-3 transition-transform duration-300 ${open ? 'rotate-180' : ''}`} />
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        <Link
          href="/contact"
          className="focus-ring hidden items-center gap-2 rounded-full bg-[#a8c95a] px-5 py-3 text-[10px] font-extrabold uppercase tracking-[.14em] text-[#142b32] transition-transform hover:-translate-y-0.5 md:flex"
          data-testid="link-header-cta"
        >
          Book a consultation <ArrowUpRight className="h-3.5 w-3.5" />
        </Link>

        <button
          type="button"
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileOpen}
          aria-controls="mobile-nav"
          onClick={() => setMobileOpen((v) => !v)}
          className="focus-ring rounded-full border border-white/20 p-2 lg:hidden"
          data-testid="button-mobile-menu"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Desktop mega panels — rendered only while open. The `hidden lg:block` pair
          is the responsive gate; using the HTML `hidden` attribute here would be
          overridden by `lg:block`, since author styles beat the UA stylesheet. */}
      {navGroups.map((group) => {
        const open = openGroup === group.label;
        if (!open) return null;
        return (
          <div
            key={group.label}
            id={`nav-panel-${group.label.toLowerCase()}`}
            className="mega-panel absolute inset-x-0 top-full hidden border-b border-white/10 bg-[#10252b]/98 backdrop-blur-xl lg:block"
          >
            <div className="mx-auto grid max-w-[1440px] gap-10 px-10 py-10 md:grid-cols-[.8fr_2.2fr]">
              <div>
                <p className="eyebrow text-[#a8c95a]">{group.label}</p>
                <p className="mt-4 max-w-xs text-sm leading-7 text-white/70">{group.intro}</p>
                <Link
                  href={group.href}
                  className="focus-ring mt-6 inline-flex items-center gap-2 rounded-sm border-b border-[#a8c95a] pb-1 text-[10px] font-bold uppercase tracking-[.16em] text-[#f2f0e8]"
                >
                  Overview <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
              </div>
              <ul className="grid gap-x-8 gap-y-1 sm:grid-cols-2 xl:grid-cols-3">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="focus-ring group block rounded-sm border-t border-white/10 py-4 transition-colors hover:border-[#a8c95a]"
                      data-testid={`link-nav-${link.label.toLowerCase().replaceAll(' ', '-')}`}
                    >
                      <span className="flex items-center justify-between gap-3 text-[13px] font-bold text-[#f2f0e8]">
                        {link.label}
                        <ArrowUpRight className="h-3.5 w-3.5 shrink-0 text-[#a8c95a] opacity-0 transition-all group-hover:opacity-100" />
                      </span>
                      <span className="mt-1.5 block text-xs leading-6 text-white/60">{link.summary}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        );
      })}

      <MobileNav open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </header>
  );
}
