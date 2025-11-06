import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import axios from 'axios';
import {
  createSolutionReviewAPI,
  saveSolutionReviewDraftAPI,
  getSolutionReviewByIdAPI,
  getAllSolutionReviewsAPI,
  getAllSystemsAPI,
  getSystemSolutionReviewsAPI,
  transitionSolutionReviewStateAPI,
  createSRFromExistingAPI,
  getSRsByStateAPI,
  addConcernsToSRAPI
} from '../solutionReviewApi';
import { expectAsyncError } from '../../test/helpers/testHelpers';
import { TEST_CONFIG } from '../../test/config';

// Mock axios
vi.mock('axios');
const mockedAxios = vi.mocked(axios, true);

describe('solutionReviewApi', () => {
  const API_BASE_URL = TEST_CONFIG.API_BASE_URLS.CORE_SERVICE;
  
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe('createSolutionReviewAPI', () => {
    it('should create solution review with correct URL and data', async () => {
      const mockData = { title: 'Test Review', description: 'Test description' };
      const systemCode = 'SYS-001';
      const mockResponse = { data: { id: 'sr-1', ...mockData } };
      
      mockedAxios.post.mockResolvedValue(mockResponse);

      const result = await createSolutionReviewAPI(mockData, systemCode);

      expect(mockedAxios.post).toHaveBeenCalledWith(
        `${API_BASE_URL}/solution-review/${systemCode}`,
        mockData
      );
      expect(result).toEqual(mockResponse.data);
    });

    it('should handle API errors', async () => {
      const mockData = { title: 'Test Review' };
      const systemCode = 'SYS-001';
      const mockError = new Error('API Error');
      
      mockedAxios.post.mockRejectedValue(mockError);

      await expectAsyncError(
        () => createSolutionReviewAPI(mockData, systemCode),
        'API Error'
      );
    });
  });

  describe('saveSolutionReviewDraftAPI', () => {
    it('should save draft with correct URL and data', async () => {
      const mockData = { id: 'sr-1', title: 'Updated Review' };
      const mockResponse = { data: mockData };
      
      mockedAxios.put.mockResolvedValue(mockResponse);

      const result = await saveSolutionReviewDraftAPI(mockData);

      expect(mockedAxios.put).toHaveBeenCalledWith(
        `${API_BASE_URL}/solution-review`,
        mockData
      );
      expect(result).toEqual(mockResponse.data);
    });

    it('should handle save errors', async () => {
      const mockData = { id: 'sr-1', title: 'Updated Review' };
      const mockError = new Error('Save failed');
      
      mockedAxios.put.mockRejectedValue(mockError);

      await expectAsyncError(
        () => saveSolutionReviewDraftAPI(mockData),
        'Save failed'
      );
    });
  });

  describe('getSolutionReviewByIdAPI', () => {
    it('should fetch solution review by ID', async () => {
      const reviewId = 'sr-1';
      const mockResponse = {
        data: {
          id: reviewId,
          title: 'Test Review',
          description: 'Test description'
        }
      };
      
      mockedAxios.get.mockResolvedValue(mockResponse);

      const result = await getSolutionReviewByIdAPI(reviewId);

      expect(mockedAxios.get).toHaveBeenCalledWith(
        `${API_BASE_URL}/solution-review/${reviewId}`
      );
      expect(result).toEqual(mockResponse.data);
    });

    it('should handle not found errors', async () => {
      const reviewId = 'non-existent';
      const mockError = new Error('Not found');
      
      mockedAxios.get.mockRejectedValue(mockError);

      await expectAsyncError(
        () => getSolutionReviewByIdAPI(reviewId),
        'Not found'
      );
    });
  });

  describe('getAllSolutionReviewsAPI', () => {
    it('should fetch all solution reviews with pagination', async () => {
      const page = 0;
      const size = 10;
      const mockResponse = {
        data: {
          content: [],
          page: 0,
          size: 10,
          totalPages: 1,
          totalElements: 0
        }
      };
      
      mockedAxios.get.mockResolvedValue(mockResponse);

      const result = await getAllSolutionReviewsAPI(page, size);

      expect(mockedAxios.get).toHaveBeenCalledWith(
        `${API_BASE_URL}/solution-review/paging?page=${page}&size=${size}`
      );
      expect(result).toEqual(mockResponse.data);
    });

    it('should handle different page sizes', async () => {
      const page = 1;
      const size = 20;
      const mockResponse = { data: { content: [] } };
      
      mockedAxios.get.mockResolvedValue(mockResponse);

      await getAllSolutionReviewsAPI(page, size);

      expect(mockedAxios.get).toHaveBeenCalledWith(
        `${API_BASE_URL}/solution-review/paging?page=${page}&size=${size}`
      );
    });
  });

  describe('getAllSystemsAPI', () => {
    it('should fetch all systems with pagination', async () => {
      const page = 0;
      const size = 10;
      const mockResponse = {
        data: {
          content: [
            { systemCode: 'SYS-001', name: 'System 1' },
            { systemCode: 'SYS-002', name: 'System 2' }
          ]
        }
      };
      
      mockedAxios.get.mockResolvedValue(mockResponse);

      const result = await getAllSystemsAPI(page, size);

      expect(mockedAxios.get).toHaveBeenCalledWith(
        `${API_BASE_URL}/solution-review/system-view?page=${page}&size=${size}`
      );
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe('getSystemSolutionReviewsAPI', () => {
    it('should fetch solution reviews for a specific system', async () => {
      const systemCode = 'SYS-001';
      const mockResponse = {
        data: [
          { id: 'sr-1', systemCode: 'SYS-001', title: 'Review 1' },
          { id: 'sr-2', systemCode: 'SYS-001', title: 'Review 2' }
        ]
      };
      
      mockedAxios.get.mockResolvedValue(mockResponse);

      const result = await getSystemSolutionReviewsAPI(systemCode);

      expect(mockedAxios.get).toHaveBeenCalledWith(
        `${API_BASE_URL}/solution-review/system?systemCode=${systemCode}`
      );
      expect(result).toEqual(mockResponse.data);
    });

    it('should handle URL encoding for system codes with special characters', async () => {
      const systemCode = 'SYS-001/TEST';
      const mockResponse = { data: [] };
      
      mockedAxios.get.mockResolvedValue(mockResponse);

      await getSystemSolutionReviewsAPI(systemCode);

      expect(mockedAxios.get).toHaveBeenCalledWith(
        `${API_BASE_URL}/solution-review/system?systemCode=${systemCode}`
      );
    });
  });

  describe('transitionSolutionReviewStateAPI', () => {
    it('should transition solution review state', async () => {
      const transitionData = {
        id: 'sr-1',
        targetState: 'SUBMITTED',
        comment: 'Ready for review'
      };
      const mockResponse = { data: { success: true } };
      
      mockedAxios.post.mockResolvedValue(mockResponse);

      const result = await transitionSolutionReviewStateAPI(transitionData);

      expect(mockedAxios.post).toHaveBeenCalledWith(
        `${API_BASE_URL}/lifecycle/transition`,
        transitionData
      );
      expect(result).toEqual(mockResponse.data);
    });

    it('should handle transition errors', async () => {
      const transitionData = { id: 'sr-1', targetState: 'INVALID' };
      const mockError = new Error('Invalid transition');
      
      mockedAxios.post.mockRejectedValue(mockError);

      await expectAsyncError(
        () => transitionSolutionReviewStateAPI(transitionData),
        'Invalid transition'
      );
    });
  });

  describe('createSRFromExistingAPI', () => {
    it('should create solution review from existing system', async () => {
      const systemCode = 'SYS-001';
      const mockResponse = {
        data: {
          id: 'sr-new',
          systemCode: 'SYS-001',
          title: 'Copied Review'
        }
      };
      
      mockedAxios.post.mockResolvedValue(mockResponse);

      const result = await createSRFromExistingAPI(systemCode);

      expect(mockedAxios.post).toHaveBeenCalledWith(
        `${API_BASE_URL}/solution-review/existing/${systemCode}`
      );
      expect(result).toEqual(mockResponse.data);
    });

    it('should handle creation errors', async () => {
      const systemCode = 'NON-EXISTENT';
      const mockError = new Error('System not found');
      
      mockedAxios.post.mockRejectedValue(mockError);

      await expectAsyncError(
        () => createSRFromExistingAPI(systemCode),
        'System not found'
      );
    });
  });

  describe('getSRsByStateAPI', () => {
    it('should fetch solution reviews by state with pagination', async () => {
      const state = 'SUBMITTED';
      const page = 0;
      const size = 10;
      const mockResponse = {
        data: {
          content: [
            { id: 'sr-1', documentState: 'SUBMITTED' },
            { id: 'sr-2', documentState: 'SUBMITTED' }
          ],
          page: 0,
          size: 10,
          totalPages: 1,
          totalElements: 2
        }
      };
      
      mockedAxios.get.mockResolvedValue(mockResponse);

      const result = await getSRsByStateAPI(state, page, size);

      expect(mockedAxios.get).toHaveBeenCalledWith(
        `${API_BASE_URL}/solution-review/by-state?documentState=${state}&page=${page}&size=${size}`
      );
      expect(result).toEqual(mockResponse.data);
    });

    it('should handle different document states', async () => {
      const states = ['DRAFT', 'SUBMITTED', 'APPROVED', 'REJECTED'];
      const mockResponse = { data: { content: [] } };
      
      mockedAxios.get.mockResolvedValue(mockResponse);

      for (const state of states) {
        await getSRsByStateAPI(state, 0, 10);
        
        expect(mockedAxios.get).toHaveBeenCalledWith(
          `${API_BASE_URL}/solution-review/by-state?documentState=${state}&page=0&size=10`
        );
      }
    });
  });

  describe('addConcernsToSRAPI', () => {
    it('should add concerns to solution review', async () => {
      const concernsData = {
        id: 'sr-1',
        solutionOverview: {
          concerns: [
            { id: 'c-1', text: 'Concern 1', severity: 'high' },
            { id: 'c-2', text: 'Concern 2', severity: 'medium' }
          ]
        }
      };
      const mockResponse = { data: { success: true } };
      
      mockedAxios.put.mockResolvedValue(mockResponse);

      const result = await addConcernsToSRAPI(concernsData);

      expect(mockedAxios.put).toHaveBeenCalledWith(
        `${API_BASE_URL}/solution-review/concerns`,
        concernsData
      );
      expect(result).toEqual(mockResponse.data);
    });

    it('should handle concerns addition errors', async () => {
      const concernsData = { id: 'sr-1', concerns: [] };
      const mockError = new Error('Failed to add concerns');
      
      mockedAxios.put.mockRejectedValue(mockError);

      await expectAsyncError(
        () => addConcernsToSRAPI(concernsData),
        'Failed to add concerns'
      );
    });
  });

  describe('network error handling', () => {
    it('should handle network errors consistently across all APIs', async () => {
      const networkError = new Error('Network Error');
      mockedAxios.get.mockRejectedValue(networkError);
      mockedAxios.post.mockRejectedValue(networkError);
      mockedAxios.put.mockRejectedValue(networkError);

      // Test that all APIs properly propagate network errors
      await expectAsyncError(() => getSolutionReviewByIdAPI('sr-1'), 'Network Error');
      await expectAsyncError(() => createSolutionReviewAPI({}, 'SYS-001'), 'Network Error');
      await expectAsyncError(() => saveSolutionReviewDraftAPI({}), 'Network Error');
      await expectAsyncError(() => getAllSolutionReviewsAPI(0, 10), 'Network Error');
      await expectAsyncError(() => getAllSystemsAPI(0, 10), 'Network Error');
      await expectAsyncError(() => getSystemSolutionReviewsAPI('SYS-001'), 'Network Error');
      await expectAsyncError(() => transitionSolutionReviewStateAPI({}), 'Network Error');
      await expectAsyncError(() => createSRFromExistingAPI('SYS-001'), 'Network Error');
      await expectAsyncError(() => getSRsByStateAPI('DRAFT', 0, 10), 'Network Error');
      await expectAsyncError(() => addConcernsToSRAPI({}), 'Network Error');
    });
  });

  describe('API base URL consistency', () => {
    it('should use consistent base URL across all endpoints', async () => {
      const mockResponse = { data: {} };
      mockedAxios.get.mockResolvedValue(mockResponse);
      mockedAxios.post.mockResolvedValue(mockResponse);
      mockedAxios.put.mockResolvedValue(mockResponse);

      // Call all APIs to verify they use the same base URL
      await createSolutionReviewAPI({}, 'SYS-001');
      await saveSolutionReviewDraftAPI({});
      await getSolutionReviewByIdAPI('sr-1');
      await getAllSolutionReviewsAPI(0, 10);
      await getAllSystemsAPI(0, 10);
      await getSystemSolutionReviewsAPI('SYS-001');
      await transitionSolutionReviewStateAPI({});
      await createSRFromExistingAPI('SYS-001');
      await getSRsByStateAPI('DRAFT', 0, 10);
      await addConcernsToSRAPI({});

      // Check that all calls include the expected base URL
      const allCalls = [
        ...mockedAxios.get.mock.calls,
        ...mockedAxios.post.mock.calls,
        ...mockedAxios.put.mock.calls
      ];

      allCalls.forEach(call => {
        expect(call[0]).toContain(API_BASE_URL);
      });
    });
  });
});