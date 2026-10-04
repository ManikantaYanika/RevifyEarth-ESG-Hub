/**
 * Resources, FAQs and trust content.
 *
 * The proposal contains no testimonials, awards, partner list, client logos or
 * published performance metrics. Rather than invent them, those sections are built
 * as real components fed by `pendingContent` — they render an explicit
 * "awaiting verified content" state so the layout is production-ready the moment
 * real material is supplied. Nothing below asserts a fact the source cannot support.
 */

export interface Faq {
  readonly question: string;
  readonly answer: string;
}

/** All answers below are drawn from the proposal's scope, inclusions and exclusions. */
export const faqs: readonly Faq[] = [
  {
    question: 'What does an integrated engagement actually cover?',
    answer:
      'Content review and gap assessment, sustainability report theme development and design, sustainable print production, board presentation support, a Full HD video report, and a responsive sustainability webpage — delivered under one narrative architecture with project management across all workstreams.',
  },
  {
    question: 'How long does a reporting cycle take?',
    answer:
      'The indicative timeline runs across five phases from kick-off to results presentation. Data collection timeframes vary; the plan assumes up to six weeks for data collection, and delivery depends on timely receipt of inputs, consolidated feedback and approvals.',
  },
  {
    question: 'Do you collect or assure our ESG data?',
    answer:
      'No. Primary ESG data collection, calculation and independent verification or assurance sit outside scope, as do new standalone technical studies not already available as project inputs. We review, strengthen and communicate what your teams provide.',
  },
  {
    question: 'How many design iterations are included?',
    answer:
      'Five initial creative theme directions and multiple reasonable iterations until final approval, with no fixed cap on report design revisions and no predefined page limit.',
  },
  {
    question: 'Which reporting frameworks do you work across?',
    answer:
      'GRI Standards (Universal and Topic), BRSR and the UN Sustainable Development Goals — reviewed for accuracy, relevance and meaningful integration rather than bolt-on compliance references.',
  },
  {
    question: 'Can we commission only part of the ecosystem?',
    answer:
      'Yes. Engagements are scoped to the brief. Each workstream stands on its own while staying consistent with the others, so you can begin with review and design and extend into film and web in a later cycle.',
  },
  {
    question: 'What do you need from us?',
    answer:
      'A compiled report draft or the underlying content, access to data owners for clarification, timely consolidated feedback at each review stage, and approvals at the agreed decision points.',
  },
  {
    question: 'Is the printed report included?',
    answer:
      'Printing and delivery of the agreed number of copies is included, on FSC-certified and/or recycled stock between 75 and 130 GSM with perfect binding. Quantities beyond the agreed number are a separate scope item.',
  },
];

/**
 * Sections that need verified company material before they can carry real content.
 * Each is rendered with a visible placeholder state rather than invented facts.
 */
export interface PendingSection {
  readonly id: string;
  readonly title: string;
  readonly intro: string;
  readonly needed: readonly string[];
}

export const pendingContent: readonly PendingSection[] = [
  {
    id: 'case-studies',
    title: 'Case studies',
    intro:
      'Engagement write-ups with named outcomes, published once client permission and verified results are confirmed.',
    needed: ['Client permission to name the engagement', 'Agreed outcome metrics', 'Report imagery cleared for publication'],
  },
  {
    id: 'testimonials',
    title: 'Client testimonials',
    intro: 'Attributed quotes from sustainability and communications leads.',
    needed: ['Written quote', 'Name, role and organisation', 'Approval to publish'],
  },
  {
    id: 'awards',
    title: 'Awards & recognition',
    intro: 'Reporting and design awards received for delivered work.',
    needed: ['Award name and issuing body', 'Year and category', 'Verification link'],
  },
  {
    id: 'partners',
    title: 'Partners & accreditations',
    intro: 'Print, assurance and technology partners, plus any held accreditations.',
    needed: ['Partner list with permission to display marks', 'Accreditation certificates and validity dates'],
  },
];

/**
 * Editorial pipeline — topics grounded in the proposal's own subject matter. Each
 * links to the page that covers its subject in full.
 */
export const insightTopics = [
  {
    title: 'Reading a draft against GRI Universal and Topic Standards',
    kicker: 'Disclosure quality',
    body: 'What a chapter-by-chapter gap assessment actually looks for: missing and partial disclosures, boundary inconsistencies, and year-on-year comparability.',
    link: { href: '/services/content-review', label: 'The gap assessment' },
  },
  {
    title: 'Why framework references fail credibility checks',
    kicker: 'Framework alignment',
    body: 'Cross-referencing to GRI, BRSR and the SDGs only builds trust when the references are integrated into the narrative rather than appended as a compliance table.',
    link: { href: '/expertise', label: 'Our framework expertise' },
  },
  {
    title: 'The report is not the deliverable',
    kicker: 'Integrated communication',
    body: 'One story across print, film and web reaches stakeholders who will never open a 120-page PDF — and keeps the reporting year alive past launch week.',
    link: { href: '/services/integrated-communication', label: 'Integrated ESG communication' },
  },
];
