/**
 * Enterprise navigation model.
 *
 * Five top-level groups, each rendering as a mega-menu panel on desktop and an
 * accordion on mobile. Every destination below resolves to a real route or a real
 * in-page anchor — nothing here is decorative.
 */
export interface NavLink {
  readonly label: string;
  readonly href: string;
  readonly summary: string;
}

export interface NavGroup {
  readonly label: string;
  readonly href: string;
  readonly intro: string;
  readonly links: readonly NavLink[];
}

export const navGroups: readonly NavGroup[] = [
  {
    label: 'Platform',
    href: '/sustainability-branding',
    intro: 'One sustainability narrative, carried consistently across every stakeholder touchpoint.',
    links: [
      { label: 'ESG Strategy & Advisory', href: '/expertise', summary: 'Framework alignment, disclosure quality and reporting direction.' },
      { label: 'ESG Report Design', href: '/services/report-design', summary: 'Editorial systems, data visualisation and narrative architecture.' },
      { label: 'ESG Branding', href: '/sustainability-branding', summary: 'One identity across report, print, board, film and web.' },
      { label: 'ESG Websites', href: '/services/webpage-development', summary: 'A responsive digital home for the reporting year.' },
      { label: 'Video Reports', href: '/services/video-report', summary: 'A 5–7 minute visual narrative built from the approved report.' },
      { label: 'Board Presentations', href: '/services/board-presentation', summary: 'Executive-level distillation for leadership forums.' },
    ],
  },
  {
    label: 'Solutions',
    href: '/industries',
    intro: 'Sector context shapes the evidence, the language and the expectations.',
    links: [
      { label: 'Healthcare & Life Sciences', href: '/industries#healthcare', summary: 'Patient outcomes, workforce wellbeing and care-delivery footprint.' },
      { label: 'Manufacturing', href: '/industries#manufacturing', summary: 'Emissions intensity, circularity and supply-chain disclosure.' },
      { label: 'BFSI', href: '/industries#bfsi', summary: 'Financed emissions, governance depth and BRSR alignment.' },
      { label: 'Energy & Resources', href: '/industries#energy', summary: 'Transition pathways, decarbonisation and just-transition narrative.' },
      { label: 'IT & Business Services', href: '/industries#it', summary: 'Scope 3, data-centre energy and people-led value creation.' },
      { label: 'Infrastructure & Built Environment', href: '/industries#infrastructure', summary: 'Embodied carbon, community impact and long-horizon assets.' },
    ],
  },
  {
    label: 'Services',
    href: '/services',
    intro: 'Seven connected workstreams, delivered under one engagement model.',
    links: [
      { label: 'Content Review & Gap Assessment', href: '/services/content-review', summary: 'Chapter-by-chapter review against GRI Universal and Topic Standards.' },
      { label: 'Sustainability Report Design', href: '/services/report-design', summary: 'Five theme directions, no page limit, unlimited iterations.' },
      { label: 'Sustainable Print Production', href: '/services/print-production', summary: 'FSC-certified stock, 75–130 GSM, perfect binding, proofed.' },
      { label: 'Board Presentation Support', href: '/services/board-presentation', summary: 'One executive presentation in the approved visual identity.' },
      { label: 'Video Report', href: '/services/video-report', summary: 'Full HD narrative plus two 30-second social cutdowns.' },
      { label: 'Webpage Development', href: '/services/webpage-development', summary: 'Interactive overview, ESG dashboard and report access.' },
      { label: 'Integrated ESG Communication', href: '/services/integrated-communication', summary: 'The full ecosystem under one narrative architecture.' },
    ],
  },
  {
    label: 'Resources',
    href: '/resources',
    intro: 'Reference material for teams preparing a reporting cycle.',
    links: [
      { label: 'Engagement Model', href: '/projects', summary: 'How an integrated engagement comes together.' },
      { label: 'Insights', href: '/resources#insights', summary: 'Perspectives on disclosure quality and reporting practice.' },
      { label: 'Frameworks We Work Across', href: '/expertise#frameworks', summary: 'GRI, BRSR and the UN Sustainable Development Goals.' },
      { label: 'FAQs', href: '/resources#faqs', summary: 'Scope, timelines, inclusions and what we need from you.' },
    ],
  },
  {
    label: 'Company',
    href: '/about',
    intro: 'Revify Private Limited — ESG branding and sustainability communication.',
    links: [
      { label: 'About RevifyEarth', href: '/about', summary: 'Why we exist and how we work.' },
      { label: 'Our Process', href: '/process', summary: 'Five phases from kick-off to results presentation.' },
      { label: 'Team', href: '/team', summary: 'Founding team and core designing team.' },
      { label: 'Careers', href: '/about#careers', summary: 'Working at Revify.' },
      { label: 'Contact', href: '/contact', summary: 'Start a conversation about your reporting cycle.' },
    ],
  },
];

/** Flat lookup used by the router, sitemap and breadcrumb logic. */
export const primaryRoutes = [
  '/',
  '/about',
  '/services',
  '/expertise',
  '/sustainability-branding',
  '/industries',
  '/process',
  '/team',
  '/projects',
  '/resources',
  '/contact',
] as const;
