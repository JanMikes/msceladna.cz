import type { ComponentText } from '@/lib/types';
import { MarkdownContent } from '../ui/MarkdownContent';

interface RichTextProps {
  data: ComponentText;
}

export function RichText({ data }: RichTextProps) {
  if (!data.text) return null;

  return (
    <MarkdownContent
      content={data.text}
      className="prose-headings:text-primary prose-a:text-primary-light prose-a:no-underline hover:prose-a:underline prose-blockquote:border-accent"
    />
  );
}
