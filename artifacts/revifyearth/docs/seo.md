# RevifyEarth SEO architecture

How the site is organised for search, and the rules for changing it. Phases B (technical) and C (on-page) built the machinery. This document covers the three layers on top of it:

- **D** — search architecture: which page owns which subject.
- **E** — structured data: what the JSON-LD says, and the rules it follows.
- **F** — long-term content: how the site should grow.

## Sources of truth

| Concern | File | Enforced by |
|---|---|---|
| Titles, descriptions, canonicals, robots, JSON-LD | `src/data/seo.ts` | `vite-plugins/seo-prerender.ts` |
| Subject ownership (topic clusters) | `src/data/topics.ts` | `assertTopicMap` in the prerender plugin |
| Structured-data rules | `src/data/seo.ts` | `vite-plugins/structured-data-check.ts` |

Every check fails the build rather than warning. The runtime head (`PageMeta` in `Chrome.tsx`) and the prerendered HTML read the same values, so they cannot disagree.

---

## D. Search architecture

### Keyword-to-page map

Each subject has one owning page (its pillar). Other pages may mention the subject but must link to the pillar rather than compete with it.

| Subject / typical queries | Owner | Intent | Supporting pages |
|---|---|---|---|
| Brand; "ESG reporting & sustainability communication" | `/` | Navigational / brand | — |
| ESG reporting services, sustainability reporting services | `/services` | Commercial | each `/services/<slug>` |
| GRI Standards, BRSR, UN SDGs, ESG reporting frameworks | `/expertise` | Informational | `/services/content-review` |
| Sustainability report review, gap assessment, BRSR report review | `/services/content-review` | Commercial investigation | `/process` |
| Sustainability / ESG report design | `/services/report-design` | Commercial | `/services/print-production` |
| Sustainable report printing | `/services/print-production` | Commercial | — |
| ESG board presentation | `/services/board-presentation` | Commercial | — |
| Sustainability video report | `/services/video-report` | Commercial | — |
| Sustainability report webpage | `/services/webpage-development` | Commercial | — |
| ESG communication, integrated sustainability communication | `/services/integrated-communication` | Commercial investigation | `/sustainability-branding` |
| Sustainability branding, ESG visual identity | `/sustainability-branding` | Commercial investigation | — |
| ESG reporting process, report timeline | `/process` | Informational | `/projects` |
| How an engagement is put together | `/projects` | Informational | — |
| Industry / sector ESG reporting | `/industries` | Informational | — |
| Company, team, contact | `/about`, `/team`, `/contact` | Trust / navigational | — |
| FAQs, perspectives, topic guide | `/resources` | Informational hub | — |

Seven of these subjects are clusters in `src/data/topics.ts`. They appear on the `/resources` topic guide and are checked at build time.

### Rules

1. **A page owns at most one cluster.** The build fails if a route is the pillar of two.
2. **Every link in the topic map lands on an indexable route.** The build fails otherwise.
3. **Titles and descriptions stay unique.** The build fails on a duplicate, case-insensitive.
4. **Anchor text describes the destination.** A site-wide nav label is a site-wide anchor-text signal. Two labels were corrected for this reason:
   - "Sustainability Reporting", which pointed at `/services/report-design`, is now "ESG Report Design". It was signalling that the design page owned "sustainability reporting".
   - "Case Studies", which pointed at `/projects`, is now "Engagement Model". The page explicitly has no case studies yet.
5. **Restraint with framework names.** BRSR and GRI appear where the page's subject needs them: home, expertise, content review, industries. Pages whose subject is something else (contact, resources) do not list them as keywords.

### New topic pages: when one is justified

A new indexable page is justified only when **all** of these hold:

