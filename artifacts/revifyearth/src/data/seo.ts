import { company, designTeam, foundingTeam, type TeamMember } from './company';
import { media, assetUrl, type ImageAsset } from './media';
import { serviceBySlug, services, type Service } from './services';

export interface PageMetaEntry {
  readonly title: string;
  readonly description: string;
}

/*
 * Search intent by route. Each page owns one primary topic so pages do not compete
 * with each other; the subject clusters and which page owns each are in ./topics.ts
 * (Phase D), and the build checks that map against the routes below.
 *   /                          brand + ESG reporting & sustainability communication (India)
 *   /about                     the company: who RevifyEarth is
 *   /services                  the service catalogue as a whole
 *   /services/<slug>           one service each (see serviceMeta below)
 *   /expertise                 framework knowledge: GRI, BRSR, UN SDGs
 *   /sustainability-branding   one visual identity across formats
 *   /industries                sector-specific disclosure context
 *   /process                   delivery phases and timeline
 *   /team                      the people
 *   /projects                  how an engagement is assembled (no case studies yet)
 *   /resources                 FAQs, perspectives and the topic guide
 *   /contact                   start an enquiry
 * Titles and descriptions must stay unique; the build fails on a duplicate.
 */
const base: Record<string, PageMetaEntry> = {
  '/': {
    title: 'RevifyEarth — ESG Reporting & Sustainability Communication',
    description:
      'RevifyEarth helps organisations in India turn ESG information into clear, credible communication: GRI- and BRSR-aligned report review, report design, print, video and web.',
  },
  '/about': {
    title: 'About RevifyEarth — ESG & Sustainability Communication Partner',
    description:
      'Revify Private Limited is an India-focused ESG and sustainability communication partner, bringing technical reporting expertise, strategic storytelling and design together.',
  },
  '/services': {
    title: 'ESG & Sustainability Reporting Services — RevifyEarth',
    description:
      'Seven connected services: sustainability report review and gap assessment, report design, sustainable print, board presentations, video reports and report webpages.',
  },
  '/expertise': {
    title: 'ESG Reporting Expertise: GRI, BRSR & UN SDGs — RevifyEarth',
    description:
      'The technical side of our work: disclosure completeness against GRI Standards, BRSR alignment, data integrity, climate disclosures and narrative coherence in ESG reports.',
  },
  '/sustainability-branding': {
    title: 'Sustainability Branding & Visual Identity — RevifyEarth',
    description:
      'One sustainability identity carried across report, print, board presentation, video and web, so every format tells the same ESG story to a different audience.',
  },
  '/industries': {
    title: 'Industry-Specific ESG Reporting & Communication — RevifyEarth',
    description:
      'ESG reporting and communication shaped by each sector’s disclosure profile under GRI and BRSR: healthcare, manufacturing, BFSI, energy, IT services and infrastructure.',
  },
  '/process': {
    title: 'Our ESG Reporting Process & Timeline — RevifyEarth',
    description:
      'How a sustainability reporting engagement runs: five phases from kick-off and scope confirmation through review, report design, video and web to the results presentation.',
  },
  '/team': {
    title: 'The RevifyEarth Team — ESG & Sustainability Experts',
    description:
      'Meet the founding team of ESG industry experts and the core design team behind RevifyEarth’s sustainability reports, presentations, films and webpages.',
  },
  '/projects': {
    title: 'ESG Communication Engagement Model — RevifyEarth',
    description:
      'The five components of a RevifyEarth engagement — content review, report design, sustainable print, video report and webpage — and why each inherits the approved narrative.',
  },
  '/resources': {
    title: 'ESG Reporting Resources & FAQs — RevifyEarth',
    description:
      'Answers on scope, timelines and frameworks for teams preparing a sustainability report, perspectives on disclosure quality, and a guide to where each topic is covered.',
  },
  '/contact': {
    title: 'Contact RevifyEarth — Discuss Your Sustainability Report',
    description:
      'Talk to RevifyEarth about your sustainability report, a disclosure review, ESG communication, a video report or a report webpage. Engagements are scoped to the brief.',
  },
};

/**
 * One entry per service slug. Written for search rather than reusing the card
 * summary, which was written to sit under a visible title and repeats nothing of it.
 */
