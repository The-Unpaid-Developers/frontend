import { useState, useEffect, useMemo } from 'react';
import { getBusinessCapabilitiesAPI } from '../services/dropdownApi';
import type { BusinessCapability } from '../services/dropdownApi';

export interface Option {
  value: string;
  label: string;
}

interface ProcessedCapabilities {
  l1Options: Option[];
  l2Options: Option[];
  l3Options: Option[];
  getL2OptionsForL1: (l1: string) => Option[];
  getL3OptionsForL1AndL2: (l1: string, l2: string) => Option[];
}

export const useBusinessCapabilities = (): {
  data: ProcessedCapabilities | null;
  loading: boolean;
  error: string | null;
} => {
  const [capabilities, setCapabilities] = useState<BusinessCapability[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCapabilities = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getBusinessCapabilitiesAPI();
        setCapabilities(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch business capabilities');
      } finally {
        setLoading(false);
      }
    };

    fetchCapabilities();
  }, []);

  const processedData = useMemo((): ProcessedCapabilities | null => {
    if (capabilities.length === 0) return null;

    // Helper function to convert string to enum-like format
    const toEnumFormat = (str: string): string => {
      return str
        .toUpperCase()
        .replace(/\s+/g, '_')
        .replace(/&/g, 'AND')
        .replace(/[^A-Z0-9_]/g, ''); // Remove any other special characters
    };

    // Helper function to convert enum back to display label
    const toDisplayLabel = (str: string): string => {
      return str
        .toLowerCase()
        .replace(/_/g, ' ')
        .replace(/and/g, '&')
        .replace(/\b\w/g, (c) => c.toUpperCase());
    };

    // Get unique L1 capabilities
    const uniqueL1 = Array.from(new Set(capabilities.map(cap => cap.l1)));
    const l1Options: Option[] = uniqueL1.map(l1 => ({
      value: toEnumFormat(l1),
      label: l1
    }));

    // Get unique L2 capabilities
    const uniqueL2 = Array.from(new Set(capabilities.map(cap => cap.l2)));
    const l2Options: Option[] = uniqueL2.map(l2 => ({
      value: toEnumFormat(l2),
      label: l2
    }));

    // Get unique L3 capabilities
    const uniqueL3 = Array.from(new Set(capabilities.map(cap => cap.l3)));
    const l3Options: Option[] = uniqueL3.map(l3 => ({
      value: toEnumFormat(l3),
      label: l3
    }));

    // Function to get L2 options for a specific L1
    const getL2OptionsForL1 = (l1Value: string): Option[] => {
      // Convert enum value back to display format for comparison
      const l1Display = toDisplayLabel(l1Value);
      
      const filteredL2 = capabilities
        .filter(cap => cap.l1 === l1Display)
        .map(cap => cap.l2);
      
      const uniqueFilteredL2 = Array.from(new Set(filteredL2));
      
      return uniqueFilteredL2.map(l2 => ({
        value: toEnumFormat(l2),
        label: l2
      }));
    };

    // Function to get L3 options for specific L1 and L2
    const getL3OptionsForL1AndL2 = (l1Value: string, l2Value: string): Option[] => {
      // Convert enum values back to display format for comparison
      const l1Display = toDisplayLabel(l1Value);
      const l2Display = toDisplayLabel(l2Value);
      
      const filteredL3 = capabilities
        .filter(cap => cap.l1 === l1Display && cap.l2 === l2Display)
        .map(cap => cap.l3);
      
      const uniqueFilteredL3 = Array.from(new Set(filteredL3));
      
      return uniqueFilteredL3.map(l3 => ({
        value: toEnumFormat(l3),
        label: l3
      }));
    };

    return {
      l1Options,
      l2Options,
      l3Options,
      getL2OptionsForL1,
      getL3OptionsForL1AndL2
    };
  }, [capabilities]);

  return {
    data: processedData,
    loading,
    error
  };
};