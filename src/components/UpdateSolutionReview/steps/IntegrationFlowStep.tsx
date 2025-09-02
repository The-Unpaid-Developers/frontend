// import React, { useState } from "react";
// import { useCreateSolutionReview } from "../../../hooks/useCreateSolutionReview";
// import { Button, Input } from "../../ui";

// const IntegrationFlowStep: React.FC = () => {
//   const { integrationFlowData, setIntegrationFlowData, saveIntegrationFlow } = useCreateSolutionReview();
//   const [localData, setLocalData] = useState(integrationFlowData || "");

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setLocalData(e.target.value);
//   };

//   const handleSave = () => {
//     setIntegrationFlowData(localData);
//     saveIntegrationFlow(localData);
//   };
import React, { useState, useEffect } from 'react';
import { Button, DropDown, Input } from '../../ui';
import type { StepProps } from './StepProps';
// type StepProps = {
//   onSave: (data: any) => Promise<void> | void;
//   isSaving?: boolean;
//   initialData?: any;
// };

// const IntegrationFlowStep: React.FC<StepProps> = ({ onSave, isSaving = false, initialData }) => {
//   const { integrationFlow, setIntegrationFlow } = useCreateSolutionReview();
//   const [inputValue, setInputValue] = useState(integrationFlow || '');

//   const [error, setError] = useState<string | null>(null);
//   // const handleSave = () => {
//   //   setIntegrationFlow(inputValue);
//   //   // Call the API to save the business capabilities
//   //   // Example: saveIntegrationFlow(inputValue);
//   // };
//   const handleSave = async () => {
//     console.log('hi');
//     setError(null);
//     const payload = { integrationFlow /* add other fields here */ };
//     try {
//       await onSave(payload); // calls CreateSolutionReviewPage.handleSave
//     } catch (e) {
//       setError(e instanceof Error ? e.message : "Save failed");
//     }
//   };

//   return (
//     <div className="p-6 bg-white rounded-lg shadow-md">
//       <h2 className="text-xl font-bold mb-4">Integration Flow</h2>
//       <Input
//         placeholder="Describe the integration flow..."
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

// export default IntegrationFlowStep;

import type { IntegrationFlow } from '../../../types/solutionReview';
import { EXTERNAL_SYSTEM_ROLE_OPTIONS, INTEGRATION_METHOD_OPTIONS } from './DropDownListValues';

const empty: IntegrationFlow = {
  componentName:'', counterpartSystemCode:'', counterpartSystemRole:'',
  integrationMethod:'', frequency:'', purpose:''
};

const IntegrationFlowStep: React.FC<StepProps> = ({ onSave, isSaving=false, initialData }) => {
  const initialList: IntegrationFlow[] | null | undefined = initialData.integrationFlows;
  const [list,setList]=useState<IntegrationFlow[]>(() => initialList ?? []);
  const [row,setRow]=useState<IntegrationFlow>(empty);
  useEffect(() => {
        if (initialData.integrationFlows) {
          setList(initialData.integrationFlows);
        }
      }, [initialData.integrationFlows]);
      
  const update=(k:keyof IntegrationFlow,v:string)=>setRow(r=>({...r,[k]:v}));
  const add=()=>{ if(!row.componentName) return; setList(l=>[...l,row]); setRow(empty); };
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
      <h2 className="text-xl font-bold">Integration Flow</h2>
      <div className="grid md:grid-cols-3 gap-3">
        <Input placeholder="Component" value={row.componentName} onChange={e=>update('componentName',e.target.value)} />
        <Input placeholder="Counterpart Code" value={row.counterpartSystemCode} onChange={e=>update('counterpartSystemCode',e.target.value)} />
        {/* <Input placeholder="Counterpart Role" value={row.counterpartSystemRole} onChange={e=>update('counterpartSystemRole',e.target.value)} />
        <Input placeholder="Method" value={row.integrationMethod} onChange={e=>update('integrationMethod',e.target.value)} /> */}
        <DropDown
          label="Counterpart Role"
          placeholder="Select Role"
          value={row.counterpartSystemRole}
          onChange={e=>update('counterpartSystemRole', e.target.value)}
          options={EXTERNAL_SYSTEM_ROLE_OPTIONS}
        />
        <DropDown
          label="Method"
          placeholder="Select Method"
          value={row.integrationMethod}
          onChange={e=>update('integrationMethod', e.target.value)}
          options={INTEGRATION_METHOD_OPTIONS}
        />
        <Input placeholder="Frequency" value={row.frequency} onChange={e=>update('frequency',e.target.value)} />
        <Input placeholder="Purpose" value={row.purpose} onChange={e=>update('purpose',e.target.value)} />
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
          <thead><tr className="bg-gray-50">
            <th className="p-2 text-left">Component</th>
            <th className="p-2 text-left">Counterpart</th>
            <th className="p-2 text-left">Role</th>
            <th className="p-2 text-left">Method</th>
          </tr></thead>
          <tbody>
            {list.map((f,i)=>(
              <tr key={i} className="border-t">
                <td className="p-2">{f.componentName}</td>
                <td className="p-2">{f.counterpartSystemCode}</td>
                <td className="p-2">{f.counterpartSystemRole}</td>
                <td className="p-2">{f.integrationMethod}</td>
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
export default IntegrationFlowStep;