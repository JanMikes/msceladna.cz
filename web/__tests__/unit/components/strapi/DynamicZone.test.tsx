import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { DynamicZone } from '@/components/strapi/DynamicZone';
import type { DynamicZoneComponent, ComponentHeading, ComponentSectionDivider, ComponentAlert } from '@/lib/types';

// Mock async EmployeeCards since it uses server-side data fetching
vi.mock('@/lib/strapi/data', () => ({
  getEmployees: vi.fn().mockResolvedValue([]),
}));

describe('DynamicZone component', () => {
  it('renders multiple components', () => {
    const components: DynamicZoneComponent[] = [
      {
        id: 1,
        __component: 'components.heading',
        text: 'First Heading',
        type: 'h2',
        anchor: null,
      } as ComponentHeading,
      {
        id: 2,
        __component: 'components.section-divider',
        spacing: 'M',
        style: 'solid',
      } as ComponentSectionDivider,
    ];

    const { container } = render(<DynamicZone components={components} />);
    expect(screen.getByText('First Heading')).toBeInTheDocument();
    expect(container.querySelector('hr')).not.toBeNull();
  });

  it('returns null for empty array', () => {
    const { container } = render(<DynamicZone components={[]} />);
    expect(container.innerHTML).toBe('');
  });

  it('returns null for null components', () => {
    const { container } = render(<DynamicZone components={null as unknown as DynamicZoneComponent[]} />);
    expect(container.innerHTML).toBe('');
  });

  it('renders alert component correctly', () => {
    const components: DynamicZoneComponent[] = [
      {
        id: 3,
        __component: 'components.alert',
        type: 'info',
        title: 'Important Notice',
        text: 'Read this',
      } as ComponentAlert,
    ];

    render(<DynamicZone components={components} />);
    expect(screen.getByText('Important Notice')).toBeInTheDocument();
  });
});
