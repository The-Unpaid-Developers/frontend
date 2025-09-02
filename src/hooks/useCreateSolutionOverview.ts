import { useState } from 'react';
import { createSolutionReview } from '../services/solutionReviewApi';
import type { SolutionOverview } from '../types/solutionReview';

export const useCreateSolutionOverview = () => {
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const create = async (data: SolutionOverview, systemCode: string) => {
    setIsCreating(true);
    setError(null);
    try {
      // const created = await createSolutionReview(data, systemCode);
      // return created;

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mock successful response - return a fake solution review with an ID
      const mockResponse = {
        id: `review_${Date.now()}`, // Generate a unique ID
        systemCode: systemCode,
        solutionOverview: data,
        documentState: 'DRAFT',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        // Add other fields as needed for your SolutionReview type
      };

      console.log('Mock create response:', mockResponse);
      return mockResponse;
    } catch (e:any) {
      setError(e.message || 'Error creating');
      throw e;
    } finally {
      setIsCreating(false);
    }
  };

  return { create, isCreating, error };
};