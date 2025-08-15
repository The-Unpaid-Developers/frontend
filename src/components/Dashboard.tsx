import React, { useState, useMemo } from "react";
import { DocumentState } from "../types";
import type { SolutionReview, SystemGroup } from "../types";
import { useSolutionReview } from "../context/SolutionReviewContext";
import { SolutionReviewCard } from "./SolutionReviewCard";
import { SolutionReviewDetail } from "./SolutionReviewDetail";
import { CreateSolutionReviewModal } from "./CreateSolutionReviewModal";
import { SystemCard } from "./SystemCard";
import { SystemDetail } from "./SystemDetail";
import { Button, Input } from "./ui";

export const Dashboard: React.FC = () => {
  const { state, actions } = useSolutionReview();
  const [selectedReview, setSelectedReview] = useState<SolutionReview | null>(
    null
  );
  const [selectedSystem, setSelectedSystem] = useState<SystemGroup | null>(
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
          .includes(searchTerm.toLowerCase()) ||
        review.systemName.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesState =
        stateFilter === "ALL" || review.documentState === stateFilter;

      return matchesSearch && matchesState;
    });
  }, [state.reviews, searchTerm, stateFilter]);

  const filteredSystems = useMemo(() => {
    return state.systems.filter((system) => {
      const matchesSearch =
        !searchTerm ||
        system.systemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        system.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        system.category.toLowerCase().includes(searchTerm.toLowerCase());

      return matchesSearch;
    });
  }, [state.systems, searchTerm]);

  const stateCounts = useMemo(() => {
    const dataSource =
      state.viewMode === "systems"
        ? state.systems.flatMap((system) => system.reviews)
        : state.reviews;

    return dataSource.reduce((acc, review) => {
      acc[review.documentState] = (acc[review.documentState] || 0) + 1;
      return acc;
    }, {} as Record<DocumentState, number>);
  }, [state.reviews, state.systems, state.viewMode]);

  if (selectedReview) {
    return (
      <SolutionReviewDetail
        review={selectedReview}
        onClose={() => setSelectedReview(null)}
      />
    );
  }

  if (selectedSystem) {
    return (
      <SystemDetail
        system={selectedSystem}
        onClose={() => setSelectedSystem(null)}
        onViewReview={setSelectedReview}
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
              <div className="flex items-center space-x-4 mb-2">
                <h1 className="text-2xl font-bold text-gray-900">
                  Solution Review Dashboard
                </h1>
                <div className="flex bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => actions.setViewMode("systems")}
                    className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                      state.viewMode === "systems"
                        ? "bg-white text-gray-900 shadow-sm"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    Systems View
                  </button>
                  <button
                    onClick={() => actions.setViewMode("reviews")}
                    className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                      state.viewMode === "reviews"
                        ? "bg-white text-gray-900 shadow-sm"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    Reviews View
                  </button>
                </div>
              </div>
              <p className="text-gray-600">
                {state.viewMode === "systems"
                  ? "Manage systems and their solution review versions"
                  : "Manage individual solution architecture reviews"}
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
              {state.viewMode === "systems"
                ? state.systems.length
                : state.reviews.length}
            </div>
            <div className="text-sm text-gray-600">
              {state.viewMode === "systems" ? "Total Systems" : "Total Reviews"}
            </div>
          </div>
          {Object.values(DocumentState).map((docState) => (
            <div
              key={docState}
              className="bg-white rounded-lg p-4 shadow-sm border border-gray-200"
            >
              <div className="text-2xl font-bold text-gray-900">
                {stateCounts[docState] || 0}
              </div>
              <div className="text-sm text-gray-600">{docState}</div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder={
                  state.viewMode === "systems"
                    ? "Search systems by name, description, or category..."
                    : "Search reviews by title, description, category, or system..."
                }
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
                All (
                {state.viewMode === "systems"
                  ? state.systems.length
                  : state.reviews.length}
                )
              </button>
              {state.viewMode === "reviews" &&
                Object.values(DocumentState).map((docState) => (
                  <button
                    key={docState}
                    onClick={() => setStateFilter(docState)}
                    className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                      stateFilter === docState
                        ? "bg-primary-100 text-primary-700 border border-primary-300"
                        : "bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200"
                    }`}
                  >
                    {docState} ({stateCounts[docState] || 0})
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

        {/* Content Grid */}
        {!state.loading && !state.error && (
          <>
            {state.viewMode === "systems" ? (
              // Systems View
              filteredSystems.length === 0 ? (
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
                      d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                    />
                  </svg>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No systems found
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {searchTerm
                      ? "Try adjusting your search criteria."
                      : "Get started by creating your first solution review."}
                  </p>
                  {!searchTerm && (
                    <Button onClick={() => setIsCreateModalOpen(true)}>
                      Create Your First Solution Review
                    </Button>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredSystems.map((system) => (
                    <SystemCard
                      key={system.systemId}
                      system={system}
                      onViewSystem={setSelectedSystem}
                    />
                  ))}
                </div>
              )
            ) : // Reviews View
            filteredReviews.length === 0 ? (
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
