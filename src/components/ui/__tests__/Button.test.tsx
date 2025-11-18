import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '../../../test/test-utils';
import { Button } from '../Button';

describe('Button', () => {
  describe('Basic Rendering', () => {
    it('renders children correctly', () => {
      render(<Button>Click Me</Button>);
      expect(screen.getByText('Click Me')).toBeInTheDocument();
    });

    it('renders as button element', () => {
      const { container } = render(<Button>Button</Button>);
      const button = container.querySelector('button');
      expect(button).toBeInTheDocument();
      expect(button).toHaveTextContent('Button');
    });

    it('applies base classes', () => {
      const { container } = render(<Button>Button</Button>);
      const button = container.firstChild as HTMLElement;

      expect(button).toHaveClass('inline-flex');
      expect(button).toHaveClass('items-center');
      expect(button).toHaveClass('justify-center');
      expect(button).toHaveClass('font-medium');
      expect(button).toHaveClass('rounded-lg');
      expect(button).toHaveClass('transition-colors');
    });

    it('renders complex children', () => {
      render(
        <Button>
          <span>Icon</span> Button Text
        </Button>
      );
      expect(screen.getByText('Icon')).toBeInTheDocument();
      expect(screen.getByText('Button Text', { exact: false })).toBeInTheDocument();
    });
  });

  describe('Variant Styles', () => {
    it('applies primary variant classes by default', () => {
      const { container } = render(<Button>Button</Button>);
      const button = container.firstChild as HTMLElement;

      expect(button).toHaveClass('bg-primary-600');
      expect(button).toHaveClass('text-white');
      expect(button).toHaveClass('hover:bg-primary-700');
      expect(button).toHaveClass('focus:ring-primary-500');
    });

    it('applies primary variant classes when variant="primary"', () => {
      const { container } = render(<Button variant="primary">Button</Button>);
      const button = container.firstChild as HTMLElement;

      expect(button).toHaveClass('bg-primary-600');
      expect(button).toHaveClass('text-white');
    });

    it('applies secondary variant classes', () => {
      const { container } = render(<Button variant="secondary">Button</Button>);
      const button = container.firstChild as HTMLElement;

      expect(button).toHaveClass('bg-gray-100');
      expect(button).toHaveClass('text-gray-900');
      expect(button).toHaveClass('hover:bg-gray-200');
      expect(button).toHaveClass('focus:ring-gray-500');
    });

    it('applies danger variant classes', () => {
      const { container } = render(<Button variant="danger">Delete</Button>);
      const button = container.firstChild as HTMLElement;

      expect(button).toHaveClass('bg-red-600');
      expect(button).toHaveClass('text-white');
      expect(button).toHaveClass('hover:bg-red-700');
      expect(button).toHaveClass('focus:ring-red-500');
    });

    it('applies ghost variant classes', () => {
      const { container } = render(<Button variant="ghost">Cancel</Button>);
      const button = container.firstChild as HTMLElement;

      expect(button).toHaveClass('text-gray-700');
      expect(button).toHaveClass('hover:bg-gray-50');
      expect(button).toHaveClass('focus:ring-gray-500');
    });
  });

  describe('Size Styles', () => {
    it('applies medium size classes by default', () => {
      const { container } = render(<Button>Button</Button>);
      const button = container.firstChild as HTMLElement;

      expect(button).toHaveClass('px-4');
      expect(button).toHaveClass('py-2');
      expect(button).toHaveClass('text-sm');
    });

    it('applies small size classes', () => {
      const { container } = render(<Button size="sm">Button</Button>);
      const button = container.firstChild as HTMLElement;

      expect(button).toHaveClass('px-3');
      expect(button).toHaveClass('py-1.5');
      expect(button).toHaveClass('text-sm');
    });

    it('applies medium size classes when size="md"', () => {
      const { container } = render(<Button size="md">Button</Button>);
      const button = container.firstChild as HTMLElement;

      expect(button).toHaveClass('px-4');
      expect(button).toHaveClass('py-2');
      expect(button).toHaveClass('text-sm');
    });

    it('applies large size classes', () => {
      const { container } = render(<Button size="lg">Button</Button>);
      const button = container.firstChild as HTMLElement;

      expect(button).toHaveClass('px-6');
      expect(button).toHaveClass('py-3');
      expect(button).toHaveClass('text-base');
    });
  });

  describe('Loading State', () => {
    it('shows loading spinner when isLoading is true', () => {
      const { container } = render(<Button isLoading>Loading</Button>);
      const spinner = container.querySelector('svg.animate-spin');

      expect(spinner).toBeInTheDocument();
      expect(spinner).toHaveClass('w-4');
      expect(spinner).toHaveClass('h-4');
      expect(spinner).toHaveClass('mr-2');
    });

    it('does not show spinner when isLoading is false', () => {
      const { container } = render(<Button isLoading={false}>Not Loading</Button>);
      const spinner = container.querySelector('svg.animate-spin');

      expect(spinner).not.toBeInTheDocument();
    });

    it('disables button when isLoading is true', () => {
      render(<Button isLoading>Loading</Button>);
      const button = screen.getByText('Loading', { exact: false });

      expect(button).toBeDisabled();
    });

    it('still shows children when loading', () => {
      render(<Button isLoading>Submit</Button>);

      expect(screen.getByText('Submit')).toBeInTheDocument();
    });
  });

  describe('Disabled State', () => {
    it('applies disabled attribute when disabled is true', () => {
      render(<Button disabled>Disabled Button</Button>);
      const button = screen.getByText('Disabled Button');

      expect(button).toBeDisabled();
    });

    it('applies disabled opacity class', () => {
      const { container } = render(<Button disabled>Disabled</Button>);
      const button = container.firstChild as HTMLElement;

      expect(button).toHaveClass('disabled:opacity-50');
      expect(button).toHaveClass('disabled:cursor-not-allowed');
    });

    it('does not call onClick when disabled', () => {
      const handleClick = vi.fn();
      render(<Button disabled onClick={handleClick}>Disabled</Button>);

      const button = screen.getByText('Disabled');
      fireEvent.click(button);

      expect(handleClick).not.toHaveBeenCalled();
    });

    it('does not call onClick when isLoading', () => {
      const handleClick = vi.fn();
      render(<Button isLoading onClick={handleClick}>Loading</Button>);

      const button = screen.getByText('Loading', { exact: false });
      fireEvent.click(button);

      expect(handleClick).not.toHaveBeenCalled();
    });
  });

  describe('Event Handlers', () => {
    it('calls onClick when clicked', () => {
      const handleClick = vi.fn();
      render(<Button onClick={handleClick}>Click Me</Button>);

      const button = screen.getByText('Click Me');
      fireEvent.click(button);

      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('calls onClick multiple times', () => {
      const handleClick = vi.fn();
      render(<Button onClick={handleClick}>Click Me</Button>);

      const button = screen.getByText('Click Me');
      fireEvent.click(button);
      fireEvent.click(button);
      fireEvent.click(button);

      expect(handleClick).toHaveBeenCalledTimes(3);
    });

    it('supports onMouseEnter event', () => {
      const handleMouseEnter = vi.fn();
      render(<Button onMouseEnter={handleMouseEnter}>Hover Me</Button>);

      const button = screen.getByText('Hover Me');
      fireEvent.mouseEnter(button);

      expect(handleMouseEnter).toHaveBeenCalledTimes(1);
    });

    it('supports onFocus event', () => {
      const handleFocus = vi.fn();
      render(<Button onFocus={handleFocus}>Focus Me</Button>);

      const button = screen.getByText('Focus Me');
      fireEvent.focus(button);

      expect(handleFocus).toHaveBeenCalledTimes(1);
    });
  });

  describe('Custom Props', () => {
    it('applies custom className', () => {
      const { container } = render(<Button className="custom-class">Button</Button>);
      const button = container.firstChild as HTMLElement;

      expect(button).toHaveClass('custom-class');
      expect(button).toHaveClass('inline-flex'); // base class still applied
    });

    it('forwards type attribute', () => {
      render(<Button type="submit">Submit</Button>);
      const button = screen.getByText('Submit');

      expect(button).toHaveAttribute('type', 'submit');
    });

    it('forwards aria attributes', () => {
      render(<Button aria-label="Close dialog">X</Button>);
      const button = screen.getByText('X');

      expect(button).toHaveAttribute('aria-label', 'Close dialog');
    });

    it('forwards data attributes', () => {
      render(<Button data-testid="custom-button">Button</Button>);

      expect(screen.getByTestId('custom-button')).toBeInTheDocument();
    });
  });

  describe('Combined States', () => {
    it('combines variant and size correctly', () => {
      const { container } = render(
        <Button variant="danger" size="lg">
          Delete
        </Button>
      );
      const button = container.firstChild as HTMLElement;

      expect(button).toHaveClass('bg-red-600');
      expect(button).toHaveClass('px-6');
      expect(button).toHaveClass('py-3');
    });

    it('combines all props correctly', () => {
      const handleClick = vi.fn();
      const { container } = render(
        <Button
          variant="secondary"
          size="sm"
          disabled
          className="ml-2"
          onClick={handleClick}
        >
          Small Secondary
        </Button>
      );
      const button = container.firstChild as HTMLElement;

      expect(button).toHaveClass('bg-gray-100');
      expect(button).toHaveClass('px-3');
      expect(button).toHaveClass('ml-2');
      expect(button).toBeDisabled();
    });

    it('renders loading state with custom variant and size', () => {
      const { container } = render(
        <Button variant="danger" size="lg" isLoading>
          Deleting...
        </Button>
      );
      const button = container.firstChild as HTMLElement;
      const spinner = container.querySelector('svg.animate-spin');

      expect(button).toHaveClass('bg-red-600');
      expect(button).toHaveClass('px-6');
      expect(spinner).toBeInTheDocument();
      expect(button).toBeDisabled();
    });
  });

  describe('Accessibility', () => {
    it('has correct role', () => {
      render(<Button>Button</Button>);

      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('can be found by accessible name', () => {
      render(<Button>Submit Form</Button>);

      expect(screen.getByRole('button', { name: 'Submit Form' })).toBeInTheDocument();
    });

    it('indicates disabled state to screen readers', () => {
      render(<Button disabled>Disabled</Button>);

      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('disabled');
    });

    it('supports keyboard navigation', () => {
      const handleClick = vi.fn();
      render(<Button onClick={handleClick}>Button</Button>);

      const button = screen.getByRole('button');
      button.focus();
      expect(button).toHaveFocus();
    });
  });
});
