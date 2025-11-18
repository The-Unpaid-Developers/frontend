import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ReviewSubmissionModal } from '../ReviewSubmissionModal';
import { createSolutionReview } from '../../../../__tests__/testFactories';

// Mock hooks
const mockLoadSolutionReviewById = vi.fn();
const mockShowError = vi.fn();
let mockSolutionReviews: any[] | null = null;
let mockIsLoading = false;
let mockError: string | null = null;

vi.mock('../../../../hooks/useViewSolutionReview', () => ({
  useViewSolutionReview: () => ({
    loadSolutionReviewById: mockLoadSolutionReviewById,
    solutionReviews: mockSolutionReviews,
    isLoading: mockIsLoading,
    error: mockError,
  }),
}));

vi.mock('../../../../context/ToastContext', () => ({
  useToast: () => ({
    showError: mockShowError,
  }),
}));

// Mock UI components
vi.mock('../../../ui', () => ({
  Modal: ({ isOpen, onClose, title, children }: any) =>
    isOpen ? (
      <div data-testid="modal">
        <h2>{title}</h2>
        <button onClick={onClose} data-testid="modal-close">
          Close
        </button>
        {children}
      </div>
    ) : null,
  Button: ({ children, onClick, disabled, variant, size, className }: any) => (
    <button
      onClick={onClick}
      disabled={disabled}
      data-variant={variant}
      data-size={size}
      className={className}
    >
      {children}
    </button>
  ),
}));

