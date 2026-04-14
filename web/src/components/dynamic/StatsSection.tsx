import Link from 'next/link';
import type { ComponentStatsSection } from '@/lib/types';
import { MarkdownInline } from '@/components/ui/MarkdownInline';

interface StatsSectionProps {
  data: ComponentStatsSection;
}

export function StatsSection({ data }: StatsSectionProps) {
  const items = data.items ?? [];
  if (items.length === 0 && !data.heading) return null;

  return (
    <div className="bg-primary rounded-2xl p-6 lg:p-10 flex flex-col lg:flex-row gap-8 lg:gap-12 items-start">
      {/* Left: heading, description, CTA */}
      {(data.heading || data.description || data.link) && (
        <div className="lg:w-1/3 flex-shrink-0">
          {data.heading && (
            <h2 className="text-2xl lg:text-3xl font-extrabold text-white mb-4">{data.heading}</h2>
          )}
          {data.description && (
            <MarkdownInline
              content={data.description}
              className="text-white/70 text-sm leading-relaxed mb-6"
            />
          )}
          {data.link && (
            <Link
              href={data.link.href}
              {...(data.link.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
              className="inline-flex px-5 py-2.5 bg-accent text-white font-semibold text-sm rounded-lg hover:bg-accent-dark transition-colors"
            >
              {data.link.text || 'Více informací'}
            </Link>
          )}
        </div>
      )}

      {/* Right: stat cards */}
      {items.length > 0 && (
        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((item, i) => (
            <div key={i} className="bg-accent rounded-xl p-5 relative overflow-hidden">
              <div className="flex items-start justify-between gap-3 mb-3">
                {item.number && (
                  <p className="text-4xl lg:text-5xl font-black text-white number-display">{item.number}</p>
                )}
                {item.icon_1 && (
                  <div
                    className="w-14 h-14 flex-shrink-0"
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
                <p className="font-bold text-white text-base mb-1">{item.title}</p>
              )}
              {item.description && (
                <MarkdownInline
                  content={item.description}
                  className="text-white/70 text-xs leading-relaxed"
                />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
