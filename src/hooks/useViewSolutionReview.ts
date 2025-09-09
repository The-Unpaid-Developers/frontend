// hooks/useUpdateSolutionReview.ts
import { useState } from "react";
import {
  saveSolutionReviewDraft,
  // getSolutionReviewById
} from "../services/solutionReviewApi";
import type { SolutionReview } from "../types/solutionReview";
// import { mockApiService } from "../services/mockApiUpdated";
import {
  getSystemSolutionReviews,
  getSolutionReviewById,
  getAllSolutionReviews,
} from "../services/solutionReviewApi";

interface PageMeta {
  page: number;
  size: number;
  totalPages: number;
  totalElements: number;
}

export const useViewSolutionReview = () => {
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
  const loadSolutionReviews = async (page: number, size: number) => {
    setIsLoading(true);
    try {
      const responseData = await getAllSolutionReviews(page, size);
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
    } catch (error) {
      setError(error.message);
      console.error("Error loading review data:", error);
    } finally {
      console.log("finally", solutionReviews);
      setIsLoading(false);
    }
  };

  // Load existing review data
  const loadSystemSolutionReviews = async (systemCode: string) => {
    setIsLoading(true);
    try {
      // TODO: Replace with actual API call when backend is ready
      // const reviewData = await getSolutionReviewById(reviewId);

      // For now, use mock data
      const responseData = await getSystemSolutionReviews(systemCode); // Import or define mock data
      console.log("review data ", responseData);
      if (responseData) {
        setSolutionReviews(responseData);
      }
    } catch (error) {
      setError(error.message);
      console.error("Error loading review data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadSolutionReviewById = async (reviewId: string) => {
    setIsLoading(true);
    try {
      const responseData = await getSolutionReviewById(reviewId);
      console.log("review data ", responseData);
      if (responseData) {
        setSolutionReviews([responseData]);
      }
    } catch (error) {
      setError(error.message);
      console.error("Error loading review data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    solutionReviews,
    setSolutionReviews,
    loadSystemSolutionReviews,
    loadSolutionReviewById,
    loadSolutionReviews,
    pageMeta,
    isLoading,
    error,
  };
};