const serviceMeta: Record<string, PageMetaEntry> = {
  'content-review': {
    title: 'Sustainability Report Review & Gap Assessment — RevifyEarth',
    description:
      'Chapter-by-chapter review of your draft sustainability report against GRI Standards, BRSR and the UN SDGs, resolving disclosure gaps and inconsistencies before design.',
  },
  'report-design': {
    title: 'ESG & Sustainability Report Design — RevifyEarth',
    description:
      'Editorial design for ESG and sustainability reports: five creative theme directions, custom infographics and data visualisation, interactive PDF and print-ready artwork.',
  },
  'print-production': {
    title: 'Sustainable Report Print Production — RevifyEarth',
    description:
      'Print production for sustainability reports on FSC-certified or recycled paper, with stock and GSM selection, perfect binding, proof review and quality checks before dispatch.',
  },
  'board-presentation': {
    title: 'ESG Board Presentation Support — RevifyEarth',
    description:
      'An executive board presentation built from your final sustainability report: reporting-year highlights, key ESG indicators and forward-looking priorities.',
  },
  'video-report': {
    title: 'Sustainability Video Report Production — RevifyEarth',
    description:
      'A 5–7 minute sustainability video report with script, storyboard, motion graphics and animated ESG KPIs in Full HD, plus two 30-second cutdowns for social channels.',
  },
  'webpage-development': {
    title: 'Sustainability Report Webpage Development — RevifyEarth',
    description:
      'A responsive webpage for your sustainability report, with an overview, key ESG highlights, thematic content, embedded video and downloadable report access.',
  },
  'integrated-communication': {
    title: 'Integrated ESG Communication — RevifyEarth',
    description:
      'One sustainability narrative across report review, design, print, board presentation, video and web, planned and managed as a single ESG communication engagement.',
  },
};

for (const service of services) {
  const entry = serviceMeta[service.slug];
  // Thrown at import, so a new service cannot ship with the homepage's metadata.
  if (!entry) throw new Error(`src/data/seo.ts: no serviceMeta entry for service "${service.slug}".`);
  base[`/services/${service.slug}`] = entry;
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
  /** JSON-LD for this page: one @graph, emitted as a single script tag. */
  readonly structuredData: StructuredData;
  /** The page's hero image (its LCP element), preloaded from the HTML head; null when there is none. */
  readonly heroPreload: HeroPreload | null;
}

export interface HeroPreload {
  readonly href: string;
  readonly srcset: string;
  readonly sizes: string;
}

/*
 * Hero image per route, preloaded from the prerendered head so the LCP image starts
 * downloading while the JavaScript does, instead of after React renders the hero.
 * Every hero is full-bleed (`sizes="100vw"`). Must match the `image` each page passes
 * to PageHero (Home: its hero ResponsiveImage); a service page uses `service.image`.
 * A mismatch costs a wasted download, so the release validation compares the preload
 * with the hero the browser actually rendered.
 */
const pageHeroes: Readonly<Record<string, ImageAsset>> = {
  '/': media.heroBirds,
  '/about': media.forestMist,
  '/services': media.volcano,
  '/expertise': media.heroBirds,
  '/sustainability-branding': media.mountainSunset,
  '/industries': media.volcano,
  '/process': media.forestMist,
  '/team': media.heroBirds,
  '/projects': media.mountainSunset,
  '/resources': media.iceberg,
  '/contact': media.heroBirds,
};

// No fetchpriority on the preload: with it, plus the route's modulepreloads, headless
// Chrome intermittently stalled under throttled lab runs, and LCP measured the same
// without it. `href` is only the fallback for browsers that ignore imagesrcset.
const toPreload = (asset: ImageAsset): HeroPreload => ({
  href: assetUrl(`${asset.base}-${asset.widths[0]}.webp`),
  srcset: asset.widths.map((w) => `${assetUrl(`${asset.base}-${w}.webp`)} ${w}w`).join(', '),
  sizes: '100vw',
});

const heroPreloadFor = (path: string): HeroPreload | null => {
  const service = path.startsWith('/services/') ? serviceBySlug(path.slice('/services/'.length)) : undefined;
  const asset = service ? service.image : pageHeroes[path];
  return asset ? toPreload(asset) : null;
};

/** https://revifyearth.com/ for the root, otherwise no trailing slash. */
export const canonicalUrl = (path: string): string => `${SITE_ORIGIN}${path === '/' ? '/' : path}`;

/* ---------------------------------------------------------------------------------
 * Structured data (SEO Phase E). Only entities the page genuinely is or shows:
 *   every page      the company (Organization), and the page itself (WebPage or a
 *                   subtype) tied to the site and the company
 *   /               the website (WebSite), which names the site in search results
 *   /services       the seven services as an ItemList, mirroring the visible list
 *   /services/<x>   the Service the page describes, as the page's main entity
 *   /team           a Person for each person pictured, with their visible role and bio
 * No reviews, ratings, FAQ, breadcrumb or article markup: the site shows no ratings,
 * FAQ rich results are not offered for this kind of site, there is no visible
 * breadcrumb for BreadcrumbList to mirror, and there are no articles yet.
 *
 * Nodes refer to each other by @id. A node is defined in full wherever it appears and
 * must be identical everywhere; the build checks that, plus that every reference
 * resolves and every value mirrors the head and the visible page
 * (vite-plugins/structured-data-check.ts).
 * ------------------------------------------------------------------------------- */

export type StructuredData = Readonly<Record<string, unknown>>;

export const ORGANIZATION_ID = `${SITE_ORIGIN}/#organization`;
export const WEBSITE_ID = `${SITE_ORIGIN}/#website`;
export const webPageId = (path: string): string => `${canonicalUrl(path)}#webpage`;
export const serviceId = (slug: string): string => `${canonicalUrl(`/services/${slug}`)}#service`;
export const personId = (name: string): string =>
  `${canonicalUrl('/team')}#${name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}`;

