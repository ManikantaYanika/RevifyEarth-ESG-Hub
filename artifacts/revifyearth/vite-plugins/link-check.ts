/**
 * Build-time internal-link check (SEO Phase H).
 *
 * Reads every literal internal link in src/ — JSX `href="/..."` and data
 * `href: '/...'` — and fails the build when:
 *   - a link points at something that is not a canonical, indexable route: a page
 *     that would render NotFound (404, noindex), a wrong-case or trailing-slash
 *     variant, or a route that no longer exists
 *   - a `#fragment` names an id that nothing on the site renders
 *   - an indexable page is reachable only through the header/footer menus. Every
 *     page needs at least one contextual link from page content, which is what tells
 *     a crawler (and a reader) how it relates to the rest of the site.
 *
 * Links built from data at runtime are covered where their shape is known:
 * `/services/${slug}` templates link every service page, and the sector anchors on
 * /industries come from industries.ts. Other template links are not checked here;
 * the release validation follows every rendered link in a browser.
 *
 * Imported by the Vite config at build time: no aliases, no DOM.
 */
import { readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';

import { industries } from '../src/data/industries';
import { indexableRoutes, resolveRoute } from '../src/data/seo';
import { services } from '../src/data/services';

const LINK = /href(?:=|: )(["'`])(\/[^"'`]*)\1/g;
const SERVICE_TEMPLATE = /`\/services\/\$\{/;
const LITERAL_ID = /\bid="([a-z][\w-]*)"/g;
/** The menus: rendered on every page, so they do not count as contextual links. */
const NAVIGATION_FILE = 'data/navigation.ts';

function sourceFiles(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return entry.name === 'ui' ? [] : sourceFiles(full); // shadcn primitives, no site links
    return /\.(ts|tsx)$/.test(entry.name) ? [full] : [];
  });
}

export interface LinkCheckSummary {
  readonly links: number;
  readonly anchors: number;
}

export function assertInternalLinks(srcDir: string): LinkCheckSummary {
  const files = sourceFiles(srcDir).map((file) => ({
    name: path.relative(srcDir, file).replace(/\\/g, '/'),
    text: readFileSync(file, 'utf8'),
  }));

  const ids = new Set(industries.map((industry) => industry.id));
  for (const file of files) for (const [, id] of file.text.matchAll(LITERAL_ID)) ids.add(id);

  const problems: string[] = [];
  const contextualInbound = new Map<string, Set<string>>(indexableRoutes.map((route) => [route, new Set()]));
  let links = 0;
  let anchors = 0;

  for (const file of files) {
    const contextual = file.name !== NAVIGATION_FILE;
    if (contextual && SERVICE_TEMPLATE.test(file.text)) {
      for (const service of services) contextualInbound.get(`/services/${service.slug}`)?.add(file.name);
    }
    for (const [, , href] of file.text.matchAll(LINK)) {
      if (href.includes('${')) continue; // built at runtime; see the header comment
      links += 1;
      const [route, fragment] = href.split('#', 2);
      const target = route || '/';
      if (resolveRoute(target) !== target) {
        problems.push(`${file.name}: ${href} is not a canonical indexable route`);
        continue;
      }
      if (fragment !== undefined) {
        anchors += 1;
        if (!ids.has(fragment)) problems.push(`${file.name}: ${href} — nothing renders id="${fragment}"`);
      }
      if (contextual) contextualInbound.get(target)?.add(file.name);
    }
  }

  for (const [route, from] of contextualInbound) {
    if (route !== '/' && from.size === 0) problems.push(`${route} is linked only from the menus — add a contextual link`);
  }
  if (problems.length) throw new Error(`internal link check failed:\n  - ${problems.join('\n  - ')}`);
  return { links, anchors };
}
