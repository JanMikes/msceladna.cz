import Link from 'next/link';
import Image from 'next/image';
import type { NewsArticleSummary } from '@/lib/types';

interface NewsCardProps {
  article: NewsArticleSummary;
  basePath?: string;
}

export function NewsCard({ article, basePath = '/aktuality' }: NewsCardProps) {
  const formattedDate = new Date(article.date).toLocaleDateString('cs-CZ', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <Link href={`${basePath}/${article.slug}`} className="group block">
      <article className="card overflow-hidden card-lift h-full flex flex-col">
        {article.mainPhoto ? (
          <div className="relative aspect-news-card overflow-hidden">
            <Image
              src={article.mainPhoto.url}
              alt={article.mainPhoto.alternativeText || article.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          </div>
        ) : (
          <div className="aspect-news-card bg-surface flex items-center justify-center">
            <span className="text-text-muted text-sm">Bez fotky</span>
          </div>
        )}
        <div className="p-5 flex flex-col flex-1">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <time className="text-xs text-accent font-medium">{formattedDate}</time>
            {article.workplaces.map((w) => (
              <span key={w.slug} className="pill">{w.name}</span>
            ))}
          </div>
          <h3 className="font-bold text-primary text-lg mb-2 group-hover:text-primary-light transition-colors line-clamp-2">
            {article.title}
          </h3>
          {article.description && (
            <p className="text-text-muted text-sm line-clamp-3 flex-1">{article.description}</p>
          )}
        </div>
      </article>
    </Link>
  );
}