const LANGUAGE = 'en';
const india = { '@type': 'Country', name: 'India' } as const;

/**
 * The company. Facts only from src/data/company.ts. `name` is the brand people search
 * for and see on every page; the registered name is `legalName`. "Revify" is how the
 * site's own copy refers to the company ("Why Revify").
 */
const organizationJsonLd: StructuredData = {
  '@type': 'Organization',
  '@id': ORGANIZATION_ID,
  name: company.brand,
  legalName: company.legalName,
  alternateName: 'Revify',
  url: canonicalUrl('/'),
  logo: `${SITE_ORIGIN}/favicon-192.png`,
  email: company.email,
  description: company.positioning,
  areaServed: india,
  knowsAbout: [
    'ESG reporting',
    'Sustainability reporting',
    'Sustainability communication',
    'GRI Standards',
    'BRSR',
    'UN Sustainable Development Goals',
    'Sustainability report design',
  ],
};

/** Homepage only: names the site for search results (brand rather than legal name). */
const websiteJsonLd: StructuredData = {
  '@type': 'WebSite',
  '@id': WEBSITE_ID,
  url: canonicalUrl('/'),
  name: company.brand,
  alternateName: 'Revify',
  inLanguage: LANGUAGE,
  publisher: { '@id': ORGANIZATION_ID },
};

/** schema.org has specific page types for these; every other route is a WebPage. */
const pageTypes: Readonly<Record<string, string>> = {
  '/about': 'AboutPage',
  '/contact': 'ContactPage',
  '/services': 'CollectionPage',
  '/resources': 'CollectionPage',
};

/** Pages whose subject is the company itself rather than one of its services. */
const aboutTheCompany = new Set(['/', '/about', '/team', '/contact']);

/** A service page. Name and description are the visible title and opening paragraph. */
const serviceJsonLd = (service: Service): StructuredData => ({
  '@type': 'Service',
  '@id': serviceId(service.slug),
  name: service.title,
  serviceType: service.title,
  description: service.overview[0],
  url: canonicalUrl(`/services/${service.slug}`),
  provider: { '@id': ORGANIZATION_ID },
  areaServed: india,
});

/** /services: the visible service list, in the order the page shows it. */
const serviceListJsonLd: StructuredData = {
  '@type': 'ItemList',
  name: 'ESG and sustainability reporting services',
  numberOfItems: services.length,
  itemListElement: services.map((service, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: service.title,
    url: canonicalUrl(`/services/${service.slug}`),
  })),
};

/** /team: each person as pictured — name, the role shown under the portrait, the bio when there is one. */
const personJsonLd = (member: TeamMember): StructuredData => ({
  '@type': 'Person',
  '@id': personId(member.name),
  name: member.name,
  jobTitle: member.role,
  ...(member.bio ? { description: member.bio } : {}),
  image: `${SITE_ORIGIN}/assets/revify/${member.image.base}-${member.image.widths[member.image.widths.length - 1]}.webp`,
  worksFor: { '@id': ORGANIZATION_ID },
});

export const teamMembers: readonly TeamMember[] = [...foundingTeam, ...designTeam];

/** The page itself: what it is, which site it belongs to and what it is about. */
const webPageJsonLd = (path: string, entry: PageMetaEntry, service: Service | undefined): StructuredData => ({
  '@type': pageTypes[path] ?? 'WebPage',
  '@id': webPageId(path),
  url: canonicalUrl(path),
  name: entry.title,
  description: entry.description,
  inLanguage: LANGUAGE,
  isPartOf: { '@id': WEBSITE_ID },
  ...(aboutTheCompany.has(path) ? { about: { '@id': ORGANIZATION_ID } } : {}),
  ...(service ? { mainEntity: { '@id': serviceId(service.slug) } } : {}),
  ...(path === '/services' ? { mainEntity: serviceListJsonLd } : {}),
});

/**
 * The JSON-LD graph for a canonical route path, or for the not-found page (null),
 * which carries only the company: it has no canonical URL to describe.
 */
export function structuredDataFor(path: string | null): StructuredData {
  const graph: StructuredData[] = [organizationJsonLd];
  if (path !== null) {
    const entry = pageMeta[path];
    const service = path.startsWith('/services/') ? serviceBySlug(path.slice('/services/'.length)) : undefined;
    if (path === '/') graph.push(websiteJsonLd);
    graph.push(webPageJsonLd(path, entry, service));
    if (service) graph.push(serviceJsonLd(service));
    if (path === '/team') graph.push(...teamMembers.map(personJsonLd));
  }
  return { '@context': 'https://schema.org', '@graph': graph };
}

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
  structuredData: structuredDataFor(path),
  heroPreload: heroPreloadFor(path),
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
  structuredData: structuredDataFor(null),
  heroPreload: null,
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
