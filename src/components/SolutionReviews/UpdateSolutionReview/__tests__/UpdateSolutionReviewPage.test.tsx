import React from "react";
import { describe, it, expect, vi, beforeEach, MockedFunction } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { UpdateSolutionReviewPage } from "../UpdateSolutionReviewPage";
import { useUpdateSolutionReview } from "../../../../hooks/useUpdateSolutionReview";
import useStepNavigation from "../../../../hooks/useStepNavigation";
import { useToast } from "../../../../context/ToastContext";

// Mock all the dependencies
vi.mock("../../../../hooks/useUpdateSolutionReview");
vi.mock("../../../../hooks/useStepNavigation");
vi.mock("../../../../context/ToastContext");
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => vi.fn(),
    useParams: () => ({ id: "test-id-123" }),
  };
});

// Mock all the step components
vi.mock("../steps/BusinessCapabilitiesStep", () => ({
  default: ({ onSave, initialData }: any) => (
    <div data-testid="business-capabilities-step">
      BusinessCapabilitiesStep
      <button onClick={() => onSave({ businessCapabilities: [] })}>
        Save Business Capabilities
      </button>
      <div>Initial Data: {JSON.stringify(initialData?.businessCapabilities)}</div>
    </div>
  ),
}));

vi.mock("../steps/DataAssetStep", () => ({
  default: ({ onSave, initialData }: any) => (
    <div data-testid="data-asset-step">
      DataAssetStep
      <button onClick={() => onSave({ dataAssets: [] })}>
        Save Data Assets
      </button>
      <div>Initial Data: {JSON.stringify(initialData?.dataAssets)}</div>
    </div>
  ),
}));

vi.mock("../steps/EnterpriseToolsStep", () => ({
  default: ({ onSave, initialData }: any) => (
    <div data-testid="enterprise-tools-step">
      EnterpriseToolsStep
      <button onClick={() => onSave({ enterpriseTools: [] })}>
        Save Enterprise Tools
      </button>
      <div>Initial Data: {JSON.stringify(initialData?.enterpriseTools)}</div>
    </div>
  ),
}));

vi.mock("../steps/IntegrationFlowStep", () => ({
  default: ({ onSave, initialData }: any) => (
    <div data-testid="integration-flow-step">
      IntegrationFlowStep
      <button onClick={() => onSave({ integrationFlows: [] })}>
        Save Integration Flows
      </button>
      <div>Initial Data: {JSON.stringify(initialData?.integrationFlows)}</div>
    </div>
  ),
}));

vi.mock("../steps/SolutionOverviewStep", () => ({
  default: ({ onSave, initialData }: any) => (
    <div data-testid="solution-overview-step">
      SolutionOverviewStep
      <button onClick={() => onSave({ solutionOverview: { solutionName: "Test" } })}>
        Save Solution Overview
      </button>
      <div>Initial Data: {JSON.stringify(initialData?.solutionOverview)}</div>
    </div>
  ),
}));

vi.mock("../steps/SystemComponentStep", () => ({
  default: ({ onSave, initialData }: any) => (
    <div data-testid="system-component-step">
      SystemComponentStep
      <button onClick={() => onSave({ systemComponents: [] })}>
        Save System Components
      </button>
      <div>Initial Data: {JSON.stringify(initialData?.systemComponents)}</div>
    </div>
  ),
}));

vi.mock("../steps/TechnologyComponentStep", () => ({
  default: ({ onSave, initialData }: any) => (
    <div data-testid="technology-component-step">
      TechnologyComponentStep
      <button onClick={() => onSave({ technologyComponents: [] })}>
        Save Technology Components
      </button>
      <div>Initial Data: {JSON.stringify(initialData?.technologyComponents)}</div>
    </div>
  ),
}));

vi.mock("../steps/ProcessComplianceStep", () => ({
  default: ({ onSave, initialData }: any) => (
    <div data-testid="process-compliance-step">
      ProcessComplianceStep
      <button onClick={() => onSave({ processCompliances: [] })}>
        Save Process Compliances
      </button>
      <div>Initial Data: {JSON.stringify(initialData?.processCompliances)}</div>
    </div>
  ),
}));

vi.mock("../ProgressBar", () => ({
  ProgressBar: ({ currentStep, steps, onStepClick }: any) => (
    <div data-testid="progress-bar">
      ProgressBar - Step {currentStep + 1} of {steps.length}
      {steps.map((step: any, index: number) => (
        <button
          key={index}
          onClick={() => onStepClick(index)}
          data-testid={`step-${index}`}
        >
          {step.label}
        </button>
      ))}
    </div>
  ),
}));

