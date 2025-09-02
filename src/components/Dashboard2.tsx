import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { DocumentState } from "../types";
import { Button, Input } from "./ui";
import { SolutionReviewCard, SolutionReviewDetail } from "./SolutionReviewDetail";
import { SystemCard, SystemDetail } from "./SystemDetail";
import { mockApiService } from "../services/mockApiUpdated";

// Minimal shape alignments (adapt if you already have these in types)
interface ReviewLike {
  id: string;
  systemCode: string;
  systemName: string;
  documentState: DocumentState | string;
  solutionOverview: any;
  // Add any other fields the card / detail components expect
}

interface SystemGroup {
  systemId: string;
  systemName: string;
  description: string;
  category: string;
  reviews: ReviewLike[];
}

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  // Local replacement for context state
  const [reviews, setReviews] = useState<ReviewLike[]>([]);
  const [systems, setSystems] = useState<SystemGroup[]>([]);
  const [viewMode, setViewMode] = useState<"systems" | "reviews">("systems");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Detail selections (reuse existing detail components)
  const [selectedReview, setSelectedReview] = useState<ReviewLike | null>(null);
  const [selectedSystem, setSelectedSystem] = useState<SystemGroup | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [stateFilter, setStateFilter] = useState<DocumentState | "ALL">("ALL");

  // Fetch data once (could add refresh button later)
  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const raw = await mockApiService.getAllSolutionReviews();
        if (cancelled) return;

        // Map raw reviews into shape UI expects
        const mapped: ReviewLike[] = raw.map(r => ({
          ...r,
          systemName: r.solutionOverview?.solutionDetails?.solutionName || r.systemCode,
          // fallback for components referencing solutionOverview.title/description/category
          solutionOverview: {
            ...r.solutionOverview,
            title: r.solutionOverview?.solutionDetails?.solutionName ?? "",
            description: r.solutionOverview?.businessDriver ?? "",
            category: r.solutionOverview?.businessUnit ?? "",
          }
        }));

        setReviews(mapped);

        // Group into systems
        const systemMap = new Map<string, SystemGroup>();
        mapped.forEach(rv => {
          if (!systemMap.has(rv.systemCode)) {
            systemMap.set(rv.systemCode, {
              systemId: rv.systemCode,
              systemName: rv.systemName,
              description: rv.solutionOverview?.description || "",
              category: rv.solutionOverview?.category || "",
              reviews: []
            });
          }
          systemMap.get(rv.systemCode)!.reviews.push(rv);
        });
        setSystems(Array.from(systemMap.values()));
      } catch (e: any) {
        setError(e.message || "Failed to load reviews");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => { cancelled = true; };
  }, []);

  // Filters (updated to use mapped fields)
  const filteredReviews = useMemo(() => {
    return reviews.filter((review) => {
      const lower = searchTerm.toLowerCase();
      const matchesSearch =
        !searchTerm ||
        review.systemName.toLowerCase().includes(lower) ||
        (review.solutionOverview?.title || "").toLowerCase().includes(lower) ||
        (review.solutionOverview?.description || "").toLowerCase().includes(lower) ||
        (review.solutionOverview?.category || "").toLowerCase().includes(lower);

      const matchesState =
        stateFilter === "ALL" || review.documentState === stateFilter;

      return matchesSearch && matchesState;
    });
  }, [reviews, searchTerm, stateFilter]);

  const filteredSystems = useMemo(() => {
    return systems.filter(system => {
      const lower = searchTerm.toLowerCase();
      return (
        !searchTerm ||
        system.systemName.toLowerCase().includes(lower) ||
        system.description.toLowerCase().includes(lower) ||
        system.category.toLowerCase().includes(lower)
      );
    });
  }, [systems, searchTerm]);

  const stateCounts = useMemo(() => {
    const source = viewMode === "systems"
      ? systems.flatMap(s => s.reviews)
      : reviews;

    return source.reduce((acc, r) => {
      acc[r.documentState as DocumentState] =
        (acc[r.documentState as DocumentState] || 0) + 1;
      return acc;
    }, {} as Record<DocumentState, number>);
  }, [systems, reviews, viewMode]);

  // Detail modals/pages (keep existing behavior)
  if (selectedReview) {
    return (
      <SolutionReviewDetail
        review={selectedReview as any}
        onClose={() => setSelectedReview(null)}
      />
    );
  }

  if (selectedSystem) {
    return (
      <SystemDetail
        system={selectedSystem as any}
        onClose={() => setSelectedSystem(null)}
        onViewReview={(r: any) => setSelectedReview(r)}
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
            <div className="text-2xl font-bold text-gray-900">
              {viewMode === "systems" ? systems.length : reviews.length}
            </div>
            <div className="text-sm text-gray-600">
              {viewMode === "systems" ? "Total Systems" : "Total Reviews"}
            </div>
          </div>
          {Object.values(DocumentState).map(ds => (
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
                      : "Search reviews by name, business unit, or system..."
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
                  All ({viewMode === "systems" ? systems.length : reviews.length})
                </button>
                {viewMode === "reviews" &&
                  Object.values(DocumentState).map(ds => (
                    <button
                      key={ds}
                      onClick={() => setStateFilter(ds)}
                      className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                        stateFilter === ds
                          ? "bg-primary-100 text-primary-700 border border-primary-300"
                          : "bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200"
                      }`}
                    >
                      {ds} ({stateCounts[ds] || 0})
                    </button>
                  ))}
              </div>
            </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            <span className="ml-3 text-gray-600">Loading solution reviews...</span>
          </div>
        )}

        {/* Error */}
        {error && !loading && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex">
              <svg className="w-5 h-5 text-red-400 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <h3 className="text-sm font-medium text-red-800">Error</h3>
                <p className="text-sm text-red-700 mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Content */}
        {!loading && !error && (
          <>
            {viewMode === "systems" ? (
              filteredSystems.length === 0 ? (
                <div className="text-center py-12">
                  <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No systems found</h3>
                  <p className="text-gray-600 mb-4">
                    {searchTerm
                      ? "Try adjusting your search criteria."
                      : "Get started by creating your first solution review."}
                  </p>
                  {!searchTerm && (
                    <Button onClick={() => navigate("/create-solution-review")}>
                      Create Your First Solution Review
                    </Button>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredSystems.map(system => (
                    <SystemCard
                      key={system.systemId}
                      system={system as any}
                      onViewSystem={setSelectedSystem as any}
                    />
                  ))}
                </div>
              )
            ) : filteredReviews.length === 0 ? (
              <div className="text-center py-12">
                <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No solution reviews found</h3>
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
                {filteredReviews.map(review => (
                  <SolutionReviewCard
                    key={review.id}
                    review={review as any}
                    onView={setSelectedReview as any}
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