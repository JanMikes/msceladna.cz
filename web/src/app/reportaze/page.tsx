import type { Metadata } from 'next';
import { getNewsArticles, getWorkplaces } from '@/lib/strapi/data';
import { NewsCard } from '@/components/ui/NewsCard';
import Link from 'next/link';
import { clsx } from 'clsx';

export const metadata: Metadata = {
  title: 'Reportaze',
  description: 'Reportaze a clanky z Materske skoly Celadna.',
};

interface PageProps {
  searchParams: Promise<{ pracoviste?: string; strana?: string }>;
}

export default async function ReportazePage({ searchParams }: PageProps) {
  const params = await searchParams;
  const workplaceSlug = params.pracoviste;
  const page = parseInt(params.strana || '1', 10);
  const pageSize = 12;

  const [{ articles, total }, workplaces] = await Promise.all([
    getNewsArticles({ type: 'reportaz', workplaceSlug, page, limit: pageSize }),
    getWorkplaces(),
  ]);

  const totalPages = Math.ceil(total / pageSize);

  return (
    <main className="bg-surface pt-16 lg:pt-20">
      <div className="container mx-auto px-4 lg:px-8 py-8 lg:py-12">
        <h1 className="text-3xl lg:text-4xl font-bold text-primary heading-accent mb-8">
          Reportaze
        </h1>

        <div className="flex flex-wrap gap-2 mb-8">
          <Link
            href="/reportaze"
            className={clsx(
              'pill transition-colors',
              !workplaceSlug ? 'bg-primary text-white' : 'hover:bg-primary/10'
            )}
          >
            Vse
          </Link>
          {workplaces.map((w) => (
            <Link
              key={w.slug}
              href={`/reportaze?pracoviste=${w.slug}`}
              className={clsx(
                'pill transition-colors',
                workplaceSlug === w.slug ? 'bg-primary text-white' : 'hover:bg-primary/10'
              )}
            >
              {w.name}
            </Link>
          ))}
        </div>

        {articles.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article) => (
              <NewsCard key={article.documentId} article={article} basePath="/reportaze" />
            ))}
          </div>
        ) : (
          <p className="text-text-muted text-center py-12">Zadne reportaze nebyly nalezeny.</p>
        )}

        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-8">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => {
              const params = new URLSearchParams();
              if (workplaceSlug) params.set('pracoviste', workplaceSlug);
              if (p > 1) params.set('strana', String(p));
              const href = `/reportaze${params.toString() ? `?${params}` : ''}`;
              return (
                <Link
                  key={p}
                  href={href}
                  className={clsx(
                    'w-10 h-10 rounded-[var(--radius-button)] flex items-center justify-center text-sm font-medium transition-colors',
                    p === page ? 'bg-primary text-white' : 'bg-card text-primary hover:bg-primary/10'
                  )}
                >
                  {p}
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
