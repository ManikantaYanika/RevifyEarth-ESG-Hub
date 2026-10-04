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
| Internal links and anchors | literal `href`s in `src/` | `vite-plugins/link-check.ts` |
| Hero preload and page-chunk preload per route | `pageHeroes` in `src/data/seo.ts`; `App.tsx` routes | `seo-prerender.ts` |

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
   - Phase G corrected three more:
     - The "Platform" menu group is now "Capabilities", because RevifyEarth is not software.
     - "ESG Strategy & Advisory" is now "ESG Reporting Expertise", because no advisory service exists.
     - "ESG Websites" is now "Report Webpages", because the deliverable is one report webpage.
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

Re-audited in Phase G. Priority 1 articles are already promised on `/resources` ("ask and we will send the underlying note"), so the first-party material exists.

| Priority | Working title | Cluster | Search intent | Links to | Required input |
|---|---|---|---|---|---|
| 1 | Reading a draft against GRI Universal and Topic Standards (absorbs "Preparing a draft for review") | frameworks / review | Informational: teams with a draft report | `/services/content-review`, `/expertise` | The underlying note from the ESG team; author from `/team` |
| 1 | Why framework references fail credibility checks | frameworks | Informational | `/expertise` | The underlying note; examples anonymised |
| 1 | The report is not the deliverable | communication | Commercial investigation | `/services/integrated-communication` | The underlying note |
| 2 | What a BRSR alignment review checks, and what it does not | frameworks | Informational, high value | `/expertise`, `/services/content-review` | ESG lead authorship; every regulatory statement cited to the current SEBI circular, with the date checked; expert review before publishing |
| 3 | Planning the reporting calendar around data collection | process | Informational | `/process` | ESG lead authorship. Built on the timeline note, including the six-week data-collection assumption. |

Dropped for now: "Making ESG data readable". It has no first-party support until report imagery is cleared for publication. Restore it when that changes.

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

---

## J. Governance & monitoring

Search Console and Netlify are configured outside this repository. Everything below is a manual step. Record what Search Console reports; never assume it. A URL is indexed only when URL Inspection says "URL is on Google".

### One-time setup

1. **Property.** In Google Search Console, add a **Domain property** for `revifyearth.com`. Verify it with the DNS TXT record at the domain registrar. A domain property covers `https`, `www` and every path, so canonical problems on any variant show up.
2. **Sitemap.** Submit `https://revifyearth.com/sitemap.xml` under *Indexing → Sitemaps*. Expect "Success" with **18 discovered URLs**. A different number means the sitemap and the live site disagree. `robots.txt` already names the sitemap.
3. **Old host.** `revifyearthh.netlify.app` 301s to the apex. There's no need to add it as a property.

### After every release that changes pages

1. Run *URL Inspection → Test live URL* on the homepage, one service page and every page the release touched. Check:
   - "URL is available to Google";
   - the user-declared canonical equals the URL;
   - Google-selected canonical (shown after indexing) is the same;
   - the page fetch is "Successful";
   - the indexing allowed column says "Yes".
2. Request indexing only for pages that are new or substantially changed. Re-requesting unchanged pages does nothing.
3. **Rich Results Test** on `/`, `/services` and one service page, and **validator.schema.org** on `/team`. Expect no errors. Valid markup does **not** guarantee a rich result: Organization, Service and WebPage generally produce none. The test proves the markup parses.

### Ongoing monitoring cadence

| When | Where | What to look at | Act when |
|---|---|---|---|
| Weekly (first 2 months), then monthly | *Indexing → Pages* | Indexed vs not indexed; the reasons | An intended page sits in "Crawled – currently not indexed" or "Duplicate, Google chose different canonical" for over 4 weeks |
| Monthly | *Performance → Search results* | Queries and pages by impressions, CTR and position | A page ranks for a query another page owns (cannibalisation: check `topics.ts`), or a high-impression page has low CTR (revisit its title or description) |
| Monthly | *Experience → Core Web Vitals* | Field LCP, INP, CLS (mobile first) | Any URL group is "Poor" or "Needs improvement". Field data appears only once there is enough real traffic. |
| Monthly | *Enhancements / Shopping / etc.* | Structured-data reports, if any appear | Any error |
| Quarterly | This document and `topics.ts` | Whether the topic map still matches what pages actually rank for | Ranking pages diverge from the owners in the map |
| Every reporting season | Any page or article citing GRI, BRSR or SEBI | Regulatory accuracy and the "checked on" date | A framework or circular has changed |

