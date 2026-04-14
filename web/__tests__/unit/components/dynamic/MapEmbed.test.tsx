import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { MapEmbed } from '@/components/dynamic/MapEmbed';
import type { ComponentMap } from '@/lib/types';

async function renderAsync(element: Promise<React.ReactElement>) {
  return render(await element);
}

describe('MapEmbed component', () => {
  it('passes through an embed URL as-is', async () => {
    const data: ComponentMap = {
      id: 1,
      __component: 'components.map',
      url: 'https://www.google.com/maps/embed?pb=!1m18!1m12',
      height: 400,
    };
    const { container } = await renderAsync(MapEmbed({ data }) as Promise<React.ReactElement>);
    const iframe = container.querySelector('iframe');
    expect(iframe).not.toBeNull();
    expect(iframe!.getAttribute('src')).toBe('https://www.google.com/maps/embed?pb=!1m18!1m12');
    expect(iframe!.getAttribute('title')).toBe('Mapa');
  });

  it('converts a place URL with @lat,lng into an embed URL', async () => {
    const data: ComponentMap = {
      id: 2,
      __component: 'components.map',
      url: 'https://www.google.com/maps/place/M%C5%A1+Celadn%C3%A1/@49.5432,18.3876,17z/data=!3m1',
      height: 600,
    };
    const { container } = await renderAsync(MapEmbed({ data }) as Promise<React.ReactElement>);
    const iframe = container.querySelector('iframe');
    expect(iframe).not.toBeNull();
    expect(iframe!.getAttribute('src')).toBe(
      'https://maps.google.com/maps?q=49.5432,18.3876&z=17&output=embed',
    );
    const wrapper = container.firstElementChild as HTMLElement;
    expect(wrapper.style.height).toBe('600px');
  });

  it('returns null when url is null', async () => {
    const data: ComponentMap = {
      id: 3,
      __component: 'components.map',
      url: null,
      height: 400,
    };
    const { container } = await renderAsync(MapEmbed({ data }) as Promise<React.ReactElement>);
    expect(container.innerHTML).toBe('');
  });
});
