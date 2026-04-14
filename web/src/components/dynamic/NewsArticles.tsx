import Link from 'next/link';
import { getNewsArticles } from '@/lib/strapi/data';
import { NewsArticlesList } from './NewsArticlesList';
import type { ComponentNewsArticles } from '@/lib/types';

interface NewsArticlesProps {
  data: ComponentNewsArticles;
  sidebar?: boolean;
}

export async function NewsArticles({ data, sidebar }: NewsArticlesProps) {
  const { articles } = await getNewsArticles({
    type: data.newsArticleType ?? undefined,
    tagSlug: data.tagSlug ?? undefined,
    limit: data.limit || 6,
  });

  if (articles.length === 0) return null;

  return (
    <div>
      <NewsArticlesList
        articles={articles}
        sidebar={sidebar}
        showFilter={!data.tagSlug}
      />
      {data.show_all_link && (
        <div className="mt-6 text-center">
          <Link
            href={data.show_all_link.href}
            className="inline-block px-6 py-2 bg-primary text-white font-medium rounded-[var(--radius-button)] hover:bg-primary-dark transition-colors"
            {...(data.show_all_link.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
          >
            {data.show_all_link.text || 'Všechny novinky'}
          </Link>
        </div>
      )}
    </div>
  );
}
