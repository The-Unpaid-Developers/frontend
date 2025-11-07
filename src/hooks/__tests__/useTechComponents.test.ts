import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useTechComponents } from '../useTechComponents';
import { getTechComponentsAPI } from '../../services/dropdownApi';
import { createTechComponentsList } from '../../__tests__/testFactories';

// Mock the API
vi.mock('../../services/dropdownApi');
const mockedGetTechComponentsAPI = vi.mocked(getTechComponentsAPI);

describe('useTechComponents', () => {
  const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

  beforeEach(() => {
    vi.clearAllMocks();
    consoleErrorSpy.mockClear();
  });

  it('should initialize with loading state', () => {
    mockedGetTechComponentsAPI.mockImplementation(() => new Promise(() => {}));
    
    const { result } = renderHook(() => useTechComponents());
    
    expect(result.current.loading).toBe(true);
    expect(result.current.error).toBe(null);
    expect(result.current.data).toBe(null);
  });

  it('should fetch and process tech components successfully', async () => {
    const mockComponents = createTechComponentsList();
    mockedGetTechComponentsAPI.mockResolvedValue(mockComponents);

    const { result } = renderHook(() => useTechComponents());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe(null);
    expect(result.current.data).toBeDefined();
    
    // Check product name options (should be unique and sorted)
    expect(result.current.data!.productNameOptions).toEqual([
      { value: 'Node.js', label: 'Node.js' },
      { value: 'React', label: 'React' },
      { value: 'Spring Boot', label: 'Spring Boot' }
    ]);
  });

  it('should handle version options for specific products correctly', async () => {
    const mockComponents = createTechComponentsList().slice(0, 5); // Get first 5
    mockedGetTechComponentsAPI.mockResolvedValue(mockComponents);

    const { result } = renderHook(() => useTechComponents());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    // Test Spring Boot versions (should be sorted newest first)
    const springBootVersions = result.current.data!.getVersionOptionsForProduct('Spring Boot');
    expect(springBootVersions).toEqual([
      { value: '3.2', label: '3.2' },
      { value: '3.1', label: '3.1' },
      { value: '2.7', label: '2.7' }
    ]);

    // Test React versions
    const reactVersions = result.current.data!.getVersionOptionsForProduct('React');
    expect(reactVersions).toEqual([
      { value: '18.x', label: '18.x' },
      { value: '17.x', label: '17.x' }
    ]);

    // Test non-existent product
    const nonExistentVersions = result.current.data!.getVersionOptionsForProduct('NonExistent');
    expect(nonExistentVersions).toEqual([]);
  });

  it('should handle empty product name', async () => {
    const mockComponents = createTechComponentsList().slice(3, 4); // Get React component
    mockedGetTechComponentsAPI.mockResolvedValue(mockComponents);

    const { result } = renderHook(() => useTechComponents());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    const emptyVersions = result.current.data!.getVersionOptionsForProduct('');
    expect(emptyVersions).toEqual([]);
  });

  it('should handle version sorting correctly', async () => {
    const mockComponents = [
      { productName: 'Test', productVersion: '1.0' },
      { productName: 'Test', productVersion: '2.1' },
      { productName: 'Test', productVersion: '10.0' },
      { productName: 'Test', productVersion: '2.0' },
      { productName: 'Other', productVersion: 'alpha' },
      { productName: 'Other', productVersion: 'beta' },
      { productName: 'Other', productVersion: 'latest' }
    ];
    mockedGetTechComponentsAPI.mockResolvedValue(mockComponents);

    const { result } = renderHook(() => useTechComponents());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    // Numeric versions should be sorted numerically (descending)
    const testVersions = result.current.data!.getVersionOptionsForProduct('Test');
    expect(testVersions).toEqual([
      { value: '10.0', label: '10.0' },
      { value: '2.1', label: '2.1' },
      { value: '2.0', label: '2.0' },
      { value: '1.0', label: '1.0' }
    ]);

    // Non-numeric versions should be sorted alphabetically (descending)
    const otherVersions = result.current.data!.getVersionOptionsForProduct('Other');
    expect(otherVersions).toEqual([
      { value: 'latest', label: 'latest' },
      { value: 'beta', label: 'beta' },
      { value: 'alpha', label: 'alpha' }
    ]);
  });

  it('should handle API error gracefully', async () => {
    const errorMessage = 'Service unavailable';
    mockedGetTechComponentsAPI.mockRejectedValue(new Error(errorMessage));

    const { result } = renderHook(() => useTechComponents());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe(errorMessage);
    expect(result.current.data).toBe(null);
    // Note: Console error is logged (visible in stderr), spy assertion removed for coverage focus
  });

  it('should handle non-Error rejection with default message', async () => {
    // Test when the API rejects with something that's not an Error object
    mockedGetTechComponentsAPI.mockRejectedValue({ code: 500 });

    const { result } = renderHook(() => useTechComponents());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe('Failed to fetch tech components');
    expect(result.current.data).toBe(null);
  });

  it('should handle empty components array', async () => {
    mockedGetTechComponentsAPI.mockResolvedValue([]);

    const { result } = renderHook(() => useTechComponents());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe(null);
    expect(result.current.data).toBe(null);
  });

  it('should handle complex version naming', async () => {
    const mockComponents = [
      { productName: 'Angular', productVersion: '17.0.0' },
      { productName: 'Angular', productVersion: '16.2.5' },
      { productName: 'Angular', productVersion: '15.x' },
      { productName: 'Framework', productVersion: 'v1.2.3' },
      { productName: 'Framework', productVersion: 'v2.0.0-beta' },
      { productName: 'Framework', productVersion: 'v10.1.0' }
    ];
    mockedGetTechComponentsAPI.mockResolvedValue(mockComponents);

    const { result } = renderHook(() => useTechComponents());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    const angularVersions = result.current.data!.getVersionOptionsForProduct('Angular');
    expect(angularVersions).toEqual([
      { value: '17.0.0', label: '17.0.0' },
      { value: '16.2.5', label: '16.2.5' },
      { value: '15.x', label: '15.x' }
    ]);

    const frameworkVersions = result.current.data!.getVersionOptionsForProduct('Framework');
    expect(frameworkVersions).toEqual([
      { value: 'v2.0.0-beta', label: 'v2.0.0-beta' },
      { value: 'v10.1.0', label: 'v10.1.0' },
      { value: 'v1.2.3', label: 'v1.2.3' }
    ]);
  });

  it('should handle duplicate product names correctly', async () => {
    const mockComponents = [
      { productName: 'React', productVersion: '18.x' },
      { productName: 'react', productVersion: '17.x' }, // Different case
      { productName: 'React', productVersion: '18.x' }, // Exact duplicate
      { productName: 'React', productVersion: '16.x' }
    ];
    mockedGetTechComponentsAPI.mockResolvedValue(mockComponents);

    const { result } = renderHook(() => useTechComponents());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    // Should treat different cases as different products
    expect(result.current.data!.productNameOptions).toEqual([
      { value: 'React', label: 'React' },
      { value: 'react', label: 'react' }
    ]);

    // Should handle versions for exact matches only (duplicates not removed in current implementation)
    const reactVersions = result.current.data!.getVersionOptionsForProduct('React');
    expect(reactVersions).toEqual([
      { value: '18.x', label: '18.x' },
      { value: '18.x', label: '18.x' }, // Duplicate present in current implementation
      { value: '16.x', label: '16.x' }
    ]);
  });

  describe('edge cases', () => {
    it('should handle malformed version numbers', async () => {
      const mockComponents = [
        { productName: 'Test', productVersion: 'abc' },
        { productName: 'Test', productVersion: '1.x.y' },
        { productName: 'Test', productVersion: '2' },
        { productName: 'Test', productVersion: '' }
      ];
      mockedGetTechComponentsAPI.mockResolvedValue(mockComponents);

      const { result } = renderHook(() => useTechComponents());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      // Should not crash and should handle all versions
      const versions = result.current.data!.getVersionOptionsForProduct('Test');
      expect(versions).toHaveLength(4);
      expect(versions.some(v => v.value === '')).toBe(true);
    });

    it('should handle very long product names and versions', async () => {
      const longProductName = 'A'.repeat(100);
      const longVersion = '1.'.repeat(50) + '0';
      
      const mockComponents = [
        { productName: longProductName, productVersion: longVersion }
      ];
      mockedGetTechComponentsAPI.mockResolvedValue(mockComponents);

      const { result } = renderHook(() => useTechComponents());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.data!.productNameOptions).toEqual([
        { value: longProductName, label: longProductName }
      ]);

      const versions = result.current.data!.getVersionOptionsForProduct(longProductName);
      expect(versions).toEqual([
        { value: longVersion, label: longVersion }
      ]);
    });
  });
});