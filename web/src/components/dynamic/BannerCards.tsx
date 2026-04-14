import Link from 'next/link';
import Image from 'next/image';
import { clsx } from 'clsx';
import type { ComponentBannerCards, BannerCard, MediaImage } from '@/lib/types';
import { MarkdownInline } from '@/components/ui/MarkdownInline';

interface BannerCardsProps {
  data: ComponentBannerCards;
}

function IconAbsolute({ icon, className, size = 40 }: { icon: MediaImage; className: string; size?: number }) {
  return (
    <div
      className={clsx('absolute', className)}
      style={{
        width: size,
        height: size,
        backgroundImage: `url(${icon.url})`,
        backgroundSize: 'contain',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
      }}
    />
  );
}

function Style1Card({ card }: { card: BannerCard }) {
  const imgLeft = card.image_position === 'left';

  return (
    <div className="bg-primary rounded-2xl relative overflow-visible flex flex-col lg:flex-row min-h-[220px]">
      {/* Image */}
      {card.image && (
        <div className={clsx('relative w-full lg:w-2/5 min-h-[200px] lg:min-h-0 overflow-hidden', imgLeft ? 'order-first rounded-l-2xl' : 'order-last rounded-r-2xl')}>
          <Image src={card.image.url} alt={card.title ?? ''} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 40vw" />
        </div>
      )}

      {/* Content */}
      <div className={clsx('flex-1 p-6 lg:p-8 flex flex-col justify-center relative z-10', !card.image && 'w-full')}>
        {card.title && (
          <h3 className="text-xl lg:text-2xl font-extrabold text-white mb-2">{card.title}</h3>
        )}
        {card.description && (
          <MarkdownInline
            content={card.description}
            className="text-white/70 text-sm leading-relaxed mb-4 max-w-lg"
          />
        )}
        {card.link && (
          <Link
            href={card.link.href}
            className="inline-flex self-start px-5 py-2 bg-white text-primary text-sm font-semibold rounded-lg hover:bg-white/90 transition-colors"
            {...(card.link.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
          >
            {card.link.text || 'Více informací'}
          </Link>
        )}
      </div>

      {/* 7 icons — absolute positioned */}
      {card.icon_1 && <IconAbsolute icon={card.icon_1} className={imgLeft ? '-left-4 top-1/2 -translate-y-1/2' : '-right-4 top-1/2 -translate-y-1/2'} size={56} />}
      {card.icon_2 && <IconAbsolute icon={card.icon_2} className="top-2 left-1/2 -translate-x-1/2" size={32} />}
      {card.icon_3 && <IconAbsolute icon={card.icon_3} className={imgLeft ? 'top-3 right-6' : 'top-3 left-[42%]'} size={28} />}
      {card.icon_4 && <IconAbsolute icon={card.icon_4} className="bottom-3 left-1/2 -translate-x-1/2" size={28} />}
      {card.icon_5 && <IconAbsolute icon={card.icon_5} className={imgLeft ? 'right-1/4 top-4' : 'left-1/4 top-4'} size={48} />}
      {card.icon_6 && <IconAbsolute icon={card.icon_6} className={imgLeft ? 'right-4 top-1/2 -translate-y-1/2' : 'left-[42%] top-1/2 -translate-y-1/2'} size={28} />}
      {card.icon_7 && <IconAbsolute icon={card.icon_7} className={imgLeft ? 'right-2 bottom-3' : 'left-2 bottom-3'} size={24} />}
    </div>
  );
}

function Style2Card({ card }: { card: BannerCard }) {
  return (
    <div className="bg-primary rounded-2xl relative overflow-visible p-6 lg:p-8 flex flex-col lg:flex-row items-center gap-6 min-h-[140px]">
      {/* Content */}
      <div className="flex-1 min-w-0">
        {card.title && (
          <h3 className="text-xl lg:text-2xl font-extrabold text-white mb-2">{card.title}</h3>
        )}
        {card.description && (
          <MarkdownInline
            content={card.description}
            className="text-white/70 text-sm leading-relaxed mb-4 max-w-lg"
          />
        )}
        {card.link && (
          <Link
            href={card.link.href}
            className="inline-flex self-start px-5 py-2 bg-accent text-white text-sm font-semibold rounded-lg hover:bg-accent-dark transition-colors"
            {...(card.link.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
          >
            {card.link.text || 'Více informací'}
          </Link>
        )}
      </div>

      {/* 5 icons — absolute, mixed top/bottom positioning, ascending size */}
      {card.icon_1 && <IconAbsolute icon={card.icon_1} className="top-3 right-[45%]" size={32} />}
      {card.icon_2 && <IconAbsolute icon={card.icon_2} className="bottom-3 right-[40%]" size={48} />}
      {card.icon_3 && <IconAbsolute icon={card.icon_3} className="top-2 right-[28%]" size={56} />}
      {card.icon_4 && <IconAbsolute icon={card.icon_4} className="bottom-2 right-[15%]" size={64} />}
      {card.icon_5 && <IconAbsolute icon={card.icon_5} className="-bottom-3 -right-3" size={88} />}
    </div>
  );
}

export function BannerCards({ data }: BannerCardsProps) {
  if (!data.cards || data.cards.length === 0) return null;

  const style = data.style ?? '1';

  return (
    <div className="space-y-6">
      {data.cards.map((card, i) =>
        style === '2' ? <Style2Card key={i} card={card} /> : <Style1Card key={i} card={card} />
      )}
    </div>
  );
}
