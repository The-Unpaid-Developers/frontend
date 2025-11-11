import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { DocumentState } from "../types/solutionReview";
import type { SolutionReview } from "../types/solutionReview";
import { SolutionReviewCard } from "./SolutionReviews/SolutionReviewDetail";
import { Button, Input } from "./ui";
import { useViewSolutionReview } from "../hooks/useViewSolutionReview";
import { useToast } from "../context/ToastContext";

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<"systems" | "reviews">("systems");
  const [searchTerm, setSearchTerm] = useState("");
  const [stateFilter] = useState<DocumentState | "ALL">("ALL");
  const {
    isLoading,
    solutionReviews,
    loadSolutionReviews,
    pageMeta,
    setPageMeta,
    loadSystems,
    searchSR
  } = useViewSolutionReview();

  const [pageSize, setPageSize] = useState<number>(10);
  const [isSearchMode, setIsSearchMode] = useState(false);
  const [allSearchResults, setAllSearchResults] = useState<SolutionReview[]>([]);
  const [searchPage, setSearchPage] = useState(0);

  const currentPage = isSearchMode ? searchPage : pageMeta.page;
  const totalPages = isSearchMode
    ? Math.ceil(allSearchResults.length / pageSize)
    : pageMeta.totalPages;
  const totalElements = isSearchMode ? allSearchResults.length : pageMeta.totalElements;

  const { showError } = useToast();

  useEffect(() => {
    if (!isSearchMode) {
      const run = async () => {
        try {
          if (viewMode === "systems") {
            await loadSystems(pageMeta.page, pageSize);
          } else {
            await loadSolutionReviews(pageMeta.page, pageSize);
          }
        } catch (e) {
          console.log('in catch');
          console.error("Error loading review data:", e);
          showError("Failed to load data: " + e.message);
        }
      };
      run();
    }
    // console.log(filteredReviews);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageSize, pageMeta.page, viewMode, isSearchMode]);

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      showError("Please enter a search term");
      return;
    }

    try {
      await searchSR({ searchQuery: searchTerm });
      setIsSearchMode(true);
      setSearchPage(0);
    } catch (e) {
      console.error("Error searching:", e);
      showError("Failed to search: " + e.message);
    }
  };

  // Update search results when solution reviews change after search
  useEffect(() => {
    if (isSearchMode && solutionReviews.length > 0) {
      setAllSearchResults(solutionReviews);
    }
  }, [isSearchMode, solutionReviews]);

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const clearSearch = async () => {
    setSearchTerm("");
    setIsSearchMode(false);
    setSearchPage(0);
    setAllSearchResults([]);
    // Reload the original data
    try {
      if (viewMode === "systems") {
        await loadSystems(0, pageSize);
      } else {
        await loadSolutionReviews(0, pageSize);
      }
    } catch (e) {
      console.error("Error reloading data:", e);
      showError("Failed to reload data: " + e.message);
    }
  };

  const goToPage = async (p: number) => {
    if (p < 0 || (totalPages > 0 && p >= totalPages)) return;

    if (isSearchMode) {
      setSearchPage(p);
    } else {
      if (viewMode === "systems") {
        await loadSystems(p, pageSize);
      } else {
        await loadSolutionReviews(p, pageSize);
      }
    }
  };

  // Compute displayed reviews based on search mode
  const displayedReviews = useMemo(() => {
    if (isSearchMode && allSearchResults.length > 0) {
      const start = searchPage * pageSize;
      const end = start + pageSize;
      return allSearchResults.slice(start, end);
    }
    return solutionReviews;
  }, [isSearchMode, allSearchResults, searchPage, pageSize, solutionReviews]);

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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Bar */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 flex gap-2">
              <Input
                placeholder="Search using natural language (e.g., 'show me all draft reviews for banking systems')..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1"
              />
              <Button
                onClick={handleSearch}
                disabled={isLoading || !searchTerm.trim()}
                variant="primary"
                className="whitespace-nowrap"
              >
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
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                Search
              </Button>
              {isSearchMode && (
                <Button
                  onClick={clearSearch}
                  variant="secondary"
                  className="whitespace-nowrap"
                >
                  Clear
                </Button>
              )}
            </div>
          </div>
          {isSearchMode && (
            <div className="mt-3 flex items-center text-sm text-primary-600">
              <svg
                className="w-4 h-4 mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Showing search results for "{searchTerm}"
            </div>
          )}
        </div>

        {/* Pagination and View Switcher */}

        {!isLoading && totalElements > 0 && (
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            {!isSearchMode && (
              <div className="flex bg-gray-200 rounded-lg p-1">
                <button
                  onClick={() => {
                    setViewMode("systems");
                    if (isSearchMode) clearSearch();
                  }}
                  className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${viewMode === "systems"
                      ? "bg-white text-gray-900 shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                    }`}
                >
                  Systems View
                </button>
                <button
                  onClick={() => {
                    setViewMode("reviews");
                    if (isSearchMode) clearSearch();
                  }}
                  className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${viewMode === "reviews"
                      ? "bg-white text-gray-900 shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                    }`}
                >
                  Reviews View
                </button>
              </div>
            )}
            <div className="text-sm text-gray-600">
              Showing{" "}
              <span className="font-medium">
                {totalElements === 0 ? 0 : currentPage * pageSize + 1}-
                {Math.min((currentPage + 1) * pageSize, totalElements)}
              </span>{" "}
              of <span className="font-medium">{totalElements}</span>{" "}
              {isSearchMode ? "results" : "reviews"}
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
            {displayedReviews.length === 0 ? (
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
                  {isSearchMode ? "No results found" : "No solution reviews found"}
                </h3>
                <p className="text-gray-600 mb-4">
                  {isSearchMode
                    ? "Try adjusting your search terms or clear the search to see all reviews."
                    : searchTerm || stateFilter !== "ALL"
                    ? "Try adjusting your search or filter criteria."
                    : "Get started by creating your first solution review."}
                </p>
                {isSearchMode ? (
                  <Button variant="secondary" onClick={clearSearch}>
                    Clear Search
                  </Button>
                ) : !searchTerm && stateFilter === "ALL" ? (
                  <Button onClick={() => navigate("/create-solution-review")}>
                    Create Your First Solution Review
                  </Button>
                ) : null}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {displayedReviews.map((review) => (
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