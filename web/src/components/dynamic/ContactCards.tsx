import Image from 'next/image';
import { Mail, Phone } from 'lucide-react';
import type { ComponentContactCards } from '@/lib/types';

interface ContactCardsProps {
  data: ComponentContactCards;
  sidebar?: boolean;
}

export function ContactCards({ data, sidebar }: ContactCardsProps) {
  if (!data.cards || data.cards.length === 0) return null;

  return (
    <div className={sidebar ? 'grid grid-cols-1 gap-4' : 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'}>
      {data.cards.map((card, i) => (
        <div key={i} className="card card-accent-left p-5 flex gap-4">
          {card.photo ? (
            <div className="relative w-14 h-14 rounded-xl overflow-hidden flex-shrink-0">
              <Image
                src={card.photo.url}
                alt={card.name}
                fill
                className="object-cover"
              />
            </div>
          ) : (
            <div className="w-14 h-14 rounded-xl bg-teal-tint flex items-center justify-center flex-shrink-0">
              <span className="text-primary font-bold text-lg">
                {card.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
              </span>
            </div>
          )}
          <div className="min-w-0">
            <h4 className="font-bold text-primary text-sm">{card.name}</h4>
            {card.role && (
              <p className="text-xs text-text-muted mb-2">{card.role}</p>
            )}
            <div className="space-y-1">
              {card.phone && (
                <a
                  href={`tel:${card.phone}`}
                  className="flex items-center gap-1.5 text-xs text-text-muted hover:text-primary transition-colors"
                >
                  <Phone className="w-3 h-3 text-accent" />
                  {card.phone}
                </a>
              )}
              {card.email && (
                <a
                  href={`mailto:${card.email}`}
                  className="flex items-center gap-1.5 text-xs text-text-muted hover:text-primary transition-colors"
                >
                  <Mail className="w-3 h-3 text-accent" />
                  {card.email}
                </a>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
