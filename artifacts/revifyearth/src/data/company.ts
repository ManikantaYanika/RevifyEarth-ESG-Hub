import { portraits, type ImageAsset } from './media';

/**
 * Company facts.
 *
 * Sourced from the proposal's "Why Revify", "Team of Experts" and contact pages.
 * The founding client is referred to without naming, since the source document is a
 * confidential techno-commercial proposal.
 */

export const company = {
  legalName: 'Revify Private Limited',
  brand: 'RevifyEarth',
  discipline: 'ESG Branding & Sustainability Communication',
  positioning:
    'We turn complex ESG information into one coherent story — technically robust, visually compelling and strategically aligned.',
  mission:
    'To make sustainability performance legible. We exist so that the work organisations genuinely do on climate, water, people and governance is understood by the people it needs to reach.',
  vision:
    'A reporting cycle that produces a communication platform rather than a document — one narrative that holds together from evidence to executive room to public conversation.',
  origin:
    'RevifyEarth began by writing an enterprise’s sustainability report. Across the cycles that followed, the brief widened — from technical review and disclosure enhancement to theme development, report design, print coordination, board support, film and web. That progression is the reason the ecosystem model exists.',
  email: 'info@revifyearth.com',
  website: 'https://revifyearth.com',
  copyright: '© 2026 Revify Private Limited, All rights reserved.',
} as const;

export interface Contact {
  readonly name: string;
  readonly role: string;
  readonly phone: string;
}

export const contacts: readonly Contact[] = [
  { name: 'Pallavi Priya', role: 'Project Manager / CEO', phone: '9608159460' },
  { name: 'Anu Ananya', role: 'Partnership Manager / CFO', phone: '7978869701' },
];

/** "Our Value add — Why Revify?" — six differentiators from the proposal. */
export interface ValueAdd {
  readonly index: string;
  readonly title: string;
  readonly body: string;
}

export const valueAdds: readonly ValueAdd[] = [
  {
    index: '01',
    title: 'ESG Expertise',
    body: 'Deep understanding of sustainability reporting frameworks, climate disclosures, ESG strategy and environmental performance enables us to review reports beyond visual presentation.',
  },
  {
    index: '02',
    title: 'Domain Expertise with Branding & Content',
    body: 'Revify brings together sustainability consulting, strategic communication and creative excellence under one integrated engagement model. Rather than treating sustainability reporting as a design assignment, we approach it as a strategic communication exercise that builds stakeholder confidence and strengthens corporate reputation.',
  },
  {
    index: '03',
    title: 'Strategic Storytelling',
    body: 'We transform technical sustainability information into meaningful narratives that clearly communicate organisational purpose, performance and long-term vision.',
  },
  {
    index: '04',
    title: 'Premium Creative Design',
    body: 'Our editorial approach combines modern visual communication, infographics, data visualisation and stakeholder-centric design principles to enhance readability and engagement.',
  },
  {
    index: '05',
    title: 'Integrated Communication',
    body: 'From technical review and report design to multimedia communication and digital experiences, every deliverable is developed under one unified communication strategy.',
  },
  {
    index: '06',
    title: 'Long-term Partnership',
    body: 'Familiarity with a client’s sustainability journey enables continuity, consistency and faster execution while introducing fresh perspectives every reporting cycle.',
  },
];

/** Reporting frameworks named in the proposal. */
export const frameworks = [
  {
    code: 'GRI',
    name: 'Global Reporting Initiative',
    body: 'Drafts are mapped against GRI Universal and Topic Standards to flag missing, partial and weak disclosures.',
  },
  {
    code: 'BRSR',
    name: 'Business Responsibility & Sustainability Report',
    body: 'SEBI’s sustainability disclosure format for listed companies in India — reviewed for alignment and appropriate cross-referencing across the disclosure set.',
  },
  {
    code: 'UN SDGs',
    name: 'Sustainable Development Goals',
    body: 'Referenced meaningfully and integrated into the narrative rather than added as a standalone compliance exercise.',
  },
] as const;

export interface TeamMember {
  readonly name: string;
  readonly role: string;
  readonly bio: string;
  readonly image: ImageAsset;
}

export const foundingTeam: readonly TeamMember[] = [
  {
    name: 'Pallavi Priya',
    role: 'CEO and ESG Industry Expert',
    bio: '10+ years of industry experience in ESG. Previously Coal India, EY and Asian Paints. BTech in Environment from IIT Delhi, MBA in Sustainability from IIM Lucknow.',
    image: portraits['team-pallavi'],
  },
  {
    name: 'Ananya A',
    role: 'CFO and ESG Industry Expert',
    bio: '10+ years of experience in consulting and quality assurance. BTech in Electrical from ITER, MBA in Sustainability from IIM Lucknow.',
    image: portraits['team-ananya'],
  },
  {
    name: 'Bichitra Nanda',
    role: 'Director',
    bio: 'Retired Civil Servant, Government of Odisha.',
    image: portraits['team-bichitra'],
  },
];

export const designTeam: readonly TeamMember[] = [
  {
    name: 'Sanskar',
    role: 'Marketing & Content Head',
    bio: '',
    image: portraits['team-sanskar'],
  },
  {
    name: 'Sheetal',
    role: 'Report Designer & Content Creator',
    bio: '',
    image: portraits['team-sheetal'],
  },
  {
    name: 'Yanika Manikantha',
    role: 'Web Developer',
    bio: '',
    image: portraits['team-yanika'],
  },
];

export const teamPositioning =
  'Comprising experts from different walks — from experienced retired government administrative officers to professionals from IIM and top B-schools — we bring the expertise to make a sustainability story more impactful.';
