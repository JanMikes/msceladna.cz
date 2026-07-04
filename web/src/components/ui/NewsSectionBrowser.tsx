'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { clsx } from 'clsx';
import { NewsCard } from '@/components/ui/NewsCard';
import type { NewsArticleSummary, Tag, Workplace } from '@/lib/types';

interface NewsSectionBrowserProps {
  /** The full set of articles for this section (already type-filtered server-side). */
  articles: NewsArticleSummary[];
  /** All workplaces, rendered as the workplace filter row. */
  workplaces: Workplace[];
  /** Base path for card links and URL sync, e.g. `/aktuality` or `/reportaze`. */
  basePath: string;
  /** Message shown when no article matches the current filters. */
  emptyText: string;
  /** Initial filter/paging state, read from the URL server-side (shareable links). */
  initialWorkplace?: string | null;
  initialTag?: string | null;
  initialPage?: number;
  pageSize?: number;
}

/**
 * Client-side browser for a news section (Aktuality / Reportáže).
 *
 * Filtering by workplace and tag happens entirely in the browser over an
 * already-loaded article set — no server round-trip per click, so it is
 * instant. The URL is kept in sync via `history.replaceState` (no navigation)
 * so filtered views stay shareable/bookmarkable, and the server seeds the
 * initial state from the query string so a shared link renders correctly on
 * first paint with no hydration flash.
 */
export function NewsSectionBrowser({
  articles,
  workplaces,
  basePath,
  emptyText,
  initialWorkplace = null,
  initialTag = null,
  initialPage = 1,
  pageSize = 12,
}: NewsSectionBrowserProps) {
  const [workplace, setWorkplace] = useState<string | null>(initialWorkplace);
  const [tag, setTag] = useState<string | null>(initialTag);
  const [page, setPage] = useState<number>(initialPage > 0 ? initialPage : 1);
  const topRef = useRef<HTMLDivElement>(null);
  const didMount = useRef(false);

  // Tags actually present on these articles — avoids dead filters and keeps the
  // list scoped to this section (tags are shared with the other news type).
  const tags = useMemo<Tag[]>(() => {
    const bySlug = new Map<string, Tag>();
    for (const article of articles) {
      for (const t of article.tags) {
        if (!bySlug.has(t.slug)) bySlug.set(t.slug, t);
      }
    }
    return Array.from(bySlug.values()).sort((a, b) => a.name.localeCompare(b.name, 'cs'));
  }, [articles]);

  const filtered = useMemo(
    () =>
      articles.filter(
        (a) =>
          (!workplace || a.workplaces.some((w) => w.slug === workplace)) &&
          (!tag || a.tags.some((t) => t.slug === tag)),
      ),
    [articles, workplace, tag],
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const pageArticles = filtered.slice((safePage - 1) * pageSize, safePage * pageSize);

  // Keep the URL in sync with the active filters/page (shallow — no navigation).
  useEffect(() => {
    const params = new URLSearchParams();
    if (workplace) params.set('pracoviste', workplace);
    if (tag) params.set('stitek', tag);
    if (safePage > 1) params.set('strana', String(safePage));
    const qs = params.toString();
    window.history.replaceState(null, '', qs ? `${basePath}?${qs}` : basePath);
  }, [workplace, tag, safePage, basePath]);

  // On filter/page change (but not initial mount), scroll the list into view.
  useEffect(() => {
    if (!didMount.current) {
      didMount.current = true;
      return;
    }
    topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [safePage]);

  const selectWorkplace = (slug: string | null) => {
    setWorkplace(slug);
    setPage(1);
  };
  const selectTag = (slug: string | null) => {
    setTag(slug);
    setPage(1);
  };

  return (
    <div ref={topRef} className="scroll-mt-24">
      {/* Workplace filter */}
      {workplaces.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          <FilterPill active={!workplace} onClick={() => selectWorkplace(null)}>
            Vše
          </FilterPill>
          {workplaces.map((w) => (
            <FilterPill
              key={w.slug}
              active={workplace === w.slug}
              onClick={() => selectWorkplace(w.slug)}
            >
              {w.name}
            </FilterPill>
          ))}
        </div>
      )}

      {/* Tag filter */}
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-8">
          <FilterPill active={!tag} onClick={() => selectTag(null)} variant="tag">
            Všechny štítky
          </FilterPill>
          {tags.map((t) => (
            <FilterPill
              key={t.slug}
              active={tag === t.slug}
              onClick={() => selectTag(t.slug)}
              variant="tag"
            >
              {t.name}
            </FilterPill>
          ))}
        </div>
      )}

      {pageArticles.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {pageArticles.map((article) => (
            <NewsCard key={article.documentId} article={article} basePath={basePath} />
          ))}
        </div>
      ) : (
        <p className="text-text-muted text-center py-12">{emptyText}</p>
      )}

      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-8">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setPage(p)}
              aria-current={p === safePage ? 'page' : undefined}
              className={clsx(
                'w-10 h-10 rounded-[var(--radius-button)] flex items-center justify-center text-sm font-medium transition-colors',
                p === safePage
                  ? 'bg-primary text-white'
                  : 'bg-card text-primary hover:bg-primary/10',
              )}
            >
              {p}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function FilterPill({
  active,
  onClick,
  children,
  variant = 'workplace',
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  variant?: 'workplace' | 'tag';
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={clsx(
        'pill transition-colors',
        active
          ? variant === 'tag'
            ? 'bg-accent text-white'
            : 'bg-primary text-white'
          : 'hover:bg-primary/10',
      )}
    >
      {children}
    </button>
  );
}
