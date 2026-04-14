/**
 * Converts any supported Google Maps URL into an iframe-embeddable URL.
 *
 * Supported inputs:
 * - Short share URL:  https://maps.app.goo.gl/XXXX  or  https://goo.gl/maps/XXXX
 * - Place URL:        https://www.google.com/maps/place/NAME/@LAT,LNG,ZOOMz/data=...
 * - Coordinate URL:   https://www.google.com/maps/@LAT,LNG,ZOOMz
 * - Search URL:       https://www.google.com/maps/search/QUERY/...
 * - Query URL:        https://www.google.com/maps?q=QUERY
 * - Embed URL:        https://www.google.com/maps/embed?pb=...  (returned as-is)
 *
 * Returns null if the URL cannot be understood.
 */
export async function resolveMapEmbedUrl(input: string): Promise<string | null> {
  const trimmed = input.trim();
  if (!trimmed) return null;

  let url = trimmed;

  if (/^https?:\/\/(maps\.app\.goo\.gl|goo\.gl\/maps)/.test(url)) {
    try {
      const res = await fetch(url, { redirect: 'follow' });
      url = res.url || url;
    } catch {
      return null;
    }
  }

  if (/\/maps\/embed\b/.test(url)) {
    return url;
  }

  const coordMatch =
    url.match(/!3d(-?\d+(?:\.\d+)?)!4d(-?\d+(?:\.\d+)?)/) ||
    url.match(/[/@](-?\d+\.\d+),(-?\d+\.\d+)/);
  if (coordMatch) {
    const zoomMatch = url.match(/,(\d+(?:\.\d+)?)z/);
    const zoom = zoomMatch ? Math.round(parseFloat(zoomMatch[1])) : 15;
    return `https://maps.google.com/maps?q=${coordMatch[1]},${coordMatch[2]}&z=${zoom}&output=embed`;
  }

  const qMatch = url.match(/[?&]q=([^&]+)/);
  if (qMatch) {
    return `https://maps.google.com/maps?q=${qMatch[1]}&output=embed`;
  }

  const placeMatch = url.match(/\/maps\/(?:place|search)\/([^/?]+)/);
  if (placeMatch) {
    return `https://maps.google.com/maps?q=${placeMatch[1]}&output=embed`;
  }

  return null;
}
