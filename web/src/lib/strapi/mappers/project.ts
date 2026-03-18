import type { Project } from '@/lib/types';
import type { StrapiRawProject } from '../types';
import { mapMedia, mapMediaArray } from './shared';

export function mapProject(raw: StrapiRawProject): Project {
  return {
    documentId: raw.documentId,
    name: raw.name,
    slug: raw.slug,
    projectNumber: raw.projectNumber ?? null,
    goal: raw.goal ?? null,
    financialAmount: raw.financialAmount ?? null,
    description: raw.description ?? null,
    logos: mapMediaArray(raw.logos),
    publicityPoster: mapMedia(raw.publicityPoster),
    status: raw.status ?? null,
    dateFrom: raw.dateFrom ?? null,
    dateTo: raw.dateTo ?? null,
    workplaces: (raw.workplaces ?? []).map((w) => ({ name: w.name, slug: w.slug })),
  };
}
