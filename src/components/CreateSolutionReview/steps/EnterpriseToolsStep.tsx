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

// const EnterpriseToolsStep: React.FC<StepProps> = ({ onSave, isSaving = false, initialData }) => {
//   const { enterpriseTools, setEnterpriseTools } = useCreateSolutionReview();
//   const [inputValue, setInputValue] = useState(enterpriseTools || '');

//   const [error, setError] = useState<string | null>(null);
//   // const handleSave = () => {
//   //   setEnterpriseTools(inputValue);
//   //   // Call the API to save the business capabilities
//   //   // Example: saveEnterpriseTools(inputValue);
//   // };
//   const handleSave = async () => {
//     console.log('hi');
//     setError(null);
//     const payload = { enterpriseTools /* add other fields here */ };
//     try {
//       await onSave(payload); // calls CreateSolutionReviewPage.handleSave
//     } catch (e) {
//       setError(e instanceof Error ? e.message : "Save failed");
//     }
//   };

//   return (
//     <div className="p-6 bg-white rounded-lg shadow-md">
//       <h2 className="text-xl font-semibold mb-4">Enterprise Tools</h2>
//       <Input
//         placeholder="Enter enterprise tools used..."
//         value={inputValue}
//         onChange={(e) => setInputValue(e.target.value)}
//         className="w-full mb-4"
//       />
//       <Button onClick={handleSave} className="mt-2">
//         Save
//       </Button>
//     </div>
//   );
// };

// export default EnterpriseToolsStep;

import type { EnterpriseTool } from '../../../types/createSolutionReview';

const empty: EnterpriseTool = {
  toolName:'', toolType:'', onboardingStatus:'', integrationDetails:'', issues:''
};

const EnterpriseToolsStep: React.FC<StepProps> = ({ onSave, isSaving=false, initialData }) => {
  const initial: EnterpriseTool[] = initialData?.enterpriseTools ?? [];
  const [list,setList]=useState<EnterpriseTool[]>(initial);
  const [row,setRow]=useState<EnterpriseTool>(empty);
  const update=(k:keyof EnterpriseTool,v:string)=>setRow(r=>({...r,[k]:v}));
  const add=()=>{ if(!row.toolName) return; setList(l=>[...l,row]); setRow(empty); };
  const save=async()=>{ await onSave(list); };
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Enterprise Tools</h2>
      <div className="grid md:grid-cols-3 gap-3">
        <Input placeholder="Tool Name" value={row.toolName} onChange={e=>update('toolName',e.target.value)} />
        <Input placeholder="Tool Type" value={row.toolType} onChange={e=>update('toolType',e.target.value)} />
        <Input placeholder="Onboarding Status" value={row.onboardingStatus} onChange={e=>update('onboardingStatus',e.target.value)} />
        <Input placeholder="Integration Details" value={row.integrationDetails} onChange={e=>update('integrationDetails',e.target.value)} />
        <Input placeholder="Issues" value={row.issues} onChange={e=>update('issues',e.target.value)} />
      </div>
      <div className="flex gap-2">
        <Button onClick={add}>Add</Button>
        <Button disabled={isSaving} onClick={save}>{isSaving?'Saving...':'Save & Next'}</Button>
      </div>
      {list.length>0 && (
        <ul className="space-y-1 text-sm">
          {list.map((t,i)=><li key={i} className="bg-gray-50 px-3 py-2 rounded">{t.toolName} - {t.toolType}</li>)}
        </ul>
      )}
    </div>
  );
};
export default EnterpriseToolsStep;