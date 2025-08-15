import React from "react";
import {
  DocumentState,
  STATE_TRANSITIONS,
  getStateDescription,
} from "../types";
import type { SolutionReview } from "../types";
import { Card, CardHeader, CardTitle, CardContent, Badge, Button } from "./ui";
import { useSolutionReview } from "../context/SolutionReviewContext";

interface SolutionReviewDetailProps {
  review: SolutionReview;
  onClose: () => void;
}

export const SolutionReviewDetail: React.FC<SolutionReviewDetailProps> = ({
  review,
  onClose,
}) => {
  const { actions } = useSolutionReview();

  const handleStateTransition = async (newState: DocumentState) => {
    await actions.transitionState(review.id, newState);
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

  const availableTransitions = STATE_TRANSITIONS[review.documentState] || [];

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center space-x-3 mb-2">
            <Badge variant="state" state={review.documentState}>
              {review.documentState}
            </Badge>
            <span className="text-sm text-gray-500">
              Version {review.version}
            </span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">
            {review.solutionOverview?.title || "Untitled Solution Review"}
          </h1>
          <p className="text-gray-600 mt-1">
            {getStateDescription(review.documentState)}
          </p>
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

      {/* Actions */}
      {availableTransitions.length > 0 && (
        <Card>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              <span className="text-sm font-medium text-gray-700 mr-2">
                Available Actions:
              </span>
              {availableTransitions.map((transition) => (
                <Button
                  key={transition.operation}
                  variant={
                    transition.to === DocumentState.CURRENT
                      ? "primary"
                      : "secondary"
                  }
                  size="sm"
                  onClick={() => handleStateTransition(transition.to)}
                  title={transition.description}
                >
                  {transition.operationName}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Solution Overview */}
      {review.solutionOverview && (
        <Card>
          <CardHeader>
            <CardTitle>Solution Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-1">
                    Description
                  </h4>
                  <p className="text-gray-600">
                    {review.solutionOverview.description}
                  </p>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-1">
                    Business Value
                  </h4>
                  <p className="text-gray-600">
                    {review.solutionOverview.businessValue}
                  </p>
                </div>

                {review.solutionOverview.stakeholders.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">
                      Stakeholders
                    </h4>
                    <ul className="space-y-1">
                      {review.solutionOverview.stakeholders.map(
                        (stakeholder, index) => (
                          <li key={index} className="text-gray-600 text-sm">
                            • {stakeholder}
                          </li>
                        )
                      )}
                    </ul>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-1">Category</h4>
                    <Badge>{review.solutionOverview.category}</Badge>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-1">Priority</h4>
                    <Badge
                      className={
                        review.solutionOverview.priority === "High"
                          ? "bg-red-100 text-red-800 border-red-300"
                          : review.solutionOverview.priority === "Medium"
                          ? "bg-yellow-100 text-yellow-800 border-yellow-300"
                          : "bg-green-100 text-green-800 border-green-300"
                      }
                    >
                      {review.solutionOverview.priority}
                    </Badge>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-1">
                      Estimated Cost
                    </h4>
                    <p className="text-gray-600">
                      ${review.solutionOverview.estimatedCost.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-1">Duration</h4>
                    <p className="text-gray-600">
                      {review.solutionOverview.estimatedDuration}
                    </p>
                  </div>
                </div>

                {review.solutionOverview.risksAndChallenges.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">
                      Risks & Challenges
                    </h4>
                    <ul className="space-y-1">
                      {review.solutionOverview.risksAndChallenges.map(
                        (risk, index) => (
                          <li key={index} className="text-gray-600 text-sm">
                            • {risk}
                          </li>
                        )
                      )}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Components Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Business Capabilities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary-600 mb-1">
              {review.businessCapabilities.length}
            </div>
            <p className="text-sm text-gray-600">Capabilities defined</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">System Components</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary-600 mb-1">
              {review.systemComponents.length}
            </div>
            <p className="text-sm text-gray-600">Systems involved</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Integration Flows</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary-600 mb-1">
              {review.integrationFlows.length}
            </div>
            <p className="text-sm text-gray-600">Integrations planned</p>
          </CardContent>
        </Card>
      </div>

      {/* Metadata */}
      <Card>
        <CardHeader>
          <CardTitle>Document Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium text-gray-900">Created:</span>
              <p className="text-gray-600">
                {formatDate(review.createdAt)} by {review.createdBy}
              </p>
            </div>
            <div>
              <span className="font-medium text-gray-900">Last Modified:</span>
              <p className="text-gray-600">
                {formatDate(review.lastModifiedAt)} by {review.lastModifiedBy}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
