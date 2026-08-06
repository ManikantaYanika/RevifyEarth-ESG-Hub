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
