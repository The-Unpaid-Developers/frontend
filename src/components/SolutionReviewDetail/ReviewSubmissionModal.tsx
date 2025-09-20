import React, { useEffect, useState } from "react";
import { Modal, Button } from "../ui";
import type { UpdateSolutionReviewData } from "../../types/solutionReview";
import { useViewSolutionReview } from "../../hooks/useViewSolutionReview";
import { useToast } from "../../context/ToastContext";

interface ReviewSubmissionModalProps {
  showReview: boolean;
  setShowReview: (show: boolean) => void;
  isSubmitting: boolean;
  reviewId: string;
  stepMeta?: Array<{ key: string; label: string }>;
  goToStep?: (index: number) => void;
  confirmSubmit: () => Promise<void>;
}

const sectionLabels = {
  solutionOverview: "Solution Overview",
  businessCapabilities: "Business Capabilities",
  dataAssets: "Data & Assets",
  systemComponents: "System Components",
  technologyComponents: "Technology Components",
  integrationFlows: "Integration Flow",
  enterpriseTools: "Enterprise Tools",
  processCompliances: "Process Compliance",
};

export const ReviewSubmissionModal: React.FC<ReviewSubmissionModalProps> = ({
  showReview,
  setShowReview,
  isSubmitting,
  reviewId,
  stepMeta,
  goToStep,
  confirmSubmit,
}) => {
  const { loadSolutionReviewById, solutionReviews, isLoading, error } = useViewSolutionReview();
  const [existingData, setExistingData] = useState<UpdateSolutionReviewData | null>(null);
  const { showError } = useToast();
  
  // Fetch data when modal opens and reviewId is available
  useEffect(() => {
    if (showReview && reviewId) {
      const fetchData = async () => {
        try {
          await loadSolutionReviewById(reviewId);
        } catch (err) {
          console.error("Failed to load solution review:", err);
        }
      };
      try {
        fetchData();
      } catch (err) {
        console.error("Failed to fetch data:", err);
        showError("Failed to load data: " + (err as Error).message);
      }
    }
  }, [showReview, reviewId]);

  // Update existingData when solutionReviews changes
  useEffect(() => {
    if (solutionReviews && solutionReviews.length > 0) {
      const review = solutionReviews[0];
      // Map the SolutionReview to UpdateSolutionReviewData format
      const mappedData: UpdateSolutionReviewData = {
        id: review.id,
        systemCode: review.systemCode,
        documentState: review.documentState,
        solutionOverview: review.solutionOverview,
        businessCapabilities: review.businessCapabilities,
        dataAssets: review.dataAssets,
        systemComponents: review.systemComponents,
        technologyComponents: review.technologyComponents,
        integrationFlows: review.integrationFlows,
        enterpriseTools: review.enterpriseTools,
        processCompliances: review.processCompliances,
      };
      setExistingData(mappedData);
    }
  }, [solutionReviews]);

  const getMissingSections = () => {
    if (!existingData) return [];
    
    return Object.entries(existingData)
      .filter(([key, value]) => {
        // Skip non-content fields
        if (['id', 'systemCode', 'documentState'].includes(key)) return false;
        
        // Check if section is missing or empty
        return value == null || (Array.isArray(value) && value.length === 0);
      })
      .map(([key]) => sectionLabels[key as keyof UpdateSolutionReviewData])
      .filter(Boolean);
  };

  const missingSections = getMissingSections();
  const hasMissing = missingSections.length > 0;

  const handleConfirm = async () => {
    if (hasMissing) return;
    await confirmSubmit();
  };

  const goToSection = (sectionKey: string) => {
    if (!stepMeta || !goToStep) {
      // If no navigation provided, just close modal
      setShowReview(false);
      return;
    }
    
    const idx = stepMeta.findIndex((s) => s.key === sectionKey);
    if (idx !== -1) {
      setShowReview(false);
      goToStep(idx);
    }
  };

  return (
    <Modal
      isOpen={showReview}
      onClose={() => !isSubmitting && setShowReview(false)}
      title="Review Solution Review"
    >
      <div className="space-y-4">
        {isLoading && (
          <div className="text-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-sm text-gray-500 mt-2">Loading review data...</p>
          </div>
        )}

        {error && (
          <div className="text-red-600 text-sm bg-red-50 p-3 rounded">
            Error loading data: {error}
          </div>
        )}

        {existingData && (
          <>
            <div className="max-h-[60vh] overflow-y-auto space-y-4 text-sm">
              {Object.entries(existingData)
                .filter(([key]) => !['id', 'systemCode', 'documentState'].includes(key))
                .map(([key, value]) => {
                  const isArray = Array.isArray(value);
                  const isEmpty = value == null || (isArray && value.length === 0);
                  
                  return (
                    <div key={key} className="border rounded p-3">
                      <h3 className="font-semibold mb-2">
                        {sectionLabels[key as keyof UpdateSolutionReviewData]}
                        {isArray && !isEmpty && (
                          <span className="ml-2 text-xs font-medium text-gray-500">
                            ({value.length} items)
                          </span>
                        )}
                      </h3>

                      {isEmpty ? (
                        <div className="text-red-600 text-sm">Not completed</div>
                      ) : (
                        <div className="bg-gray-50 p-2 rounded text-xs">
                          {isArray ? (
                            <div>
                              <strong>{value.length} items</strong>
                              {value.length > 0 && (
                                <details className="mt-1">
                                  <summary className="cursor-pointer text-blue-600 hover:underline">
                                    View details
                                  </summary>
                                  <pre className="mt-2 overflow-x-auto">
                                    {JSON.stringify(value, null, 2)}
                                  </pre>
                                </details>
                              )}
                            </div>
                          ) : (
                            <pre className="overflow-x-auto">
                              {JSON.stringify(value, null, 2)}
                            </pre>
                          )}
                        </div>
                      )}

                      {isEmpty && stepMeta && goToStep && (
                        <Button
                          variant="secondary"
                          size="sm"
                          className="mt-2"
                          onClick={() => goToSection(key)}
                        >
                          Go to section
                        </Button>
                      )}
                    </div>
                  );
                })}
            </div>

            {hasMissing && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
                <strong>Complete all sections before submitting.</strong>
                <br />
                Missing: {missingSections.join(", ")}
              </div>
            )}
          </>
        )}

        <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
          <Button
            variant="secondary"
            disabled={isSubmitting}
            onClick={() => setShowReview(false)}
          >
            Cancel
          </Button>
          <Button
            disabled={hasMissing || isSubmitting || isLoading || !!error}
            onClick={handleConfirm}
          >
            {isSubmitting ? "Submitting..." : "Confirm Submit"}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ReviewSubmissionModal;