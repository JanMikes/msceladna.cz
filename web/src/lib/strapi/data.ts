import { cache as reactCache } from 'react';
import type {
  CooperatingInstitution,
  Employee,
  Footer,
  NavigationItem,
  NewsArticle,
  NewsArticleSummary,
  Organization,
  Page,
  Project,
  Tag,
  Workplace,
} from '@/lib/types';
import type {
  StrapiRawCooperatingInstitution,
  StrapiRawEmployee,
  StrapiRawFooter,
  StrapiRawNavigation,
  StrapiRawNewsArticle,
  StrapiRawOrganization,
  StrapiRawPage,
  StrapiRawProject,
  StrapiRawTag,
  StrapiRawWorkplace,
} from './types';
import { getStrapiClient } from './client';
import { cached } from './cache';
import { mapFooter } from './mappers/footer';
import { mapNavigation } from './mappers/navigation';
import { mapNewsArticle, mapNewsArticleSummary } from './mappers/news-article';
import { mapPage } from './mappers/page';
import { mapWorkplace } from './mappers/workplace';
import { mapEmployee } from './mappers/employee';
import { mapProject } from './mappers/project';
import {
  buildNavigationPopulate,
  buildFooterPopulate,
  buildPagePopulate,
  buildNewsArticlePopulate,
  buildNewsListPopulate,
  buildEmployeePopulate,
  buildProjectPopulate,
} from './populates';

// All getters cache the RAW Strapi response in Redis (keyed semantically and
// indexed by invalidation tags), then run mappers fresh on every request. This
// keeps the cache deploy-safe: changing a mapper or React component takes effect
// immediately, because only the upstream data is cached, never rendered output.
// They are additionally wrapped in React's `cache()` to dedupe identical calls
// within a single request render (e.g. generateMetadata + the page component).
//
// Tag conventions (must stay in sync with strapi/src/revalidate.ts):
//   page:<slug>, pages, nav, footer, org,
//   workplaces, workplace:<slug>, employees, employees:<workplaceSlug>,
//   news, news:<slug>, projects, project:<slug>, tags, coops

// ── Pages ──

export const getPageBySlug = reactCache(async (slug: string): Promise<Page | null> => {
  const client = getStrapiClient();
  const res = await cached(
    `page:${slug}`,
    [`page:${slug}`, 'pages'],
    () =>
      client.findMany<StrapiRawPage>('pages', {
        filters: { slug: { $eq: slug } },
        populate: buildPagePopulate(),
        pagination: { pageSize: 1 },
      }),
    { fallback: { data: [], total: 0 } },
  );
  return res.data.length > 0 ? mapPage(res.data[0]) : null;
});

// ── Navigation ──

export const getNavigation = reactCache(async (menuSetId?: string): Promise<NavigationItem[]> => {
  const client = getStrapiClient();
  // With an explicit menu set, return just that set. Otherwise fall back to the
  // single menu set flagged `is_default` in Strapi — NOT every navigation item,
  // which would merge all sets together and surface duplicate links.
  const filters: Record<string, unknown> = menuSetId
    ? { menu_set: { documentId: { $eq: menuSetId } } }
    : { menu_set: { is_default: { $eq: true } } };
  const res = await cached(
    `nav:${menuSetId ?? 'default'}`,
    ['nav'],
    () =>
      client.findMany<StrapiRawNavigation>('navigations', {
        filters,
        sort: 'sortOrder:asc',
        populate: buildNavigationPopulate(),
        pagination: { pageSize: 100 },
      }),
    { fallback: { data: [], total: 0 } },
  );
  return res.data.map(mapNavigation).filter((item): item is NavigationItem => item !== null);
});

// Routes that render lists/details under a section slug (e.g. /aktuality/<slug>)
// take their navbar from the section page, not the individual entry. Mirrors the
// explicit `pageSlug` each of these pages passes to <MenuSetOverride>.
const SECTION_ROUTES = new Set(['aktuality', 'projekty', 'reportaze']);

