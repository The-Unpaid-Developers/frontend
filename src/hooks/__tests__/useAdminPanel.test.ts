import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useAdminPanel } from '../useAdminPanel';
import { getSRsByStateAPI, addConcernsToSRAPI } from '../../services/solutionReviewApi';
import { mockConsole } from '../../test/test-utils';

// Mock the API functions
vi.mock('../../services/solutionReviewApi', () => ({
  getSRsByStateAPI: vi.fn(),
  addConcernsToSRAPI: vi.fn(),
}));

const mockedGetSRsByStateAPI = vi.mocked(getSRsByStateAPI);
const mockedAddConcernsToSRAPI = vi.mocked(addConcernsToSRAPI);

describe('useAdminPanel', () => {
  const mockSolutionReviews = [
    {
      id: '1',
      title: 'Test Review 1',
      description: 'Test description 1',
      status: 'SUBMITTED',
      createdAt: '2023-01-01T00:00:00Z',
      updatedAt: '2023-01-01T00:00:00Z',
      systems: [],
      reviews: []
    },
    {
      id: '2',
      title: 'Test Review 2',
      description: 'Test description 2',
      status: 'SUBMITTED',
      createdAt: '2023-01-02T00:00:00Z',
      updatedAt: '2023-01-02T00:00:00Z',
      systems: [],
      reviews: []
    }
  ];

  const mockPagedResponse = {
    content: mockSolutionReviews,
    number: 0,
    size: 10,
    totalPages: 1,
    totalElements: 2
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockConsole();
    // Ensure console.error is properly spied on
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  describe('initial state', () => {
    it('should have correct initial state', () => {
      const { result } = renderHook(() => useAdminPanel());

      expect(result.current.solutionReviews).toEqual([]);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBe(null);
      expect(result.current.pageMeta).toEqual({
        page: 0,
        size: 10,
        totalPages: 0,
        totalElements: 0
      });
      expect(typeof result.current.loadSubmittedSolutionReviews).toBe('function');
      expect(typeof result.current.addConcernsToSR).toBe('function');
    });
  });

  describe('loadSubmittedSolutionReviews', () => {
    it('should load solution reviews successfully with paged response', async () => {
      mockedGetSRsByStateAPI.mockResolvedValue(mockPagedResponse);

      const { result } = renderHook(() => useAdminPanel());

      await act(async () => {
        await result.current.loadSubmittedSolutionReviews(0, 10);
      });

      expect(mockedGetSRsByStateAPI).toHaveBeenCalledWith('SUBMITTED', 0, 10);
      expect(result.current.solutionReviews).toEqual(mockSolutionReviews);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBe(null);
      expect(result.current.pageMeta).toEqual({
        page: 0,
        size: 10,
        totalPages: 1,
        totalElements: 2
      });
    });

    it('should handle non-paged response', async () => {
      const nonPagedResponse = {
        content: mockSolutionReviews
      };
      mockedGetSRsByStateAPI.mockResolvedValue(nonPagedResponse);

      const { result } = renderHook(() => useAdminPanel());

      await act(async () => {
        await result.current.loadSubmittedSolutionReviews(0, 10);
      });

      expect(result.current.solutionReviews).toEqual(mockSolutionReviews);
      expect(result.current.pageMeta).toEqual({
        page: 0,
        size: 2,
        totalPages: 1,
        totalElements: 2
      });
    });

    it('should set loading state during API call', async () => {
      // Create a promise that we can control
      let resolvePromise: (value: any) => void;
      const controlledPromise = new Promise((resolve) => {
        resolvePromise = resolve;
      });
      
      mockedGetSRsByStateAPI.mockReturnValue(controlledPromise);

      const { result } = renderHook(() => useAdminPanel());

      // Start the async operation
      act(() => {
        result.current.loadSubmittedSolutionReviews(0, 10);
      });

      // Check that loading is true
      expect(result.current.isLoading).toBe(true);

      // Resolve the promise
      await act(async () => {
        resolvePromise!(mockPagedResponse);
        await controlledPromise;
      });

      // Check that loading is false
      expect(result.current.isLoading).toBe(false);
    });

    it('should handle API errors', async () => {
      const mockError = new Error('API Error');
      mockedGetSRsByStateAPI.mockRejectedValue(mockError);

      const { result } = renderHook(() => useAdminPanel());

      await act(async () => {
        try {
          await result.current.loadSubmittedSolutionReviews(0, 10);
        } catch (error) {
          // Expected to throw
        }
      });

      expect(result.current.error).toBe('API Error');
      expect(result.current.isLoading).toBe(false);
      expect(console.error).toHaveBeenCalledWith('Error loading review data:', mockError);
    });

    it('should handle undefined response', async () => {
      mockedGetSRsByStateAPI.mockResolvedValue(undefined);

      const { result } = renderHook(() => useAdminPanel());

      await act(async () => {
        await result.current.loadSubmittedSolutionReviews(0, 10);
      });

      expect(result.current.solutionReviews).toEqual([]);
      expect(result.current.pageMeta).toEqual({
        page: 0,
        size: 0,
        totalPages: 1,
        totalElements: 0
      });
    });
  });

  describe('addConcernsToSR', () => {
    const mockConcerns = [
      { id: '1', text: 'Concern 1', severity: 'high' },
      { id: '2', text: 'Concern 2', severity: 'medium' }
    ];

    const mockSolutionOverview = {
      id: 'overview-1',
      title: 'Test Overview',
      description: 'Test description'
    };

    it('should add concerns to solution review successfully', async () => {
      const mockResponse = { success: true, id: 'sr-1' };
      mockedAddConcernsToSRAPI.mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useAdminPanel());

      let response: any;
      await act(async () => {
        response = await result.current.addConcernsToSR('sr-1', mockConcerns, mockSolutionOverview);
      });

      expect(mockedAddConcernsToSRAPI).toHaveBeenCalledWith({
        id: 'sr-1',
        solutionOverview: {
          ...mockSolutionOverview,
          concerns: mockConcerns
        }
      });
      expect(response).toEqual(mockResponse);
    });

    it('should throw error when solution overview is missing', async () => {
      const { result } = renderHook(() => useAdminPanel());

      await act(async () => {
        await expect(
          result.current.addConcernsToSR('sr-1', mockConcerns, null)
        ).rejects.toThrow('Solution overview is required to add concerns');
      });

      expect(mockedAddConcernsToSRAPI).not.toHaveBeenCalled();
    });

    it('should throw error when solution overview is undefined', async () => {
      const { result } = renderHook(() => useAdminPanel());

      await act(async () => {
        await expect(
          result.current.addConcernsToSR('sr-1', mockConcerns, undefined)
        ).rejects.toThrow('Solution overview is required to add concerns');
      });

      expect(mockedAddConcernsToSRAPI).not.toHaveBeenCalled();
    });

    it('should handle API errors when adding concerns', async () => {
      const mockError = new Error('Failed to add concerns');
      mockedAddConcernsToSRAPI.mockRejectedValue(mockError);

      const { result } = renderHook(() => useAdminPanel());

      await act(async () => {
        await expect(
          result.current.addConcernsToSR('sr-1', mockConcerns, mockSolutionOverview)
        ).rejects.toThrow('Failed to add concerns');
      });
    });

    it('should preserve existing solution overview properties when adding concerns', async () => {
      const mockResponse = { success: true };
      mockedAddConcernsToSRAPI.mockResolvedValue(mockResponse);

      const solutionOverviewWithExtraProps = {
        ...mockSolutionOverview,
        existingProp: 'should be preserved',
        existingConcerns: ['old concern']
      };

      const { result } = renderHook(() => useAdminPanel());

      await act(async () => {
        await result.current.addConcernsToSR('sr-1', mockConcerns, solutionOverviewWithExtraProps);
      });

      expect(mockedAddConcernsToSRAPI).toHaveBeenCalledWith({
        id: 'sr-1',
        solutionOverview: {
          ...solutionOverviewWithExtraProps,
          concerns: mockConcerns // Should override existing concerns
        }
      });
    });
  });

  describe('error handling', () => {
    it('should reset error state on successful API call', async () => {
      // First, set an error state
      const mockError = new Error('Initial error');
      mockedGetSRsByStateAPI.mockRejectedValueOnce(mockError);

      const { result } = renderHook(() => useAdminPanel());

      // Trigger error
      await act(async () => {
        try {
          await result.current.loadSubmittedSolutionReviews(0, 10);
        } catch (error) {
          // Expected to throw
        }
      });

      expect(result.current.error).toBe('Initial error');

      // Now make a successful call
      mockedGetSRsByStateAPI.mockResolvedValueOnce(mockPagedResponse);

      await act(async () => {
        await result.current.loadSubmittedSolutionReviews(0, 10);
      });

      // Error should be cleared on successful call
      expect(result.current.error).toBe(null);
    });
  });
});