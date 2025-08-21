// import React, { useState } from "react";
// import { Button, Input } from "../../ui";
// import { useCreateSolutionReview } from "../../../hooks/useCreateSolutionReview";

// const DataAssetStep: React.FC = () => {
//   const { data, setData } = useCreateSolutionReview();
//   const [dataAsset, setDataAsset] = useState(data.dataAsset || "");

//   const handleSave = () => {
//     setData((prevData) => ({ ...prevData, dataAsset }));
//     // Call the API to save the data asset
//     // Example: saveDataAsset(dataAsset);
//   };

//   return (
//     <div>
//       <h2 className="text-xl font-bold mb-4">Data Asset</h2>
//       <Input
//         placeholder="Enter data asset information..."
//         value={dataAsset}
//         onChange={(e) => setDataAsset(e.target.value)}
//         className="w-full mb-4"
//       />
//       <Button onClick={handleSave} className="mt-2">
//         Save Data Asset
//       </Button>
//     </div>
//   );
// };

// export default DataAssetStep;

import React, { useState } from 'react';
import { Button, Input } from '../../ui';
import { useCreateSolutionReview } from '../../../hooks/useCreateSolutionReview';
import type { StepProps } from './StepProps';
// type StepProps = {
//   onSave: (data: any) => Promise<void> | void;
//   isSaving?: boolean;
//   initialData?: any;
// };

const DataAssetStep: React.FC<StepProps> = ({ onSave, isSaving = false, initialData }) => {
  const { dataAsset, setDataAsset } = useCreateSolutionReview();
  const [inputValue, setInputValue] = useState(dataAsset || '');

  const [error, setError] = useState<string | null>(null);
  // const handleSave = () => {
  //   setDataAsset(inputValue);
  //   // Call the API to save the business capabilities
  //   // Example: saveDataAsset(inputValue);
  // };
  const handleSave = async () => {
    console.log('hi');
    setError(null);
    const payload = { dataAsset /* add other fields here */ };
    try {
      await onSave(payload); // calls CreateSolutionReviewPage.handleSave
    } catch (e) {
      setError(e instanceof Error ? e.message : "Save failed");
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Data Asset</h2>
      <Input
        placeholder="Enter data assets..."
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

export default DataAssetStep;