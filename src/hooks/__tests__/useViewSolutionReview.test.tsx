import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useViewSolutionReview } from '../useViewSolutionReview';
import {
  getAllSolutionReviewsAPI,
  getSystemSolutionReviewsAPI,
  getSolutionReviewByIdAPI,
  getAllSystemsAPI,
} from '../../services/solutionReviewApi';
import { mockConsole } from '../../test/test-utils';
import { createSolutionReview } from '../../__tests__/testFactories';

// Mock the API functions
vi.mock('../../services/solutionReviewApi', () => ({
  getAllSolutionReviewsAPI: vi.fn(),
  getSystemSolutionReviewsAPI: vi.fn(),
  getSolutionReviewByIdAPI: vi.fn(),
  getAllSystemsAPI: vi.fn(),
}));

const mockedGetAllSolutionReviewsAPI = vi.mocked(getAllSolutionReviewsAPI);
const mockedGetSystemSolutionReviewsAPI = vi.mocked(getSystemSolutionReviewsAPI);
const mockedGetSolutionReviewByIdAPI = vi.mocked(getSolutionReviewByIdAPI);
const mockedGetAllSystemsAPI = vi.mocked(getAllSystemsAPI);

describe('useViewSolutionReview', () => {
  let consoleMock: ReturnType<typeof mockConsole>;

  const mockReviewData = createSolutionReview({
    id: 'test-review-id',
    systemCode: 'TEST-SYS',
  });

  const mockPagedResponse = {
    content: [mockReviewData],
    number: 0,
    size: 10,
    totalPages: 1,
    totalElements: 1,
  };

  beforeEach(() => {
    consoleMock = mockConsole();
    vi.clearAllMocks();
    mockedGetAllSolutionReviewsAPI.mockResolvedValue(mockPagedResponse);
    mockedGetSystemSolutionReviewsAPI.mockResolvedValue([mockReviewData]);
    mockedGetSolutionReviewByIdAPI.mockResolvedValue(mockReviewData);
    mockedGetAllSystemsAPI.mockResolvedValue(mockPagedResponse);
  });

  afterEach(() => {
    consoleMock.restore();
  });

  describe('initial state', () => {
    it('should initialize with default values', () => {
      const { result } = renderHook(() => useViewSolutionReview());

      expect(result.current).toBeTruthy();
      expect(result.current.solutionReviews).toEqual([]);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBe(null);
      expect(typeof result.current.loadSolutionReviews).toBe('function');
      expect(typeof result.current.loadSystemSolutionReviews).toBe('function');
      expect(typeof result.current.loadSolutionReviewById).toBe('function');
      expect(typeof result.current.loadSystems).toBe('function');
    });
  });

  describe('loadSolutionReviews', () => {
    it('should load all solution reviews successfully', async () => {
      const { result } = renderHook(() => useViewSolutionReview());

      await act(async () => {
        await result.current.loadSolutionReviews(0, 10);
      });

      expect(mockedGetAllSolutionReviewsAPI).toHaveBeenCalledWith(0, 10);
      expect(result.current.solutionReviews).toEqual([mockReviewData]);
      expect(result.current.isLoading).toBe(false);
    });

    it('should handle API errors', async () => {
      const errorMessage = 'Failed to fetch reviews';
      mockedGetAllSolutionReviewsAPI.mockRejectedValue(new Error(errorMessage));

      const { result } = renderHook(() => useViewSolutionReview());

      await act(async () => {
        try {
          await result.current.loadSolutionReviews(0, 10);
        } catch (error) {
          // Expected to throw
        }
      });

      expect(result.current.error).toBe(errorMessage);
      expect(result.current.isLoading).toBe(false);
    });
  });

  describe('loadSystemSolutionReviews', () => {
    it('should load system solution reviews successfully', async () => {
      const { result } = renderHook(() => useViewSolutionReview());

      await act(async () => {
        await result.current.loadSystemSolutionReviews('TEST-SYS');
      });

      expect(mockedGetSystemSolutionReviewsAPI).toHaveBeenCalledWith('TEST-SYS');
      expect(result.current.solutionReviews).toEqual([mockReviewData]);
      expect(result.current.isLoading).toBe(false);
    });
  });

  describe('loadSolutionReviewById', () => {
    it('should load specific solution review successfully', async () => {
      const { result } = renderHook(() => useViewSolutionReview());

      await act(async () => {
        await result.current.loadSolutionReviewById('test-id');
      });

      expect(mockedGetSolutionReviewByIdAPI).toHaveBeenCalledWith('test-id');
      expect(result.current.solutionReviews).toEqual([mockReviewData]);
      expect(result.current.isLoading).toBe(false);
    });
  });

  describe('loadSystems', () => {
    it('should load all systems successfully', async () => {
      const { result } = renderHook(() => useViewSolutionReview());

      await act(async () => {
        await result.current.loadSystems(0, 10);
      });

      expect(mockedGetAllSystemsAPI).toHaveBeenCalledWith(0, 10);
      expect(result.current.solutionReviews).toEqual([mockReviewData]);
      expect(result.current.isLoading).toBe(false);
    });
  });

  describe('loadSystemSolutionReviews error handling', () => {
    it('should handle API errors in loadSystemSolutionReviews', async () => {
      const errorMessage = 'System not found';
      mockedGetSystemSolutionReviewsAPI.mockRejectedValue(new Error(errorMessage));

      const { result } = renderHook(() => useViewSolutionReview());

      await act(async () => {
        try {
          await result.current.loadSystemSolutionReviews('NON-EXISTENT-SYS');
        } catch (error) {
          // Expected to throw
        }
      });

      expect(result.current.error).toBe(errorMessage);
      expect(result.current.isLoading).toBe(false);
    });
  });

  describe('loadSolutionReviewById error handling', () => {
    it('should handle API errors in loadSolutionReviewById', async () => {
      const errorMessage = 'Review not found';
      mockedGetSolutionReviewByIdAPI.mockRejectedValue(new Error(errorMessage));

      const { result } = renderHook(() => useViewSolutionReview());

      await act(async () => {
        try {
          await result.current.loadSolutionReviewById('NON-EXISTENT-ID');
        } catch (error) {
          // Expected to throw
        }
      });

      expect(result.current.error).toBe(errorMessage);
      expect(result.current.isLoading).toBe(false);
    });
  });

  describe('loadSystems error handling', () => {
    it('should handle API errors in loadSystems', async () => {
      const errorMessage = 'Systems service unavailable';
      mockedGetAllSystemsAPI.mockRejectedValue(new Error(errorMessage));

      const { result } = renderHook(() => useViewSolutionReview());

      await act(async () => {
        try {
          await result.current.loadSystems(0, 10);
        } catch (error) {
          // Expected to throw
        }
      });

      expect(result.current.error).toBe(errorMessage);
      expect(result.current.isLoading).toBe(false);
    });
  });

  describe('non-paged response handling', () => {
    it('should handle unpaged response structure without pagination data', async () => {
      // Mock a response with content array but without pagination metadata
      const nonPagedResponse = { 
        content: [mockReviewData],
        // Missing number, size, totalPages, totalElements - will use defaults
      };
      mockedGetAllSolutionReviewsAPI.mockResolvedValue(nonPagedResponse);

      const { result } = renderHook(() => useViewSolutionReview());

      await act(async () => {
        await result.current.loadSolutionReviews(0, 10);
      });

      expect(result.current.solutionReviews).toEqual([mockReviewData]);
      expect(result.current.pageMeta).toEqual({
        page: 0, // uses page parameter default
        size: 10, // uses size parameter default
        totalPages: 0, // default when missing
        totalElements: 1, // falls back to content.length
      });
    });

    it('should handle paged response in loadSystems properly', async () => {
      // loadSystems uses the paged logic, so let's test the paged fallback path
      const pagedResponse = {
        content: [mockReviewData],
        number: 0,
        size: 10,
        totalPages: 1,
        totalElements: 1,
      };
      mockedGetAllSystemsAPI.mockResolvedValue(pagedResponse);

      const { result } = renderHook(() => useViewSolutionReview());

      await act(async () => {
        await result.current.loadSystems(0, 10);
      });

      expect(result.current.solutionReviews).toEqual([mockReviewData]);
      expect(result.current.pageMeta).toEqual({
        page: 0,
        size: 10,
        totalPages: 1,
        totalElements: 1,
      });
    });
  });

  describe('edge cases', () => {
    it('should handle null response data', async () => {
      mockedGetSolutionReviewByIdAPI.mockResolvedValue(null);

      const { result } = renderHook(() => useViewSolutionReview());

      await act(async () => {
        await result.current.loadSolutionReviewById('test-id');
      });

      expect(result.current.solutionReviews).toEqual([]);
      expect(result.current.isLoading).toBe(false);
    });

    it('should handle setSolutionReviews function', async () => {
      const { result } = renderHook(() => useViewSolutionReview());
      const newReviews = [createSolutionReview({ id: 'new-review' })];

      act(() => {
        result.current.setSolutionReviews(newReviews);
      });

      expect(result.current.solutionReviews).toEqual(newReviews);
    });

    it('should handle empty content array in response for loadSolutionReviews', async () => {
      const emptyResponse = { content: [] };
      mockedGetAllSolutionReviewsAPI.mockResolvedValue(emptyResponse);

      const { result } = renderHook(() => useViewSolutionReview());

      await act(async () => {
        await result.current.loadSolutionReviews(0, 10);
      });

      expect(result.current.solutionReviews).toEqual([]);
      expect(result.current.pageMeta).toEqual({
        page: 0, // uses page parameter
        size: 10, // uses size parameter  
        totalPages: 0, // default when missing
        totalElements: 0, // content.length
      });
    });
  });

  describe('error handling', () => {
    it('should handle errors across all methods', async () => {
      const errorMessage = 'Generic API error';
      mockedGetSolutionReviewByIdAPI.mockRejectedValue(new Error(errorMessage));

      const { result } = renderHook(() => useViewSolutionReview());

      await act(async () => {
        try {
          await result.current.loadSolutionReviewById('test-id');
        } catch (error) {
          // Expected to throw
        }
      });

      expect(result.current.error).toBe(errorMessage);
    });

    it('should handle errors without message property', async () => {
      const error = { code: 500, response: { data: 'Server error' } };
      mockedGetSystemSolutionReviewsAPI.mockRejectedValue(error);

      const { result } = renderHook(() => useViewSolutionReview());

      await act(async () => {
        try {
          await result.current.loadSystemSolutionReviews('TEST-SYS');
        } catch (thrownError) {
          expect(thrownError).toBe(error);
        }
      });

      expect(result.current.error).toBeUndefined();
    });
  });
});