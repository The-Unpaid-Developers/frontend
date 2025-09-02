import React, { useState } from "react";
import type { SolutionReview, SystemGroup } from "../../types/solutionReview";
import { DocumentState, STATE_TRANSITIONS } from "../../types/solutionReview";
import { Card, CardHeader, CardTitle, CardContent, Badge, Button } from "../ui";
import { useSolutionReview } from "../../context/SolutionReviewContext";

interface SystemDetailProps {
  system: SystemGroup;
  onClose: () => void;
  onViewReview: (review: SolutionReview) => void;
}

export const SystemDetail: React.FC<SystemDetailProps> = ({
  system,
  onClose,
  onViewReview,
}) => {
  const { actions } = useSolutionReview();
  const [selectedVersion, setSelectedVersion] = useState<SolutionReview | null>(
    null
  );

  const handleStateTransition = async (
    reviewId: string,
    newState: DocumentState
  ) => {
    await actions.transitionState(reviewId, newState);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getVersionChanges = (
    currentVersion: SolutionReview,
    previousVersion?: SolutionReview
  ) => {
    if (!previousVersion) return null;

    const changes: string[] = [];

    return changes;
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center space-x-3 mb-2">
            <Badge className="bg-blue-100 text-blue-800 border-blue-300">
              {system.category}
            </Badge>
            <span className="text-sm text-gray-500">
              {system.totalReviews} versions • Latest v{system.latestVersion}
            </span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">
            {system.systemName}
          </h1>
          <p className="text-gray-600 mt-1">{system.description}</p>
        </div>
        <Button variant="ghost" onClick={onClose}>
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </Button>
      </div>

      {/* Current Version Summary */}
      {system.currentReview && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Current Version (v{system.currentReview.version})</span>
              <Badge variant="state" state={system.currentReview.documentState}>
                {system.currentReview.documentState}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <h4 className="font-medium text-gray-900 mb-1">Title</h4>
                <p className="text-gray-600">
                  {system.currentReview.solutionOverview?.solutionDetails?.solutionName || "Untitled Solution Review"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Version History */}
      <Card>
        <CardHeader>
          <CardTitle>Version History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {system.reviews.map((review, index) => {
              const previousReview = system.reviews[index + 1];
              const changes = getVersionChanges(review, previousReview);
              const availableTransitions =
                STATE_TRANSITIONS[review.documentState] || [];

              return (
                <div
                  key={review.id}
                  className={`border rounded-lg p-4 ${selectedVersion?.id === review.id
                    ? "border-primary-300 bg-primary-50"
                    : "border-gray-200"
                    }`}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center space-x-3">
                      <span className="font-semibold text-lg">
                        v{review.version}
                      </span>
                      <Badge variant="state" state={review.documentState}>
                        {review.documentState}
                      </Badge>
                      {review.version === system.latestVersion && (
                        <Badge className="bg-green-100 text-green-800 border-green-300">
                          Latest
                        </Badge>
                      )}
                      {review.documentState === "CURRENT" && (
                        <Badge className="bg-blue-100 text-blue-800 border-blue-300">
                          Current
                        </Badge>
                      )}
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          setSelectedVersion(
                            selectedVersion?.id === review.id ? null : review
                          )
                        }
                      >
                        {selectedVersion?.id === review.id
                          ? "Collapse"
                          : "Expand"}
                      </Button>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => onViewReview(review)}
                      >
                        View Details
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-1">Title</h4>
                      <p className="text-sm text-gray-600">
                        {review.solutionOverview?.solutionDetails?.solutionName || "Untitled Solution Review"}
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-1">
                        Created
                      </h4>
                      <p className="text-sm text-gray-600">
                        {formatDate(review.createdAt)}
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-1">
                        Modified
                      </h4>
                      <p className="text-sm text-gray-600">
                        {formatDate(review.lastModifiedAt)}
                      </p>
                    </div>
                  </div>

                  {changes && changes.length > 0 && (
                    <div className="mb-3">
                      <h4 className="font-medium text-gray-900 mb-1">
                        Changes from v{previousReview?.version}
                      </h4>
                      <ul className="text-sm text-gray-600 list-disc list-inside">
                        {changes.map((change, idx) => (
                          <li key={idx}>{change}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* {selectedVersion?.id === review.id && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">
                            Description
                          </h4>
                          <p className="text-sm text-gray-600">
                            {review.solutionOverview?.description}
                          </p>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      </div>
                    </div>
                  )} */}

                  {availableTransitions.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <div className="flex flex-wrap gap-2">
                        <span className="text-sm font-medium text-gray-700 mr-2">
                          Available Actions:
                        </span>
                        {availableTransitions.map((transition) => (
                          <Button
                            key={transition.operation}
                            variant={
                              transition.to === "CURRENT"
                                ? "primary"
                                : "ghost"
                            }
                            size="sm"
                            onClick={() =>
                              handleStateTransition(review.id, transition.to)
                            }
                            title={transition.description}
                          >
                            {transition.operationName}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
