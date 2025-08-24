import React, { useState, useEffect } from 'react';
import { Button, Input } from '../../ui';
import { useCreateSolutionReview } from '../../../hooks/useCreateSolutionReview';
import type { StepProps } from './StepProps';
// type StepProps = {
//   onSave: (data: any) => Promise<void> | void;
//   isSaving?: boolean;
//   initialData?: any;
// };

// const BusinessCapabilitiesStep: React.FC<StepProps> = ({ onSave, isSaving = false, initialData }) => {
//   const { businessCapabilities, setBusinessCapabilities } = useCreateSolutionReview();
//   const [inputValue, setInputValue] = useState(businessCapabilities || '');

//   const [error, setError] = useState<string | null>(null);
//   // const handleSave = () => {
//   //   setBusinessCapabilities(inputValue);
//   //   // Call the API to save the business capabilities
//   //   // Example: saveBusinessCapabilities(inputValue);
//   // };
//   const handleSave = async () => {
//     console.log('hi');
//     setError(null);
//     setBusinessCapabilities(inputValue);
//     const payload = [{ businessCapabilities /* add other fields here */ }];
//     try {
//       await onSave(payload); // calls CreateSolutionReviewPage.handleSave
//     } catch (e) {
//       setError(e instanceof Error ? e.message : "Save failed");
//     }
//   };

//   return (
//     <div className="p-6 bg-white rounded-lg shadow-md">
//       <h2 className="text-xl font-bold mb-4">Business Capabilities</h2>
//       <Input
//         placeholder="Enter business capabilities..."
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

// export default BusinessCapabilitiesStep;

// interface FormState {
//   l1Capability: string;
//   l2Capability: string;
//   l3Capability: string;
//   remarks: string;
// }

// const emptyForm: FormState = {
//   l1Capability: '',
//   l2Capability: '',
//   l3Capability: '',
//   remarks: '',
// };

// const BusinessCapabilitiesStep: React.FC<StepProps> = ({ onSave, isSaving = false, initialData }) => {
//   const { businessCapabilities, setBusinessCapabilities } = useCreateSolutionReview();

//   // If you want to edit last added item when coming back, prefill from last entry
//   const last = businessCapabilities && businessCapabilities.length > 0
//     ? businessCapabilities[businessCapabilities.length - 1]
//     : undefined;

//   const [form, setForm] = useState<FormState>(() => ({
//     l1Capability: last?.l1Capability ?? '',
//     l2Capability: last?.l2Capability ?? '',
//     l3Capability: last?.l3Capability ?? '',
//     remarks: last?.remarks ?? '',
//   }));
//   const [error, setError] = useState<string | null>(null);

//   const updateField = (key: keyof FormState, value: string) => {
//     setForm(f => ({ ...f, [key]: value }));
//   };

//   const validate = (): string[] => {
//     const errs: string[] = [];
//     if (!form.l1Capability.trim()) errs.push('L1 Capability is required');
//     if (!form.l2Capability.trim()) errs.push('L2 Capability is required');
//     if (!form.l3Capability.trim()) errs.push('L3 Capability is required');
//     return errs;
//   };

//   const handleAddAndSave = async () => {
//     setError(null);
//     const errs = validate();
//     if (errs.length) {
//       setError(errs.join(', '));
//       return;
//     }

//     const newItem = {
//       l1Capability: form.l1Capability.trim(),
//       l2Capability: form.l2Capability.trim(),
//       l3Capability: form.l3Capability.trim(),
//       remarks: form.remarks.trim(),
//     };

//     // Append to existing array (or start new)
//     const updated = [...(businessCapabilities ?? []), newItem];
//     console.log("Updated Business Capabilities:", updated);
//     setBusinessCapabilities(updated);
//     try {
//       await onSave(updated); // parent will call unified saveSection with this array
//       // reset form for adding another if desired
//       setForm(emptyForm);
//     } catch (e) {
//       setError(e instanceof Error ? e.message : 'Save failed');
//     }
//   };

//   return (
//     <div className="p-6 bg-white rounded-lg shadow-md space-y-4">
//       <h2 className="text-xl font-bold">Business Capabilities</h2>

