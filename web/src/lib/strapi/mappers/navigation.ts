import type { NavigationChild, NavigationItem } from '@/lib/types';
import type { StrapiRawNavigation, StrapiRawNavigationChild } from '../types';
import { resolveLink } from '../link-resolver';

function mapNavigationChild(raw: StrapiRawNavigationChild): NavigationChild | null {
  const resolved = resolveLink(raw.link);
  if (!resolved) return null;

  return {
    title: raw.title,
    href: resolved.href,
    external: resolved.external,
  };
}

export function mapNavigation(raw: StrapiRawNavigation): NavigationItem | null {
  const resolved = resolveLink(raw.link);
  if (!resolved) return null;

  const children = (raw.children ?? [])
    .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
    .map(mapNavigationChild)
    .filter((c): c is NavigationChild => c !== null);

  return {
    title: raw.title,
    href: resolved.href,
    external: resolved.external,
    children,
  };
}
