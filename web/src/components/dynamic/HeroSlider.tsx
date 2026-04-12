'use client';

import { useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { ComponentHeroSlider } from '@/lib/types';

interface HeroSliderProps {
  data: ComponentHeroSlider;
}

export function HeroSlider({ data }: HeroSliderProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  const slides = data.slides ?? [];
  if (slides.length === 0) return null;

  return (
    <div className="relative group">
      <div className="overflow-hidden px-12" ref={emblaRef}>
        <div className="flex">
          {slides.map((slide, i) => (
            <div key={i} className="flex-[0_0_100%] min-w-0">
              <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-center">
                {/* Left: text content */}
                <div className="flex-1 min-w-0">
                  {slide.heading && (
                    <h2 className="text-3xl lg:text-4xl font-bold text-primary mb-4">{slide.heading}</h2>
                  )}
                  {slide.text && (
                    <p className="text-text-muted leading-relaxed mb-6">{slide.text}</p>
                  )}
                  {slide.link && (
                    <Link
                      href={slide.link.href}
                      {...(slide.link.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                      className="inline-flex px-6 py-2.5 bg-accent text-white font-semibold rounded-lg hover:bg-accent-dark transition-colors"
                    >
                      {slide.link.text || 'Více informací'}
                    </Link>
                  )}

                  {/* Info items */}
                  {slide.informations && slide.informations.length > 0 && (
                    <div className="flex gap-6 mt-8">
                      {slide.informations.slice(0, 3).map((info, j) => (
                        <div key={j} className="flex-1 min-w-0">
                          {info.icon && (
                            <div className="w-10 h-10 mb-2">
                              <Image
                                src={info.icon.url}
                                alt={info.heading ?? ''}
                                width={40}
                                height={40}
                                className="w-10 h-10 object-contain"
                              />
                            </div>
                          )}
                          {info.heading && (
                            <h4 className="font-bold text-primary text-sm mb-1">{info.heading}</h4>
                          )}
                          {info.text && (
                            <p className="text-text-muted text-xs leading-relaxed">{info.text}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Right: image */}
                {slide.image && (
                  <div className="flex-1 min-w-0">
                    <div className="relative aspect-[4/3] rounded-2xl overflow-hidden">
                      <Image
                        src={slide.image.url}
                        alt={slide.heading ?? ''}
                        fill
                        className="object-cover"
                        sizes="(max-width: 1024px) 100vw, 50vw"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      {slides.length > 1 && (
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
