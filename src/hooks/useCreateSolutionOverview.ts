import { useState } from "react";
import { createSolutionReview, createSRFromExistingAPI } from "../services/solutionReviewApi";
import type { SolutionOverview } from "../types/solutionReview";

export const useCreateSolutionOverview = () => {
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createNewSR = async (data: SolutionOverview, systemCode: string) => {
    setIsCreating(true);
    setError(null);
    try {
      const created = await createSolutionReview(data, systemCode);
      return created;
    } catch (e: any) {
      setError(e.message || "Error creating");
      throw e;
    } finally {
      setIsCreating(false);
    }
  };

  const createSRFromExisting = async (systemCode: string) => {
    // call API to create new draft from existing SR
    setIsCreating(true);
    setError(null);
    try {
      const created = await createSRFromExistingAPI(systemCode);
      return created;
    } catch (e: any) {
      setError(e.message || "Error creating");
      throw e;
    } finally {
      setIsCreating(false);
    }
  }

  return { 
    createNewSR, 
    createSRFromExisting,
    isCreating, 
    error };
};
