import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import type { SolutionReview } from "../../types/solutionReview";
import {
  SolutionReviewCard,
  SolutionReviewDetail,
} from "../SolutionReviewDetail";
import { Button, Input } from "../ui";
import { useAdminPanel } from "../../hooks/useAdminPanel";

export const AdminPanel: React.FC = () => {
  const navigate = useNavigate();
  const [selectedReview, setSelectedReview] = useState<SolutionReview | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [pageSize, setPageSize] = useState<number>(10);

  const {
    solutionReviews,
    loadSubmittedSolutionReviews,
    pageMeta,
    isLoading,
    error,
  } = useAdminPanel();

  const currentPage = pageMeta.page;
  const totalPages = pageMeta.totalPages;
  const totalElements = pageMeta.totalElements;

  useEffect(() => {
    loadSubmittedSolutionReviews(0, pageSize);
  }, [pageSize]);

  const goToPage = (p: number) => {
    if (p < 0 || (totalPages > 0 && p >= totalPages)) return;
    loadSubmittedSolutionReviews(p, pageSize);
  };

  // Client-side filtering for search
  const filteredReviews = useMemo(() => {
    return solutionReviews.filter((review) => {
      const matchesSearch =
        !searchTerm ||
        review.solutionOverview?.solutionDetails?.solutionName
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        review.solutionOverview?.solutionDetails?.projectName
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        review.solutionOverview?.businessUnit
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        review.systemCode?.toLowerCase().includes(searchTerm.toLowerCase());

      return matchesSearch;
    });
  }, [solutionReviews, searchTerm]);

  const onViewCard = (r: SolutionReview) => {
    navigate(`/view-solution-review/${encodeURIComponent(r.id)}`);
    };

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
      {/* <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <div className="flex items-center space-x-4 mb-2">
                <h1 className="text-2xl font-bold text-gray-900">
                  Admin Panel - Submitted Reviews
                </h1>
                <div className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-medium">
                  SUBMITTED
                </div>
              </div>
              <p className="text-gray-600">
                Review and manage submitted solution architecture reviews
              </p>
            </div>
          </div>
        </div>
      </div> */}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
            <div className="text-2xl font-bold text-gray-900">
              {totalElements}
            </div>
            <div className="text-sm text-gray-600">Total Submitted Reviews</div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
            <div className="text-2xl font-bold text-orange-600">
              {filteredReviews.length}
            </div>
            <div className="text-sm text-gray-600">Filtered Results</div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
            <div className="text-2xl font-bold text-blue-600">
              {totalPages}
            </div>
            <div className="text-sm text-gray-600">Total Pages</div>
          </div>
        </div> */}

        {/* Filters */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search reviews by solution name, project, business unit, or system code..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span>Filter:</span>
              <div className="bg-orange-100 text-orange-800 px-2 py-1 rounded text-xs font-medium">
                SUBMITTED STATUS ONLY
              </div>
            </div>
          </div>
        </div>

        {/* Pagination */}
        {!isLoading && !error && totalElements > 0 && (
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div className="text-sm text-gray-600">
              Showing{" "}
              <span className="font-medium">
                {totalElements === 0 ? 0 : currentPage * pageSize + 1}-
                {Math.min((currentPage + 1) * pageSize, totalElements)}
              </span>{" "}
              of <span className="font-medium">{totalElements}</span> submitted reviews
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
                  className="px-2 py-1 text-sm border rounded disabled:opacity-40 hover:bg-gray-50"
                >
                  «
                </button>
                <button
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 0}
                  className="px-2 py-1 text-sm border rounded disabled:opacity-40 hover:bg-gray-50"
                >
                  Prev
                </button>
                <span className="px-2 text-sm">
                  Page {currentPage + 1} / {totalPages || 1}
                </span>
                <button
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={totalPages === 0 || currentPage >= totalPages - 1}
                  className="px-2 py-1 text-sm border rounded disabled:opacity-40 hover:bg-gray-50"
                >
                  Next
                </button>
                <button
                  onClick={() => goToPage(totalPages - 1)}
                  disabled={totalPages === 0 || currentPage >= totalPages - 1}
                  className="px-2 py-1 text-sm border rounded disabled:opacity-40 hover:bg-gray-50"
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
              Loading submitted reviews...
            </span>
          </div>
        )}

        {/* Error */}
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

        {/* Content */}
        {!isLoading && !error && (
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
                  No submitted reviews found
                </h3>
                <p className="text-gray-600 mb-4">
                  {searchTerm
                    ? "Try adjusting your search criteria."
                    : "No solution reviews have been submitted yet."}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredReviews.map((review) => (
                  <SolutionReviewCard
                    key={review.id}
                    review={review}
                    onView={onViewCard}
                    viewLabel="Review & Approve"
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

export default AdminPanel;