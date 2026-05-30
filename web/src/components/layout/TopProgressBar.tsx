'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';

// Global top-of-page navigation bar. It starts the instant an internal link is
// clicked (before any server round-trip), trickles toward ~90% while the next
// route is being fetched/rendered, completes to 100% once the route commits,
// then fades out. One smooth left-to-right motion — no looping or blinking.
// Styled via `.route-progress` in globals.css; width/opacity are driven here.

const TRICKLE_INTERVAL_MS = 350;
const SAFETY_TIMEOUT_MS = 12_000;

export default function TopProgressBar() {
  const pathname = usePathname();
  const [progress, setProgress] = useState(0); // 0..100 (%)
  const [visible, setVisible] = useState(false);
  const trickle = useRef<ReturnType<typeof setInterval> | null>(null);
  const navigating = useRef(false);

  const stopTrickle = () => {
    if (trickle.current) {
      clearInterval(trickle.current);
      trickle.current = null;
    }
  };

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

      navigating.current = true;
      setVisible(true);
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
    }

    document.addEventListener('click', onClick, true);
    return () => document.removeEventListener('click', onClick, true);
  }, []);

  // Complete when the route commits (pathname changes): fill to 100%, fade out,
  // then reset width to 0 while invisible so it's ready for the next click.
  useEffect(() => {
    if (!navigating.current) return;
    navigating.current = false;
    stopTrickle();
    // Defer the state writes out of the effect body (rAF/timeouts) so the bar
    // first paints at its trickled width, then animates to 100% and fades.
    const fill = requestAnimationFrame(() => setProgress(100));
    const hide = setTimeout(() => setVisible(false), 250);
    const reset = setTimeout(() => setProgress(0), 600);
    return () => {
      cancelAnimationFrame(fill);
      clearTimeout(hide);
      clearTimeout(reset);
    };
  }, [pathname]);

  // Safety net: never let the bar get stuck if a navigation is cancelled.
  useEffect(() => {
    if (!visible) return;
    const timer = setTimeout(() => {
      navigating.current = false;
      stopTrickle();
      setVisible(false);
      setProgress(0);
    }, SAFETY_TIMEOUT_MS);
    return () => clearTimeout(timer);
  }, [visible]);

  // Clean up the trickle interval on unmount.
  useEffect(() => stopTrickle, []);

  return (
    <div
      className="route-progress"
      style={{ width: `${progress}%`, opacity: visible ? 1 : 0 }}
      aria-hidden="true"
    />
  );
}