//       <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//         <div>
//           <label className="block text-sm font-medium mb-1">L1 Capability</label>
//           <Input
//             placeholder="L1 Capability"
//             value={form.l1Capability}
//             onChange={(e) => updateField('l1Capability', e.target.value)}
//           />
//         </div>
//         <div>
//           <label className="block text-sm font-medium mb-1">L2 Capability</label>
//           <Input
//             placeholder="L2 Capability"
//             value={form.l2Capability}
//             onChange={(e) => updateField('l2Capability', e.target.value)}
//           />
//         </div>
//         <div>
//           <label className="block text-sm font-medium mb-1">L3 Capability</label>
//           <Input
//             placeholder="L3 Capability"
//             value={form.l3Capability}
//             onChange={(e) => updateField('l3Capability', e.target.value)}
//           />
//         </div>
//       </div>

//       <div>
//         <label className="block text-sm font-medium mb-1">Remarks</label>
//         <Input
//           placeholder="Remarks"
//           value={form.remarks}
//           onChange={(e) => updateField('remarks', e.target.value)}
//         />
//       </div>

//       {error && <div className="text-sm text-red-600">{error}</div>}

//       <div className="flex items-center gap-3">
//         <Button
//           onClick={handleAddAndSave}
//           disabled={isSaving}
//           className="px-4 py-2"
//         >
//           {isSaving ? 'Saving...' : 'Save & Next'}
//         </Button>
//         {businessCapabilities && businessCapabilities.length > 0 && (
//           <span className="text-xs text-gray-500">
//             {businessCapabilities.length} item(s) added
//           </span>
//         )}
//       </div>

//       {/* List already added capabilities */}
//       {businessCapabilities && businessCapabilities.length > 0 && (
//         <ul className="mt-4 border rounded-md divide-y">
//           {businessCapabilities.map((bc, i) => (
//             <li key={i} className="p-3 text-sm">
//               <div className="font-medium">
//                 {bc.l1Capability} / {bc.l2Capability} / {bc.l3Capability}
//               </div>
//               {bc.remarks && <div className="text-gray-500">{bc.remarks}</div>}
//             </li>
//           ))}
//         </ul>
//       )}
//     </div>
//   );
// };

// export default BusinessCapabilitiesStep;

import type { BusinessCapability } from '../../../types/createSolutionReview';

const emptyRow: BusinessCapability = { l1Capability:'', l2Capability:'', l3Capability:'', remarks:'' };

const BusinessCapabilitiesStep: React.FC<StepProps> = ({ onSave, isSaving = false, initialData }) => {
  const initialList: BusinessCapability[] | null | undefined = initialData?.businessCapabilities;
  const [list,setList]=useState<BusinessCapability[]>(() => initialList ?? []);
  const [row,setRow]=useState<BusinessCapability>(emptyRow);
  
  
  useEffect(() => {
    // setList(initialList);
    if (initialList && initialList !== list) {
      setList(initialList);
    }
  }, [initialList]);

  const update = (k: keyof BusinessCapability, v: string) =>
    setRow(r=>({...r,[k]:v}));

  

  // const add = () => {
  //   if(!row.l1Capability || !row.l2Capability || !row.l3Capability) return;
  //   setList(l=>[...l,row]);
  //   setRow(emptyRow);
  // };

  const [editingIndex,setEditingIndex]=useState<number | null>(null);

  const resetForm = () => {
    setRow(emptyRow);
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

  const save = async () => { await onSave(list); };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Business Capabilities</h2>
      <div className="grid md:grid-cols-4 gap-3">
        <Input placeholder="L1 Capability" value={row.l1Capability} onChange={e=>update('l1Capability',e.target.value)} />
        <Input placeholder="L2 Capability" value={row.l2Capability} onChange={e=>update('l2Capability',e.target.value)} />
        <Input placeholder="L3 Capability" value={row.l3Capability} onChange={e=>update('l3Capability',e.target.value)} />
        <Input placeholder="Remarks" value={row.remarks} onChange={e=>update('remarks',e.target.value)} />
      </div>
      {/* <div className="flex gap-2">
        <Button type="button" onClick={addOrUpdate}>Add</Button>
        <Button type="button" disabled={isSaving} onClick={save}>{isSaving?'Saving...':'Save'}</Button>
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
              <th className="p-2 text-left">L1</th>
              <th className="p-2 text-left">L2</th>
              <th className="p-2 text-left">L3</th>
              <th className="p-2 text-left">Remarks</th>
            </tr>
          </thead>
          <tbody>
            {list.map((r,i)=>(
              <tr key={i} className="border-t">
                <td className="p-2">{r.l1Capability}</td>
                <td className="p-2">{r.l2Capability}</td>
                <td className="p-2">{r.l3Capability}</td>
                <td className="p-2">{r.remarks}</td>
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
export default BusinessCapabilitiesStep;