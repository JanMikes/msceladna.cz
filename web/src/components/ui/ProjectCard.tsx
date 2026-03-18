import Link from 'next/link';
import type { Project } from '@/lib/types';

interface ProjectCardProps {
  project: Project;
}

const statusLabels: Record<string, string> = {
  aktivni: 'Aktivni',
  ukonceny: 'Ukonceny',
};

const statusColors: Record<string, string> = {
  aktivni: 'bg-accent/15 text-primary',
  ukonceny: 'bg-gray-100 text-text-muted',
};

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Link href={`/projekty/${project.slug}`} className="group block">
      <article className="card p-6 card-lift h-full flex flex-col">
        <div className="flex items-start justify-between gap-3 mb-3">
          <h3 className="font-bold text-primary text-lg group-hover:text-primary-light transition-colors line-clamp-2">
            {project.name}
          </h3>
          {project.status && (
            <span className={`pill shrink-0 ${statusColors[project.status] || ''}`}>
              {statusLabels[project.status] || project.status}
            </span>
          )}
        </div>
        {project.projectNumber && (
          <p className="text-xs text-text-muted mb-2">Reg. c.: {project.projectNumber}</p>
        )}
        {project.description && (
          <p className="text-text-muted text-sm line-clamp-3 flex-1 mb-3">{project.description}</p>
        )}
        {project.financialAmount && (
          <p className="text-sm font-medium text-accent">{project.financialAmount}</p>
        )}
      </article>
    </Link>
  );
}
