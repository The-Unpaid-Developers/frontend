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
import React, { useState, useEffect } from 'react';
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
  const initialList: ProcessCompliance[] | null | undefined = initialData?.processCompliance;
  const [list,setList]=useState<ProcessCompliance[]>(() => initialList ?? []);
  const [row,setRow]=useState<ProcessCompliance>(empty);
  useEffect(() => {
      // setList(initialList);
      if (initialList && initialList !== list) {
        setList(initialList);
      }
    }, [initialList]);
  const update=(k:keyof ProcessCompliance,v:string)=>setRow(r=>({...r,[k]:v}));
  const add=()=>{ if(!row.standardGuideline) return; setList(l=>[...l,row]); setRow(empty); };
  const save=async()=>{ await onSave(list); };
  const [editingIndex,setEditingIndex]=useState<number | null>(null);
  
    const resetForm = () => {
      setRow(empty);
      setEditingIndex(null);
    };
  
    const addOrUpdate = () => {
      if (editingIndex != null) {
        setList(l => l.map((item,i)=> i===editingIndex ? row : item));
      } else {
        setList(l=>[...l,row]);
      }
      resetForm();
    };
    const edit = (i: number) => {
      setRow(list[i]);
      setEditingIndex(i);
    };
  
    const del = (i: number) => {
      setList(l => l.filter((_,idx)=>idx!==i));
      if (editingIndex === i) resetForm();
    };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Process Compliance</h2>
      <div className="grid md:grid-cols-3 gap-3">
        <Input placeholder="Standard / Guideline" value={row.standardGuideline} onChange={e=>update('standardGuideline',e.target.value)} />
        <Input placeholder="Compliant" value={row.compliant} onChange={e=>update('compliant',e.target.value)} />
        <Input placeholder="Description" value={row.description} onChange={e=>update('description',e.target.value)} />
      </div>
      {/* <div className="flex gap-2">
        <Button onClick={add}>Add</Button>
        <Button disabled={isSaving} onClick={save}>{isSaving?'Saving...':'Save'}</Button>
      </div> */}
      <div className="flex gap-2">
        <Button type="button" onClick={addOrUpdate}>
          {editingIndex != null ? 'Update' : 'Add'}
        </Button>
        {editingIndex != null && (
          <Button type="button" variant="secondary" onClick={resetForm}>Cancel Edit</Button>
        )}
        <Button type="button" disabled={isSaving} onClick={save}>
          {isSaving ? 'Saving...' : 'Save'}
        </Button>
      </div>
      {list.length>0 && (
        <div className="border rounded max-h-80 overflow-auto">
        <table className="w-full text-sm border">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-2 text-left">Standard / Guideline</th>
              <th className="p-2 text-left">Compliant</th>
              <th className="p-2 text-left">Description</th>
              <th className="p-2 text-left w-32">Actions</th>
            </tr>
          </thead>
            <tbody>
              {list.map((p,i)=>(
                <tr key={i} className="border-t">
                  <td className="p-2">{p.standardGuideline}</td>
                  <td className="p-2">{p.compliant}</td>
                  <td className="p-2">{p.description}</td>
                  <td className="p-2">
                    <div className="flex gap-2">
                      <Button onClick={()=>edit(i)}>Edit</Button>
                      <Button onClick={()=>del(i)}>Del</Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
        </table>
        </div>
      )}
    </div>
  );
};

export default ProcessComplianceStep;