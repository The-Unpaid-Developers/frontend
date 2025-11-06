import { describe, it, expect, vi, beforeEach } from 'vitest';
import axios from 'axios';
import {
  getAllQueriesAPI,
  getSpecificQueryAPI,
  executeQueryAPI,
  createQueryAPI,
  updateQueryAPI,
  deleteQueryAPI,
} from '../queryApi';
import { getApiUrl } from '../../test/config';

// Mock axios
vi.mock('axios');
const mockedAxios = vi.mocked(axios, true);

describe('queryApi', () => {
  const API_BASE_URL = getApiUrl('CORE_SERVICE', '/queries');

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getAllQueriesAPI', () => {
    it('should fetch all queries successfully', async () => {
      const mockQueries = [
        {
          id: '1',
          name: 'user-report',
          sql: 'SELECT * FROM users',
          description: 'Get all users',
          createdBy: 'admin',
          createdAt: '2024-01-01T00:00:00Z'
        },
        {
          id: '2',
          name: 'order-summary',
          sql: 'SELECT COUNT(*) FROM orders',
          description: 'Count all orders',
          createdBy: 'manager',
          createdAt: '2024-01-02T00:00:00Z'
        }
      ];
      const mockResponse = { data: mockQueries };

      mockedAxios.get.mockResolvedValue(mockResponse);

      const result = await getAllQueriesAPI();

      expect(mockedAxios.get).toHaveBeenCalledWith(`${API_BASE_URL}`);
      expect(result).toEqual(mockQueries);
    });

    it('should handle empty queries list', async () => {
      const mockResponse = { data: [] };
      mockedAxios.get.mockResolvedValue(mockResponse);

      const result = await getAllQueriesAPI();

      expect(result).toEqual([]);
    });

    it('should handle errors when fetching all queries', async () => {
      const mockError = new Error('Server unavailable');
      mockedAxios.get.mockRejectedValue(mockError);

      await expect(getAllQueriesAPI()).rejects.toThrow('Server unavailable');
      expect(mockedAxios.get).toHaveBeenCalledWith(`${API_BASE_URL}`);
    });

    it('should handle network errors', async () => {
      const networkError = new Error('Network Error');
      networkError.name = 'NetworkError';
      mockedAxios.get.mockRejectedValue(networkError);

      await expect(getAllQueriesAPI()).rejects.toThrow('Network Error');
    });
  });

  describe('getSpecificQueryAPI', () => {
    it('should fetch a specific query successfully', async () => {
      const queryName = 'user-report';
      const mockQuery = {
        id: '1',
        name: queryName,
        sql: 'SELECT * FROM users WHERE active = true',
        description: 'Get all active users',
        parameters: [
          { name: 'active', type: 'boolean', defaultValue: true }
        ],
        lastModified: '2024-01-01T12:00:00Z'
      };
      const mockResponse = { data: mockQuery };

      mockedAxios.get.mockResolvedValue(mockResponse);

      const result = await getSpecificQueryAPI(queryName);

      expect(mockedAxios.get).toHaveBeenCalledWith(`${API_BASE_URL}/${queryName}`);
      expect(result).toEqual(mockQuery);
    });

    it('should handle query not found', async () => {
      const queryName = 'non-existent-query';
      const notFoundError = {
        response: {
          status: 404,
          data: { message: 'Query not found' }
        }
      };
      mockedAxios.get.mockRejectedValue(notFoundError);

      await expect(getSpecificQueryAPI(queryName)).rejects.toEqual(notFoundError);
      expect(mockedAxios.get).toHaveBeenCalledWith(`${API_BASE_URL}/${queryName}`);
    });

    it('should handle special characters in query name', async () => {
      const queryName = 'query-with-special-chars!@#';
      const mockResponse = { data: { name: queryName } };
      mockedAxios.get.mockResolvedValue(mockResponse);

      const result = await getSpecificQueryAPI(queryName);

      expect(mockedAxios.get).toHaveBeenCalledWith(`${API_BASE_URL}/${queryName}`);
      expect(result).toEqual({ name: queryName });
    });

    it('should handle empty query name', async () => {
      const queryName = '';
      const mockResponse = { data: null };
      mockedAxios.get.mockResolvedValue(mockResponse);

      const result = await getSpecificQueryAPI(queryName);

      expect(mockedAxios.get).toHaveBeenCalledWith(`${API_BASE_URL}/`);
      expect(result).toBe(null);
    });
  });

  describe('executeQueryAPI', () => {
    it('should execute query with parameters successfully', async () => {
      const queryName = 'user-report';
      const payload = {
        parameters: {
          active: true,
          department: 'Engineering',
          limit: 100
        },
        format: 'json'
      };
      const mockResult = {
        data: [
          { id: 1, name: 'John Doe', department: 'Engineering', active: true },
          { id: 2, name: 'Jane Smith', department: 'Engineering', active: true }
        ],
        metadata: {
          rowCount: 2,
          executionTime: 120,
          columns: ['id', 'name', 'department', 'active']
        }
      };
      const mockResponse = { data: mockResult };

      mockedAxios.post.mockResolvedValue(mockResponse);

      const result = await executeQueryAPI(queryName, payload);

      expect(mockedAxios.post).toHaveBeenCalledWith(
        `${API_BASE_URL}/${queryName}/execute`,
        payload
      );
      expect(result).toEqual(mockResult);
    });

    it('should execute query without parameters', async () => {
      const queryName = 'simple-count';
      const payload = {};
      const mockResult = {
        data: [{ count: 150 }],
        metadata: { rowCount: 1, executionTime: 50 }
      };
      const mockResponse = { data: mockResult };

      mockedAxios.post.mockResolvedValue(mockResponse);

      const result = await executeQueryAPI(queryName, payload);

      expect(mockedAxios.post).toHaveBeenCalledWith(
        `${API_BASE_URL}/${queryName}/execute`,
        payload
      );
      expect(result).toEqual(mockResult);
    });

    it('should handle SQL execution errors', async () => {
      const queryName = 'invalid-query';
      const payload = { parameters: {} };
      const sqlError = {
        response: {
          status: 400,
          data: {
            message: 'SQL syntax error near SELECT',
            sqlState: '42000',
            errorCode: 1064
          }
        }
      };
      mockedAxios.post.mockRejectedValue(sqlError);

      await expect(executeQueryAPI(queryName, payload)).rejects.toEqual(sqlError);
    });

    it('should handle timeout errors during execution', async () => {
      const queryName = 'long-running-query';
      const payload = { timeout: 30 };
      const timeoutError = {
        response: {
          status: 408,
          data: { message: 'Query execution timeout' }
        }
      };
      mockedAxios.post.mockRejectedValue(timeoutError);

      await expect(executeQueryAPI(queryName, payload)).rejects.toEqual(timeoutError);
    });
  });

  describe('createQueryAPI', () => {
    it('should create a new query successfully', async () => {
      const queryData = {
        name: 'new-query',
        sql: 'SELECT * FROM products WHERE category = ?',
        description: 'Get products by category',
        parameters: [
          { name: 'category', type: 'string', required: true }
        ],
        tags: ['product', 'category']
      };
      const mockCreatedQuery = {
        id: '3',
        ...queryData,
        createdBy: 'current-user',
        createdAt: '2024-01-03T00:00:00Z',
        version: 1
      };
      const mockResponse = { data: mockCreatedQuery };

      mockedAxios.post.mockResolvedValue(mockResponse);

      const result = await createQueryAPI(queryData);

      expect(mockedAxios.post).toHaveBeenCalledWith(`${API_BASE_URL}`, queryData);
      expect(result).toEqual(mockCreatedQuery);
    });

    it('should handle validation errors when creating query', async () => {
      const invalidQueryData = {
        name: '', // Invalid: empty name
        sql: 'INVALID SQL SYNTAX',
        description: ''
      };
      const validationError = {
        response: {
          status: 400,
          data: {
            message: 'Validation failed',
            errors: [
              'Query name is required',
              'SQL syntax is invalid',
              'Description is required'
            ]
          }
        }
      };
      mockedAxios.post.mockRejectedValue(validationError);

      await expect(createQueryAPI(invalidQueryData)).rejects.toEqual(validationError);
    });

    it('should handle duplicate query name errors', async () => {
      const queryData = {
        name: 'existing-query',
        sql: 'SELECT 1',
        description: 'Test query'
      };
      const duplicateError = {
        response: {
          status: 409,
          data: { message: 'Query with name "existing-query" already exists' }
        }
      };
      mockedAxios.post.mockRejectedValue(duplicateError);

      await expect(createQueryAPI(queryData)).rejects.toEqual(duplicateError);
    });

    it('should handle large query data', async () => {
      const largeQueryData = {
        name: 'large-query',
        sql: 'SELECT * FROM table1 JOIN table2 ON table1.id = table2.id'.repeat(100),
        description: 'Very long description'.repeat(50)
      };
      const mockResponse = { data: { id: '4', ...largeQueryData } };
      mockedAxios.post.mockResolvedValue(mockResponse);

      const result = await createQueryAPI(largeQueryData);

      expect(result.sql).toBe(largeQueryData.sql);
      expect(result.description).toBe(largeQueryData.description);
    });
  });

  describe('updateQueryAPI', () => {
    it('should update an existing query successfully', async () => {
      const queryName = 'existing-query';
      const updateData = {
        sql: 'SELECT * FROM users WHERE department = ? AND active = ?',
        description: 'Updated description for user query',
        parameters: [
          { name: 'department', type: 'string', required: true },
          { name: 'active', type: 'boolean', defaultValue: true }
        ]
      };
      const mockUpdatedQuery = {
        id: '1',
        name: queryName,
        ...updateData,
        updatedBy: 'current-user',
        updatedAt: '2024-01-03T12:00:00Z',
        version: 2
      };
      const mockResponse = { data: mockUpdatedQuery };

      mockedAxios.put.mockResolvedValue(mockResponse);

      const result = await updateQueryAPI(queryName, updateData);

      expect(mockedAxios.put).toHaveBeenCalledWith(
        `${API_BASE_URL}/${queryName}`,
        updateData
      );
      expect(result).toEqual(mockUpdatedQuery);
    });

    it('should handle query not found when updating', async () => {
      const queryName = 'non-existent-query';
      const updateData = { description: 'Updated description' };
      const notFoundError = {
        response: {
          status: 404,
          data: { message: 'Query not found' }
        }
      };
      mockedAxios.put.mockRejectedValue(notFoundError);

      await expect(updateQueryAPI(queryName, updateData)).rejects.toEqual(notFoundError);
    });

    it('should handle partial updates', async () => {
      const queryName = 'test-query';
      const partialUpdate = { description: 'Only updating description' };
      const mockResponse = {
        data: {
          id: '1',
          name: queryName,
          sql: 'SELECT * FROM users', // Unchanged
          description: 'Only updating description', // Updated
          version: 3
        }
      };
      mockedAxios.put.mockResolvedValue(mockResponse);

      const result = await updateQueryAPI(queryName, partialUpdate);

      expect(result.description).toBe(partialUpdate.description);
      expect(result.sql).toBe('SELECT * FROM users'); // Should remain unchanged
    });

    it('should handle update conflicts', async () => {
      const queryName = 'test-query';
      const updateData = { sql: 'SELECT * FROM orders' };
      const conflictError = {
        response: {
          status: 409,
          data: {
            message: 'Update conflict: query was modified by another user',
            currentVersion: 3,
            attemptedVersion: 2
          }
        }
      };
      mockedAxios.put.mockRejectedValue(conflictError);

      await expect(updateQueryAPI(queryName, updateData)).rejects.toEqual(conflictError);
    });
  });

  describe('deleteQueryAPI', () => {
    it('should delete a query successfully', async () => {
      const queryName = 'query-to-delete';
      const mockResponse = {
        data: {
          success: true,
          message: 'Query deleted successfully',
          deletedQuery: {
            id: '1',
            name: queryName,
            deletedAt: '2024-01-03T15:00:00Z',
            deletedBy: 'current-user'
          }
        }
      };
      mockedAxios.delete.mockResolvedValue(mockResponse);

      const result = await deleteQueryAPI(queryName);

      expect(mockedAxios.delete).toHaveBeenCalledWith(`${API_BASE_URL}/${queryName}`);
      expect(result).toEqual(mockResponse.data);
    });

    it('should handle query not found when deleting', async () => {
      const queryName = 'non-existent-query';
      const notFoundError = {
        response: {
          status: 404,
          data: { message: 'Query not found' }
        }
      };
      mockedAxios.delete.mockRejectedValue(notFoundError);

      await expect(deleteQueryAPI(queryName)).rejects.toEqual(notFoundError);
    });

    it('should handle permission errors when deleting', async () => {
      const queryName = 'protected-query';
      const permissionError = {
        response: {
          status: 403,
          data: {
            message: 'Insufficient permissions to delete this query',
            requiredRole: 'admin'
          }
        }
      };
      mockedAxios.delete.mockRejectedValue(permissionError);

      await expect(deleteQueryAPI(queryName)).rejects.toEqual(permissionError);
    });

    it('should handle queries that cannot be deleted due to dependencies', async () => {
      const queryName = 'referenced-query';
      const dependencyError = {
        response: {
          status: 409,
          data: {
            message: 'Cannot delete query: it is referenced by other queries',
            dependencies: ['dashboard-report', 'weekly-summary']
          }
        }
      };
      mockedAxios.delete.mockRejectedValue(dependencyError);

      await expect(deleteQueryAPI(queryName)).rejects.toEqual(dependencyError);
    });

    it('should handle soft delete responses', async () => {
      const queryName = 'soft-delete-query';
      const mockResponse = {
        data: {
          success: true,
          message: 'Query marked as deleted',
          softDeleted: true,
          canRestore: true,
          restoreUntil: '2024-02-03T00:00:00Z'
        }
      };
      mockedAxios.delete.mockResolvedValue(mockResponse);

      const result = await deleteQueryAPI(queryName);

      expect(result.softDeleted).toBe(true);
      expect(result.canRestore).toBe(true);
    });
  });

  describe('error handling and edge cases', () => {
    it('should handle server 500 errors', async () => {
      const serverError = {
        response: {
          status: 500,
          data: { message: 'Internal server error' }
        }
      };
      mockedAxios.get.mockRejectedValue(serverError);

      await expect(getAllQueriesAPI()).rejects.toEqual(serverError);
    });

    it('should handle malformed responses', async () => {
      const mockResponse = { data: null };
      mockedAxios.get.mockResolvedValue(mockResponse);

      const result = await getAllQueriesAPI();
      expect(result).toBe(null);
    });

    it('should handle connection timeouts', async () => {
      const timeoutError = new Error('timeout of 30000ms exceeded');
      timeoutError.name = 'TimeoutError';
      mockedAxios.get.mockRejectedValue(timeoutError);

      await expect(getAllQueriesAPI()).rejects.toThrow('timeout of 30000ms exceeded');
    });

    it('should handle authentication errors', async () => {
      const authError = {
        response: {
          status: 401,
          data: { message: 'Authentication required' }
        }
      };
      mockedAxios.get.mockRejectedValue(authError);

      await expect(getAllQueriesAPI()).rejects.toEqual(authError);
    });
  });
});