import Link from 'next/link';
import Image from 'next/image';
import type { ComponentWorkplaceCards } from '@/lib/types';

interface WorkplaceCardsProps {
  data: ComponentWorkplaceCards;
}

export function WorkplaceCards({ data }: WorkplaceCardsProps) {
  if (!data.workplaces || data.workplaces.length === 0) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
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
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 640px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-card" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="text-2xl font-bold text-white mb-1">{workplace.name}</h3>
                  {workplace.description && (
                    <p className="text-white/80 text-sm line-clamp-2">{workplace.description}</p>
                  )}
                </div>
              </div>
            ) : (
              <div className="p-8 bg-primary text-white">
                <h3 className="text-2xl font-bold mb-2">{workplace.name}</h3>
                {workplace.description && (
                  <p className="text-white/80 text-sm">{workplace.description}</p>
                )}
              </div>
            )}
          </div>
        </Link>
      ))}
    </div>
  );
}
