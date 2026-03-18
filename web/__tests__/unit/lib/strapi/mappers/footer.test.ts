import { describe, it, expect } from 'vitest';
import { mapFooter } from '@/lib/strapi/mappers/footer';
import type { StrapiRawFooter } from '@/lib/strapi/types';

describe('mapFooter', () => {
  it('maps footer with all sections', () => {
    const raw: StrapiRawFooter = {
      id: 1,
      documentId: 'footer-1',
      text: 'Footer text',
      address: 'Street 123',
      mail: 'info@test.cz',
      phone: '+420123456',
      linkSections: [
        {
          id: 1,
          title: 'Links',
          links: [
            { id: 1, page: { slug: 'about' }, anchor: null, url: null, file: null, text: 'About', disabled: false },
          ],
          sortOrder: 1,
        },
      ],
      bottomLinks: [
        { id: 2, page: { slug: 'privacy' }, anchor: null, url: null, file: null, text: 'Privacy', disabled: false },
      ],
    };

    const result = mapFooter(raw);
    expect(result.text).toBe('Footer text');
    expect(result.address).toBe('Street 123');
    expect(result.mail).toBe('info@test.cz');
    expect(result.phone).toBe('+420123456');
    expect(result.linkSections).toHaveLength(1);
    expect(result.linkSections[0].title).toBe('Links');
    expect(result.linkSections[0].links).toHaveLength(1);
    expect(result.linkSections[0].links[0].text).toBe('About');
    expect(result.linkSections[0].links[0].href).toBe('/about');
    expect(result.bottomLinks).toHaveLength(1);
    expect(result.bottomLinks[0].text).toBe('Privacy');
  });

  it('handles empty sections', () => {
    const raw: StrapiRawFooter = {
      id: 1,
      documentId: 'footer-1',
      text: null,
      address: null,
      mail: null,
      phone: null,
      linkSections: null,
      bottomLinks: null,
    };

    const result = mapFooter(raw);
    expect(result.text).toBeNull();
    expect(result.address).toBeNull();
    expect(result.mail).toBeNull();
    expect(result.phone).toBeNull();
    expect(result.linkSections).toEqual([]);
    expect(result.bottomLinks).toEqual([]);
  });

  it('sorts link sections by sortOrder', () => {
    const raw: StrapiRawFooter = {
      id: 1,
      documentId: 'footer-1',
      text: null,
      address: null,
      mail: null,
      phone: null,
      linkSections: [
        { id: 1, title: 'Third', links: [], sortOrder: 3 },
        { id: 2, title: 'First', links: [], sortOrder: 1 },
        { id: 3, title: 'Second', links: [], sortOrder: 2 },
      ],
      bottomLinks: null,
    };

    const result = mapFooter(raw);
    expect(result.linkSections).toHaveLength(3);
    expect(result.linkSections[0].title).toBe('First');
    expect(result.linkSections[1].title).toBe('Second');
    expect(result.linkSections[2].title).toBe('Third');
  });

  it('filters out unresolvable links in sections', () => {
    const raw: StrapiRawFooter = {
      id: 1,
      documentId: 'footer-1',
      text: null,
      address: null,
      mail: null,
      phone: null,
      linkSections: [
        {
          id: 1,
          title: 'Links',
          links: [
            { id: 1, page: { slug: 'valid' }, anchor: null, url: null, file: null, text: 'Valid', disabled: false },
            { id: 2, page: null, anchor: null, url: null, file: null, text: 'Invalid', disabled: false },
          ],
          sortOrder: 1,
        },
      ],
      bottomLinks: null,
    };

    const result = mapFooter(raw);
    expect(result.linkSections[0].links).toHaveLength(1);
    expect(result.linkSections[0].links[0].text).toBe('Valid');
  });
});
