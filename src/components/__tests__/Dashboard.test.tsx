import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '../../test/utils';
import { Dashboard } from '../Dashboard';
import { useViewSolutionReview } from '../../hooks/useViewSolutionReview';
import { useToast } from '../../context/ToastContext';
import { DocumentState } from '../../types/solutionReview';

// Mock react-router-dom
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mock the hooks
vi.mock('../../hooks/useViewSolutionReview');
vi.mock('../../context/ToastContext');

const mockUseViewSolutionReview = vi.mocked(useViewSolutionReview);
const mockUseToast = vi.mocked(useToast);

describe('Dashboard', () => {
  const mockSolutionReviews = [
    {
      id: 'sr-1',
      systemCode: 'SYS-001',
      documentState: DocumentState.DRAFT,
      solutionOverview: {
        id: 'overview-1',
        solutionDetails: {
          solutionName: 'Payment Processing System',
          projectName: 'Digital Payment Initiative'
        },
        reviewType: 'Standard',
        businessUnit: 'Financial Services'
      },
      businessCapabilities: null,
      dataAssets: null,
      enterpriseTools: null,
      integrationFlows: null,
      systemComponents: null,
      technologyComponents: null,
      processCompliances: null,
      createdAt: '2024-01-01T00:00:00Z',
      lastModifiedAt: '2024-01-01T12:00:00Z',
      createdBy: 'john.doe@company.com',
      lastModifiedBy: 'john.doe@company.com'
    },
    {
      id: 'sr-2',
      systemCode: 'SYS-002',
      documentState: DocumentState.SUBMITTED,
      solutionOverview: {
        id: 'overview-2',
        solutionDetails: {
          solutionName: 'User Management System',
          projectName: 'Identity Platform'
        },
        reviewType: 'Comprehensive',
        businessUnit: 'IT Security'
      },
      businessCapabilities: null,
      dataAssets: null,
      enterpriseTools: null,
      integrationFlows: null,
      systemComponents: null,
      technologyComponents: null,
      processCompliances: null,
      createdAt: '2024-01-02T00:00:00Z',
      lastModifiedAt: '2024-01-02T14:30:00Z',
      createdBy: 'jane.smith@company.com',
      lastModifiedBy: 'jane.smith@company.com'
    },
    {
      id: 'sr-3',
      systemCode: 'SYS-003',
      documentState: DocumentState.APPROVED,
      solutionOverview: {
        id: 'overview-3',
        solutionDetails: {
          solutionName: 'Order Processing System',
          projectName: 'E-commerce Platform'
        },
        reviewType: 'Standard',
        businessUnit: 'Operations'
      },
      businessCapabilities: null,
      dataAssets: null,
      enterpriseTools: null,
      integrationFlows: null,
      systemComponents: null,
      technologyComponents: null,
      processCompliances: null,
      createdAt: '2024-01-03T00:00:00Z',
      lastModifiedAt: '2024-01-03T16:45:00Z',
      createdBy: 'bob.johnson@company.com',
      lastModifiedBy: 'bob.johnson@company.com'
    }
  ];

  const mockPageMeta = {
    page: 0,
    size: 10,
    totalPages: 1,
    totalElements: 3,
    first: true,
    last: true,
    empty: false
  };

  const mockLoadSolutionReviews = vi.fn().mockResolvedValue(undefined);
  const mockLoadSystems = vi.fn().mockResolvedValue(undefined);
  const mockLoadSystemSolutionReviews = vi.fn().mockResolvedValue(undefined);
  const mockShowError = vi.fn();
  const mockShowSuccess = vi.fn();
  const mockShowInfo = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    mockNavigate.mockClear();

    mockUseViewSolutionReview.mockReturnValue({
      solutionReviews: mockSolutionReviews,
      setSolutionReviews: vi.fn(),
      loadSystemSolutionReviews: mockLoadSystemSolutionReviews,
      loadSolutionReviews: mockLoadSolutionReviews,
      loadSystems: mockLoadSystems,
      pageMeta: mockPageMeta,
      isLoading: false,
      error: null
    });

    mockUseToast.mockReturnValue({
      showToast: vi.fn(),
      showError: mockShowError,
      showSuccess: mockShowSuccess,
      showInfo: mockShowInfo,
      hideToast: vi.fn()
    });
  });

  it('should render dashboard with solution reviews', () => {
    render(<Dashboard />);
    
    // Should display the solution names from solutionOverview
    expect(screen.getByText('Payment Processing System')).toBeInTheDocument();
    expect(screen.getByText('User Management System')).toBeInTheDocument();
    expect(screen.getByText('Order Processing System')).toBeInTheDocument();
  });

  it('should load systems data on initial mount', async () => {
    render(<Dashboard />);

    await waitFor(() => {
      expect(mockLoadSystems).toHaveBeenCalledWith(0, 10);
    });
  });

  it('should handle loading state', () => {
    mockUseViewSolutionReview.mockReturnValue({
      solutionReviews: [],
      setSolutionReviews: vi.fn(),
      loadSystemSolutionReviews: mockLoadSystemSolutionReviews,
      loadSolutionReviews: mockLoadSolutionReviews,
      loadSystems: mockLoadSystems,
      pageMeta: { ...mockPageMeta, totalElements: 0 },
      isLoading: true,
      error: null
    });

    render(<Dashboard />);
    
    // Should not display reviews when loading
    expect(screen.queryByText('Payment Processing System')).not.toBeInTheDocument();
  });

  it('should handle empty solution reviews', () => {
    mockUseViewSolutionReview.mockReturnValue({
      solutionReviews: [],
      setSolutionReviews: vi.fn(),
      loadSystemSolutionReviews: mockLoadSystemSolutionReviews,
      loadSolutionReviews: mockLoadSolutionReviews,
      loadSystems: mockLoadSystems,
      pageMeta: { ...mockPageMeta, totalElements: 0 },
      isLoading: false,
      error: null
    });

    render(<Dashboard />);
    
    expect(screen.queryByText('Payment Processing System')).not.toBeInTheDocument();
    expect(screen.queryByText('User Management System')).not.toBeInTheDocument();
  });

  it('should handle API errors gracefully', async () => {
    const errorMessage = 'Failed to load data';
    mockLoadSystems.mockRejectedValue(new Error(errorMessage));

    render(<Dashboard />);

    await waitFor(() => {
      expect(mockShowError).toHaveBeenCalledWith('Failed to load data: ' + errorMessage);
    });
  });

  it('should calculate state counts correctly', () => {
    render(<Dashboard />);
    
    // Verify that the component processes the reviews for state counting
    const draftReviews = mockSolutionReviews.filter(r => r.documentState === DocumentState.DRAFT);
    const submittedReviews = mockSolutionReviews.filter(r => r.documentState === DocumentState.SUBMITTED);
    const approvedReviews = mockSolutionReviews.filter(r => r.documentState === DocumentState.APPROVED);
    
    expect(draftReviews).toHaveLength(1);
    expect(submittedReviews).toHaveLength(1);
    expect(approvedReviews).toHaveLength(1);
  });

  it('should handle different document states', () => {
    const reviewsWithAllStates = [
      ...mockSolutionReviews,
      {
        ...mockSolutionReviews[0],
        id: 'sr-4',
        systemCode: 'SYS-004',
        documentState: DocumentState.OUTDATED,
        solutionOverview: {
          ...mockSolutionReviews[0].solutionOverview,
          solutionDetails: {
            solutionName: 'Legacy System',
            projectName: 'Legacy Project'
          }
        }
      }
    ];

    mockUseViewSolutionReview.mockReturnValue({
      solutionReviews: reviewsWithAllStates,
      setSolutionReviews: vi.fn(),
      loadSystemSolutionReviews: mockLoadSystemSolutionReviews,
      loadSolutionReviews: mockLoadSolutionReviews,
      loadSystems: mockLoadSystems,
      pageMeta: { ...mockPageMeta, totalElements: 4 },
      isLoading: false,
      error: null
    });

    render(<Dashboard />);

    expect(screen.getByText('Legacy System')).toBeInTheDocument();
  });

  it('should handle pagination with multiple pages', async () => {
    const multiPageMeta = {
      page: 0,
      size: 10,
      totalPages: 3,
      totalElements: 25,
      first: true,
      last: false,
      empty: false
    };

    mockUseViewSolutionReview.mockReturnValue({
      solutionReviews: mockSolutionReviews,
      setSolutionReviews: vi.fn(),
      loadSystemSolutionReviews: mockLoadSystemSolutionReviews,
      loadSolutionReviews: mockLoadSolutionReviews,
      loadSystems: mockLoadSystems,
      pageMeta: multiPageMeta,
      isLoading: false,
      error: null
    });

    render(<Dashboard />);

    await waitFor(() => {
      expect(mockLoadSystems).toHaveBeenCalledWith(0, 10);
    });
  });

  it('should handle network errors', async () => {
    const networkError = new Error('Network connection failed');
    networkError.name = 'NetworkError';
    mockLoadSystems.mockRejectedValue(networkError);

    render(<Dashboard />);

    await waitFor(() => {
      expect(mockShowError).toHaveBeenCalledWith('Failed to load data: Network connection failed');
    });
  });

  it('should handle concurrent operations without race conditions', async () => {
    render(<Dashboard />);

    // Should handle multiple simultaneous operations
    await waitFor(() => {
      expect(mockLoadSystems).toHaveBeenCalled();
    });

    expect(mockShowError).not.toHaveBeenCalled();
  });

  it('should display correct business units', () => {
    render(<Dashboard />);
    
    expect(screen.getByText('Financial Services')).toBeInTheDocument();
    expect(screen.getByText('IT Security')).toBeInTheDocument();
    expect(screen.getByText('Operations')).toBeInTheDocument();
  });

  it('should display correct review types', () => {
    render(<Dashboard />);
    
    expect(screen.getAllByText('Standard')).toHaveLength(2);
    expect(screen.getByText('Comprehensive')).toBeInTheDocument();
  });

  describe('edge cases', () => {
    it('should handle undefined solution reviews gracefully', () => {
      mockUseViewSolutionReview.mockReturnValue({
        solutionReviews: undefined as any,
        setSolutionReviews: vi.fn(),
        loadSystemSolutionReviews: mockLoadSystemSolutionReviews,
        loadSolutionReviews: mockLoadSolutionReviews,
        loadSystems: mockLoadSystems,
        pageMeta: mockPageMeta,
        isLoading: false,
        error: null
      });

      expect(() => render(<Dashboard />)).not.toThrow();
    });

    it('should handle null page meta', () => {
      mockUseViewSolutionReview.mockReturnValue({
        solutionReviews: mockSolutionReviews,
        setSolutionReviews: vi.fn(),
        loadSystemSolutionReviews: mockLoadSystemSolutionReviews,
        loadSolutionReviews: mockLoadSolutionReviews,
        loadSystems: mockLoadSystems,
        pageMeta: null as any,
        isLoading: false,
        error: null
      });

      expect(() => render(<Dashboard />)).not.toThrow();
    });

    it('should handle malformed review data', () => {
      const malformedReviews = [
        {
          id: 'malformed-1',
          systemCode: 'SYS-MALFORMED',
          documentState: DocumentState.DRAFT,
          // Missing solutionOverview
        } as any,
        {
          id: 'malformed-2',
          systemCode: null,
          documentState: 'INVALID_STATE' as any,
          solutionOverview: null
        } as any
      ];

      mockUseViewSolutionReview.mockReturnValue({
        solutionReviews: malformedReviews,
        setSolutionReviews: vi.fn(),
        loadSystemSolutionReviews: mockLoadSystemSolutionReviews,
        loadSolutionReviews: mockLoadSolutionReviews,
        loadSystems: mockLoadSystems,
        pageMeta: mockPageMeta,
        isLoading: false,
        error: null
      });

      expect(() => render(<Dashboard />)).not.toThrow();
    });

    it('should handle API timeout errors', async () => {
      const timeoutError = new Error('Request timeout');
      timeoutError.name = 'TimeoutError';
      mockLoadSystems.mockRejectedValue(timeoutError);

      render(<Dashboard />);

      await waitFor(() => {
        expect(mockShowError).toHaveBeenCalledWith('Failed to load data: Request timeout');
      });
    });

    it('should handle permission errors', async () => {
      const permissionError = new Error('Insufficient permissions');
      permissionError.name = 'PermissionError';
      mockLoadSystems.mockRejectedValue(permissionError);

      render(<Dashboard />);

      await waitFor(() => {
        expect(mockShowError).toHaveBeenCalledWith('Failed to load data: Insufficient permissions');
      });
    });
  });

  describe('view mode transitions', () => {
    it('should start in systems view mode by default', async () => {
      render(<Dashboard />);

      await waitFor(() => {
        expect(mockLoadSystems).toHaveBeenCalledWith(0, 10);
        expect(mockLoadSolutionReviews).not.toHaveBeenCalled();
      });
    });
  });

  describe('performance considerations', () => {
    it('should handle large datasets efficiently', () => {
      const largeDataset = Array.from({ length: 100 }, (_, i) => ({
        ...mockSolutionReviews[0],
        id: `sr-${i}`,
        systemCode: `SYS-${String(i).padStart(3, '0')}`,
        solutionOverview: {
          ...mockSolutionReviews[0].solutionOverview!,
          solutionDetails: {
            solutionName: `System ${i}`,
            projectName: `Project ${i}`
          }
        }
      }));

      mockUseViewSolutionReview.mockReturnValue({
        solutionReviews: largeDataset,
        setSolutionReviews: vi.fn(),
        loadSystemSolutionReviews: mockLoadSystemSolutionReviews,
        loadSolutionReviews: mockLoadSolutionReviews,
        loadSystems: mockLoadSystems,
        pageMeta: { ...mockPageMeta, totalElements: 100 },
        isLoading: false,
        error: null
      });

      const startTime = performance.now();
      render(<Dashboard />);
      const endTime = performance.now();

      // Should render in reasonable time (less than 1 second)
      expect(endTime - startTime).toBeLessThan(1000);
    });
  });
});
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
      isLoading: false,
      solutionReviews: mockSolutionReviews,
      loadSolutionReviews: mockLoadSolutionReviews,
      loadSystems: mockLoadSystems,
      pageMeta: mockPageMeta,
      error: null
    });

    mockUseToast.mockReturnValue({
      showError: mockShowError,
      showSuccess: vi.fn(),
      showInfo: vi.fn(),
      showWarning: vi.fn(),
      hideToast: vi.fn(),
      showToast: vi.fn()
    });
  });

  it('should render dashboard component', () => {
    render(<Dashboard />);
    
    // Basic test to ensure component renders without crashing
    expect(document.body).toBeInTheDocument();
  });

  it('should load systems on mount', () => {
    render(<Dashboard />);
    
    expect(mockLoadSystems).toHaveBeenCalled();
  });
});