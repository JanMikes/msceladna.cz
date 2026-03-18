import { describe, it, expect } from 'vitest';
import {
  mapMedia,
  mapMediaArray,
  mapFile,
  mapFileArray,
  transformImageUrl,
  transformPublicUrl,
  toPublicUrl,
  transformContentUrls,
  slugify,
} from '@/lib/strapi/mappers/shared';
import { config } from '@/lib/config';
import type { StrapiRawMedia } from '@/lib/strapi/types';

describe('transformImageUrl', () => {
  it('prefixes /uploads/ URLs with internal uploads URL', () => {
    const result = transformImageUrl('/uploads/photo.jpg');
    expect(result).toBe(`${config.internalUploadsUrl}/uploads/photo.jpg`);
  });

  it('leaves absolute URLs untouched', () => {
    const url = 'https://cdn.example.com/uploads/photo.jpg';
    expect(transformImageUrl(url)).toBe(url);
  });

  it('leaves non-uploads paths untouched', () => {
    const url = '/images/photo.jpg';
    expect(transformImageUrl(url)).toBe(url);
  });
});

describe('transformPublicUrl', () => {
  it('prefixes /uploads/ URLs with public uploads URL', () => {
    const result = transformPublicUrl('/uploads/file.pdf');
    expect(result).toBe(`${config.publicUploadsUrl}/uploads/file.pdf`);
  });

  it('leaves absolute URLs untouched', () => {
    const url = 'https://other.com/file.pdf';
    expect(transformPublicUrl(url)).toBe(url);
  });
});

describe('toPublicUrl', () => {
  it('converts internal URL to public URL', () => {
    const internal = `${config.internalUploadsUrl}/uploads/photo.jpg`;
    const result = toPublicUrl(internal);
    expect(result).toBe(`${config.publicUploadsUrl}/uploads/photo.jpg`);
  });

  it('leaves already-public URLs unchanged when internal !== public', () => {
    const publicUrl = `${config.publicUploadsUrl}/uploads/photo.jpg`;
    const result = toPublicUrl(publicUrl);
    // This replaces internalUploadsUrl only, so a public url should pass through
    expect(result).toBe(publicUrl);
  });
});

describe('transformContentUrls', () => {
  it('replaces /uploads/ paths in src attributes', () => {
    const html = '<img src="/uploads/photo.jpg" />';
    const result = transformContentUrls(html);
    expect(result).toBe(`<img src="${config.publicUploadsUrl}/uploads/photo.jpg" />`);
  });

  it('replaces /uploads/ paths in href attributes', () => {
    const html = '<a href="/uploads/doc.pdf">Download</a>';
    const result = transformContentUrls(html);
    expect(result).toBe(`<a href="${config.publicUploadsUrl}/uploads/doc.pdf">Download</a>`);
  });

  it('replaces multiple occurrences', () => {
    const html = '<img src="/uploads/a.jpg" /><a href="/uploads/b.pdf">B</a>';
    const result = transformContentUrls(html);
    expect(result).toContain(`src="${config.publicUploadsUrl}/uploads/a.jpg"`);
    expect(result).toContain(`href="${config.publicUploadsUrl}/uploads/b.pdf"`);
  });

  it('does not replace non-upload paths', () => {
    const html = '<img src="/images/photo.jpg" />';
    expect(transformContentUrls(html)).toBe(html);
  });
});

describe('mapMedia', () => {
  it('returns null for null input', () => {
    expect(mapMedia(null)).toBeNull();
  });

  it('returns null for undefined input', () => {
    expect(mapMedia(undefined)).toBeNull();
  });

  it('returns null when url is missing', () => {
    const raw = { id: 1 } as unknown as StrapiRawMedia;
    expect(mapMedia(raw)).toBeNull();
  });

  it('maps single media with all fields', () => {
    const raw: StrapiRawMedia = {
      id: 1,
      url: 'https://cdn.example.com/photo.jpg',
      alternativeText: 'A photo',
      width: 800,
      height: 600,
    };
    expect(mapMedia(raw)).toEqual({
      url: 'https://cdn.example.com/photo.jpg',
      alternativeText: 'A photo',
      width: 800,
      height: 600,
    });
  });

  it('prefixes /uploads/ URLs with internal URL', () => {
    const raw: StrapiRawMedia = {
      id: 1,
      url: '/uploads/photo.jpg',
    };
    const result = mapMedia(raw);
    expect(result).not.toBeNull();
    expect(result!.url).toBe(`${config.internalUploadsUrl}/uploads/photo.jpg`);
  });

  it('defaults alternativeText to null and dimensions to 0', () => {
    const raw: StrapiRawMedia = {
      id: 1,
      url: 'https://cdn.example.com/photo.jpg',
    };
    const result = mapMedia(raw);
    expect(result).toEqual({
      url: 'https://cdn.example.com/photo.jpg',
      alternativeText: null,
      width: 0,
      height: 0,
    });
  });
});

describe('mapMediaArray', () => {
  it('returns empty array for null input', () => {
    expect(mapMediaArray(null)).toEqual([]);
  });

  it('returns empty array for undefined input', () => {
    expect(mapMediaArray(undefined)).toEqual([]);
  });

  it('maps array of media, filtering out nulls', () => {
    const raw: StrapiRawMedia[] = [
      { id: 1, url: 'https://cdn.example.com/a.jpg', width: 100, height: 100 },
      { id: 2 } as unknown as StrapiRawMedia, // no url, will be filtered
      { id: 3, url: 'https://cdn.example.com/b.jpg', width: 200, height: 200 },
    ];
    const result = mapMediaArray(raw);
    expect(result).toHaveLength(2);
    expect(result[0].url).toBe('https://cdn.example.com/a.jpg');
    expect(result[1].url).toBe('https://cdn.example.com/b.jpg');
  });
});

describe('mapFile', () => {
  it('maps file with public URL', () => {
    const raw: StrapiRawMedia = {
      id: 1,
      url: '/uploads/document.pdf',
      name: 'My Document',
    };
    const result = mapFile(raw);
    expect(result.url).toBe(`${config.publicUploadsUrl}/uploads/document.pdf`);
    expect(result.name).toBe('My Document');
  });

  it('extracts filename from URL when name is missing', () => {
    const raw: StrapiRawMedia = {
      id: 1,
      url: '/uploads/document.pdf',
    };
    const result = mapFile(raw);
    expect(result.name).toBe('document.pdf');
  });
});

describe('mapFileArray', () => {
  it('returns empty array for null input', () => {
    expect(mapFileArray(null)).toEqual([]);
  });

  it('maps array of files', () => {
    const raw: StrapiRawMedia[] = [
      { id: 1, url: '/uploads/a.pdf', name: 'A' },
      { id: 2, url: '/uploads/b.pdf', name: 'B' },
    ];
    const result = mapFileArray(raw);
    expect(result).toHaveLength(2);
    expect(result[0].name).toBe('A');
    expect(result[1].name).toBe('B');
  });
});

describe('slugify', () => {
  it('converts text to slug', () => {
    expect(slugify('Hello World')).toBe('hello-world');
  });

  it('removes diacritics', () => {
    expect(slugify('Příliš žluťoučký kůň')).toBe('prilis-zlutoucky-kun');
  });

  it('removes special characters', () => {
    expect(slugify('Hello! @World#')).toBe('hello-world');
  });

  it('trims leading and trailing hyphens', () => {
    expect(slugify('--hello--')).toBe('hello');
  });
});
