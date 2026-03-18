import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Badges } from '@/components/dynamic/Badges';
import type { ComponentBadges } from '@/lib/types';

describe('Badges component', () => {
  it('renders all badge labels', () => {
    const data: ComponentBadges = {
      id: 1,
      __component: 'components.badges',
      alignment: 'L',
      badges: [
        { label: 'New', variant: 'primary', size: 'M' },
        { label: 'Updated', variant: 'success', size: 'M' },
        { label: 'Deprecated', variant: 'error', size: 'M' },
      ],
    };
    render(<Badges data={data} />);
    expect(screen.getByText('New')).toBeInTheDocument();
    expect(screen.getByText('Updated')).toBeInTheDocument();
    expect(screen.getByText('Deprecated')).toBeInTheDocument();
  });

  it('renders default variant styling', () => {
    const data: ComponentBadges = {
      id: 2,
      __component: 'components.badges',
      alignment: 'L',
      badges: [
        { label: 'Default', variant: 'default', size: 'M' },
      ],
    };
    const { container } = render(<Badges data={data} />);
    const badge = container.querySelector('span');
    expect(badge!.className).toContain('bg-gray-100');
    expect(badge!.className).toContain('text-gray-700');
  });

  it('renders primary variant styling', () => {
    const data: ComponentBadges = {
      id: 3,
      __component: 'components.badges',
      alignment: 'L',
      badges: [
        { label: 'Primary', variant: 'primary', size: 'M' },
      ],
    };
    const { container } = render(<Badges data={data} />);
    const badge = container.querySelector('span');
    expect(badge!.className).toContain('bg-primary/10');
  });

  it('renders small size', () => {
    const data: ComponentBadges = {
      id: 4,
      __component: 'components.badges',
      alignment: 'L',
      badges: [
        { label: 'Small', variant: 'default', size: 'S' },
      ],
    };
    const { container } = render(<Badges data={data} />);
    const badge = container.querySelector('span');
    expect(badge!.className).toContain('px-2');
    expect(badge!.className).toContain('text-xs');
  });

  it('renders large size', () => {
    const data: ComponentBadges = {
      id: 5,
      __component: 'components.badges',
      alignment: 'L',
      badges: [
        { label: 'Large', variant: 'default', size: 'L' },
      ],
    };
    const { container } = render(<Badges data={data} />);
    const badge = container.querySelector('span');
    expect(badge!.className).toContain('px-4');
    expect(badge!.className).toContain('text-base');
  });

  it('renders center alignment', () => {
    const data: ComponentBadges = {
      id: 6,
      __component: 'components.badges',
      alignment: 'C',
      badges: [
        { label: 'Center', variant: 'default', size: 'M' },
      ],
    };
    const { container } = render(<Badges data={data} />);
    const wrapper = container.firstElementChild;
    expect(wrapper!.className).toContain('justify-center');
  });

  it('renders right alignment', () => {
    const data: ComponentBadges = {
      id: 7,
      __component: 'components.badges',
      alignment: 'R',
      badges: [
        { label: 'Right', variant: 'default', size: 'M' },
      ],
    };
    const { container } = render(<Badges data={data} />);
    const wrapper = container.firstElementChild;
    expect(wrapper!.className).toContain('justify-end');
  });

  it('returns null when badges array is empty', () => {
    const data: ComponentBadges = {
      id: 8,
      __component: 'components.badges',
      alignment: 'L',
      badges: [],
    };
    const { container } = render(<Badges data={data} />);
    expect(container.innerHTML).toBe('');
  });

  it('renders warning and accent variants', () => {
    const data: ComponentBadges = {
      id: 9,
      __component: 'components.badges',
      alignment: 'L',
      badges: [
        { label: 'Warning', variant: 'warning', size: 'M' },
        { label: 'Accent', variant: 'accent', size: 'M' },
      ],
    };
    const { container } = render(<Badges data={data} />);
    const badges = container.querySelectorAll('span');
    expect(badges[0].className).toContain('bg-yellow-100');
    expect(badges[1].className).toContain('bg-accent/15');
  });
});
