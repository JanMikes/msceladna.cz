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
  buildEmployeePopulate,
  buildProjectPopulate,
} from './populates';

// ── Pages ──

export async function getPageBySlug(slug: string): Promise<Page | null> {
  const client = getStrapiClient();
  const { data } = await client.findMany<StrapiRawPage>('pages', {
    filters: { slug: { $eq: slug } },
    populate: buildPagePopulate(),
    pagination: { pageSize: 1 },
  });
  return data.length > 0 ? mapPage(data[0]) : null;
}

// ── Navigation ──

export async function getNavigation(): Promise<NavigationItem[]> {
  const client = getStrapiClient();
  const { data } = await client.findMany<StrapiRawNavigation>('navigations', {
    sort: 'sortOrder:asc',
    populate: buildNavigationPopulate(),
    pagination: { pageSize: 100 },
  });
  return data.map(mapNavigation).filter((item): item is NavigationItem => item !== null);
}

// ── Footer ──

export async function getFooter(): Promise<Footer | null> {
  const client = getStrapiClient();
  const raw = await client.findSingle<StrapiRawFooter>('footer', {
    populate: buildFooterPopulate(),
  });
  return raw ? mapFooter(raw) : null;
}

// ── Organization ──

export async function getOrganization(): Promise<Organization | null> {
  const client = getStrapiClient();
  const raw = await client.findSingle<StrapiRawOrganization>('organization', {
    populate: {
      phones: { populate: '*' },
    },
  });
  if (!raw) return null;
  return {
    name: raw.name,
    address: raw.address ?? null,
    ico: raw.ico ?? null,
    dataBox: raw.dataBox ?? null,
    web: raw.web ?? null,
    email: raw.email ?? null,
    phones: (raw.phones ?? []).map((p) => p.phone),
    founder: raw.founder ?? null,
    founderUrl: raw.founderUrl ?? null,
  };
}

// ── Workplaces ──

export async function getWorkplaces(): Promise<Workplace[]> {
  const client = getStrapiClient();
  const { data } = await client.findMany<StrapiRawWorkplace>('workplaces', {
    sort: 'name:asc',
    pagination: { pageSize: 100 },
  });
  return data.map(mapWorkplace);
}

export async function getWorkplaceBySlug(slug: string): Promise<Workplace | null> {
  const client = getStrapiClient();
  const { data } = await client.findMany<StrapiRawWorkplace>('workplaces', {
    filters: { slug: { $eq: slug } },
    pagination: { pageSize: 1 },
  });
  return data.length > 0 ? mapWorkplace(data[0]) : null;
}

// ── Employees ──

export async function getEmployees(workplaceSlug?: string): Promise<Employee[]> {
  const client = getStrapiClient();
  const filters: Record<string, unknown> = {};
  if (workplaceSlug) {
    filters.workplace = { slug: { $eq: workplaceSlug } };
  }
  const { data } = await client.findMany<StrapiRawEmployee>('employees', {
    filters,
    populate: buildEmployeePopulate(),
    sort: 'sortOrder:asc',
    pagination: { pageSize: 100 },
  });
  return data.map(mapEmployee);
}

// ── News Articles ──

export async function getNewsArticles(options: {
  type?: string;
  workplaceSlug?: string;
  tagSlug?: string;
  page?: number;
  limit?: number;
} = {}): Promise<{ articles: NewsArticleSummary[]; total: number }> {
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

  const { data, total } = await client.findMany<StrapiRawNewsArticle>('news-articles', {
    filters,
    populate: {
      mainPhoto: { fields: ['url', 'alternativeText', 'width', 'height'] },
      workplaces: { fields: ['name', 'slug'] },
      tags: { fields: ['name', 'slug'] },
    },
    sort: 'date:desc',
    pagination: { page: options.page ?? 1, pageSize: options.limit ?? 12 },
  });
  return {
    articles: data.map(mapNewsArticleSummary),
    total,
  };
}

export async function getNewsArticleBySlug(slug: string): Promise<NewsArticle | null> {
  const client = getStrapiClient();
  const { data } = await client.findMany<StrapiRawNewsArticle>('news-articles', {
    filters: { slug: { $eq: slug } },
    populate: buildNewsArticlePopulate(),
    pagination: { pageSize: 1 },
  });
  return data.length > 0 ? mapNewsArticle(data[0]) : null;
}

// ── Projects ──

export async function getProjects(status?: string): Promise<Project[]> {
  const client = getStrapiClient();
  const filters: Record<string, unknown> = {};
  if (status) {
    filters.status = { $eq: status };
  }
  const { data } = await client.findMany<StrapiRawProject>('projects', {
    filters,
    populate: buildProjectPopulate(),
    sort: 'dateFrom:desc',
    pagination: { pageSize: 100 },
  });
  return data.map(mapProject);
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  const client = getStrapiClient();
  const { data } = await client.findMany<StrapiRawProject>('projects', {
    filters: { slug: { $eq: slug } },
    populate: buildProjectPopulate(),
    pagination: { pageSize: 1 },
  });
  return data.length > 0 ? mapProject(data[0]) : null;
}

// ── Tags ──

export async function getTags(): Promise<Tag[]> {
  const client = getStrapiClient();
  const { data } = await client.findMany<StrapiRawTag>('tags', {
    sort: 'name:asc',
    pagination: { pageSize: 100 },
  });
  return data.map((t) => ({ documentId: t.documentId, name: t.name, slug: t.slug }));
}

// ── Cooperating Institutions ──

export async function getCooperatingInstitutions(): Promise<CooperatingInstitution[]> {
  const client = getStrapiClient();
  const { data } = await client.findMany<StrapiRawCooperatingInstitution>('cooperating-institutions', {
    sort: 'sortOrder:asc',
    pagination: { pageSize: 100 },
  });
  return data.map((raw) => ({
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
}
