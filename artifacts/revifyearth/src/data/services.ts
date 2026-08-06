import { media, type ImageAsset } from './media';

/**
 * Service catalogue.
 *
 * Every field below is drawn from the RevifyEarth techno-commercial proposal
 * (`attached_assets/Sagility_Proposal_2026_(1)_1786013304086.pdf`) — the service
 * deep-dive pages, the scope-of-work ecosystem page and the inclusions/exclusions
 * page. Client-specific commercials are deliberately excluded from the public site.
 */

export interface ServiceStage {
  readonly index: string;
  readonly title: string;
  readonly points: readonly string[];
}

export interface ServiceFaq {
  readonly question: string;
  readonly answer: string;
}

export interface Service {
  readonly slug: string;
  readonly index: string;
  readonly title: string;
  readonly shortTitle: string;
  readonly tagline: string;
  readonly summary: string;
  readonly overview: readonly string[];
  readonly businessValue: readonly string[];
  readonly deliverables: readonly string[];
  readonly stages: readonly ServiceStage[];
  readonly benefits: readonly string[];
  readonly timeline: string;
  readonly idealClients: string;
  readonly faqs: readonly ServiceFaq[];
  readonly related: readonly string[];
  readonly image: ImageAsset;
  readonly complementary?: boolean;
}

