import { describe, it, expect } from 'vitest';
import { buildStrapiQueryString } from '@/lib/strapi/queries';

// URLSearchParams encodes brackets as %5B/%5D, so we decode for readability in assertions
function decode(s: string): string {
  return decodeURIComponent(s);
}

describe('buildStrapiQueryString', () => {
  it('builds empty query string for empty options', () => {
    expect(buildStrapiQueryString({})).toBe('');
  });

  it('builds with string populate', () => {
    const result = buildStrapiQueryString({ populate: '*' });
    expect(result).toBe('?populate=*');
  });

  it('builds with array populate', () => {
    const result = decode(buildStrapiQueryString({ populate: ['content', 'sidebar'] }));
    expect(result).toContain('populate[0]=content');
    expect(result).toContain('populate[1]=sidebar');
  });

  it('builds with object populate', () => {
    const result = decode(buildStrapiQueryString({
      populate: { content: { populate: '*' } },
    }));
    expect(result).toContain('populate[content][populate]=*');
  });

  it('builds with filters', () => {
    const result = decode(buildStrapiQueryString({
      filters: { slug: { $eq: 'about' } },
    }));
    expect(result).toContain('filters[slug][$eq]=about');
  });

  it('builds with nested filters', () => {
    const result = decode(buildStrapiQueryString({
      filters: { category: { name: { $eq: 'news' } } },
    }));
    expect(result).toContain('filters[category][name][$eq]=news');
  });

  it('builds with string sort', () => {
    const result = decode(buildStrapiQueryString({ sort: 'date:desc' }));
    expect(result).toContain('sort=date:desc');
  });

  it('builds with array sort', () => {
    const result = decode(buildStrapiQueryString({ sort: ['date:desc', 'title:asc'] }));
    expect(result).toContain('sort[0]=date:desc');
    expect(result).toContain('sort[1]=title:asc');
  });

  it('builds with pagination page and pageSize', () => {
    const result = decode(buildStrapiQueryString({
      pagination: { page: 2, pageSize: 10 },
    }));
    expect(result).toContain('pagination[page]=2');
    expect(result).toContain('pagination[pageSize]=10');
  });

  it('builds with pagination limit', () => {
    const result = decode(buildStrapiQueryString({
      pagination: { limit: 25 },
    }));
    expect(result).toContain('pagination[limit]=25');
  });

  it('builds with fields', () => {
    const result = decode(buildStrapiQueryString({
      fields: ['title', 'slug', 'date'],
    }));
    expect(result).toContain('fields[0]=title');
    expect(result).toContain('fields[1]=slug');
    expect(result).toContain('fields[2]=date');
  });

  it('builds with combined options', () => {
    const result = decode(buildStrapiQueryString({
      populate: '*',
      filters: { slug: { $eq: 'home' } },
      sort: 'title:asc',
      pagination: { page: 1, pageSize: 25 },
      fields: ['title'],
    }));
    expect(result).toContain('populate=*');
    expect(result).toContain('filters[slug][$eq]=home');
    expect(result).toContain('sort=title:asc');
    expect(result).toContain('pagination[page]=1');
    expect(result).toContain('pagination[pageSize]=25');
    expect(result).toContain('fields[0]=title');
  });

  it('handles array values in filters', () => {
    const result = decode(buildStrapiQueryString({
      filters: { type: { $in: ['news', 'event'] } },
    }));
    expect(result).toContain('filters[type][$in][0]=news');
    expect(result).toContain('filters[type][$in][1]=event');
  });
});
