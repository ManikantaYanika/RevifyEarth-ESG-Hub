import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';

import { fallbackMeta, organizationJsonLd, pageMeta, socialImage } from '@/data/seo';

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

/**
 * Wouter keeps the scroll position across route changes, so navigating from halfway
 * down one page dropped you halfway down the next. Anchor links are left alone.
 */
export function ScrollToTop() {
  const [location] = useLocation();

  useEffect(() => {
    if (window.location.hash) return;
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [location]);

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

/**
 * Per-route metadata.
 *
 * Adds the `og:image` and `og:url` the previous implementation omitted — the page
 * declared `twitter:card=summary_large_image` with no image to show — plus
 * Organization structured data.
 */
export function PageMeta() {
  const [location] = useLocation();

  useEffect(() => {
    const meta = pageMeta[location] ?? fallbackMeta;
    const origin = window.location.origin;
    const url = `${origin}${location === '/' ? '' : location}`;
    const image = `${origin}${socialImage}`;

    document.title = meta.title;
    upsertMeta('description', 'name', meta.description);
    upsertMeta('og:title', 'property', meta.title);
    upsertMeta('og:description', 'property', meta.description);
    upsertMeta('og:url', 'property', url);
    upsertMeta('og:image', 'property', image);
    upsertMeta('og:site_name', 'property', 'RevifyEarth');
    upsertMeta('twitter:title', 'name', meta.title);
    upsertMeta('twitter:description', 'name', meta.description);
    upsertMeta('twitter:image', 'name', image);
    upsertLink('canonical', url);

    let script = document.head.querySelector<HTMLScriptElement>('script[data-jsonld="organization"]');
    if (!script) {
      script = document.createElement('script');
      script.type = 'application/ld+json';
      script.dataset.jsonld = 'organization';
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(organizationJsonLd);
  }, [location]);

  return null;
}
