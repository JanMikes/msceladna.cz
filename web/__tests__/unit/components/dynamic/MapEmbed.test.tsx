import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { MapEmbed } from '@/components/dynamic/MapEmbed';
import type { ComponentMap } from '@/lib/types';

describe('MapEmbed component', () => {
  it('renders iframe with embedUrl', () => {
    const data: ComponentMap = {
      id: 1,
      __component: 'components.map',
      embedUrl: 'https://maps.google.com/embed?q=1',
      height: 400,
    };
    const { container } = render(<MapEmbed data={data} />);
    const iframe = container.querySelector('iframe');
    expect(iframe).not.toBeNull();
    expect(iframe!.getAttribute('src')).toBe('https://maps.google.com/embed?q=1');
    expect(iframe!.getAttribute('title')).toBe('Mapa');
  });

  it('uses custom height', () => {
    const data: ComponentMap = {
      id: 2,
      __component: 'components.map',
      embedUrl: 'https://maps.google.com/embed?q=1',
      height: 600,
    };
    const { container } = render(<MapEmbed data={data} />);
    const wrapper = container.firstElementChild as HTMLElement;
    expect(wrapper.style.height).toBe('600px');
  });

  it('returns null when embedUrl is null', () => {
    const data: ComponentMap = {
      id: 3,
      __component: 'components.map',
      embedUrl: null,
      height: 400,
    };
    const { container } = render(<MapEmbed data={data} />);
    expect(container.innerHTML).toBe('');
  });
});