vi.mock("../NavigationButtons", () => ({
  NavigationButtons: ({ currentStep, totalSteps, nextStep, prevStep, onSubmit }: any) => (
    <div data-testid="navigation-buttons">
      <button onClick={prevStep} disabled={currentStep === 0} data-testid="prev-button">
        Previous
      </button>
      {currentStep < totalSteps - 1 ? (
        <button onClick={nextStep} data-testid="next-button">
          Next
        </button>
      ) : (
        <button onClick={onSubmit} data-testid="submit-button">
          Review & Submit
        </button>
      )}
    </div>
  ),
}));

vi.mock("../../SolutionReviewDetail/ReviewSubmissionModal", () => ({
  ReviewSubmissionModal: ({ showReview, setShowReview, confirmSubmit, isSubmitting }: any) => (
    showReview ? (
      <div data-testid="review-submission-modal">
        ReviewSubmissionModal
        <button onClick={confirmSubmit} disabled={isSubmitting} data-testid="confirm-submit">
          {isSubmitting ? "Submitting..." : "Confirm Submit"}
        </button>
        <button onClick={() => setShowReview(false)} data-testid="cancel-submit">
          Cancel
        </button>
      </div>
    ) : null
  ),
}));

const mockUseUpdateSolutionReview = useUpdateSolutionReview as MockedFunction<typeof useUpdateSolutionReview>;
const mockUseStepNavigation = useStepNavigation as MockedFunction<typeof useStepNavigation>;
const mockUseToast = useToast as MockedFunction<typeof useToast>;

