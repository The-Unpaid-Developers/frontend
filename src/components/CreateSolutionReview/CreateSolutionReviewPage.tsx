import React, { useState } from 'react';
import { ProgressBar } from './ProgressBar';
import { NavigationButtons } from './NavigationButtons';
// import { BusinessCapabilitiesStep } from './steps/BusinessCapabilitiesStep';
// import { DataAssetStep } from './steps/DataAssetStep';
// import { EnterpriseToolsStep } from './steps/EnterpriseToolsStep';
// import { IntegrationFlowStep } from './steps/IntegrationFlowStep';
// import { SolutionOverviewStep } from './steps/SolutionOverviewStep';
// import { SystemComponentStep } from './steps/SystemComponentStep';
// import { TechnologyComponentStep } from './steps/TechnologyComponentStep';
import BusinessCapabilitiesStep from './steps/BusinessCapabilitiesStep';
import DataAssetStep from './steps/DataAssetStep';
import EnterpriseToolsStep from './steps/EnterpriseToolsStep';
import IntegrationFlowStep from './steps/IntegrationFlowStep';
import SolutionOverviewStep from './steps/SolutionOverviewStep';
import SystemComponentStep from './steps/SystemComponentStep';
import TechnologyComponentStep from './steps/TechnologyComponentStep';
import ProcessComplianceStep from './steps/ProcessComplianceStep';
import { useCreateSolutionReview } from '../../hooks/useCreateSolutionReview';
import useStepNavigation from '../../hooks/useStepNavigation';
import type { CreateSolutionReviewData } from '../../types/createSolutionReview';

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
    { key: 'solutionOverview', label: 'Solution Overview' },
    { key: 'businessCapabilities', label: 'Business Capabilities' },
    { key: 'dataAsset', label: 'Data and Assets' },
    { key: 'systemComponent', label: 'System Components' },
    { key: 'technologyComponent', label: 'Technology Components' },
    { key: 'integrationFlow', label: 'Integration Flow' },
    { key: 'enterpriseTools', label: 'Enterprise Tools' },
    { key: 'processCompliance', label: 'Process Compliance' },
  ];

export const CreateSolutionReviewPage: React.FC = () => {
  // const [currentStep, setCurrentStep] = useState(0);
  // const { saveSection } = useCreateSolutionReview();
  // const { nextStep, prevStep } = useStepNavigation(currentStep, setCurrentStep, steps.length);
  const { currentStep, nextStep, prevStep, goToStep } = useStepNavigation(steps.length);

  const {
    saveSection,
    setBusinessCapabilities,
    setDataAsset,
    setEnterpriseTools,
    setIntegrationFlow,
    setSolutionOverview,
    setSystemComponent,
    setTechnologyComponent,
    setProcessCompliance,
  } = useCreateSolutionReview();

  const StepComponent = steps[currentStep];

  // const handleSave = async (data: any) => {
  //   await saveSection(currentStep, data);
  //   nextStep();
  // };
  const handleSave = async (data: any) => {
    // setIsSaving(true);
    try {
      const sectionKey = stepMeta[currentStep].key as keyof CreateSolutionReviewData;
      // update the create-hook state for this section
      switch (sectionKey) {
        case "businessCapabilities":
          setBusinessCapabilities(data);
          break;
        case "dataAsset":
          setDataAsset(data);
          break;
        case "enterpriseTools":
          setEnterpriseTools(data);
          break;
        case "integrationFlow":
          setIntegrationFlow(data);
          break;
        case "solutionOverview":
          setSolutionOverview(data);
          break;
        case "systemComponent":
          setSystemComponent(data);
          break;
        case "technologyComponent":
          setTechnologyComponent(data);
          break;
        case "processCompliance":
          setProcessCompliance(data);
          break;
        default:
          throw new Error("Unknown section");
      }
      // call unified save (posts payload with this section populated, others empty)
      await saveSection(sectionKey);
      // advance only after successful save
      nextStep();
    } catch (err) {
      console.error("Save failed", err);
      // show toast / error UI here if you have one
    } finally {
      // setIsSaving(false);
    }
  };

  // optional: handle final submit (replace console.log with actual submit)
  const handleSubmit = async () => {
    // TODO: replace with actual final submit logic (e.g. gather create context data and call API)
    console.log("Submit clicked - implement final submission here");
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Create Solution Review</h1>
      {/* <ProgressBar currentStep={currentStep} totalSteps={steps.length} /> */}
      <ProgressBar currentStep={currentStep} steps={stepMeta} onStepClick={goToStep} />
      <div className="mt-4">
        <StepComponent onSave={handleSave} />
      </div>
      <NavigationButtons
        currentStep={currentStep}
        totalSteps={steps.length}
        nextStep={nextStep}
        prevStep={prevStep}
        onSubmit={currentStep === steps.length - 1 ? handleSubmit : undefined}
      />
    </div>
  );
};