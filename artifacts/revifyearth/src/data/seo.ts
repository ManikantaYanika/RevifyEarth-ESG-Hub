import { company } from './company';
import { services } from './services';

export interface PageMetaEntry {
  readonly title: string;
  readonly description: string;
}

const base: Record<string, PageMetaEntry> = {
  '/': {
    title: 'RevifyEarth — ESG Branding & Sustainability Communication',
    description:
      'RevifyEarth turns complex ESG information into technically robust, visually compelling and strategically aligned communication across report, print, board, film and web.',
  },
  '/about': {
    title: 'About RevifyEarth — ESG Communication Partner',
    description:
      'Revify Private Limited connects technical ESG understanding with strategic storytelling and premium creative design under one integrated engagement model.',
  },
  '/services': {
    title: 'ESG Communication Services — RevifyEarth',
    description:
      'Content review and gap assessment, sustainability report design, sustainable print, board presentations, video reports, ESG websites and integrated communication.',
  },
  '/expertise': {
    title: 'ESG Expertise & Frameworks — RevifyEarth',
    description:
      'Sustainability reporting expertise across GRI Universal and Topic Standards, BRSR and the UN Sustainable Development Goals.',
  },
  '/sustainability-branding': {
    title: 'Sustainability Branding & Communication — RevifyEarth',
    description:
      'One sustainability identity across report, print, board presentation, video and web. One story, multiple stakeholder touchpoints.',
  },
  '/industries': {
    title: 'Industries We Serve — RevifyEarth',
    description:
      'ESG communication for healthcare, manufacturing, BFSI, energy, IT and infrastructure — grounded in each sector’s disclosure profile.',
  },
  '/process': {
    title: 'Our Process & Methodology — RevifyEarth',
    description:
      'Five phases from kick-off and scope confirmation through review, design, film and web to the final results presentation.',
  },
  '/team': {
    title: 'The RevifyEarth Team — ESG & Sustainability Experts',
    description:
      'A founding team of ESG industry experts and a core designing team bringing reporting expertise and creative execution together.',
  },
  '/projects': {
    title: 'Work & Engagement Model — RevifyEarth',
    description:
      'How an integrated sustainability branding and communication engagement comes together, from evidence to executive room to public conversation.',
  },
  '/resources': {
    title: 'Resources, Insights & FAQs — RevifyEarth',
    description:
      'Frameworks, frequently asked questions on scope and timelines, and perspectives on disclosure quality and reporting practice.',
  },
  '/contact': {
    title: 'Contact RevifyEarth — Start a Conversation',
    description:
      'Talk to RevifyEarth about your sustainability report, ESG communication system, video report or next strategic direction.',
  },
};

for (const service of services) {
  base[`/services/${service.slug}`] = {
    title: `${service.title} — RevifyEarth`,
    description: service.summary,
  };
}

export const pageMeta = base;

export const fallbackMeta: PageMetaEntry = {
  title: 'Page not found — RevifyEarth',
  description: 'The page you are looking for is not available. Explore RevifyEarth’s ESG communication services instead.',
};

export const socialImage = '/assets/revify/hero-birds-1600.webp';

/* ---------------------------------------------------------------------------------
 * Resolved SEO — the single source for both the runtime <PageMeta> and the build-time
 * per-route HTML (vite-plugins/seo-prerender.ts). Both read only from here, so the
 * raw HTML a crawler receives and the head after hydration cannot disagree.
 *
 * This module is imported by the Vite config at build time, so it must stay plain
 * data: relative imports only, no `@/` aliases, no DOM, no asset imports.
 * ------------------------------------------------------------------------------- */

/** The one public origin. Never the deploy host, `www` or a preview URL. */
export const SITE_ORIGIN = company.website;

export const ROBOTS_INDEX = 'index, follow';
export const ROBOTS_NOINDEX = 'noindex, nofollow';

export const socialImageUrl = `${SITE_ORIGIN}${socialImage}`;

export interface PageSeo {
  /** Canonical route path ("/", "/about", "/services/report-design"); null when not found. */
  readonly path: string | null;
  readonly title: string;
  readonly description: string;
  /** Absolute canonical URL; null for pages that must not be indexed. */
  readonly canonical: string | null;
  readonly robots: string;
  readonly ogTitle: string;
  readonly ogDescription: string;
  readonly ogUrl: string | null;
  readonly twitterTitle: string;
  readonly twitterDescription: string;
}

/** https://revifyearth.com/ for the root, otherwise no trailing slash. */
export const canonicalUrl = (path: string): string => `${SITE_ORIGIN}${path === '/' ? '/' : path}`;

const toPageSeo = (path: string, entry: PageMetaEntry): PageSeo => ({
  path,
  title: entry.title,
  description: entry.description,
  canonical: canonicalUrl(path),
  robots: ROBOTS_INDEX,
  ogTitle: entry.title,
  ogDescription: entry.description,
  ogUrl: canonicalUrl(path),
  twitterTitle: entry.title,
  twitterDescription: entry.description,
});

export const notFoundSeo: PageSeo = {
  path: null,
  title: fallbackMeta.title,
  description: fallbackMeta.description,
  canonical: null,
  robots: ROBOTS_NOINDEX,
  ogTitle: fallbackMeta.title,
  ogDescription: fallbackMeta.description,
  ogUrl: null,
  twitterTitle: fallbackMeta.title,
  twitterDescription: fallbackMeta.description,
};

/** Every indexable route, root first, in the order the sitemap lists them. */
export const indexableRoutes: readonly string[] = Object.keys(pageMeta);

export const routeSeo: readonly PageSeo[] = indexableRoutes.map((path) => toPageSeo(path, pageMeta[path]));

const serviceSlugs = new Set(services.map((service) => service.slug));

/**
 * Maps a requested pathname to the canonical route it renders, or null when the
 * router would render NotFound. Mirrors wouter exactly rather than guessing:
 * wouter (regexparam) matches case-insensitively with one optional trailing slash,
 * while ServiceDetail compares the slug case-sensitively. So "/About/" renders the
 * About page and canonicalises to "/about", but "/services/Report-Design" renders
 * NotFound and must stay noindex.
 */
export function resolveRoute(pathname: string): string | null {
  const path = (pathname.split(/[?#]/, 1)[0] || '/').replace(/^(?!\/)/, '/');
  if (path === '/') return '/';
  const trimmed = path.endsWith('/') ? path.slice(0, -1) : path;

  const service = /^\/services\/([^/]+)$/i.exec(trimmed);
  if (service) {
    const slug = service[1];
    return serviceSlugs.has(slug) ? `/services/${slug}` : null;
  }

  const key = trimmed.toLowerCase();
  return key !== '/' && Object.prototype.hasOwnProperty.call(pageMeta, key) ? key : null;
}

export function resolvePageSeo(pathname: string): PageSeo {
  const route = resolveRoute(pathname);
  return route === null ? notFoundSeo : toPageSeo(route, pageMeta[route]);
}

/** Organization structured data, emitted once from the app shell. */
export const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: company.legalName,
  alternateName: company.brand,
  url: company.website,
  email: company.email,
  description: company.positioning,
  knowsAbout: [
    'ESG reporting',
    'Sustainability communication',
    'GRI Standards',
    'BRSR',
    'UN Sustainable Development Goals',
    'Sustainability report design',
  ],
};
