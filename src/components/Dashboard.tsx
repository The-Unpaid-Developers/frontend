import React, { useState, useMemo } from "react";
import { DocumentState } from "../types";
import type { SolutionReview } from "../types";
import { useSolutionReview } from "../context/SolutionReviewContext";
import { SolutionReviewCard } from "./SolutionReviewCard";
import { SolutionReviewDetail } from "./SolutionReviewDetail";
import { CreateSolutionReviewModal } from "./CreateSolutionReviewModal";
import { Button, Input } from "./ui";

export const Dashboard: React.FC = () => {
  const { state } = useSolutionReview();
  const [selectedReview, setSelectedReview] = useState<SolutionReview | null>(
    null
  );
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [stateFilter, setStateFilter] = useState<DocumentState | "ALL">("ALL");

  const filteredReviews = useMemo(() => {
    return state.reviews.filter((review) => {
      const matchesSearch =
        !searchTerm ||
        review.solutionOverview?.title
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        review.solutionOverview?.description
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        review.solutionOverview?.category
          .toLowerCase()
          .includes(searchTerm.toLowerCase());

      const matchesState =
        stateFilter === "ALL" || review.documentState === stateFilter;

      return matchesSearch && matchesState;
    });
  }, [state.reviews, searchTerm, stateFilter]);

  const stateCounts = useMemo(() => {
    return state.reviews.reduce((acc, review) => {
      acc[review.documentState] = (acc[review.documentState] || 0) + 1;
      return acc;
    }, {} as Record<DocumentState, number>);
  }, [state.reviews]);

  if (selectedReview) {
    return (
      <SolutionReviewDetail
        review={selectedReview}
        onClose={() => setSelectedReview(null)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Solution Review Dashboard
              </h1>
              <p className="text-gray-600 mt-1">
                Manage your enterprise solution architecture reviews
              </p>
            </div>
            <Button onClick={() => setIsCreateModalOpen(true)}>
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              New Solution Review
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
            <div className="text-2xl font-bold text-gray-900">
              {state.reviews.length}
            </div>
            <div className="text-sm text-gray-600">Total Reviews</div>
          </div>
          {Object.values(DocumentState).map((state) => (
            <div
              key={state}
              className="bg-white rounded-lg p-4 shadow-sm border border-gray-200"
            >
              <div className="text-2xl font-bold text-gray-900">
                {stateCounts[state] || 0}
              </div>
              <div className="text-sm text-gray-600">{state}</div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search by title, description, or category..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setStateFilter("ALL")}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  stateFilter === "ALL"
                    ? "bg-primary-100 text-primary-700 border border-primary-300"
                    : "bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200"
                }`}
              >
                All ({state.reviews.length})
              </button>
              {Object.values(DocumentState).map((state) => (
                <button
                  key={state}
                  onClick={() => setStateFilter(state)}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                    stateFilter === state
                      ? "bg-primary-100 text-primary-700 border border-primary-300"
                      : "bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200"
                  }`}
                >
                  {state} ({stateCounts[state] || 0})
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Loading State */}
        {state.loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            <span className="ml-3 text-gray-600">
              Loading solution reviews...
            </span>
          </div>
        )}

        {/* Error State */}
        {state.error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex">
              <svg
                className="w-5 h-5 text-red-400 mr-2 mt-0.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <div>
                <h3 className="text-sm font-medium text-red-800">Error</h3>
                <p className="text-sm text-red-700 mt-1">{state.error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Reviews Grid */}
        {!state.loading && !state.error && (
          <>
            {filteredReviews.length === 0 ? (
              <div className="text-center py-12">
                <svg
                  className="w-12 h-12 text-gray-400 mx-auto mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No solution reviews found
                </h3>
                <p className="text-gray-600 mb-4">
                  {searchTerm || stateFilter !== "ALL"
                    ? "Try adjusting your search or filter criteria."
                    : "Get started by creating your first solution review."}
                </p>
                {!searchTerm && stateFilter === "ALL" && (
                  <Button onClick={() => setIsCreateModalOpen(true)}>
                    Create Your First Solution Review
                  </Button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredReviews.map((review) => (
                  <SolutionReviewCard
                    key={review.id}
                    review={review}
                    onView={setSelectedReview}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* Create Modal */}
      <CreateSolutionReviewModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </div>
  );
};
