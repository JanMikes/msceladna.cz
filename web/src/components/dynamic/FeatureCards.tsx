import Link from '@/components/ui/Link';
import Image from 'next/image';
import { clsx } from 'clsx';
import type { ComponentFeatureCards } from '@/lib/types';
import { MarkdownInline } from '@/components/ui/MarkdownInline';

interface FeatureCardsProps {
  data: ComponentFeatureCards;
  sidebar?: boolean;
}

const colClasses: Record<string, string> = {
  '2': 'grid-cols-1 sm:grid-cols-2',
  '3': 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
  '4': 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
};

const iconSizes: Record<string, { left: number; icon1: number; icon2: number; icon3: number }> = {
  '2': { left: 72, icon1: 72, icon2: 52, icon3: 38 },
  '3': { left: 60, icon1: 60, icon2: 44, icon3: 32 },
  '4': { left: 52, icon1: 48, icon2: 36, icon3: 26 },
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

  const style = data.style ?? '1';
  const columns = data.columns ?? '3';
  const sizes = iconSizes[columns] ?? iconSizes['3'];

  return (
    <div className={clsx('grid gap-6', sidebar ? 'grid-cols-1' : (colClasses[columns] || colClasses['3']))}>
      {data.cards.map((card, i) => {
        const hasIcons = card.icon_1 || card.icon_2 || card.icon_3;

        const content = (
          <div
            className={clsx(
              'card p-6 h-full flex',
              card.link && 'card-lift cursor-pointer'
            )}
            style={{
              boxShadow: '-2px 2px 2px 0px rgba(0,0,0,0.2)',
              border: 'none',
              borderRight: style === '2' ? '4px solid var(--color-primary)' : '4px solid var(--color-accent)',
            }}
          >
            {/* Left: icon + text */}
            <div className={clsx('flex gap-4 min-w-0', hasIcons ? 'flex-1' : 'w-full')}>
              {card.icon_type === 'image' && card.icon ? (
                <div className="rounded-xl overflow-hidden flex-shrink-0 bg-teal-tint" style={{ width: sizes.left, height: sizes.left }}>
                  <Image
                    src={card.icon.url}
                    alt={card.title ?? ''}
                    width={sizes.left}
                    height={sizes.left}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : card.icon_type === 'text' && card.icon_text ? (
                <div className="rounded-xl bg-teal-tint flex items-center justify-center text-primary text-lg flex-shrink-0" style={{ width: sizes.left, height: sizes.left }}>
                  {card.icon_text}
                </div>
              ) : card.icon_type === 'initials' && card.title ? (
                <div className="rounded-xl bg-primary flex items-center justify-center text-white text-sm font-bold flex-shrink-0" style={{ width: sizes.left, height: sizes.left }}>
                  {getInitials(card.title)}
                </div>
              ) : null}
              <div className="min-w-0 flex flex-col flex-1">
                {card.title && (
                  <h3 className="font-bold text-primary text-lg mb-1">{card.title}</h3>
                )}
                {card.description && (
                  <MarkdownInline
                    content={card.description}
                    className="text-text-muted text-sm leading-relaxed mb-3"
                  />
                )}
                {card.link && !data.card_clickable && (
                  style === '2' ? (
                    <span className="inline-flex self-start mt-auto pt-2.5 px-4 py-2.5 bg-accent text-white text-sm font-semibold rounded-lg text-center justify-center">
                      {card.link.text || 'Více informací'}
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-2 mt-auto pt-3 text-accent-dark text-sm font-semibold">
                      <span className="underline">{card.link.text || 'Zobrazit'}</span> <span>&rarr;</span>
                    </span>
                  )
                )}
              </div>
            </div>

            {/* Right: 3 icon slots in collage */}
            {hasIcons && (
              <div
                className="relative flex-shrink-0 ml-4"
                style={{
                  width: sizes.icon1 + sizes.icon2 * 0.5,
                  minHeight: sizes.icon1 + sizes.icon3 * 0.3,
                }}
              >
                {/* Icon 2 — medium, top-left */}
                {card.icon_2 && (
                  <div
                    className="absolute top-0 left-0"
                    style={{
                      width: sizes.icon2,
                      height: sizes.icon2,
                      backgroundImage: `url(${card.icon_2.url})`,
                      backgroundSize: 'contain',
                      backgroundRepeat: 'no-repeat',
                      backgroundPosition: 'center',
                    }}
                  />
                )}
                {/* Icon 1 — largest, right, vertically centered */}
                {card.icon_1 && (
                  <div
                    className="absolute right-0 top-1/2 -translate-y-1/2"
                    style={{
                      width: sizes.icon1,
                      height: sizes.icon1,
                      backgroundImage: `url(${card.icon_1.url})`,
                      backgroundSize: 'contain',
                      backgroundRepeat: 'no-repeat',
                      backgroundPosition: 'center',
                    }}
                  />
                )}
                {/* Icon 3 — smallest, bottom-left */}
                {card.icon_3 && (
                  <div
                    className="absolute bottom-0 left-[5%]"
                    style={{
                      width: sizes.icon3,
                      height: sizes.icon3,
                      backgroundImage: `url(${card.icon_3.url})`,
                      backgroundSize: 'contain',
                      backgroundRepeat: 'no-repeat',
                      backgroundPosition: 'center',
                    }}
                  />
                )}
              </div>
            )}
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
