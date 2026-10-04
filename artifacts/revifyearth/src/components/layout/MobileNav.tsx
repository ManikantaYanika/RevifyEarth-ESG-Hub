import { ArrowUpRight, ChevronDown, Mail, Phone, X } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Link, useLocation } from 'wouter';

import { navGroups } from '@/data/navigation';
import { company, contacts } from '@/data/company';
import { Logo } from '@/components/site/Primitives';
import { useBodyScrollLock } from '@/hooks/use-body-scroll-lock';

const FOCUSABLE =
  'a[href], button:not([disabled]), input, textarea, select, [tabindex]:not([tabindex="-1"])';

/** The group whose section the visitor is currently in, so the sheet opens showing where they are. */
function groupForLocation(location: string): string | null {
  const match = navGroups.find(
    (group) =>
      group.href === location ||
      group.links.some((link) => link.href.split('#')[0] === location),
  );
  return match?.label ?? null;
}

/**
 * Mobile navigation sheet.
 *
 * Rendered through a portal onto `document.body`, which is not cosmetic: the site
 * header carries `backdrop-blur-xl`, and a non-`none` `backdrop-filter` makes an
 * element the containing block for its fixed-position descendants. Mounted inside
 * the header, this panel resolved `top: 65px; bottom: 0` against the 77px-tall
 * header instead of the viewport and opened as a ~10px sliver — the menu button
 * appeared to do nothing. The portal is what makes `fixed` mean "the viewport".
 *
 * It is a dialog: focus moves in, is trapped, and returns to the trigger on close.
 */
