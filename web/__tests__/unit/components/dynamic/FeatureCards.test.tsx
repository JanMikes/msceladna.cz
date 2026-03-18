import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { FeatureCards } from '@/components/dynamic/FeatureCards';
import type { ComponentFeatureCards } from '@/lib/types';

describe('FeatureCards component', () => {
  it('renders cards in grid', () => {
    const data: ComponentFeatureCards = {
      id: 1,
      __component: 'components.feature-cards',
      columns: '3',
      card_clickable: false,
      cards: [
        { icon_type: 'hidden', icon: null, icon_text: null, title: 'Card 1', description: 'Desc 1', link: null },
        { icon_type: 'hidden', icon: null, icon_text: null, title: 'Card 2', description: 'Desc 2', link: null },
      ],
    };
    render(<FeatureCards data={data} />);
    expect(screen.getByText('Card 1')).toBeInTheDocument();
    expect(screen.getByText('Card 2')).toBeInTheDocument();
    expect(screen.getByText('Desc 1')).toBeInTheDocument();
    expect(screen.getByText('Desc 2')).toBeInTheDocument();
  });

  it('renders initials icon type', () => {
    const data: ComponentFeatureCards = {
      id: 2,
      __component: 'components.feature-cards',
      columns: '2',
      card_clickable: false,
      cards: [
        { icon_type: 'initials', icon: null, icon_text: null, title: 'Jan Novak', description: null, link: null },
      ],
    };
    render(<FeatureCards data={data} />);
    // Initials are extracted from title
    expect(screen.getByText('JN')).toBeInTheDocument();
  });

  it('renders text icon type', () => {
    const data: ComponentFeatureCards = {
      id: 3,
      __component: 'components.feature-cards',
      columns: '2',
      card_clickable: false,
      cards: [
        { icon_type: 'text', icon: null, icon_text: 'AB', title: 'Card Title', description: null, link: null },
      ],
    };
    render(<FeatureCards data={data} />);
    expect(screen.getByText('AB')).toBeInTheDocument();
  });

  it('renders with link', () => {
    const data: ComponentFeatureCards = {
      id: 4,
      __component: 'components.feature-cards',
      columns: '3',
      card_clickable: false,
      cards: [
        {
          icon_type: 'hidden',
          icon: null,
          icon_text: null,
          title: 'Linked Card',
          description: null,
          link: { href: '/about', external: false, text: 'Learn More', disabled: false },
        },
      ],
    };
    const { container } = render(<FeatureCards data={data} />);
    // When not card_clickable, the link text is shown
    expect(screen.getByText(/Learn More/)).toBeInTheDocument();
    // Card is wrapped in a Link (rendered as <a>)
    const link = container.querySelector('a');
    expect(link).not.toBeNull();
    expect(link!.getAttribute('href')).toBe('/about');
  });

  it('returns null when cards array is empty', () => {
    const data: ComponentFeatureCards = {
      id: 5,
      __component: 'components.feature-cards',
      columns: '3',
      card_clickable: false,
      cards: [],
    };
    const { container } = render(<FeatureCards data={data} />);
    expect(container.innerHTML).toBe('');
  });

  it('applies correct column classes', () => {
    const data: ComponentFeatureCards = {
      id: 6,
      __component: 'components.feature-cards',
      columns: '4',
      card_clickable: false,
      cards: [
        { icon_type: 'hidden', icon: null, icon_text: null, title: 'Card', description: null, link: null },
      ],
    };
    const { container } = render(<FeatureCards data={data} />);
    const grid = container.firstElementChild;
    expect(grid!.className).toContain('lg:grid-cols-4');
  });

  it('applies sidebar grid when sidebar prop is true', () => {
    const data: ComponentFeatureCards = {
      id: 7,
      __component: 'components.feature-cards',
      columns: '3',
      card_clickable: false,
      cards: [
        { icon_type: 'hidden', icon: null, icon_text: null, title: 'Card', description: null, link: null },
      ],
    };
    const { container } = render(<FeatureCards data={data} sidebar />);
    const grid = container.firstElementChild;
    expect(grid!.className).toContain('grid-cols-1');
    expect(grid!.className).not.toContain('sm:grid-cols-2');
  });
});
