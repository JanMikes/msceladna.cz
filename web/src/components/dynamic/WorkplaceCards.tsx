import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import type { ComponentWorkplaceCards } from '@/lib/types';

interface WorkplaceCardsProps {
  data: ComponentWorkplaceCards;
}

export function WorkplaceCards({ data }: WorkplaceCardsProps) {
  if (!data.workplaces || data.workplaces.length === 0) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:gap-8">
      {data.workplaces.map((workplace, i) => (
        <Link
          key={i}
          href={`/${workplace.slug}`}
          className="group block"
        >
          <div className="card overflow-hidden card-lift h-full">
            {workplace.image ? (
              <div className="relative aspect-[16/10] overflow-hidden">
                <Image
                  src={workplace.image.url}
                  alt={workplace.image.alternativeText || workplace.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 640px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-card" />
                <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-8">
                  <h3 className="text-2xl lg:text-3xl font-extrabold text-white mb-1">{workplace.name}</h3>
                  {workplace.description && (
                    <p className="text-white/70 text-sm line-clamp-2 mb-3">{workplace.description}</p>
                  )}
                  <span className="inline-flex items-center gap-2 text-accent text-sm font-semibold group-hover:gap-3 transition-all duration-300">
                    Prozkoumat <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </div>
            ) : (
              <div className="p-8 lg:p-10 bg-primary text-white relative overflow-hidden">
                <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-white/5" />
                <h3 className="text-2xl lg:text-3xl font-extrabold mb-2 relative">{workplace.name}</h3>
                {workplace.description && (
                  <p className="text-white/70 text-sm mb-4 relative">{workplace.description}</p>
                )}
                <span className="inline-flex items-center gap-2 text-accent text-sm font-semibold group-hover:gap-3 transition-all duration-300 relative">
                  Prozkoumat <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            )}
          </div>
        </Link>
      ))}
    </div>
  );
}
