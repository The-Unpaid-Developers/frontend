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
    const editButtons = screen.queryAllByText(/Edit/i);
    expect(editButtons.length).toBeGreaterThan(0);
  });

  it('displays dates in review', () => {
    const { container } = render(<SolutionReviewDetail review={mockReview} onClose={mockOnClose} />);
    expect(container.textContent).toContain('2023');
  });

  it('displays review information', () => {
    const { container } = render(<SolutionReviewDetail review={mockReview} onClose={mockOnClose} />);
    expect(container).toBeInTheDocument();
  });

  it('renders all sections', () => {
    const { container } = render(<SolutionReviewDetail review={mockReview} onClose={mockOnClose} />);
    expect(screen.getAllByText('Test Solution').length).toBeGreaterThan(0);
  });

  it('renders with null business capabilities', () => {
    const reviewWithNullCapabilities = createSolutionReview({
      businessCapabilities: null,
    });
    const { container } = render(<SolutionReviewDetail review={reviewWithNullCapabilities} onClose={mockOnClose} />);
    expect(container).toBeInTheDocument();
  });

  it('renders with null system components', () => {
    const reviewWithNullComponents = createSolutionReview({
      systemComponents: null,
    });
    const { container } = render(<SolutionReviewDetail review={reviewWithNullComponents} onClose={mockOnClose} />);
    expect(container).toBeInTheDocument();
  });

  it('renders with null integration flows', () => {
    const reviewWithNullFlows = createSolutionReview({
      integrationFlows: null,
    });
    const { container } = render(<SolutionReviewDetail review={reviewWithNullFlows} onClose={mockOnClose} />);
    expect(container).toBeInTheDocument();
  });

  it('renders with null data assets', () => {
    const reviewWithNullAssets = createSolutionReview({
      dataAssets: null,
    });
    const { container } = render(<SolutionReviewDetail review={reviewWithNullAssets} onClose={mockOnClose} />);
    expect(container).toBeInTheDocument();
  });

  it('renders with rejected state', () => {
    const rejectedReview = createSolutionReview({
      documentState: 'REJECTED',
    });
    render(<SolutionReviewDetail review={rejectedReview} onClose={mockOnClose} />);
    expect(screen.getAllByText('REJECTED').length).toBeGreaterThan(0);
  });

  it('displays delivery project manager name', () => {
    render(<SolutionReviewDetail review={mockReview} onClose={mockOnClose} />);
    expect(screen.getAllByText(/Jane Smith/).length).toBeGreaterThan(0);
  });

  it('displays IT business partner', () => {
    render(<SolutionReviewDetail review={mockReview} onClose={mockOnClose} />);
    expect(screen.getAllByText(/Bob Johnson/).length).toBeGreaterThan(0);
  });

  it('handles missing optional fields gracefully', () => {
    const minimalReview = createSolutionReview({
      solutionOverview: {
        ...mockReview.solutionOverview,
        reviewedBy: null,
        conditions: null,
      },
    });
    const { container } = render(<SolutionReviewDetail review={minimalReview} onClose={mockOnClose} />);
    expect(container).toBeInTheDocument();
  });

  it('displays review information including ID', () => {
    const { container } = render(<SolutionReviewDetail review={mockReview} onClose={mockOnClose} />);
    expect(container.textContent).toContain('ID');
    expect(container.textContent).toContain('1');
  });

  it('renders with active state', () => {
    const activeReview = createSolutionReview({
      documentState: 'ACTIVE',
    });
    render(<SolutionReviewDetail review={activeReview} onClose={mockOnClose} />);
    expect(screen.getAllByText('ACTIVE').length).toBeGreaterThan(0);
  });
});
