import { describe, it, expect } from 'vitest';
import { mapNavigation } from '@/lib/strapi/mappers/navigation';
import type { StrapiRawNavigation } from '@/lib/strapi/types';

describe('mapNavigation', () => {
  it('maps basic nav item', () => {
    const raw: StrapiRawNavigation = {
      id: 1,
      documentId: 'nav-1',
      title: 'About',
      link: { id: 1, page: { slug: 'about' }, anchor: null, url: null, file: null },
      children: null,
      sortOrder: 0,
    };

    const result = mapNavigation(raw);
    expect(result).not.toBeNull();
    expect(result!.title).toBe('About');
    expect(result!.href).toBe('/about');
    expect(result!.external).toBe(false);
    expect(result!.children).toEqual([]);
  });

  it('maps nav item with children', () => {
    const raw: StrapiRawNavigation = {
      id: 1,
      documentId: 'nav-1',
      title: 'Info',
      link: { id: 1, page: { slug: 'info' }, anchor: null, url: null, file: null },
      children: [
        {
          id: 2,
          title: 'Contact',
          link: { id: 2, page: { slug: 'contact' }, anchor: null, url: null, file: null },
          sortOrder: 2,
        },
        {
          id: 3,
          title: 'About',
          link: { id: 3, page: { slug: 'about' }, anchor: null, url: null, file: null },
          sortOrder: 1,
        },
      ],
      sortOrder: 0,
    };

    const result = mapNavigation(raw);
    expect(result).not.toBeNull();
    expect(result!.children).toHaveLength(2);
    // Should be sorted by sortOrder
    expect(result!.children[0].title).toBe('About');
    expect(result!.children[1].title).toBe('Contact');
  });

  it('returns null for invalid link (no resolvable link)', () => {
    const raw: StrapiRawNavigation = {
      id: 1,
      documentId: 'nav-1',
      title: 'Broken',
      link: null,
      children: null,
      sortOrder: 0,
    };

    expect(mapNavigation(raw)).toBeNull();
  });

  it('filters out children with invalid links', () => {
    const raw: StrapiRawNavigation = {
      id: 1,
      documentId: 'nav-1',
      title: 'Parent',
      link: { id: 1, page: { slug: 'parent' }, anchor: null, url: null, file: null },
      children: [
        {
          id: 2,
          title: 'Valid',
          link: { id: 2, page: { slug: 'valid' }, anchor: null, url: null, file: null },
          sortOrder: 1,
        },
        {
          id: 3,
          title: 'Invalid',
          link: null,
          sortOrder: 2,
        },
      ],
      sortOrder: 0,
    };

    const result = mapNavigation(raw);
    expect(result).not.toBeNull();
    expect(result!.children).toHaveLength(1);
    expect(result!.children[0].title).toBe('Valid');
  });

  it('maps external link', () => {
    const raw: StrapiRawNavigation = {
      id: 1,
      documentId: 'nav-1',
      title: 'External',
      link: { id: 1, page: null, anchor: null, url: 'https://external.com', file: null },
      children: null,
      sortOrder: 0,
    };

    const result = mapNavigation(raw);
    expect(result).not.toBeNull();
    expect(result!.href).toBe('https://external.com');
    expect(result!.external).toBe(true);
  });
});
