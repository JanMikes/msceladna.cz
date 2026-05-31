import { describe, it, expect } from 'vitest';
import { pageSlugForPath } from '@/lib/strapi/data';

describe('pageSlugForPath', () => {
  it('maps the home path to the uvod page', () => {
    expect(pageSlugForPath('/')).toBe('uvod');
    expect(pageSlugForPath('')).toBe('uvod');
  });

  it('uses the last segment for CMS pages', () => {
    expect(pageSlugForPath('/kontakty-1')).toBe('kontakty-1');
    expect(pageSlugForPath('/o-nas/nas-tym')).toBe('nas-tym');
  });

  it('uses the section slug for section list and detail routes', () => {
    expect(pageSlugForPath('/aktuality')).toBe('aktuality');
    expect(pageSlugForPath('/aktuality/nejaky-clanek')).toBe('aktuality');
    expect(pageSlugForPath('/projekty/nejaky-projekt')).toBe('projekty');
    expect(pageSlugForPath('/reportaze/nejaka-reportaz')).toBe('reportaze');
  });

  it('ignores query strings and hashes', () => {
    expect(pageSlugForPath('/kontakty-1?foo=bar')).toBe('kontakty-1');
    expect(pageSlugForPath('/kontakty-1#section')).toBe('kontakty-1');
  });

  it('tolerates a trailing slash', () => {
    expect(pageSlugForPath('/kontakty-1/')).toBe('kontakty-1');
  });
});
