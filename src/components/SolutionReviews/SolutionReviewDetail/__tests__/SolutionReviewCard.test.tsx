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
});
