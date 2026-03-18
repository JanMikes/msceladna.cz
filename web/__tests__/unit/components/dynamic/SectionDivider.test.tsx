import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { SectionDivider } from '@/components/dynamic/SectionDivider';
import type { ComponentSectionDivider } from '@/lib/types';

describe('SectionDivider component', () => {
  it('renders hr element', () => {
    const data: ComponentSectionDivider = {
      id: 1,
      __component: 'components.section-divider',
      spacing: 'M',
      style: 'solid',
    };
    const { container } = render(<SectionDivider data={data} />);
    const hr = container.querySelector('hr');
    expect(hr).not.toBeNull();
  });

  it('renders small spacing', () => {
    const data: ComponentSectionDivider = {
      id: 2,
      __component: 'components.section-divider',
      spacing: 'S',
      style: 'solid',
    };
    const { container } = render(<SectionDivider data={data} />);
    const hr = container.querySelector('hr');
    expect(hr!.className).toContain('my-4');
  });

  it('renders medium spacing', () => {
    const data: ComponentSectionDivider = {
      id: 3,
      __component: 'components.section-divider',
      spacing: 'M',
      style: 'solid',
    };
    const { container } = render(<SectionDivider data={data} />);
    const hr = container.querySelector('hr');
    expect(hr!.className).toContain('my-8');
  });

  it('renders large spacing', () => {
    const data: ComponentSectionDivider = {
      id: 4,
      __component: 'components.section-divider',
      spacing: 'L',
      style: 'solid',
    };
    const { container } = render(<SectionDivider data={data} />);
    const hr = container.querySelector('hr');
    expect(hr!.className).toContain('my-12');
  });

  it('renders solid border style', () => {
    const data: ComponentSectionDivider = {
      id: 5,
      __component: 'components.section-divider',
      spacing: 'M',
      style: 'solid',
    };
    const { container } = render(<SectionDivider data={data} />);
    const hr = container.querySelector('hr');
    expect(hr!.className).toContain('border-solid');
  });

  it('renders dashed border style', () => {
    const data: ComponentSectionDivider = {
      id: 6,
      __component: 'components.section-divider',
      spacing: 'M',
      style: 'dashed',
    };
    const { container } = render(<SectionDivider data={data} />);
    const hr = container.querySelector('hr');
    expect(hr!.className).toContain('border-dashed');
  });

  it('renders dotted border style', () => {
    const data: ComponentSectionDivider = {
      id: 7,
      __component: 'components.section-divider',
      spacing: 'M',
      style: 'dotted',
    };
    const { container } = render(<SectionDivider data={data} />);
    const hr = container.querySelector('hr');
    expect(hr!.className).toContain('border-dotted');
  });
});
