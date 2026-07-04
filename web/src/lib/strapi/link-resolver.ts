import type { ResolvedLink, ResolvedTextLink } from '@/lib/types';
import type { StrapiRawLink, StrapiRawLinkPage, StrapiRawTextLink } from './types';
import { transformPublicUrl } from './mappers/shared';
import { config } from '@/lib/config';

/**
 * Builds a page's canonical URL path from its slug and ancestor chain, e.g.
 * `{ slug: 'historie', parent: { slug: 'o-skolce' } }` → `/o-skolce/historie`.
 *
 * This MUST mirror the breadcrumb chain produced by `buildBreadcrumbs`
 * (mappers/page.ts), because the catch-all route (`app/[...slug]/page.tsx`)
 * 404s any URL whose segments don't exactly equal the page's full ancestor
 * chain. Resolving a nested-page link to the leaf slug alone is what made those
 * links 404. A `seen` guard makes a malformed parent cycle terminate rather
 * than loop (slugs are unique, so a repeat means a bad chain).
 */
function pageHref(page: StrapiRawLinkPage): string {
  const slugs: string[] = [];
  const seen = new Set<string>();
  let node: StrapiRawLinkPage | null | undefined = page;
  while (node?.slug && !seen.has(node.slug)) {
    seen.add(node.slug);
    slugs.unshift(node.slug);
    node = node.parent;
  }
  return `/${slugs.join('/')}`;
}

function resolveUrl(url: string): { href: string; external: boolean } {
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    return { href: url, external: false };
  }

  if (config.siteUrl) {
    try {
      const siteOrigin = new URL(config.siteUrl).origin;
      const parsed = new URL(url);
      if (parsed.origin === siteOrigin) {
        return { href: parsed.pathname + parsed.search + parsed.hash, external: false };
      }
    } catch {
      // invalid URL, treat as external
    }
  }

  return { href: url, external: true };
}

export function resolveLink(raw: StrapiRawLink | null | undefined): ResolvedLink | null {
  if (!raw) return null;

  // Priority: page slug > url > file > anchor
  if (raw.page?.slug) {
    const anchor = raw.anchor ? `#${raw.anchor}` : '';
    return { href: `${pageHref(raw.page)}${anchor}`, external: false };
  }

  if (raw.url) {
    return resolveUrl(raw.url);
  }

  if (raw.file?.url) {
    // A link to an uploaded file becomes a browser <a href>, so it must use the
    // PUBLIC uploads URL — not the internal host used for <Image> optimization.
    return { href: transformPublicUrl(raw.file.url), external: false };
  }

  if (raw.anchor) {
    return { href: `#${raw.anchor}`, external: false };
  }

  return null;
}

export function resolveTextLink(raw: StrapiRawTextLink | null | undefined): ResolvedTextLink | null {
  if (!raw) return null;

  const resolved = resolveLink(raw);
  if (!resolved) return null;

  return {
    ...resolved,
    text: raw.text || '',
    disabled: raw.disabled ?? false,
  };
}
