// hooks/useUpdateSolutionReview.ts
import { useState } from "react";
import { 
  saveSolutionReviewDraft,
  // getSolutionReviewById
} from "../services/solutionReviewApi";
import type { 
  SolutionReview
} from "../types/solutionReview";
import { mockApiService } from "../services/mockApiUpdated";

export const useViewSolutionReview = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [solutionReviews, setSolutionReviews] = useState<SolutionReview[]>([]);

  // Load existing review data
  const loadSystemSolutionReviews = async (systemCode:string) => {
    setIsLoading(true);
    try {
      // TODO: Replace with actual API call when backend is ready
      // const reviewData = await getSolutionReviewById(reviewId);
      
      // For now, use mock data
      const responseData = await mockApiService.getSystemSolutionReviews(systemCode); // Import or define mock data
      console.log('review data ', responseData);
      if (responseData) {
        setSolutionReviews(responseData);
      }
    } catch (error) {
      console.error("Error loading review data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    solutionReviews,
    setSolutionReviews,
    loadSystemSolutionReviews,
    isLoading
  };
};