describe('ReviewSubmissionModal', () => {
  const mockSetShowReview = vi.fn();
  const mockConfirmSubmit = vi.fn();
  const mockGoToStep = vi.fn();

  const stepMeta = [
    { key: 'solutionOverview', label: 'Solution Overview' },
    { key: 'businessCapabilities', label: 'Business Capabilities' },
    { key: 'dataAssets', label: 'Data & Assets' },
  ];

  const defaultProps = {
    showReview: true,
    setShowReview: mockSetShowReview,
    isSubmitting: false,
    reviewId: 'test-review-1',
    stepMeta,
    goToStep: mockGoToStep,
    confirmSubmit: mockConfirmSubmit,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.spyOn(console, 'log').mockImplementation(() => {});
    mockSolutionReviews = null;
    mockIsLoading = false;
    mockError = null;
    mockLoadSolutionReviewById.mockResolvedValue(undefined);
  });

  it('renders modal when showReview is true', () => {
    render(<ReviewSubmissionModal {...defaultProps} />);
    expect(screen.getByTestId('modal')).toBeInTheDocument();
    expect(screen.getByText('Review Solution Review')).toBeInTheDocument();
  });

  it('does not render modal when showReview is false', () => {
    render(<ReviewSubmissionModal {...defaultProps} showReview={false} />);
    expect(screen.queryByTestId('modal')).not.toBeInTheDocument();
  });

  it('loads solution review data when modal opens', async () => {
    render(<ReviewSubmissionModal {...defaultProps} />);

    await waitFor(() => {
      expect(mockLoadSolutionReviewById).toHaveBeenCalledWith('test-review-1');
    });
  });

  it('does not load data when modal is closed', () => {
    render(<ReviewSubmissionModal {...defaultProps} showReview={false} />);
    expect(mockLoadSolutionReviewById).not.toHaveBeenCalled();
  });

  it('displays loading state', () => {
    mockIsLoading = true;

    render(<ReviewSubmissionModal {...defaultProps} />);

    expect(screen.getByText('Loading review data...')).toBeInTheDocument();
  });

  it('displays error message when loading fails', () => {
    mockError = 'Failed to load data';

    render(<ReviewSubmissionModal {...defaultProps} />);

    expect(screen.getByText(/Error loading data: Failed to load data/)).toBeInTheDocument();
  });

  it('displays all sections with data', () => {
    const mockReview = createSolutionReview({
      businessCapabilities: [{ l1: 'Test', l2: 'Test', l3: 'Test' }],
      dataAssets: [{ componentName: 'Test Asset' }],
    });

    mockSolutionReviews = [mockReview];

    render(<ReviewSubmissionModal {...defaultProps} />);

    expect(screen.getByText('Solution Overview')).toBeInTheDocument();
    expect(screen.getByText('Business Capabilities')).toBeInTheDocument();
    expect(screen.getByText('Data & Assets')).toBeInTheDocument();
  });

  it('marks empty sections as "Not completed"', () => {
    const mockReview = createSolutionReview({
      businessCapabilities: [],
      dataAssets: null,
    });

    mockSolutionReviews = [mockReview];

    render(<ReviewSubmissionModal {...defaultProps} />);

    const notCompletedElements = screen.getAllByText('Not completed');
    expect(notCompletedElements.length).toBeGreaterThan(0);
  });

  it('disables confirm button when sections are missing', () => {
    const mockReview = createSolutionReview({
      businessCapabilities: [],
    });

    mockSolutionReviews = [mockReview];

    render(<ReviewSubmissionModal {...defaultProps} />);

    const confirmButton = screen.getByText('Confirm Submit');
    expect(confirmButton).toBeDisabled();
  });

  it('enables confirm button when all sections are complete', () => {
    const mockReview = createSolutionReview({
      businessCapabilities: [{ l1: 'Test', l2: 'Test', l3: 'Test' }],
      dataAssets: [{ componentName: 'Test' }],
      systemComponents: [{ name: 'Test' }],
      technologyComponents: [{ productName: 'Test' }],
      integrationFlows: [{ componentName: 'Test' }],
      enterpriseTools: [{ tool: { name: 'Test' } }],
      processCompliances: [{ standardGuideline: 'Test' }],
    });

    mockSolutionReviews = [mockReview];

    render(<ReviewSubmissionModal {...defaultProps} />);

    const confirmButton = screen.getByText('Confirm Submit');
    expect(confirmButton).not.toBeDisabled();
  });

  it('calls confirmSubmit when confirm button is clicked', async () => {
    const mockReview = createSolutionReview({
      businessCapabilities: [{ l1: 'Test', l2: 'Test', l3: 'Test' }],
      dataAssets: [{ componentName: 'Test' }],
      systemComponents: [{ name: 'Test' }],
      technologyComponents: [{ productName: 'Test' }],
      integrationFlows: [{ componentName: 'Test' }],
      enterpriseTools: [{ tool: { name: 'Test' } }],
      processCompliances: [{ standardGuideline: 'Test' }],
    });

    mockSolutionReviews = [mockReview];

    render(<ReviewSubmissionModal {...defaultProps} />);

    const confirmButton = screen.getByText('Confirm Submit');
    fireEvent.click(confirmButton);

    await waitFor(() => {
      expect(mockConfirmSubmit).toHaveBeenCalled();
    });
  });

  it('shows "Submitting..." text when isSubmitting is true', () => {
    const mockReview = createSolutionReview({
      businessCapabilities: [{ l1: 'Test', l2: 'Test', l3: 'Test' }],
      dataAssets: [{ componentName: 'Test' }],
      systemComponents: [{ name: 'Test' }],
      technologyComponents: [{ productName: 'Test' }],
      integrationFlows: [{ componentName: 'Test' }],
      enterpriseTools: [{ tool: { name: 'Test' } }],
      processCompliances: [{ standardGuideline: 'Test' }],
    });

    mockSolutionReviews = [mockReview];

    render(<ReviewSubmissionModal {...defaultProps} isSubmitting={true} />);

    expect(screen.getByText('Submitting...')).toBeInTheDocument();
  });

  it('allows closing modal when not submitting', () => {
    render(<ReviewSubmissionModal {...defaultProps} />);

    const cancelButton = screen.getByText('Cancel');
    fireEvent.click(cancelButton);

    expect(mockSetShowReview).toHaveBeenCalledWith(false);
  });

  it('disables cancel button when submitting', () => {
    render(<ReviewSubmissionModal {...defaultProps} isSubmitting={true} />);

    const cancelButton = screen.getByText('Cancel');
    expect(cancelButton).toBeDisabled();
  });
});
