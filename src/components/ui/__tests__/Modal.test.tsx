import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { Modal } from '../Modal';

describe('Modal', () => {
  const mockOnClose = vi.fn();
  const defaultProps = {
    isOpen: true,
    onClose: mockOnClose,
    title: 'Test Modal',
    children: <div>Modal content</div>,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    document.body.style.overflow = 'unset';
  });

  it('renders when open', () => {
    render(<Modal {...defaultProps} />);
    expect(screen.getByText('Test Modal')).toBeInTheDocument();
    expect(screen.getByText('Modal content')).toBeInTheDocument();
  });

  it('does not render when closed', () => {
    render(<Modal {...defaultProps} isOpen={false} />);
    expect(screen.queryByText('Test Modal')).not.toBeInTheDocument();
  });

  it('calls onClose when close button clicked', () => {
    render(<Modal {...defaultProps} />);
    const closeButton = screen.getByRole('button');
    fireEvent.click(closeButton);
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when backdrop clicked', () => {
    render(<Modal {...defaultProps} />);
    const backdrop = document.querySelector('[aria-hidden="true"]');
    fireEvent.click(backdrop!);
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when Escape pressed', () => {
    render(<Modal {...defaultProps} />);
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('does not call onClose for other keys', () => {
    render(<Modal {...defaultProps} />);
    fireEvent.keyDown(document, { key: 'Enter' });
    expect(mockOnClose).not.toHaveBeenCalled();
  });

  it('sets body overflow hidden when open', () => {
    render(<Modal {...defaultProps} />);
    expect(document.body.style.overflow).toBe('hidden');
  });

  it('resets body overflow when closed', () => {
    const { rerender } = render(<Modal {...defaultProps} />);
    rerender(<Modal {...defaultProps} isOpen={false} />);
    expect(document.body.style.overflow).toBe('unset');
  });

  it('applies sm maxWidth', () => {
    const { container } = render(<Modal {...defaultProps} maxWidth="sm" />);
    expect(container.querySelector('.max-w-sm')).toBeInTheDocument();
  });

  it('applies md maxWidth', () => {
    const { container } = render(<Modal {...defaultProps} maxWidth="md" />);
    expect(container.querySelector('.max-w-md')).toBeInTheDocument();
  });

  it('applies lg maxWidth by default', () => {
    const { container } = render(<Modal {...defaultProps} />);
    expect(container.querySelector('.max-w-lg')).toBeInTheDocument();
  });

  it('applies xl maxWidth', () => {
    const { container } = render(<Modal {...defaultProps} maxWidth="xl" />);
    expect(container.querySelector('.max-w-xl')).toBeInTheDocument();
  });

  it('applies 2xl maxWidth', () => {
    const { container } = render(<Modal {...defaultProps} maxWidth="2xl" />);
    expect(container.querySelector('.max-w-2xl')).toBeInTheDocument();
  });

  it('cleans up event listener on unmount', () => {
    const { unmount } = render(<Modal {...defaultProps} />);
    unmount();
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(mockOnClose).not.toHaveBeenCalled();
  });

  it('adds event listener only when open', () => {
    const { rerender } = render(<Modal {...defaultProps} isOpen={false} />);
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(mockOnClose).not.toHaveBeenCalled();

    rerender(<Modal {...defaultProps} isOpen={true} />);
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });
});
