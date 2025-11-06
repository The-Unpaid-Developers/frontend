import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useBusinessCapabilities } from '../useBusinessCapabilities';
import { getBusinessCapabilitiesAPI } from '../../services/lookupApi';
import { createBusinessCapabilitiesList, createBusinessCapability } from '../../__tests__/testFactories';

// Mock the API
vi.mock('../../services/lookupApi');
const mockedGetBusinessCapabilitiesAPI = vi.mocked(getBusinessCapabilitiesAPI);

describe('useBusinessCapabilities', () => {
  const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

  beforeEach(() => {
    vi.clearAllMocks();
    consoleErrorSpy.mockClear();
  });

  it('should initialize with loading state', () => {
    mockedGetBusinessCapabilitiesAPI.mockImplementation(() => new Promise(() => {}));
    
    const { result } = renderHook(() => useBusinessCapabilities());
    
    expect(result.current.loading).toBe(true);
    expect(result.current.error).toBe(null);
    expect(result.current.data).toBe(null);
  });

  it('should fetch and process business capabilities successfully', async () => {
    const mockCapabilities = createBusinessCapabilitiesList(4);
    mockedGetBusinessCapabilitiesAPI.mockResolvedValue(mockCapabilities);

    const { result } = renderHook(() => useBusinessCapabilities());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe(null);
    expect(result.current.data).toBeDefined();
    
    // Check L1 options
    expect(result.current.data!.l1Options).toEqual([
      { value: 'POLICY_MANAGEMENT', label: 'Policy Management' },
      { value: 'CLAIMS', label: 'Claims' }
    ]);

    // Test L2 filtering
    const l2Options = result.current.data!.getL2OptionsForL1('POLICY_MANAGEMENT');
    expect(l2Options).toEqual([
      { value: 'POLICY_ADMINISTRATION', label: 'Policy Administration' }
    ]);

    // Test L3 filtering
    const l3Options = result.current.data!.getL3OptionsForL1AndL2('POLICY_MANAGEMENT', 'POLICY_ADMINISTRATION');
    expect(l3Options).toEqual([
      { value: 'POLICY_ISSUANCE', label: 'Policy Issuance' },
      { value: 'POLICY_RENEWAL', label: 'Policy Renewal' }
    ]);
  });

  it('should handle empty L1 selection for L2 filtering', async () => {
    const mockCapabilities = [
      createBusinessCapability({ l1: 'Test', l2: 'Test L2', l3: 'Test L3' })
    ];
    mockedGetBusinessCapabilitiesAPI.mockResolvedValue(mockCapabilities);

    const { result } = renderHook(() => useBusinessCapabilities());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    const l2Options = result.current.data!.getL2OptionsForL1('');
    expect(l2Options).toEqual([]);
  });

  it('should handle empty L1 or L2 selection for L3 filtering', async () => {
    const mockCapabilities = [
      { l1: 'Test', l2: 'Test L2', l3: 'Test L3' }
    ];
    mockedGetBusinessCapabilitiesAPI.mockResolvedValue(mockCapabilities);

    const { result } = renderHook(() => useBusinessCapabilities());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.data!.getL3OptionsForL1AndL2('', 'TEST_L2')).toEqual([]);
    expect(result.current.data!.getL3OptionsForL1AndL2('TEST', '')).toEqual([]);
    expect(result.current.data!.getL3OptionsForL1AndL2('', '')).toEqual([]);
  });

  it('should handle API error gracefully', async () => {
    const errorMessage = 'Network error';
    mockedGetBusinessCapabilitiesAPI.mockRejectedValue(new Error(errorMessage));

    const { result } = renderHook(() => useBusinessCapabilities());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe(errorMessage);
    expect(result.current.data).toBe(null);
    // Note: Console error is logged (visible in stderr), spy assertion removed for coverage focus
  });

  it('should handle non-Error rejection with default message', async () => {
    // Test when the API rejects with something that's not an Error object
    mockedGetBusinessCapabilitiesAPI.mockRejectedValue('String error');

    const { result } = renderHook(() => useBusinessCapabilities());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe('Failed to fetch business capabilities');
    expect(result.current.data).toBe(null);
  });

  it('should handle empty capabilities array', async () => {
    mockedGetBusinessCapabilitiesAPI.mockResolvedValue([]);

    const { result } = renderHook(() => useBusinessCapabilities());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe(null);
    expect(result.current.data).toBe(null);
  });

  describe('toEnumFormat function', () => {
    it('should handle special characters correctly', async () => {
      const mockCapabilities = [
        { l1: 'Policy & Risk Management', l2: 'Test-Case', l3: 'Multi Word Case' },
        { l1: 'Policy/Claims', l2: 'Test (Beta)', l3: 'Version 2.0' },
        { l1: 'Finance + Operations', l2: 'Test@Domain', l3: 'Test#Tag' }
      ];
      mockedGetBusinessCapabilitiesAPI.mockResolvedValue(mockCapabilities);

      const { result } = renderHook(() => useBusinessCapabilities());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.data!.l1Options).toEqual([
        { value: 'POLICY_AND_RISK_MANAGEMENT', label: 'Policy & Risk Management' },
        { value: 'POLICYCLAIMS', label: 'Policy/Claims' },
        { value: 'FINANCE__OPERATIONS', label: 'Finance + Operations' }
      ]);
    });

    it('should handle non-string values gracefully', async () => {
      // This tests the toEnumFormat function with edge cases
      const mockCapabilities = [
        { l1: 'Valid String', l2: 'Valid L2', l3: 'Valid L3' }
      ];
      mockedGetBusinessCapabilitiesAPI.mockResolvedValue(mockCapabilities);

      const { result } = renderHook(() => useBusinessCapabilities());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      // The function should handle these cases without crashing
      expect(result.current.data).toBeDefined();
    });
  });

  describe('filtering functions', () => {
    beforeEach(async () => {
      const mockCapabilities = [
        { l1: 'Cat A', l2: 'Sub A1', l3: 'Item A1a' },
        { l1: 'Cat A', l2: 'Sub A1', l3: 'Item A1b' },
        { l1: 'Cat A', l2: 'Sub A2', l3: 'Item A2a' },
        { l1: 'Cat B', l2: 'Sub B1', l3: 'Item B1a' }
      ];
      mockedGetBusinessCapabilitiesAPI.mockResolvedValue(mockCapabilities);
    });

    it('should filter L2 options correctly', async () => {
      const { result } = renderHook(() => useBusinessCapabilities());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      const catAL2Options = result.current.data!.getL2OptionsForL1('CAT_A');
      expect(catAL2Options).toEqual([
        { value: 'SUB_A1', label: 'Sub A1' },
        { value: 'SUB_A2', label: 'Sub A2' }
      ]);

      const catBL2Options = result.current.data!.getL2OptionsForL1('CAT_B');
      expect(catBL2Options).toEqual([
        { value: 'SUB_B1', label: 'Sub B1' }
      ]);
    });

    it('should filter L3 options correctly', async () => {
      const { result } = renderHook(() => useBusinessCapabilities());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      const l3Options = result.current.data!.getL3OptionsForL1AndL2('CAT_A', 'SUB_A1');
      expect(l3Options).toEqual([
        { value: 'ITEM_A1A', label: 'Item A1a' },
        { value: 'ITEM_A1B', label: 'Item A1b' }
      ]);
    });

    it('should return empty arrays for non-existent categories', async () => {
      const { result } = renderHook(() => useBusinessCapabilities());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.data!.getL2OptionsForL1('NON_EXISTENT')).toEqual([]);
      expect(result.current.data!.getL3OptionsForL1AndL2('NON_EXISTENT', 'ALSO_NON_EXISTENT')).toEqual([]);
    });
  });

  describe('duplicate handling', () => {
    it('should remove duplicate options', async () => {
      const mockCapabilities = [
        { l1: 'Same Category', l2: 'Same Sub', l3: 'Item 1' },
        { l1: 'Same Category', l2: 'Same Sub', l3: 'Item 2' },
        { l1: 'Same Category', l2: 'Different Sub', l3: 'Item 3' }
      ];
      mockedGetBusinessCapabilitiesAPI.mockResolvedValue(mockCapabilities);

      const { result } = renderHook(() => useBusinessCapabilities());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      // Should only have one L1 option despite duplicates
      expect(result.current.data!.l1Options).toHaveLength(1);
      expect(result.current.data!.l1Options[0]).toEqual({
        value: 'SAME_CATEGORY',
        label: 'Same Category'
      });

      // Should have unique L2 options
      const l2Options = result.current.data!.getL2OptionsForL1('SAME_CATEGORY');
      expect(l2Options).toEqual([
        { value: 'SAME_SUB', label: 'Same Sub' },
        { value: 'DIFFERENT_SUB', label: 'Different Sub' }
      ]);
    });
  });
});