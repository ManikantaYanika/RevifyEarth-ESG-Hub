# SEO Phases G–J: audit and changes

**Scope:**

- **G:** content quality and search intent.
- **H:** internal linking.
- **I:** technical, performance and accessibility.
- **J:** governance and monitoring.

The architecture these phases build on (Phases B–F) is described in [seo.md](./seo.md). The governance checklists from Phase J live there too, so there is one place to maintain.

**Method:** read-only audit first, then measurement, then only the changes the audit justified. Every number below is **lab data**:

- local build;
- headless Chrome at 390×844;
- 4× CPU throttle;
- 150 ms RTT and 1.6 Mbps down;
- a Netlify-rules emulator with gzip;
- median of three loads.

None of it is field data or Search Console data.

---

## G. Content quality and search intent

### Route audit

| Route | Primary intent | Audience | State | Issue found | Change |
|---|---|---|---|---|---|
| `/` | Brand + ESG reporting & sustainability communication | Sustainability, communications and CSR leads | Strong | — | None |
| `/services` | Commercial: the service catalogue | Buyers comparing scope | Strong | — | None |
| `/services/content-review` | Report review / gap assessment | ESG and reporting teams with a draft | Strong, specific | — | FAQ link (H) |
| `/services/report-design` | Report design | Communications leads | Strong | — | FAQ link (H) |
| `/services/print-production` | Sustainable print | Procurement, communications | Adequate for the intent | — | FAQ link (H) |
| `/services/board-presentation` | Board presentation | Leadership / company secretariat | Adequate | — | FAQ link (H) |
| `/services/video-report` | Video report | Communications | Strong | — | FAQ link (H) |
| `/services/webpage-development` | Report webpage | Communications / digital | Strong | H1 and nav said **"ESG Websites"**, but the scope is one report webpage and explicitly excludes corporate-website work | Renamed **"Report Webpages"** (service short title and nav label) |
| `/services/integrated-communication` | ESG communication | Leadership commissioning the whole cycle | Strong | — | FAQ link (H) |
| `/expertise` | GRI, BRSR & UN SDGs | ESG / reporting teams | Thin on framework detail | Deeper framework content needs ESG-team authorship and dated regulatory sources | **Not changed.** Recorded as a content need (see roadmap). |
| `/sustainability-branding` | Visual identity across formats | Communications | Strong | — | None |
| `/industries` | Sector disclosure context | Sector buyers | Adequate | Sectors are framed as disclosure profiles, not client work. That is correct. | None |
| `/process` | Reporting process & timeline | Project owners | Strong | Phases did not link to the services that deliver them | Phase → service links (H) |
| `/projects` | Engagement model | Buyers assessing fit | Thin: largely the shared five-pillar strip | Its meta title "How an ESG Communication Engagement Works" overlapped `/process` | Title is now **"ESG Communication Engagement Model"**, matching the nav label and eyebrow. The description now covers the components, not the sequence. |
| `/resources` | FAQs, perspectives, topic guide | Researching teams | Strong after Phase F | Few contextual inbound links | FAQ links from all 7 service pages (H) |
| `/about` | Company | Evaluators | Strong | — | None |
| `/team` | People / expertise | Evaluators | Strong (named, credentialed) | — | None |
| `/contact` | Enquiry | Ready buyers | Strong | Office card links to revifyearth.com in a new tab, from revifyearth.com | **Not changed.** Contact UI and forms are out of scope (noted). |

Every route deserves to be indexed. None is a duplicate, doorway or thin variant. `/projects` is the weakest page, but it owns a distinct question ("what is in an engagement"). It is also where case studies will go once they are cleared, so it stays.

### Positioning corrections (site-wide copy)

| Was | Now | Why |
|---|---|---|
| Nav group **"Platform"** | **"Capabilities"** | RevifyEarth is a reporting and communication partner, not ESG software. A "Platform" menu reads as a product. |
| Nav link **"ESG Strategy & Advisory"** → `/expertise` | **"ESG Reporting Expertise"** | No advisory service exists among the seven services. The label now matches the page it opens. |
| Nav link and service H1 **"ESG Websites"** | **"Report Webpages"** | It overstated the deliverable (see above). |

