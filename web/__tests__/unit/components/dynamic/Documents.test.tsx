import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Documents } from '@/components/dynamic/Documents';
import type { ComponentDocuments } from '@/lib/types';

describe('Documents component', () => {
  it('renders document list with download links', () => {
    const data: ComponentDocuments = {
      id: 1,
      __component: 'components.documents',
      columns: '3',
      documents: [
        {
          name: 'Annual Report',
          file: { url: 'https://cdn.example.com/report.pdf', alternativeText: null, width: 0, height: 0 },
        },
        {
          name: 'Budget',
          file: { url: 'https://cdn.example.com/budget.pdf', alternativeText: null, width: 0, height: 0 },
        },
      ],
    };
    const { container } = render(<Documents data={data} />);
    expect(screen.getByText('Annual Report')).toBeInTheDocument();
    expect(screen.getByText('Budget')).toBeInTheDocument();

    const links = container.querySelectorAll('a');
    expect(links).toHaveLength(2);
    expect(links[0].getAttribute('href')).toBe('https://cdn.example.com/report.pdf');
    expect(links[0].getAttribute('target')).toBe('_blank');
    expect(links[1].getAttribute('href')).toBe('https://cdn.example.com/budget.pdf');
  });

  it('renders default name "Dokument" when name is null', () => {
    const data: ComponentDocuments = {
      id: 2,
      __component: 'components.documents',
      columns: '1',
      documents: [
        {
          name: null,
          file: { url: 'https://cdn.example.com/file.pdf', alternativeText: null, width: 0, height: 0 },
        },
      ],
    };
    render(<Documents data={data} />);
    expect(screen.getByText('Dokument')).toBeInTheDocument();
  });

  it('returns null when documents array is empty', () => {
    const data: ComponentDocuments = {
      id: 3,
      __component: 'components.documents',
      columns: '3',
      documents: [],
    };
    const { container } = render(<Documents data={data} />);
    expect(container.innerHTML).toBe('');
  });

  it('applies correct column classes', () => {
    const data: ComponentDocuments = {
      id: 4,
      __component: 'components.documents',
      columns: '2',
      documents: [
        { name: 'Doc', file: { url: '#', alternativeText: null, width: 0, height: 0 } },
      ],
    };
    const { container } = render(<Documents data={data} />);
    const grid = container.firstElementChild;
    expect(grid!.className).toContain('sm:grid-cols-2');
  });

  it('applies sidebar grid when sidebar prop is true', () => {
    const data: ComponentDocuments = {
      id: 5,
      __component: 'components.documents',
      columns: '3',
      documents: [
        { name: 'Doc', file: { url: '#', alternativeText: null, width: 0, height: 0 } },
      ],
    };
    const { container } = render(<Documents data={data} sidebar />);
    const grid = container.firstElementChild;
    expect(grid!.className).toContain('grid-cols-1');
    expect(grid!.className).not.toContain('lg:grid-cols-3');
  });
});
