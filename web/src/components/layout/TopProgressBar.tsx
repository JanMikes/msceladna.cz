'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';

// Global top-of-page navigation bar. It starts the instant an internal link is
// clicked (before any server round-trip) and finishes once the destination
// route has committed — so the user always gets immediate feedback, even when
// the destination renders very fast from cache. A minimum display time keeps
// the bar perceptible on quick navigations. Styled via `.route-progress` in
// globals.css.

const MIN_VISIBLE_MS = 500;
const SAFETY_TIMEOUT_MS = 10_000;

export default function TopProgressBar() {
  const pathname = usePathname();
  const [active, setActive] = useState(false);
  const startedAt = useRef<number | null>(null);

  // Start the bar on a same-origin internal link click.
  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) {
        return;
      }
      const anchor = (e.target as HTMLElement | null)?.closest('a');
      if (!anchor) return;

      const href = anchor.getAttribute('href');
      if (!href || anchor.getAttribute('target') === '_blank' || anchor.hasAttribute('download')) {
        return;
      }

      let url: URL;
      try {
        url = new URL(href, window.location.href);
      } catch {
        return;
      }
      // Ignore external links and links to the current page / pure hash jumps.
      if (url.origin !== window.location.origin) return;
      if (url.pathname === window.location.pathname && url.search === window.location.search) return;

      startedAt.current = Date.now();
      setActive(true);
    }

    document.addEventListener('click', onClick, true);
    return () => document.removeEventListener('click', onClick, true);
  }, []);

  // Finish when the route commits (pathname changes), honoring the minimum
  // visible time so fast navigations still flash a perceptible bar.
  useEffect(() => {
    if (startedAt.current === null) return;
    const elapsed = Date.now() - startedAt.current;
    const remaining = Math.max(0, MIN_VISIBLE_MS - elapsed);
    const timer = setTimeout(() => {
      setActive(false);
      startedAt.current = null;
    }, remaining);
    return () => clearTimeout(timer);
  }, [pathname]);

  // Safety net: never let the bar get stuck if a navigation is cancelled.
  useEffect(() => {
    if (!active) return;
    const timer = setTimeout(() => {
      setActive(false);
      startedAt.current = null;
    }, SAFETY_TIMEOUT_MS);
    return () => clearTimeout(timer);
  }, [active]);

  return active ? <div className="route-progress" aria-hidden="true" /> : null;
}
