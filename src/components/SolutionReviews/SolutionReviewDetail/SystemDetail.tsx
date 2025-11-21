import React, { useState } from "react";
import type { SolutionReview } from "../../../types/solutionReview";
import { STATE_TRANSITIONS } from "../../../types/solutionReview";
import { Card, CardHeader, CardTitle, CardContent, Badge, Button } from "../../ui";
import { useNavigate } from "react-router-dom";
import { useCreateSolutionOverview } from "../../../hooks/useCreateSolutionOverview";
import { useToast } from "../../../context/ToastContext";
import { useUpdateSolutionReview } from "../../../hooks/useUpdateSolutionReview";
import { ReviewSubmissionModal } from "./ReviewSubmissionModal";
import { ApprovalModal } from "../../AdminPanel";
import { formatDate } from "../../../utils/formatters";

interface SystemDetailProps {
  systemCode: string;
  system: SolutionReview[];
  onClose: () => void;
  onViewReview: (review: SolutionReview) => void;
}

export const SystemDetail: React.FC<SystemDetailProps> = ({
  systemCode,
  system,
  onClose,
  onViewReview,
}) => {
  const navigate = useNavigate();
  const { showSuccess, showError } = useToast();
  const [showSubmissionModal, setShowSubmissionModal] = useState(false);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const { transitionSolutionReviewState } = useUpdateSolutionReview();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeReviewId, setActiveReviewId] = useState<string>(''); // Track which review is being acted upon
  
  const handleStateTransition = async (operation: string, reviewId: string) => {
    try {
      setActiveReviewId(reviewId); 
      if (operation === "REMOVE_SUBMISSION") {
        await transitionSolutionReviewState(operation, reviewId);
        showSuccess("Review moved back to draft successfully!");
        navigate(0);
      } else if (operation === "APPROVE") {
        setShowApprovalModal(true);
        return; // Don't navigate yet, wait for approval modal
      } else if (operation === "SUBMIT") {
        setShowSubmissionModal(true);
        return; // Don't show toast yet, wait for modal confirmation
      } else if (operation === "ACTIVATE") {
        await transitionSolutionReviewState(operation, reviewId);
        showSuccess("Review activated successfully!");
        navigate(0);
      } else if (operation === "UNAPPROVE") {
        await transitionSolutionReviewState(operation, reviewId);
        showSuccess("Review unapproved successfully!");
        navigate(0);
      } else if (operation === "MARK_OUTDATED") {
        await transitionSolutionReviewState(operation, reviewId);
        showSuccess("Review marked as outdated successfully!");
        navigate(0);
      } else if (operation === "RESET_CURRENT") {
        await transitionSolutionReviewState(operation, reviewId);
        showSuccess("Review reverted to current successfully!");
        navigate(0);
      }
    } catch (error) {
      console.error("State transition failed:", error);
      showError("Failed to update review status. Please try again." + (error as Error).message);
    }
  };

  const handleApprovalComplete = async () => {
    // This function will be called by ApprovalModal after concerns are added
    await transitionSolutionReviewState("APPROVE", activeReviewId);
    navigate(0);
  };

  const confirmSubmit = async () => {
    try {
      setIsSubmitting(true);
      await transitionSolutionReviewState("SUBMIT", activeReviewId);
      showSuccess("Review submitted successfully!");
      setShowSubmissionModal(false);
      navigate(0); // Refresh the current route
    } catch (error) {
      console.error("Submit failed:", error);
      showError("Failed to submit review. Please try again." + (error as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const { createSRFromExisting } = useCreateSolutionOverview();
  const createNewDraft = async () => {
      try {
      // call hook to create new draft from existing sr
      const response = await createSRFromExisting(systemCode);
      showSuccess("New draft created successfully!");
      navigate(`/update-solution-review/${response.id}`);
    } catch (error) {
      console.error("Failed to create new draft:", error);
      showError("Failed to create new draft: " + error.message);
    }
    };

  const getVersionChanges = (
    currentVersion: SolutionReview,
    previousVersion?: SolutionReview
  ) => {
    if (!previousVersion) return null;

    const changes: string[] = [];

    return changes;
  };

  // Get user role from localStorage
  const userRole = localStorage.getItem("userToken");
  const isEAO = userRole === "EAO";

  console.log(system);

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center space-x-3 mb-2">
            {/* <Badge className="bg-blue-100 text-blue-800 border-blue-300">
              {system.category}
            </Badge> */}
            <span className="text-sm text-gray-500">
              {/* {system.totalReviews} versions • Latest v{system.latestVersion} */}
            </span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">
            {systemCode}
          </h1>
          {/* <p className="text-gray-600 mt-1">{system.description}</p> */}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="primary"
            size="sm"
            onClick={() => navigate(`/view-business-capabilities/${systemCode}`)}
            className="bg-white border border-blue-300 !text-blue-500 hover:bg-blue-50 hover:!text-white font-medium px-4 py-2 rounded-md shadow-sm flex items-center"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            View Business Capabilities
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => navigate(`/view-system-flow-diagram/${systemCode}`)}
            className="bg-white border border-blue-300 !text-blue-500 hover:bg-blue-50 hover:!text-white font-medium px-4 py-2 rounded-md shadow-sm flex items-center"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            View Flow Diagram
          </Button>
          <Button 
            variant="ghost" 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full border border-gray-300 bg-white shadow-sm"
          >
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
      </div>

      {/* Version History */}
      <Card>
        <CardHeader>
          <CardTitle>Version History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {system.map((review, index) => {
              const previousReview = system[index + 1];
              const changes = getVersionChanges(review, previousReview);
              // Filter available transitions - only show APPROVE if user is EAO
              const availableTransitions = (STATE_TRANSITIONS[review.documentState] ?? []).filter(transition => {
                if (transition.operation === "APPROVE") {
                  return isEAO;
                }
                return true;
              });

              return (
                <div
                  key={review.id}
                  className="border rounded-lg p-4 border-gray-200"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center space-x-3">
                      <span className="font-semibold text-lg">
                        {review.id}
                      </span>
                      <Badge variant="state" state={review.documentState}>
                        {review.documentState}
                      </Badge>
                      {review.documentState === "CURRENT" && (
                        <Badge className="bg-blue-100 text-blue-800 border-blue-300">
                          Current
                        </Badge>
                      )}
                    </div>
                    <div className="flex space-x-2">
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
                        {review.solutionOverview?.solutionDetails?.solutionName ?? "Untitled Solution Review"}
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
                        Changes from v{previousReview?.id}
                      </h4>
                      <ul className="text-sm text-gray-600 list-disc list-inside">
                        {changes.map((change, idx) => (
                          <li key={`change-${change.slice(0, 20)}-${idx}`}>{change}</li>
                        ))}
                      </ul>
                    </div>
                  )}
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
                              transition.to === "CURRENT" || transition.to === "ACTIVE"
                                ? "primary"
                                : "secondary"
                            }
                            size="sm"
                            onClick={() =>
                              handleStateTransition(transition.operation, review.id)
                            }
                            title={transition.description}
                          >
                            {transition.operationName}
                          </Button>
                        ))}
                        {review.documentState === "DRAFT" && (
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() => navigate(`/update-solution-review/${review.id}`)}
                          >
                            Edit Draft
                          </Button>
                        )}
                        {review.documentState === "ACTIVE" && (
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={createNewDraft}
                          >
                            Create New Draft
                          </Button>
                        )}
                      </div>
                    </div>
                  )}
                  {/* Reusable Approval Modal */}
                  {/* <ApprovalModal
                    isOpen={showApprovalModal}
                    onClose={() => setShowApprovalModal(false)}
                    reviewId={review.id}
                    onApprovalComplete={handleApprovalComplete}
                    currentSolutionOverview={review.solutionOverview}
                  /> */}
  
                  {/* Submit Review Modal (remains unchanged) */}
                  {/* <ReviewSubmissionModal
                    showReview={showSubmissionModal}
                    setShowReview={setShowSubmissionModal}
                    isSubmitting={isSubmitting}
                    reviewId={review.id}
                    confirmSubmit={confirmSubmit}
                  /> */}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
      {/* Reusable Approval Modal */}
      <ApprovalModal
        isOpen={showApprovalModal}
        onClose={() => setShowApprovalModal(false)}
        reviewId={activeReviewId}
        onApprovalComplete={handleApprovalComplete}
        currentSolutionOverview={system.find(r => r.id === activeReviewId)?.solutionOverview}
      />

      {/* Submit Review Modal */}
      <ReviewSubmissionModal
        showReview={showSubmissionModal}
        setShowReview={setShowSubmissionModal}
        isSubmitting={isSubmitting}
        reviewId={activeReviewId}
        confirmSubmit={confirmSubmit}
      />
    </div>
  );
};
