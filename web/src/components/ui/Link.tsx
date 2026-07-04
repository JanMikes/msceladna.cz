import NextLink from 'next/link';
import type { ComponentProps } from 'react';

type LinkProps = ComponentProps<typeof NextLink>;

/**
 * Site-wide `<Link>` that defaults `prefetch` to `false`.
 *
 * Next 16's automatic prefetch currently fails for this deployment: every RSC
 * prefetch request comes back 503 (the server rejects the prefetch router-state
 * header with "could not be parsed"). That turned each page load into a storm of
 * failing background requests which — behind the reverse proxy's retry — showed
 * up as many seconds of "loading" in the browser. Since the prefetches never
 * succeed, they provide no navigation benefit anyway, so we disable them here.
 *
 * Navigation still works (routes are fetched on click). Opt an individual link
 * back in with `prefetch={true}` once the upstream issue is resolved.
 */
export default function Link({ prefetch = false, ...props }: LinkProps) {
  return <NextLink prefetch={prefetch} {...props} />;
}