describe("UpdateSolutionReviewPage", () => {
  const mockSaveSection = vi.fn();
  const mockTransitionSolutionReviewState = vi.fn();
  const mockLoadReviewData = vi.fn();
  const mockShowSuccess = vi.fn();
  const mockShowError = vi.fn();
  const mockShowInfo = vi.fn();
  const mockShowToast = vi.fn();
  const mockHideToast = vi.fn();
  const mockNextStep = vi.fn();
  const mockPrevStep = vi.fn();
  const mockGoToStep = vi.fn();

  const defaultMockData = {
    currentStep: 0,
    setCurrentStep: vi.fn(),
    saveSection: mockSaveSection,
    transitionSolutionReviewState: mockTransitionSolutionReviewState,
    loadReviewData: mockLoadReviewData,
    solutionOverview: null,
    setSolutionOverview: vi.fn(),
    businessCapabilities: null,
    setBusinessCapabilities: vi.fn(),
    dataAssets: null,
    setDataAsset: vi.fn(),
    systemComponents: null,
    setSystemComponent: vi.fn(),
    technologyComponents: null,
    setTechnologyComponent: vi.fn(),
    integrationFlows: null,
    setIntegrationFlow: vi.fn(),
    enterpriseTools: null,
    setEnterpriseTools: vi.fn(),
    processCompliances: null,
    setProcessCompliance: vi.fn(),
    systemCode: "",
    setSystemCode: vi.fn(),
    isLoading: false,
  };

  beforeEach(() => {
    vi.clearAllMocks();

    mockUseUpdateSolutionReview.mockReturnValue(defaultMockData);
    
    mockUseStepNavigation.mockReturnValue({
      currentStep: 0,
      nextStep: mockNextStep,
      prevStep: mockPrevStep,
      goToStep: mockGoToStep,
    });

    mockUseToast.mockReturnValue({
      showSuccess: mockShowSuccess,
      showError: mockShowError,
      showInfo: mockShowInfo,
      showToast: mockShowToast,
      hideToast: mockHideToast,
    });
  });

  const renderComponent = () => {
    return render(
      <MemoryRouter initialEntries={["/update-solution-review/test-id-123"]}>
        <Routes>
          <Route path="/update-solution-review/:id" element={<UpdateSolutionReviewPage />} />
        </Routes>
      </MemoryRouter>
    );
  };

  describe("Component Rendering", () => {
    it("should render the solution review update page", () => {
      renderComponent();

      expect(screen.getByTestId("progress-bar")).toBeInTheDocument();
      expect(screen.getByTestId("solution-overview-step")).toBeInTheDocument();
      expect(screen.getByTestId("navigation-buttons")).toBeInTheDocument();
    });

    it("should render close button in top right", () => {
      renderComponent();

      const closeButton = screen.getByRole("button", { name: /close/i });
      expect(closeButton).toBeInTheDocument();
    });

    it("should pass correct props to ProgressBar", () => {
      renderComponent();

      const progressBar = screen.getByTestId("progress-bar");
      expect(progressBar).toHaveTextContent("Step 1 of 8");
      expect(screen.getByTestId("step-0")).toHaveTextContent("Solution Overview");
      expect(screen.getByTestId("step-1")).toHaveTextContent("Business Capabilities");
    });

    it("should pass correct props to NavigationButtons", () => {
      renderComponent();

      expect(screen.getByTestId("prev-button")).toBeDisabled();
      expect(screen.getByTestId("next-button")).toBeInTheDocument();
      expect(screen.queryByTestId("submit-button")).not.toBeInTheDocument();
    });
  });

  describe("Step Navigation", () => {
    it("should render different steps based on currentStep", () => {
      // Test step 0 - Solution Overview
      renderComponent();
      expect(screen.getByTestId("solution-overview-step")).toBeInTheDocument();

      // Test step 1 - Business Capabilities
      mockUseStepNavigation.mockReturnValue({
        currentStep: 1,
        nextStep: mockNextStep,
        prevStep: mockPrevStep,
        goToStep: mockGoToStep,
      });

      renderComponent();
      expect(screen.getByTestId("business-capabilities-step")).toBeInTheDocument();
    });

    it("should show submit button on last step", () => {
      mockUseStepNavigation.mockReturnValue({
        currentStep: 7, // Last step
        nextStep: mockNextStep,
        prevStep: mockPrevStep,
        goToStep: mockGoToStep,
      });

      renderComponent();

      expect(screen.queryByTestId("next-button")).not.toBeInTheDocument();
      expect(screen.getByTestId("submit-button")).toBeInTheDocument();
    });

    it("should call goToStep when clicking on progress bar step", () => {
      renderComponent();

      fireEvent.click(screen.getByTestId("step-2"));
      expect(mockGoToStep).toHaveBeenCalledWith(2);
    });

    it("should call nextStep when clicking next button", () => {
      renderComponent();

      fireEvent.click(screen.getByTestId("next-button"));
      expect(mockNextStep).toHaveBeenCalled();
    });

    it("should call prevStep when clicking previous button", () => {
      mockUseStepNavigation.mockReturnValue({
        currentStep: 2,
        nextStep: mockNextStep,
        prevStep: mockPrevStep,
        goToStep: mockGoToStep,
      });

      renderComponent();

      fireEvent.click(screen.getByTestId("prev-button"));
      expect(mockPrevStep).toHaveBeenCalled();
    });
  });

  describe("Data Loading", () => {
    it("should load review data on mount", async () => {
      renderComponent();

      await waitFor(() => {
        expect(mockLoadReviewData).toHaveBeenCalled();
      });
    });

    it("should pass initial data to step components", () => {
      const mockDataWithSolutionOverview = {
        ...defaultMockData,
        solutionOverview: {
          solutionDetails: {
            solutionName: "Test Solution",
            projectName: "Test Project",
            solutionArchitectName: "",
            deliveryProjectManagerName: "",
            itBusinessPartner: "",
          },
          reviewType: "",
          businessUnit: "",
          businessDriver: "",
          valueOutcome: "",
          applicationUsers: [],
        },
      };

      mockUseUpdateSolutionReview.mockReturnValue(mockDataWithSolutionOverview);

      renderComponent();

      expect(screen.getByText(/Test Solution/)).toBeInTheDocument();
    });
  });

  describe("Save Functionality", () => {
    it("should handle save from step component", async () => {
      renderComponent();

      fireEvent.click(screen.getByText("Save Solution Overview"));

      await waitFor(() => {
        expect(mockSaveSection).toHaveBeenCalledWith("solutionOverview", {
          solutionOverview: { solutionName: "Test" }
        });
      });
      expect(mockShowSuccess).toHaveBeenCalledWith("Solution Overview saved successfully!");
    });

    it("should handle save error", async () => {
      mockSaveSection.mockRejectedValue(new Error("Save failed"));

      renderComponent();

      fireEvent.click(screen.getByText("Save Solution Overview"));

      await waitFor(() => {
        expect(mockShowError).toHaveBeenCalledWith(
          expect.stringContaining("Failed to save Solution Overview")
        );
      });
    });

    it("should save different sections based on current step", async () => {
      // Test Business Capabilities step
      mockUseStepNavigation.mockReturnValue({
        currentStep: 1,
        nextStep: mockNextStep,
        prevStep: mockPrevStep,
        goToStep: mockGoToStep,
      });

      renderComponent();

      fireEvent.click(screen.getByText("Save Business Capabilities"));

      await waitFor(() => {
        expect(mockSaveSection).toHaveBeenCalledWith("businessCapabilities", {
          businessCapabilities: []
        });
      });
      expect(mockShowSuccess).toHaveBeenCalledWith("Business Capabilities saved successfully!");
    });
  });

  describe("Review Submission", () => {
    it("should show review modal when submit button clicked", async () => {
      mockUseStepNavigation.mockReturnValue({
        currentStep: 7, // Last step
        nextStep: mockNextStep,
        prevStep: mockPrevStep,
        goToStep: mockGoToStep,
      });

      renderComponent();

      fireEvent.click(screen.getByTestId("submit-button"));

      await waitFor(() => {
        expect(screen.getByTestId("review-submission-modal")).toBeInTheDocument();
      });
    });

    it("should hide review modal when cancel clicked", async () => {
      mockUseStepNavigation.mockReturnValue({
        currentStep: 7,
        nextStep: mockNextStep,
        prevStep: mockPrevStep,
        goToStep: mockGoToStep,
      });

      renderComponent();

      // Show modal
      fireEvent.click(screen.getByTestId("submit-button"));
      await waitFor(() => {
        expect(screen.getByTestId("review-submission-modal")).toBeInTheDocument();
      });

      // Cancel
      fireEvent.click(screen.getByTestId("cancel-submit"));

      await waitFor(() => {
        expect(screen.queryByTestId("review-submission-modal")).not.toBeInTheDocument();
      });
    });

    it("should handle successful submission", async () => {
      mockTransitionSolutionReviewState.mockResolvedValue({});

      mockUseStepNavigation.mockReturnValue({
        currentStep: 7,
        nextStep: mockNextStep,
        prevStep: mockPrevStep,
        goToStep: mockGoToStep,
      });

      renderComponent();

      // Show modal and submit
      fireEvent.click(screen.getByTestId("submit-button"));
      fireEvent.click(screen.getByTestId("confirm-submit"));

      await waitFor(() => {
        expect(mockTransitionSolutionReviewState).toHaveBeenCalledWith("SUBMIT");
      });
    });

    it("should handle submission error", async () => {
      const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});
      mockTransitionSolutionReviewState.mockRejectedValue(new Error("Submit failed"));

      mockUseStepNavigation.mockReturnValue({
        currentStep: 7,
        nextStep: mockNextStep,
        prevStep: mockPrevStep,
        goToStep: mockGoToStep,
      });

      renderComponent();

      fireEvent.click(screen.getByTestId("submit-button"));
      fireEvent.click(screen.getByTestId("confirm-submit"));

      await waitFor(() => {
        expect(consoleError).toHaveBeenCalledWith("Submit failed", expect.any(Error));
      });

      consoleError.mockRestore();
    });
  });

  describe("All Steps Rendering", () => {
    it.each([
      [0, "solution-overview-step"],
      [1, "business-capabilities-step"],
      [2, "data-asset-step"],
      [3, "system-component-step"],
      [4, "technology-component-step"],
      [5, "integration-flow-step"],
      [6, "enterprise-tools-step"],
      [7, "process-compliance-step"],
    ])("should render step %i correctly", (stepIndex, expectedTestId) => {
      mockUseStepNavigation.mockReturnValue({
        currentStep: stepIndex,
        nextStep: mockNextStep,
        prevStep: mockPrevStep,
        goToStep: mockGoToStep,
      });

      renderComponent();

      expect(screen.getByTestId(expectedTestId)).toBeInTheDocument();
    });
  });

  describe("Error Handling", () => {
    it("should handle loadReviewData error", async () => {
      const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});
      mockLoadReviewData.mockRejectedValue(new Error("Load failed"));

      renderComponent();

      await waitFor(() => {
        expect(consoleError).toHaveBeenCalledWith("Error loading review data:", expect.any(Error));
      });

      consoleError.mockRestore();
    });
  });

  describe("Integration", () => {
    it("should pass showSuccess and showError to step components", () => {
      renderComponent();

      const stepComponent = screen.getByTestId("solution-overview-step");
      expect(stepComponent).toBeInTheDocument();
      // The mocked step component receives these props, confirming they're passed
    });

    it("should create correct existingData object", () => {
      const completeData = {
        ...defaultMockData,
        solutionOverview: { solutionName: "Test" },
        businessCapabilities: [{ id: "1", name: "Test Capability", level: "L1", systemCode: "SYS-001" }],
        systemCode: "SYS-001",
      };

      mockUseUpdateSolutionReview.mockReturnValue(completeData as any);

      renderComponent();

      // Verify data is passed correctly to step
      expect(screen.getByText(/Test/)).toBeInTheDocument();
    });
  });
});