import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useViewSolutionReview } from '../useViewSolutionReview';
import {
  getAllSolutionReviewsAPI,
  getSystemSolutionReviewsAPI,
  getSolutionReviewByIdAPI,
  getAllSystemsAPI,
  searchSRAPI,
} from '../../services/solutionReviewApi';
import { mockConsole } from '../../test/test-utils';
import { createSolutionReview } from '../../__tests__/testFactories';

// Mock the API functions
vi.mock('../../services/solutionReviewApi', () => ({
  getAllSolutionReviewsAPI: vi.fn(),
  getSystemSolutionReviewsAPI: vi.fn(),
  getSolutionReviewByIdAPI: vi.fn(),
  getAllSystemsAPI: vi.fn(),
  searchSRAPI: vi.fn(),
}));

const mockedGetAllSolutionReviewsAPI = vi.mocked(getAllSolutionReviewsAPI);
const mockedGetSystemSolutionReviewsAPI = vi.mocked(getSystemSolutionReviewsAPI);
const mockedGetSolutionReviewByIdAPI = vi.mocked(getSolutionReviewByIdAPI);
const mockedGetAllSystemsAPI = vi.mocked(getAllSystemsAPI);
const mockedSearchSRAPI = vi.mocked(searchSRAPI);

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
    mockedSearchSRAPI.mockResolvedValue([mockReviewData]);
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

  describe('searchSR', () => {
    it('should search solution reviews successfully', async () => {
      const searchData = { systemCode: 'TEST-SYS', documentState: 'ACTIVE' };
      const searchResults = [
        createSolutionReview({ id: 'sr-1', systemCode: 'TEST-SYS' }),
        createSolutionReview({ id: 'sr-2', systemCode: 'TEST-SYS' }),
      ];
      mockedSearchSRAPI.mockResolvedValue(searchResults);

      const { result } = renderHook(() => useViewSolutionReview());

      await act(async () => {
        await result.current.searchSR(searchData);
      });

      expect(mockedSearchSRAPI).toHaveBeenCalledWith(searchData);
      expect(result.current.solutionReviews).toEqual(searchResults);
      expect(result.current.isLoading).toBe(false);
    });

    it('should update page meta with non-paginated search results', async () => {
      const searchData = { systemCode: 'TEST-SYS' };
      const searchResults = [
        createSolutionReview({ id: 'sr-1' }),
        createSolutionReview({ id: 'sr-2' }),
        createSolutionReview({ id: 'sr-3' }),
      ];
      mockedSearchSRAPI.mockResolvedValue(searchResults);

      const { result } = renderHook(() => useViewSolutionReview());

      await act(async () => {
        await result.current.searchSR(searchData);
      });

      expect(result.current.pageMeta).toEqual({
        page: 0,
        size: 3,
        totalPages: 1,
        totalElements: 3,
      });
    });

    it('should handle empty search results', async () => {
      const searchData = { systemCode: 'NON-EXISTENT' };
      mockedSearchSRAPI.mockResolvedValue([]);

      const { result } = renderHook(() => useViewSolutionReview());

      await act(async () => {
        await result.current.searchSR(searchData);
      });

      expect(result.current.solutionReviews).toEqual([]);
      expect(result.current.pageMeta).toEqual({
        page: 0,
        size: 0,
        totalPages: 1,
        totalElements: 0,
      });
    });

    it('should handle search API errors', async () => {
      const searchData = { systemCode: 'TEST-SYS' };
      const errorMessage = 'Search service unavailable';
      mockedSearchSRAPI.mockRejectedValue(new Error(errorMessage));

      const { result } = renderHook(() => useViewSolutionReview());

      await act(async () => {
        try {
          await result.current.searchSR(searchData);
        } catch (error) {
          // Expected to throw
        }
      });

      expect(result.current.error).toBe(errorMessage);
      expect(result.current.isLoading).toBe(false);
    });

    it('should handle non-array search response', async () => {
      const searchData = { systemCode: 'TEST-SYS' };
      mockedSearchSRAPI.mockResolvedValue(null as any);

      const { result } = renderHook(() => useViewSolutionReview());

      await act(async () => {
        await result.current.searchSR(searchData);
      });

      // Should not update state when response is not an array
      expect(result.current.isLoading).toBe(false);
    });
  });

  describe('loading state', () => {
    it('should set loading to true during loadSolutionReviews', async () => {
      let resolvePromise: any;
      mockedGetAllSolutionReviewsAPI.mockImplementation(
        () =>
          new Promise((resolve) => {
            resolvePromise = resolve;
          })
      );

      const { result } = renderHook(() => useViewSolutionReview());

      act(() => {
        result.current.loadSolutionReviews(0, 10);
      });

      expect(result.current.isLoading).toBe(true);

      await act(async () => {
        resolvePromise(mockPagedResponse);
      });

      expect(result.current.isLoading).toBe(false);
    });

    it('should set loading to true during searchSR', async () => {
      let resolvePromise: any;
      mockedSearchSRAPI.mockImplementation(
        () =>
          new Promise((resolve) => {
            resolvePromise = resolve;
          })
      );

      const { result } = renderHook(() => useViewSolutionReview());

      act(() => {
        result.current.searchSR({ systemCode: 'TEST' });
      });

      expect(result.current.isLoading).toBe(true);

      await act(async () => {
        resolvePromise([mockReviewData]);
      });

      expect(result.current.isLoading).toBe(false);
    });
  });

  describe('setPageMeta', () => {
    it('should update page meta when setPageMeta is called', () => {
      const { result } = renderHook(() => useViewSolutionReview());

      const newPageMeta = {
        page: 2,
        size: 20,
        totalPages: 5,
        totalElements: 100,
      };

      act(() => {
        result.current.setPageMeta(newPageMeta);
      });

      expect(result.current.pageMeta).toEqual(newPageMeta);
    });
  });

  describe('additional edge cases', () => {
    it('should handle empty system solution reviews', async () => {
      mockedGetSystemSolutionReviewsAPI.mockResolvedValue([]);

      const { result } = renderHook(() => useViewSolutionReview());

      await act(async () => {
        await result.current.loadSystemSolutionReviews('TEST-SYS');
      });

      expect(result.current.solutionReviews).toEqual([]);
    });

    it('should handle loadSystems with non-paged fallback', async () => {
      const nonPagedResponse = {
        content: [mockReviewData, createSolutionReview({ id: 'sr-2' })],
      };
      mockedGetAllSystemsAPI.mockResolvedValue(nonPagedResponse);

      const { result } = renderHook(() => useViewSolutionReview());

      await act(async () => {
        await result.current.loadSystems(0, 10);
      });

      expect(result.current.solutionReviews).toHaveLength(2);
      expect(result.current.pageMeta).toEqual({
        page: 0, // uses parameter default
        size: 10, // uses parameter default
        totalPages: 0, // default when missing
        totalElements: 2, // from content.length
      });
    });

    it('should handle loadSolutionReviews with non-paged fallback', async () => {
      const nonPagedResponse = {
        content: [mockReviewData, createSolutionReview({ id: 'sr-2' })],
      };
      mockedGetAllSolutionReviewsAPI.mockResolvedValue(nonPagedResponse);

      const { result } = renderHook(() => useViewSolutionReview());

      await act(async () => {
        await result.current.loadSolutionReviews(0, 10);
      });

      expect(result.current.solutionReviews).toHaveLength(2);
      expect(result.current.pageMeta).toEqual({
        page: 0, // uses parameter default
        size: 10, // uses parameter default
        totalPages: 0, // default when missing
        totalElements: 2, // from content.length
      });
    });

    it('should expose all required functions', () => {
      const { result } = renderHook(() => useViewSolutionReview());

      expect(typeof result.current.searchSR).toBe('function');
      expect(typeof result.current.setPageMeta).toBe('function');
      expect(typeof result.current.setSolutionReviews).toBe('function');
      expect(typeof result.current.loadSolutionReviews).toBe('function');
      expect(typeof result.current.loadSystemSolutionReviews).toBe('function');
      expect(typeof result.current.loadSolutionReviewById).toBe('function');
      expect(typeof result.current.loadSystems).toBe('function');
    });

    it('should maintain state across multiple operations', async () => {
      const { result } = renderHook(() => useViewSolutionReview());

      // First load
      await act(async () => {
        await result.current.loadSolutionReviews(0, 10);
      });

      expect(result.current.solutionReviews).toHaveLength(1);

      // Search
      const searchResults = [
        createSolutionReview({ id: 'sr-search-1' }),
        createSolutionReview({ id: 'sr-search-2' }),
      ];
      mockedSearchSRAPI.mockResolvedValue(searchResults);

      await act(async () => {
        await result.current.searchSR({ systemCode: 'TEST' });
      });

      expect(result.current.solutionReviews).toHaveLength(2);
      expect(result.current.solutionReviews[0].id).toBe('sr-search-1');
    });

    it('should handle partial pagination metadata', async () => {
      const partialPagedResponse = {
        content: [mockReviewData],
        number: 2,
        // Missing size, totalPages, totalElements
      };
      mockedGetAllSolutionReviewsAPI.mockResolvedValue(partialPagedResponse);

      const { result } = renderHook(() => useViewSolutionReview());

      await act(async () => {
        await result.current.loadSolutionReviews(1, 20);
      });

      expect(result.current.pageMeta).toEqual({
        page: 2, // from response.number
        size: 20, // from parameter fallback
        totalPages: 0, // default
        totalElements: 1, // from content.length
      });
    });
  });
});