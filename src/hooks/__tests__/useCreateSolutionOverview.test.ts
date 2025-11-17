import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useCreateSolutionOverview } from '../useCreateSolutionOverview';
import { 
  createSolutionReviewAPI, 
  createSRFromExistingAPI 
} from '../../services/solutionReviewApi';
import { mockConsole } from '../../test/test-utils';
import type { SolutionOverview } from '../../types/solutionReview';

// Mock the API functions
vi.mock('../../services/solutionReviewApi', () => ({
  createSolutionReviewAPI: vi.fn(),
  createSRFromExistingAPI: vi.fn(),
}));

const mockedCreateSolutionReviewAPI = vi.mocked(createSolutionReviewAPI);
const mockedCreateSRFromExistingAPI = vi.mocked(createSRFromExistingAPI);

describe('useCreateSolutionOverview', () => {
  let consoleMock: ReturnType<typeof mockConsole>;

  const mockSolutionOverview: SolutionOverview = {
    id: 'test-overview-id',
    solutionDetails: {
      solutionName: 'Test Solution',
      projectName: 'Test Project',
      solutionArchitectName: 'Test Architect',
      deliveryProjectManagerName: 'Test PM',
      itBusinessPartner: 'Test IT Partner',
      solutionReviewCode: 'SR-001'
    },
    reviewType: 'NEW_BUILD',
    businessUnit: 'Test BU',
    businessDriver: 'COST_OPTIMIZATION',
    valueOutcome: 'Test value outcome',
    applicationUsers: ['user1', 'user2'],
    concerns: []
  };

  const mockCreatedResponse = {
    id: 'created-review-id',
    systemCode: 'TEST-SYS',
    solutionOverview: mockSolutionOverview,
  };

  beforeEach(() => {
    consoleMock = mockConsole();
    vi.clearAllMocks();
  });

  afterEach(() => {
    consoleMock.restore();
  });

  describe('initial state', () => {
    it('should initialize with default values', () => {
      const { result } = renderHook(() => useCreateSolutionOverview());
      
      expect(result.current.isCreating).toBe(false);
      expect(result.current.error).toBe(null);
      expect(typeof result.current.createNewSR).toBe('function');
      expect(typeof result.current.createSRFromExisting).toBe('function');
    });
  });

  describe('createNewSR', () => {
    it('should create new solution review successfully', async () => {
      mockedCreateSolutionReviewAPI.mockResolvedValue(mockCreatedResponse);
      
      const { result } = renderHook(() => useCreateSolutionOverview());

      let createdSR;
      await act(async () => {
        createdSR = await result.current.createNewSR(mockSolutionOverview, 'TEST-SYS');
      });

      expect(mockedCreateSolutionReviewAPI).toHaveBeenCalledWith(mockSolutionOverview, 'TEST-SYS');
      expect(createdSR).toEqual(mockCreatedResponse);
      expect(result.current.isCreating).toBe(false);
      expect(result.current.error).toBe(null);
    });

    it('should handle API errors with message', async () => {
      const errorMessage = 'Failed to create solution review';
      const error = new Error(errorMessage);
      mockedCreateSolutionReviewAPI.mockRejectedValue(error);
      
      const { result } = renderHook(() => useCreateSolutionOverview());

      await act(async () => {
        try {
          await result.current.createNewSR(mockSolutionOverview, 'TEST-SYS');
        } catch (thrownError) {
          expect(thrownError).toBe(error);
        }
      });

      expect(result.current.error).toBe(errorMessage);
      expect(result.current.isCreating).toBe(false);
    });

    it('should handle API errors without message', async () => {
      const error = { code: 500, response: { data: 'Server error' } };
      mockedCreateSolutionReviewAPI.mockRejectedValue(error);
      
      const { result } = renderHook(() => useCreateSolutionOverview());

      await act(async () => {
        try {
          await result.current.createNewSR(mockSolutionOverview, 'TEST-SYS');
        } catch (thrownError) {
          expect(thrownError).toBe(error);
        }
      });

      expect(result.current.error).toBe('Error creating');
      expect(result.current.isCreating).toBe(false);
    });

    it('should set loading state during API call', async () => {
      let resolvePromise: (value: any) => void;
      const promise = new Promise(resolve => {
        resolvePromise = resolve;
      });
      mockedCreateSolutionReviewAPI.mockReturnValue(promise);
      
      const { result } = renderHook(() => useCreateSolutionOverview());

      // Start the async operation
      act(() => {
        result.current.createNewSR(mockSolutionOverview, 'TEST-SYS');
      });

      // Check loading state is true during API call
      expect(result.current.isCreating).toBe(true);
      expect(result.current.error).toBe(null);

      // Resolve the promise and wait for completion
      await act(async () => {
        resolvePromise(mockCreatedResponse);
      });

      expect(result.current.isCreating).toBe(false);
    });
  });

  describe('createSRFromExisting', () => {
    it('should create solution review from existing system successfully', async () => {
      mockedCreateSRFromExistingAPI.mockResolvedValue(mockCreatedResponse);
      
      const { result } = renderHook(() => useCreateSolutionOverview());

      let createdSR;
      await act(async () => {
        createdSR = await result.current.createSRFromExisting('EXISTING-SYS');
      });

      expect(mockedCreateSRFromExistingAPI).toHaveBeenCalledWith('EXISTING-SYS');
      expect(createdSR).toEqual(mockCreatedResponse);
      expect(result.current.isCreating).toBe(false);
      expect(result.current.error).toBe(null);
    });

    it('should handle API errors with message', async () => {
      const errorMessage = 'System not found';
      const error = new Error(errorMessage);
      mockedCreateSRFromExistingAPI.mockRejectedValue(error);
      
      const { result } = renderHook(() => useCreateSolutionOverview());

      await act(async () => {
        try {
          await result.current.createSRFromExisting('NON-EXISTENT');
        } catch (thrownError) {
          expect(thrownError).toBe(error);
        }
      });

      expect(result.current.error).toBe(errorMessage);
      expect(result.current.isCreating).toBe(false);
    });

    it('should handle API errors without message', async () => {
      const error = { status: 404, statusText: 'Not Found' };
      mockedCreateSRFromExistingAPI.mockRejectedValue(error);
      
      const { result } = renderHook(() => useCreateSolutionOverview());

      await act(async () => {
        try {
          await result.current.createSRFromExisting('NON-EXISTENT');
        } catch (thrownError) {
          expect(thrownError).toBe(error);
        }
      });

      expect(result.current.error).toBe('Error creating');
      expect(result.current.isCreating).toBe(false);
    });

    it('should set loading state during API call', async () => {
      let resolvePromise: (value: any) => void;
      const promise = new Promise(resolve => {
        resolvePromise = resolve;
      });
      mockedCreateSRFromExistingAPI.mockReturnValue(promise);
      
      const { result } = renderHook(() => useCreateSolutionOverview());

      // Start the async operation
      act(() => {
        result.current.createSRFromExisting('EXISTING-SYS');
      });

      // Check loading state is true during API call
      expect(result.current.isCreating).toBe(true);
      expect(result.current.error).toBe(null);

      // Resolve the promise and wait for completion
      await act(async () => {
        resolvePromise(mockCreatedResponse);
      });

      expect(result.current.isCreating).toBe(false);
    });
  });

  describe('error state management', () => {
    it('should clear previous errors on new operations', async () => {
      // First operation with error
      const error1 = new Error('First error');
      mockedCreateSolutionReviewAPI.mockRejectedValue(error1);
      
      const { result } = renderHook(() => useCreateSolutionOverview());

      await act(async () => {
        try {
          await result.current.createNewSR(mockSolutionOverview, 'TEST-SYS');
        } catch (e) {
          // Expected to throw
        }
      });

      expect(result.current.error).toBe('First error');

      // Second operation should clear previous error
      mockedCreateSRFromExistingAPI.mockResolvedValue(mockCreatedResponse);
      
      await act(async () => {
        await result.current.createSRFromExisting('EXISTING-SYS');
      });

      expect(result.current.error).toBe(null);
    });

    it('should handle concurrent operations properly', async () => {
      let resolveFirst: (value: any) => void;
      let resolveSecond: (value: any) => void;
      
      const firstPromise = new Promise(resolve => {
        resolveFirst = resolve;
      });
      const secondPromise = new Promise(resolve => {
        resolveSecond = resolve;
      });

      mockedCreateSolutionReviewAPI.mockReturnValue(firstPromise);
      mockedCreateSRFromExistingAPI.mockReturnValue(secondPromise);
      
      const { result } = renderHook(() => useCreateSolutionOverview());

      // Start both operations
      act(() => {
        result.current.createNewSR(mockSolutionOverview, 'TEST-SYS');
        result.current.createSRFromExisting('EXISTING-SYS');
      });

      expect(result.current.isCreating).toBe(true);

      // Resolve both operations
      await act(async () => {
        resolveFirst(mockCreatedResponse);
        resolveSecond(mockCreatedResponse);
      });

      expect(result.current.isCreating).toBe(false);
      expect(result.current.error).toBe(null);
    });
  });

  describe('edge cases', () => {
    it('should handle empty system code', async () => {
      mockedCreateSolutionReviewAPI.mockResolvedValue(mockCreatedResponse);
      
      const { result } = renderHook(() => useCreateSolutionOverview());

      await act(async () => {
        await result.current.createNewSR(mockSolutionOverview, '');
      });

      expect(mockedCreateSolutionReviewAPI).toHaveBeenCalledWith(mockSolutionOverview, '');
    });

    it('should handle malformed solution overview data', async () => {
      mockedCreateSolutionReviewAPI.mockResolvedValue(mockCreatedResponse);
      
      const { result } = renderHook(() => useCreateSolutionOverview());

      // Test with minimal solution overview
      const minimalOverview = {
        ...mockSolutionOverview,
        solutionDetails: {
          ...mockSolutionOverview.solutionDetails,
          solutionName: '',
          projectName: '',
        }
      };

      await act(async () => {
        await result.current.createNewSR(minimalOverview, 'TEST-SYS');
      });

      expect(mockedCreateSolutionReviewAPI).toHaveBeenCalledWith(minimalOverview, 'TEST-SYS');
      expect(result.current.error).toBe(null);
    });
  });
});