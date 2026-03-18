import { describe, it, expect } from 'vitest';
import { resolveLink, resolveTextLink } from '@/lib/strapi/link-resolver';
import type { StrapiRawLink, StrapiRawTextLink } from '@/lib/strapi/types';

describe('resolveLink', () => {
  it('returns null for null input', () => {
    expect(resolveLink(null)).toBeNull();
  });

  it('returns null for undefined input', () => {
    expect(resolveLink(undefined)).toBeNull();
  });

  it('resolves page link to /{slug}', () => {
    const raw: StrapiRawLink = {
      id: 1,
      page: { slug: 'about' },
      anchor: null,
      url: null,
      file: null,
    };
    expect(resolveLink(raw)).toEqual({ href: '/about', external: false });
  });

  it('resolves page link with anchor to /{slug}#{anchor}', () => {
    const raw: StrapiRawLink = {
      id: 1,
      page: { slug: 'about' },
      anchor: 'team',
      url: null,
      file: null,
    };
    expect(resolveLink(raw)).toEqual({ href: '/about#team', external: false });
  });

  it('resolves external URL', () => {
    const raw: StrapiRawLink = {
      id: 1,
      page: null,
      anchor: null,
      url: 'https://external.com/page',
      file: null,
    };
    expect(resolveLink(raw)).toEqual({ href: 'https://external.com/page', external: true });
  });

  it('resolves internal absolute URL to relative path', () => {
    const raw: StrapiRawLink = {
      id: 1,
      page: null,
      anchor: null,
      url: 'https://www.msceladna.cz/kontakt?ref=test#sec',
      file: null,
    };
    expect(resolveLink(raw)).toEqual({ href: '/kontakt?ref=test#sec', external: false });
  });

  it('resolves non-http URL as internal', () => {
    const raw: StrapiRawLink = {
      id: 1,
      page: null,
      anchor: null,
      url: '/some-path',
      file: null,
    };
    expect(resolveLink(raw)).toEqual({ href: '/some-path', external: false });
  });

  it('resolves anchor-only link to #{anchor}', () => {
    const raw: StrapiRawLink = {
      id: 1,
      page: null,
      anchor: 'section-1',
      url: null,
      file: null,
    };
    expect(resolveLink(raw)).toEqual({ href: '#section-1', external: false });
  });

  it('resolves file link to upload URL', () => {
    const raw: StrapiRawLink = {
      id: 1,
      page: null,
      anchor: null,
      url: null,
      file: {
        id: 10,
        url: '/uploads/document.pdf',
        name: 'document.pdf',
      },
    };
    const result = resolveLink(raw);
    expect(result).not.toBeNull();
    expect(result!.href).toContain('/uploads/document.pdf');
    expect(result!.external).toBe(false);
  });

  it('returns null when all fields are empty/null', () => {
    const raw: StrapiRawLink = {
      id: 1,
      page: null,
      anchor: null,
      url: null,
      file: null,
    };
    expect(resolveLink(raw)).toBeNull();
  });

  it('prioritizes page slug over url', () => {
    const raw: StrapiRawLink = {
      id: 1,
      page: { slug: 'priority-page' },
      anchor: null,
      url: 'https://external.com',
      file: null,
    };
    expect(resolveLink(raw)).toEqual({ href: '/priority-page', external: false });
  });

  it('prioritizes url over file', () => {
    const raw: StrapiRawLink = {
      id: 1,
      page: null,
      anchor: null,
      url: 'https://external.com',
      file: { id: 10, url: '/uploads/file.pdf' },
    };
    expect(resolveLink(raw)).toEqual({ href: 'https://external.com', external: true });
  });

  it('prioritizes file over anchor', () => {
    const raw: StrapiRawLink = {
      id: 1,
      page: null,
      anchor: 'section-1',
      url: null,
      file: { id: 10, url: '/uploads/file.pdf' },
    };
    const result = resolveLink(raw);
    expect(result).not.toBeNull();
    expect(result!.href).toContain('/uploads/file.pdf');
  });
});

describe('resolveTextLink', () => {
  it('returns null for null input', () => {
    expect(resolveTextLink(null)).toBeNull();
  });

  it('returns null for undefined input', () => {
    expect(resolveTextLink(undefined)).toBeNull();
  });

  it('resolves text link with text label', () => {
    const raw: StrapiRawTextLink = {
      id: 1,
      page: { slug: 'about' },
      anchor: null,
      url: null,
      file: null,
      text: 'About Us',
      disabled: false,
    };
    expect(resolveTextLink(raw)).toEqual({
      href: '/about',
      external: false,
      text: 'About Us',
      disabled: false,
    });
  });

  it('handles disabled links', () => {
    const raw: StrapiRawTextLink = {
      id: 1,
      page: { slug: 'disabled-page' },
      anchor: null,
      url: null,
      file: null,
      text: 'Disabled Link',
      disabled: true,
    };
    const result = resolveTextLink(raw);
    expect(result).not.toBeNull();
    expect(result!.disabled).toBe(true);
  });

  it('defaults disabled to false when not provided', () => {
    const raw = {
      id: 1,
      page: { slug: 'page' },
      anchor: null,
      url: null,
      file: null,
      text: 'Text',
    } as StrapiRawTextLink;
    const result = resolveTextLink(raw);
    expect(result).not.toBeNull();
    expect(result!.disabled).toBe(false);
  });

  it('defaults text to empty string when null', () => {
    const raw: StrapiRawTextLink = {
      id: 1,
      page: { slug: 'page' },
      anchor: null,
      url: null,
      file: null,
      text: null,
      disabled: false,
    };
    const result = resolveTextLink(raw);
    expect(result).not.toBeNull();
    expect(result!.text).toBe('');
  });

  it('returns null when link cannot be resolved', () => {
    const raw: StrapiRawTextLink = {
      id: 1,
      page: null,
      anchor: null,
      url: null,
      file: null,
      text: 'No Link',
      disabled: false,
    };
    expect(resolveTextLink(raw)).toBeNull();
  });
});
