import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Heading } from '@/components/dynamic/Heading';
import type { ComponentHeading } from '@/lib/types';

describe('Heading component', () => {
  it('renders h2 by default', () => {
    const data: ComponentHeading = {
      id: 1,
      __component: 'components.heading',
      text: 'Default Heading',
      type: 'h2',
      anchor: null,
    };
    render(<Heading data={data} />);
    const heading = screen.getByText('Default Heading');
    expect(heading.tagName).toBe('H2');
    expect(heading.className).toContain('heading-accent');
    expect(heading.className).toContain('text-2xl');
  });

  it('renders h3 with correct size class', () => {
    const data: ComponentHeading = {
      id: 2,
      __component: 'components.heading',
      text: 'H3 Heading',
      type: 'h3',
      anchor: null,
    };
    render(<Heading data={data} />);
    const heading = screen.getByText('H3 Heading');
    expect(heading.tagName).toBe('H3');
    expect(heading.className).toContain('text-xl');
  });

  it('renders h4 with correct size class', () => {
    const data: ComponentHeading = {
      id: 3,
      __component: 'components.heading',
      text: 'H4 Heading',
      type: 'h4',
      anchor: null,
    };
    render(<Heading data={data} />);
    const heading = screen.getByText('H4 Heading');
    expect(heading.tagName).toBe('H4');
    expect(heading.className).toContain('text-lg');
  });

  it('renders with anchor id', () => {
    const data: ComponentHeading = {
      id: 4,
      __component: 'components.heading',
      text: 'Anchored',
      type: 'h2',
      anchor: 'my-section',
    };
    render(<Heading data={data} />);
    const heading = screen.getByText('Anchored');
    expect(heading.id).toBe('my-section');
  });

  it('does not set id attribute when anchor is null', () => {
    const data: ComponentHeading = {
      id: 5,
      __component: 'components.heading',
      text: 'No Anchor',
      type: 'h2',
      anchor: null,
    };
    render(<Heading data={data} />);
    const heading = screen.getByText('No Anchor');
    expect(heading.id).toBe('');
  });

  it('returns null when text is null', () => {
    const data: ComponentHeading = {
      id: 6,
      __component: 'components.heading',
      text: null,
      type: 'h2',
      anchor: null,
    };
    const { container } = render(<Heading data={data} />);
    expect(container.innerHTML).toBe('');
  });
});
