// import React, { useState } from "react";
// import { useCreateSolutionReview } from "../../../hooks/useCreateSolutionReview";
// import { Button, Input } from "../../ui";

// const IntegrationFlowStep: React.FC = () => {
//   const { integrationFlowData, setIntegrationFlowData, saveIntegrationFlow } = useCreateSolutionReview();
//   const [localData, setLocalData] = useState(integrationFlowData || "");

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setLocalData(e.target.value);
//   };

//   const handleSave = () => {
//     setIntegrationFlowData(localData);
//     saveIntegrationFlow(localData);
//   };
import React, { useState } from 'react';
import { Button, Input } from '../../ui';
import { useCreateSolutionReview } from '../../../hooks/useCreateSolutionReview';
import type { StepProps } from './StepProps';
// type StepProps = {
//   onSave: (data: any) => Promise<void> | void;
//   isSaving?: boolean;
//   initialData?: any;
// };

const IntegrationFlowStep: React.FC<StepProps> = ({ onSave, isSaving = false, initialData }) => {
  const { integrationFlow, setIntegrationFlow } = useCreateSolutionReview();
  const [inputValue, setInputValue] = useState(integrationFlow || '');

  const [error, setError] = useState<string | null>(null);
  // const handleSave = () => {
  //   setIntegrationFlow(inputValue);
  //   // Call the API to save the business capabilities
  //   // Example: saveIntegrationFlow(inputValue);
  // };
  const handleSave = async () => {
    console.log('hi');
    setError(null);
    const payload = { integrationFlow /* add other fields here */ };
    try {
      await onSave(payload); // calls CreateSolutionReviewPage.handleSave
    } catch (e) {
      setError(e instanceof Error ? e.message : "Save failed");
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Integration Flow</h2>
      <Input
        placeholder="Describe the integration flow..."
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        className="w-full mb-4"
      />
      <Button onClick={handleSave} className="mt-2">
        Save
      </Button>
    </div>
  );
};

export default IntegrationFlowStep;