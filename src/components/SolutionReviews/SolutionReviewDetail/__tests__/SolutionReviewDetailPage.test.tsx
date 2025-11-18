import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { SolutionReviewDetailPage } from '../SolutionReviewDetailPage';
import { createSolutionReview } from '../../../../__tests__/testFactories';

// Mock hooks
const mockNavigate = vi.fn();
const mockShowError = vi.fn();
const mockLoadSolutionReviewById = vi.fn();
let mockSolutionReviews: any[] | null = null;

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock('../../../../context/ToastContext', () => ({
  useToast: () => ({
    showError: mockShowError,
  }),
}));

vi.mock('../../../../hooks/useViewSolutionReview', () => ({
  useViewSolutionReview: () => ({
    solutionReviews: mockSolutionReviews,
    loadSolutionReviewById: mockLoadSolutionReviewById,
  }),
}));

// Mock SolutionReviewDetail component
vi.mock('../SolutionReviewDetail', () => ({
  SolutionReviewDetail: ({ review, onClose }: any) => (
    <div data-testid="solution-review-detail">
      <div>Review ID: {review.id}</div>
      <button onClick={onClose} data-testid="close-button">Close</button>
    </div>
  ),
}));

describe('SolutionReviewDetailPage', () => {
  const mockReview = createSolutionReview({ id: 'test-review-1' });

  beforeEach(() => {
    vi.clearAllMocks();
    mockSolutionReviews = null;
    mockLoadSolutionReviewById.mockResolvedValue(undefined);
  });

  it('renders "Solution Review Not Found" when no reviews are returned', () => {
    mockSolutionReviews = null;

    render(
      <MemoryRouter initialEntries={['/view-solution-review/test-review-1']}>
        <Routes>
          <Route path="/view-solution-review/:id" element={<SolutionReviewDetailPage />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Solution Review Not Found')).toBeInTheDocument();
  });

  it('renders "Go Back" button when review not found', () => {
    mockSolutionReviews = null;

    render(
      <MemoryRouter initialEntries={['/view-solution-review/test-review-1']}>
        <Routes>
          <Route path="/view-solution-review/:id" element={<SolutionReviewDetailPage />} />
        </Routes>
      </MemoryRouter>
    );

    const goBackButton = screen.getByText('Go Back');
    expect(goBackButton).toBeInTheDocument();
  });

  it('calls navigate(-1) when Go Back is clicked', () => {
    mockSolutionReviews = null;

    render(
      <MemoryRouter initialEntries={['/view-solution-review/test-review-1']}>
        <Routes>
          <Route path="/view-solution-review/:id" element={<SolutionReviewDetailPage />} />
        </Routes>
      </MemoryRouter>
    );

    const goBackButton = screen.getByText('Go Back');
    fireEvent.click(goBackButton);

    expect(mockNavigate).toHaveBeenCalledWith(-1);
  });

  it('handles null solutionReviews gracefully', () => {
    mockSolutionReviews = null;

    render(
      <MemoryRouter initialEntries={['/view-solution-review/test-review-1']}>
        <Routes>
          <Route path="/view-solution-review/:id" element={<SolutionReviewDetailPage />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Solution Review Not Found')).toBeInTheDocument();
  });

  it('handles empty solutionReviews array', () => {
    mockSolutionReviews = [];

    render(
      <MemoryRouter initialEntries={['/view-solution-review/test-review-1']}>
        <Routes>
          <Route path="/view-solution-review/:id" element={<SolutionReviewDetailPage />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Solution Review Not Found')).toBeInTheDocument();
  });

  it('renders SolutionReviewDetail when reviews are loaded', () => {
    mockSolutionReviews = [mockReview];

    render(
      <MemoryRouter initialEntries={['/view-solution-review/test-review-1']}>
        <Routes>
          <Route path="/view-solution-review/:id" element={<SolutionReviewDetailPage />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByTestId('solution-review-detail')).toBeInTheDocument();
    expect(screen.getByText('Review ID: test-review-1')).toBeInTheDocument();
  });

  it('calls onClose to navigate back when close is clicked', () => {
    mockSolutionReviews = [mockReview];

    render(
      <MemoryRouter initialEntries={['/view-solution-review/test-review-1']}>
        <Routes>
          <Route path="/view-solution-review/:id" element={<SolutionReviewDetailPage />} />
        </Routes>
      </MemoryRouter>
    );

    const closeButton = screen.getByTestId('close-button');
    fireEvent.click(closeButton);

    expect(mockNavigate).toHaveBeenCalledWith(-1);
  });

  it('loads solution review by ID on mount', async () => {
    mockSolutionReviews = [mockReview];

    render(
      <MemoryRouter initialEntries={['/view-solution-review/test-review-1']}>
        <Routes>
          <Route path="/view-solution-review/:id" element={<SolutionReviewDetailPage />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(mockLoadSolutionReviewById).toHaveBeenCalledWith('test-review-1');
    });
  });

  it('displays error message when loading fails', async () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const error = new Error('Failed to load');
    mockLoadSolutionReviewById.mockRejectedValue(error);
    mockSolutionReviews = null;

    render(
      <MemoryRouter initialEntries={['/view-solution-review/test-review-1']}>
        <Routes>
          <Route path="/view-solution-review/:id" element={<SolutionReviewDetailPage />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(mockShowError).toHaveBeenCalledWith('Error loading review data: Failed to load');
    });

    consoleErrorSpy.mockRestore();
  });

  it('extracts ID from URL params correctly', async () => {
    mockSolutionReviews = [mockReview];

    render(
      <MemoryRouter initialEntries={['/view-solution-review/custom-id-123']}>
        <Routes>
          <Route path="/view-solution-review/:id" element={<SolutionReviewDetailPage />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(mockLoadSolutionReviewById).toHaveBeenCalledWith('custom-id-123');
    });
  });

  it('logs to console when loading', async () => {
    const consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    mockSolutionReviews = [mockReview];

    render(
      <MemoryRouter initialEntries={['/view-solution-review/test-review-1']}>
        <Routes>
          <Route path="/view-solution-review/:id" element={<SolutionReviewDetailPage />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(consoleLogSpy).toHaveBeenCalledWith('loading review id', 'test-review-1');
    });

    consoleLogSpy.mockRestore();
  });
});
