/**
 * RevifyEarth knowledge corpus.
 *
 * SOURCE OF TRUTH: the RevifyEarth techno-commercial proposal
 * (`attached_assets/Sagility_Proposal_2026_(1)_1786013304086.pdf`) — the same
 * document that `artifacts/revifyearth/src/data/*` was written from.
 *
 * IMPORTANT — keep in sync with `artifacts/revifyearth/src/data/`. The site and the
 * assistant must never state different facts. The two cannot share a module because
 * the frontend data is shaped for rendering (image assets, route slugs) and lives in
 * `artifacts/`, which server code must not import from. When a service, phase,
 * inclusion or exclusion changes on the site, change it here too.
 *
 * CONTENT INTEGRITY RULES ENCODED HERE:
 *  - The founding client is never named. The proposal is confidential; engagements
 *    are referred to as "a healthcare enterprise".
 *  - Commercial terms (fees, payment schedule) are client-specific and are NOT in
 *    this corpus. The assistant cannot quote a price because it does not have one.
 *  - No testimonials, awards, partners, client logos or performance metrics exist in
 *    the source. They are absent here so the model has nothing to paraphrase into an
 *    invented claim.
 */

export interface KnowledgeDoc {
  readonly id: string;
  /** Terms that should pull this document into context. Matched case-insensitively. */
  readonly keywords: readonly string[];
  readonly body: string;
}

/** Always included. Short enough to be affordable on every request. */
export const coreFacts = `# RevifyEarth — company facts

- Legal entity: Revify Private Limited. Brand: RevifyEarth.
- Discipline: ESG Branding & Sustainability Communication.
- Positioning: turning complex ESG information into one coherent story — technically robust, visually compelling and strategically aligned.
- Mission: to make sustainability performance legible, so the work organisations genuinely do on climate, water, people and governance is understood by the people it needs to reach.
- Vision: a reporting cycle that produces a communication platform rather than a document.
- Origin: RevifyEarth began by writing a healthcare enterprise's first sustainability report. Across later cycles the brief widened from technical review and disclosure enhancement to theme development, report design, print coordination, board support, film and web. That progression is why the ecosystem model exists.
- Email: info@revifyearth.com. Website: https://www.revifyearth.com
- Contacts: Pallavi Priya (Project Manager / CEO, 9608159460); Anu Ananya (Partnership Manager / CFO, 7978869701).

## The seven services (site paths in brackets)
1. Content Review & Gap Assessment [/services/content-review]
2. Sustainability Report Design [/services/report-design]
3. Sustainable Print Production [/services/print-production]
4. Board Presentation Support [/services/board-presentation]
5. Video Report [/services/video-report]
6. Sustainability Report Webpage Development [/services/webpage-development]
7. Integrated ESG Communication [/services/integrated-communication]

## Frameworks worked across
- GRI — Global Reporting Initiative Universal and Topic Standards. Drafts are mapped against them to flag missing, partial and weak disclosures.
- BRSR — Business Responsibility & Sustainability Report. Reviewed for alignment and appropriate cross-referencing.
- UN SDGs — referenced meaningfully and integrated into the narrative rather than added as a standalone compliance exercise.

## Hard scope boundary (state this whenever data, assurance or verification comes up)
RevifyEarth does NOT collect primary ESG data, perform calculations, or provide independent verification or assurance of reported data. It reviews, strengthens and communicates the information client teams provide.`;

