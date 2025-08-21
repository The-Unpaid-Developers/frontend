// import React, { useState } from "react";
// import { Button, Input } from "../../ui";
// import { useCreateSolutionReview } from "../../../hooks/useCreateSolutionReview";

// const SolutionOverviewStep: React.FC = () => {
//   const { solutionOverview, setSolutionOverview } = useCreateSolutionReview();
//   const [localOverview, setLocalOverview] = useState(solutionOverview || "");

//   const handleSave = () => {
//     setSolutionOverview(localOverview);
//     // Call the API to save the solution overview
//     // await saveSolutionOverview(localOverview);
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

const SolutionOverviewStep: React.FC<StepProps> = ({ onSave, isSaving = false, initialData }) => {
  const { solutionOverview, setSolutionOverview } = useCreateSolutionReview();
  const [inputValue, setInputValue] = useState(solutionOverview || '');

  const [error, setError] = useState<string | null>(null);
  // const handleSave = () => {
  //   setSolutionOverview(inputValue);
  //   // Call the API to save the business capabilities
  //   // Example: saveSolutionOverview(inputValue);
  // };
  const handleSave = async () => {
    console.log('hi');
    setError(null);
    const payload = { solutionOverview /* add other fields here */ };
    try {
      await onSave(payload); // calls CreateSolutionReviewPage.handleSave
    } catch (e) {
      setError(e instanceof Error ? e.message : "Save failed");
    }
  };
  
  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Solution Overview</h2>
      <Input
        placeholder="Enter solution overview..."
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        className="w-full mb-4"
        multiline
      />
      <Button onClick={handleSave} className="mt-2">
        Save
      </Button>
    </div>
  );
};

export default SolutionOverviewStep;