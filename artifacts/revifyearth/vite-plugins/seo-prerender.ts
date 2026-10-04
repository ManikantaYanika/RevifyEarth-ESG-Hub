/**
 * Build-time per-route HTML heads.
 *
 * The site is a client-rendered SPA, so before this every URL returned the same
 * index.html: the homepage title, description and social tags, and no canonical.
 * Link previews (LinkedIn, WhatsApp, X) never run JavaScript and showed the homepage
 * for every page; crawlers only saw the right signals after rendering.
 *
 * This plugin copies the built index.html once per real route and rewrites only the
 * SEO tags in its <head>. The body, scripts and styles are untouched, so the same
 * React app boots on every page exactly as before. Values come from
 * src/data/seo.ts, the same module the runtime <PageMeta> reads, so the raw HTML
 * and the hydrated head cannot drift apart.
 *
 * Outputs, all in the publish directory:
 *   - index.html, about.html, services/report-design.html, ... one per route
 *   - 404.html  noindex shell that Netlify returns with status 404
 *   - sitemap.xml generated from the same route list
 *   - _redirects  route rewrites injected at the `# @seo-routes` marker
 *
 * The build fails if App.tsx declares a route with no SEO entry, or the reverse.
 * Flat `about.html` files (not `about/index.html`) are deliberate: a directory
 * index invites the host to redirect `/about` to `/about/`.
 */
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';

import type { Plugin, ResolvedConfig } from 'vite';

import {
  SITE_ORIGIN,
  indexableRoutes,
  notFoundSeo,
  organizationJsonLd,
  routeSeo,
  socialImageUrl,
  type PageSeo,
} from '../src/data/seo';
import { services } from '../src/data/services';

const EXPECTED_ORIGIN = 'https://revifyearth.com';
const ROUTES_MARKER = '# @seo-routes';
const NOT_FOUND_FILE = '404.html';

export const routeFileName = (route: string): string => (route === '/' ? 'index.html' : `${route.slice(1)}.html`);

const escapeHtml = (value: string): string =>
  value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** Tags this plugin owns. Removed from the shell, then written exactly once. */
const OWNED_TAGS: readonly RegExp[] = [
  /<meta\s+name="(?:description|robots|twitter:[a-z:]+)"[^>]*>\s*/gi,
  /<meta\s+property="og:[a-z:_]+"[^>]*>\s*/gi,
  /<link\s+rel="canonical"[^>]*>\s*/gi,
  /<script\s+type="application\/ld\+json"[^>]*>[\s\S]*?<\/script>\s*/gi,
];

function headBlock(seo: PageSeo): string {
  const jsonLd = JSON.stringify(organizationJsonLd).replace(/</g, '\\u003c');
  const lines = [
    `<title>${escapeHtml(seo.title)}</title>`,
    `<meta name="description" content="${escapeHtml(seo.description)}" />`,
    `<meta name="robots" content="${escapeHtml(seo.robots)}" />`,
    seo.canonical ? `<link rel="canonical" href="${escapeHtml(seo.canonical)}" />` : null,
    `<meta property="og:site_name" content="RevifyEarth" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:title" content="${escapeHtml(seo.ogTitle)}" />`,
    `<meta property="og:description" content="${escapeHtml(seo.ogDescription)}" />`,
    seo.ogUrl ? `<meta property="og:url" content="${escapeHtml(seo.ogUrl)}" />` : null,
    `<meta property="og:image" content="${escapeHtml(socialImageUrl)}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${escapeHtml(seo.twitterTitle)}" />`,
    `<meta name="twitter:description" content="${escapeHtml(seo.twitterDescription)}" />`,
    `<meta name="twitter:image" content="${escapeHtml(socialImageUrl)}" />`,
    `<script type="application/ld+json" data-jsonld="organization">${jsonLd}</script>`,
  ].filter((line): line is string => line !== null);
  return `${lines.join('\n    ')}\n    `;
}