export const knowledgeDocs: readonly KnowledgeDoc[] = [
  {
    id: "content-review",
    keywords: [
      "content review",
      "gap assessment",
      "gap analysis",
      "review",
      "draft",
      "disclosure",
      "gri",
      "editorial",
      "proofread",
      "consistency",
      "cross-reference",
      "materiality",
      "zero error",
    ],
    body: `## Service 01 — Content Review & Gap Assessment
Tagline: from a compiled draft to a technically robust and cohesive sustainability narrative.

A chapter-by-chapter review that turns disclosure gaps, inconsistencies and fragmented narratives into a clear reporting foundation. It goes beyond proofreading: it assesses whether information is complete, coherent, adequately substantiated and communicated appropriately for stakeholders.

Four workstreams:
1. Comprehensive Gap Assessment — missing, partial or weak disclosures against relevant GRI Universal and Topic Standards; gaps in completeness and contextualisation; inconsistencies in data, units, reporting boundaries, terminology and year-on-year comparisons; repetition, fragmented narratives and cross-referencing opportunities; areas where stronger evidence, explanation or management context would improve disclosure quality.
2. Strategic Content Enhancement — environment and climate-related disclosures; water stewardship and conservation narrative; decarbonisation journey, interventions and future direction; executive summaries, chapter introductions and concluding narratives; implementation examples and case narratives where they materially strengthen the report.
3. Framework Alignment & Cross-Referencing — alignment review against GRI Standards, BRSR and the UN SDGs; references checked for accuracy and relevance; references integrated meaningfully rather than added as a standalone compliance exercise.
4. Final Editorial & Consistency Review — narrative flow; terminology and editorial alignment; cross-references and section linkages; data presentation consistency; table, chart and infographic content; alignment between final approved content and the designed report.

Deliverables: a technically reviewed, strengthened and editorially aligned draft ready for design and publication; a chapter-by-chapter gap and inconsistency map; priority questions for data owners; framework cross-referencing review across GRI, BRSR and the UN SDGs.

Business value: disclosure gaps surface before design begins, not after publication; framework references become accurate and integrated; assurance conversations start from a better-evidenced draft.

Timeline: runs from project kick-off through to the draft non-designed report milestone.
Ideal for: teams preparing a sustainability report, or strengthening an existing disclosure cycle before it moves into design.`,
  },
  {
    id: "report-design",
    keywords: [
      "report design",
      "design",
      "theme",
      "visual",
      "layout",
      "infographic",
      "typography",
      "cover",
      "artwork",
      "iteration",
      "revision",
      "page limit",
      "interactive pdf",
      "data visualisation",
      "data visualization",
    ],
    body: `## Service 02 — Sustainability Report Design
Tagline: building a distinctive visual identity for the sustainability story.

The report is developed as the flagship ESG communication asset, combining editorial principles with data visualisation and sustainability storytelling. The process starts by assessing the reporting year's key developments, achievements and emerging narrative, then develops FIVE distinct creative theme directions for consideration.

Stages: narrative assessment → five theme directions (each with a rationale linked to the reporting year) → system build (typography, colour, iconography, graphic elements; cover and chapter-opening concepts; custom infographics, charts, timelines, process visualisations) → iteration to approval (fortnightly progress connect, multiple iterative review cycles).

Deliverables: five creative theme and visual direction options; theme rationale; cover and chapter-opening concepts; a consistent visual system; custom infographics, charts, timelines and process visualisations; premium licensed stock imagery; interactive PDF with navigational elements where technically appropriate; print-ready artwork.

Key commitments: unlimited iterations on report design; NO predefined page limit; complete ownership of final artwork; premium licensed imagery included within the agreed project requirements.

Note: major changes to approved content or creative direction after final stage approval are handled separately.`,
  },
  {
    id: "print-production",
    keywords: [
      "print",
      "printing",
      "paper",
      "gsm",
      "fsc",
      "recycled",
      "binding",
      "copies",
      "physical",
      "proof",
      "dispatch",
      "delivery",
      "stock",
    ],
    body: `## Service 03 — Sustainable Print Production
Tagline: translating the digital report into a premium physical publication.

Coordination of printing and production of the final approved report, emphasising quality, durability and responsible material selection — so the physical object carries the same commitment as the disclosures inside it.

Specifications: FSC-certified and/or recycled paper options; premium paper 75–130 GSM matched to final page count and binding; premium cover stock with suitable finishing; perfect binding; pre-production quality check and print proof review; quality assurance before dispatch and delivery to the specified location.

Stages: specification → proofing → production & delivery.

Included: printing and delivery of the agreed number of copies. Quantities beyond the agreed number are a separate scope item.
Timeline: begins once the designed report is approved; sequenced ahead of the results presentation.`,
  },
  {
    id: "board-presentation",
    keywords: [
      "board",
      "presentation",
      "leadership",
      "executive",
      "boardroom",
      "kpi",
      "director",
      "management",
      "deck",
    ],
    body: `## Service 04 — Board Presentation Support (complementary workstream)
Tagline: the reporting year, distilled for the people who set direction.

ONE executive-level board and leadership presentation based on the final sustainability report, distilling the detailed document into a concise decision-maker format, built in the approved report's visual identity for consistency.

Covers: reporting-year sustainability highlights; key ESG performance indicators; significant initiatives and outcomes; climate and environmental developments; progress against priorities and commitments; strategic focus areas and forward-looking priorities.

Business value: leadership engages with the reporting year without reading 120 pages; consistent identity between report and boardroom; forward-looking priorities framed for decision-making rather than compliance.
Timeline: developed once report content is approved, ahead of the final results presentation.`,
  },
  {
    id: "video-report",
    keywords: [
      "video",
      "film",
      "motion",
      "animation",
      "storyboard",
      "script",
      "voice-over",
      "voiceover",
      "music",
      "footage",
      "youtube",
      "social",
      "cutdown",
      "multimedia",
      "1080p",
      "visual report",
    ],
    body: `## Service 05 — Video Report
Tagline: transforming a detailed sustainability report into an engaging visual story.

A 5–7 minute visual narrative for stakeholders who may not engage with the full written report. It does not reproduce the report page by page; it distils the most important messages, aligned with the final report theme so print, digital and multimedia stay consistent.

Three production phases:
1. Narrative & Creative Concept — overall concept and storytelling approach; narrative structure and sequence; script based on the final approved report; storyboard defining scenes, transitions and visual treatment; alignment with the approved report theme.
2. Visual Production — motion graphics and animation; animated ESG KPIs and data visualisations; report graphics; client-provided photographs and footage; licensed stock footage where required; on-screen text and narrative transitions.
3. Audio & Post-Production — background music licensed for the intended use (produced in-house); voice-over support where included in the approved creative direction; editing and synchronisation; transitions and motion treatment; final quality review and rendering.

Deliverables: one professionally produced 5–7 minute video report; Full HD (1080p) output; TWO 30-second cutdowns for social channels; concept, script and storyboard; motion graphics and animated ESG KPIs; in-house background music licensed for the intended use.

Usable across corporate website, leadership forums, employee communication, customer engagement, social and digital channels, corporate events, Instagram, Facebook and YouTube.

Boundaries: standard production works from provided and licensed digital assets. Original on-location photography or videography, studio production, and celebrity or professional talent are arranged separately. Translation into additional languages is a separately agreed scope item.`,
  },
  {
    id: "webpage-development",
    keywords: [
      "webpage",
      "website",
      "web",
      "digital",
      "microsite",
      "responsive",
      "dashboard",
      "online",
      "download",
      "hosting",
      "domain",
      "esg website",
    ],
    body: `## Service 06 — Sustainability Report Webpage Development (complementary workstream)
Tagline: extending the sustainability narrative into an accessible digital experience.

A dedicated responsive webpage presenting the reporting year's key highlights. It does not simply host a downloadable PDF — it gives stakeholders a concise digital gateway to sustainability performance and directs them to the complete report for detailed disclosures.

Five components:
1. Sustainability Overview — concise introduction to the approach and central narrative.
2. Key ESG Highlights — selected achievements and performance indicators via visual cards, counters and graphics.
3. Thematic Content — selected highlights across relevant environmental, social and governance themes, based on the final approved report.
4. Video Integration — embedding the sustainability video report.
5. Report Access — downloadable PDF and/or report-viewing link.

Deliverables: one responsive sustainability report webpage; interactive report overview; ESG performance dashboard; embedded video; downloadable report access; mobile-responsive design.

Boundaries: changes to core website infrastructure or backend systems are out of scope, as are third-party hosting, domain, paid plugins and enterprise software costs. This does not modify the client's existing corporate website.`,
  },
  {
    id: "integrated-communication",
    keywords: [
      "integrated",
      "ecosystem",
      "communication",
      "strategy",
      "end to end",
      "end-to-end",
      "full service",
      "everything",
      "package",
      "narrative architecture",
      "touchpoint",
    ],
    body: `## Service 07 — Integrated ESG Communication
Tagline: one story, multiple stakeholder touchpoints.

Rather than independent deliverables, an integrated ecosystem where every output reinforces a single sustainability narrative — moving from print to video to web while narrative architecture, visual language and strategic priorities stay constant.

The five-pillar ecosystem:
1. Content Review — "Zero Error" — the reviewed, evidence-checked foundation.
2. Report Designing — "Complete Ownership" — the editorial system that sets the visual language.
3. Sustainable Print — "Responsible Production" — the physical expression of the reporting year.
4. Visual Report — "Narrative in Motion" — for audiences who will not read the document.
5. Webpage Development — "Always Accessible" — the permanent digital gateway.

Deliverables: integrated engagement direction across all workstreams; shared narrative architecture; consistent visual language across report, print, presentation, video and web; connected stakeholder touchpoints; project management across all agreed workstreams.

Engagements are scoped to the brief — a client can begin with one workstream and extend into others in a later cycle. Each workstream stands on its own while staying consistent with the others.`,
  },
  {
    id: "methodology",
    keywords: [
      "process",
      "methodology",
      "phase",
      "timeline",
      "how long",
      "duration",
      "milestone",
      "kick-off",
      "kickoff",
      "schedule",
      "weeks",
      "steps",
      "engagement",
      "start",
    ],
    body: `## Project methodology — five phases
1. Kick-off & scope confirmation (Revify + Client) — confirm project scope and boundaries; issue data collection template(s). Fixing scope, boundaries and reporting perimeter early is what stops later phases re-opening settled questions.
2. Review & report design (Revify) — literature review; data collection support; gap analysis; theme development and report design. The technical review and the creative work run in parallel.
3. Video report production (Revify) — narrative and creative concept; script and storyboard; visual production.
4. Webpage development (Revify) — interactive overview build; ESG performance dashboard; video integration and report access.
5. Project closure & results (Revify + Client) — consolidate results and final report; presentation of results.

Milestones: A Project kick-off · B Draft non-designed report · C Data collection deadline · D Gap analysis · E Video report · F Final results presentation.

Timing caveat — always state this when asked about duration: data collection timeframes vary. The indicative timeline assumes UP TO SIX WEEKS for data collection, and delivery depends on timely receipt of inputs, consolidated feedback and approvals.

Engagement maturity across reporting cycles:
- Cycle one — Sustainability focus: kick-off, baseline alignment, theme development, report writing and design.
- Cycle two — Technical enhancements: gap assessment, technical review, environment section enhancement, climate risk integration, print coordination.
- Cycle three — Strategic ESG advisory: gap assessment and strategic ESG review, disclosure enhancement, cross-referencing with other ESG frameworks, board presentation, video report and dedicated website.`,
  },
  {
    id: "scope-boundaries",
    keywords: [
      "inclusion",
      "exclusion",
      "included",
      "excluded",
      "scope",
      "out of scope",
      "assurance",
      "verification",
      "audit",
      "data collection",
      "translation",
      "travel",
      "not included",
      "cover",
    ],
    body: `## What is included in an engagement
- Project management across all agreed workstreams
- ESG review and content enhancement within the agreed report scope
- Five initial creative theme directions
- Multiple reasonable iterations until final approval
- Unlimited iterations on report design
- Licensed creative assets required for the agreed report and video treatment
- Standard Full HD video production based primarily on provided and licensed digital assets
- Standard responsive webpage development
- Printing of the agreed number of report copies and delivery

## What is NOT included
- Primary ESG data collection, calculation or independent verification/assurance of reported data
- New standalone technical studies, assessments or calculations not already available as project inputs
- Original on-location photography or videography unless separately agreed
- Celebrity or professional talent, studio production and specialised filming requirements
- Translation into additional languages unless separately agreed
- Major changes to approved content, creative direction or video storyline after final stage approval
- Third-party website hosting, domain, paid plugins or enterprise software costs
- Changes to core website infrastructure or backend systems
- Printing quantities beyond the agreed number of copies
- Travel and out-of-pocket expenses unless specifically requested and pre-approved

## What RevifyEarth needs from a client
A compiled report draft or the underlying content; access to data owners for clarification; timely consolidated feedback at each review stage; approvals at the agreed decision points.`,
  },
  {
    id: "why-revify",
    keywords: [
      "why",
      "differentiator",
      "value",
      "unique",
      "compare",
      "competitor",
      "better",
      "advantage",
      "choose",
      "expertise",
      "capability",
    ],
    body: `## Our value add — why RevifyEarth
1. ESG Expertise — deep understanding of sustainability reporting frameworks, climate disclosures, ESG strategy and environmental performance, enabling review beyond visual presentation.
2. Domain Expertise with Branding & Content — sustainability consulting, strategic communication and creative excellence under one integrated engagement model. Sustainability reporting is treated as a strategic communication exercise, not a design assignment.
3. Strategic Storytelling — technical sustainability information transformed into meaningful narratives communicating purpose, performance and long-term vision.
4. Premium Creative Design — editorial approach combining modern visual communication, infographics, data visualisation and stakeholder-centric design to enhance readability and engagement.
5. Integrated Communication — from technical review and report design to multimedia and digital experiences, every deliverable developed under one unified communication strategy.
6. Long-term Partnership — familiarity with a client's sustainability journey enables continuity, consistency and faster execution while introducing fresh perspectives every cycle.`,
  },
  {
    id: "team",
    keywords: [
      "team",
      "who",
      "founder",
      "people",
      "staff",
      "leadership",
      "ceo",
      "cfo",
      "experience",
      "background",
      "qualification",
    ],
    body: `## Team
Founding team:
- Pallavi Priya — CEO and ESG Industry Expert. 10+ years in ESG; previously Coal India, EY and Asian Paints. BTech in Environment from IIT Delhi, MBA in Sustainability from IIM Lucknow.
- Ananya A — CFO and ESG Industry Expert. 10+ years in consulting and quality assurance. BTech in Electrical from ITER, MBA in Sustainability from IIM Lucknow.
- Bichitra Nanda — Director. Retired Civil Servant, Government of Odisha.

Core designing team:
- Sanskar — Marketing & Content Head
- Sheetal — Report Designer & Content Creator
- Yanika Manikantha — Web Developer

Positioning: experts from different walks — from experienced retired government administrative officers to professionals from IIM and top B-schools — bringing the expertise to make a sustainability story more impactful.`,
  },
  {
    id: "industries",
    keywords: [
      "industry",
      "industries",
      "sector",
      "healthcare",
      "manufacturing",
      "financial",
      "technology",
      "energy",
      "consumer",
      "vertical",
    ],
    body: `## Target sectors
RevifyEarth positions its work across six sectors, framed by each sector's disclosure profile. These are TARGET sectors and sector-level context — they are NOT a claim of completed client work in each one. Do not describe them as past clients or case studies.

The site lists these at /industries. If a visitor asks whether RevifyEarth has worked in their sector, say that published engagement references are not yet available on the site and direct them to the team at info@revifyearth.com, who can speak to relevant experience directly.`,
  },
  {
    id: "esg-frameworks",
    keywords: [
      "gri",
      "brsr",
      "sdg",
      "framework",
      "standard",
      "sebi",
      "disclosure",
      "compliance",
      "reporting standard",
      "materiality",
      "double materiality",
      "csrd",
      "tcfd",
      "issb",
      "scope 1",
      "scope 2",
      "scope 3",
      "ghg",
      "emission",
      "carbon",
    ],
    body: `## Framework context for advisory answers
RevifyEarth works across GRI (Universal and Topic Standards), BRSR and the UN SDGs — these are the three named in its scope of work.

When a visitor asks about frameworks RevifyEarth does not name in its own scope (for example CSRD, ISSB/IFRS S1-S2, TCFD, SASB, CDP), you may explain the framework in general professional terms as an ESG consultant would, but be explicit that RevifyEarth's stated review and alignment scope covers GRI, BRSR and the UN SDGs, and that anything further should be confirmed with the team.

General ESG guidance may be given as professional context — for example what a materiality assessment is, the difference between Scope 1, 2 and 3 emissions, or how BRSR Core relates to BRSR. Keep it accurate, concise and non-prescriptive, and never present general guidance as a RevifyEarth deliverable unless it appears in the service descriptions above.`,
  },
  {
    id: "trust-content",
    keywords: [
      "testimonial",
      "review",
      "client",
      "reference",
      "case study",
      "award",
      "partner",
      "logo",
      "portfolio",
      "example",
      "proof",
      "who have you worked with",
    ],
    body: `## Published proof — current status
RevifyEarth has NOT published testimonials, awards, partner lists, client logos, case studies or performance metrics. The website shows these sections in an explicit "awaiting verified content" state.

If asked for client names, references, case studies, testimonials, awards or metrics: say plainly that these are not yet published, and offer to connect the visitor with the team at info@revifyearth.com. NEVER invent, estimate, or imply any of them — not even as an illustrative example. Do not name any client organisation.`,
  },
  {
    id: "commercials",
    keywords: [
      "price",
      "pricing",
      "cost",
      "fee",
      "quote",
      "budget",
      "payment",
      "invoice",
      "rate",
      "how much",
      "charge",
      "contract",
      "proposal",
    ],
    body: `## Commercials
Pricing is scoped per engagement and is NOT published. You do not have access to any fee, rate card, payment schedule or budget range, and must not estimate, guess or offer a "typical" figure.

Correct response: explain that pricing depends on scope — which workstreams are included, report length, print quantity and whether film and web are in scope — and direct the visitor to info@revifyearth.com or the contact page at /contact for a scoped proposal. Offer to summarise which workstreams they appear to need, since that is what a quote is built from.`,
  },
];

/**
 * Lightweight keyword retrieval.
 *
 * The full corpus is small enough to send wholesale, but trimming it keeps prompts
 * cheaper and sharpens the model's focus. Scoring is intentionally simple — exact
 * phrase containment on a normalised query. Anything that scores zero is dropped,
 * and if nothing matches we fall back to the highest-level documents so the model is
 * never left without grounding.
 */
export function selectKnowledge(query: string, limit = 5): readonly KnowledgeDoc[] {
  const normalised = query.toLowerCase();

  const scored = knowledgeDocs
    .map((doc) => {
      const score = doc.keywords.reduce(
        (total, keyword) => (normalised.includes(keyword) ? total + keyword.length : total),
        0,
      );
      return { doc, score };
    })
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((entry) => entry.doc);

  if (scored.length > 0) return scored;

  const fallbackIds = ["integrated-communication", "methodology", "why-revify"];
  return knowledgeDocs.filter((doc) => fallbackIds.includes(doc.id));
}
