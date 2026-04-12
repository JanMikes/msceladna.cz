import Image from 'next/image';
import { clsx } from 'clsx';
import type { ComponentImage } from '@/lib/types';

interface ImageBlockProps {
  data: ComponentImage;
}

const widthClasses: Record<string, string> = {
  '25': 'sm:w-1/4',
  '33': 'sm:w-1/3',
  '40': 'sm:w-2/5',
  '50': 'sm:w-1/2',
  '66': 'sm:w-2/3',
  '75': 'sm:w-3/4',
  '80': 'sm:w-4/5',
  '100': 'w-full',
};

const alignClasses: Record<string, string> = {
  left: 'mr-auto',
  center: 'mx-auto',
  right: 'ml-auto',
};

export function ImageBlock({ data }: ImageBlockProps) {
  if (!data.image) return null;

  const width = data.width ?? '100';
  const align = data.align ?? 'center';

  return (
    <div className={clsx(
      'w-full rounded-[var(--radius-card)] overflow-hidden',
      widthClasses[width] || 'w-full',
      alignClasses[align] || 'mx-auto',
    )}>
      <Image
        src={data.image.url}
        alt={data.image.alternativeText || ''}
        width={data.image.width || 800}
        height={data.image.height || 600}
        className="w-full h-auto"
      />
    </div>
  );
}
