// hooks/useUpdateSolutionReview.ts
import { useState } from "react";
import {
    addConcernsToSRAPI,
    getSRsByStateAPI,
} from "../services/solutionReviewApi";
import type { SolutionReview, UpdateSolutionReviewData } from "../types/solutionReview";

interface PageMeta {
  page: number;
  size: number;
  totalPages: number;
  totalElements: number;
}

export const useAdminPanel = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [solutionReviews, setSolutionReviews] = useState<SolutionReview[]>([]);
  const [pageMeta, setPageMeta] = useState<PageMeta>({
    page: 0,
    size: 10,
    totalPages: 0,
    totalElements: 0,
  });

  // Load all solution reviews
  const loadSubmittedSolutionReviews = async (page: number, size: number) => {
    setIsLoading(true);
    setError(null); // Clear any previous errors
    try {
      const responseData = await getSRsByStateAPI('SUBMITTED', page, size);
      if (responseData && Array.isArray(responseData.content) && 
          typeof responseData.number !== 'undefined') {
        // Paged response with pagination metadata
        setSolutionReviews(responseData.content);
        setPageMeta({
          page: responseData.number ?? page,
          size: responseData.size ?? size,
          totalPages: responseData.totalPages ?? 0,
          totalElements: responseData.totalElements ?? responseData.content.length,
        });
      } else if (responseData?.content) {
        // fallback (non-paged list)
        setSolutionReviews(responseData.content ?? []);
        setPageMeta({
          page: 0,
          size: responseData.content.length,
          totalPages: 1,
          totalElements: responseData.content.length,
        });
      } else {
        // Handle undefined or invalid response
        setSolutionReviews([]);
        setPageMeta({
          page: 0,
          size: 0,
          totalPages: 1,
          totalElements: 0,
        });
      }
    } 
    catch (error) {
      setError(error.message);
      console.error("Error loading review data:", error);
      throw error;
    } 
    finally {
      console.log("finally", solutionReviews);
      setIsLoading(false);
    }
  };

  const addConcernsToSR = async (reviewId: string, concerns: any[], currentSolutionOverview: any) => {
      console.log('in addConcernsToSR', reviewId, concerns, currentSolutionOverview);
      
      // Ensure we have a solution overview to work with
      if (!currentSolutionOverview) {
        throw new Error('Solution overview is required to add concerns');
      }
      
      // Create updated solution overview with concerns
      const updatedSolutionOverview = {
        ...currentSolutionOverview,
        concerns: concerns
      };
      
      const payload: Partial<UpdateSolutionReviewData> = {
        id: reviewId,
        solutionOverview: updatedSolutionOverview,
      };
  
      return await addConcernsToSRAPI(payload as any);
    };

  return {
    solutionReviews,
    loadSubmittedSolutionReviews,
    addConcernsToSR,
    pageMeta,
    isLoading,
    error,
  };
};
