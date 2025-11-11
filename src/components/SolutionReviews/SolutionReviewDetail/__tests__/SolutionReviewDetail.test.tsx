import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { SolutionReviewDetail } from '../SolutionReviewDetail';
import { createSolutionReview } from '../../../../__tests__/testFactories';

const mockNavigate = vi.fn();
const mockTransitionSolutionReviewState = vi.fn().mockResolvedValue({});

vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}));

vi.mock('../../../../hooks/useUpdateSolutionReview', () => ({
  useUpdateSolutionReview: () => ({
    transitionSolutionReviewState: mockTransitionSolutionReviewState,
  }),
}));

vi.mock('../../../../context/ToastContext', () => ({
  useToast: () => ({
    showSuccess: vi.fn(),
    showError: vi.fn(),
  }),
}));

describe('SolutionReviewDetail', () => {
  const mockOnClose = vi.fn();
  const mockReview = createSolutionReview();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders solution review detail', () => {
    render(<SolutionReviewDetail review={mockReview} onClose={mockOnClose} />);
    expect(screen.getAllByText('Test Solution').length).toBeGreaterThan(0);
  });

  it('displays document state badge', () => {
    render(<SolutionReviewDetail review={mockReview} onClose={mockOnClose} />);
    expect(screen.getAllByText('DRAFT').length).toBeGreaterThan(0);
  });

  it('displays solution name', () => {
    render(<SolutionReviewDetail review={mockReview} onClose={mockOnClose} />);
    expect(screen.getAllByText('Test Solution').length).toBeGreaterThan(0);
  });

  it('displays review code', () => {
    const { container } = render(<SolutionReviewDetail review={mockReview} onClose={mockOnClose} />);
    expect(container.textContent).toContain('SR-001');
  });

  it('renders close button', () => {
    render(<SolutionReviewDetail review={mockReview} onClose={mockOnClose} />);
    const closeButton = screen.getByLabelText(/Close/i);
    expect(closeButton).toBeInTheDocument();
  });

  it('calls onClose when close button clicked', () => {
    render(<SolutionReviewDetail review={mockReview} onClose={mockOnClose} />);
    const closeButton = screen.getByLabelText(/Close/i);
    fireEvent.click(closeButton);
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('displays solution architect name', () => {
    render(<SolutionReviewDetail review={mockReview} onClose={mockOnClose} />);
    expect(screen.getAllByText(/John Doe/).length).toBeGreaterThan(0);
  });

  it('displays project name', () => {
    render(<SolutionReviewDetail review={mockReview} onClose={mockOnClose} />);
    expect(screen.getAllByText(/Test Project/).length).toBeGreaterThan(0);
  });

  it('displays business unit', () => {
    render(<SolutionReviewDetail review={mockReview} onClose={mockOnClose} />);
    expect(screen.getAllByText(/IT/).length).toBeGreaterThan(0);
  });

  it('renders with submitted state', () => {
    const submittedReview = createSolutionReview({
      documentState: 'SUBMITTED',
    });
    render(<SolutionReviewDetail review={submittedReview} onClose={mockOnClose} />);
    expect(screen.getAllByText('SUBMITTED').length).toBeGreaterThan(0);
  });

  it('renders with approved state', () => {
    const approvedReview = createSolutionReview({
      documentState: 'APPROVED',
    });
    render(<SolutionReviewDetail review={approvedReview} onClose={mockOnClose} />);
    expect(screen.getAllByText('APPROVED').length).toBeGreaterThan(0);
  });

  it('handles null solution name gracefully', () => {
    const reviewWithoutName = createSolutionReview({
      solutionOverview: {
        ...mockReview.solutionOverview,
        solutionDetails: {
          ...mockReview.solutionOverview.solutionDetails,
          solutionName: null as any,
        },
      },
    });
    const { container } = render(<SolutionReviewDetail review={reviewWithoutName} onClose={mockOnClose} />);
    // When solution name is null, displayValue() returns an em dash
    expect(container.textContent).toContain('Solution Name: —');
  });

  it('displays edit button', () => {
    render(<SolutionReviewDetail review={mockReview} onClose={mockOnClose} />);
    expect(screen.getAllByText(/Edit/i).length).toBeGreaterThan(0);
  });
});
