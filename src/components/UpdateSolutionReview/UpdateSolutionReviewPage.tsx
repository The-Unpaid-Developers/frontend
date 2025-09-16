import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ProgressBar } from "./ProgressBar";
import { NavigationButtons } from "./NavigationButtons";
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
import { Modal, Button } from "../ui";
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
  // const [currentStep, setCurrentStep] = useState(0);
  // const { saveSection } = useCreateSolutionReview();
  // const { nextStep, prevStep } = useStepNavigation(currentStep, setCurrentStep, steps.length);
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  console.log(id);
  const { currentStep, nextStep, prevStep, goToStep } = useStepNavigation(
    steps.length
  );
  // const [createData, setCreateData] = useState<UpdateSolutionReviewData>(emptyData);
  const [showReview, setShowReview] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast, showSuccess, showError, hideToast } = useToast();

  const {
    saveSection,
    updateReviewState,
    loadReviewData,
    isLoading,
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
    id,
  };
  console.log("existing data", existingData);

  const StepComponent = steps[currentStep];

  // const handleSave = async (data: any) => {
  //   await saveSection(currentStep, data);
  //   nextStep();
  // };

  // Load existing data when component mounts
  // useEffect(() => {
  //   if (true) {
  //     loadReviewData();
  //     console.log('load review data called');
  //     console.log(existingData);
  //   }
  // }, [loadReviewData, existingData]);
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
    // setIsSaving(true);
    try {
      const sectionKey = stepMeta[currentStep]
        .key as keyof UpdateSolutionReviewData;
      // persist in lifted state
      // setCreateData(prev => ({ ...prev, [sectionKey]: data }));
      // data.id = id; // ensure id is set for update
      await saveSection(sectionKey, data);
      showSuccess(`${stepMeta[currentStep].label} saved successfully!`);
    } catch (err) {
      console.error("Save failed", err);
      showError(`Failed to save ${stepMeta[currentStep].label}. Please try again.` + err.message);
    } finally {
      // setIsSaving(false);
    }
  };

  // optional: handle final submit (replace console.log with actual submit)
  const handleSubmit = async () => {
    // TODO: replace with actual final submit logic (e.g. gather create context data and call API)
    console.log("Submit clicked - implement final submission here");
    setShowReview(true); // open review modal instead of immediate submit
  };

  const sectionLabels: Record<keyof UpdateSolutionReviewData, string> = {
    solutionOverview: "Solution Overview",
    businessCapabilities: "Business Capabilities",
    dataAssets: "Data & Assets",
    systemComponents: "System Components",
    technologyComponents: "Technology Components",
    integrationFlows: "Integration Flow",
    enterpriseTools: "Enterprise Tools",
    processCompliances: "Process Compliance",
  };

  const missingSections = Object.entries(existingData)
    .filter(([_, v]) => v == null || (Array.isArray(v) && v.length === 0))
    .map(([k]) => sectionLabels[k as keyof UpdateSolutionReviewData]);

  const hasMissing = missingSections.length > 0;

  const confirmSubmit = async () => {
    if (hasMissing) return;
    try {
      setIsSubmitting(true);
      // existingData.id
      await updateReviewState("SUBMIT");
      setShowReview(false);
      navigate('/view-solution-review/' + id); // navigate to view page after submit
      // Optionally navigate away or show success toast
    } catch (e) {
      console.error("Submit failed", e);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6">
      <div className="mb-4">
        <h1 className="text-2xl font-bold">Update Solution Review</h1>
      </div>
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
      {/* <ProgressBar currentStep={currentStep} totalSteps={steps.length} /> */}
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
      {showReview && (
        <Modal
          isOpen={showReview}
          onClose={() => !isSubmitting && setShowReview(false)}
          title="Review Solution Review"
        >
          <div className="max-h-[60vh] overflow-y-auto space-y-4 text-sm">
            {(
              Object.keys(existingData) as (keyof UpdateSolutionReviewData)[]
            ).map((key) => {
              const value = existingData[key];
              const isArray = Array.isArray(value);
              return (
                <div key={key} className="border rounded p-3">
                  <h3 className="font-semibold mb-2">{sectionLabels[key]}
                    {isArray && (
                      <span className="ml-2 text-xs font-medium text-gray-500">
                        ({value.length})
                      </span>
                    )}
                  </h3>

                  {value == null ? (
                    <div className="text-red-600">Not completed</div>
                  ) : (
                    <pre className="bg-gray-50 p-2 rounded overflow-x-auto text-xs">
                      {JSON.stringify(value, null, 2)}
                    </pre>
                  )}
                  {value == null && (
                    <Button
                      variant="secondary"
                      className="mt-2"
                      onClick={() => {
                        const idx = stepMeta.findIndex((s) => s.key === key);
                        setShowReview(false);
                        goToStep(idx);
                      }}
                    >
                      Go to section
                    </Button>
                  )}
                </div>
              );
            })}
          </div>

          {hasMissing && (
            <div className="mt-4 text-red-600 text-sm">
              Complete all sections before submitting. Missing:{" "}
              {missingSections.join(", ")}
            </div>
          )}

          <div className="mt-6 flex justify-end gap-2">
            <Button
              variant="secondary"
              disabled={isSubmitting}
              onClick={() => setShowReview(false)}
            >
              Cancel
            </Button>
            <Button
              disabled={hasMissing || isSubmitting}
              onClick={confirmSubmit}
            >
              {isSubmitting ? "Submitting..." : "Confirm Submit"}
            </Button>
          </div>
        </Modal>
      )}
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={hideToast}
      />
    </div>
  );
};

export default UpdateSolutionReviewPage;