- It answers a search intent that no existing page answers. If an existing page could answer it with a section, add the section instead.
- It has enough substantive, specific content to stand alone. It must not be a rephrasing of an existing page.
- Its content comes from RevifyEarth's own material, or from cited primary sources (for example a SEBI circular or the GRI Standards) that have been checked at publication and dated.
- It has a named author from `/team` who is accountable for its accuracy.
- It fits a cluster in `topics.ts` as a supporting page, and links to that cluster's pillar.

### Candidates evaluated in Phase D

| Candidate | Decision | Why |
|---|---|---|
| Dedicated BRSR page | Not yet | The site's own BRSR material is one alignment discipline inside the review service. A standalone page would need regulatory content (applicability, BRSR Core, assurance requirements) that is not in the repository and must be authored and dated by the ESG team. `/expertise` owns BRSR until then. |
| Dedicated GRI page | Not yet | Same reason. GRI is covered as part of the review method on `/expertise` and `/services/content-review`. |
| "ESG frameworks" hub page | No | That is `/expertise`. A second page would compete with it. |
| ESG reporting fundamentals / "what is ESG reporting" | Not yet | Generic informational content with no RevifyEarth-specific material behind it. It would be a thin article. |
| Per-industry landing pages | No | `/industries` describes sector disclosure profiles, not client work. Six thin pages would be doorway pages. |
| Case studies | Blocked | Needs client permission and verified outcomes (see `pendingContent` in `src/data/resources.ts`). |

---

## E. Structured data

### What each page carries

All of it is one `@graph` in one `<script type="application/ld+json">`.

| Page | Nodes |
|---|---|
| Every page | `Organization` (`#organization`); a page node (`#webpage`) with `isPartOf` → WebSite |
| `/` | + `WebSite` (`#website`); page `about` → Organization |
| `/about`, `/contact` | Page node is `AboutPage` / `ContactPage`, `about` → Organization |
| `/services` | Page node is `CollectionPage`; `mainEntity` is an `ItemList` of the seven services in page order |
| `/services/<slug>` | + `Service` (`<url>#service`); page `mainEntity` → Service |
| `/resources` | Page node is `CollectionPage` |
| `/team` | + one `Person` per person pictured: name, visible role as `jobTitle`, visible bio as `description`, portrait, `worksFor` → Organization |
| 404 | `Organization` only. No page node: there is no canonical URL to describe. |

### Entity facts

- **Organization.**
  - `name`: "RevifyEarth", the brand used across the site.
  - `legalName`: "Revify Private Limited".
  - `alternateName`: "Revify", used in the site's own copy.
  - `url`: `https://revifyearth.com/`.
  - `logo`: `/favicon-192.png`.
  - `email`, plus `areaServed`: India.
- **WebSite.** `name` "RevifyEarth", which is the site name Google should show. `alternateName` "Revify".

### Rules (enforced by `structured-data-check.ts`)

- **Only these types:** Organization, WebSite, WebPage, AboutPage, ContactPage, CollectionPage, Service, ItemList, ListItem, Person, Country. Anything else fails the build, including Review, AggregateRating, FAQPage, Product, Event, JobPosting, BreadcrumbList and Article.
- **Origin:** every `@id`, `url`, `logo` and `image` is on `https://revifyearth.com/`.
- **Ids:** no `@id` is defined twice in one graph. A node that appears on several pages is identical on each. Every `{ "@id" }` reference resolves to a node defined somewhere on the site.
- **Page node:** repeats the page's canonical, title and description exactly.
- **Service nodes:** name and description equal the visible title and opening paragraph.
- **ItemList:** lists every service URL in catalogue order.
- **Person nodes:** exist only on `/team` and match the people shown there.
- **Images:** every image the markup names must exist in the build output.

### Deliberately absent, and what would change that

| Markup | Add when |
|---|---|
| `sameAs` | Official LinkedIn or Instagram company profile URLs exist. The footer currently marks them as pending. |
| `founder` | The client confirms who the founders are. The team page heading says "Founding team", but `founder` is a legal-ish claim, so Persons use `worksFor` for now. |
| `BreadcrumbList` | The site shows a visible breadcrumb trail. |
| `Article` | An article route exists with a named author from `/team`, a publish date and a modified date (see F). |
| `FAQPage` | Not planned. Google restricts FAQ rich results to authoritative government and health sites. |
| `Review` / `AggregateRating` | Not planned. Self-serving reviews are not eligible, and the site has none. |