/** The page slug whose assigned menu set governs the navbar for a given path. */
export function pageSlugForPath(pathname: string): string {
  const segments = pathname.split(/[?#]/)[0].split('/').filter(Boolean);
  if (segments.length === 0) return 'uvod';
  if (SECTION_ROUTES.has(segments[0])) return segments[0];
  return segments[segments.length - 1];
}

/**
 * Resolves the navigation items to render for a request path: the menu set
 * assigned to the matching page, or the default set when none is assigned. Used
 * by the root layout to seed the navbar server-side so the correct set is
 * rendered on first paint (no hydration flash). Client-side navigation is then
 * handled by <NavigationOverride>.
 */
export const getNavigationForPath = reactCache(async (pathname: string): Promise<NavigationItem[]> => {
  const menuSetId = await getPageMenuSetId(pageSlugForPath(pathname));
  return getNavigation(menuSetId ?? undefined);
});

export const getPageMenuSetId = reactCache(async (slug: string): Promise<string | null> => {
  const client = getStrapiClient();
  const res = await cached(
    `page-menuset:${slug}`,
    [`page:${slug}`, 'pages'],
    () =>
      client.findMany<{ menu_set: { documentId: string } | null }>('pages', {
        filters: { slug: { $eq: slug } },
        fields: ['slug'],
        populate: { menu_set: { fields: ['documentId'] } },
        pagination: { pageSize: 1 },
      }),
    { fallback: { data: [], total: 0 } },
  );
  return res.data.length > 0 ? (res.data[0].menu_set?.documentId ?? null) : null;
});

// ── Footer ──

export const getFooter = reactCache(async (): Promise<Footer | null> => {
  const client = getStrapiClient();
  const raw = await cached(
    'footer',
    ['footer'],
    () =>
      client.findSingle<StrapiRawFooter>('footer', {
        populate: buildFooterPopulate(),
      }),
    { fallback: null },
  );
  return raw ? mapFooter(raw) : null;
});

// ── Organization ──

export const getOrganization = reactCache(async (): Promise<Organization | null> => {
  const client = getStrapiClient();
  const raw = await cached(
    'org',
    ['org'],
    () => client.findSingle<StrapiRawOrganization>('organization'),
    { fallback: null },
  );
  if (!raw) return null;
  return {
    name: raw.name,
    address: raw.address ?? null,
    ico: raw.ico ?? null,
    dataBox: raw.dataBox ?? null,
    web: raw.web ?? null,
    email: raw.email ?? null,
    phoneManagement: raw.phoneManagement ?? null,
    phoneAdmin: raw.phoneAdmin ?? null,
    founder: raw.founder ?? null,
    founderUrl: raw.founderUrl ?? null,
  };
});

// ── Workplaces ──

export const getWorkplaces = reactCache(async (): Promise<Workplace[]> => {
  const client = getStrapiClient();
  const res = await cached(
    'workplaces',
    ['workplaces'],
    () =>
      client.findMany<StrapiRawWorkplace>('workplaces', {
        sort: 'name:asc',
        pagination: { pageSize: 100 },
      }),
    { fallback: { data: [], total: 0 } },
  );
  return res.data.map(mapWorkplace);
});

export const getWorkplaceBySlug = reactCache(async (slug: string): Promise<Workplace | null> => {
  const client = getStrapiClient();
  const res = await cached(
    `workplace:${slug}`,
    ['workplaces', `workplace:${slug}`],
    () =>
      client.findMany<StrapiRawWorkplace>('workplaces', {
        filters: { slug: { $eq: slug } },
        pagination: { pageSize: 1 },
      }),
    { fallback: { data: [], total: 0 } },
  );
  return res.data.length > 0 ? mapWorkplace(res.data[0]) : null;
});

// ── Employees ──

export const getEmployees = reactCache(async (workplaceSlug?: string): Promise<Employee[]> => {
  const client = getStrapiClient();
  const filters: Record<string, unknown> = {};
  if (workplaceSlug) {
    filters.workplace = { slug: { $eq: workplaceSlug } };
  }
  const res = await cached(
    `employees:${workplaceSlug ?? 'all'}`,
    ['employees'],
    () =>
      client.findMany<StrapiRawEmployee>('employees', {
        filters,
        populate: buildEmployeePopulate(),
        sort: 'sortOrder:asc',
        pagination: { pageSize: 100 },
      }),
    { fallback: { data: [], total: 0 } },
  );
  return res.data.map(mapEmployee);
});

// ── News Articles ──

export const getNewsArticles = reactCache(
  async (
    options: {
      type?: string;
      workplaceSlug?: string;
      tagSlug?: string;
      page?: number;
      limit?: number;
    } = {},
  ): Promise<{ articles: NewsArticleSummary[]; total: number }> => {
    const client = getStrapiClient();
    const filters: Record<string, unknown> = { date: { $notNull: true } };

    if (options.type) {
      filters.type = { $eq: options.type };
    }
    if (options.workplaceSlug) {
      filters.workplaces = { slug: { $eq: options.workplaceSlug } };
    }
    if (options.tagSlug) {
      filters.tags = { slug: { $eq: options.tagSlug } };
    }

    const page = options.page ?? 1;
    const limit = options.limit ?? 12;
    const res = await cached(
      `news:list:${options.type ?? ''}:${options.workplaceSlug ?? ''}:${options.tagSlug ?? ''}:${page}:${limit}`,
      ['news'],
      () =>
        client.findMany<StrapiRawNewsArticle>('news-articles', {
          filters,
          populate: buildNewsListPopulate(),
          sort: 'date:desc',
          pagination: { page, pageSize: limit },
        }),
      { fallback: { data: [], total: 0 } },
    );
    return {
      articles: res.data.map(mapNewsArticleSummary),
      total: res.total,
    };
  },
);

export const getNewsArticleBySlug = reactCache(async (slug: string): Promise<NewsArticle | null> => {
  const client = getStrapiClient();
  const res = await cached(
    `news:${slug}`,
    ['news', `news:${slug}`],
    () =>
      client.findMany<StrapiRawNewsArticle>('news-articles', {
        filters: { slug: { $eq: slug } },
        populate: buildNewsArticlePopulate(),
        pagination: { pageSize: 1 },
      }),
    { fallback: { data: [], total: 0 } },
  );
  return res.data.length > 0 ? mapNewsArticle(res.data[0]) : null;
});

// ── Projects ──

export const getProjects = reactCache(async (status?: string): Promise<Project[]> => {
  const client = getStrapiClient();
  const filters: Record<string, unknown> = {};
  if (status) {
    filters.status = { $eq: status };
  }
  const res = await cached(
    `projects:${status ?? 'all'}`,
    ['projects'],
    () =>
      client.findMany<StrapiRawProject>('projects', {
        filters,
        populate: buildProjectPopulate(),
        sort: 'dateFrom:desc',
        pagination: { pageSize: 100 },
      }),
    { fallback: { data: [], total: 0 } },
  );
  return res.data.map(mapProject);
});

export const getProjectBySlug = reactCache(async (slug: string): Promise<Project | null> => {
  const client = getStrapiClient();
  const res = await cached(
    `project:${slug}`,
    ['projects', `project:${slug}`],
    () =>
      client.findMany<StrapiRawProject>('projects', {
        filters: { slug: { $eq: slug } },
        populate: buildProjectPopulate(),
        pagination: { pageSize: 1 },
      }),
    { fallback: { data: [], total: 0 } },
  );
  return res.data.length > 0 ? mapProject(res.data[0]) : null;
});

// ── Tags ──

export const getTags = reactCache(async (): Promise<Tag[]> => {
  const client = getStrapiClient();
  const res = await cached(
    'tags',
    ['tags'],
    () =>
      client.findMany<StrapiRawTag>('tags', {
        sort: 'name:asc',
        pagination: { pageSize: 100 },
      }),
    { fallback: { data: [], total: 0 } },
  );
  return res.data.map((t) => ({ documentId: t.documentId, name: t.name, slug: t.slug }));
});

// ── Cooperating Institutions ──

export const getCooperatingInstitutions = reactCache(
  async (): Promise<CooperatingInstitution[]> => {
    const client = getStrapiClient();
    const res = await cached(
      'coops',
      ['coops'],
      () =>
        client.findMany<StrapiRawCooperatingInstitution>('cooperating-institutions', {
          sort: 'sortOrder:asc',
          pagination: { pageSize: 100 },
        }),
      { fallback: { data: [], total: 0 } },
    );
    return res.data.map((raw) => ({
      documentId: raw.documentId,
      name: raw.name,
      type: raw.type ?? null,
      contactPerson: raw.contactPerson ?? null,
      phone: raw.phone ?? null,
      email: raw.email ?? null,
      web: raw.web ?? null,
      address: raw.address ?? null,
      description: raw.description ?? null,
      sortOrder: raw.sortOrder ?? 0,
    }));
  },
);
