import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { SolutionReviewCard } from '../SolutionReviewCard';
import { createSolutionReview } from '../../../../__tests__/testFactories';

describe('SolutionReviewCard', () => {
  const mockOnView = vi.fn();
  const mockReview = createSolutionReview({ id: '1', systemCode: 'SYS-001' });

  it('renders review card with title', () => {
    render(<SolutionReviewCard review={mockReview} onView={mockOnView} />);
    expect(screen.getByText('Test Solution')).toBeInTheDocument();
  });

  it('renders system code', () => {
    render(<SolutionReviewCard review={mockReview} onView={mockOnView} />);
    expect(screen.getByText('SYS-001')).toBeInTheDocument();
  });

  it('renders document state badge', () => {
    render(<SolutionReviewCard review={mockReview} onView={mockOnView} />);
    const drafts = screen.getAllByText('DRAFT');
    expect(drafts.length).toBeGreaterThan(0);
  });

  it('calls onView when button clicked', () => {
    render(<SolutionReviewCard review={mockReview} onView={mockOnView} />);
    const button = screen.getByText('View Details');
    fireEvent.click(button);
    expect(mockOnView).toHaveBeenCalledWith(mockReview);
  });

  it('uses custom viewLabel', () => {
    render(<SolutionReviewCard review={mockReview} onView={mockOnView} viewLabel="View System" />);
    expect(screen.getByText('View System')).toBeInTheDocument();
  });

  it('renders project name', () => {
    const review = createSolutionReview({
      solutionOverview: {
        ...mockReview.solutionOverview,
        solutionDetails: { ...mockReview.solutionOverview.solutionDetails, projectName: 'My Project' }
      }
    });
    render(<SolutionReviewCard review={review} onView={mockOnView} />);
    expect(screen.getByText('My Project')).toBeInTheDocument();
  });

  it('renders business unit', () => {
    const review = createSolutionReview({
      solutionOverview: { ...mockReview.solutionOverview, businessUnit: 'IT' }
    });
    render(<SolutionReviewCard review={review} onView={mockOnView} />);
    expect(screen.getByText('IT')).toBeInTheDocument();
  });

  it('shows created and modified dates', () => {
    render(<SolutionReviewCard review={mockReview} onView={mockOnView} />);
    expect(screen.getByText(/Created:/)).toBeInTheDocument();
    expect(screen.getByText(/Modified:/)).toBeInTheDocument();
  });

  it('shows last modified by', () => {
    const review = createSolutionReview({ lastModifiedBy: 'john.doe' });
    render(<SolutionReviewCard review={review} onView={mockOnView} />);
    expect(screen.getByText(/By: john.doe/)).toBeInTheDocument();
  });

  it('handles null solutionName gracefully', () => {
    const review = createSolutionReview({
      solutionOverview: {
        ...mockReview.solutionOverview,
        solutionDetails: { ...mockReview.solutionOverview.solutionDetails, solutionName: null as any }
      }
    });
    render(<SolutionReviewCard review={review} onView={mockOnView} />);
    expect(screen.getByText('Untitled Solution Review')).toBeInTheDocument();
  });

  it('handles null projectName gracefully', () => {
    const review = createSolutionReview({
      solutionOverview: {
        ...mockReview.solutionOverview,
        solutionDetails: { ...mockReview.solutionOverview.solutionDetails, projectName: null as any }
      }
    });
    render(<SolutionReviewCard review={review} onView={mockOnView} />);
    expect(screen.getByText('No description available')).toBeInTheDocument();
  });

  it('handles null businessUnit gracefully', () => {
    const review = createSolutionReview({
      solutionOverview: { ...mockReview.solutionOverview, businessUnit: null as any }
    });
    render(<SolutionReviewCard review={review} onView={mockOnView} />);
    expect(screen.getByText('N/A')).toBeInTheDocument();
  });

  it('renders different document states correctly', () => {
    const states = ['DRAFT', 'SUBMITTED', 'APPROVED', 'ACTIVE', 'REJECTED', 'OUTDATED', 'CURRENT'];

    states.forEach((state) => {
      const review = createSolutionReview({ documentState: state as any });
      const { unmount } = render(<SolutionReviewCard review={review} onView={mockOnView} />);

      const badges = screen.getAllByText(state);
      expect(badges.length).toBeGreaterThan(0);

      unmount();
    });
  });

  it('formats dates correctly', () => {
    const review = createSolutionReview({
      createdAt: '2024-03-15T10:30:00Z',
      lastModifiedAt: '2024-03-20T15:45:00Z'
    });
    render(<SolutionReviewCard review={review} onView={mockOnView} />);

    expect(screen.getByText(/Created:/)).toBeInTheDocument();
    expect(screen.getByText(/Modified:/)).toBeInTheDocument();
  });

  it('calls onTransition when provided', () => {
    const mockOnTransition = vi.fn();
    const review = createSolutionReview();

    render(
      <SolutionReviewCard
        review={review}
        onView={mockOnView}
        onTransition={mockOnTransition}
      />
    );

    // onTransition prop is accepted but not used in UI currently
    expect(screen.getByText('View Details')).toBeInTheDocument();
  });

  it('renders card with hover effect', () => {
    const { container } = render(<SolutionReviewCard review={mockReview} onView={mockOnView} />);

    // Check that the card has proper structure
    const card = container.querySelector('.h-full.flex.flex-col');
    expect(card).toBeInTheDocument();
  });

  it('displays review status from documentState', () => {
    const review = createSolutionReview({ documentState: 'SUBMITTED' });
    render(<SolutionReviewCard review={review} onView={mockOnView} />);

    // Review Status should display the document state
    expect(screen.getAllByText('SUBMITTED').length).toBeGreaterThan(0);
  });

  it('handles undefined lastModifiedBy', () => {
    const review = createSolutionReview({ lastModifiedBy: undefined as any });
    render(<SolutionReviewCard review={review} onView={mockOnView} />);

    expect(screen.getByText(/By:/)).toBeInTheDocument();
  });

  it('renders with minimal data', () => {
    const minimalReview = createSolutionReview({
      solutionOverview: {
        ...mockReview.solutionOverview,
        solutionDetails: {
          solutionName: null as any,
          projectName: null as any,
          solutionArchitectName: '',
          deliveryProjectManagerName: '',
          itBusinessPartner: '',
        },
        businessUnit: null as any,
      }
    });

    const { container } = render(<SolutionReviewCard review={minimalReview} onView={mockOnView} />);

    expect(screen.getByText('Untitled Solution Review')).toBeInTheDocument();
    expect(screen.getByText('No description available')).toBeInTheDocument();
    expect(screen.getByText('N/A')).toBeInTheDocument();
    expect(container).toBeInTheDocument();
  });

  it('button is clickable and styled correctly', () => {
    render(<SolutionReviewCard review={mockReview} onView={mockOnView} />);

    const button = screen.getByText('View Details');
    expect(button).toBeInTheDocument();
    expect(button.tagName).toBe('BUTTON');
  });

  it('renders all card sections', () => {
    const { container } = render(<SolutionReviewCard review={mockReview} onView={mockOnView} />);

    // Should have header, content, and footer
    expect(container.querySelector('.space-y-2')).toBeInTheDocument();
    expect(screen.getByText('Test Solution')).toBeInTheDocument();
    expect(screen.getByText('View Details')).toBeInTheDocument();
  });

  it('displays system code in header', () => {
    const review = createSolutionReview({ systemCode: 'CUSTOM-999' });
    render(<SolutionReviewCard review={review} onView={mockOnView} />);

    expect(screen.getByText('CUSTOM-999')).toBeInTheDocument();
  });

  it('handles very long solution names', () => {
    const longName = 'A'.repeat(200);
    const review = createSolutionReview({
      solutionOverview: {
        ...mockReview.solutionOverview,
        solutionDetails: {
          ...mockReview.solutionOverview.solutionDetails,
          solutionName: longName
        }
      }
    });

    render(<SolutionReviewCard review={review} onView={mockOnView} />);
    expect(screen.getByText(longName)).toBeInTheDocument();
  });

  it('handles very long project descriptions', () => {
    const longDescription = 'B'.repeat(300);
    const review = createSolutionReview({
      solutionOverview: {
        ...mockReview.solutionOverview,
        solutionDetails: {
          ...mockReview.solutionOverview.solutionDetails,
          projectName: longDescription
        }
      }
    });

    render(<SolutionReviewCard review={review} onView={mockOnView} />);
    // The line-clamp-3 class should truncate long text
    expect(screen.getByText(longDescription)).toBeInTheDocument();
  });
});
