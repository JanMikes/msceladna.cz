import { describe, it, expect } from 'vitest';
import { mapProject } from '@/lib/strapi/mappers/project';
import type { StrapiRawProject } from '@/lib/strapi/types';

describe('mapProject', () => {
  it('maps full project', () => {
    const raw: StrapiRawProject = {
      id: 1,
      documentId: 'proj-1',
      name: 'School Garden',
      slug: 'school-garden',
      projectNumber: 'CZ.01.234',
      goal: 'Build a garden',
      financialAmount: '500 000 Kč',
      description: 'A project to build a school garden',
      logos: [
        { id: 1, url: 'https://cdn.example.com/logo1.png', alternativeText: 'EU Logo', width: 200, height: 100 },
        { id: 2, url: 'https://cdn.example.com/logo2.png', alternativeText: 'CZ Logo', width: 200, height: 100 },
      ],
      publicityPoster: {
        id: 3,
        url: 'https://cdn.example.com/poster.jpg',
        alternativeText: 'Poster',
        width: 800,
        height: 1200,
      },
      status: 'aktivni',
      dateFrom: '2024-01-01',
      dateTo: '2025-12-31',
      workplaces: [
        { id: 1, documentId: 'wp-1', name: 'MŠ Pod Hůrkou', slug: 'pod-hurkou', address: null, phone: null, email: null, classCount: null, childrenCapacity: null, description: null, gardenDescription: null, virtualTourUrl: null, programType: null, specifics: null },
      ],
    };

    const result = mapProject(raw);
    expect(result.documentId).toBe('proj-1');
    expect(result.name).toBe('School Garden');
    expect(result.slug).toBe('school-garden');
    expect(result.projectNumber).toBe('CZ.01.234');
    expect(result.goal).toBe('Build a garden');
    expect(result.financialAmount).toBe('500 000 Kč');
    expect(result.description).toBe('A project to build a school garden');
    expect(result.logos).toHaveLength(2);
    expect(result.logos[0].url).toBe('https://cdn.example.com/logo1.png');
    expect(result.publicityPoster).not.toBeNull();
    expect(result.publicityPoster!.url).toBe('https://cdn.example.com/poster.jpg');
    expect(result.status).toBe('aktivni');
    expect(result.dateFrom).toBe('2024-01-01');
    expect(result.dateTo).toBe('2025-12-31');
    expect(result.workplaces).toHaveLength(1);
    expect(result.workplaces[0].name).toBe('MŠ Pod Hůrkou');
  });

  it('handles null logos and poster', () => {
    const raw: StrapiRawProject = {
      id: 2,
      documentId: 'proj-2',
      name: 'Minimal Project',
      slug: 'minimal',
      projectNumber: null,
      goal: null,
      financialAmount: null,
      description: null,
      logos: null,
      publicityPoster: null,
      status: null,
      dateFrom: null,
      dateTo: null,
      workplaces: null,
    };

    const result = mapProject(raw);
    expect(result.logos).toEqual([]);
    expect(result.publicityPoster).toBeNull();
    expect(result.projectNumber).toBeNull();
    expect(result.goal).toBeNull();
    expect(result.financialAmount).toBeNull();
    expect(result.description).toBeNull();
    expect(result.status).toBeNull();
    expect(result.dateFrom).toBeNull();
    expect(result.dateTo).toBeNull();
    expect(result.workplaces).toEqual([]);
  });

  it('maps project with ukonceny status', () => {
    const raw: StrapiRawProject = {
      id: 3,
      documentId: 'proj-3',
      name: 'Finished Project',
      slug: 'finished',
      projectNumber: null,
      goal: null,
      financialAmount: null,
      description: null,
      logos: null,
      publicityPoster: null,
      status: 'ukonceny',
      dateFrom: null,
      dateTo: null,
      workplaces: null,
    };

    const result = mapProject(raw);
    expect(result.status).toBe('ukonceny');
  });
});
