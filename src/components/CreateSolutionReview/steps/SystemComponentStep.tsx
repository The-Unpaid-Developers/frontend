// import React, { useState } from 'react';
// import { useCreateSolutionReview } from '../../../hooks/useCreateSolutionReview';
// import { Button, Input } from '../../ui';

// const SystemComponentStep: React.FC = () => {
//   const { systemComponentData, saveSystemComponent } = useCreateSolutionReview();
//   const [systemComponent, setSystemComponent] = useState(systemComponentData || '');

//   const handleSave = async () => {
//     await saveSystemComponent(systemComponent);
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

const SystemComponentStep: React.FC<StepProps> = ({ onSave, isSaving = false, initialData }) => {
  const { systemComponent, setSystemComponent } = useCreateSolutionReview();
  const [inputValue, setInputValue] = useState(systemComponent || '');

  const [error, setError] = useState<string | null>(null);
  // const handleSave = () => {
  //   setSystemComponent(inputValue);
  //   // Call the API to save the business capabilities
  //   // Example: saveSystemComponent(inputValue);
  // };
  const handleSave = async () => {
    console.log('hi');
    setError(null);
    const payload = { systemComponent /* add other fields here */ };
    try {
      await onSave(payload); // calls CreateSolutionReviewPage.handleSave
    } catch (e) {
      setError(e instanceof Error ? e.message : "Save failed");
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">System Component</h2>
      <Input
        placeholder="Enter system component details..."
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

export default SystemComponentStep;