import { describe, it, expect, vi, beforeEach } from 'vitest';
import axios from 'axios';
import {
  getSystemFlowAPI,
  getOverallSystemsFlowAPI,
  getSystemPaths,
  getBusinessCapabilities,
  getSystemBusinessCapabilities
} from '../diagramApi';
import { expectAsyncError } from '../../test/helpers/testHelpers';
import { TEST_CONFIG } from '../../test/config';

// Mock axios
vi.mock('axios');
const mockedAxios = vi.mocked(axios, true);

describe('diagramApi', () => {
  const API_BASE_URL = TEST_CONFIG.API_BASE_URLS.DIAGRAM_SERVICE;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getSystemFlowAPI', () => {
    it('should fetch system flow data successfully', async () => {
      const systemCode = 'SYS001';
      const mockFlowData = {
        nodes: [
          { id: 'node1', name: 'Service A', type: 'service', criticality: 'Major' },
          { id: 'node2', name: 'Service B', type: 'service', criticality: 'Standard-1' },
          { id: 'node3', name: 'Database', type: 'database', criticality: 'Major' }
        ],
        edges: [
          { source: 'node1', target: 'node2', type: 'api_call', label: 'REST API' },
          { source: 'node2', target: 'node3', type: 'database_access', label: 'SQL' }
        ],
        metadata: {
          systemCode,
          lastUpdated: '2024-01-01T00:00:00Z',
          nodeCount: 3,
          edgeCount: 2
        }
      };
      const mockResponse = { data: mockFlowData };

      mockedAxios.get.mockResolvedValue(mockResponse);

      const result = await getSystemFlowAPI(systemCode);

      expect(mockedAxios.get).toHaveBeenCalledWith(
        `${API_BASE_URL}/diagram/system-dependencies/${systemCode}`
      );
      expect(result).toEqual(mockFlowData);
    });

    it('should handle system not found error', async () => {
      const systemCode = 'NONEXISTENT';
      const notFoundError = {
        response: {
          status: 404,
          data: { message: 'System not found' }
        }
      };
      mockedAxios.get.mockRejectedValue(notFoundError);

      await expectAsyncError(
        () => getSystemFlowAPI(systemCode),
        'System not found'
      );
      expect(mockedAxios.get).toHaveBeenCalledWith(
        `${API_BASE_URL}/diagram/system-dependencies/${systemCode}`
      );
    });

    it('should handle empty system code', async () => {
      const systemCode = '';
      const mockResponse = { data: { nodes: [], edges: [] } };
      mockedAxios.get.mockResolvedValue(mockResponse);

      const result = await getSystemFlowAPI(systemCode);

      expect(mockedAxios.get).toHaveBeenCalledWith(
        `${API_BASE_URL}/diagram/system-dependencies/`
      );
      expect(result).toEqual({ nodes: [], edges: [] });
    });

    it('should handle systems with special characters', async () => {
      const systemCode = 'SYS-001_v2.0';
      const mockResponse = { data: { nodes: [], edges: [] } };
      mockedAxios.get.mockResolvedValue(mockResponse);

      await getSystemFlowAPI(systemCode);

      expect(mockedAxios.get).toHaveBeenCalledWith(
        `${API_BASE_URL}/diagram/system-dependencies/${systemCode}`
      );
    });

    it('should handle large system flow data', async () => {
      const systemCode = 'LARGE_SYSTEM';
      const mockFlowData = {
        nodes: Array.from({ length: 1000 }, (_, i) => ({
          id: `node${i}`,
          name: `Service ${i}`,
          type: 'service'
        })),
        edges: Array.from({ length: 2000 }, (_, i) => ({
          source: `node${i % 500}`,
          target: `node${(i + 1) % 500}`,
          type: 'dependency'
        }))
      };
      const mockResponse = { data: mockFlowData };
      mockedAxios.get.mockResolvedValue(mockResponse);

      const result = await getSystemFlowAPI(systemCode);

      expect(result.nodes).toHaveLength(1000);
      expect(result.edges).toHaveLength(2000);
    });
  });

  describe('getOverallSystemsFlowAPI', () => {
    it('should fetch overall systems flow data successfully', async () => {
      const mockOverallData = {
        systems: [
          { id: 'sys1', name: 'Payment System', status: 'active', criticality: 'Major' },
          { id: 'sys2', name: 'User Management', status: 'active', criticality: 'Standard-1' },
          { id: 'sys3', name: 'Notification Service', status: 'maintenance', criticality: 'Standard-2' }
        ],
        connections: [
          { from: 'sys1', to: 'sys2', type: 'api_call', frequency: 'high' },
          { from: 'sys2', to: 'sys3', type: 'event', frequency: 'medium' }
        ],
        metrics: {
          totalSystems: 3,
          activeConnections: 2,
          lastRefresh: '2024-01-01T00:00:00Z'
        }
      };
      const mockResponse = { data: mockOverallData };

      mockedAxios.get.mockResolvedValue(mockResponse);

      const result = await getOverallSystemsFlowAPI();

      expect(mockedAxios.get).toHaveBeenCalledWith(
        `${API_BASE_URL}/diagram/system-dependencies/all`
      );
      expect(result).toEqual(mockOverallData);
    });

    it('should handle empty systems landscape', async () => {
      const mockResponse = {
        data: {
          systems: [],
          connections: [],
          metrics: { totalSystems: 0, activeConnections: 0 }
        }
      };
      mockedAxios.get.mockResolvedValue(mockResponse);

      const result = await getOverallSystemsFlowAPI();

      expect(result.systems).toEqual([]);
      expect(result.connections).toEqual([]);
      expect(result.metrics.totalSystems).toBe(0);
    });

    it('should handle service unavailable error', async () => {
      const serviceError = {
        response: {
          status: 503,
          data: { message: 'Service temporarily unavailable' }
        }
      };
      mockedAxios.get.mockRejectedValue(serviceError);

      await expectAsyncError(
        () => getOverallSystemsFlowAPI(),
        'Service temporarily unavailable'
      );
    });

    it('should handle network timeout', async () => {
      const timeoutError = new Error('timeout of 10000ms exceeded');
      timeoutError.name = 'TimeoutError';
      mockedAxios.get.mockRejectedValue(timeoutError);

      await expectAsyncError(
        () => getOverallSystemsFlowAPI(),
        'timeout of 10000ms exceeded'
      );
    });

    it('should handle authentication errors', async () => {
      const authError = {
        response: {
          status: 401,
          data: { message: 'Authentication required' }
        }
      };
      mockedAxios.get.mockRejectedValue(authError);

      await expectAsyncError(
        () => getOverallSystemsFlowAPI(),
        'Authentication required'
      );
    });
  });

  describe('getSystemPaths', () => {
    it('should fetch system paths successfully', async () => {
      const producerSystemCode = 'PRODUCER01';
      const consumerSystemCode = 'CONSUMER01';
      const mockPathsData = {
        paths: [
          {
            id: 'path1',
            route: ['PRODUCER01', 'MIDDLEWARE_A', 'CONSUMER01'],
            hops: 2,
            latency: '150ms',
            throughput: '1000req/s',
            reliability: 99.9
          },
          {
            id: 'path2',
            route: ['PRODUCER01', 'MIDDLEWARE_B', 'MIDDLEWARE_C', 'CONSUMER01'],
            hops: 3,
            latency: '280ms',
            throughput: '500req/s',
            reliability: 99.5
          }
        ],
        summary: {
          totalPaths: 2,
          shortestHops: 2,
          fastestLatency: '150ms',
          bestReliability: 99.9
        }
      };
      const mockResponse = { data: mockPathsData };

      mockedAxios.get.mockResolvedValue(mockResponse);

      const result = await getSystemPaths(producerSystemCode, consumerSystemCode);

      expect(mockedAxios.get).toHaveBeenCalledWith(
        `${API_BASE_URL}/diagram/system-dependencies/path?start=${producerSystemCode}&end=${consumerSystemCode}`
      );
      expect(result).toEqual(mockPathsData);
    });

    it('should handle no path found between systems', async () => {
      const producerSystemCode = 'ISOLATED_PRODUCER';
      const consumerSystemCode = 'ISOLATED_CONSUMER';
      const noPathResponse = {
        data: {
          paths: [],
          summary: { totalPaths: 0, message: 'No path found between systems' }
        }
      };
      mockedAxios.get.mockResolvedValue(noPathResponse);

      const result = await getSystemPaths(producerSystemCode, consumerSystemCode);

      expect(result.paths).toEqual([]);
      expect(result.summary.totalPaths).toBe(0);
    });

    it('should handle invalid system codes', async () => {
      const producerSystemCode = 'INVALID_PRODUCER';
      const consumerSystemCode = 'INVALID_CONSUMER';
      const invalidError = {
        response: {
          status: 400,
          data: { message: 'Invalid system codes provided' }
        }
      };
      mockedAxios.get.mockRejectedValue(invalidError);

      await expectAsyncError(
        () => getSystemPaths(producerSystemCode, consumerSystemCode),
        'Invalid system codes provided'
      );
    });

    it('should handle same producer and consumer', async () => {
      const systemCode = 'SAME_SYSTEM';
      const mockResponse = {
        data: {
          paths: [{ route: [systemCode], hops: 0, latency: '0ms' }],
          summary: { totalPaths: 1, message: 'Self-referencing system' }
        }
      };
      mockedAxios.get.mockResolvedValue(mockResponse);

      const result = await getSystemPaths(systemCode, systemCode);

      expect(result.paths[0].hops).toBe(0);
      expect(result.summary.message).toBe('Self-referencing system');
    });

    it('should handle special characters in system codes', async () => {
      const producerSystemCode = 'SYS-001_v2.0';
      const consumerSystemCode = 'SYS@002#test';
      const mockResponse = { data: { paths: [] } };
      mockedAxios.get.mockResolvedValue(mockResponse);

      await getSystemPaths(producerSystemCode, consumerSystemCode);

      expect(mockedAxios.get).toHaveBeenCalledWith(
        `${API_BASE_URL}/diagram/system-dependencies/path?start=${producerSystemCode}&end=${consumerSystemCode}`
      );
    });
  });

  describe('getBusinessCapabilities', () => {
    it('should fetch business capabilities successfully', async () => {
      const mockCapabilities = {
        capabilities: [
          {
            id: 'l1-customer-mgmt',
            name: 'Customer Management',
            level: 'L1',
            parentId: null,
            systemCount: 5,
            children: [
              {
                id: 'l2-customer-onboarding',
                name: 'Customer Onboarding',
                level: 'L2',
                parentId: 'l1-customer-mgmt',
                systemCount: 2
              },
              {
                id: 'l2-customer-service',
                name: 'Customer Service',
                level: 'L2',
                parentId: 'l1-customer-mgmt',
                systemCount: 3
              }
            ]
          },
          {
            id: 'l1-order-mgmt',
            name: 'Order Management',
            level: 'L1',
            parentId: null,
            systemCount: 8,
            children: []
          }
        ],
        metadata: {
          totalCapabilities: 4,
          totalSystems: 13,
          lastUpdated: '2024-01-01T00:00:00Z'
        }
      };
      const mockResponse = { data: mockCapabilities };

      mockedAxios.get.mockResolvedValue(mockResponse);

      const result = await getBusinessCapabilities();

      expect(mockedAxios.get).toHaveBeenCalledWith(
        `${API_BASE_URL}/diagram/business-capabilities/all`
      );
      expect(result).toEqual(mockCapabilities);
    });

    it('should handle empty business capabilities', async () => {
      const mockResponse = {
        data: {
          capabilities: [],
          metadata: { totalCapabilities: 0, totalSystems: 0 }
        }
      };
      mockedAxios.get.mockResolvedValue(mockResponse);

      const result = await getBusinessCapabilities();

      expect(result.capabilities).toEqual([]);
      expect(result.metadata.totalCapabilities).toBe(0);
    });

    it('should handle authorization errors', async () => {
      const authError = {
        response: {
          status: 403,
          data: { message: 'Insufficient permissions to view business capabilities' }
        }
      };
      mockedAxios.get.mockRejectedValue(authError);

      await expectAsyncError(
        () => getBusinessCapabilities(),
        'Insufficient permissions to view business capabilities'
      );
    });

    it('should handle malformed capability data', async () => {
      const mockResponse = { data: null };
      mockedAxios.get.mockResolvedValue(mockResponse);

      const result = await getBusinessCapabilities();

      expect(result).toBe(null);
    });

    it('should handle large capability hierarchies', async () => {
      const largeCapabilities = {
        capabilities: Array.from({ length: 100 }, (_, i) => ({
          id: `l1-cap-${i}`,
          name: `Capability ${i}`,
          level: 'L1',
          parentId: null,
          systemCount: (i % 10) + 1, // Deterministic value 1-10
          children: Array.from({ length: 5 }, (_, j) => ({
            id: `l2-cap-${i}-${j}`,
            name: `Sub Capability ${i}-${j}`,
            level: 'L2',
            parentId: `l1-cap-${i}`,
            systemCount: ((i + j) % 3) + 1 // Deterministic value 1-3
          }))
        }))
      };
      const mockResponse = { data: largeCapabilities };
      mockedAxios.get.mockResolvedValue(mockResponse);

      const result = await getBusinessCapabilities();

      expect(result.capabilities).toHaveLength(100);
      expect(result.capabilities[0].children).toHaveLength(5);
    });
  });

  describe('getSystemBusinessCapabilities', () => {
    it('should fetch system business capabilities successfully', async () => {
      const systemCode = 'SYS001';
      const mockSystemCapabilities = {
        systemCode: 'SYS001',
        systemName: 'Payment Processing System',
        capabilities: [
          {
            id: 'pay-processing',
            name: 'Payment Processing',
            level: 'L3',
            coverage: 'full',
            maturity: 'optimized',
            importance: 'critical'
          },
          {
            id: 'refund-mgmt',
            name: 'Refund Management',
            level: 'L3',
            coverage: 'partial',
            maturity: 'defined',
            importance: 'important'
          },
          {
            id: 'fraud-detection',
            name: 'Fraud Detection',
            level: 'L3',
            coverage: 'supporting',
            maturity: 'repeatable',
            importance: 'important'
          }
        ],
        summary: {
          totalCapabilities: 3,
          fullCoverage: 1,
          partialCoverage: 1,
          supportingCoverage: 1,
          avgMaturityScore: 3.2
        }
      };
      const mockResponse = { data: mockSystemCapabilities };

      mockedAxios.get.mockResolvedValue(mockResponse);

      const result = await getSystemBusinessCapabilities(systemCode);

      expect(mockedAxios.get).toHaveBeenCalledWith(
        `${API_BASE_URL}/diagram/business-capabilities/${systemCode}`
      );
      expect(result).toEqual(mockSystemCapabilities);
    });

    it('should handle system with no capabilities', async () => {
      const systemCode = 'SYS_NO_CAPS';
      const mockResponse = {
        data: {
          systemCode: 'SYS_NO_CAPS',
          systemName: 'Legacy System',
          capabilities: [],
          summary: {
            totalCapabilities: 0,
            message: 'No business capabilities mapped for this system'
          }
        }
      };
      mockedAxios.get.mockResolvedValue(mockResponse);

      const result = await getSystemBusinessCapabilities(systemCode);

      expect(result.capabilities).toEqual([]);
      expect(result.summary.totalCapabilities).toBe(0);
    });

    it('should handle system not found', async () => {
      const systemCode = 'NONEXISTENT_SYSTEM';
      const notFoundError = {
        response: {
          status: 404,
          data: { message: 'System not found in business capability mapping' }
        }
      };
      mockedAxios.get.mockRejectedValue(notFoundError);

      await expectAsyncError(
        () => getSystemBusinessCapabilities(systemCode),
        'System not found in business capability mapping'
      );
    });

    it('should handle systems with legacy capability mappings', async () => {
      const systemCode = 'LEGACY_SYS';
      const mockResponse = {
        data: {
          systemCode: 'LEGACY_SYS',
          systemName: 'Legacy Mainframe System',
          capabilities: [
            {
              id: 'legacy-cap-1',
              name: 'UNKNOWN_CAPABILITY',
              level: 'L1',
              coverage: 'unknown',
              maturity: 'unknown',
              importance: 'unknown',
              notes: 'Legacy system with unmapped capabilities'
            }
          ],
          summary: { totalCapabilities: 1, mappingStatus: 'incomplete' }
        }
      };
      mockedAxios.get.mockResolvedValue(mockResponse);

      const result = await getSystemBusinessCapabilities(systemCode);

      expect(result.capabilities[0].coverage).toBe('unknown');
      expect(result.summary.mappingStatus).toBe('incomplete');
    });

    it('should handle empty system code', async () => {
      const systemCode = '';
      const mockResponse = { data: { capabilities: [] } };
      mockedAxios.get.mockResolvedValue(mockResponse);

      const result = await getSystemBusinessCapabilities(systemCode);

      expect(mockedAxios.get).toHaveBeenCalledWith(
        `${API_BASE_URL}/diagram/business-capabilities/`
      );
      expect(result.capabilities).toEqual([]);
    });
  });

  describe('error handling and edge cases', () => {
    it('should handle server maintenance mode', async () => {
      const maintenanceError = {
        response: {
          status: 503,
          data: {
            message: 'Service temporarily unavailable for maintenance',
            retryAfter: '2024-01-01T01:00:00Z'
          }
        }
      };
      mockedAxios.get.mockRejectedValue(maintenanceError);

      await expectAsyncError(
        () => getBusinessCapabilities(),
        'Service temporarily unavailable for maintenance'
      );
    });

    it('should handle rate limiting', async () => {
      const rateLimitError = {
        response: {
          status: 429,
          data: {
            message: 'Rate limit exceeded',
            retryAfter: 60
          }
        }
      };
      mockedAxios.get.mockRejectedValue(rateLimitError);

      await expectAsyncError(
        () => getOverallSystemsFlowAPI(),
        'Rate limit exceeded'
      );
    });

    it('should handle malformed JSON responses', async () => {
      const mockResponse = { data: '{"invalid": json}' };
      mockedAxios.get.mockResolvedValue(mockResponse);

      const result = await getSystemFlowAPI('SYS001');

      expect(result).toBe('{"invalid": json}');
    });

    it('should handle partial data responses', async () => {
      const partialResponse = {
        data: {
          nodes: [{ id: 'partial' }]
          // Missing edges property
        }
      };
      mockedAxios.get.mockResolvedValue(partialResponse);

      const result = await getSystemFlowAPI('SYS001');

      expect(result.nodes).toEqual([{ id: 'partial' }]);
      expect(result.edges).toBeUndefined();
    });
  });
});