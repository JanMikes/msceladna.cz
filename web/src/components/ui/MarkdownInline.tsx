import type { ElementType } from 'react';
import { clsx } from 'clsx';
import { markdownToHtml } from '@/lib/markdown';

interface MarkdownInlineProps {
  content: string | null | undefined;
  className?: string;
  as?: ElementType;
}

export function MarkdownInline({ content, className, as: Tag = 'div' }: MarkdownInlineProps) {
  if (!content) return null;
  const html = markdownToHtml(content);
  return (
    <Tag
      className={clsx('md-inline', className)}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
