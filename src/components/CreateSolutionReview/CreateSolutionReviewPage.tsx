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
import { Modal, Button } from '../ui';
import { submitSolutionReviewDraft } from '../../services/solutionReviewApi';

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

const emptyData: CreateSolutionReviewData = {
  solutionOverview: null,
  businessCapabilities: null,
  dataAsset: null,
  systemComponent: null,
  technologyComponent: null,
  integrationFlow: null,
  enterpriseTools: null,
  processCompliance: null,
};

export const CreateSolutionReviewPage: React.FC = () => {
  // const [currentStep, setCurrentStep] = useState(0);
  // const { saveSection } = useCreateSolutionReview();
  // const { nextStep, prevStep } = useStepNavigation(currentStep, setCurrentStep, steps.length);
  const { currentStep, nextStep, prevStep, goToStep } = useStepNavigation(steps.length);
  const [createData, setCreateData] = useState<CreateSolutionReviewData>(emptyData);
  const [showReview, setShowReview] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    saveSection,
  } = useCreateSolutionReview();

  const StepComponent = steps[currentStep];

  // const handleSave = async (data: any) => {
  //   await saveSection(currentStep, data);
  //   nextStep();
  // };
  const handleSave = (data: any) => {
    // setIsSaving(true);
    try {
      const sectionKey = stepMeta[currentStep].key as keyof CreateSolutionReviewData;
      // persist in lifted state
      setCreateData(prev => ({ ...prev, [sectionKey]: data }));
      const systemCode = 'TEST'; // TODO: replace with actual system code from context or props
      saveSection(sectionKey, data, systemCode);
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
    setShowReview(true); // open review modal instead of immediate submit

  };

  const sectionLabels: Record<keyof CreateSolutionReviewData,string> = {
    solutionOverview: 'Solution Overview',
    businessCapabilities: 'Business Capabilities',
    dataAsset: 'Data & Assets',
    systemComponent: 'System Components',
    technologyComponent: 'Technology Components',
    integrationFlow: 'Integration Flow',
    enterpriseTools: 'Enterprise Tools',
    processCompliance: 'Process Compliance'
  };

  const missingSections = Object.entries(createData)
    .filter(([_, v]) => v == null)
    .map(([k]) => sectionLabels[k as keyof CreateSolutionReviewData]);

  const hasMissing = missingSections.length > 0;

  const confirmSubmit = async () => {
    if (hasMissing) return;
    try {
      setIsSubmitting(true);
      // TODO: ensure you have a real draft id. If saveSection returns id, capture it there.
      // if (!draftId) {
      //   console.warn('No draftId available, cannot call submitSolutionReviewDraft yet.');
      //   // Optionally first create combined draft via saveSolutionReview(createData)
      //   // const { id } = await saveSolutionReview(createData);
      //   // setDraftId(id);
      //   // await submitSolutionReviewDraft(id);
      //   setIsSubmitting(false);
      //   return;
      // }
      await submitSolutionReviewDraft('draftId');
      setShowReview(false);
      // Optionally navigate away or show success toast
    } catch (e) {
      console.error('Submit failed', e);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6">
      
      <h1 className="text-2xl font-bold mb-4">Create Solution Review</h1>
      {/* <ProgressBar currentStep={currentStep} totalSteps={steps.length} /> */}
      <ProgressBar currentStep={currentStep} steps={stepMeta} onStepClick={goToStep} />
      <div className="mt-4">
        <StepComponent onSave={handleSave} initialData={createData}/>
      </div>
      <NavigationButtons
        currentStep={currentStep}
        totalSteps={steps.length}
        nextStep={nextStep}
        prevStep={prevStep}
        onSubmit={currentStep === steps.length - 1 ? handleSubmit : undefined}
      />
    {showReview && (
        <Modal isOpen={showReview} onClose={()=>!isSubmitting && setShowReview(false)} title="Review Solution Review">
          <div className="max-h-[60vh] overflow-y-auto space-y-4 text-sm">
            { (Object.keys(createData) as (keyof CreateSolutionReviewData)[]).map(key => {
              const value = createData[key];
              return (
                <div key={key} className="border rounded p-3">
                  <h3 className="font-semibold mb-2">{sectionLabels[key]}</h3>
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
                        const idx = stepMeta.findIndex(s => s.key === key);
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
              Complete all sections before submitting. Missing: {missingSections.join(', ')}
            </div>
          )}

            <div className="mt-6 flex justify-end gap-2">
              <Button variant="secondary" disabled={isSubmitting} onClick={()=>setShowReview(false)}>
                Cancel
              </Button>
              <Button disabled={hasMissing || isSubmitting} onClick={confirmSubmit}>
                {isSubmitting ? 'Submitting...' : 'Confirm Submit'}
              </Button>
            </div>
        </Modal>
      )}
    </div>
  );
};