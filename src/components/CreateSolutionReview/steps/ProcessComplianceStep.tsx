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

// const ProcessComplianceStep: React.FC<StepProps> = ({ onSave, isSaving = false, initialData }) => {
//   const { processCompliance, setProcessCompliance } = useCreateSolutionReview();
//   const [inputValue, setInputValue] = useState(processCompliance || '');

//   const [error, setError] = useState<string | null>(null);
//   // const handleSave = () => {
//   //   setProcessCompliance(inputValue);
//   //   // Call the API to save the business capabilities
//   //   // Example: saveProcessCompliance(inputValue);
//   // };
//   const handleSave = async () => {
//     console.log('hi');
//     setError(null);
//     const payload = { processCompliance /* add other fields here */ };
//     try {
//       await onSave(payload); // calls CreateSolutionReviewPage.handleSave
//     } catch (e) {
//       setError(e instanceof Error ? e.message : "Save failed");
//     }
//   };

//   return (
//     <div className="p-6 bg-white rounded-lg shadow-md">
//       <h2 className="text-xl font-semibold mb-4">Technology Component</h2>
//       <Input
//         placeholder="Enter technology components..."
//         value={inputValue}
//         onChange={(e) => setInputValue(e.target.value)}
//         className="mb-4"
//       />
//       <Button onClick={handleSave} className="mt-2">
//         Save
//       </Button>
//     </div>
//   );
// };

// export default ProcessComplianceStep;

import type { ProcessCompliance } from '../../../types/createSolutionReview';

const empty: ProcessCompliance = { standardGuideline:'', compliant:'', description:'' };

const ProcessComplianceStep: React.FC<StepProps> = ({ onSave, isSaving=false, initialData }) => {
  const initial: ProcessCompliance[] = initialData?.processCompliance ?? [];
  const [list,setList]=useState<ProcessCompliance[]>(initial);
  const [row,setRow]=useState<ProcessCompliance>(empty);
  const update=(k:keyof ProcessCompliance,v:string)=>setRow(r=>({...r,[k]:v}));
  const add=()=>{ if(!row.standardGuideline) return; setList(l=>[...l,row]); setRow(empty); };
  const save=async()=>{ await onSave(list); };
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Process Compliance</h2>
      <div className="grid md:grid-cols-3 gap-3">
        <Input placeholder="Standard / Guideline" value={row.standardGuideline} onChange={e=>update('standardGuideline',e.target.value)} />
        <Input placeholder="Compliant" value={row.compliant} onChange={e=>update('compliant',e.target.value)} />
        <Input placeholder="Description" value={row.description} onChange={e=>update('description',e.target.value)} />
      </div>
      <div className="flex gap-2">
        <Button onClick={add}>Add</Button>
        <Button disabled={isSaving} onClick={save}>{isSaving?'Saving...':'Save & Next'}</Button>
      </div>
      {list.length>0 && (
        <ul className="text-sm space-y-1">
          {list.map((p,i)=><li key={i} className="bg-gray-50 px-3 py-2 rounded">{p.standardGuideline} - {p.compliant}</li>)}
        </ul>
      )}
    </div>
  );
};

export default ProcessComplianceStep;