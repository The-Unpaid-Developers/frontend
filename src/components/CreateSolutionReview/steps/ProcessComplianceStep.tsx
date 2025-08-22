// import React, { useState } from 'react';
// import { useCreateSolutionReview } from '../../../hooks/useCreateSolutionReview';
// import { Button, Input } from '../../ui';

// const ProcessComplianceStep: React.FC = () => {
//   const { processCompliance, setProcessCompliance, saveProcessCompliance } = useCreateSolutionReview();
//   const [isSaving, setIsSaving] = useState(false);

//   const handleSave = async () => {
//     setIsSaving(true);
//     await saveProcessCompliance(processCompliance);
//     setIsSaving(false);
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

const ProcessComplianceStep: React.FC<StepProps> = ({ onSave, isSaving = false, initialData }) => {
  const { processCompliance, setProcessCompliance } = useCreateSolutionReview();
  const [inputValue, setInputValue] = useState(processCompliance || '');

  const [error, setError] = useState<string | null>(null);
  // const handleSave = () => {
  //   setProcessCompliance(inputValue);
  //   // Call the API to save the business capabilities
  //   // Example: saveProcessCompliance(inputValue);
  // };
  const handleSave = async () => {
    console.log('hi');
    setError(null);
    const payload = { processCompliance /* add other fields here */ };
    try {
      await onSave(payload); // calls CreateSolutionReviewPage.handleSave
    } catch (e) {
      setError(e instanceof Error ? e.message : "Save failed");
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Technology Component</h2>
      <Input
        placeholder="Enter technology components..."
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        className="mb-4"
      />
      <Button onClick={handleSave} className="mt-2">
        Save
      </Button>
    </div>
  );
};

export default ProcessComplianceStep;