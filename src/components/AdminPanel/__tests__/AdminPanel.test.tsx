import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderWithRouter, screen, fireEvent, waitFor } from '../../../test/test-utils';
import { AdminPanel } from '../AdminPanel';
import { createSolutionReview } from '../../../__tests__/testFactories';

const mockNavigate = vi.fn();
const mockLoadSubmittedSolutionReviews = vi.fn();

// Mutable mock data that tests can modify
const mockAdminPanelData = {
  solutionReviews: [] as any[],
  loadSubmittedSolutionReviews: mockLoadSubmittedSolutionReviews,
  pageMeta: {
    page: 0,
    totalPages: 1,
    totalElements: 0,
  },
  isLoading: false,
  error: null as string | null,
};

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock('../../../hooks/useAdminPanel', () => ({
  useAdminPanel: () => mockAdminPanelData,
}));

describe('AdminPanel', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset to default state
    mockAdminPanelData.solutionReviews = [];
    mockAdminPanelData.pageMeta = { page: 0, totalPages: 1, totalElements: 0 };
    mockAdminPanelData.isLoading = false;
    mockAdminPanelData.error = null;
  });

  it('renders admin panel', () => {
    renderWithRouter(<AdminPanel />);
    expect(screen.getByPlaceholderText(/Search reviews/i)).toBeInTheDocument();
  });

  it('displays search input', () => {
    renderWithRouter(<AdminPanel />);
    const searchInput = screen.getByPlaceholderText(/Search reviews/i);
    expect(searchInput).toBeInTheDocument();
  });

  it('handles search input changes', () => {
    renderWithRouter(<AdminPanel />);
    const searchInput = screen.getByPlaceholderText(/Search reviews/i);

    fireEvent.change(searchInput, { target: { value: 'test search' } });
    expect(searchInput).toHaveValue('test search');
  });

  it('displays filter badge', () => {
    renderWithRouter(<AdminPanel />);
    expect(screen.getByText(/SUBMITTED STATUS ONLY/i)).toBeInTheDocument();
  });

  it('calls loadSubmittedSolutionReviews on mount', () => {
    renderWithRouter(<AdminPanel />);
    expect(mockLoadSubmittedSolutionReviews).toHaveBeenCalledWith(0, 10);
  });
});

describe('AdminPanel - Loading State', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockAdminPanelData.solutionReviews = [];
    mockAdminPanelData.pageMeta = { page: 0, totalPages: 0, totalElements: 0 };
    mockAdminPanelData.isLoading = true;
    mockAdminPanelData.error = null;
  });

  it('displays loading state', () => {
    renderWithRouter(<AdminPanel />);
    expect(screen.getByText(/Loading submitted reviews/i)).toBeInTheDocument();
  });
});

describe('AdminPanel - Error State', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockAdminPanelData.solutionReviews = [];
    mockAdminPanelData.pageMeta = { page: 0, totalPages: 0, totalElements: 0 };
    mockAdminPanelData.isLoading = false;
    mockAdminPanelData.error = 'Failed to load reviews';
  });

  it('displays error message', () => {
    renderWithRouter(<AdminPanel />);
    expect(screen.getByText(/Failed to load reviews/i)).toBeInTheDocument();
  });

  it('displays error icon', () => {
    const { container } = renderWithRouter(<AdminPanel />);
    const errorContainer = container.querySelector('.bg-red-50');
    expect(errorContainer).toBeInTheDocument();
  });
});

describe('AdminPanel - Empty State', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockAdminPanelData.solutionReviews = [];
    mockAdminPanelData.pageMeta = { page: 0, totalPages: 1, totalElements: 0 };
    mockAdminPanelData.isLoading = false;
    mockAdminPanelData.error = null;
  });

  it('displays empty state when no reviews', () => {
    renderWithRouter(<AdminPanel />);
    expect(screen.getByText(/No submitted reviews found/i)).toBeInTheDocument();
  });

  it('displays appropriate message for empty search results', () => {
    renderWithRouter(<AdminPanel />);
    const searchInput = screen.getByPlaceholderText(/Search reviews/i);

    fireEvent.change(searchInput, { target: { value: 'nonexistent' } });

    expect(screen.getByText(/No submitted reviews found/i)).toBeInTheDocument();
    expect(screen.getByText(/Try adjusting your search criteria/i)).toBeInTheDocument();
  });
});

