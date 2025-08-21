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
import { useCreateSolutionReview } from '../../hooks/useCreateSolutionReview';
import useStepNavigation from '../../hooks/useStepNavigation';

const steps = [
  SolutionOverviewStep,
  BusinessCapabilitiesStep,
  DataAssetStep,
  SystemComponentStep,
  TechnologyComponentStep,
  IntegrationFlowStep,
  EnterpriseToolsStep,
];

const stepMeta = [
    { key: 'solutionOverview', label: 'Solution Overview' },
    { key: 'businessCapabilities', label: 'Business Capabilities' },
    { key: 'dataAsset', label: 'Data & Assets' },
    { key: 'systemComponent', label: 'System Components' },
    { key: 'technologyComponent', label: 'Technology Components' },
    { key: 'integrationFlow', label: 'Integration Flow' },
    { key: 'enterpriseTools', label: 'Enterprise Tools' },
  ];

export const CreateSolutionReviewPage: React.FC = () => {
  // const [currentStep, setCurrentStep] = useState(0);
  const { saveSectionData } = useCreateSolutionReview();
  // const { nextStep, prevStep } = useStepNavigation(currentStep, setCurrentStep, steps.length);
  const { currentStep, nextStep, prevStep, goToStep } = useStepNavigation(steps.length);

  const StepComponent = steps[currentStep];

  const handleSave = async (data: any) => {
    await saveSectionData(currentStep, data);
    nextStep();
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
        nextStep={nextStep}
        prevStep={prevStep}
        onSubmit={currentStep === steps.length - 1 ? handleSubmit : undefined}
      />
    </div>
  );
};