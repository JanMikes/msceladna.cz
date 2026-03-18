import type { Metadata } from 'next';
import { getProjects } from '@/lib/strapi/data';
import { ProjectCard } from '@/components/ui/ProjectCard';
import Link from 'next/link';
import { clsx } from 'clsx';

export const metadata: Metadata = {
  title: 'Projekty',
  description: 'Projekty Mateřské školy Čeladná.',
};

interface PageProps {
  searchParams: Promise<{ stav?: string }>;
}

export default async function ProjektyPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const status = params.stav;

  const projects = await getProjects(status);

  return (
    <main className="bg-surface pt-16 lg:pt-20">
      <div className="container mx-auto px-4 lg:px-8 py-8 lg:py-12">
        <h1 className="text-3xl lg:text-4xl font-bold text-primary heading-accent mb-8">
          Projekty
        </h1>

        <div className="flex flex-wrap gap-2 mb-8">
          <Link
            href="/projekty"
            className={clsx(
              'pill transition-colors',
              !status ? 'bg-primary text-white' : 'hover:bg-primary/10'
            )}
          >
            Vše
          </Link>
          <Link
            href="/projekty?stav=aktivni"
            className={clsx(
              'pill transition-colors',
              status === 'aktivni' ? 'bg-primary text-white' : 'hover:bg-primary/10'
            )}
          >
            Aktivní
          </Link>
          <Link
            href="/projekty?stav=ukonceny"
            className={clsx(
              'pill transition-colors',
              status === 'ukonceny' ? 'bg-primary text-white' : 'hover:bg-primary/10'
            )}
          >
            Ukončené
          </Link>
        </div>

        {projects.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <ProjectCard key={project.documentId} project={project} />
            ))}
          </div>
        ) : (
          <p className="text-text-muted text-center py-12">Žádné projekty nebyly nalezeny.</p>
        )}
      </div>
    </main>
  );
}
