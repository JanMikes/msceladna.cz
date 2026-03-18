import Link from 'next/link';
import { getNewsArticles } from '@/lib/strapi/data';
import { NewsCard } from '@/components/ui/NewsCard';
import type { ComponentNewsArticles } from '@/lib/types';

interface NewsArticlesProps {
  data: ComponentNewsArticles;
  sidebar?: boolean;
}

export async function NewsArticles({ data, sidebar }: NewsArticlesProps) {
  const workplaceSlug = data.workplaces?.[0]?.slug;
  const { articles } = await getNewsArticles({
    workplaceSlug,
    type: data.newsArticleType ?? undefined,
    limit: data.limit || 6,
  });

  if (articles.length === 0) return null;

  return (
    <div>
      <div className={sidebar ? 'space-y-6' : 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'}>
        {articles.map((article) => (
          <NewsCard
            key={article.documentId}
            article={article}
          />
        ))}
      </div>
      {data.show_all_link && (
        <div className="mt-6 text-center">
          <Link
            href={data.show_all_link.href}
            className="inline-block px-6 py-2 bg-primary text-white font-medium rounded-[var(--radius-button)] hover:bg-primary-dark transition-colors"
            {...(data.show_all_link.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
          >
            {data.show_all_link.text || 'Vsechny novinky'}
          </Link>
        </div>
      )}
    </div>
  );
}
