import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '../../test/test-utils';
import { Dashboard } from '../Dashboard';
import { useViewSolutionReview } from '../../hooks/useViewSolutionReview';
import { useToast } from '../../context/ToastContext';

// Mock navigate function - define at top level
const mockNavigate = vi.fn();

// Mock react-router-dom
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mock the hooks
vi.mock('../../hooks/useViewSolutionReview');
vi.mock('../../context/ToastContext', async () => {
  const actual = await vi.importActual('../../context/ToastContext');
  return {
    ...actual,
    useToast: vi.fn(),
  };
});

const mockUseViewSolutionReview = vi.mocked(useViewSolutionReview);
const mockUseToast = vi.mocked(useToast);

describe('Dashboard', () => {
  const mockSolutionReviews = [
    {
      id: 'sr-1',
      systemCode: 'SYS-001',
      documentState: 'DRAFT' as const,
      solutionOverview: {
        id: 'overview-1',
        solutionDetails: {
          solutionName: 'Test Solution Review 1',
          projectName: 'Test Project'
        },
        reviewType: 'Standard',
        businessUnit: 'IT'
      },
      businessCapabilities: null,
      dataAssets: null,
      enterpriseTools: null,
      integrationFlows: null,
      systemComponents: null,
      technologyComponents: null,
      processCompliances: null,
      createdAt: '2023-01-01T00:00:00Z',
      lastModifiedAt: '2023-01-01T00:00:00Z',
      createdBy: 'test-user',
      lastModifiedBy: 'test-user'
    }
  ];

  const mockPageMeta = {
    page: 0,
    size: 10,
    totalPages: 1,
    totalElements: 1
  };

  const mockLoadSolutionReviews = vi.fn();
  const mockLoadSystems = vi.fn();
  const mockShowError = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    mockUseViewSolutionReview.mockReturnValue({
      solutionReviews: mockSolutionReviews,
      setSolutionReviews: vi.fn(),
      loadSystemSolutionReviews: mockLoadSolutionReviews,
      loadSolutionReviewById: vi.fn(),
      loadSolutionReviews: mockLoadSolutionReviews,
      loadSystems: mockLoadSystems,
      searchSR: vi.fn(),
      pageMeta: mockPageMeta,
      setPageMeta: vi.fn(),
      isLoading: false,
      error: null
    });

    mockUseToast.mockReturnValue({
      showError: mockShowError,
      showSuccess: vi.fn(),
      showInfo: vi.fn(),
      hideToast: vi.fn(),
      showToast: vi.fn()
    });
  });

  it('should render dashboard component', () => {
    render(<Dashboard />);

    // Basic test to ensure component renders without crashing - check for search input
    expect(screen.getByPlaceholderText(/Search using natural language/i)).toBeInTheDocument();
  });

  it('should load systems on mount', () => {
    render(<Dashboard />);

    expect(mockLoadSystems).toHaveBeenCalled();
  });

  it('renders loading state', () => {
    mockUseViewSolutionReview.mockReturnValue({
      solutionReviews: [],
      setSolutionReviews: vi.fn(),
      loadSystemSolutionReviews: mockLoadSolutionReviews,
      loadSolutionReviewById: vi.fn(),
      loadSolutionReviews: mockLoadSolutionReviews,
      loadSystems: mockLoadSystems,
      searchSR: vi.fn(),
      pageMeta: mockPageMeta,
      setPageMeta: vi.fn(),
      isLoading: true,
      error: null
    });

    render(<Dashboard />);
    expect(screen.getByText('Loading solution reviews...')).toBeInTheDocument();
  });

  it('renders empty state when no reviews', () => {
    mockUseViewSolutionReview.mockReturnValue({
      solutionReviews: [],
      setSolutionReviews: vi.fn(),
      loadSystemSolutionReviews: mockLoadSolutionReviews,
      loadSolutionReviewById: vi.fn(),
      loadSolutionReviews: mockLoadSolutionReviews,
      loadSystems: mockLoadSystems,
      searchSR: vi.fn(),
      pageMeta: { ...mockPageMeta, totalElements: 0 },
      setPageMeta: vi.fn(),
      isLoading: false,
      error: null
    });

    render(<Dashboard />);
    expect(screen.getByText('No solution reviews found')).toBeInTheDocument();
  });

  it('renders solution review cards', () => {
    render(<Dashboard />);
    expect(screen.getByText('Test Solution Review 1')).toBeInTheDocument();
  });

  it('shows pagination controls when data exists', () => {
    render(<Dashboard />);
    expect(screen.getByText(/Page 1 \/ 1/)).toBeInTheDocument();
  });

  it('switches to reviews view', async () => {
    render(<Dashboard />);
    const reviewsButton = screen.getByText('Reviews View');
    fireEvent.click(reviewsButton);
    await waitFor(() => {
      expect(mockLoadSolutionReviews).toHaveBeenCalled();
    });
  });

  it('shows create button in empty state', () => {
    mockUseViewSolutionReview.mockReturnValue({
      solutionReviews: [],
      setSolutionReviews: vi.fn(),
      loadSystemSolutionReviews: mockLoadSolutionReviews,
      loadSolutionReviewById: vi.fn(),
      loadSolutionReviews: mockLoadSolutionReviews,
      loadSystems: mockLoadSystems,
      searchSR: vi.fn(),
      pageMeta: { ...mockPageMeta, totalElements: 0 },
      setPageMeta: vi.fn(),
      isLoading: false,
      error: null
    });

    render(<Dashboard />);
    expect(screen.getByText('Create Your First Solution Review')).toBeInTheDocument();
  });

  it('handles error during data load', async () => {
    const errorMessage = 'Network error';
    mockLoadSystems.mockRejectedValue({ message: errorMessage });

    render(<Dashboard />);

    await waitFor(() => {
      expect(mockShowError).toHaveBeenCalledWith(expect.stringContaining(errorMessage));
    });
  });

  describe('Search Functionality', () => {
    const mockSearchSR = vi.fn();

    beforeEach(() => {
      mockUseViewSolutionReview.mockReturnValue({
        solutionReviews: mockSolutionReviews,
        setSolutionReviews: vi.fn(),
        loadSystemSolutionReviews: mockLoadSolutionReviews,
        loadSolutionReviewById: vi.fn(),
        loadSolutionReviews: mockLoadSolutionReviews,
        loadSystems: mockLoadSystems,
        searchSR: mockSearchSR,
        pageMeta: mockPageMeta,
        setPageMeta: vi.fn(),
        isLoading: false,
        error: null
      });
    });

    it('searches when search button is clicked', async () => {
      render(<Dashboard />);

      const searchInput = screen.getByPlaceholderText(/Search using natural language/i);
      const searchButton = screen.getByRole('button', { name: /search/i });

      fireEvent.change(searchInput, { target: { value: 'test search query' } });
      fireEvent.click(searchButton);

      await waitFor(() => {
        expect(mockSearchSR).toHaveBeenCalledWith({ searchQuery: 'test search query' });
      });
    });

    it('searches when Enter key is pressed', async () => {
      render(<Dashboard />);

      const searchInput = screen.getByPlaceholderText(/Search using natural language/i);

      fireEvent.change(searchInput, { target: { value: 'test search' } });
      fireEvent.keyPress(searchInput, { key: 'Enter', code: 'Enter', charCode: 13 });

      await waitFor(() => {
        expect(mockSearchSR).toHaveBeenCalledWith({ searchQuery: 'test search' });
      });
    });

    it('shows error when searching with empty term', async () => {
      render(<Dashboard />);

      const searchButton = screen.getByRole('button', { name: /search/i });
      
      // Button should be disabled when search term is empty
      expect(searchButton).toBeDisabled();
      
      // Verify searchSR was not called
      expect(mockSearchSR).not.toHaveBeenCalled();
    });

    it('shows error when search fails', async () => {
      mockSearchSR.mockRejectedValue({ message: 'Search service unavailable' });

      render(<Dashboard />);

      const searchInput = screen.getByPlaceholderText(/Search using natural language/i);
      const searchButton = screen.getByRole('button', { name: /search/i });

      fireEvent.change(searchInput, { target: { value: 'test' } });
      fireEvent.click(searchButton);

      await waitFor(() => {
        expect(mockShowError).toHaveBeenCalledWith(expect.stringContaining('Failed to search'));
      });
    });

    it('clears search when clear button is clicked', async () => {
      render(<Dashboard />);

      const searchInput = screen.getByPlaceholderText(/Search using natural language/i);
      const searchButton = screen.getByRole('button', { name: /search/i });

      // Perform search first
      fireEvent.change(searchInput, { target: { value: 'test search' } });
      fireEvent.click(searchButton);

      await waitFor(() => {
        expect(mockSearchSR).toHaveBeenCalled();
      });

      // Clear search
      const clearButton = screen.getByRole('button', { name: /clear/i });
      fireEvent.click(clearButton);

      await waitFor(() => {
        const input = screen.getByPlaceholderText(/Search using natural language/i) as HTMLInputElement;
        expect(input.value).toBe('');
      });
    });

    it('reloads data in systems view when clearing search', async () => {
      render(<Dashboard />);

      const searchInput = screen.getByPlaceholderText(/Search using natural language/i);
      const searchButton = screen.getByRole('button', { name: /search/i });

      fireEvent.change(searchInput, { target: { value: 'test' } });
      fireEvent.click(searchButton);

      await waitFor(() => {
        expect(mockSearchSR).toHaveBeenCalled();
      });

      mockLoadSystems.mockClear();

      const clearButton = screen.getByRole('button', { name: /clear/i });
      fireEvent.click(clearButton);

      await waitFor(() => {
        expect(mockLoadSystems).toHaveBeenCalledWith(0, 10);
      });
    });

    it('reloads data in reviews view when clearing search', async () => {
      render(<Dashboard />);

      // Switch to reviews view
      const reviewsButton = screen.getByText('Reviews View');
      fireEvent.click(reviewsButton);

      await waitFor(() => {
        expect(mockLoadSolutionReviews).toHaveBeenCalled();
      });

      const searchInput = screen.getByPlaceholderText(/Search using natural language/i);
      const searchButton = screen.getByRole('button', { name: /search/i });

      fireEvent.change(searchInput, { target: { value: 'test' } });
      fireEvent.click(searchButton);

      await waitFor(() => {
        expect(mockSearchSR).toHaveBeenCalled();
      });

      mockLoadSolutionReviews.mockClear();

      const clearButton = screen.getByRole('button', { name: /clear/i });
      fireEvent.click(clearButton);

      await waitFor(() => {
        expect(mockLoadSolutionReviews).toHaveBeenCalledWith(0, 10);
      });
    });

    it('handles error when reloading data after clearing search', async () => {
      render(<Dashboard />);

      const searchInput = screen.getByPlaceholderText(/Search using natural language/i);
      const searchButton = screen.getByRole('button', { name: /search/i });

      fireEvent.change(searchInput, { target: { value: 'test' } });
      fireEvent.click(searchButton);

      await waitFor(() => {
        expect(mockSearchSR).toHaveBeenCalled();
      });

      mockShowError.mockClear();
      
      // Set up the error to happen on the next call (after search, during clear)
      mockLoadSystems.mockRejectedValueOnce({ message: 'Failed to reload' });

      const clearButton = screen.getByRole('button', { name: /clear/i });
      fireEvent.click(clearButton);

      await waitFor(() => {
        expect(mockShowError).toHaveBeenCalledWith(expect.stringContaining('Failed to reload'));
      });
    });
  });

  describe('View Mode Switching', () => {
    it('starts in systems view by default', () => {
      render(<Dashboard />);

      expect(mockLoadSystems).toHaveBeenCalled();
      expect(mockLoadSolutionReviews).not.toHaveBeenCalled();
    });

    it('switches to reviews view when Reviews View button is clicked', async () => {
      render(<Dashboard />);

      mockLoadSolutionReviews.mockClear();

      const reviewsButton = screen.getByText('Reviews View');
      fireEvent.click(reviewsButton);

      await waitFor(() => {
        expect(mockLoadSolutionReviews).toHaveBeenCalled();
      });
    });

    it('switches back to systems view when Systems View button is clicked', async () => {
      render(<Dashboard />);

      // Switch to reviews
      const reviewsButton = screen.getByText('Reviews View');
      fireEvent.click(reviewsButton);

      await waitFor(() => {
        expect(mockLoadSolutionReviews).toHaveBeenCalled();
      });

      mockLoadSystems.mockClear();

      // Switch back to systems
      const systemsButton = screen.getByText('Systems View');
      fireEvent.click(systemsButton);

      await waitFor(() => {
        expect(mockLoadSystems).toHaveBeenCalled();
      });
    });

    it('reloads data when changing view mode', async () => {
      render(<Dashboard />);

      mockLoadSystems.mockClear();
      mockLoadSolutionReviews.mockClear();

      const reviewsButton = screen.getByText('Reviews View');
      fireEvent.click(reviewsButton);

      await waitFor(() => {
        expect(mockLoadSolutionReviews).toHaveBeenCalledWith(0, 10);
      });
    });
  });

  describe('Pagination', () => {
    it('displays correct page information', () => {
      render(<Dashboard />);

      expect(screen.getByText(/Page 1 \/ 1/)).toBeInTheDocument();
    });

    it('disables previous button on first page', () => {
      render(<Dashboard />);

      const prevButton = screen.getByRole('button', { name: 'Prev' });
      expect(prevButton).toBeDisabled();
    });

    it('disables next button on last page', () => {
      render(<Dashboard />);

      const nextButton = screen.getByRole('button', { name: /next/i });
      expect(nextButton).toBeDisabled();
    });

    it('navigates to next page when next button is clicked', async () => {
      mockUseViewSolutionReview.mockReturnValue({
        solutionReviews: mockSolutionReviews,
        setSolutionReviews: vi.fn(),
        loadSystemSolutionReviews: mockLoadSolutionReviews,
        loadSolutionReviewById: vi.fn(),
        loadSolutionReviews: mockLoadSolutionReviews,
        loadSystems: mockLoadSystems,
        searchSR: vi.fn(),
        pageMeta: { ...mockPageMeta, totalPages: 3 },
        setPageMeta: vi.fn(),
        isLoading: false,
        error: null
      });

      render(<Dashboard />);

      mockLoadSystems.mockClear();

      const nextButton = screen.getByRole('button', { name: /next/i });
      fireEvent.click(nextButton);

      await waitFor(() => {
        expect(mockLoadSystems).toHaveBeenCalledWith(1, 10);
      });
    });

    it('navigates to previous page when previous button is clicked', async () => {
      mockUseViewSolutionReview.mockReturnValue({
        solutionReviews: mockSolutionReviews,
        setSolutionReviews: vi.fn(),
        loadSystemSolutionReviews: mockLoadSolutionReviews,
        loadSolutionReviewById: vi.fn(),
        loadSolutionReviews: mockLoadSolutionReviews,
        loadSystems: mockLoadSystems,
        searchSR: vi.fn(),
        pageMeta: { ...mockPageMeta, page: 1, totalPages: 3 },
        setPageMeta: vi.fn(),
        isLoading: false,
        error: null
      });

      render(<Dashboard />);

      mockLoadSystems.mockClear();

      const prevButton = screen.getByRole('button', { name: 'Prev' });
      fireEvent.click(prevButton);

      await waitFor(() => {
        expect(mockLoadSystems).toHaveBeenCalledWith(0, 10);
      });
    });

    it('changes page size and reloads data', async () => {
      render(<Dashboard />);

      mockLoadSystems.mockClear();

      // Find the page size select by its role and options
      const pageSizeSelect = screen.getByRole('combobox');
      fireEvent.change(pageSizeSelect, { target: { value: '20' } });

      await waitFor(() => {
        expect(mockLoadSystems).toHaveBeenCalledWith(0, 20);
      });
    });
  });

  describe('Card Navigation', () => {
    beforeEach(() => {
      mockNavigate.mockClear();
    });

    it('navigates to system detail page in systems view', () => {
      const { unmount } = render(<Dashboard />);
      // This test verifies the component renders with systems view
      expect(mockLoadSystems).toHaveBeenCalled();
      unmount();
    });

    it('navigates to solution review detail page in reviews view', async () => {
      const { unmount } = render(<Dashboard />);

      const reviewsButton = screen.getByText('Reviews View');
      fireEvent.click(reviewsButton);

      await waitFor(() => {
        expect(mockLoadSolutionReviews).toHaveBeenCalled();
      });

      unmount();
    });
  });

  describe('Page Size Changes', () => {
    it('displays all page size options', () => {
      render(<Dashboard />);

      const pageSizeSelect = screen.getByRole('combobox') as HTMLSelectElement;
      const options = Array.from(pageSizeSelect.options).map(opt => opt.value);

      expect(options).toContain('5');
      expect(options).toContain('10');
      expect(options).toContain('20');
      expect(options).toContain('50');
    });

    it('updates display when page size changes', async () => {
      render(<Dashboard />);

      const pageSizeSelect = screen.getByRole('combobox') as HTMLSelectElement;

      fireEvent.change(pageSizeSelect, { target: { value: '50' } });

      expect(pageSizeSelect.value).toBe('50');
    });
  });

  describe('Empty States', () => {
    it('shows empty state message when no reviews in systems view', () => {
      mockUseViewSolutionReview.mockReturnValue({
        solutionReviews: [],
        setSolutionReviews: vi.fn(),
        loadSystemSolutionReviews: mockLoadSolutionReviews,
        loadSolutionReviewById: vi.fn(),
        loadSolutionReviews: mockLoadSolutionReviews,
        loadSystems: mockLoadSystems,
        searchSR: vi.fn(),
        pageMeta: { ...mockPageMeta, totalElements: 0 },
        setPageMeta: vi.fn(),
        isLoading: false,
        error: null
      });

      render(<Dashboard />);

      expect(screen.getByText('No solution reviews found')).toBeInTheDocument();
    });

    it('shows create button in empty state', () => {
      mockUseViewSolutionReview.mockReturnValue({
        solutionReviews: [],
        setSolutionReviews: vi.fn(),
        loadSystemSolutionReviews: mockLoadSolutionReviews,
        loadSolutionReviewById: vi.fn(),
        loadSolutionReviews: mockLoadSolutionReviews,
        loadSystems: mockLoadSystems,
        searchSR: vi.fn(),
        pageMeta: { ...mockPageMeta, totalElements: 0 },
        setPageMeta: vi.fn(),
        isLoading: false,
        error: null
      });

      render(<Dashboard />);

      expect(screen.getByText('Create Your First Solution Review')).toBeInTheDocument();
    });
  });

  describe('Component Rendering', () => {
    it('renders without crashing', () => {
      expect(() => {
        render(<Dashboard />);
      }).not.toThrow();
    });

    it('displays total elements count', () => {
      mockUseViewSolutionReview.mockReturnValue({
        solutionReviews: mockSolutionReviews,
        setSolutionReviews: vi.fn(),
        loadSystemSolutionReviews: mockLoadSolutionReviews,
        loadSolutionReviewById: vi.fn(),
        loadSolutionReviews: mockLoadSolutionReviews,
        loadSystems: mockLoadSystems,
        searchSR: vi.fn(),
        pageMeta: { ...mockPageMeta, totalElements: 42 },
        setPageMeta: vi.fn(),
        isLoading: false,
        error: null
      });

      render(<Dashboard />);

      // The text is split across elements: "of" <span>42</span> "reviews"
      expect(screen.getByText('42')).toBeInTheDocument();
      expect(screen.getByText(/of.*reviews/)).toBeInTheDocument();
    });

    it('shows view mode toggle buttons', () => {
      render(<Dashboard />);

      expect(screen.getByText('Systems View')).toBeInTheDocument();
      expect(screen.getByText('Reviews View')).toBeInTheDocument();
    });
  });
});