### Cannibalisation check

- **Titles and descriptions:** all 18 are still unique. The build enforces this.
- **`/process` vs `/projects`:** separated by intent. Process is phases and timeline; Projects is the components of an engagement. They cross-link once in each direction.
- **"ESG reporting" in titles:** the phrase appears on several titles with distinct qualifiers (services, expertise, process, resources). The head term stays with `/`. No change.
- **Framework names (BRSR, GRI):** unchanged since Phase D. They appear only where the page's subject needs them.

---

## H. Internal linking

### Changes

- **Service pages → `/resources#faqs`.** Each service page carries one or two questions. The general FAQ answers scope, timelines and inputs for all of them. Anchor: "Scope & timeline FAQs".
- **`/process` phases → the service pages that deliver them.**
  - Phase 2 → content review and report design.
  - Phase 3 → video.
  - Phase 4 → webpage.
  - Phase 5 → print and board.
  - The links sit inside each phase's disclosure panel. Phase 1 (open by default) has none, so the page's default view is unchanged.
- **Build-time link check:** `vite-plugins/link-check.ts`. The build fails when:
  - a literal internal link targets a non-canonical or non-indexable route (a 404 or noindex target, a wrong-case or trailing-slash variant);
  - a `#fragment` names an id nothing renders;
  - an indexable page is reachable only from the header and footer menus.

  It currently checks 98 links and 12 anchors.

### Inbound-link map (contextual links, menus excluded)

Every indexable route has at least one contextual inbound link; the build enforces this. The weakest before this phase was `/resources`, linked only from the menus and one `#insights` link on `/expertise`. It now has seven more, one from each service page.

### Not done, on purpose

- **No footer keyword blocks, no "related topics" link farms, no hidden links.**
- **No new links to `/team`.** It is reached from the menus, `/about` and the CTA flow. Adding more would be links for their own sake.

---

## I. Technical, performance and accessibility

### Measured problems and fixes

| Problem (lab, before) | Cause | Fix | Lab after |
|---|---|---|---|
| **CLS ≈ 0.31** on every directly loaded page except Home | The route loader was 60vh tall, so the footer was on screen at y≈583 and jumped when the lazy page rendered. Attribution: `FOOTER 583→…` on all five pages measured. | Loader is `min-h-dvh`, so the footer starts below the fold. Only the loading state changes. | CLS **≤ 0.002** on every page measured |
| **Wrong image preloaded** on most routes | `index.html` preloads the homepage hero, and the prerender copied it to all 18 routes. `/about`, `/resources` and `/services/content-review` downloaded an image they never show, competing with their own LCP image. | The prerender writes each route's own hero preload. The 404 has none. | Image bytes on `/about` **217 → 160 KB**; no wasted downloads |
| **LCP image and page code start late** on inner pages | The page chunk is requested only after the entry bundle runs. The hero image is requested only after React renders. | Per-route `modulepreload` for the page chunk and its imports, traced from `App.tsx` and the bundle. Combined with the correct hero preload, both now start at HTML parse. | LCP below |
| **Entry bundle carries unused UI libraries** | `App.tsx` mounted Query, Tooltip and Toast providers that nothing uses | Removed the three providers. The packages stay installed; nothing else changed. | Entry chunk **134.98 → 94.21 KB gzip (−30%)** |

### Lab results: before and after

Median of three loads; settings as described under Method.

| Page | LCP before → after | CLS before → after | JS transferred |
|---|---|---|---|
| `/` | 2,152 → 2,148 ms | 0.002 → 0.002 | 188 → 148 KB |
| `/about` | 3,504 → 2,428 ms (−31%) | 0.311 → 0.002 | 192 → 153 KB |
| `/resources` | 4,280 → 3,476 ms (−19%) | 0.312 → 0.001 | 193 → 153 KB |
| `/services/content-review` | 3,524 → 2,456 ms (−30%) | 0.310 → 0.002 | 193 → 153 KB |
| `/expertise` | 2,432 → 2,208 ms (−9%) | 0.310 → 0.001 | 190 → 150 KB |
| `/contact` | 2,580 → 2,308 ms (−11%) | 0.310 → 0.001 | 214 → 174 KB |

