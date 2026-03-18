import { describe, it, expect } from 'vitest';
import { markdownToHtml, stripMarkdown } from '@/lib/markdown';
import { config } from '@/lib/config';

describe('markdownToHtml', () => {
  it('renders bold text', () => {
    const result = markdownToHtml('**bold text**');
    expect(result).toContain('<strong>bold text</strong>');
  });

  it('renders italic text', () => {
    const result = markdownToHtml('*italic text*');
    expect(result).toContain('<em>italic text</em>');
  });

  it('renders links', () => {
    const result = markdownToHtml('[link](https://example.com)');
    expect(result).toContain('<a href="https://example.com">link</a>');
  });

  it('renders unordered lists', () => {
    const result = markdownToHtml('- item 1\n- item 2');
    expect(result).toContain('<ul>');
    expect(result).toContain('<li>item 1</li>');
    expect(result).toContain('<li>item 2</li>');
  });

  it('renders ordered lists', () => {
    const result = markdownToHtml('1. first\n2. second');
    expect(result).toContain('<ol>');
    expect(result).toContain('<li>first</li>');
    expect(result).toContain('<li>second</li>');
  });

  it('handles empty string', () => {
    const result = markdownToHtml('');
    expect(result).toBe('');
  });

  it('transforms /uploads/ URLs in content', () => {
    const result = markdownToHtml('![photo](/uploads/photo.jpg)');
    expect(result).toContain(`${config.publicUploadsUrl}/uploads/photo.jpg`);
  });

  it('renders headings', () => {
    const result = markdownToHtml('## Heading 2');
    expect(result).toContain('<h2');
    expect(result).toContain('Heading 2');
  });

  it('renders line breaks (breaks: true)', () => {
    const result = markdownToHtml('line1\nline2');
    expect(result).toContain('<br');
  });
});

describe('stripMarkdown', () => {
  it('strips markdown formatting', () => {
    const result = stripMarkdown('**bold** and *italic*');
    expect(result).toBe('bold and italic');
  });

  it('strips links', () => {
    const result = stripMarkdown('[link](https://example.com)');
    expect(result).toBe('linkhttps://example.com');
  });

  it('collapses newlines to spaces', () => {
    const result = stripMarkdown('line1\n\nline2');
    expect(result).toBe('line1 line2');
  });

  it('trims whitespace', () => {
    const result = stripMarkdown('  hello  ');
    expect(result).toBe('hello');
  });
});
