import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '../../test/utils';
import { Dashboard } from '../Dashboard';
import { useViewSolutionReview } from '../../hooks/useViewSolutionReview';
import { useToast } from '../../context/ToastContext';

// Mock react-router-dom
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => vi.fn(),
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
      pageMeta: mockPageMeta,
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
    expect(screen.getByPlaceholderText('Search systems by solution name, project, or business unit...')).toBeInTheDocument();
  });

  it('should load systems on mount', () => {
    render(<Dashboard />);

    expect(mockLoadSystems).toHaveBeenCalled();
  });
});
