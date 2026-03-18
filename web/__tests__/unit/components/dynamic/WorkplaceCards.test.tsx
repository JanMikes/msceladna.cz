import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { WorkplaceCards } from '@/components/dynamic/WorkplaceCards';
import type { ComponentWorkplaceCards } from '@/lib/types';

describe('WorkplaceCards component', () => {
  it('renders workplace tiles', () => {
    const data: ComponentWorkplaceCards = {
      id: 1,
      __component: 'components.workplace-cards',
      workplaces: [
        {
          name: 'MŠ Pod Hůrkou',
          slug: 'pod-hurkou',
          image: null,
          description: 'A nice kindergarten',
        },
        {
          name: 'MŠ U Školky',
          slug: 'u-skolky',
          image: null,
          description: null,
        },
      ],
    };
    render(<WorkplaceCards data={data} />);
    expect(screen.getByText('MŠ Pod Hůrkou')).toBeInTheDocument();
    expect(screen.getByText('MŠ U Školky')).toBeInTheDocument();
    expect(screen.getByText('A nice kindergarten')).toBeInTheDocument();
  });

  it('renders links to workplace pages', () => {
    const data: ComponentWorkplaceCards = {
      id: 2,
      __component: 'components.workplace-cards',
      workplaces: [
        {
          name: 'MŠ Pod Hůrkou',
          slug: 'pod-hurkou',
          image: null,
          description: null,
        },
      ],
    };
    const { container } = render(<WorkplaceCards data={data} />);
    const link = container.querySelector('a');
    expect(link).not.toBeNull();
    expect(link!.getAttribute('href')).toBe('/pod-hurkou');
  });

  it('renders fallback content when no image', () => {
    const data: ComponentWorkplaceCards = {
      id: 3,
      __component: 'components.workplace-cards',
      workplaces: [
        {
          name: 'No Image WP',
          slug: 'no-image',
          image: null,
          description: 'Description here',
        },
      ],
    };
    const { container } = render(<WorkplaceCards data={data} />);
    // Without image, it renders a div with bg-primary
    expect(container.querySelector('.bg-primary')).not.toBeNull();
  });

  it('returns null when workplaces array is empty', () => {
    const data: ComponentWorkplaceCards = {
      id: 4,
      __component: 'components.workplace-cards',
      workplaces: [],
    };
    const { container } = render(<WorkplaceCards data={data} />);
    expect(container.innerHTML).toBe('');
  });
});
