/**
 * Topic clusters — the site's search architecture (SEO Phases D and F).
 *
 * Each cluster is one subject a visitor searches for, owned by exactly one page (the
 * pillar). Supporting pages go deeper on part of it and link back. Owning a subject
 * on one page is what stops two pages competing for the same query, so the build
 * fails if a page is the pillar of two clusters or a link points at a route that is
 * not indexable (vite-plugins/seo-prerender.ts).
 *
 * `name` and `summary` are visible (the topic guide on /resources); `intent` and
 * `terms` are the internal keyword map and are never rendered. Every summary is drawn
 * from copy the site already carries — no claims are introduced here.
 *
 * Deliberately not dedicated pages yet: BRSR and GRI share the /expertise pillar
 * because the site's own material on each is one review discipline, not enough for a
 * page apiece. The criteria for splitting them out are in docs/seo.md.
 *
 * Imported by the Vite config at build time: plain data, relative imports only.
 */

export interface TopicLink {
  readonly href: string;
  readonly label: string;
}

export interface TopicCluster {
  readonly id: string;
  readonly name: string;
  readonly summary: string;
  /** Internal: what someone searching this subject is trying to do. */
  readonly intent: 'commercial' | 'informational' | 'commercial-investigation';
  /** Internal: the queries this cluster's pillar should answer. Not rendered. */
  readonly terms: readonly string[];
  /** The one page that owns the subject. */
  readonly pillar: TopicLink;
  /** Pages that cover part of the subject in more depth. */
  readonly supporting: readonly TopicLink[];
}

export const topicClusters: readonly TopicCluster[] = [
  {
    id: 'reporting',
    name: 'ESG & sustainability reporting',
    summary:
      'Seven connected services, from reviewing the draft report to its webpage — commissioned together or one workstream at a time.',
    intent: 'commercial',
    terms: ['ESG reporting services', 'sustainability reporting services', 'sustainability report support'],
    pillar: { href: '/services', label: 'ESG reporting services' },
    supporting: [],
  },
  {
    id: 'frameworks',
    name: 'GRI, BRSR & the UN SDGs',
    summary:
      'How drafts are mapped against GRI Standards, aligned with BRSR and connected to the SDGs — integrated into the narrative rather than appended.',
    intent: 'informational',
    terms: ['GRI Standards reporting', 'BRSR reporting', 'BRSR alignment', 'ESG reporting frameworks', 'UN SDG reporting'],
    pillar: { href: '/expertise', label: 'Framework expertise' },
    supporting: [{ href: '/services/content-review', label: 'Framework cross-referencing review' }],
  },
  {
    id: 'review',
    name: 'Report review & gap assessment',
    summary:
      'A chapter-by-chapter review that surfaces missing, partial and inconsistent disclosures before design begins.',
    intent: 'commercial-investigation',
    terms: ['sustainability report review', 'ESG report gap assessment', 'disclosure gap analysis', 'BRSR report review'],
    pillar: { href: '/services/content-review', label: 'Content review & gap assessment' },
    supporting: [{ href: '/process', label: 'Where review sits in the timeline' }],
  },
  {
    id: 'design',
    name: 'Sustainability report design',
    summary:
      'Five theme directions, custom data visualisation and print-ready artwork, carried through to responsibly printed copies.',
    intent: 'commercial',
    terms: ['sustainability report design', 'ESG report design', 'annual sustainability report design agency'],
    pillar: { href: '/services/report-design', label: 'Report design' },
    supporting: [{ href: '/services/print-production', label: 'Sustainable print production' }],
  },
  {
    id: 'communication',
    name: 'ESG communication',
    summary: 'One sustainability narrative carried from the report into the boardroom, a video report and the web.',
    intent: 'commercial-investigation',
    terms: ['ESG communication', 'sustainability communication', 'sustainability branding', 'ESG video report'],
    pillar: { href: '/services/integrated-communication', label: 'Integrated ESG communication' },
    supporting: [{ href: '/sustainability-branding', label: 'One identity across formats' }],
  },
  {
    id: 'process',
    name: 'The reporting process',
    summary: 'Five phases from kick-off to results presentation, with ownership and dependencies stated up front.',
    intent: 'informational',
    terms: ['ESG reporting process', 'sustainability report timeline', 'sustainability reporting steps'],
    pillar: { href: '/process', label: 'Our reporting process' },
    supporting: [{ href: '/projects', label: 'How an engagement is built' }],
  },
  {
    id: 'sectors',
    name: 'Sector context',
    summary:
      'What each sector’s disclosure profile asks of a report, from governance depth in BFSI to emissions intensity in manufacturing.',
    intent: 'informational',
    terms: ['industry ESG reporting', 'sector-specific ESG disclosure', 'BFSI ESG reporting', 'manufacturing ESG reporting'],
    pillar: { href: '/industries', label: 'Industries we serve' },
    supporting: [],
  },
];

/**
 * A service page's onward link to the hub page for the subject it serves, alongside
 * "How the engagement runs". Services already cross-link to each other through
 * `related`; these connect them upward. Omitted where the only fitting target is
 * already linked from the page.
 */
export const serviceContextLinks: Readonly<Record<string, TopicLink>> = {
  'content-review': { href: '/expertise', label: 'GRI, BRSR & SDG expertise' },
  'report-design': { href: '/sustainability-branding', label: 'Sustainability branding across formats' },
  'board-presentation': { href: '/sustainability-branding', label: 'The identity, report to boardroom' },
  'video-report': { href: '/sustainability-branding', label: 'How the film carries the identity' },
  'webpage-development': { href: '/sustainability-branding', label: 'The identity on the web' },
  'integrated-communication': { href: '/projects', label: 'How an engagement is built' },
};
