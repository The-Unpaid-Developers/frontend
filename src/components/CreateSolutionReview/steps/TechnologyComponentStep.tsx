// import React, { useState } from 'react';
// import { useCreateSolutionReview } from '../../../hooks/useCreateSolutionReview';
// import { Button, Input } from '../../ui';

// const TechnologyComponentStep: React.FC = () => {
//   const { technologyComponent, setTechnologyComponent, saveTechnologyComponent } = useCreateSolutionReview();
//   const [isSaving, setIsSaving] = useState(false);

//   const handleSave = async () => {
//     setIsSaving(true);
//     await saveTechnologyComponent(technologyComponent);
//     setIsSaving(false);
//   };
import React, { useState, useEffect } from 'react';
import { Button, Input, DropDown } from '../../ui';
import { useCreateSolutionReview } from '../../../hooks/useCreateSolutionReview';
import type { StepProps } from './StepProps';
// type StepProps = {
//   onSave: (data: any) => Promise<void> | void;
//   isSaving?: boolean;
//   initialData?: any;
// };

// const TechnologyComponentStep: React.FC<StepProps> = ({ onSave, isSaving = false, initialData }) => {
//   const { technologyComponent, setTechnologyComponent } = useCreateSolutionReview();
//   const [inputValue, setInputValue] = useState(technologyComponent || '');

//   const [error, setError] = useState<string | null>(null);
//   // const handleSave = () => {
//   //   setTechnologyComponent(inputValue);
//   //   // Call the API to save the business capabilities
//   //   // Example: saveTechnologyComponent(inputValue);
//   // };
//   const handleSave = async () => {
//     console.log('hi');
//     setError(null);
//     const payload = { technologyComponent /* add other fields here */ };
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

// export default TechnologyComponentStep;

import type { TechnologyComponent } from '../../../types/createSolutionReview';
import { USAGE_OPTIONS } from './DropDownListValues';

const empty: TechnologyComponent = {
  componentName:'', productName:'', productVersion:'', usage:''
};

const TechnologyComponentStep: React.FC<StepProps> = ({ onSave, isSaving=false, initialData }) => {
  const initialList: TechnologyComponent[] = initialData?.technologyComponent;
  const [list,setList]=useState<TechnologyComponent[]>(() => initialList ?? []);
  const [row,setRow]=useState<TechnologyComponent>(empty);

  useEffect(() => {
      // setList(initialList);
      if (initialList && initialList !== list) {
        setList(initialList);
      }
    }, [initialList]);

  const update=(k:keyof TechnologyComponent,v:any)=>setRow(r=>({...r,[k]:v}));
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
      <h2 className="text-xl font-bold">Technology Components</h2>
      <div className="grid md:grid-cols-3 gap-3">
        <Input placeholder="Component Name" value={row.componentName} onChange={e=>update('componentName',e.target.value)} />
        <Input placeholder="Product Name" value={row.productName} onChange={e=>update('productName',e.target.value)} />
        <Input placeholder="Product Version" value={row.productVersion} onChange={e=>update('productVersion',e.target.value)} />
        <DropDown
          label="Usage"
          placeholder="Select Usage"
          value={row.usage}
          onChange={e=>update('usage', e.target.value)}
          options={USAGE_OPTIONS}
        />
      </div>
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
          <table className="w-full text-sm">
            <thead className="bg-gray-50 sticky top-0">
              <tr>
                <th className="p-2 text-left">Component Name</th>
                <th className="p-2 text-left">Product Name</th>
                <th className="p-2 text-left">Product Version</th>
                <th className="p-2 text-left">Usage</th>
              </tr>
            </thead>
            <tbody>
              {list.map((t,i)=>(
                <tr key={i} className="border-t">
                  <td className="p-2">{t.componentName}</td>
                  <td className="p-2">{t.productName}</td>
                  <td className="p-2">{t.productVersion}</td>
                  <td className="p-2">{t.usage}</td>
                  <td className="p-2">
                    <div className="flex gap-1 flex-wrap">
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

export default TechnologyComponentStep;