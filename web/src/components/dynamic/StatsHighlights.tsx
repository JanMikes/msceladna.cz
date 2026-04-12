import { clsx } from 'clsx';
import type { ComponentStatsHighlights } from '@/lib/types';

interface StatsHighlightsProps {
  data: ComponentStatsHighlights;
}

const colClasses: Record<string, string> = {
  '2': 'grid-cols-1 sm:grid-cols-2',
  '3': 'grid-cols-1 sm:grid-cols-3',
  '4': 'grid-cols-2 sm:grid-cols-4',
  '5': 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-5',
};

export function StatsHighlights({ data }: StatsHighlightsProps) {
  if (!data.items || data.items.length === 0) return null;

  const style = data.style ?? '2';

  if (style === '1') {
    return (
      <div className={clsx('grid gap-6', colClasses[data.columns] || colClasses['4'])}>
        {data.items.map((item, i) => (
          <div
            key={i}
            className="card relative p-5 overflow-visible"
            style={{
              boxShadow: '-2px 2px 2px 0px rgba(0,0,0,0.2)',
              border: 'none',
            }}
          >
            <div className="flex items-start justify-between gap-2 mb-2">
              {item.number && (
                <p className="text-3xl lg:text-4xl font-black text-primary number-display">{item.number}</p>
              )}
              {item.icon_1 && (
                <div
                  className="w-12 h-12 flex-shrink-0"
                  style={{
                    backgroundImage: `url(${item.icon_1.url})`,
                    backgroundSize: 'contain',
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'center',
                  }}
                />
              )}
            </div>
            {item.title && (
              <p className="font-bold text-primary text-sm mb-1">{item.title}</p>
            )}
            {item.description && (
              <p className="text-xs text-text-muted leading-relaxed">{item.description}</p>
            )}

            {/* Icon 2 — absolute top-left */}
            {item.icon_2 && (
              <div
                className="absolute -top-3 -left-3 w-8 h-8"
                style={{
                  backgroundImage: `url(${item.icon_2.url})`,
                  backgroundSize: 'contain',
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'center',
                }}
              />
            )}
            {/* Icon 3 — absolute bottom-right */}
            {item.icon_3 && (
              <div
                className="absolute -bottom-3 -right-3 w-7 h-7"
                style={{
                  backgroundImage: `url(${item.icon_3.url})`,
                  backgroundSize: 'contain',
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'center',
                }}
              />
            )}
          </div>
        ))}
      </div>
    );
  }

  // Style 2 — original design
  return (
    <div className={clsx('grid gap-6', colClasses[data.columns] || colClasses['4'])}>
      {data.items.map((item, i) => (
        <div key={i} className="text-center p-6 card relative overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-accent rounded-b-full" />
          {item.number && (
            <p className="text-3xl lg:text-4xl font-black text-primary number-display mb-1 mt-1">
              {item.number}
            </p>
          )}
          {item.title && (
            <p className="font-semibold text-accent-dark text-sm uppercase tracking-wider mb-1">{item.title}</p>
          )}
          {item.description && (
            <p className="text-xs text-text-muted">{item.description}</p>
          )}
        </div>
      ))}
    </div>
  );
}
