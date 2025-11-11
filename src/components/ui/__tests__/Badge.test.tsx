import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '../../../test/test-utils';
import { Badge } from '../Badge';

describe('Badge', () => {
  it('renders children correctly', () => {
    render(<Badge>Test Badge</Badge>);

    expect(screen.getByText('Test Badge')).toBeInTheDocument();
  });

  it('renders as span element', () => {
    const { container } = render(<Badge>Badge</Badge>);
    const badge = container.querySelector('span');

    expect(badge).toBeInTheDocument();
    expect(badge).toHaveTextContent('Badge');
  });

  it('applies base classes', () => {
    const { container } = render(<Badge>Badge</Badge>);
    const badge = container.firstChild as HTMLElement;

    expect(badge).toHaveClass('inline-flex');
    expect(badge).toHaveClass('items-center');
    expect(badge).toHaveClass('px-2.5');
    expect(badge).toHaveClass('py-0.5');
    expect(badge).toHaveClass('rounded-full');
    expect(badge).toHaveClass('text-xs');
    expect(badge).toHaveClass('font-medium');
    expect(badge).toHaveClass('border');
  });

  it('applies default variant classes by default', () => {
    const { container } = render(<Badge>Badge</Badge>);
    const badge = container.firstChild as HTMLElement;

    expect(badge).toHaveClass('bg-gray-100');
    expect(badge).toHaveClass('text-gray-800');
    expect(badge).toHaveClass('border-gray-300');
  });

  it('applies default variant classes when variant="default"', () => {
    const { container } = render(<Badge variant="default">Badge</Badge>);
    const badge = container.firstChild as HTMLElement;

    expect(badge).toHaveClass('bg-gray-100');
    expect(badge).toHaveClass('text-gray-800');
    expect(badge).toHaveClass('border-gray-300');
  });

  it('applies custom className', () => {
    const { container } = render(<Badge className="custom-badge">Badge</Badge>);
    const badge = container.firstChild as HTMLElement;

    expect(badge).toHaveClass('custom-badge');
    expect(badge).toHaveClass('inline-flex'); // base class still applied
  });

  describe('State Variant', () => {
    it('applies DRAFT state colors', () => {
      const { container } = render(
        <Badge variant="state" state="DRAFT">
          Draft
        </Badge>
      );
      const badge = container.firstChild as HTMLElement;

      expect(badge).toHaveClass('bg-gray-100');
      expect(badge).toHaveClass('text-gray-800');
      expect(badge).toHaveClass('border-gray-300');
    });

    it('applies SUBMITTED state colors', () => {
      const { container } = render(
        <Badge variant="state" state="SUBMITTED">
          Submitted
        </Badge>
      );
      const badge = container.firstChild as HTMLElement;

      expect(badge).toHaveClass('bg-yellow-100');
      expect(badge).toHaveClass('text-yellow-800');
      expect(badge).toHaveClass('border-yellow-300');
    });

    it('applies APPROVED state colors', () => {
      const { container } = render(
        <Badge variant="state" state="APPROVED">
          Approved
        </Badge>
      );
      const badge = container.firstChild as HTMLElement;

      expect(badge).toHaveClass('bg-yellow-100');
      expect(badge).toHaveClass('text-yellow-800');
      expect(badge).toHaveClass('border-yellow-300');
    });

    it('applies ACTIVE state colors', () => {
      const { container } = render(
        <Badge variant="state" state="ACTIVE">
          Active
        </Badge>
      );
      const badge = container.firstChild as HTMLElement;

      expect(badge).toHaveClass('bg-green-100');
      expect(badge).toHaveClass('text-green-800');
      expect(badge).toHaveClass('border-green-300');
    });

    it('applies OUTDATED state colors', () => {
      const { container } = render(
        <Badge variant="state" state="OUTDATED">
          Outdated
        </Badge>
      );
      const badge = container.firstChild as HTMLElement;

      expect(badge).toHaveClass('bg-red-100');
      expect(badge).toHaveClass('text-red-800');
      expect(badge).toHaveClass('border-red-300');
    });

    it('applies default colors for unknown state', () => {
      const { container } = render(
        <Badge variant="state" state="UNKNOWN">
          Unknown
        </Badge>
      );
      const badge = container.firstChild as HTMLElement;

      expect(badge).toHaveClass('bg-gray-100');
      expect(badge).toHaveClass('text-gray-800');
      expect(badge).toHaveClass('border-gray-300');
    });

    it('applies default colors when state is not provided', () => {
      const { container } = render(<Badge variant="state">No State</Badge>);
      const badge = container.firstChild as HTMLElement;

      expect(badge).toHaveClass('bg-gray-100');
      expect(badge).toHaveClass('text-gray-800');
      expect(badge).toHaveClass('border-gray-300');
    });
  });

  describe('Edge Cases', () => {
    it('renders with empty string state', () => {
      const { container } = render(
        <Badge variant="state" state="">
          Empty
        </Badge>
      );
      const badge = container.firstChild as HTMLElement;

      // Should use default colors
      expect(badge).toHaveClass('bg-gray-100');
      expect(screen.getByText('Empty')).toBeInTheDocument();
    });

    it('renders with custom className and state variant', () => {
      const { container } = render(
        <Badge variant="state" state="ACTIVE" className="ml-2">
          Custom Active
        </Badge>
      );
      const badge = container.firstChild as HTMLElement;

      expect(badge).toHaveClass('ml-2');
      expect(badge).toHaveClass('bg-green-100');
      expect(badge).toHaveClass('text-green-800');
    });

    it('renders complex children', () => {
      render(
        <Badge>
          <span>Icon</span> Badge Text
        </Badge>
      );

      expect(screen.getByText('Icon')).toBeInTheDocument();
      expect(screen.getByText('Badge Text', { exact: false })).toBeInTheDocument();
    });

    it('renders with numeric children', () => {
      render(<Badge>{42}</Badge>);

      expect(screen.getByText('42')).toBeInTheDocument();
    });

    it('renders with mixed content', () => {
      render(
        <Badge variant="state" state="DRAFT">
          <svg className="w-3 h-3">
            <circle />
          </svg>
          Draft Status
        </Badge>
      );

      expect(screen.getByText('Draft Status', { exact: false })).toBeInTheDocument();
    });
  });

  describe('Integration with Document States', () => {
    it('renders correctly for draft document', () => {
      render(
        <Badge variant="state" state="DRAFT">
          DRAFT
        </Badge>
      );

      const badge = screen.getByText('DRAFT');
      expect(badge).toBeInTheDocument();
      expect(badge).toHaveClass('bg-gray-100');
    });

    it('renders correctly for submitted document', () => {
      render(
        <Badge variant="state" state="SUBMITTED">
          SUBMITTED
        </Badge>
      );

      const badge = screen.getByText('SUBMITTED');
      expect(badge).toBeInTheDocument();
      expect(badge).toHaveClass('bg-yellow-100');
    });

    it('renders correctly for active document', () => {
      render(
        <Badge variant="state" state="ACTIVE">
          ACTIVE
        </Badge>
      );

      const badge = screen.getByText('ACTIVE');
      expect(badge).toBeInTheDocument();
      expect(badge).toHaveClass('bg-green-100');
    });

    it('renders multiple badges with different states', () => {
      const { container } = render(
        <div>
          <Badge variant="state" state="DRAFT">
            Draft
          </Badge>
          <Badge variant="state" state="ACTIVE">
            Active
          </Badge>
          <Badge variant="state" state="OUTDATED">
            Outdated
          </Badge>
        </div>
      );

      expect(screen.getByText('Draft')).toBeInTheDocument();
      expect(screen.getByText('Active')).toBeInTheDocument();
      expect(screen.getByText('Outdated')).toBeInTheDocument();

      const badges = container.querySelectorAll('span');
      expect(badges).toHaveLength(3);
    });
  });

  describe('Case Sensitivity', () => {
    it('handles lowercase state names', () => {
      const { container } = render(
        <Badge variant="state" state="active">
          Active
        </Badge>
      );
      const badge = container.firstChild as HTMLElement;

      // Should use default colors as getStateColor is case-sensitive
      expect(badge).toHaveClass('bg-gray-100');
    });

    it('handles mixed case state names', () => {
      const { container } = render(
        <Badge variant="state" state="Draft">
          Draft
        </Badge>
      );
      const badge = container.firstChild as HTMLElement;

      // Should use default colors as getStateColor expects uppercase
      expect(badge).toHaveClass('bg-gray-100');
    });

    it('requires exact uppercase match for state colors', () => {
      const { container } = render(
        <Badge variant="state" state="DRAFT">
          DRAFT
        </Badge>
      );
      const badge = container.firstChild as HTMLElement;

      expect(badge).toHaveClass('bg-gray-100');
      expect(badge).toHaveClass('text-gray-800');
    });
  });
});
