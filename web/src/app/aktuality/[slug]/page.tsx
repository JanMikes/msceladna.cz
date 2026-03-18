import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Image from 'next/image';
import Breadcrumbs from '@/components/layout/Breadcrumbs';
import { getNewsArticleBySlug } from '@/lib/strapi/data';
import { MarkdownContent } from '@/components/ui/MarkdownContent';
import { FileText, Download } from 'lucide-react';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await getNewsArticleBySlug(slug);

  if (!article) {
    return { title: 'Clanek nenalezen' };
  }

  return {
    title: article.title,
    description: article.description || undefined,
  };
}

export default async function NewsArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const article = await getNewsArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  const formattedDate = new Date(article.date).toLocaleDateString('cs-CZ', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <main className="bg-surface pt-16 lg:pt-20">
      <div className="container mx-auto px-4 lg:px-8 pb-8 lg:pb-12">
        <Breadcrumbs
          items={[
            { label: 'Aktuality', href: '/aktuality' },
            { label: article.title, href: `/aktuality/${article.slug}` },
          ]}
        />

        <article className="max-w-4xl space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-3 flex-wrap">
              <time className="text-sm text-accent font-medium">{formattedDate}</time>
              {article.workplaces.map((w) => (
                <span key={w.slug} className="pill">{w.name}</span>
              ))}
              {article.tags.map((t) => (
                <span key={t.slug} className="pill">{t.name}</span>
              ))}
            </div>
            <h1 className="text-3xl lg:text-4xl font-bold text-primary heading-accent">
              {article.title}
            </h1>
          </div>

          {article.mainPhoto && (
            <div className="relative aspect-video rounded-[var(--radius-card)] overflow-hidden">
              <Image
                src={article.mainPhoto.url}
                alt={article.mainPhoto.alternativeText || article.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          )}

          {article.description && (
            <MarkdownContent
              content={article.description}
              className="prose-lg prose-headings:text-primary"
            />
          )}

          {article.gallery.length > 0 && (
            <div>
              <h2 className="text-xl font-bold text-primary mb-4 heading-accent">Galerie</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {article.gallery.map((photo, i) => (
                  <div key={i} className="relative aspect-[4/3] rounded-[var(--radius-button)] overflow-hidden">
                    <Image
                      src={photo.url}
                      alt={photo.alternativeText || ''}
                      fill
                      className="object-cover hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {article.files.length > 0 && (
            <div>
              <h2 className="text-xl font-bold text-primary mb-4 heading-accent">Soubory</h2>
              <div className="space-y-2">
                {article.files.map((file, i) => (
                  <a
                    key={i}
                    href={file.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-4 card hover:shadow-card-hover transition-shadow group"
                  >
                    <FileText className="w-6 h-6 text-primary-light shrink-0" />
                    <span className="flex-1 text-sm font-medium text-primary group-hover:text-primary-light transition-colors">
                      {file.name}
                    </span>
                    <Download className="w-4 h-4 text-text-muted" />
                  </a>
                ))}
              </div>
            </div>
          )}

          {article.video && (
            <div>
              <h2 className="text-xl font-bold text-primary mb-4 heading-accent">Video</h2>
              <div className="aspect-video rounded-[var(--radius-card)] overflow-hidden">
                <iframe
                  src={article.video}
                  title="Video"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                />
              </div>
            </div>
          )}
        </article>
      </div>
    </main>
  );
}
