import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { WorkplaceCards } from '@/components/dynamic/WorkplaceCards';
import type { ComponentWorkplaceCards } from '@/lib/types';

const baseWorkplace = {
  image: null,
  icon_1: null,
  icon_2: null,
  icon_3: null,
  link: null,
};

describe('WorkplaceCards component', () => {
  it('renders workplace tiles', () => {
    const data: ComponentWorkplaceCards = {
      id: 1,
      __component: 'components.workplace-cards',
      style: '1' as const,
      workplaces: [
        { ...baseWorkplace, name: 'MŠ Pod Hůrkou', slug: 'pod-hurkou', description: 'A nice kindergarten' },
        { ...baseWorkplace, name: 'MŠ U Školky', slug: 'u-skolky', description: null },
      ],
    };
    render(<WorkplaceCards data={data} />);
    expect(screen.getByText('MŠ Pod Hůrkou')).toBeInTheDocument();
    expect(screen.getByText('MŠ U Školky')).toBeInTheDocument();
    expect(screen.getByText('A nice kindergarten')).toBeInTheDocument();
  });

  it('renders with style 1 bg-primary', () => {
    const data: ComponentWorkplaceCards = {
      id: 3,
      __component: 'components.workplace-cards',
      style: '1' as const,
      workplaces: [
        { ...baseWorkplace, name: 'Test', slug: 'test', description: 'Description here' },
      ],
    };
    const { container } = render(<WorkplaceCards data={data} />);
    expect(container.querySelector('.bg-primary')).not.toBeNull();
  });

  it('returns null when workplaces array is empty', () => {
    const data: ComponentWorkplaceCards = {
      id: 4,
      __component: 'components.workplace-cards',
      style: '1' as const,
      workplaces: [],
    };
    const { container } = render(<WorkplaceCards data={data} />);
    expect(container.innerHTML).toBe('');
  });
});
