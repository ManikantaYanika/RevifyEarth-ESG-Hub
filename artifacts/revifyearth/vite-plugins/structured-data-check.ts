/**
 * Build-time proof of the JSON-LD in src/data/seo.ts (SEO Phase E).
 *
 * Structured data that disagrees with the page, points at nothing, or claims
 * something the site does not show is worse than none — search engines treat it as
 * spam. This checks every page's graph before it is written, and fails the build
 * on any problem rather than warning:
 *   - only schema.org types the site has a real basis for (no Review, Rating, FAQ,
 *     Product, Event, JobPosting, Breadcrumb or Article until the page shows one)
 *   - every URL and @id is on the canonical origin
 *   - no @id is defined twice in a graph, a node defined on several pages is
 *     identical on each, and every { "@id" } reference resolves somewhere on the site
 *   - each page's WebPage node repeats that page's canonical, title and description
 *   - Service, ItemList and Person nodes match the visible service and team data
 */
import {
  ORGANIZATION_ID,
  SITE_ORIGIN,
  WEBSITE_ID,
  serviceId,
  teamMembers,
  webPageId,
  type PageSeo,
} from '../src/data/seo';
import { services } from '../src/data/services';

type Node = Record<string, unknown>;

const ALLOWED_TYPES = new Set([
  'Organization',
  'WebSite',
  'WebPage',
  'AboutPage',
  'ContactPage',
  'CollectionPage',
  'Service',
  'ItemList',
  'ListItem',
  'Person',
  'Country',
]);
const PAGE_TYPES = new Set(['WebPage', 'AboutPage', 'ContactPage', 'CollectionPage']);
const URL_KEYS = new Set(['@id', 'url', 'logo', 'image']);

const isObject = (value: unknown): value is Node => typeof value === 'object' && value !== null && !Array.isArray(value);
const isReference = (value: Node): boolean => Object.keys(value).length === 1 && typeof value['@id'] === 'string';

/** Every object in the tree, depth first. */
function* walk(value: unknown): Generator<Node> {
  if (Array.isArray(value)) for (const item of value) yield* walk(item);
  else if (isObject(value)) {
    yield value;
    for (const child of Object.values(value)) yield* walk(child);
  }
}

