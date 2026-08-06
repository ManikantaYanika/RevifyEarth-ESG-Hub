/**
 * Project methodology, indicative timeline and scope boundaries.
 * Taken from the proposal's project methodology, timeline and
 * inclusions/exclusions pages.
 */

export interface Phase {
  readonly index: string;
  readonly title: string;
  readonly owner: 'Revify' | 'Client' | 'Both';
  readonly steps: readonly string[];
  readonly detail: string;
}

export const phases: readonly Phase[] = [
  {
    index: '01',
    title: 'Kick-off & scope confirmation',
    owner: 'Both',
    steps: ['Confirm project scope and boundaries', 'Issue data collection template(s)'],
    detail:
      'The engagement opens by fixing scope, boundaries and reporting perimeter, then issuing the templates your teams will populate. Getting this right is what keeps every later phase from re-opening settled questions.',
  },
  {
    index: '02',
    title: 'Review & report design',
    owner: 'Revify',
    steps: ['Literature review', 'Data collection support', 'Gap analysis', 'Theme development and report design'],
    detail:
      'Running in parallel: a chapter-by-chapter technical review against GRI Universal and Topic Standards, and the creative work that turns the reviewed content into five theme directions and then a designed draft.',
  },
  {
    index: '03',
    title: 'Video report production',
    owner: 'Revify',
    steps: ['Narrative and creative concept', 'Script and storyboard', 'Visual production'],
    detail:
      'Once the report narrative is approved, the same story is rebuilt for motion — concept, script, storyboard, then motion graphics and animated ESG KPIs aligned to the approved report theme.',
  },
  {
    index: '04',
    title: 'Webpage development',
    owner: 'Revify',
    steps: ['Interactive overview build', 'ESG performance dashboard', 'Video integration and report access'],
    detail:
      'The digital gateway is assembled from approved content: overview, highlights, thematic sections, embedded film and clear access to the full report.',
  },
  {
    index: '05',
    title: 'Project closure & results',
    owner: 'Both',
    steps: ['Consolidate results and final report', 'Presentation of results'],
    detail:
      'Everything converges: the final report, the print run, the board presentation, the film and the webpage — presented back as one connected outcome.',
  },
];

/** Milestones A–F from the indicative project timeline. */
export const milestones = [
  { key: 'A', title: 'Project kick-off' },
  { key: 'B', title: 'Draft non-designed report' },
  { key: 'C', title: 'Data collection deadline' },
  { key: 'D', title: 'Gap analysis' },
  { key: 'E', title: 'Video report' },
  { key: 'F', title: 'Final results presentation' },
] as const;

export const timelineNote =
  'Data collection timeframes may vary. The indicative project timeline assumes up to six weeks for data collection, and delivery depends on timely receipt of inputs, consolidated feedback and approvals.';

export const inclusions: readonly string[] = [
  'Project management across all agreed workstreams',
  'ESG review and content enhancement within the agreed report scope',
  'Five initial creative theme directions',
  'Multiple reasonable iterations until final approval',
  'Unlimited iterations on report design',
  'Licensed creative assets required for the agreed report and video treatment',
  'Standard Full HD video production based primarily on provided and licensed digital assets',
  'Standard responsive webpage development',
  'Printing of the agreed number of report copies and delivery',
];

export const exclusions: readonly string[] = [
  'Primary ESG data collection, calculation or independent verification/assurance of reported data',
  'New standalone technical studies, assessments or calculations not already available as project inputs',
  'Original on-location photography or videography unless separately agreed',
  'Celebrity or professional talent, studio production and specialised filming requirements',
  'Translation into additional languages unless separately agreed',
  'Major changes to approved content, creative direction or video storyline after final stage approval',
  'Third-party website hosting, domain, paid plugins or enterprise software costs',
  'Changes to core website infrastructure or backend systems',
  'Printing quantities beyond the agreed number of copies',
  'Travel and out-of-pocket expenses, unless specifically requested and pre-approved',
];

/**
 * Engagement maturity model — the progression the proposal describes across
 * reporting cycles, generalised away from any one client.
 */
export const maturityStages = [
  {
    stage: 'Cycle one',
    title: 'Sustainability focus',
    points: ['Project kick-off', 'Baseline alignment', 'Theme development', 'Report writing and design'],
  },
  {
    stage: 'Cycle two',
    title: 'Technical enhancements',
    points: ['Gap assessment', 'Technical review', 'Environment section enhancement', 'Climate risk integration', 'Print coordination'],
  },
  {
    stage: 'Cycle three',
    title: 'Strategic ESG advisory',
    points: ['Gap assessment and strategic ESG review', 'Disclosure enhancement', 'Cross-referencing with other ESG frameworks', 'Board presentation, video report and dedicated website'],
  },
] as const;
