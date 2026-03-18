import { describe, it, expect } from 'vitest';
import { mapNewsArticle, mapNewsArticleSummary } from '@/lib/strapi/mappers/news-article';
import type { StrapiRawNewsArticle } from '@/lib/strapi/types';

describe('mapNewsArticleSummary', () => {
  it('maps full article summary', () => {
    const raw: StrapiRawNewsArticle = {
      id: 1,
      documentId: 'article-1',
      title: 'Test Article',
      slug: 'test-article',
      date: '2025-01-15',
      description: 'A test article description',
      video: null,
      mainPhoto: {
        id: 1,
        url: 'https://cdn.example.com/photo.jpg',
        alternativeText: 'Photo',
        width: 800,
        height: 600,
      },
      gallery: null,
      files: null,
      type: 'news',
      workplaces: [
        { id: 1, documentId: 'w1', name: 'Workplace 1', slug: 'workplace-1', address: null, phone: null, email: null, classCount: null, childrenCapacity: null, description: null, gardenDescription: null, virtualTourUrl: null, programType: null, specifics: null },
      ],
      tags: [
        { id: 1, documentId: 't1', name: 'Events', slug: 'events' },
      ],
      createdAt: '2025-01-15T10:00:00Z',
      updatedAt: '2025-01-15T10:00:00Z',
    };

    const result = mapNewsArticleSummary(raw);
    expect(result.documentId).toBe('article-1');
    expect(result.title).toBe('Test Article');
    expect(result.slug).toBe('test-article');
    expect(result.date).toBe('2025-01-15');
    expect(result.description).toBe('A test article description');
    expect(result.mainPhoto).not.toBeNull();
    expect(result.mainPhoto!.url).toBe('https://cdn.example.com/photo.jpg');
    expect(result.type).toBe('news');
    expect(result.workplaces).toHaveLength(1);
    expect(result.workplaces[0].name).toBe('Workplace 1');
    expect(result.tags).toHaveLength(1);
    expect(result.tags[0].name).toBe('Events');
  });

  it('maps article with minimal fields', () => {
    const raw: StrapiRawNewsArticle = {
      id: 2,
      documentId: 'article-2',
      title: 'Minimal',
      slug: null,
      date: '2025-02-01',
      description: null,
      video: null,
      mainPhoto: null,
      gallery: null,
      files: null,
      type: null,
      workplaces: null,
      tags: null,
      createdAt: '2025-02-01T10:00:00Z',
      updatedAt: '2025-02-01T10:00:00Z',
    };

    const result = mapNewsArticleSummary(raw);
    expect(result.slug).toBe('article-2'); // falls back to documentId
    expect(result.description).toBeNull();
    expect(result.mainPhoto).toBeNull();
    expect(result.type).toBeNull();
    expect(result.workplaces).toEqual([]);
    expect(result.tags).toEqual([]);
  });
});

describe('mapNewsArticle', () => {
  it('maps full article with gallery and files', () => {
    const raw: StrapiRawNewsArticle = {
      id: 1,
      documentId: 'article-1',
      title: 'Full Article',
      slug: 'full-article',
      date: '2025-03-01',
      description: 'Full description',
      video: 'https://youtube.com/watch?v=abc',
      mainPhoto: { id: 1, url: 'https://cdn.example.com/main.jpg', alternativeText: 'Main', width: 800, height: 600 },
      gallery: [
        { id: 2, url: 'https://cdn.example.com/g1.jpg', alternativeText: 'G1', width: 400, height: 300 },
        { id: 3, url: 'https://cdn.example.com/g2.jpg', alternativeText: 'G2', width: 400, height: 300 },
      ],
      files: [
        { id: 4, url: '/uploads/document.pdf', name: 'Document' },
      ],
      type: 'event',
      workplaces: [],
      tags: [],
      createdAt: '2025-03-01T10:00:00Z',
      updatedAt: '2025-03-01T10:00:00Z',
    };

    const result = mapNewsArticle(raw);
    expect(result.video).toBe('https://youtube.com/watch?v=abc');
    expect(result.gallery).toHaveLength(2);
    expect(result.gallery[0].url).toBe('https://cdn.example.com/g1.jpg');
    expect(result.files).toHaveLength(1);
    expect(result.files[0].name).toBe('Document');
  });

  it('handles null gallery and files', () => {
    const raw: StrapiRawNewsArticle = {
      id: 2,
      documentId: 'article-2',
      title: 'No Media',
      slug: 'no-media',
      date: '2025-03-02',
      description: null,
      video: null,
      mainPhoto: null,
      gallery: null,
      files: null,
      type: null,
      workplaces: null,
      tags: null,
      createdAt: '2025-03-02T10:00:00Z',
      updatedAt: '2025-03-02T10:00:00Z',
    };

    const result = mapNewsArticle(raw);
    expect(result.video).toBeNull();
    expect(result.gallery).toEqual([]);
    expect(result.files).toEqual([]);
  });
});
