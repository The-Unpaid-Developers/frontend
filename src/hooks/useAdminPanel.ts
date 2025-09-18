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
    try {
      const responseData = await getSRsByStateAPI('SUBMITTED', page, size);
      if (responseData && Array.isArray(responseData.content)) {
        setSolutionReviews(responseData.content);
        setPageMeta({
          page: responseData.number ?? page,
          size: responseData.size ?? size,
          totalPages: responseData.totalPages ?? 0,
          totalElements:
            responseData.totalElements ?? responseData.content.length,
        });
      } else {
        // fallback (non-paged list)
        setSolutionReviews(responseData.content ?? []);
        setPageMeta({
          page: 0,
          size: responseData.content.length,
          totalPages: 1,
          totalElements: responseData.content.length,
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

  const addConcernsToSR = async (reviewId: string, data: any) => {
      // For draft saving (partial updates)
      console.log('in addConcernsToSR', reviewId, data);
      const payload: Partial<UpdateSolutionReviewData> = {
        id: reviewId,
        documentState: "SUBMITTED",
        solutionOverview: data.solutionOverview,
        businessCapabilities: null,
        dataAssets: null,
        enterpriseTools: [],
        integrationFlows: null,
        systemComponents: null,
        technologyComponents: null,
        processCompliances: null,
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
