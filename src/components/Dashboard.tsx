import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { DocumentState, DocumentStateFilter } from "../types/solutionReview";
import type { SolutionReview } from "../types/solutionReview";
import {
  SolutionReviewCard,
  SolutionReviewDetail,
} from "./SolutionReviewDetail";
import { Button, Input } from "./ui";
import { useViewSolutionReview } from "../hooks/useViewSolutionReview";
import { useToast } from "../context/ToastContext";

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<"systems" | "reviews">("systems");
  const [searchTerm, setSearchTerm] = useState("");
  const [stateFilter, setStateFilter] = useState<DocumentState | "ALL">("ALL");
  const { isLoading, solutionReviews, loadSolutionReviews, pageMeta, loadSystems } =
    useViewSolutionReview();

  const [pageSize, setPageSize] = useState<number>(10);

  const currentPage = pageMeta.page;
  const totalPages = pageMeta.totalPages;
  const totalElements = pageMeta.totalElements;

  const { showError } = useToast();

  useEffect(() => {
    const run = async () => {
      try {
        if (viewMode === "systems") {
          await loadSystems(currentPage, pageSize);
        } else {
          await loadSolutionReviews(currentPage, pageSize);
        }
      } catch (e) {
        console.log('in catch');
        console.error("Error loading review data:", e);
        showError("Failed to load data: " + e.message);
      }
    };
    run();
    // console.log(filteredReviews);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageSize, currentPage, viewMode]);

  const goToPage = async (p: number) => {
    if (p < 0 || (totalPages > 0 && p >= totalPages)) return;
    if (viewMode === "systems") {
      await loadSystems(p, pageSize);
    } else {
      await loadSolutionReviews(p, pageSize);
    }
  };

  const stateCounts = useMemo(() => {
    return solutionReviews.reduce((acc, review) => {
      acc[review.documentState] = (acc[review.documentState] || 0) + 1;
      return acc;
    }, {} as Record<DocumentState, number>);
  }, [solutionReviews]);

  const onViewCard = (r: SolutionReview) => {
    if (viewMode === "systems") {
      // Navigate to system details page (adjust route if different)
      navigate(`/view-system-detail/${encodeURIComponent(r.systemCode)}`);
    } else {
      navigate(`/view-solution-review/${encodeURIComponent(r.id)}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      {/* <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              {/* <div className="flex items-center space-x-4 mb-2">
                <h1 className="text-2xl font-bold text-gray-900">
                  Solution Review Dashboard
                </h1>
                <div className="flex bg-gray-200 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode("systems")}
                    className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                      viewMode === "systems"
                        ? "bg-white text-gray-900 shadow-sm"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    Systems View
                  </button>
                  <button
                    onClick={() => setViewMode("reviews")}
                    className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                      viewMode === "reviews"
                        ? "bg-white text-gray-900 shadow-sm"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    Reviews View
                  </button>
                </div>
                <p className="text-gray-600">
                {viewMode === "systems"
                  ? "System-level view; click to open system details"
                  : "Individual solution architecture reviews"}
              </p>
              </div> 
              
            </div>
            {/* <Button onClick={() => navigate("/create-solution-review")}>
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
      </div> */}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        {/* <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
            <div className="text-2xl font-bold text-gray-900">
              {totalElements}
            </div>
            <div className="text-sm text-gray-600">Total Reviews</div>
          </div>
          {Object.values(DocumentState).map((ds) => (
            <div
              key={ds}
              className="bg-white rounded-lg p-4 shadow-sm border border-gray-200"
            >
              <div className="text-2xl font-bold text-gray-900">
                {stateCounts[ds] || 0}
              </div>
              <div className="text-sm text-gray-600">{ds}</div>
            </div>
          ))}
        </div> */}

        {/* Filters */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder={
                  viewMode === "systems"
                    ? "Search systems by solution name, project, or business unit..."
                    : "Search reviews by solution name, project, business unit, or system code..."
                }
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            {/* <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setStateFilter("ALL")}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  stateFilter === "ALL"
                    ? "bg-primary-100 text-primary-700 border border-primary-300"
                    : "bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200"
                }`}
              >
                All ({solutionReviews.length})
              </button>
              {Object.values(DocumentStateFilter).map((docState) => (
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
            </div> */}
          </div>
        </div>

        {/* Pagination */}
        
        {!isLoading && totalElements > 0 && (
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div className="flex bg-gray-200 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode("systems")}
                    className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                      viewMode === "systems"
                        ? "bg-white text-gray-900 shadow-sm"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    Systems View
                  </button>
                  <button
                    onClick={() => setViewMode("reviews")}
                    className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                      viewMode === "reviews"
                        ? "bg-white text-gray-900 shadow-sm"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    Reviews View
                  </button>
                </div>
            <div className="text-sm text-gray-600">
              Showing{" "}
              <span className="font-medium">
                {totalElements === 0 ? 0 : currentPage * pageSize + 1}-
                {Math.min((currentPage + 1) * pageSize, totalElements)}
              </span>{" "}
              of <span className="font-medium">{totalElements}</span> reviews
            </div>
            <div className="flex items-center gap-3">
              <select
                className="border rounded-md px-2 py-1 text-sm"
                value={pageSize}
                onChange={(e) => setPageSize(Number(e.target.value))}
              >
                {[5, 10, 20, 50].map((s) => (
                  <option key={s} value={s}>
                    {s} / page
                  </option>
                ))}
              </select>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => goToPage(0)}
                  disabled={currentPage === 0}
                  className="px-2 py-1 text-sm border rounded disabled:opacity-40"
                >
                  «
                </button>
                <button
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 0}
                  className="px-2 py-1 text-sm border rounded disabled:opacity-40"
                >
                  Prev
                </button>
                <span className="px-2 text-sm">
                  Page {currentPage + 1} / {totalPages || 1}
                </span>
                <button
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={totalPages === 0 || currentPage >= totalPages - 1}
                  className="px-2 py-1 text-sm border rounded disabled:opacity-40"
                >
                  Next
                </button>
                <button
                  onClick={() => goToPage(totalPages - 1)}
                  disabled={totalPages === 0 || currentPage >= totalPages - 1}
                  className="px-2 py-1 text-sm border rounded disabled:opacity-40"
                >
                  »
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Loading */}
        {isLoading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            <span className="ml-3 text-gray-600">
              Loading solution reviews...
            </span>
          </div>
        )}

        {/* Content: always SolutionReview cards */}
        {!isLoading && (
          <>
            {solutionReviews.length === 0 ? (
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
                  <Button onClick={() => navigate("/create-solution-review")}>
                    Create Your First Solution Review
                  </Button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {solutionReviews.map((review) => (
                  <SolutionReviewCard
                    key={review.id}
                    review={review}
                    onView={onViewCard}
                    viewLabel={viewMode === "systems" ? "View System" : "View Details"}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};