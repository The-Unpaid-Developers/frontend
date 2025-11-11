import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useLookup } from '../useLookup';
import * as lookupApi from '../../services/lookupApi';

// Mock the entire lookupApi module
vi.mock('../../services/lookupApi');

const mockLookupApi = vi.mocked(lookupApi);

describe('useLookup', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset console.error mock if needed
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Initial State', () => {
    it('should initialize with correct default values', () => {
      const { result } = renderHook(() => useLookup());
      
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBe(null);
      expect(typeof result.current.loadAllLookups).toBe('function');
      expect(typeof result.current.loadSpecificLookup).toBe('function');
      expect(typeof result.current.loadFieldDescriptions).toBe('function');
      expect(typeof result.current.updateFieldDescriptions).toBe('function');
      expect(typeof result.current.createLookup).toBe('function');
      expect(typeof result.current.deleteLookup).toBe('function');
      expect(typeof result.current.updateLookup).toBe('function');
    });
  });

  describe('loadAllLookups', () => {
    it('should set loading to true during API call', async () => {
      const mockData = { lookups: ['lookup1', 'lookup2'] };
      mockLookupApi.getAllLookupsAPI.mockResolvedValue(mockData);

      const { result } = renderHook(() => useLookup());

      act(() => {
        result.current.loadAllLookups();
      });

      expect(result.current.isLoading).toBe(true);
    });

    it('should return data on successful API call', async () => {
      const mockData = { lookups: ['lookup1', 'lookup2'] };
      mockLookupApi.getAllLookupsAPI.mockResolvedValue(mockData);

      const { result } = renderHook(() => useLookup());

      const data = await act(async () => {
        return await result.current.loadAllLookups();
      });

      expect(data).toEqual(mockData);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBe(null);
    });

    it('should handle API errors correctly', async () => {
      const errorMessage = 'Failed to fetch lookups';
      const error = new Error(errorMessage);
      mockLookupApi.getAllLookupsAPI.mockRejectedValue(error);

      const { result } = renderHook(() => useLookup());

      await act(async () => {
        try {
          await result.current.loadAllLookups();
        } catch (e) {
          // Expected to throw
        }
      });

      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBe(errorMessage);
      expect(console.error).toHaveBeenCalledWith('Error loading lookup data:', error);
    });

    it('should set loading to false even when error occurs', async () => {
      const error = new Error('API Error');
      mockLookupApi.getAllLookupsAPI.mockRejectedValue(error);

      const { result } = renderHook(() => useLookup());

      await act(async () => {
        try {
          await result.current.loadAllLookups();
        } catch (e) {
          // Expected to throw
        }
      });

      expect(result.current.isLoading).toBe(false);
    });
  });

  describe('loadSpecificLookup', () => {
    it('should call API with correct parameters', async () => {
      const mockData = { name: 'test-lookup', data: [] };
      const lookupName = 'test-lookup';
      mockLookupApi.getSpecificLookupAPI.mockResolvedValue(mockData);

      const { result } = renderHook(() => useLookup());

      await act(async () => {
        await result.current.loadSpecificLookup(lookupName);
      });

      expect(mockLookupApi.getSpecificLookupAPI).toHaveBeenCalledWith(lookupName);
    });

    it('should return specific lookup data', async () => {
      const mockData = { name: 'test-lookup', data: [] };
      const lookupName = 'test-lookup';
      mockLookupApi.getSpecificLookupAPI.mockResolvedValue(mockData);

      const { result } = renderHook(() => useLookup());

      const data = await act(async () => {
        return await result.current.loadSpecificLookup(lookupName);
      });

      expect(data).toEqual(mockData);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBe(null);
    });

    it('should handle errors in loadSpecificLookup', async () => {
      const errorMessage = 'Lookup not found';
      const error = new Error(errorMessage);
      mockLookupApi.getSpecificLookupAPI.mockRejectedValue(error);

      const { result } = renderHook(() => useLookup());

      await act(async () => {
        try {
          await result.current.loadSpecificLookup('non-existent');
        } catch (e) {
          // Expected to throw
        }
      });

      expect(result.current.error).toBe(errorMessage);
      expect(result.current.isLoading).toBe(false);
    });
  });

  describe('createLookup', () => {
    it('should create lookup with provided data', async () => {
      const mockResponse = { id: '123', status: 'created' };
      const lookupData = { name: 'new-lookup', values: ['a', 'b'] };
      mockLookupApi.createLookupAPI.mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useLookup());

      const response = await act(async () => {
        return await result.current.createLookup(lookupData);
      });

      expect(mockLookupApi.createLookupAPI).toHaveBeenCalledWith(lookupData);
      expect(response).toEqual(mockResponse);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBe(null);
    });

    it('should handle creation errors', async () => {
      const errorMessage = 'Creation failed';
      const error = new Error(errorMessage);
      mockLookupApi.createLookupAPI.mockRejectedValue(error);

      const { result } = renderHook(() => useLookup());

      await act(async () => {
        try {
          await result.current.createLookup({});
        } catch (e) {
          // Expected to throw
        }
      });

      expect(result.current.error).toBe(errorMessage);
      expect(console.error).toHaveBeenCalledWith('Error creating lookup:', error);
    });
  });

  describe('updateLookup', () => {
    it('should update lookup with provided data', async () => {
      const mockResponse = { status: 'updated' };
      const lookupName = 'existing-lookup';
      const updateData = { values: ['x', 'y', 'z'] };
      mockLookupApi.updateLookupAPI.mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useLookup());

      const response = await act(async () => {
        return await result.current.updateLookup(lookupName, updateData);
      });

      expect(mockLookupApi.updateLookupAPI).toHaveBeenCalledWith(lookupName, updateData);
      expect(response).toEqual(mockResponse);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBe(null);
    });

    it('should handle update errors', async () => {
      const errorMessage = 'Update failed';
      const error = new Error(errorMessage);
      mockLookupApi.updateLookupAPI.mockRejectedValue(error);

      const { result } = renderHook(() => useLookup());

      await act(async () => {
        try {
          await result.current.updateLookup('test-lookup', {});
        } catch (e) {
          // Expected to throw
        }
      });

      expect(result.current.error).toBe(errorMessage);
      expect(console.error).toHaveBeenCalledWith('Error updating lookup:', error);
    });
  });

  describe('deleteLookup', () => {
    it('should delete lookup by name', async () => {
      const mockResponse = { status: 'deleted' };
      const lookupName = 'to-be-deleted';
      mockLookupApi.deleteLookupAPI.mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useLookup());

      const response = await act(async () => {
        return await result.current.deleteLookup(lookupName);
      });

      expect(mockLookupApi.deleteLookupAPI).toHaveBeenCalledWith(lookupName);
      expect(response).toEqual(mockResponse);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBe(null);
    });

    it('should handle deletion errors', async () => {
      const errorMessage = 'Deletion failed';
      const error = new Error(errorMessage);
      mockLookupApi.deleteLookupAPI.mockRejectedValue(error);

      const { result } = renderHook(() => useLookup());

      await act(async () => {
        try {
          await result.current.deleteLookup('non-existent');
        } catch (e) {
          // Expected to throw
        }
      });

      expect(result.current.error).toBe(errorMessage);
      expect(console.error).toHaveBeenCalledWith('Error deleting lookup:', error);
    });
  });

  describe('loadFieldDescriptions', () => {
    it('should load field descriptions for a lookup', async () => {
      const mockData = { fields: { name: 'Name field', value: 'Value field' } };
      const lookupName = 'test-lookup';
      mockLookupApi.getFieldDescriptionsAPI.mockResolvedValue(mockData);

      const { result } = renderHook(() => useLookup());

      const data = await act(async () => {
        return await result.current.loadFieldDescriptions(lookupName);
      });

      expect(mockLookupApi.getFieldDescriptionsAPI).toHaveBeenCalledWith(lookupName);
      expect(data).toEqual(mockData);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBe(null);
    });

    it('should handle field descriptions loading errors', async () => {
      const errorMessage = 'Failed to load field descriptions';
      const error = new Error(errorMessage);
      mockLookupApi.getFieldDescriptionsAPI.mockRejectedValue(error);

      const { result } = renderHook(() => useLookup());

      await act(async () => {
        try {
          await result.current.loadFieldDescriptions('test-lookup');
        } catch (e) {
          // Expected to throw
        }
      });

      expect(result.current.error).toBe(errorMessage);
      expect(console.error).toHaveBeenCalledWith('Error loading field descriptions:', error);
    });
  });

  describe('updateFieldDescriptions', () => {
    it('should update field descriptions', async () => {
      const mockResponse = { status: 'updated' };
      const lookupName = 'test-lookup';
      const descriptionsData = { name: 'Updated name field' };
      mockLookupApi.updateFieldDescriptionsAPI.mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useLookup());

      const response = await act(async () => {
        return await result.current.updateFieldDescriptions(lookupName, descriptionsData);
      });

      expect(mockLookupApi.updateFieldDescriptionsAPI).toHaveBeenCalledWith(lookupName, descriptionsData);
      expect(response).toEqual(mockResponse);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBe(null);
    });

    it('should handle field descriptions update errors', async () => {
      const errorMessage = 'Failed to update field descriptions';
      const error = new Error(errorMessage);
      mockLookupApi.updateFieldDescriptionsAPI.mockRejectedValue(error);

      const { result } = renderHook(() => useLookup());

      await act(async () => {
        try {
          await result.current.updateFieldDescriptions('test-lookup', {});
        } catch (e) {
          // Expected to throw
        }
      });

      expect(result.current.error).toBe(errorMessage);
      expect(console.error).toHaveBeenCalledWith('Error loading field descriptions:', error);
    });
  });

  describe('Loading State Management', () => {
    it('should manage loading state correctly across multiple calls', async () => {
      const mockData = { data: 'test' };
      mockLookupApi.getAllLookupsAPI.mockResolvedValue(mockData);

      const { result } = renderHook(() => useLookup());

      // Initial state
      expect(result.current.isLoading).toBe(false);

      // First call
      await act(async () => {
        await result.current.loadAllLookups();
      });
      expect(result.current.isLoading).toBe(false);

      // Second call
      await act(async () => {
        await result.current.loadAllLookups();
      });
      expect(result.current.isLoading).toBe(false);
    });

    it('should handle concurrent API calls', async () => {
      const mockData1 = { data: 'test1' };
      const mockData2 = { data: 'test2' };
      mockLookupApi.getAllLookupsAPI.mockResolvedValueOnce(mockData1);
      mockLookupApi.getSpecificLookupAPI.mockResolvedValueOnce(mockData2);

      const { result } = renderHook(() => useLookup());

      await act(async () => {
        const promise1 = result.current.loadAllLookups();
        const promise2 = result.current.loadSpecificLookup('test');
        
        const [result1, result2] = await Promise.all([promise1, promise2]);
        expect(result1).toEqual(mockData1);
        expect(result2).toEqual(mockData2);
      });

      expect(result.current.isLoading).toBe(false);
    });
  });

  describe('Error State Management', () => {
    it('should maintain error state until next error or success', async () => {
      const error = new Error('Initial error');
      const { result } = renderHook(() => useLookup());

      // Call fails and sets error
      mockLookupApi.getAllLookupsAPI.mockRejectedValueOnce(error);

      await act(async () => {
        try {
          await result.current.loadAllLookups();
        } catch (e) {
          // Expected to throw
        }
      });

      expect(result.current.error).toBe('Initial error');
      expect(result.current.isLoading).toBe(false);
    });
  });
});