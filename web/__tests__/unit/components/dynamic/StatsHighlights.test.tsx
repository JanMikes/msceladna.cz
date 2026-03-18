import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { StatsHighlights } from '@/components/dynamic/StatsHighlights';
import type { ComponentStatsHighlights } from '@/lib/types';

describe('StatsHighlights component', () => {
  it('renders stat items', () => {
    const data: ComponentStatsHighlights = {
      id: 1,
      __component: 'components.stats-highlights',
      columns: '3',
      items: [
        { number: '150', title: 'Children', description: 'enrolled' },
        { number: '12', title: 'Teachers', description: 'qualified' },
      ],
    };
    render(<StatsHighlights data={data} />);
    expect(screen.getByText('150')).toBeInTheDocument();
    expect(screen.getByText('Children')).toBeInTheDocument();
    expect(screen.getByText('enrolled')).toBeInTheDocument();
    expect(screen.getByText('12')).toBeInTheDocument();
    expect(screen.getByText('Teachers')).toBeInTheDocument();
  });

  it('returns null when items array is empty', () => {
    const data: ComponentStatsHighlights = {
      id: 2,
      __component: 'components.stats-highlights',
      columns: '4',
      items: [],
    };
    const { container } = render(<StatsHighlights data={data} />);
    expect(container.innerHTML).toBe('');
  });

  it('applies correct column classes', () => {
    const data: ComponentStatsHighlights = {
      id: 3,
      __component: 'components.stats-highlights',
      columns: '2',
      items: [
        { number: '42', title: 'Stat', description: null },
      ],
    };
    const { container } = render(<StatsHighlights data={data} />);
    const grid = container.firstElementChild;
    expect(grid!.className).toContain('sm:grid-cols-2');
  });
});
