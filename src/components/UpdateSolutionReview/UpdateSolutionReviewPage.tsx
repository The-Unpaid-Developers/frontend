import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ProgressBar } from "./ProgressBar";
import { NavigationButtons } from "./NavigationButtons";
import { ReviewSubmissionModal } from "../SolutionReviewDetail/ReviewSubmissionModal";
import BusinessCapabilitiesStep from "./steps/BusinessCapabilitiesStep";
import DataAssetStep from "./steps/DataAssetStep";
import EnterpriseToolsStep from "./steps/EnterpriseToolsStep";
import IntegrationFlowStep from "./steps/IntegrationFlowStep";
import SolutionOverviewStep from "./steps/SolutionOverviewStep";
import SystemComponentStep from "./steps/SystemComponentStep";
import TechnologyComponentStep from "./steps/TechnologyComponentStep";
import ProcessComplianceStep from "./steps/ProcessComplianceStep";
import { useUpdateSolutionReview } from "../../hooks/useUpdateSolutionReview";
import useStepNavigation from "../../hooks/useStepNavigation";
import type { UpdateSolutionReviewData } from "../../types/solutionReview";
import { Button } from "../ui";
import { useToast } from "../../context/ToastContext";

const steps = [
  SolutionOverviewStep,
  BusinessCapabilitiesStep,
  DataAssetStep,
  SystemComponentStep,
  TechnologyComponentStep,
  IntegrationFlowStep,
  EnterpriseToolsStep,
  ProcessComplianceStep,
];

const stepMeta = [
  { key: "solutionOverview", label: "Solution Overview" },
  { key: "businessCapabilities", label: "Business Capabilities" },
  { key: "dataAssets", label: "Data and Assets" },
  { key: "systemComponents", label: "System Components" },
  { key: "technologyComponents", label: "Technology Components" },
  { key: "integrationFlows", label: "Integration Flow" },
  { key: "enterpriseTools", label: "Enterprise Tools" },
  { key: "processCompliances", label: "Process Compliance" },
];

export const UpdateSolutionReviewPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  console.log(id);
  const { currentStep, nextStep, prevStep, goToStep } = useStepNavigation(
    steps.length
  );
  const [showReview, setShowReview] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {showSuccess, showError } = useToast();

  const {
    saveSection,
    transitionSolutionReviewState,
    loadReviewData,
    solutionOverview,
    businessCapabilities,
    dataAssets,
    systemComponents,
    technologyComponents,
    integrationFlows,
    enterpriseTools,
    processCompliances,
    systemCode,
  } = useUpdateSolutionReview(id);

  // Create the existingData object from the hook's state
  const existingData: UpdateSolutionReviewData = {
    solutionOverview,
    businessCapabilities,
    dataAssets,
    systemComponents,
    technologyComponents,
    integrationFlows,
    enterpriseTools,
    processCompliances,
    systemCode,
    documentState: "DRAFT",
    id,
  };
  console.log("existing data", existingData);

  const StepComponent = steps[currentStep];

  console.log(currentStep);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await loadReviewData();
      } catch (error) {
        console.error("Error loading review data:", error);
      }
    };

    fetchData();
  }, [currentStep]);

  const handleSave = async (data: any) => {
    try {
      const sectionKey = stepMeta[currentStep]
        .key as keyof UpdateSolutionReviewData;
      await saveSection(sectionKey, data);
      showSuccess(`${stepMeta[currentStep].label} saved successfully!`);
    } catch (err) {
      console.error("Save failed", err);
      showError(`Failed to save ${stepMeta[currentStep].label}. Please try again.` + err.message);
    }
  };

  const handleSubmit = async () => {
    console.log("Submit clicked - implement final submission here");
    setShowReview(true);
  };

  const confirmSubmit = async () => {
    try {
      setIsSubmitting(true);
      await transitionSolutionReviewState("SUBMIT");
      setShowReview(false);
      navigate('/view-solution-review/' + id);
    } catch (e) {
      console.error("Submit failed", e);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6">
      <div className="fixed top-4 right-4 z-50">
        <Button variant="ghost" onClick={() => navigate(-1)} aria-label="Close">
          <svg
            className="w-6 h-6"
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
      <ProgressBar
        currentStep={currentStep}
        steps={stepMeta}
        onStepClick={goToStep}
      />

      <div className="mt-4">
        <StepComponent onSave={handleSave} initialData={existingData}
          showSuccess={showSuccess}
          showError={showError} />
      </div>
      <NavigationButtons
        currentStep={currentStep}
        totalSteps={steps.length}
        nextStep={nextStep}
        prevStep={prevStep}
        onSubmit={currentStep === steps.length - 1 ? handleSubmit : undefined}
      />
      
      <ReviewSubmissionModal
        showReview={showReview}
        setShowReview={setShowReview}
        isSubmitting={isSubmitting}
        reviewId={id}
        stepMeta={stepMeta}
        goToStep={goToStep}
        confirmSubmit={confirmSubmit}
      />
    </div>
  );
};

export default UpdateSolutionReviewPage;