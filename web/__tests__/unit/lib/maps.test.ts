import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { resolveMapEmbedUrl } from '@/lib/maps';

describe('resolveMapEmbedUrl', () => {
  it('returns null for empty input', async () => {
    expect(await resolveMapEmbedUrl('')).toBeNull();
    expect(await resolveMapEmbedUrl('   ')).toBeNull();
  });

  it('passes through an embed URL unchanged', async () => {
    const embed = 'https://www.google.com/maps/embed?pb=!1m18!1m12';
    expect(await resolveMapEmbedUrl(embed)).toBe(embed);
  });

  it('extracts @lat,lng,zoom from a place URL', async () => {
    const url =
      'https://www.google.com/maps/place/Celadn%C3%A1/@49.5432,18.3876,17z/data=!3m1';
    expect(await resolveMapEmbedUrl(url)).toBe(
      'https://maps.google.com/maps?q=49.5432,18.3876&z=17&output=embed',
    );
  });

  it('extracts !3d!4d coordinates when present', async () => {
    const url =
      'https://www.google.com/maps/place/X/@49.5,18.3,15z/data=!3m1!4b1!4m5!3m4!1s0x0:0x0!3d49.5432!4d18.3876';
    expect(await resolveMapEmbedUrl(url)).toBe(
      'https://maps.google.com/maps?q=49.5432,18.3876&z=15&output=embed',
    );
  });

  it('uses ?q= parameter when present', async () => {
    const url = 'https://www.google.com/maps?q=Prague';
    expect(await resolveMapEmbedUrl(url)).toBe(
      'https://maps.google.com/maps?q=Prague&output=embed',
    );
  });

  it('falls back to place name from /maps/place/', async () => {
    const url = 'https://www.google.com/maps/place/M%C5%A1+Celadn%C3%A1';
    expect(await resolveMapEmbedUrl(url)).toBe(
      'https://maps.google.com/maps?q=M%C5%A1+Celadn%C3%A1&output=embed',
    );
  });

  describe('with short URL redirect', () => {
    beforeEach(() => {
      vi.stubGlobal(
        'fetch',
        vi.fn(async () => ({
          url: 'https://www.google.com/maps/place/Test/@49.5432,18.3876,17z/data=!3m1',
        })),
      );
    });

    afterEach(() => {
      vi.unstubAllGlobals();
    });

    it('follows maps.app.goo.gl short URLs and resolves coordinates', async () => {
      const result = await resolveMapEmbedUrl('https://maps.app.goo.gl/GFmeVPUY3iv1JDgy6');
      expect(result).toBe(
        'https://maps.google.com/maps?q=49.5432,18.3876&z=17&output=embed',
      );
      expect(fetch).toHaveBeenCalledWith(
        'https://maps.app.goo.gl/GFmeVPUY3iv1JDgy6',
        { redirect: 'follow' },
      );
    });
  });

  it('returns null when fetch fails for a short URL', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => {
        throw new Error('network');
      }),
    );
    try {
      expect(await resolveMapEmbedUrl('https://maps.app.goo.gl/broken')).toBeNull();
    } finally {
      vi.unstubAllGlobals();
    }
  });

  it('returns null for unrecognizable input', async () => {
    expect(await resolveMapEmbedUrl('https://example.com')).toBeNull();
  });
});