export function MobileNav({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [location] = useLocation();
  const [expanded, setExpanded] = useState<string | null>(() => groupForLocation(location));
  const [mounted, setMounted] = useState(open);
  const [leaving, setLeaving] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const restoreFocusRef = useRef<HTMLElement | null>(null);

  // Keep the sheet in the tree through its exit animation.
  useEffect(() => {
    if (open) {
      setMounted(true);
      setLeaving(false);
      return;
    }
    setMounted((isMounted) => {
      if (isMounted) setLeaving(true);
      return isMounted;
    });
  }, [open]);

  // Re-sync the open accordion to the route each time the sheet is opened.
  useEffect(() => {
    if (open) setExpanded(groupForLocation(location));
  }, [open, location]);

  useBodyScrollLock(mounted);

  // Captured while `open` flips true — at that point the sheet has not rendered yet,
  // so the active element is still the trigger we need to hand focus back to.
  useEffect(() => {
    if (!open) return;
    restoreFocusRef.current = document.activeElement as HTMLElement | null;
  }, [open]);

  // Focus lands one commit later, once `mounted` has put the panel in the DOM.
  // Focusing the panel rather than its first control announces the dialog instead
  // of dropping a screen-reader user straight onto the first menu group.
  useEffect(() => {
    if (!open || !mounted) return;
    panelRef.current?.focus({ preventScroll: true });
  }, [open, mounted]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.stopPropagation();
        onClose();
        return;
      }
      if (event.key !== 'Tab') return;
      const panel = panelRef.current;
      if (!panel) return;
      const items = [...panel.querySelectorAll<HTMLElement>(FOCUSABLE)].filter(
        (element) => element.offsetParent !== null,
      );
      if (items.length === 0) return;
      const first = items[0]!;
      const last = items[items.length - 1]!;
      const active = document.activeElement;
      if (event.shiftKey && (active === first || active === panel)) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', onKeyDown, true);
    return () => document.removeEventListener('keydown', onKeyDown, true);
  }, [open, onClose]);

  const handleExitEnd = useCallback(() => {
    if (!leaving) return;
    setLeaving(false);
    setMounted(false);
    restoreFocusRef.current?.focus();
    restoreFocusRef.current = null;
  }, [leaving]);

  if (!mounted) return null;

  const isActive = (href: string) => {
    const path = href.split('#')[0];
    return path === location;
  };

  return createPortal(
    <div className="lg:hidden">
      <div
        className="nav-scrim fixed inset-0 z-[90] bg-[#0b1a1f]/70 backdrop-blur-sm"
        data-leaving={leaving}
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        id="mobile-nav"
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Site navigation"
        tabIndex={-1}
        data-leaving={leaving}
        onAnimationEnd={(event) => {
          if (event.target === event.currentTarget) handleExitEnd();
        }}
        className="nav-sheet fixed inset-y-0 right-0 z-[95] flex h-[100dvh] w-full max-w-[26rem] flex-col border-l border-white/10 bg-[#142b32] text-[#f2f0e8] shadow-2xl outline-none"
      >
        {/* The sheet carries its own brand row so it never depends on the site
            header's measured height — the previous `top-[65px]` offset drifted the
            moment the hamburger grew to a 44px touch target. */}
        <div
          className="flex shrink-0 items-center justify-between gap-4 border-b border-white/10 px-5 py-4"
          style={{ paddingTop: 'max(1rem, env(safe-area-inset-top))' }}
        >
          {/* Dismisses the sheet when the mark is used as a home link. Navigating to
              a route you are already on does not change `location`, so the route
              effect that normally closes the sheet would not fire. */}
          <span onClick={onClose}>
            <Logo light />
          </span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="focus-ring -mr-1 flex h-11 w-11 items-center justify-center rounded-full border border-white/20 text-[#f2f0e8] transition-colors hover:border-[#a8c95a] hover:text-[#a8c95a]"
            data-testid="button-close-mobile-menu"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        <nav
          aria-label="Primary mobile"
          className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-3"
        >
          {navGroups.map((group, index) => {
            const isOpen = expanded === group.label;
            const sectionId = `mobile-nav-${group.label.toLowerCase()}`;
            return (
              <div
                key={group.label}
                className="nav-item border-b border-white/10"
                style={leaving ? undefined : { animationDelay: `${60 + index * 45}ms` }}
              >
                <button
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={sectionId}
                  onClick={() => setExpanded(isOpen ? null : group.label)}
                  className={`focus-ring flex min-h-[56px] w-full items-center justify-between gap-4 rounded-sm py-4 text-left text-[13px] font-bold uppercase tracking-[.14em] transition-colors ${
                    isOpen ? 'text-[#a8c95a]' : 'text-[#f2f0e8]'
                  }`}
                  data-testid={`button-mobile-group-${group.label.toLowerCase()}`}
                >
                  {group.label}
                  <ChevronDown
                    className={`h-4 w-4 shrink-0 text-[#a8c95a] transition-transform duration-300 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                    aria-hidden="true"
                  />
                </button>

                {/* `grid-template-rows: 0fr → 1fr` animates to the content's natural
                    height without measuring it in JavaScript. */}
                <div
                  id={sectionId}
                  className="grid transition-[grid-template-rows] duration-300 ease-out"
                  style={{ gridTemplateRows: isOpen ? '1fr' : '0fr' }}
                >
                  <div className="overflow-hidden">
                    <p className="pb-3 pr-6 text-[13px] leading-6 text-white/55">{group.intro}</p>
                    <ul className="pb-3">
                      <li>
                        <Link
                          href={group.href}
                          onClick={onClose}
                          tabIndex={isOpen ? undefined : -1}
                          className={`focus-ring flex min-h-[44px] items-center gap-2 rounded-sm text-[13px] font-bold transition-colors ${
                            isActive(group.href) ? 'text-[#a8c95a]' : 'text-[#a8c95a]/85'
                          }`}
                        >
                          {group.label} overview
                          <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                        </Link>
                      </li>
                      {group.links.map((link) => {
                        const active = isActive(link.href);
                        return (
                          <li key={link.href}>
                            <Link
                              href={link.href}
                              onClick={onClose}
                              tabIndex={isOpen ? undefined : -1}
                              aria-current={active ? 'page' : undefined}
                              className={`focus-ring flex min-h-[44px] items-center rounded-sm border-l-2 pl-3.5 text-[13px] leading-6 transition-colors ${
                                active
                                  ? 'border-[#a8c95a] font-semibold text-[#f2f0e8]'
                                  : 'border-transparent text-white/70 hover:border-white/30 hover:text-[#f2f0e8]'
                              }`}
                            >
                              {link.label}
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </div>
              </div>
            );
          })}
        </nav>

        <div
          className="shrink-0 border-t border-white/10 bg-[#10252b] px-5 pt-5"
          style={{ paddingBottom: 'max(1.25rem, env(safe-area-inset-bottom))' }}
        >
          <Link
            href="/contact"
            onClick={onClose}
            className="focus-ring flex min-h-[52px] w-full items-center justify-center gap-2.5 rounded-full bg-[#a8c95a] px-6 text-[11px] font-extrabold uppercase tracking-[.14em] text-[#142b32]"
            data-testid="link-mobile-cta"
          >
            Book a consultation <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </Link>
          <div className="mt-3 flex flex-wrap items-center gap-x-5">
            <a
              href={`mailto:${company.email}`}
              className="focus-ring inline-flex min-h-[44px] items-center gap-2 rounded-sm text-[13px] text-white/60 transition-colors hover:text-[#a8c95a]"
            >
              <Mail className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              {company.email}
            </a>
            {contacts[0] && (
              <a
                href={`tel:${contacts[0].phone}`}
                className="focus-ring inline-flex min-h-[44px] items-center gap-2 rounded-sm text-[13px] text-white/60 transition-colors hover:text-[#a8c95a]"
              >
                <Phone className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                {contacts[0].phone}
              </a>
            )}
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
