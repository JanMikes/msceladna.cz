'use client';

import { useMemo, useState } from 'react';
import { clsx } from 'clsx';
import { NewsCard } from '@/components/ui/NewsCard';
import type { NewsArticleSummary, Tag } from '@/lib/types';

interface NewsArticlesListProps {
  articles: NewsArticleSummary[];
  sidebar?: boolean;
  showFilter: boolean;
}

export function NewsArticlesList({ articles, sidebar, showFilter }: NewsArticlesListProps) {
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const tags = useMemo<Tag[]>(() => {
    if (!showFilter) return [];
    const bySlug = new Map<string, Tag>();
    for (const article of articles) {
      for (const tag of article.tags) {
        if (!bySlug.has(tag.slug)) bySlug.set(tag.slug, tag);
      }
    }
    return Array.from(bySlug.values()).sort((a, b) => a.name.localeCompare(b.name, 'cs'));
  }, [articles, showFilter]);

  const visibleArticles = selectedTag
    ? articles.filter((a) => a.tags.some((t) => t.slug === selectedTag))
    : articles;

  return (
    <>
      {showFilter && tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            type="button"
            onClick={() => setSelectedTag(null)}
            className={clsx(
              'pill transition-colors',
              selectedTag === null ? 'bg-primary text-white' : 'hover:bg-primary/10',
            )}
          >
            Vše
          </button>
          {tags.map((tag) => (
            <button
              key={tag.slug}
              type="button"
              onClick={() => setSelectedTag(tag.slug)}
              className={clsx(
                'pill transition-colors',
                selectedTag === tag.slug ? 'bg-primary text-white' : 'hover:bg-primary/10',
              )}
            >
              {tag.name}
            </button>
          ))}
        </div>
      )}
      <div className={sidebar ? 'space-y-6' : 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'}>
        {visibleArticles.map((article) => (
          <NewsCard key={article.documentId} article={article} />
        ))}
      </div>
    </>
  );
}