export const services: readonly Service[] = [
  {
    slug: 'content-review',
    index: '01',
    title: 'Content Review & Gap Assessment',
    shortTitle: 'Content Review',
    tagline: 'From a compiled draft to a technically robust and cohesive sustainability narrative.',
    summary:
      'A chapter-by-chapter review that turns disclosure gaps, inconsistencies and fragmented narratives into a clear reporting foundation.',
    overview: [
      'We undertake a comprehensive review of the draft sustainability report to strengthen its disclosure quality, narrative consistency and overall alignment with leading sustainability reporting practices.',
      'The review goes beyond proofreading or editorial correction. It assesses whether the information presented is complete, coherent, adequately substantiated and communicated in a manner appropriate for your stakeholders.',
    ],
    businessValue: [
      'Disclosure gaps surface before design begins, not after publication.',
      'Framework references become accurate and integrated rather than a standalone compliance exercise.',
      'Assurance and review conversations start from a stronger, better-evidenced draft.',
    ],
    deliverables: [
      'A technically reviewed, strengthened and editorially aligned report draft, ready for final design and publication',
      'Chapter-by-chapter gap and inconsistency map',
      'Priority questions for data owners',
      'Framework cross-referencing review across GRI, BRSR and the UN SDGs',
    ],
    stages: [
      {
        index: '01',
        title: 'Comprehensive Gap Assessment',
        points: [
          'Missing, partial or weak disclosures against relevant GRI Universal and Topic Standards',
          'Gaps in the completeness and contextualisation of reported information',
          'Inconsistencies in data, units, reporting boundaries, terminology and year-on-year comparisons',
          'Repetition, fragmented narratives and opportunities for improved cross-referencing',
          'Areas where stronger evidence, explanation or management context would improve disclosure quality',
        ],
      },
      {
        index: '02',
        title: 'Strategic Content Enhancement',
        points: [
          'Environment and climate-related disclosures',
          'Water stewardship and conservation narrative',
          'Decarbonisation journey, interventions and future direction',
          'Executive-level summaries, chapter introductions and concluding narratives',
          'Implementation examples and case narratives where they materially strengthen the report',
        ],
      },
      {
        index: '03',
        title: 'Framework Alignment & Cross-Referencing',
        points: [
          'Alignment review against GRI Standards, BRSR and the UN Sustainable Development Goals',
          'Framework references checked for accuracy and relevance',
          'References integrated meaningfully rather than added as a standalone compliance exercise',
        ],
      },
      {
        index: '04',
        title: 'Final Editorial & Consistency Review',
        points: [
          'Narrative flow and consistency',
          'Terminology and editorial alignment',
          'Cross-references and section linkages',
          'Data presentation consistency',
          'Table, chart and infographic content',
          'Alignment between the final approved content and the designed report',
        ],
      },
    ],
    benefits: [
      'Zero-error discipline applied to data accuracy, consistency and comparability',
      'A single reviewed source of truth before design investment begins',
      'Continuity with an evolving sustainability narrative across reporting cycles',
    ],
    timeline: 'Runs from project kick-off through to the draft non-designed report milestone.',
    idealClients:
      'Teams preparing a sustainability report, or strengthening an existing disclosure cycle before it moves into design.',
    faqs: [
      {
        question: 'Do you collect or verify the underlying ESG data?',
        answer:
          'No. Primary ESG data collection, calculation and independent verification or assurance of reported data sit outside our scope. We review, strengthen and align what your teams provide.',
      },
      {
        question: 'Which frameworks do you review against?',
        answer:
          'GRI Standards (Universal and Topic), BRSR and the UN Sustainable Development Goals — checked for accuracy, relevance and meaningful integration.',
      },
    ],
    related: ['report-design', 'integrated-communication'],
    image: media.forestMist,
  },
  {
    slug: 'report-design',
    index: '02',
    title: 'Sustainability Report Design',
    shortTitle: 'Report Design',
    tagline: 'Building a distinctive visual identity for the sustainability story.',
    summary:
      'A distinctive editorial system with five creative theme directions, custom visualisations and unlimited iterative reviews.',
    overview: [
      'The sustainability report is developed as your flagship ESG communication asset. The design approach combines strong editorial principles with data visualisation and sustainability storytelling, so complex information becomes easier to navigate, understand and retain.',
      'The creative process begins with an assessment of your key developments, achievements and emerging sustainability narrative for the reporting year. From that understanding we develop five distinct theme directions for consideration.',
    ],
    businessValue: [
      'A report stakeholders will actually read, navigate and return to.',
      'A reusable visual system rather than a one-off document layout.',
      'Complete ownership of the artwork and creative assets produced.',
    ],
    deliverables: [
      'Five creative theme and visual direction options',
      'Theme rationale linked to the reporting-year sustainability journey',
      'Cover design and chapter-opening concepts',
      'A consistent visual system covering typography, colour, iconography and graphic elements',
      'Custom infographics, charts, timelines and process visualisations',
      'Premium licensed stock imagery and required creative assets',
      'Interactive PDF with navigational elements, where technically appropriate',
      'Print-ready artwork',
    ],
    stages: [
      {
        index: '01',
        title: 'Narrative assessment',
        points: [
          'Review of the reporting year’s key developments and achievements',
          'Identification of the emerging sustainability narrative',
        ],
      },
      {
        index: '02',
        title: 'Five theme directions',
        points: [
          'Five distinct creative and visual directions for consideration',
          'Each direction carries a rationale linked to the reporting year',
        ],
      },
      {
        index: '03',
        title: 'System build',
        points: [
          'Typography, colour, iconography and graphic elements',
          'Cover and chapter-opening concepts',
          'Custom infographics, charts, timelines and process visualisations',
        ],
      },
      {
        index: '04',
        title: 'Iteration to approval',
        points: [
          'Fortnightly connect on progress review',
          'Multiple iterative review cycles through to final approval',
          'No predefined page limit',
        ],
      },
    ],
    benefits: [
      'Unlimited iterations on report design',
      'No predefined page limit',
      'Complete ownership of final artwork',
      'Premium licensed imagery included within the agreed project requirements',
    ],
    timeline: 'The core design phase, running from theme approval through the first designed draft to final sign-off.',
    idealClients:
      'Organisations that want their report to feel authoritative, distinctive and genuinely useful to stakeholders.',
    faqs: [
      {
        question: 'How many rounds of changes are included?',
        answer:
          'Multiple reasonable iterations until final approval, with no fixed cap on report design revisions. Major changes to approved content or creative direction after final stage approval are handled separately.',
      },
      {
        question: 'Is there a page limit?',
        answer: 'No. There is no predefined page limit for the sustainability report.',
      },
    ],
    related: ['content-review', 'print-production', 'board-presentation'],
    image: media.mountain,
  },
  {
    slug: 'print-production',
    index: '03',
    title: 'Sustainable Print Production',
    shortTitle: 'Print Production',
    tagline: 'Translating the digital report into a premium physical publication.',
    summary:
      'FSC-certified and recycled paper options, proofing and considered production for a report that feels as responsible as its content.',
    overview: [
      'We coordinate the printing and production of the final approved report, with an emphasis on quality, durability and responsible material selection.',
      'The physical object carries the same sustainability commitment as the disclosures inside it — from stock selection through to the quality check before dispatch.',
    ],
    businessValue: [
      'A boardroom-grade physical artefact that reflects the seriousness of the disclosure.',
      'Responsible material choices that stand up to scrutiny in a sustainability context.',
      'One accountable partner across design, proofing, production and delivery.',
    ],
    deliverables: [
      'FSC-certified and/or recycled paper options',
      'Premium paper GSM (75–130) matched to final page count and binding requirements',
      'Premium cover stock with suitable finishing',
      'Perfect binding for a professional feel',
      'Pre-production quality check and print proof review',
      'Quality assurance before dispatch and delivery to the specified location',
    ],
    stages: [
      { index: '01', title: 'Specification', points: ['Stock, GSM and binding selected against final page count', 'Cover stock and finishing agreed'] },
      { index: '02', title: 'Proofing', points: ['Pre-production quality check', 'Print proof review before the run'] },
      { index: '03', title: 'Production & delivery', points: ['Quality assurance before dispatch', 'Delivery to the specified location'] },
    ],
    benefits: [
      'Responsible stock without compromising finish',
      'Errors caught at proof stage rather than after the print run',
      'Printing and delivery of the agreed number of copies included',
    ],
    timeline: 'Begins once the designed report is approved; sequenced ahead of the results presentation.',
    idealClients: 'Teams creating a premium printed report without losing sight of responsible production.',
    faqs: [
      {
        question: 'How many copies are included?',
        answer:
          'Printing and delivery of the agreed number of copies is included. Quantities beyond that agreed number are handled as a separate scope item.',
      },
      {
        question: 'What paper weight do you recommend?',
        answer:
          'Between 75 and 130 GSM, selected against the final page count and binding requirement for durability and finish.',
      },
    ],
    related: ['report-design'],
    image: media.cliff,
  },
  {
    slug: 'board-presentation',
    index: '04',
    title: 'Board Presentation Support',
    shortTitle: 'Board Presentations',
    tagline: 'The reporting year, distilled for the people who set direction.',
    summary:
      'An executive-level presentation distilling reporting-year highlights, key indicators and strategic forward-looking priorities.',
    overview: [
      'We develop one executive-level board and leadership presentation based on the final sustainability report, distilling the detailed document into a concise decision-maker format.',
      'The presentation follows the approved report’s visual identity to ensure consistency across leadership and external communication.',
    ],
    businessValue: [
      'Leadership engages with the reporting year without reading 120 pages.',
      'A consistent visual identity between the report and the boardroom.',
      'Forward-looking priorities framed for decision-making, not compliance.',
    ],
    deliverables: [
      'Reporting-year sustainability highlights',
      'Key ESG performance indicators',
      'Significant initiatives and outcomes',
      'Climate and environmental developments',
      'Progress against priorities and commitments',
      'Strategic focus areas and forward-looking priorities',
    ],
    stages: [
      { index: '01', title: 'Distillation', points: ['Selection of the indicators and outcomes that matter at board level'] },
      { index: '02', title: 'Narrative structure', points: ['An executive arc from performance to forward priorities'] },
      { index: '03', title: 'Visual alignment', points: ['Built in the approved report identity for consistency'] },
    ],
    benefits: [
      'One coherent story across report and leadership forum',
      'Decision-ready framing of ESG performance',
    ],
    timeline: 'Developed once the report content is approved, ahead of the final results presentation.',
    idealClients: 'Leadership teams that need a confident, concise way to take sustainability work into the boardroom.',
    faqs: [
      {
        question: 'How many presentations are included?',
        answer: 'One executive board or leadership presentation, based on the final approved sustainability report.',
      },
    ],
    related: ['report-design', 'integrated-communication'],
    image: media.mountainSunset,
    complementary: true,
  },
  {
    slug: 'video-report',
    index: '05',
    title: 'Video Report',
    shortTitle: 'Video Reports',
    tagline: 'Transforming a detailed sustainability report into an engaging visual story.',
    summary:
      'A 5–7 minute visual narrative with script, storyboard, motion graphics, animated KPIs and Full HD output.',
    overview: [
      'The sustainability video report provides a more accessible and engaging way to communicate your sustainability journey to stakeholders who may not engage with the complete written report.',
      'Rather than reproducing the report page by page, the video distils its most important messages into a coherent 5–7 minute visual narrative — aligned with the final report theme, so print, digital and multimedia communication stay consistent.',
    ],
    businessValue: [
      'Reach stakeholders who will never open the PDF.',
      'One asset that works across leadership forums, employee communication and social channels.',
      'Animated KPIs make performance legible in seconds.',
    ],
    deliverables: [
      'One professionally produced 5–7 minute sustainability video report',
      'Full HD (1080p) output',
      'Two 30-second cutdowns for social channels',
      'Narrative and creative concept, script and storyboard',
      'Motion graphics, animation and animated ESG KPIs',
      'In-house background music production, licensed for the intended use',
    ],
    stages: [
      {
        index: '01',
        title: 'Narrative & Creative Concept',
        points: [
          'Overall video concept and storytelling approach',
          'Narrative structure and sequence',
          'Script based on the final approved report',
          'Storyboard defining scenes, transitions and visual treatment',
          'Alignment with the approved report theme',
        ],
      },
      {
        index: '02',
        title: 'Visual Production',
        points: [
          'Motion graphics and animation',
          'Animated ESG KPIs and data visualisations',
          'Report graphics and visual elements',
          'Client-provided photographs and video footage',
          'Licensed stock footage, where required',
          'On-screen text and narrative transitions',
        ],
      },
      {
        index: '03',
        title: 'Audio & Post-Production',
        points: [
          'Background music licensed for the intended use',
          'Voice-over support, where included in the approved creative direction',
          'Editing and synchronisation',
          'Transitions and motion treatment',
          'Final quality review and rendering',
        ],
      },
    ],
    benefits: [
      'Usable across corporate website, leadership forums, employee communication, customer engagement, social and digital channels, corporate events and Instagram, Facebook and YouTube',
      'Consistent with the report’s approved visual identity',
    ],
    timeline: 'Produced from the approved report narrative; delivered ahead of the final results presentation.',
    idealClients:
      'Organisations looking to make sustainability information more accessible across internal and external audiences.',
    faqs: [
      {
        question: 'Do you shoot original footage on location?',
        answer:
          'Standard production works from provided and licensed digital assets. Original on-location photography or videography, studio production and professional talent are arranged separately if required.',
      },
      {
        question: 'Can the video be translated?',
        answer: 'Translation into additional languages is available as a separately agreed scope item.',
      },
    ],
    related: ['webpage-development', 'integrated-communication'],
    image: media.volcano,
  },
  {
    slug: 'webpage-development',
    index: '06',
    title: 'Sustainability Report Webpage Development',
    shortTitle: 'ESG Websites',
    tagline: 'Extending the sustainability narrative into an accessible digital experience.',
    summary:
      'A responsive digital home for the report — from sustainability overview and thematic content to video and downloadable access.',
    overview: [
      'We develop a dedicated digital webpage that presents the key highlights of the reporting year in an accessible and visually engaging format.',
      'The webpage does not simply host a downloadable PDF. It gives stakeholders a concise digital gateway to sustainability performance, and directs them to the complete report for detailed disclosures.',
    ],
    businessValue: [
      'A discoverable, shareable home for the reporting year.',
      'Performance highlights that work on a phone, not just in print.',
      'A permanent link that outlives the launch cycle.',
    ],
    deliverables: [
      'One responsive sustainability report webpage',
      'Interactive report overview',
      'ESG performance dashboard',
      'Embedded sustainability video',
      'Downloadable report access',
      'Mobile-responsive design',
    ],
    stages: [
      { index: '01', title: 'Sustainability Overview', points: ['A concise introduction to the sustainability approach and the central narrative of the report'] },
      { index: '02', title: 'Key ESG Highlights', points: ['Selected achievements and performance indicators presented through visual cards, counters and graphics'] },
      { index: '03', title: 'Thematic Content', points: ['Selected highlights across relevant environmental, social and governance themes, based on the final approved report'] },
      { index: '04', title: 'Video Integration', points: ['Embedding the sustainability video report as an alternative multimedia route into the story'] },
      { index: '05', title: 'Report Access', points: ['Clear access to the complete report through a downloadable PDF and/or report-viewing link'] },
    ],
    benefits: [
      'Standard responsive webpage development included',
      'A digital gateway that complements rather than duplicates the report',
    ],
    timeline: 'Built alongside the video workstream once report content is approved.',
    idealClients: 'Teams that want their report to be discoverable, shareable and easy to explore on every device.',
    faqs: [
      {
        question: 'Does this change our existing corporate website?',
        answer:
          'No. Changes to core website infrastructure or backend systems sit outside scope, as do third-party hosting, domain, paid plugins and enterprise software costs.',
      },
    ],
    related: ['video-report', 'integrated-communication'],
    image: media.iceberg,
    complementary: true,
  },
  {
    slug: 'integrated-communication',
    index: '07',
    title: 'Integrated ESG Communication',
    shortTitle: 'Integrated Communication',
    tagline: 'One story. Multiple stakeholder touchpoints.',
    summary:
      'One coherent strategy moving from technical review to report, print, video and web — without losing the thread.',
    overview: [
      'Rather than creating independent deliverables, we develop an integrated communication ecosystem where every output reinforces a single sustainability narrative.',
      'The ecosystem is built to serve different communication channels and different stakeholders, moving from print to video to web while the narrative architecture, visual language and strategic priorities stay constant.',
    ],
    businessValue: [
      'One narrative architecture instead of five disconnected deliverables.',
      'Every touchpoint reinforces the others rather than competing with them.',
      'A durable communication platform rather than a document that disappears after publication.',
    ],
    deliverables: [
      'Integrated engagement direction across all workstreams',
      'Shared narrative architecture',
      'Consistent visual language across report, print, presentation, video and web',
      'Connected stakeholder touchpoints',
      'Project management across all agreed workstreams',
    ],
    stages: [
      { index: '01', title: 'Content Review', points: ['The reviewed, evidence-checked foundation everything else is built on'] },
      { index: '02', title: 'Report Designing', points: ['The editorial system that sets the visual language'] },
      { index: '03', title: 'Sustainable Print', points: ['The physical expression of the reporting year'] },
      { index: '04', title: 'Visual Report', points: ['The narrative in motion, for audiences who will not read the document'] },
      { index: '05', title: 'Webpage Development', points: ['The permanent, accessible digital gateway'] },
    ],
    benefits: [
      'A single sustainability narrative across every channel',
      'Continuity, consistency and faster execution across reporting cycles',
      'One accountable partner for the whole ecosystem',
    ],
    timeline: 'Spans the full engagement, from kick-off through to the final results presentation.',
    idealClients:
      'Organisations ready to move beyond a single document and build a more durable sustainability communication platform.',
    faqs: [
      {
        question: 'Can we start with one workstream and add others later?',
        answer:
          'Yes. Engagements are scoped to the brief. The ecosystem is designed so each workstream stands on its own while remaining consistent with the others.',
      },
    ],
    related: ['content-review', 'report-design', 'video-report', 'webpage-development'],
    image: media.heroBirds,
  },
];

export const serviceBySlug = (slug: string): Service | undefined =>
  services.find((service) => service.slug === slug);

/** The five-pillar ecosystem shown on the scope-of-work page of the proposal. */
export const ecosystemPillars = [
  { index: '1', title: 'Content Review', headline: 'Zero Error', slug: 'content-review' },
  { index: '2', title: 'Report Designing', headline: 'Complete Ownership', slug: 'report-design' },
  { index: '3', title: 'Sustainable Print', headline: 'Responsible Production', slug: 'print-production' },
  { index: '4', title: 'Visual Report', headline: 'Narrative in Motion', slug: 'video-report' },
  { index: '5', title: 'Webpage Development', headline: 'Always Accessible', slug: 'webpage-development' },
] as const;
