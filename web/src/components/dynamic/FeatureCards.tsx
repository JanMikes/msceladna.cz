import Link from 'next/link';
import Image from 'next/image';
import { clsx } from 'clsx';
import type { ComponentFeatureCards } from '@/lib/types';

interface FeatureCardsProps {
  data: ComponentFeatureCards;
  sidebar?: boolean;
}

const colClasses: Record<string, string> = {
  '2': 'grid-cols-1 sm:grid-cols-2',
  '3': 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
  '4': 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
};

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export function FeatureCards({ data, sidebar }: FeatureCardsProps) {
  if (!data.cards || data.cards.length === 0) return null;

  return (
    <div className={clsx('grid gap-6', sidebar ? 'grid-cols-1' : (colClasses[data.columns] || colClasses['3']))}>
      {data.cards.map((card, i) => {
        const content = (
          <div className={clsx(
            'card card-accent-top p-6 h-full flex gap-4',
            card.link && 'card-lift cursor-pointer'
          )}>
            {card.icon_type === 'image' && card.icon ? (
              <div className="w-11 h-11 rounded-xl overflow-hidden flex-shrink-0 bg-teal-tint">
                <Image
                  src={card.icon.url}
                  alt={card.title ?? ''}
                  width={44}
                  height={44}
                  className="w-11 h-11 object-cover"
                />
              </div>
            ) : card.icon_type === 'text' && card.icon_text ? (
              <div className="w-11 h-11 rounded-xl bg-teal-tint flex items-center justify-center text-primary text-lg flex-shrink-0">
                {card.icon_text}
              </div>
            ) : card.icon_type === 'initials' && card.title ? (
              <div className="w-11 h-11 rounded-xl bg-primary flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                {getInitials(card.title)}
              </div>
            ) : null}
            <div className="min-w-0">
              {card.title && (
                <h3 className="font-bold text-primary text-lg mb-1">{card.title}</h3>
              )}
              {card.description && (
                <p className="text-text-muted text-sm leading-relaxed">{card.description}</p>
              )}
              {card.link && !data.card_clickable && (
                <span className="inline-flex items-center gap-1 mt-3 text-accent-dark text-sm font-semibold group-hover:gap-2 transition-all">
                  {card.link.text || 'Více'} <span className="text-xs">&rarr;</span>
                </span>
              )}
            </div>
          </div>
        );

        if (card.link) {
          return (
            <Link
              key={i}
              href={card.link.href}
              {...(card.link.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
              className="block group"
            >
              {content}
            </Link>
          );
        }

        return <div key={i}>{content}</div>;
      })}
    </div>
  );
}
