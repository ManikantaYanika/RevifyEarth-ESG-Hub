import { media, type ImageAsset } from './media';

/**
 * Sectors RevifyEarth is positioned to serve.
 *
 * The proposal does not enumerate industries served, so these are framed as target
 * sectors with the ESG reporting context each one carries — not as claimed client
 * work. The reporting challenges described are properties of the sector's
 * disclosure profile under GRI and BRSR, not assertions about past engagements.
 */
export interface Industry {
  readonly id: string;
  readonly name: string;
  readonly lede: string;
  readonly challenge: string;
  readonly focus: readonly string[];
  readonly image: ImageAsset;
}

export const industries: readonly Industry[] = [
  {
    id: 'healthcare',
    name: 'Healthcare & Life Sciences',
    lede: 'Where the social dimension carries as much weight as the environmental one.',
    challenge:
      'Care-delivery organisations hold rich workforce, access and outcome data, but it rarely arrives in the report as a connected narrative. The environmental footprint sits across facilities, logistics and a long supplier tail.',
    focus: ['Workforce wellbeing and retention narrative', 'Access and patient-outcome disclosure', 'Facilities energy and clinical waste', 'Supply-chain and Scope 3 boundaries'],
    image: media.forestMist,
  },
  {
    id: 'manufacturing',
    name: 'Manufacturing',
    lede: 'Where the numbers are strong and the story is usually underbuilt.',
    challenge:
      'Emissions intensity, water and waste data are typically well instrumented. The gap is contextualisation — explaining what the trend means, what drove it, and what happens next.',
    focus: ['Emissions intensity and decarbonisation pathway', 'Circularity and materials narrative', 'Water stewardship and conservation', 'Supplier and value-chain disclosure'],
    image: media.volcano,
  },
  {
    id: 'bfsi',
    name: 'BFSI',
    lede: 'Where governance depth and financed impact define the disclosure.',
    challenge:
      'The material footprint sits in the portfolio rather than the premises. Reporting has to make governance structures and financed exposure legible without drowning the reader in methodology.',
    focus: ['Financed emissions framing', 'Governance and board oversight depth', 'BRSR alignment and cross-referencing', 'Responsible product and inclusion narrative'],
    image: media.iceberg,
  },
  {
    id: 'energy',
    name: 'Energy & Resources',
    lede: 'Where transition credibility is the entire communication problem.',
    challenge:
      'Stakeholders arrive sceptical. Disclosure has to hold operational complexity, transition commitments and the human consequences of change in the same narrative without special pleading.',
    focus: ['Transition pathway and interim targets', 'Decarbonisation interventions and future direction', 'Just-transition and community narrative', 'Climate risk integration'],
    image: media.mountainSunset,
  },
  {
    id: 'it',
    name: 'IT & Business Services',
    lede: 'Where value is people-led and the footprint is mostly indirect.',
    challenge:
      'Direct emissions are modest, so credibility rests on Scope 3, data-centre energy and the quality of the human-capital story — the hardest things to evidence well.',
    focus: ['Scope 3 boundary and methodology clarity', 'Data-centre and cloud energy narrative', 'Human capital, skills and inclusion', 'Client and community value creation'],
    image: media.cliff,
  },
  {
    id: 'infrastructure',
    name: 'Infrastructure & Built Environment',
    lede: 'Where decisions outlive the reporting cycle by decades.',
    challenge:
      'Embodied carbon, land use and community impact play out over asset lifetimes. Annual reporting has to connect a single year to a multi-decade commitment.',
    focus: ['Embodied carbon and materials selection', 'Land use, biodiversity and community impact', 'Long-horizon asset resilience', 'Safety and workforce disclosure'],
    image: media.mountain,
  },
];
