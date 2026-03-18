import type { NewsArticle, NewsArticleSummary } from '@/lib/types';
import type { StrapiRawNewsArticle } from '../types';
import { mapMedia, mapMediaArray, mapFileArray } from './shared';

export function mapNewsArticleSummary(raw: StrapiRawNewsArticle): NewsArticleSummary {
  return {
    documentId: raw.documentId,
    title: raw.title,
    slug: raw.slug || raw.documentId,
    date: raw.date,
    description: raw.description ?? null,
    mainPhoto: mapMedia(raw.mainPhoto),
    type: raw.type ?? null,
    workplaces: (raw.workplaces ?? []).map((w) => ({ name: w.name, slug: w.slug })),
    tags: (raw.tags ?? []).map((t) => ({ documentId: t.documentId, name: t.name, slug: t.slug })),
  };
}

export function mapNewsArticle(raw: StrapiRawNewsArticle): NewsArticle {
  return {
    ...mapNewsArticleSummary(raw),
    video: raw.video ?? null,
    gallery: mapMediaArray(raw.gallery),
    files: mapFileArray(raw.files),
  };
}
