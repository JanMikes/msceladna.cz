import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import type { ComponentBannerCards } from '@/lib/types';

interface BannerCardsProps {
  data: ComponentBannerCards;
}

export function BannerCards({ data }: BannerCardsProps) {
  if (!data.cards || data.cards.length === 0) return null;

  return (
    <div className="space-y-4">
      {data.cards.map((card, i) => (
        <div key={i} className="bg-primary text-white p-6 lg:p-8 rounded-[var(--radius-card)] relative overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute -right-6 -top-6 w-24 h-24 rounded-full bg-accent/10" />
          <div className="absolute right-12 -bottom-4 w-16 h-16 rounded-full bg-white/5" />
          <div className="relative">
            {card.title && (
              <h3 className="text-xl lg:text-2xl font-extrabold mb-2">{card.title}</h3>
            )}
            {card.description && (
              <p className="text-white/70 max-w-xl">{card.description}</p>
            )}
            {card.link && (
              <Link
                href={card.link.href}
                className="inline-flex items-center gap-2 mt-4 text-accent font-semibold hover:gap-3 transition-all duration-300"
                {...(card.link.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
              >
                {card.link.text || 'Více'} <ArrowRight className="w-4 h-4" />
              </Link>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
