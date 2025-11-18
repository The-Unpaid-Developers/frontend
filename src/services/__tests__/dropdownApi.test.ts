import { describe, it, expect, vi, beforeEach } from 'vitest';
import axios from 'axios';
import {
  getBusinessCapabilitiesAPI,
  getTechComponentsAPI,
  type BusinessCapability,
  type TechComponent
} from '../dropdownApi';
import { TEST_CONFIG } from '../../test/config';

// Mock axios
vi.mock('axios');
const mockedAxios = vi.mocked(axios, true);

describe('dropdownApi', () => {
  // API_BASE_URL is already constructed with /api/v1/dropdowns in dropdownApi.ts
  const API_BASE_URL = `${TEST_CONFIG.API_BASE_URLS.CORE_SERVICE}/dropdowns`;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getBusinessCapabilitiesAPI', () => {
    it('should fetch business capabilities successfully', async () => {
      const mockCapabilities: BusinessCapability[] = [
        { l1: 'Customer Management', l2: 'Customer Onboarding', l3: 'Digital Registration' },
        { l1: 'Product Management', l2: 'Product Catalog', l3: 'Product Listing' },
        { l1: 'Risk Management', l2: 'Risk Assessment', l3: 'Credit Scoring' }
      ];
      const mockResponse = { data: mockCapabilities };

      mockedAxios.get.mockResolvedValue(mockResponse);

      const result = await getBusinessCapabilitiesAPI();

      expect(mockedAxios.get).toHaveBeenCalledWith(
        `${API_BASE_URL}/business-capabilities`
      );
      expect(result).toEqual(mockCapabilities);
    });

    it('should handle empty business capabilities list', async () => {
      const mockResponse = { data: [] };

      mockedAxios.get.mockResolvedValue(mockResponse);

      const result = await getBusinessCapabilitiesAPI();

      expect(result).toEqual([]);
      expect(result).toHaveLength(0);
    });

    it('should handle API error gracefully', async () => {
      const apiError = {
        response: {
          status: 500,
          data: { message: 'Internal server error' }
        }
      };
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      mockedAxios.get.mockRejectedValue(apiError);

      await expect(getBusinessCapabilitiesAPI()).rejects.toEqual(apiError);
      expect(consoleSpy).toHaveBeenCalledWith(
        'Error fetching business capabilities:',
        apiError
      );

      consoleSpy.mockRestore();
    });

    it('should handle network error', async () => {
      const networkError = new Error('Network Error');
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      mockedAxios.get.mockRejectedValue(networkError);

      await expect(getBusinessCapabilitiesAPI()).rejects.toEqual(networkError);
      expect(consoleSpy).toHaveBeenCalled();

      consoleSpy.mockRestore();
    });

    it('should handle unauthorized access', async () => {
      const unauthorizedError = {
        response: {
          status: 401,
          data: { message: 'Unauthorized' }
        }
      };

      mockedAxios.get.mockRejectedValue(unauthorizedError);

      await expect(getBusinessCapabilitiesAPI()).rejects.toEqual(unauthorizedError);
    });

    it('should return business capabilities with all fields populated', async () => {
      const mockCapabilities: BusinessCapability[] = [
        {
          l1: 'Customer Management',
          l2: 'Customer Onboarding',
          l3: 'Digital Registration'
        }
      ];
      const mockResponse = { data: mockCapabilities };

      mockedAxios.get.mockResolvedValue(mockResponse);

      const result = await getBusinessCapabilitiesAPI();

      expect(result[0]).toHaveProperty('l1');
      expect(result[0]).toHaveProperty('l2');
      expect(result[0]).toHaveProperty('l3');
      expect(result[0].l1).toBe('Customer Management');
      expect(result[0].l2).toBe('Customer Onboarding');
      expect(result[0].l3).toBe('Digital Registration');
    });

    it('should handle large number of business capabilities', async () => {
      const mockCapabilities: BusinessCapability[] = Array.from({ length: 100 }, (_, i) => ({
        l1: `L1-${i}`,
        l2: `L2-${i}`,
        l3: `L3-${i}`
      }));
      const mockResponse = { data: mockCapabilities };

      mockedAxios.get.mockResolvedValue(mockResponse);

      const result = await getBusinessCapabilitiesAPI();

      expect(result).toHaveLength(100);
      expect(result[0].l1).toBe('L1-0');
      expect(result[99].l1).toBe('L1-99');
    });
  });

  describe('getTechComponentsAPI', () => {
    it('should fetch tech components successfully', async () => {
      const mockComponents: TechComponent[] = [
        { productName: 'Java', productVersion: '17' },
        { productName: 'Spring Boot', productVersion: '3.1.0' },
        { productName: 'React', productVersion: '18.2.0' }
      ];
      const mockResponse = { data: mockComponents };

      mockedAxios.get.mockResolvedValue(mockResponse);

      const result = await getTechComponentsAPI();

      expect(mockedAxios.get).toHaveBeenCalledWith(
        `${API_BASE_URL}/tech-components`
      );
      expect(result).toEqual(mockComponents);
    });

    it('should handle empty tech components list', async () => {
      const mockResponse = { data: [] };

      mockedAxios.get.mockResolvedValue(mockResponse);

      const result = await getTechComponentsAPI();

      expect(result).toEqual([]);
      expect(result).toHaveLength(0);
    });

    it('should handle API error gracefully', async () => {
      const apiError = {
        response: {
          status: 500,
          data: { message: 'Internal server error' }
        }
      };
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      mockedAxios.get.mockRejectedValue(apiError);

      await expect(getTechComponentsAPI()).rejects.toEqual(apiError);
      expect(consoleSpy).toHaveBeenCalledWith(
        'Error fetching tech components:',
        apiError
      );

      consoleSpy.mockRestore();
    });

    it('should handle network error', async () => {
      const networkError = new Error('Network Error');
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      mockedAxios.get.mockRejectedValue(networkError);

      await expect(getTechComponentsAPI()).rejects.toEqual(networkError);
      expect(consoleSpy).toHaveBeenCalled();

      consoleSpy.mockRestore();
    });

    it('should handle timeout error', async () => {
      const timeoutError = new Error('timeout of 5000ms exceeded');
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      mockedAxios.get.mockRejectedValue(timeoutError);

      await expect(getTechComponentsAPI()).rejects.toEqual(timeoutError);
      expect(consoleSpy).toHaveBeenCalled();

      consoleSpy.mockRestore();
    });

    it('should return tech components with all fields populated', async () => {
      const mockComponents: TechComponent[] = [
        { productName: 'PostgreSQL', productVersion: '15.2' }
      ];
      const mockResponse = { data: mockComponents };

      mockedAxios.get.mockResolvedValue(mockResponse);

      const result = await getTechComponentsAPI();

      expect(result[0]).toHaveProperty('productName');
      expect(result[0]).toHaveProperty('productVersion');
      expect(result[0].productName).toBe('PostgreSQL');
      expect(result[0].productVersion).toBe('15.2');
    });

    it('should handle tech components with various version formats', async () => {
      const mockComponents: TechComponent[] = [
        { productName: 'Java', productVersion: '17' },
        { productName: 'Spring Boot', productVersion: '3.1.0' },
        { productName: 'Node.js', productVersion: 'v18.16.0' },
        { productName: 'Kubernetes', productVersion: '1.27.3' }
      ];
      const mockResponse = { data: mockComponents };

      mockedAxios.get.mockResolvedValue(mockResponse);

      const result = await getTechComponentsAPI();

      expect(result).toHaveLength(4);
      expect(result[0].productVersion).toBe('17');
      expect(result[1].productVersion).toBe('3.1.0');
      expect(result[2].productVersion).toBe('v18.16.0');
      expect(result[3].productVersion).toBe('1.27.3');
    });

    it('should handle large number of tech components', async () => {
      const mockComponents: TechComponent[] = Array.from({ length: 50 }, (_, i) => ({
        productName: `Product-${i}`,
        productVersion: `${i}.0.0`
      }));
      const mockResponse = { data: mockComponents };

      mockedAxios.get.mockResolvedValue(mockResponse);

      const result = await getTechComponentsAPI();

      expect(result).toHaveLength(50);
      expect(result[0].productName).toBe('Product-0');
      expect(result[49].productName).toBe('Product-49');
    });

    it('should handle forbidden access', async () => {
      const forbiddenError = {
        response: {
          status: 403,
          data: { message: 'Forbidden' }
        }
      };

      mockedAxios.get.mockRejectedValue(forbiddenError);

      await expect(getTechComponentsAPI()).rejects.toEqual(forbiddenError);
    });
  });

  describe('API Integration', () => {
    it('should be able to fetch both APIs independently', async () => {
      const mockCapabilities: BusinessCapability[] = [
        { l1: 'L1', l2: 'L2', l3: 'L3' }
      ];
      const mockComponents: TechComponent[] = [
        { productName: 'Java', productVersion: '17' }
      ];

      mockedAxios.get
        .mockResolvedValueOnce({ data: mockCapabilities })
        .mockResolvedValueOnce({ data: mockComponents });

      const capabilitiesResult = await getBusinessCapabilitiesAPI();
      const componentsResult = await getTechComponentsAPI();

      expect(capabilitiesResult).toEqual(mockCapabilities);
      expect(componentsResult).toEqual(mockComponents);
      expect(mockedAxios.get).toHaveBeenCalledTimes(2);
    });

    it('should handle one API failing while other succeeds', async () => {
      const mockComponents: TechComponent[] = [
        { productName: 'Java', productVersion: '17' }
      ];
      const capabilitiesError = new Error('Capabilities service down');
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      mockedAxios.get
        .mockRejectedValueOnce(capabilitiesError)
        .mockResolvedValueOnce({ data: mockComponents });

      await expect(getBusinessCapabilitiesAPI()).rejects.toEqual(capabilitiesError);
      const componentsResult = await getTechComponentsAPI();

      expect(componentsResult).toEqual(mockComponents);

      consoleSpy.mockRestore();
    });
  });
});
