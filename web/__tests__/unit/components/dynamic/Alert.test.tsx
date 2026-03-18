import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Alert } from '@/components/dynamic/Alert';
import type { ComponentAlert } from '@/lib/types';

describe('Alert component', () => {
  it('renders info variant with title and text', () => {
    const data: ComponentAlert = {
      id: 1,
      __component: 'components.alert',
      type: 'info',
      title: 'Information',
      text: 'Some info text',
    };
    const { container } = render(<Alert data={data} />);
    expect(screen.getByText('Information')).toBeInTheDocument();
    // text is rendered via MarkdownContent (dangerouslySetInnerHTML), check container
    expect(container.textContent).toContain('Some info text');
    expect(container.querySelector('.bg-blue-50')).not.toBeNull();
  });

  it('renders success variant', () => {
    const data: ComponentAlert = {
      id: 2,
      __component: 'components.alert',
      type: 'success',
      title: 'Success!',
      text: null,
    };
    const { container } = render(<Alert data={data} />);
    expect(screen.getByText('Success!')).toBeInTheDocument();
    expect(container.querySelector('.bg-green-50')).not.toBeNull();
  });

  it('renders warning variant', () => {
    const data: ComponentAlert = {
      id: 3,
      __component: 'components.alert',
      type: 'warning',
      title: 'Warning',
      text: 'Be careful',
    };
    const { container } = render(<Alert data={data} />);
    expect(screen.getByText('Warning')).toBeInTheDocument();
    expect(container.querySelector('.bg-yellow-50')).not.toBeNull();
  });

  it('renders error variant', () => {
    const data: ComponentAlert = {
      id: 4,
      __component: 'components.alert',
      type: 'error',
      title: 'Error',
      text: 'Something went wrong',
    };
    const { container } = render(<Alert data={data} />);
    expect(screen.getByText('Error')).toBeInTheDocument();
    expect(container.querySelector('.bg-red-50')).not.toBeNull();
  });

  it('renders without title', () => {
    const data: ComponentAlert = {
      id: 5,
      __component: 'components.alert',
      type: 'info',
      title: null,
      text: 'Just a message',
    };
    const { container } = render(<Alert data={data} />);
    expect(container.textContent).toContain('Just a message');
    // Should not render a <p> with font-semibold for title
    expect(container.querySelector('.font-semibold')).toBeNull();
  });

  it('returns null when both title and text are null', () => {
    const data: ComponentAlert = {
      id: 6,
      __component: 'components.alert',
      type: 'info',
      title: null,
      text: null,
    };
    const { container } = render(<Alert data={data} />);
    expect(container.innerHTML).toBe('');
  });
});