### Inconsistency to resolve with the client

The footer contact list shows **"Anu Ananya — Partnership Manager / CFO"**. The team page shows **"Ananya A — CFO and ESG Industry Expert"**. The structured data uses the team page's version. One person with two names on one site weakens entity understanding.

---

## F. Long-term content

### Cluster status

| Cluster | Pillar | Coverage today | Next step |
|---|---|---|---|
| ESG & sustainability reporting | `/services` | Covered | None. Grows through the other clusters. |
| GRI, BRSR & the UN SDGs | `/expertise` | Thin: one discipline, three short framework cards | Practitioner-authored supporting articles (below). A dedicated BRSR page once the gate in D is met. |
| Report review & gap assessment | `/services/content-review` | Covered in depth | One supporting article. |
| Sustainability report design | `/services/report-design` | Covered | One supporting article, with cleared report imagery. |
| ESG communication | `/services/integrated-communication` | Covered | One supporting article. |
| The reporting process | `/process` | Covered | One supporting article. |
| Sector context | `/industries` | Covered as sector profiles | Sector articles only with cleared engagement evidence. |

### Planned supporting articles

These are not published and not rendered anywhere. None should be written until the listed input exists. Three of them are already promised on `/resources` ("ask and we will send the underlying note"), so the notes exist in some form.

| Working title | Cluster | Required input |
|---|---|---|
| Reading a draft against GRI Universal and Topic Standards | frameworks / review | The underlying note from the ESG team; author from `/team` |
| Why framework references fail credibility checks | frameworks | The underlying note; examples anonymised |
| What a BRSR alignment review checks, and what it does not | frameworks | ESG lead authorship; every regulatory statement cited to the current SEBI circular, with the date checked |
| Preparing a draft for review: what to send and when | review | Built on the "What do you need from us?" FAQ; client sign-off |
| Making ESG data readable: charts, KPIs and comparability | design | Designer-authored; report imagery cleared for publication |
| The report is not the deliverable | communication | The underlying note |
| Planning the reporting calendar around data collection | process | ESG lead authorship. Built on the timeline note, including the six-week data-collection assumption. |

### Editorial rules

- Written by a named person on `/team`, from real engagement experience. No generic or machine-generated explainers.
- No statistics, regulatory claims or framework requirements without a cited primary source and the date it was checked. Regulatory articles are reviewed every reporting season.
- An article supports its cluster's pillar and links to it. It never targets the pillar's commercial query.
- No invented clients, outcomes or quotes. Client work is described only when cleared, in line with `pendingContent`.

### Publishing an article (when the first one is ready)

The route system does not exist yet: building it before there is content to put on it would be speculative. When it is needed:

1. Add an `articles` data module: slug, title, description, author (a `/team` name), `datePublished`, `dateModified`, cluster id and body.
2. Add `<Route path="/resources/:slug">` in `App.tsx`. Then teach `discoverAppRoutes` in the prerender plugin to expand it from the articles module, the same way `/services/:slug` is expanded.
3. Add each article to `pageMeta` in `seo.ts`. Title and description uniqueness is enforced automatically.
4. Add `Article` (and `Person` as a reference for its author) to `ALLOWED_TYPES` in `structured-data-check.ts`. Emit it from `structuredDataFor` with `author` → the author's `/team` `#id`, `publisher` → Organization, and the two dates.
5. List the article under its cluster's `supporting` links in `topics.ts`, so it appears in the topic guide. Link to the pillar from the article body.
6. The sitemap, the route rewrites, the 404 handling and all checks pick the new route up from steps 2 and 3.
