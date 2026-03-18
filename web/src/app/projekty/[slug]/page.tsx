import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Image from 'next/image';
import Breadcrumbs from '@/components/layout/Breadcrumbs';
import { getProjectBySlug } from '@/lib/strapi/data';
import { MarkdownContent } from '@/components/ui/MarkdownContent';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    return { title: 'Projekt nenalezen' };
  }

  return {
    title: project.name,
    description: project.goal || undefined,
  };
}

const statusLabels: Record<string, string> = {
  aktivni: 'Aktivni',
  ukonceny: 'Ukonceny',
};

export default async function ProjectDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  return (
    <main className="bg-surface pt-16 lg:pt-20">
      <div className="container mx-auto px-4 lg:px-8 pb-8 lg:pb-12">
        <Breadcrumbs
          items={[
            { label: 'Projekty', href: '/projekty' },
            { label: project.name, href: `/projekty/${project.slug}` },
          ]}
        />

        <article className="max-w-4xl space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-3 flex-wrap">
              {project.status && (
                <span className="pill bg-accent/15 text-primary">
                  {statusLabels[project.status] || project.status}
                </span>
              )}
              {project.workplaces.map((w) => (
                <span key={w.slug} className="pill">{w.name}</span>
              ))}
            </div>
            <h1 className="text-3xl lg:text-4xl font-bold text-primary heading-accent">
              {project.name}
            </h1>
          </div>

          <div className="card p-6 space-y-3">
            {project.projectNumber && (
              <p className="text-sm"><span className="font-medium text-primary">Registracni cislo:</span> <span className="text-text-muted">{project.projectNumber}</span></p>
            )}
            {project.goal && (
              <p className="text-sm"><span className="font-medium text-primary">Cil projektu:</span> <span className="text-text-muted">{project.goal}</span></p>
            )}
            {project.financialAmount && (
              <p className="text-sm"><span className="font-medium text-primary">Vyse podpory:</span> <span className="text-accent font-semibold">{project.financialAmount}</span></p>
            )}
            {(project.dateFrom || project.dateTo) && (
              <p className="text-sm">
                <span className="font-medium text-primary">Obdobi:</span>{' '}
                <span className="text-text-muted">
                  {project.dateFrom && new Date(project.dateFrom).toLocaleDateString('cs-CZ')}
                  {project.dateFrom && project.dateTo && ' - '}
                  {project.dateTo && new Date(project.dateTo).toLocaleDateString('cs-CZ')}
                </span>
              </p>
            )}
          </div>

          {project.description && (
            <MarkdownContent
              content={project.description}
              className="prose-headings:text-primary"
            />
          )}

          {project.logos.length > 0 && (
            <div>
              <h2 className="text-xl font-bold text-primary mb-4 heading-accent">Loga poskytovatelu</h2>
              <div className="flex flex-wrap items-center gap-6">
                {project.logos.map((logo, i) => (
                  <Image
                    key={i}
                    src={logo.url}
                    alt={logo.alternativeText || ''}
                    width={200}
                    height={100}
                    className="object-contain max-h-20"
                  />
                ))}
              </div>
            </div>
          )}

          {project.publicityPoster && (
            <div>
              <h2 className="text-xl font-bold text-primary mb-4 heading-accent">Plakat publicity</h2>
              <div className="rounded-[var(--radius-card)] overflow-hidden">
                <Image
                  src={project.publicityPoster.url}
                  alt={project.publicityPoster.alternativeText || 'Plakat'}
                  width={project.publicityPoster.width || 800}
                  height={project.publicityPoster.height || 600}
                  className="w-full h-auto"
                />
              </div>
            </div>
          )}
        </article>
      </div>
    </main>
  );
}
