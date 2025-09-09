import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { DocumentState } from "../types";
import type { SolutionReview } from "../types";
import {
  SolutionReviewCard,
  SolutionReviewDetail,
} from "./SolutionReviewDetail";
import { SystemCard, SystemDetail } from "./SystemDetail";
import { Button, Input } from "./ui";
import { useViewSolutionReview } from "../hooks/useViewSolutionReview";

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  // const [reviews, setReviews] = useState<SolutionReview[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"systems" | "reviews">("systems");
  const [selectedReview, setSelectedReview] = useState<SolutionReview | null>(
    null
  );
  const [selectedSystemReviews, setSelectedSystemReviews] = useState<
    SolutionReview[] | null
  >(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [stateFilter, setStateFilter] = useState<DocumentState | "ALL">("ALL");
  const { isLoading, solutionReviews, loadSolutionReviews, pageMeta } =
    useViewSolutionReview();

  const [pageSize, setPageSize] = useState<number>(10);

  // NEW: track current page locally (sync with hook meta)
  const currentPage = pageMeta.page;
  const totalPages = pageMeta.totalPages;
  const totalElements = pageMeta.totalElements;

  useEffect(() => {
    console.log("in eff");
    const fetchData = async () => {
      try {
        await loadSolutionReviews(currentPage, pageSize);
      } catch (error) {
        console.error("Error loading review data:", error);
      }
    };

    fetchData();

    // if (solutionReviews) {
    //   setReviews(solutionReviews);
    // }
  }, [pageSize, currentPage]);

  const goToPage = (p: number) => {
    console.log("Going to page:", p);
    if (p < 0 || (totalPages > 0 && p >= totalPages)) return;
    loadSolutionReviews(p, pageSize);
  };

  // Filtered reviews (flat list)
  const filteredReviews = useMemo(() => {
    return solutionReviews.filter((review) => {
      const matchesSearch =
        !searchTerm ||
        review.solutionOverview?.title
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        review.solutionOverview?.description
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        review.solutionOverview?.category
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        review.systemName?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesState =
        stateFilter === "ALL" || review.documentState === stateFilter;

      return matchesSearch && matchesState;
    });
  }, [solutionReviews, searchTerm, stateFilter]);

  // Group reviews by systemCode
  const systems = useMemo(() => {
    const map = new Map<string, SolutionReview[]>();
    solutionReviews.forEach((review) => {
      if (!map.has(review.systemCode)) {
        map.set(review.systemCode, []);
      }
      map.get(review.systemCode)!.push(review);
    });
    // Sort each system's reviews by createdAt descending (latest first)
    map.forEach((arr) =>
      arr.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
    );
    return Array.from(map.values());
  }, [solutionReviews]);

  // Filtered systems (list of review arrays, each array is all reviews for a system)
  const filteredSystems = useMemo(() => {
    return systems.filter((solutionReviews) => {
      const latest = solutionReviews[0];
      const matchesSearch =
        !searchTerm ||
        latest.systemName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        latest.solutionOverview?.description
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        latest.solutionOverview?.category
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase());
      return matchesSearch;
    });
  }, [systems, searchTerm]);

  const stateCounts = useMemo(() => {
    const dataSource =
      viewMode === "systems" ? systems.flatMap((arr) => arr) : solutionReviews;

    return dataSource.reduce((acc, review) => {
      acc[review.documentState] = (acc[review.documentState] || 0) + 1;
      return acc;
    }, {} as Record<DocumentState, number>);
  }, [solutionReviews, systems, viewMode]);

  if (selectedReview) {
    return (
      <SolutionReviewDetail
        review={selectedReview}
        onClose={() => setSelectedReview(null)}
      />
    );
  }

  if (selectedSystemReviews) {
    // Use the latest review for system details
    const latestReview = selectedSystemReviews[0];
    return (
      <SystemDetail
        system={latestReview}
        allReviews={selectedSystemReviews}
        onClose={() => setSelectedSystemReviews(null)}
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
              </div>
              <p className="text-gray-600">
                {viewMode === "systems"
                  ? "Manage systems and their solution review versions"
                  : "Manage individual solution architecture reviews"}
              </p>
            </div>
            <Button onClick={() => navigate("/create-solution-review")}>
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

      {/* <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats \*\/\}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
            <div className="text-2xl font-bold text-gray-900">
              {viewMode === "systems"
                ? systems.length
                : solutionReviews.length}
            </div>
            <div className="text-sm text-gray-600">
              {viewMode === "systems" ? "Total Systems" : "Total Reviews"}
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
        </div> */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        {/* ...existing stats but replace total reviews number... */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
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
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder={
                  viewMode === "systems"
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
                {viewMode === "systems"
                  ? systems.length
                  : solutionReviews.length}
                )
              </button>
              {viewMode === "reviews" &&
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

        {/* Pagination Controls */}
        {!isLoading && !error && totalElements > 0 && (
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
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
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                }}
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

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            <span className="ml-3 text-gray-600">
              Loading solution reviews...
            </span>
          </div>
        )}

        {/* Error State */}
        {error && (
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
                <p className="text-sm text-red-700 mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Content Grid */}
        {!isLoading && !error && (
          <>
            {/* {viewMode === "systems" ? (
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
                    <Button onClick={() => navigate('/create-solution-review')}>
                      Create Your First Solution Review
                    </Button>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredSystems.map((reviews) => (
                    <SystemCard
                      key={reviews[0].systemCode}
                      system={reviews[0]} // Pass latest review as system
                      allReviews={reviews}
                      onViewSystem={() => setSelectedSystemReviews(reviews)}
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
                  <Button onClick={() => navigate('/create-solution-review')}>
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
    </div>
  );
}; */}
            {/* Systems View commented out */}
            {/*
            {viewMode === "systems" ? (
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
                    <Button onClick={() => navigate('/create-solution-review')}>
                      Create Your First Solution Review
                    </Button>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredSystems.map((reviews) => (
                    <SystemCard
                      key={reviews[0].systemCode}
                      system={reviews[0]} // Pass latest review as system
                      allReviews={reviews}
                      onViewSystem={() => setSelectedSystemReviews(reviews)}
                    />
                  ))}
                </div>
              )
            ) : */}
            {/* Only show Reviews View */}
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
                  <Button onClick={() => navigate("/create-solution-review")}>
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
    </div>
  );
};
