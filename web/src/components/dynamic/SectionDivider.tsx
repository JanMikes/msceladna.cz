import { clsx } from 'clsx';
import type { ComponentSectionDivider } from '@/lib/types';

interface SectionDividerProps {
  data: ComponentSectionDivider;
}

const spacingClasses: Record<string, string> = {
  S: 'my-4',
  M: 'my-8',
  L: 'my-12',
};

const styleClasses: Record<string, string> = {
  solid: 'border-solid',
  dashed: 'border-dashed',
  dotted: 'border-dotted',
};

const svgStyles: Record<string, { src: string; height: number; center: boolean }> = {
  v1: { src: '/hr-style-1.svg', height: 47, center: true },
  v2: { src: '/hr-style-2.svg', height: 75, center: true },
  v3: { src: '/hr-style-3.svg', height: 122, center: false },
  v4: { src: '/hr-style-4.svg', height: 95, center: false },
  v5: { src: '/hr-style-5.svg', height: 96, center: false },
};

export function SectionDivider({ data }: SectionDividerProps) {
  const svg = svgStyles[data.style];

  if (svg) {
    return (
      <div
        className={clsx(
          'max-w-[1400px] overflow-hidden',
          spacingClasses[data.spacing] || spacingClasses.M,
          svg.center ? 'mx-auto' : ''
        )}
        style={{
          height: svg.height,
          backgroundImage: `url(${svg.src})`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: svg.center ? 'center' : 'right',
          backgroundSize: 'auto 100%',
        }}
      />
    );
  }

  return (
    <hr
      className={clsx(
        'border-t border-[#B2B2B2]',
        spacingClasses[data.spacing] || spacingClasses.M,
        styleClasses[data.style] || styleClasses.solid
      )}
    />
  );
}
