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

import React, { useState, useEffect } from 'react';
import { Button, Input, DropDown } from '../../ui';
import { useCreateSolutionReview } from '../../../hooks/useCreateSolutionReview';
import type { StepProps } from './StepProps';
import { CLASSIFICATION_OPTIONS } from './DropDownListValues';
// type StepProps = {
//   onSave: (data: any) => Promise<void> | void;
//   isSaving?: boolean;
//   initialData?: any;
// };

// const DataAssetStep: React.FC<StepProps> = ({ onSave, isSaving = false, initialData }) => {
//   const { dataAsset, setDataAsset } = useCreateSolutionReview();
//   const [inputValue, setInputValue] = useState(dataAsset || '');

//   const [error, setError] = useState<string | null>(null);
//   // const handleSave = () => {
//   //   setDataAsset(inputValue);
//   //   // Call the API to save the business capabilities
//   //   // Example: saveDataAsset(inputValue);
//   // };
//   const handleSave = async () => {
//     console.log('hi');
//     setError(null);
//     const payload = { dataAsset /* add other fields here */ };
//     try {
//       await onSave(payload); // calls CreateSolutionReviewPage.handleSave
//     } catch (e) {
//       setError(e instanceof Error ? e.message : "Save failed");
//     }
//   };

//   return (
//     <div className="p-6 bg-white rounded-lg shadow-md">
//       <h2 className="text-xl font-bold mb-4">Data Asset</h2>
//       <Input
//         placeholder="Enter data assets..."
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

// export default DataAssetStep;

import type { DataAsset } from '../../../types/createSolutionReview';

const empty: DataAsset = {
  componentName:'', solutionOverviewId:'', dataDomain:'', dataClassification:'',
  dataOwnership:'', dataEntities:[], masteredIn:''
};

const DataAssetStep: React.FC<StepProps> = ({ onSave, isSaving=false, initialData }) => {
  const initialList: DataAsset[] | null | undefined = initialData?.dataAsset;
  const [list,setList]=useState<DataAsset[]>(() => initialList ?? []);
  const [row,setRow]=useState<DataAsset>(empty);
  const [entity,setEntity]=useState('');

  useEffect(() => {
      // setList(initialList);
      if (initialList && initialList !== list) {
        setList(initialList);
      }
    }, [initialList]);

  const update=(k: keyof DataAsset, v:any)=> setRow(r=>({...r,[k]:v}));

  const addEntity=()=>{
    if(!entity.trim()) return;
    update('dataEntities',[...row.dataEntities, entity.trim()]);
    setEntity('');
  };

  const removeEntity=(e:string)=>{
    update('dataEntities', row.dataEntities.filter(x=>x!==e));
  };

  const addRow=()=>{
    if(!row.componentName) return;
    setList(l=>[...l,row]);
    setRow(empty);
  };

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

  const save=async()=>{ await onSave(list); };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Data Assets</h2>
      <div className="grid md:grid-cols-3 gap-3">
        <Input placeholder="Component Name" value={row.componentName} onChange={e=>update('componentName',e.target.value)} />
        <Input placeholder="Solution Overview Id" value={row.solutionOverviewId} onChange={e=>update('solutionOverviewId',e.target.value)} />
        <Input placeholder="Data Domain" value={row.dataDomain} onChange={e=>update('dataDomain',e.target.value)} />
        {/* <Input placeholder="Classification" value={row.dataClassification} onChange={e=>update('dataClassification',e.target.value)} /> */}
        <DropDown
          // label="Data Classification"
          placeholder="Select Data Classification"
          value={row.dataClassification}
          onChange={e=>update('dataClassification', e.target.value)}
          options={CLASSIFICATION_OPTIONS}
        />
        <Input placeholder="Ownership" value={row.dataOwnership} onChange={e=>update('dataOwnership',e.target.value)} />
        <Input placeholder="Mastered In" value={row.masteredIn} onChange={e=>update('masteredIn',e.target.value)} />
      </div>
      <div>
        <label className="text-sm font-medium">Data Entities</label>
        <div className="flex gap-2 mt-1">
          <Input value={entity} onChange={e=>setEntity(e.target.value)} placeholder="Add entity..." />
          <Button type="button" onClick={addEntity}>Add</Button>
        </div>
        {row.dataEntities.length>0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {row.dataEntities.map(de=>(
              <span key={de} className="bg-gray-100 px-2 py-1 rounded text-xs">
                {de} <button type="button" onClick={()=>removeEntity(de)} className="ml-1 text-red-600">x</button>
              </span>
            ))}
          </div>
        )}
      </div>
      {/* <div className="flex gap-2">
        <Button type="button" onClick={addRow}>Add</Button>
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
              <th className="p-2 text-left">Component</th>
              <th className="p-2 text-left">Domain</th>
              <th className="p-2 text-left">Classification</th>
              <th className="p-2 text-left">Entities</th>
            </tr>
          </thead>
          <tbody>
            {list.map((d,i)=>(
              <tr key={i} className="border-t">
                <td className="p-2">{d.componentName}</td>
                <td className="p-2">{d.dataDomain}</td>
                <td className="p-2">{d.dataClassification}</td>
                <td className="p-2">{d.dataEntities.join(', ')}</td>
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

export default DataAssetStep;