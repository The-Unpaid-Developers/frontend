import React, { useState } from "react";
import type { SolutionReview, SystemGroup } from "../../types/solutionReview";
import { DocumentState, STATE_TRANSITIONS } from "../../types/solutionReview";
import { Card, CardHeader, CardTitle, CardContent, Badge, Button } from "../ui";
import { useNavigate } from "react-router-dom";
import { useCreateSolutionOverview } from "../../hooks/useCreateSolutionOverview";
// import { useSolutionReview } from "../../context/SolutionReviewContext";
import { useToast } from "../../context/ToastContext";
import { useUpdateSolutionReview } from "../../hooks/useUpdateSolutionReview";
import { ReviewSubmissionModal } from "./ReviewSubmissionModal";
import { ApprovalModal } from "../AdminPanel";

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
  const [selectedVersion, setSelectedVersion] = useState<SolutionReview | null>(
    null
  );
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
      {/* {system.currentReview && (
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
      )} */}

      {/* Version History */}
      <Card>
        <CardHeader>
          <CardTitle>Version History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {system.map((review, index) => {
              // const previousReview = system.reviews[index + 1];
              // const changes = getVersionChanges(review, previousReview);
              const previousReview = system[index + 1];
              const changes = getVersionChanges(review, previousReview);
              const availableTransitions = STATE_TRANSITIONS[review.documentState] || [];

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
                        {review.id}
                      </span>
                      <Badge variant="state" state={review.documentState}>
                        {review.documentState}
                      </Badge>
                      {/* {review.version === system.latestVersion && (
                        <Badge className="bg-green-100 text-green-800 border-green-300">
                          Latest
                        </Badge>
                      )} */}
                      {review.documentState === "CURRENT" && (
                        <Badge className="bg-blue-100 text-blue-800 border-blue-300">
                          Current
                        </Badge>
                      )}
                    </div>
                    <div className="flex space-x-2">
                      {/* <Button
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
                      </Button> */}
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
                        Changes from v{previousReview?.id}
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
                        {review.documentState === "CURRENT" && (
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