const count = (html: string, pattern: RegExp): number => (html.match(pattern) ?? []).length;

/** Replaces the shell's SEO tags with this page's, then proves the result. */
export function renderHead(shell: string, seo: PageSeo): string {
  if (count(shell, /<title>[\s\S]*?<\/title>/gi) !== 1) {
    throw new Error('seo-prerender: index.html must contain exactly one <title>.');
  }
  let html = shell.replace(/<title>[\s\S]*?<\/title>\s*/i, '<!--seo-head-->');
  for (const tag of OWNED_TAGS) html = html.replace(tag, '');
  html = html.replace('<!--seo-head-->', headBlock(seo));

  const where = seo.path ?? NOT_FOUND_FILE;
  const expectOne = (label: string, pattern: RegExp, expected = 1) => {
    const found = count(html, pattern);
    if (found !== expected) throw new Error(`seo-prerender: ${where} has ${found} ${label}, expected ${expected}.`);
  };
  expectOne('<title>', /<title>/g);
  expectOne('meta description', /<meta name="description"/g);
  expectOne('meta robots', /<meta name="robots"/g);
  expectOne('canonical', /<link rel="canonical"/g, seo.canonical ? 1 : 0);
  expectOne('og:title', /<meta property="og:title"/g);
  expectOne('og:description', /<meta property="og:description"/g);
  expectOne('og:url', /<meta property="og:url"/g, seo.ogUrl ? 1 : 0);
  expectOne('twitter:card', /<meta name="twitter:card"/g);
  expectOne('twitter:title', /<meta name="twitter:title"/g);
  expectOne('twitter:description', /<meta name="twitter:description"/g);
  expectOne('JSON-LD', /application\/ld\+json/g);
  expectOne('app root', /<div id="root"><\/div>/g);
  return html;
}

/**
 * Reads the route table from App.tsx itself, so a page added there without an SEO
 * entry fails the build instead of shipping with the homepage's metadata.
 */
export function discoverAppRoutes(appSource: string): string[] {
  const patterns = [...appSource.matchAll(/<Route\s+path="([^"]+)"/g)].map((match) => match[1]);
  if (patterns.length === 0) throw new Error('seo-prerender: no <Route path="..."> found in src/App.tsx.');

  const routes: string[] = [];
  for (const pattern of patterns) {
    if (!/[:*]/.test(pattern)) routes.push(pattern);
    else if (pattern === '/services/:slug') routes.push(...services.map((service) => `/services/${service.slug}`));
    else {
      throw new Error(
        `seo-prerender: route "${pattern}" has parameters this build does not know how to expand. ` +
          'Add its expansion to discoverAppRoutes and its metadata to src/data/seo.ts.',
      );
    }
  }
  return routes;
}

function assertCoverage(appRoutes: readonly string[]): void {
  const problems: string[] = [];
  const seoSet = new Set(indexableRoutes);
  const appSet = new Set(appRoutes);

  if (seoSet.size !== indexableRoutes.length) problems.push('duplicate routes in src/data/seo.ts');
  for (const route of appRoutes) if (!seoSet.has(route)) problems.push(`App route without SEO metadata: ${route}`);
  for (const route of indexableRoutes) if (!appSet.has(route)) problems.push(`SEO metadata for a route App.tsx does not render: ${route}`);
  for (const route of indexableRoutes) {
    if (route !== '/' && (!route.startsWith('/') || route.endsWith('/') || route !== route.toLowerCase())) {
      problems.push(`route is not in canonical form (leading slash, lowercase, no trailing slash): ${route}`);
    }
  }
  if (problems.length) throw new Error(`seo-prerender: route coverage failed:\n  - ${problems.join('\n  - ')}`);
}

function renderSitemap(pages: readonly PageSeo[]): string {
  const urls = pages.map((page) => `  <url><loc>${escapeHtml(page.canonical!)}</loc></url>`).join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
}

