import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import axios from 'axios';
import {
  getAllLookupsAPI,
  getSpecificLookupAPI,
  createLookupAPI,
  getFieldDescriptionsAPI,
  updateFieldDescriptionsAPI,
  deleteLookupAPI,
  updateLookupAPI
} from '../lookupApi';

// Mock axios
vi.mock('axios');
const mockedAxios = vi.mocked(axios, true);

describe('lookupApi', () => {
  let consoleMock: any;

  beforeEach(() => {
    vi.clearAllMocks();
    consoleMock = vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleMock.mockRestore();
  });

  describe('getAllLookupsAPI', () => {
    it('should fetch all lookups successfully', async () => {
      const mockLookups = [
        { name: 'lookup1', description: 'First lookup' },
        { name: 'lookup2', description: 'Second lookup' }
      ];
      mockedAxios.get.mockResolvedValue({ data: mockLookups });

      const result = await getAllLookupsAPI();

      expect(mockedAxios.get).toHaveBeenCalledWith(
        expect.stringContaining('/api/v1/lookups')
      );
      expect(result).toEqual(mockLookups);
    });

    it('should handle API errors', async () => {
      const error = new Error('Network error');
      mockedAxios.get.mockRejectedValue(error);

      await expect(getAllLookupsAPI()).rejects.toThrow('Network error');
    });

    it('should handle empty response', async () => {
      mockedAxios.get.mockResolvedValue({ data: [] });

      const result = await getAllLookupsAPI();

      expect(result).toEqual([]);
    });

    it('should handle null response', async () => {
      mockedAxios.get.mockResolvedValue({ data: null });

      const result = await getAllLookupsAPI();

      expect(result).toBe(null);
    });
  });

  describe('getSpecificLookupAPI', () => {
    it('should fetch specific lookup successfully', async () => {
      const mockLookup = { 
        name: 'test-lookup', 
        data: [{ id: 1, value: 'test' }] 
      };
      mockedAxios.get.mockResolvedValue({ data: mockLookup });

      const result = await getSpecificLookupAPI('test-lookup');

      expect(mockedAxios.get).toHaveBeenCalledWith(
        expect.stringContaining('/api/v1/lookups/test-lookup')
      );
      expect(result).toEqual(mockLookup);
    });

    it('should handle lookup not found', async () => {
      const error = { 
        response: { status: 404 }, 
        message: 'Lookup not found' 
      };
      mockedAxios.get.mockRejectedValue(error);

      await expect(getSpecificLookupAPI('non-existent')).rejects.toEqual(error);
    });

    it('should handle special characters in lookup name', async () => {
      const lookupName = 'lookup-with-special@chars';
      mockedAxios.get.mockResolvedValue({ data: { name: lookupName } });

      await getSpecificLookupAPI(lookupName);

      expect(mockedAxios.get).toHaveBeenCalledWith(
        expect.stringContaining(`/api/v1/lookups/${lookupName}`)
      );
    });

    it('should handle empty lookup name', async () => {
      mockedAxios.get.mockResolvedValue({ data: {} });

      const result = await getSpecificLookupAPI('');

      expect(mockedAxios.get).toHaveBeenCalledWith(
        expect.stringContaining('/api/v1/lookups/')
      );
      expect(result).toEqual({});
    });
  });

  describe('createLookupAPI', () => {
    it('should create lookup successfully', async () => {
      const mockData = new FormData();
      mockData.append('name', 'new-lookup');
      const mockResponse = { id: 1, name: 'new-lookup', created: true };
      
      mockedAxios.post.mockResolvedValue({ data: mockResponse });

      const result = await createLookupAPI(mockData);

      expect(mockedAxios.post).toHaveBeenCalledWith(
        expect.stringContaining('/api/v1/lookups'),
        mockData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      expect(result).toEqual(mockResponse);
    });

    it('should handle validation errors', async () => {
      const error = {
        response: { status: 400, data: { message: 'Invalid data' } },
        message: 'Validation failed'
      };
      mockedAxios.post.mockRejectedValue(error);

      await expect(createLookupAPI({})).rejects.toEqual(error);
    });

    it('should handle server errors during creation', async () => {
      const serverError = {
        response: { status: 500, statusText: 'Internal Server Error' },
        message: 'Server error'
      };
      mockedAxios.post.mockRejectedValue(serverError);

      await expect(createLookupAPI({})).rejects.toEqual(serverError);
    });

    it('should handle network timeout', async () => {
      const timeoutError = {
        code: 'ECONNABORTED',
        message: 'timeout exceeded'
      };
      mockedAxios.post.mockRejectedValue(timeoutError);

      await expect(createLookupAPI({})).rejects.toEqual(timeoutError);
    });
  });

  describe('getFieldDescriptionsAPI', () => {
    it('should fetch field descriptions successfully', async () => {
      const mockDescriptions = {
        fieldName: 'Description of field name',
        fieldType: 'Description of field type'
      };
      mockedAxios.get.mockResolvedValue({ data: mockDescriptions });

      const result = await getFieldDescriptionsAPI('test-lookup');

      expect(mockedAxios.get).toHaveBeenCalledWith(
        expect.stringContaining('/api/v1/lookups/test-lookup/field-descriptions')
      );
      expect(result).toEqual(mockDescriptions);
    });

    it('should handle lookup without field descriptions', async () => {
      mockedAxios.get.mockResolvedValue({ data: {} });

      const result = await getFieldDescriptionsAPI('test-lookup');

      expect(result).toEqual({});
    });

    it('should handle API errors for field descriptions', async () => {
      const error = new Error('Field descriptions not available');
      mockedAxios.get.mockRejectedValue(error);

      await expect(getFieldDescriptionsAPI('test-lookup')).rejects.toThrow('Field descriptions not available');
    });

    it('should handle special characters in lookup name for field descriptions', async () => {
      const lookupName = 'lookup@with#special$chars';
      mockedAxios.get.mockResolvedValue({ data: {} });

      await getFieldDescriptionsAPI(lookupName);

      expect(mockedAxios.get).toHaveBeenCalledWith(
        expect.stringContaining(`/api/v1/lookups/${lookupName}/field-descriptions`)
      );
    });
  });

  describe('updateFieldDescriptionsAPI', () => {
    it('should update field descriptions successfully', async () => {
      const updateData = {
        fieldName: 'Updated description for field name',
        fieldType: 'Updated description for field type'
      };
      const mockResponse = { success: true, updated: updateData };
      
      mockedAxios.put.mockResolvedValue({ data: mockResponse });

      const result = await updateFieldDescriptionsAPI('test-lookup', updateData);

      expect(mockedAxios.put).toHaveBeenCalledWith(
        expect.stringContaining('/api/v1/lookups/test-lookup/field-descriptions'),
        updateData
      );
      expect(result).toEqual(mockResponse);
    });

    it('should handle update errors', async () => {
      const error = {
        response: { status: 403, data: { message: 'Forbidden' } },
        message: 'Update not allowed'
      };
      mockedAxios.put.mockRejectedValue(error);

      await expect(updateFieldDescriptionsAPI('test-lookup', {})).rejects.toEqual(error);
    });

    it('should handle empty update data', async () => {
      mockedAxios.put.mockResolvedValue({ data: { success: true } });

      const result = await updateFieldDescriptionsAPI('test-lookup', {});

      expect(mockedAxios.put).toHaveBeenCalledWith(
        expect.stringContaining('/api/v1/lookups/test-lookup/field-descriptions'),
        {}
      );
      expect(result).toEqual({ success: true });
    });

    it('should handle concurrent update conflicts', async () => {
      const conflictError = {
        response: { status: 409, data: { message: 'Conflict' } },
        message: 'Resource modified by another user'
      };
      mockedAxios.put.mockRejectedValue(conflictError);

      await expect(updateFieldDescriptionsAPI('test-lookup', {})).rejects.toEqual(conflictError);
    });
  });

  describe('deleteLookupAPI', () => {
    it('should delete lookup successfully', async () => {
      const mockResponse = { success: true, deleted: 'test-lookup' };
      mockedAxios.delete.mockResolvedValue({ data: mockResponse });

      const result = await deleteLookupAPI('test-lookup');

      expect(mockedAxios.delete).toHaveBeenCalledWith(
        expect.stringContaining('/api/v1/lookups/test-lookup')
      );
      expect(result).toEqual(mockResponse);
    });

    it('should handle delete errors', async () => {
      const error = {
        response: { status: 404, data: { message: 'Not found' } },
        message: 'Lookup not found'
      };
      mockedAxios.delete.mockRejectedValue(error);

      await expect(deleteLookupAPI('non-existent')).rejects.toEqual(error);
    });

    it('should handle permission errors during deletion', async () => {
      const permissionError = {
        response: { status: 403, data: { message: 'Insufficient permissions' } },
        message: 'Delete not allowed'
      };
      mockedAxios.delete.mockRejectedValue(permissionError);

      await expect(deleteLookupAPI('protected-lookup')).rejects.toEqual(permissionError);
    });

    it('should handle lookup with dependencies', async () => {
      const dependencyError = {
        response: { status: 400, data: { message: 'Lookup has dependencies' } },
        message: 'Cannot delete lookup with active references'
      };
      mockedAxios.delete.mockRejectedValue(dependencyError);

      await expect(deleteLookupAPI('lookup-with-deps')).rejects.toEqual(dependencyError);
    });

    it('should handle special characters in lookup name for deletion', async () => {
      const lookupName = 'lookup@to#delete';
      mockedAxios.delete.mockResolvedValue({ data: { success: true } });

      await deleteLookupAPI(lookupName);

      expect(mockedAxios.delete).toHaveBeenCalledWith(
        expect.stringContaining(`/api/v1/lookups/${lookupName}`)
      );
    });
  });

  describe('updateLookupAPI', () => {
    it('should update lookup successfully', async () => {
      const updateData = new FormData();
      updateData.append('name', 'updated-lookup');
      const mockResponse = { id: 1, name: 'updated-lookup', updated: true };
      
      mockedAxios.put.mockResolvedValue({ data: mockResponse });

      const result = await updateLookupAPI('test-lookup', updateData);

      expect(mockedAxios.put).toHaveBeenCalledWith(
        expect.stringContaining('/api/v1/lookups/test-lookup'),
        updateData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      expect(result).toEqual(mockResponse);
    });

    it('should handle update validation errors', async () => {
      const validationError = {
        response: { status: 400, data: { message: 'Invalid update data' } },
        message: 'Validation failed'
      };
      mockedAxios.put.mockRejectedValue(validationError);

      await expect(updateLookupAPI('test-lookup', {})).rejects.toEqual(validationError);
    });

    it('should handle update of non-existent lookup', async () => {
      const notFoundError = {
        response: { status: 404, data: { message: 'Lookup not found' } },
        message: 'Cannot update non-existent lookup'
      };
      mockedAxios.put.mockRejectedValue(notFoundError);

      await expect(updateLookupAPI('non-existent', {})).rejects.toEqual(notFoundError);
    });

    it('should handle server errors during update', async () => {
      const serverError = {
        response: { status: 500, statusText: 'Internal Server Error' },
        message: 'Server error during update'
      };
      mockedAxios.put.mockRejectedValue(serverError);

      await expect(updateLookupAPI('test-lookup', {})).rejects.toEqual(serverError);
    });

    it('should handle large file updates', async () => {
      const largeData = new FormData();
      largeData.append('file', new Blob(['large content'], { type: 'text/csv' }));
      mockedAxios.put.mockResolvedValue({ data: { success: true } });

      const result = await updateLookupAPI('test-lookup', largeData);

      expect(mockedAxios.put).toHaveBeenCalledWith(
        expect.stringContaining('/api/v1/lookups/test-lookup'),
        largeData,
        expect.objectContaining({
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
      );
      expect(result).toEqual({ success: true });
    });
  });

  describe('error handling and edge cases', () => {
    it('should handle network errors consistently across all APIs', async () => {
      const networkError = new Error('Network unavailable');
      
      // Test each API method handles network errors
      mockedAxios.get.mockRejectedValue(networkError);
      mockedAxios.post.mockRejectedValue(networkError);
      mockedAxios.put.mockRejectedValue(networkError);
      mockedAxios.delete.mockRejectedValue(networkError);

      await expect(getAllLookupsAPI()).rejects.toThrow('Network unavailable');
      await expect(getSpecificLookupAPI('test')).rejects.toThrow('Network unavailable');
      await expect(createLookupAPI({})).rejects.toThrow('Network unavailable');
      await expect(updateLookupAPI('test', {})).rejects.toThrow('Network unavailable');
      await expect(deleteLookupAPI('test')).rejects.toThrow('Network unavailable');
      await expect(getFieldDescriptionsAPI('test')).rejects.toThrow('Network unavailable');
      await expect(updateFieldDescriptionsAPI('test', {})).rejects.toThrow('Network unavailable');
    });

    it('should handle malformed responses', async () => {
      mockedAxios.get.mockResolvedValue({ data: undefined });

      const result = await getAllLookupsAPI();

      expect(result).toBeUndefined();
    });

    it('should handle axios response without data property', async () => {
      mockedAxios.get.mockResolvedValue({} as any);

      const result = await getAllLookupsAPI();

      expect(result).toBeUndefined();
    });

    it('should use consistent API base URL across all methods', async () => {
      const expectedBaseUrl = expect.stringContaining('/api/v1/lookups');
      
      // Mock all methods to resolve successfully
      mockedAxios.get.mockResolvedValue({ data: {} });
      mockedAxios.post.mockResolvedValue({ data: {} });
      mockedAxios.put.mockResolvedValue({ data: {} });
      mockedAxios.delete.mockResolvedValue({ data: {} });

      // Call each method and verify URL consistency
      await getAllLookupsAPI();
      expect(mockedAxios.get).toHaveBeenCalledWith(expectedBaseUrl);

      await getSpecificLookupAPI('test');
      expect(mockedAxios.get).toHaveBeenCalledWith(expect.stringContaining('/api/v1/lookups/test'));

      await createLookupAPI({});
      expect(mockedAxios.post).toHaveBeenCalledWith(expectedBaseUrl, {}, expect.any(Object));

      await updateLookupAPI('test', {});
      expect(mockedAxios.put).toHaveBeenCalledWith(expect.stringContaining('/api/v1/lookups/test'), {}, expect.any(Object));

      await deleteLookupAPI('test');
      expect(mockedAxios.delete).toHaveBeenCalledWith(expect.stringContaining('/api/v1/lookups/test'));

      await getFieldDescriptionsAPI('test');
      expect(mockedAxios.get).toHaveBeenCalledWith(expect.stringContaining('/api/v1/lookups/test/field-descriptions'));

      await updateFieldDescriptionsAPI('test', {});
      expect(mockedAxios.put).toHaveBeenCalledWith(expect.stringContaining('/api/v1/lookups/test/field-descriptions'), {});
    });
  });
});