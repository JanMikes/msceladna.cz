import Image from 'next/image';
import { Mail, Phone } from 'lucide-react';
import { clsx } from 'clsx';
import type { ComponentContactCards } from '@/lib/types';

interface ContactCardsProps {
  data: ComponentContactCards;
  sidebar?: boolean;
}

export function ContactCards({ data, sidebar }: ContactCardsProps) {
  if (!data.cards || data.cards.length === 0) return null;

  const style = data.style ?? '1';

  if (style === '3') {
    return (
      <div className={sidebar ? 'grid grid-cols-1 gap-6' : 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'}>
        {data.cards.map((card, i) => (
          <div key={i} className="flex gap-4 items-center">
            {card.photo ? (
              <div className="relative w-28 h-28 rounded-full overflow-hidden flex-shrink-0">
                <Image src={card.photo.url} alt={card.name} fill className="object-cover" />
              </div>
            ) : (
              <div className="w-28 h-28 rounded-full bg-teal-tint flex items-center justify-center flex-shrink-0">
                <span className="text-primary font-bold text-2xl">
                  {card.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </span>
              </div>
            )}
            <div className="min-w-0">
              <h4 className="font-bold text-primary text-sm">{card.name}</h4>
              {card.role && <p className="text-xs text-text-muted mb-1">{card.role}</p>}
              <div className="space-y-0.5">
                {card.email && (
                  <a href={`mailto:${card.email}`} className="flex items-center gap-1.5 text-xs text-text-muted hover:text-primary transition-colors">
                    <Mail className="w-3 h-3 text-accent flex-shrink-0" /><span className="truncate">{card.email}</span>
                  </a>
                )}
                {card.phone && (
                  <a href={`tel:${card.phone}`} className="flex items-center gap-1.5 text-xs text-text-muted hover:text-primary transition-colors">
                    <Phone className="w-3 h-3 text-accent flex-shrink-0" />{card.phone}
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={sidebar ? 'grid grid-cols-1 gap-6' : 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'}>
      {data.cards.map((card, i) => (
        <div
          key={i}
          className="card relative p-5 flex gap-4 overflow-visible"
          style={{
            boxShadow: '-2px 2px 2px 0px rgba(0,0,0,0.2)',
            border: 'none',
            borderRight: style === '2' ? '4px solid var(--color-primary)' : '4px solid var(--color-accent)',
          }}
        >
          {/* Photo */}
          {card.photo ? (
            <div className="relative w-14 h-14 rounded-full overflow-hidden flex-shrink-0 ring-2 ring-accent/40">
              <Image src={card.photo.url} alt={card.name} fill className="object-cover" />
            </div>
          ) : (
            <div className="w-14 h-14 rounded-full bg-teal-tint flex items-center justify-center flex-shrink-0 ring-2 ring-accent/40">
              <span className="text-primary font-bold text-lg">
                {card.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
              </span>
            </div>
          )}

          {/* Text */}
          <div className="min-w-0 flex-1">
            <h4 className="font-bold text-primary text-sm">{card.name}</h4>
            {card.role && <p className="text-xs text-text-muted mb-1">{card.role}</p>}
            <div className="space-y-0.5">
              {card.email && (
                <a href={`mailto:${card.email}`} className="flex items-center gap-1.5 text-xs text-text-muted hover:text-primary transition-colors">
                  <Mail className="w-3 h-3 text-accent flex-shrink-0" /><span className="truncate">{card.email}</span>
                </a>
              )}
              {card.phone && (
                <a href={`tel:${card.phone}`} className="flex items-center gap-1.5 text-xs text-text-muted hover:text-primary transition-colors">
                  <Phone className="w-3 h-3 text-accent flex-shrink-0" />{card.phone}
                </a>
              )}
            </div>
          </div>

          {/* Style 1: 3 icons absolute */}
          {style === '1' && (
            <>
              {card.icon_2 && (
                <div className="absolute -top-3 left-8 w-8 h-8" style={{ backgroundImage: `url(${card.icon_2.url})`, backgroundSize: 'contain', backgroundRepeat: 'no-repeat', backgroundPosition: 'center' }} />
              )}
              {card.icon_1 && (
                <div className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12" style={{ backgroundImage: `url(${card.icon_1.url})`, backgroundSize: 'contain', backgroundRepeat: 'no-repeat', backgroundPosition: 'center' }} />
              )}
              {card.icon_3 && (
                <div className="absolute -bottom-3 right-12 w-7 h-7" style={{ backgroundImage: `url(${card.icon_3.url})`, backgroundSize: 'contain', backgroundRepeat: 'no-repeat', backgroundPosition: 'center' }} />
              )}
            </>
          )}

          {/* Style 2: 1 icon absolute right */}
          {style === '2' && card.icon_1 && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12" style={{ backgroundImage: `url(${card.icon_1.url})`, backgroundSize: 'contain', backgroundRepeat: 'no-repeat', backgroundPosition: 'center' }} />
          )}
        </div>
      ))}
    </div>
  );
}
