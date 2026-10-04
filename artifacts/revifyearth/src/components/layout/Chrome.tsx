import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'wouter';

import { anchorPosition, scrollToTarget } from '@/animations/scroll/lenis';
import { resolvePageSeo, socialImageUrl } from '@/data/seo';

/** Keyboard users land here first; the target lives on the main element. */
export function SkipLink() {
  return (
    <a href="#main" className="skip-link">
      Skip to content
    </a>
  );
}

/**
 * Reading progress.
 *
 * Guards the divisor: on pages shorter than the viewport the scrollable distance is
 * zero, which previously produced a NaN width.
 */
export function ScrollProgress() {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const update = () => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      setWidth(scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0);
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, []);

  return <div className="progress-bar" style={{ width: `${Math.min(100, Math.max(0, width))}%` }} aria-hidden="true" />;
}

// The events wouter dispatches on window for every history change (it patches
// pushState/replaceState to emit them). `useLocation` only re-renders when the
// *pathname* changes, so a link to another section of the current page —
// /industries#healthcare → /industries#bfsi — is invisible to it.
const historyEvents = ['pushState', 'replaceState', 'popstate', 'hashchange'] as const;

/** Increments on every history change, including hash-only ones. */
function useNavigationKey() {
  const [key, setKey] = useState(0);

  useEffect(() => {
    const bump = () => setKey((value) => value + 1);
    for (const type of historyEvents) window.addEventListener(type, bump);
    return () => {
      for (const type of historyEvents) window.removeEventListener(type, bump);
    };
  }, []);

  return key;
}

/** How long to wait for an anchor on a lazily loaded route to render. */
const ANCHOR_TIMEOUT_MS = 4000;

/**
 * Scroll position on navigation.
 *
 * Wouter keeps the scroll position across route changes, so a new page opens at the
 * top. A link with a hash (/industries#bfsi, /about#careers) scrolls to that section
 * instead — client-side navigation never does this on its own, and the target
 * usually does not exist yet because the route is code-split, so it is polled for
 * until the page renders.
 */
export function ScrollToTop() {
  const navigationKey = useNavigationKey();
  const lastPath = useRef<string | null>(null);

  useEffect(() => {
    const path = window.location.pathname;
    const samePage = lastPath.current === path;
    lastPath.current = path;

    const id = decodeURIComponent(window.location.hash.slice(1));
    if (!id) {
      // Instant, not smooth: a smooth scroll racing the incoming page's layout can
      // stop short of the top. scrollToTarget routes through Lenis when it is active.
      if (!samePage) scrollToTarget(0, { smooth: false });
      return;
    }

    let frame = 0;
    const timers: number[] = [];
    const deadline = performance.now() + ANCHOR_TIMEOUT_MS;
    const seek = () => {
      const target = document.getElementById(id);
      // While the incoming route's chunk loads, Suspense keeps the previous page in
      // the DOM under display:none. An id both pages share (#frameworks is on Home
      // and Expertise) resolves to that hidden copy first, which has no boxes and
      // cannot be scrolled to — so only a rendered target counts as found.
      if (target && target.getClientRects().length > 0) {
        scrollToTarget(target, { smooth: samePage });
        // A freshly opened page can still grow above the anchor (fonts, late
        // sections) after the jump. Re-check twice and settle if it moved.
        if (!samePage) {
          for (const delay of [400, 1100]) {
            timers.push(
              window.setTimeout(() => {
                if (Math.abs(window.scrollY - anchorPosition(target)) > 4) scrollToTarget(target, { smooth: false });
              }, delay),
            );
          }
        }
      } else if (performance.now() < deadline) {
        frame = requestAnimationFrame(seek);
      }
    };
    seek();
    return () => {
      cancelAnimationFrame(frame);
      for (const timer of timers) window.clearTimeout(timer);
    };
  }, [navigationKey]);

  return null;
}

const upsertMeta = (key: string, attribute: 'name' | 'property', value: string) => {
  const selector = `meta[${attribute}="${key}"]`;
  let element = document.head.querySelector<HTMLMetaElement>(selector);
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attribute, key);
    document.head.appendChild(element);
  }
  element.setAttribute('content', value);
};

const upsertLink = (rel: string, href: string) => {
  let element = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  if (!element) {
    element = document.createElement('link');
    element.rel = rel;
    document.head.appendChild(element);
  }
  element.href = href;
};

const removeHeadElement = (selector: string) => document.head.querySelector(selector)?.remove();

/**
 * Per-route metadata.
 *
 * Resolved by `resolvePageSeo`, the same function the build uses to write each
 * route's HTML, so the head after client-side navigation matches the raw HTML a
 * crawler received. Canonical and og:url always use the public origin, never the
 * deploy host, `www` or a preview. A path the router renders as NotFound gets
 * `noindex, nofollow` and no canonical.
 */
export function PageMeta() {
  const [location] = useLocation();

  useEffect(() => {
    const seo = resolvePageSeo(location);

    document.title = seo.title;
    upsertMeta('description', 'name', seo.description);
    upsertMeta('robots', 'name', seo.robots);
    upsertMeta('og:title', 'property', seo.ogTitle);
    upsertMeta('og:description', 'property', seo.ogDescription);
    upsertMeta('og:image', 'property', socialImageUrl);
    upsertMeta('og:site_name', 'property', 'RevifyEarth');
    upsertMeta('twitter:title', 'name', seo.twitterTitle);
    upsertMeta('twitter:description', 'name', seo.twitterDescription);
    upsertMeta('twitter:image', 'name', socialImageUrl);
    if (seo.ogUrl) upsertMeta('og:url', 'property', seo.ogUrl);
    else removeHeadElement('meta[property="og:url"]');
    if (seo.canonical) upsertLink('canonical', seo.canonical);
    else removeHeadElement('link[rel="canonical"]');

    // The same @graph the build wrote into this route's HTML: Organization always,
    // plus WebSite on the homepage and Service on a service page.
    let script = document.head.querySelector<HTMLScriptElement>('script[data-jsonld="page"]');
    if (!script) {
      script = document.createElement('script');
      script.type = 'application/ld+json';
      script.dataset.jsonld = 'page';
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(seo.structuredData);
  }, [location]);

  return null;
}
