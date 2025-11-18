import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { SystemDetailPage } from '../SystemDetailPage';
import { createSolutionReview } from '../../../../__tests__/testFactories';
import { DocumentState } from '../../../../types/solutionReview';

// Mock hooks
const mockNavigate = vi.fn();
const mockShowError = vi.fn();
const mockLoadSystemSolutionReviews = vi.fn();
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
    loadSystemSolutionReviews: mockLoadSystemSolutionReviews,
  }),
}));

// Mock SystemDetail component
vi.mock('../SystemDetail', () => ({
  SystemDetail: ({ systemCode, system, onClose, onViewReview }: any) => (
    <div data-testid="system-detail">
      <div>System Code: {systemCode}</div>
      <div>Review Count: {system?.length || 0}</div>
      <button onClick={onClose} data-testid="close-button">Close</button>
      {system && system.length > 0 && (
        <button onClick={() => onViewReview(system[0])} data-testid="view-review-button">
          View Review
        </button>
      )}
    </div>
  ),
}));

describe('SystemDetailPage', () => {
  const mockSystemReviews = [
    createSolutionReview({
      id: 'sr-1',
      systemCode: 'SYS-001',
      documentState: DocumentState.DRAFT,
    }),
    createSolutionReview({
      id: 'sr-2',
      systemCode: 'SYS-001',
      documentState: DocumentState.ACTIVE,
    }),
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, 'log').mockImplementation(() => {});
    vi.spyOn(console, 'error').mockImplementation(() => {});
    mockSolutionReviews = null;
    mockLoadSystemSolutionReviews.mockResolvedValue(undefined);
  });

  it('renders "System Not Found" when no reviews are loaded', () => {
    mockSolutionReviews = null;

    render(
      <MemoryRouter initialEntries={['/system/SYS-001']}>
        <Routes>
          <Route path="/system/:systemCode" element={<SystemDetailPage />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('System Not Found')).toBeInTheDocument();
  });

  it('renders "Go Back" button when system not found', () => {
    mockSolutionReviews = null;

    render(
      <MemoryRouter initialEntries={['/system/SYS-001']}>
        <Routes>
          <Route path="/system/:systemCode" element={<SystemDetailPage />} />
        </Routes>
      </MemoryRouter>
    );

    const goBackButton = screen.getByText('Go Back');
    expect(goBackButton).toBeInTheDocument();
  });

  it('calls navigate(-1) when Go Back is clicked', () => {
    mockSolutionReviews = null;

    render(
      <MemoryRouter initialEntries={['/system/SYS-001']}>
        <Routes>
          <Route path="/system/:systemCode" element={<SystemDetailPage />} />
        </Routes>
      </MemoryRouter>
    );

    const goBackButton = screen.getByText('Go Back');
    fireEvent.click(goBackButton);

    expect(mockNavigate).toHaveBeenCalledWith(-1);
  });

  it('renders SystemDetail when reviews are loaded', () => {
    mockSolutionReviews = mockSystemReviews;

    render(
      <MemoryRouter initialEntries={['/system/SYS-001']}>
        <Routes>
          <Route path="/system/:systemCode" element={<SystemDetailPage />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByTestId('system-detail')).toBeInTheDocument();
    expect(screen.getByText('System Code: SYS-001')).toBeInTheDocument();
  });

  it('passes systemCode to SystemDetail', () => {
    mockSolutionReviews = mockSystemReviews;

    render(
      <MemoryRouter initialEntries={['/system/TEST-SYSTEM']}>
        <Routes>
          <Route path="/system/:systemCode" element={<SystemDetailPage />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('System Code: TEST-SYSTEM')).toBeInTheDocument();
  });

  it('passes system reviews to SystemDetail', () => {
    mockSolutionReviews = mockSystemReviews;

    render(
      <MemoryRouter initialEntries={['/system/SYS-001']}>
        <Routes>
          <Route path="/system/:systemCode" element={<SystemDetailPage />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Review Count: 2')).toBeInTheDocument();
  });

  it('navigates to solution review detail when onViewReview is called', () => {
    mockSolutionReviews = mockSystemReviews;

    render(
      <MemoryRouter initialEntries={['/system/SYS-001']}>
        <Routes>
          <Route path="/system/:systemCode" element={<SystemDetailPage />} />
        </Routes>
      </MemoryRouter>
    );

    const viewReviewButton = screen.getByTestId('view-review-button');
    fireEvent.click(viewReviewButton);

    expect(mockNavigate).toHaveBeenCalledWith('/view-solution-review/sr-1');
  });

  it('calls navigate(-1) when SystemDetail onClose is triggered', () => {
    mockSolutionReviews = mockSystemReviews;

    render(
      <MemoryRouter initialEntries={['/system/SYS-001']}>
        <Routes>
          <Route path="/system/:systemCode" element={<SystemDetailPage />} />
        </Routes>
      </MemoryRouter>
    );

    const closeButton = screen.getByTestId('close-button');
    fireEvent.click(closeButton);

    expect(mockNavigate).toHaveBeenCalledWith(-1);
  });

  it('loads system reviews by system code on mount', async () => {
    mockSolutionReviews = mockSystemReviews;

    render(
      <MemoryRouter initialEntries={['/system/SYS-001']}>
        <Routes>
          <Route path="/system/:systemCode" element={<SystemDetailPage />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(mockLoadSystemSolutionReviews).toHaveBeenCalledWith('SYS-001');
    });
  });

  it('displays error message when loading fails', async () => {
    const error = new Error('Failed to load system reviews');
    mockLoadSystemSolutionReviews.mockRejectedValue(error);
    mockSolutionReviews = null;

    render(
      <MemoryRouter initialEntries={['/system/SYS-001']}>
        <Routes>
          <Route path="/system/:systemCode" element={<SystemDetailPage />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(mockShowError).toHaveBeenCalledWith('Failed to load data: Failed to load system reviews');
    });
  });

  it('extracts systemCode from URL params correctly', async () => {
    mockSolutionReviews = mockSystemReviews;

    render(
      <MemoryRouter initialEntries={['/system/CUSTOM-SYS-999']}>
        <Routes>
          <Route path="/system/:systemCode" element={<SystemDetailPage />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(mockLoadSystemSolutionReviews).toHaveBeenCalledWith('CUSTOM-SYS-999');
    });
  });

  it('renders with single review', () => {
    const singleReview = [mockSystemReviews[0]];
    mockSolutionReviews = singleReview;

    render(
      <MemoryRouter initialEntries={['/system/SYS-001']}>
        <Routes>
          <Route path="/system/:systemCode" element={<SystemDetailPage />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Review Count: 1')).toBeInTheDocument();
  });

  it('renders with multiple reviews', () => {
    const multipleReviews = [
      ...mockSystemReviews,
      createSolutionReview({
        id: 'sr-3',
        systemCode: 'SYS-001',
        documentState: DocumentState.SUBMITTED,
      }),
    ];

    mockSolutionReviews = multipleReviews;

    render(
      <MemoryRouter initialEntries={['/system/SYS-001']}>
        <Routes>
          <Route path="/system/:systemCode" element={<SystemDetailPage />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Review Count: 3')).toBeInTheDocument();
  });
});