Keep lab measurements, field data (CrUX / Search Console) and Search Console coverage separate in any report. They answer different questions.

### Content update policy

- Change copy when it is inaccurate, unclear or no longer matches the service. Do not change it to chase a keyword.
- A title or description change is a ranking event. Make one change at a time, note the date, and compare Search Console performance after 4–6 weeks.
- Regulatory statements carry a source and a "checked on" date, and are re-checked every reporting season.
- No new page without passing the D gate ("New topic pages: when one is justified").

### New page checklist

- [ ] Passes the D gate. Owns a cluster in `topics.ts` or supports one, and competes with no existing pillar.
- [ ] Route added in `App.tsx` **and** an entry in `pageMeta` (`seo.ts`), with a unique title (≤ 65 characters) and description (≤ 175 characters).
- [ ] One H1 that states the topic. No skipped heading levels.
- [ ] Hero image added to `pageHeroes` in `seo.ts`, otherwise the wrong image is preloaded.
- [ ] At least one contextual inbound link from related content. The build fails without one.
- [ ] Linked from its cluster in `topics.ts` if it is a pillar or supporting page.
- [ ] Structured data only for what the page visibly shows (see E). The build check passes.
- [ ] Build passes. Then URL Inspection → live test after deploy.

### Internal linking checklist

- Anchor text names the destination ("Content review & gap assessment"), not "click here", and not the same exact-match phrase on every page.
- One or two contextual links per section, where a reader would want them. No link lists, no footer keyword blocks, no hidden links.
- Link to the owning page of a subject, not to a page that only mentions it.
- Fragments (`#faqs`) must point at an id that renders. The build checks literal ones.

### Structured-data checklist

- Only types in `ALLOWED_TYPES`. Extending it needs a visible basis on the page.
- Values mirror visible content or the head exactly. The build compares them.
- Every `@id` and URL is on `https://revifyearth.com/`. Every reference resolves. Every image exists.
- No Review, AggregateRating, FAQPage, Product, Event, LocalBusiness or Article without the real thing on the page.
- `sameAs` only for official, verified profiles.

### Image checklist

- `ResponsiveImage` with an `ImageAsset` (WebP derivatives, real widths). Never a raw multi-MB source file.
- `alt` describes the image or its function. Use `alt=""` for decorative backgrounds and for images whose text is already beside them.
- Only the hero gets `priority`. Everything else lazy-loads.
- New source photographs go in `attached_assets/source-imagery/`, with derivatives in `public/assets/revify/`. Keep file names stable: a rename breaks references and the preload map.

### Redirect and 404 checklist

- Removing a page: 301 its URL to the closest equivalent in `public/_redirects` **and** `netlify.toml` (they mirror each other), remove it from `App.tsx` and `pageMeta`, and fix inbound links. The link check lists them.
- Never redirect to the homepage as a catch-all. A real 404 is better than a soft one.
- Do not add trailing-slash rules: Netlify normalises them, and they loop.
- After deploy, check `curl -sI <url>` returns the intended status (`200`, `301` with the right `location`, or `404`).

### Release checklist

Run before merging any change that touches pages, metadata or routing:

1. `pnpm --filter @workspace/revifyearth run typecheck`
2. `pnpm --filter @workspace/revifyearth build`. All SEO checks run inside the build: route coverage, unique metadata, topic map, internal links, structured data, output files.
3. Deploy preview. For the homepage, `/services`, `/expertise`, `/resources`, one service page, `/team`, `/contact` and an unknown URL, check:
   - the title and description;
   - the canonical (none on the 404);
   - robots (`noindex` only on the 404);
   - the JSON-LD types;
   - one H1;
   - no console errors;
   - working links and images;
   - mobile layout;
   - status 404 on the unknown URL.
4. After merge and production deploy: the URL Inspection live test on changed pages, and the Rich Results Test on representative pages.
