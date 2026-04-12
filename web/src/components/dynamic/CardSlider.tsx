'use client';

import { useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { ComponentCardSlider } from '@/lib/types';

interface CardSliderProps {
  data: ComponentCardSlider;
}

export function CardSlider({ data }: CardSliderProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: 'start',
    slidesToScroll: 1,
    containScroll: 'trimSnaps',
  });

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  const items = data.items ?? [];
  if (items.length === 0) return null;

  return (
    <div className="relative group">
      <div className="overflow-hidden px-6 sm:px-10" ref={emblaRef}>
        <div className="flex py-14">
          {items.map((item, i) => {
            const card = (
              <div className="relative card pt-14 pb-6 px-6 text-center h-full flex flex-col items-center mx-3">
                {/* Circular icon overlapping top edge */}
                {item.icon && (
                  <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-20 h-20 rounded-full overflow-hidden bg-surface shadow-sm">
                    <Image
                      src={item.icon.url}
                      alt={item.heading ?? ''}
                      width={80}
                      height={80}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                {item.heading && (
                  <h3 className="font-bold text-primary text-lg mb-2 italic">{item.heading}</h3>
                )}
                {item.text && (
                  <p className="text-text-muted text-sm leading-relaxed mb-4">{item.text}</p>
                )}
                {item.link && (
                  <span className="inline-flex self-center mt-auto px-5 py-2 bg-accent text-white text-sm font-semibold rounded-lg text-center justify-center">
                    {item.link.text || 'Více informací'}
                  </span>
                )}
              </div>
            );

            return (
              <div
                key={i}
                className="flex-[0_0_85%] sm:flex-[0_0_50%] lg:flex-[0_0_33.333%] min-w-0"
              >
                {item.link ? (
                  <Link
                    href={item.link.href}
                    {...(item.link.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                    className="block h-full group/card"
                  >
                    {card}
                  </Link>
                ) : (
                  card
                )}
              </div>
            );
          })}
        </div>
      </div>
      {items.length > 1 && (
        <>
          <button
            onClick={scrollPrev}
            className="absolute left-0 top-1/2 -translate-y-1/2 w-10 h-10 bg-accent rounded-full flex items-center justify-center text-white hover:bg-accent-dark transition-colors"
            aria-label="Předchozí"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={scrollNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 w-10 h-10 bg-accent rounded-full flex items-center justify-center text-white hover:bg-accent-dark transition-colors"
            aria-label="Další"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </>
      )}
    </div>
  );
}