export function assertStructuredData(pages: readonly PageSeo[], notFound: PageSeo): void {
  const problems: string[] = [];
  const definitions = new Map<string, { json: string; where: string }>();
  const references: { id: string; where: string }[] = [];

  for (const page of [...pages, notFound]) {
    const where = page.path ?? '404';
    const data = page.structuredData;
    const graph = data['@graph'];
    if (data['@context'] !== 'https://schema.org' || !Array.isArray(graph)) {
      problems.push(`${where}: JSON-LD must be one { "@context": "https://schema.org", "@graph": [...] }`);
      continue;
    }
    const nodes = graph as Node[];
    const ofType = (...types: string[]) => nodes.filter((node) => types.includes(String(node['@type'])));
    const pageNodes = nodes.filter((node) => PAGE_TYPES.has(String(node['@type'])));

    // Types, URLs, ids and references, anywhere in the tree.
    const idsHere = new Set<string>();
    for (const node of walk(graph)) {
      if (isReference(node)) {
        references.push({ id: String(node['@id']), where });
        continue;
      }
      const type = node['@type'];
      if (typeof type !== 'string' || !ALLOWED_TYPES.has(type)) {
        problems.push(`${where}: @type ${JSON.stringify(type)} is not in the allowed set`);
      }
      for (const [key, value] of Object.entries(node)) {
        if (URL_KEYS.has(key) && (typeof value !== 'string' || !value.startsWith(`${SITE_ORIGIN}/`))) {
          problems.push(`${where}: ${type}.${key} is not an absolute ${SITE_ORIGIN}/ URL: ${JSON.stringify(value)}`);
        }
      }
      const id = node['@id'];
      if (typeof id === 'string') {
        if (idsHere.has(id)) problems.push(`${where}: @id ${id} is defined twice`);
        idsHere.add(id);
        const json = JSON.stringify(node);
        const earlier = definitions.get(id);
        if (!earlier) definitions.set(id, { json, where });
        else if (earlier.json !== json) problems.push(`${where}: ${id} differs from its definition on ${earlier.where}`);
      }
    }

    // The company on every page, exactly once.
    const organizations = ofType('Organization');
    if (organizations.length !== 1 || organizations[0]['@id'] !== ORGANIZATION_ID) {
      problems.push(`${where}: expected exactly one Organization (${ORGANIZATION_ID})`);
    }
    if (ofType('WebSite').length !== (page.path === '/' ? 1 : 0)) problems.push(`${where}: WebSite belongs on / only`);

    if (page.path === null) {
      // Not found: nothing to describe beyond the company.
      if (nodes.length !== 1) problems.push('404: graph must contain only the Organization');
      continue;
    }

    // The page node mirrors the head exactly.
    const pageNode = pageNodes[0];
    if (pageNodes.length !== 1 || !pageNode) problems.push(`${where}: expected exactly one WebPage node`);
    else {
      const expect = (key: string, value: unknown) => {
        if (pageNode[key] !== value) problems.push(`${where}: WebPage.${key} is ${JSON.stringify(pageNode[key])}, expected ${JSON.stringify(value)}`);
      };
      expect('@id', webPageId(page.path));
      expect('url', page.canonical);
      expect('name', page.title);
      expect('description', page.description);
      if (!isObject(pageNode.isPartOf) || pageNode.isPartOf['@id'] !== WEBSITE_ID) {
        problems.push(`${where}: WebPage.isPartOf must reference ${WEBSITE_ID}`);
      }
    }

    // Services: the one this page describes, matching the visible copy.
    const service = services.find((candidate) => page.path === `/services/${candidate.slug}`);
    const serviceNodes = ofType('Service');
    if (service) {
      const node = serviceNodes[0];
      if (serviceNodes.length !== 1 || !node) problems.push(`${where}: expected exactly one Service`);
      else {
        if (node['@id'] !== serviceId(service.slug)) problems.push(`${where}: Service @id mismatch`);
        if (node.name !== service.title) problems.push(`${where}: Service.name differs from the visible title`);
        if (node.description !== service.overview[0]) problems.push(`${where}: Service.description differs from the visible overview`);
        const main = pageNode?.mainEntity;
        if (!isObject(main) || main['@id'] !== serviceId(service.slug)) problems.push(`${where}: WebPage.mainEntity must be the Service`);
      }
    } else if (serviceNodes.length) problems.push(`${where}: Service markup on a page that is not a service page`);

    // The catalogue list mirrors the catalogue.
    const lists = [...walk(graph)].filter((node) => node['@type'] === 'ItemList');
    if (page.path === '/services') {
      const items = lists[0]?.itemListElement;
      const expected = services.map((entry) => `${SITE_ORIGIN}/services/${entry.slug}`);
      const actual = Array.isArray(items) ? items.map((item: Node) => item.url) : [];
      if (lists.length !== 1 || JSON.stringify(actual) !== JSON.stringify(expected)) {
        problems.push('/services: ItemList must list every service URL in catalogue order');
      }
    } else if (lists.length) problems.push(`${where}: ItemList markup outside /services`);

    // People: exactly those pictured on /team, nowhere else.
    const people = ofType('Person').map((node) => String(node.name));
    if (page.path === '/team') {
      const expected = teamMembers.map((member) => member.name);
      if (JSON.stringify(people) !== JSON.stringify(expected)) problems.push('/team: Person nodes must match the team shown on the page');
    } else if (people.length) problems.push(`${where}: Person markup outside /team`);
  }

  for (const reference of references) {
    if (!definitions.has(reference.id)) problems.push(`${reference.where}: reference to ${reference.id}, which no page defines`);
  }

  if (problems.length) throw new Error(`structured data check failed:\n  - ${problems.join('\n  - ')}`);
}