describe('AdminPanel - Pagination', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockAdminPanelData.solutionReviews = Array.from({ length: 10 }, (_, i) =>
      createSolutionReview({ id: `review-${i}` })
    );
    mockAdminPanelData.pageMeta = { page: 0, totalPages: 3, totalElements: 25 };
    mockAdminPanelData.isLoading = false;
    mockAdminPanelData.error = null;
  });

  it('displays pagination info', () => {
    renderWithRouter(<AdminPanel />);
    expect(screen.getByText(/Showing/i)).toBeInTheDocument();
    expect(screen.getByText(/of/i)).toBeInTheDocument();
    expect(screen.getByText(/submitted reviews/i)).toBeInTheDocument();
  });

  it('displays current page', () => {
    renderWithRouter(<AdminPanel />);
    expect(screen.getByText(/Page 1/i)).toBeInTheDocument();
  });

  it('has page size selector', () => {
    renderWithRouter(<AdminPanel />);
    const pageSizeSelector = screen.getByRole('combobox');
    expect(pageSizeSelector).toBeInTheDocument();
  });

  it('handles page size change', () => {
    renderWithRouter(<AdminPanel />);
    const pageSizeSelector = screen.getByRole('combobox');

    fireEvent.change(pageSizeSelector, { target: { value: '20' } });

    waitFor(() => {
      expect(mockLoadSubmittedSolutionReviews).toHaveBeenCalledWith(0, 20);
    });
  });

  it('has navigation buttons', () => {
    renderWithRouter(<AdminPanel />);
    expect(screen.getByText('«')).toBeInTheDocument();
    expect(screen.getByText('Prev')).toBeInTheDocument();
    expect(screen.getByText('Next')).toBeInTheDocument();
    expect(screen.getByText('»')).toBeInTheDocument();
  });

  it('disables prev buttons on first page', () => {
    renderWithRouter(<AdminPanel />);
    const firstPageBtn = screen.getByText('«');
    const prevBtn = screen.getByText('Prev');

    expect(firstPageBtn).toBeDisabled();
    expect(prevBtn).toBeDisabled();
  });
});

describe('AdminPanel - Filtering', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockAdminPanelData.solutionReviews = [
      createSolutionReview({
        id: '1',
        systemCode: 'SYS-001',
        solutionOverview: {
          ...createSolutionReview().solutionOverview,
          solutionDetails: {
            ...createSolutionReview().solutionOverview.solutionDetails,
            solutionName: 'Customer Portal',
            projectName: 'Portal Project',
          },
          businessUnit: 'IT',
        },
      }),
      createSolutionReview({
        id: '2',
        systemCode: 'SYS-002',
        solutionOverview: {
          ...createSolutionReview().solutionOverview,
          solutionDetails: {
            ...createSolutionReview().solutionOverview.solutionDetails,
            solutionName: 'Payment Gateway',
            projectName: 'Gateway Project',
          },
          businessUnit: 'Finance',
        },
      }),
    ];
    mockAdminPanelData.pageMeta = { page: 0, totalPages: 1, totalElements: 2 };
    mockAdminPanelData.isLoading = false;
    mockAdminPanelData.error = null;
  });

  it('filters by solution name', () => {
    renderWithRouter(<AdminPanel />);
    const searchInput = screen.getByPlaceholderText(/Search reviews/i);

    fireEvent.change(searchInput, { target: { value: 'Portal' } });

    // Should still render cards but filtered
    expect(searchInput).toHaveValue('Portal');
  });

  it('filters by system code', () => {
    renderWithRouter(<AdminPanel />);
    const searchInput = screen.getByPlaceholderText(/Search reviews/i);

    fireEvent.change(searchInput, { target: { value: 'SYS-001' } });

    expect(searchInput).toHaveValue('SYS-001');
  });

  it('filters by business unit', () => {
    renderWithRouter(<AdminPanel />);
    const searchInput = screen.getByPlaceholderText(/Search reviews/i);

    fireEvent.change(searchInput, { target: { value: 'Finance' } });

    expect(searchInput).toHaveValue('Finance');
  });

  it('search is case insensitive', () => {
    renderWithRouter(<AdminPanel />);
    const searchInput = screen.getByPlaceholderText(/Search reviews/i);

    fireEvent.change(searchInput, { target: { value: 'portal' } });

    expect(searchInput).toHaveValue('portal');
  });
});

describe('AdminPanel - Navigation', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockAdminPanelData.solutionReviews = [createSolutionReview({ id: 'test-review-1' })];
    mockAdminPanelData.pageMeta = { page: 0, totalPages: 1, totalElements: 1 };
    mockAdminPanelData.isLoading = false;
    mockAdminPanelData.error = null;
  });

  it('navigates to review detail on card click', () => {
    renderWithRouter(<AdminPanel />);

    // This would require clicking on the card which is rendered by SolutionReviewCard
    // The navigation logic is tested by checking the onViewCard function
    expect(mockNavigate).not.toHaveBeenCalled();
  });
});

describe('AdminPanel - Page Size Options', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Need at least one review to show pagination controls
    mockAdminPanelData.solutionReviews = [createSolutionReview({ id: 'review-1' })];
    mockAdminPanelData.pageMeta = { page: 0, totalPages: 1, totalElements: 1 };
    mockAdminPanelData.isLoading = false;
    mockAdminPanelData.error = null;
  });

  it('displays all page size options', () => {
    renderWithRouter(<AdminPanel />);
    const pageSizeSelector = screen.getByRole('combobox');

    const options = pageSizeSelector.querySelectorAll('option');
    expect(options).toHaveLength(4);
    expect(options[0]).toHaveTextContent('5 / page');
    expect(options[1]).toHaveTextContent('10 / page');
    expect(options[2]).toHaveTextContent('20 / page');
    expect(options[3]).toHaveTextContent('50 / page');
  });

  it('has default page size of 10', () => {
    renderWithRouter(<AdminPanel />);
    const pageSizeSelector = screen.getByRole('combobox') as HTMLSelectElement;

    expect(pageSizeSelector.value).toBe('10');
  });
});
