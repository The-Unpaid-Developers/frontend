import { useState, useEffect, useMemo } from 'react';
import { getTechComponentsAPI } from '../services/lookupApi';
import type { TechComponent } from '../services/lookupApi';

export interface Option {
  value: string;
  label: string;
}

interface ProcessedTechComponents {
  productNameOptions: Option[];
  getVersionOptionsForProduct: (productName: string) => Option[];
}

export const useTechComponents = (): {
  data: ProcessedTechComponents | null;
  loading: boolean;
  error: string | null;
} => {
  const [techComponents, setTechComponents] = useState<TechComponent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTechComponents = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getTechComponentsAPI();
        setTechComponents(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch tech components');
      } finally {
        setLoading(false);
      }
    };

    fetchTechComponents();
  }, []);

  const processedData = useMemo((): ProcessedTechComponents | null => {
    if (techComponents.length === 0) return null;

    // Get unique product names
    const uniqueProductNames = Array.from(
      new Set(techComponents.map(component => component.productName))
    ).sort();

    // Create product name options
    const productNameOptions: Option[] = uniqueProductNames.map(productName => ({
      value: productName,
      label: productName,
    }));

    // Function to get version options for a specific product
    const getVersionOptionsForProduct = (productName: string): Option[] => {
      if (!productName) return [];
      
      const versionsForProduct = techComponents
        .filter(component => component.productName === productName)
        .map(component => component.productVersion)
        .sort((a, b) => {
          // Try to sort versions numerically where possible
          const aNum = parseFloat(a);
          const bNum = parseFloat(b);
          if (!isNaN(aNum) && !isNaN(bNum)) {
            return bNum - aNum; // Descending order (newest first)
          }
          return b.localeCompare(a); // Fallback to string comparison
        });

      return versionsForProduct.map(version => ({
        value: version,
        label: version,
      }));
    };

    return {
      productNameOptions,
      getVersionOptionsForProduct,
    };
  }, [techComponents]);

  return {
    data: processedData,
    loading,
    error,
  };
};