function routeRewrites(): string {
  return indexableRoutes
    .filter((route) => route !== '/')
    .map((route) => `${route}  /${routeFileName(route)}  200`)
    .join('\n');
}

export function seoPrerender(): Plugin {
  let config: ResolvedConfig;
  let generated = false;

  return {
    name: 'revify:seo-prerender',
    apply: 'build',
    enforce: 'post',

    configResolved(resolved) {
      config = resolved;
    },

    generateBundle(_options, bundle) {
      if (SITE_ORIGIN !== EXPECTED_ORIGIN) {
        this.error(`seo-prerender: company.website is "${SITE_ORIGIN}", expected "${EXPECTED_ORIGIN}".`);
      }

      const appSource = readFileSync(path.resolve(config.root, 'src/App.tsx'), 'utf8');
      assertCoverage(discoverAppRoutes(appSource));

      const index = bundle['index.html'];
      if (!index || index.type !== 'asset') this.error('seo-prerender: index.html is missing from the bundle.');
      const shell = String(index.source);

      for (const page of routeSeo) {
        const html = renderHead(shell, page);
        const fileName = routeFileName(page.path!);
        if (fileName === 'index.html') index.source = html;
        else this.emitFile({ type: 'asset', fileName, source: html });
      }
      this.emitFile({ type: 'asset', fileName: NOT_FOUND_FILE, source: renderHead(shell, notFoundSeo) });
      this.emitFile({ type: 'asset', fileName: 'sitemap.xml', source: renderSitemap(routeSeo) });
      generated = true;
    },

    /** Runs after the public directory and the bundle are both on disk. */
    closeBundle() {
      if (!generated) return;
      const outDir = path.resolve(config.root, config.build.outDir);

      const redirectsPath = path.join(outDir, '_redirects');
      if (!existsSync(redirectsPath)) throw new Error('seo-prerender: _redirects was not copied to the output.');
      const redirects = readFileSync(redirectsPath, 'utf8');
      if (redirects.split(ROUTES_MARKER).length !== 2) {
        throw new Error(`seo-prerender: public/_redirects must contain the "${ROUTES_MARKER}" marker exactly once.`);
      }
      const written = redirects.replace(ROUTES_MARKER, `${ROUTES_MARKER} (generated from src/data/seo.ts)\n${routeRewrites()}`);
      writeFileSync(redirectsPath, written);

      // Final proof against what is actually on disk.
      const problems: string[] = [];
      for (const page of routeSeo) {
        const file = path.join(outDir, routeFileName(page.path!));
        if (!existsSync(file)) problems.push(`missing ${routeFileName(page.path!)}`);
        else if (!readFileSync(file, 'utf8').includes(`<link rel="canonical" href="${page.canonical}" />`)) {
          problems.push(`${routeFileName(page.path!)} lacks canonical ${page.canonical}`);
        }
        if (page.path !== '/' && !written.includes(`\n${page.path}  /${routeFileName(page.path!)}  200`)) {
          problems.push(`_redirects lacks a rewrite for ${page.path}`);
        }
      }
      const notFound = path.join(outDir, NOT_FOUND_FILE);
      if (!existsSync(notFound) || !readFileSync(notFound, 'utf8').includes('content="noindex, nofollow"')) {
        problems.push('404.html missing or not noindex');
      }
      const sitemap = readFileSync(path.join(outDir, 'sitemap.xml'), 'utf8');
      if (count(sitemap, /<loc>/g) !== routeSeo.length) problems.push('sitemap.xml URL count differs from routes');
      if (problems.length) throw new Error(`seo-prerender: output check failed:\n  - ${problems.join('\n  - ')}`);

      config.logger.info(
        `seo-prerender: ${routeSeo.length} route heads, 404.html, sitemap.xml (${routeSeo.length} URLs), ` +
          `${routeSeo.length - 1} route rewrites`,
      );
    },
  };
}
