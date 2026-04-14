import type { ComponentHeading } from '@/lib/types';

interface HeadingProps {
  data: ComponentHeading;
}

const sizeClasses: Record<string, string> = {
  h2: 'text-2xl lg:text-3xl',
  h3: 'text-xl lg:text-2xl',
  h4: 'text-lg lg:text-xl',
  h5: 'text-base lg:text-lg',
  h6: 'text-sm lg:text-base',
};

export function Heading({ data }: HeadingProps) {
  if (!data.text) return null;

  const Tag = data.type || 'h2';
  const style = data.style || 'style2';
  const accentClass = style === 'style2' ? 'heading-accent' : '';
  const className = `font-bold text-primary mt-5 ${accentClass} ${sizeClasses[Tag] || sizeClasses.h2}`.trim().replace(/\s+/g, ' ');

  return (
    <Tag id={data.anchor || undefined} className={className}>
      {data.text}
    </Tag>
  );
}
