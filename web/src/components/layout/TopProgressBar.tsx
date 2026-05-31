'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { CmsPageSkeleton, ListPageSkeleton, DetailPageSkeleton } from './Skeletons';

// Client-side navigation feedback. There are intentionally NO route `loading.tsx`
// files: those would blank the current page on every click (cache hit or not).
// Instead, on an internal link click we keep the current page visible and:
//   1. ALWAYS show the top progress bar — instant "it's working" feedback.
//   2. Show a content skeleton ONLY if the navigation is still in flight after
//      SKELETON_DELAY_MS. A cache hit commits well within that window, so no
//      skeleton appears; a cache miss (waiting on Strapi) crosses it and fades
//      the skeleton in. So: bar always, skeleton only when actually slow.
// "Commit" is detected via the pathname changing — in the App Router that
// happens once the destination's data/RSC payload is ready, so the elapsed time
// reflects the real load (including Strapi on a miss).

const TRICKLE_INTERVAL_MS = 350;
const SKELETON_DELAY_MS = 400;
const SAFETY_TIMEOUT_MS = 12_000;

type SkeletonKind = 'cms' | 'list' | 'detail';

// Pick the skeleton that best matches the destination route so the slow-load
// placeholder resembles the page that's coming.
function skeletonForPath(pathname: string): SkeletonKind {
  const segments = pathname.replace(/^\/+|\/+$/g, '').split('/').filter(Boolean);
  const [first, second] = segments;
  if (first === 'aktuality' || first === 'projekty' || first === 'reportaze') {
    return second ? 'detail' : 'list';
  }
  return 'cms';
}

export default function TopProgressBar() {
  const pathname = usePathname();
  const [progress, setProgress] = useState(0); // 0..100 (%)
  const [barVisible, setBarVisible] = useState(false);
  const [skeletonVisible, setSkeletonVisible] = useState(false);
  const [skeletonKind, setSkeletonKind] = useState<SkeletonKind>('cms');

  const trickle = useRef<ReturnType<typeof setInterval> | null>(null);
  const skeletonTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const navigating = useRef(false);

  const stopTrickle = () => {
    if (trickle.current) {
      clearInterval(trickle.current);
      trickle.current = null;
    }
  };

  const clearSkeletonTimer = () => {
    if (skeletonTimer.current) {
      clearTimeout(skeletonTimer.current);
      skeletonTimer.current = null;
    }
  };

  // Start feedback on a same-origin internal link click.
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

      navigating.current = true;

      // Progress bar: always, immediately.
      setBarVisible(true);
      setProgress(12);
      stopTrickle();
      trickle.current = setInterval(() => {
        setProgress((p) => {
          if (p >= 90) return p;
          // Diminishing increments: fast at first, crawling near the end.
          const inc = p < 40 ? 7 : p < 70 ? 3 : 1.5;
          return Math.min(90, p + inc);
        });
      }, TRICKLE_INTERVAL_MS);

      // Skeleton: only if this navigation is still pending after the delay
      // (i.e. it's a cache miss / genuinely slow, not a fast cached hit).
      setSkeletonKind(skeletonForPath(url.pathname));
      clearSkeletonTimer();
      skeletonTimer.current = setTimeout(() => setSkeletonVisible(true), SKELETON_DELAY_MS);
    }

    document.addEventListener('click', onClick, true);
    return () => document.removeEventListener('click', onClick, true);
  }, []);

  // Complete when the route commits (pathname changes): fill the bar, fade it
  // out, and drop the skeleton if it had appeared.
  useEffect(() => {
    if (!navigating.current) return;
    navigating.current = false;
    stopTrickle();
    clearSkeletonTimer();
    // Defer the state writes (rAF/timeouts) out of the effect body: drop the
    // skeleton and let the bar paint at its trickled width first, then animate
    // to 100% and fade.
    const fill = requestAnimationFrame(() => {
      setSkeletonVisible(false);
      setProgress(100);
    });
    const hide = setTimeout(() => setBarVisible(false), 250);
    const reset = setTimeout(() => setProgress(0), 600);
    return () => {
      cancelAnimationFrame(fill);
      clearTimeout(hide);
      clearTimeout(reset);
    };
  }, [pathname]);

  // Safety net: never let feedback get stuck if a navigation is cancelled.
  useEffect(() => {
    if (!barVisible) return;
    const timer = setTimeout(() => {
      navigating.current = false;
      stopTrickle();
      clearSkeletonTimer();
      setBarVisible(false);
      setSkeletonVisible(false);
      setProgress(0);
    }, SAFETY_TIMEOUT_MS);
    return () => clearTimeout(timer);
  }, [barVisible]);

  // Clean up timers on unmount.
  useEffect(() => () => { stopTrickle(); clearSkeletonTimer(); }, []);

  return (
    <>
      <div
        className="route-progress"
        style={{ width: `${progress}%`, opacity: barVisible ? 1 : 0 }}
        aria-hidden="true"
      />
      {skeletonVisible && (
        <div className="route-skeleton-overlay" role="status" aria-label="Načítání obsahu">
          {skeletonKind === 'list' ? (
            <ListPageSkeleton />
          ) : skeletonKind === 'detail' ? (
            <DetailPageSkeleton />
          ) : (
            <CmsPageSkeleton />
          )}
        </div>
      )}
    </>
  );
}
