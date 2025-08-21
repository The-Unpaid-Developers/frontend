import React, { useState } from 'react';
import { Button, Input } from '../../ui';
import { useCreateSolutionReview } from '../../../hooks/useCreateSolutionReview';
import type { StepProps } from './StepProps';
// type StepProps = {
//   onSave: (data: any) => Promise<void> | void;
//   isSaving?: boolean;
//   initialData?: any;
// };

const BusinessCapabilitiesStep: React.FC<StepProps> = ({ onSave, isSaving = false, initialData }) => {
  const { businessCapabilities, setBusinessCapabilities } = useCreateSolutionReview();
  const [inputValue, setInputValue] = useState(businessCapabilities || '');

  const [error, setError] = useState<string | null>(null);
  // const handleSave = () => {
  //   setBusinessCapabilities(inputValue);
  //   // Call the API to save the business capabilities
  //   // Example: saveBusinessCapabilities(inputValue);
  // };
  const handleSave = async () => {
    console.log('hi');
    setError(null);
    const payload = { businessCapabilities /* add other fields here */ };
    try {
      await onSave(payload); // calls CreateSolutionReviewPage.handleSave
    } catch (e) {
      setError(e instanceof Error ? e.message : "Save failed");
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Business Capabilities</h2>
      <Input
        placeholder="Enter business capabilities..."
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

export default BusinessCapabilitiesStep;