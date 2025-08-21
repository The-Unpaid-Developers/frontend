// import React, { useState } from 'react';
// import { useCreateSolutionReview } from '../../../hooks/useCreateSolutionReview';
// import { Button, Input } from '../../ui';

// const EnterpriseToolsStep: React.FC = () => {
//   const { enterpriseTools, setEnterpriseTools } = useCreateSolutionReview();
//   const [localEnterpriseTools, setLocalEnterpriseTools] = useState(enterpriseTools || '');

//   const handleSave = async () => {
//     await setEnterpriseTools(localEnterpriseTools);
//   };
import React, { useState } from 'react';
import { Button, Input } from '../../ui';
import { useCreateSolutionReview } from '../../../hooks/useCreateSolutionReview';
import type { StepProps } from './StepProps';

const EnterpriseToolsStep: React.FC<StepProps> = ({ onSave, isSaving = false, initialData }) => {
  const { enterpriseTools, setEnterpriseTools } = useCreateSolutionReview();
  const [inputValue, setInputValue] = useState(enterpriseTools || '');

  const [error, setError] = useState<string | null>(null);
  // const handleSave = () => {
  //   setEnterpriseTools(inputValue);
  //   // Call the API to save the business capabilities
  //   // Example: saveEnterpriseTools(inputValue);
  // };
  const handleSave = async () => {
    console.log('hi');
    setError(null);
    const payload = { enterpriseTools /* add other fields here */ };
    try {
      await onSave(payload); // calls CreateSolutionReviewPage.handleSave
    } catch (e) {
      setError(e instanceof Error ? e.message : "Save failed");
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Enterprise Tools</h2>
      <Input
        placeholder="Enter enterprise tools used..."
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

export default EnterpriseToolsStep;