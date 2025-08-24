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

import React, { useState, useEffect } from 'react';
import { Button, Input } from '../../ui';
import { useCreateSolutionReview } from '../../../hooks/useCreateSolutionReview';
import type { StepProps } from './StepProps';
// type StepProps = {
//   onSave: (data: any) => Promise<void> | void;
//   isSaving?: boolean;
//   initialData?: any;
// };

// const SolutionOverviewStep: React.FC<StepProps> = ({ onSave, isSaving = false, initialData }) => {
//   const { solutionOverview, setSolutionOverview } = useCreateSolutionReview();
//   const [inputValue, setInputValue] = useState(solutionOverview || '');

//   const [error, setError] = useState<string | null>(null);
//   // const handleSave = () => {
//   //   setSolutionOverview(inputValue);
//   //   // Call the API to save the business capabilities
//   //   // Example: saveSolutionOverview(inputValue);
//   // };
//   const handleSave = async () => {
//     console.log('hi');
//     setError(null);
//     const payload = { solutionOverview /* add other fields here */ };
//     try {
//       await onSave(payload); // calls CreateSolutionReviewPage.handleSave
//     } catch (e) {
//       setError(e instanceof Error ? e.message : "Save failed");
//     }
//   };
  
//   return (
//     <div className="p-6 bg-white rounded-lg shadow-md">
//       <h2 className="text-xl font-bold mb-4">Solution Overview</h2>
//       <Input
//         placeholder="Enter solution overview..."
//         value={inputValue}
//         onChange={(e) => setInputValue(e.target.value)}
//         className="w-full mb-4"
//         multiline
//       />
//       <Button onClick={handleSave} className="mt-2">
//         Save
//       </Button>
//     </div>
//   );
// };

// export default SolutionOverviewStep;

import type { SolutionOverview } from '../../../types/createSolutionReview';

const empty: SolutionOverview = {
  solutionName: '',
  projectName: '',
  solutionReviewCode: '',
  solutionArchitectName: '',
  deliveryProjectManagerName: '',
  itBusinessPartner: '',
  reviewType: '',
  businessUnit: '',
  businessDriver: '',
  valueOutcomes: '',
  applicationUsers: []
};

const SolutionOverviewStep: React.FC<StepProps> = ({ onSave, isSaving = false, initialData }) => {
  const [data, setData] = useState<SolutionOverview>(initialData?.solutionOverview ?? empty);
  const [appUser, setAppUser] = useState('');

  useEffect(() => {
    if (initialData?.solutionOverview) {
      setData(initialData.solutionOverview);
    }
  }, [initialData]);

  const update = (k: keyof SolutionOverview, v: any) => setData(d => ({ ...d, [k]: v }));

  const addUser = () => {
    if (!appUser.trim()) return;
    update('applicationUsers', [...data.applicationUsers, appUser.trim()]);
    setAppUser('');
  };

  const removeUser = (u: string) =>
    update('applicationUsers', data.applicationUsers.filter(x => x !== u));

  const save = async () => { await onSave(data); };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Solution Overview</h2>
      <div className="grid md:grid-cols-2 gap-4">
        <Input placeholder="Solution Name" value={data.solutionName} onChange={e=>update('solutionName',e.target.value)} />
        <Input placeholder="Project Name" value={data.projectName} onChange={e=>update('projectName',e.target.value)} />
        <Input placeholder="Review Code" value={data.solutionReviewCode} onChange={e=>update('solutionReviewCode',e.target.value)} />
        <Input placeholder="Solution Architect" value={data.solutionArchitectName} onChange={e=>update('solutionArchitectName',e.target.value)} />
        <Input placeholder="Delivery PM" value={data.deliveryProjectManagerName} onChange={e=>update('deliveryProjectManagerName',e.target.value)} />
        <Input placeholder="IT Business Partner" value={data.itBusinessPartner} onChange={e=>update('itBusinessPartner',e.target.value)} />
        <Input placeholder="Review Type" value={data.reviewType} onChange={e=>update('reviewType',e.target.value)} />
        <Input placeholder="Business Unit" value={data.businessUnit} onChange={e=>update('businessUnit',e.target.value)} />
        <Input placeholder="Business Driver" value={data.businessDriver} onChange={e=>update('businessDriver',e.target.value)} />
        <Input placeholder="Value Outcomes" value={data.valueOutcomes} onChange={e=>update('valueOutcomes',e.target.value)} />
      </div>

      <div>
        <label className="text-sm font-medium">Application Users</label>
        <div className="flex gap-2 mt-1">
          <Input value={appUser} onChange={e=>setAppUser(e.target.value)} placeholder="Add user..." />
          <Button type="button" onClick={addUser}>Add</Button>
        </div>
        {data.applicationUsers.length > 0 && (
          <ul className="mt-2 text-sm space-y-1">
            {data.applicationUsers.map(u=>(
              <li key={u} className="flex justify-between bg-gray-50 px-2 py-1 rounded">
                <span>{u}</span>
                <button type="button" onClick={()=>removeUser(u)} className="text-red-600 text-xs">x</button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <Button disabled={isSaving} onClick={save}>{isSaving?'Saving...':'Save'}</Button>
    </div>
  );
};

export default SolutionOverviewStep;