**Measurement note.** The first version of the hero preload also set `fetchpriority="high"`. In the throttled lab harness, that combined with the route modulepreloads stalled headless Chrome intermittently: 6 of 7 runs stalled, against 0 of 5 for the baseline. Two other harnesses, with 48 throttled loads between them, could not reproduce it. Bisecting the built HTML showed that removing either the modulepreloads or `fetchpriority` made runs complete, and LCP was the same without `fetchpriority`. So it was dropped. The shipped configuration then completed two consecutive full runs. This is a lab-tooling finding and was not observed in normal browsing. It is worth re-checking on the deploy preview with Chrome DevTools.

### Accessibility (axe-core 4.10, WCAG 2.0/2.1 A+AA + best practice, 19 URLs × 2 widths)

| Rule | Before | Fix |
|---|---|---|
| `definition-list` (serious, Home) | A `<p>` inside a `<dl>` group, with `dd` before `dt` | Term first in the markup, the figure kept on top with `order-first`, the note as a second `<dd>`. Looks the same. |
| `image-redundant-alt` (minor, every page) | Logo `alt="RevifyEarth"` beside the visible wordmark | Image is decorative (`alt=""`); the link is named "RevifyEarth home" |
| `color-contrast` (serious, service pages, Contact, some mobile tiles) | Small lime-on-teal (#a8c95a on #24626b, 3.68:1) index numbers and labels; teal-on-lime labels on Contact | **Not changed:** these are brand-palette pairings, a design decision. Exact pairs are listed under "Open items" for the designer. |

### Checked and already sound (no change)

- **Images:** width and height on every image, a responsive `srcset` and `sizes`, WebP throughout. Decorative backgrounds use `alt=""`; portraits have descriptive alt.
- **Canonicals, robots and sitemap:** Phase B behaviour is intact. The 404 is a real 404 with `noindex`. Trailing-slash and query variants canonicalise to the clean URL. The old host 301s.
- **HTTPS:** enforced by Netlify on the custom domain. This is outside the repository and was not changed.

### Open items (documented, not fixed here)

- **Google Fonts load render-blocking** (a cross-origin stylesheet, about 129 KB of font files in the lab). Self-hosting would remove a third-party round trip. It is a font-pipeline change that needs its own visual check, so it is deferred.
- **Main-thread work on Home.** The GSAP hero entrance (SplitText) and the motion system are the largest contributors to blocking time. Reducing it means touching approved animation, so it is out of scope.
- **Colour-contrast pairs for the designer:**
  - #a8c95a text on #24626b (3.68:1);
  - #24626b on #a8c95a (3.68:1);
  - #142b32 at 70% on #a8c95a (4.06:1).

  Small text needs 4.5:1.

---

## J. Governance and monitoring

The checklists and the Search Console runbook were added to [seo.md](./seo.md), in the sections "J. Governance & monitoring" and "Release checklist".

## Content roadmap review

The Phase F list in `seo.md` was re-audited:

- **Kept, as top priority:** the three articles already promised on `/resources` ("ask and we will send the underlying note"). The notes exist, so the first-party material exists.
- **Kept, but gated:** "What a BRSR alignment review checks". It has the highest search value, and also the highest regulatory risk. It needs ESG-lead authorship and citations to current SEBI circulars.
- **Merged:** "Preparing a draft for review" folds into the GRI reading article, which covers the same reader at the same moment.
- **Dropped:** "Making ESG data readable". Nothing first-party supports it until cleared report imagery exists. It returns to the list with the imagery.

## Known limitations

- Lab numbers come from a local emulator, not Netlify's CDN. Compare them relatively (before vs after), not as absolute Core Web Vitals.
- No field data exists yet. Core Web Vitals in Search Console need enough real traffic before they report.
- The internal-link check reads literal links. Links assembled at runtime (other than service-slug templates) are covered by the release browser validation instead.
