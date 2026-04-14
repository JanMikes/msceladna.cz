import Link from 'next/link';
import { clsx } from 'clsx';
import type { ComponentWorkplaceCards } from '@/lib/types';
import { MarkdownInline } from '@/components/ui/MarkdownInline';

interface WorkplaceCardsProps {
  data: ComponentWorkplaceCards;
}

export function WorkplaceCards({ data }: WorkplaceCardsProps) {
  if (!data.workplaces || data.workplaces.length === 0) return null;

  const style = data.style ?? '1';

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:gap-8">
      {data.workplaces.map((workplace, i) => {
        const cardStyle = i % 2 === 0 ? style : style === '1' ? '2' : '1';

        const content = (
          <div
            className={clsx(
              'relative overflow-hidden rounded-2xl p-6 lg:p-8 h-full flex',
              cardStyle === '1' ? 'bg-primary' : 'bg-accent'
            )}
          >
            {/* Text content */}
            <div className="flex-1 min-w-0 flex flex-col relative z-10">
              {workplace.name && (
                <h3 className="text-2xl lg:text-3xl font-extrabold text-white mb-3">{workplace.name}</h3>
              )}
              {workplace.description && (
                <MarkdownInline
                  content={workplace.description}
                  className="text-white text-sm leading-relaxed mb-4"
                />
              )}
              {workplace.link && (
                <span className={clsx(
                  'inline-flex items-center gap-2 mt-auto text-sm font-semibold',
                  cardStyle === '1' ? 'text-accent' : 'text-primary-dark'
                )}>
                  <span className="underline">{workplace.link.text || 'Zobrazit'}</span> <span>&rarr;</span>
                </span>
              )}
            </div>

            {/* Icon 1 — large mascot, flex-aligned right */}
            {workplace.icon_1 && (
              <div
                className="flex-shrink-0 self-end ml-4 w-24 h-24 lg:w-32 lg:h-32"
                style={{
                  backgroundImage: `url(${workplace.icon_1.url})`,
                  backgroundSize: 'contain',
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'center bottom',
                }}
              />
            )}

            {/* Icon 2 — small circle, absolute */}
            {workplace.icon_2 && (
              <div
                className={clsx(
                  'absolute w-10 h-10 lg:w-12 lg:h-12 rounded-full flex items-center justify-center overflow-hidden',
                  cardStyle === '1' ? '-top-3 -left-3 lg:top-3 lg:left-3' : '-top-3 -right-3 lg:top-3 lg:right-3',
                  cardStyle === '1' ? 'bg-primary-dark' : 'bg-primary'
                )}
              >
                <div
                  className="w-6 h-6"
                  style={{
                    backgroundImage: `url(${workplace.icon_2.url})`,
                    backgroundSize: 'contain',
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'center',
                  }}
                />
              </div>
            )}

            {/* Icon 3 — small circle, absolute */}
            {workplace.icon_3 && (
              <div
                className={clsx(
                  'absolute w-10 h-10 lg:w-12 lg:h-12 rounded-full flex items-center justify-center overflow-hidden',
                  cardStyle === '1' ? '-bottom-3 left-1/2 -translate-x-1/2 lg:bottom-3' : '-right-3 top-1/2 -translate-y-1/2 lg:right-3',
                  cardStyle === '1' ? 'bg-accent' : 'bg-primary-dark'
                )}
              >
                <div
                  className="w-6 h-6"
                  style={{
                    backgroundImage: `url(${workplace.icon_3.url})`,
                    backgroundSize: 'contain',
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'center',
                  }}
                />
              </div>
            )}
          </div>
        );

        if (workplace.link) {
          return (
            <Link
              key={i}
              href={workplace.link.href}
              {...(workplace.link.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
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
