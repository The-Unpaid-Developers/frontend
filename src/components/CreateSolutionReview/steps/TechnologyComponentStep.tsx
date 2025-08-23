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
import React, { useState } from 'react';
import { Button, Input } from '../../ui';
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

const empty: TechnologyComponent = {
  componentName:'', technology:'', version:'', purpose:'', configuration:'',
  supportRequirements:[], category:'', vendor:'', license:'', supportLevel:''
};

const TechnologyComponentStep: React.FC<StepProps> = ({ onSave, isSaving=false, initialData }) => {
  const initial: TechnologyComponent[] = initialData?.technologyComponent ?? [];
  const [list,setList]=useState<TechnologyComponent[]>(initial);
  const [row,setRow]=useState<TechnologyComponent>(empty);
  const [req,setReq]=useState('');

  const update=(k:keyof TechnologyComponent,v:any)=>setRow(r=>({...r,[k]:v}));
  const addReq=()=>{ if(!req.trim()) return; update('supportRequirements',[...row.supportRequirements,req.trim()]); setReq(''); };
  const removeReq=(r:string)=> update('supportRequirements', row.supportRequirements.filter(x=>x!==r));
  const add=()=>{ if(!row.componentName) return; setList(l=>[...l,row]); setRow(empty); };
  const save=async()=>{ await onSave(list); };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Technology Components</h2>
      <div className="grid md:grid-cols-3 gap-3">
        <Input placeholder="Component Name" value={row.componentName} onChange={e=>update('componentName',e.target.value)} />
        <Input placeholder="Technology" value={row.technology} onChange={e=>update('technology',e.target.value)} />
        <Input placeholder="Version" value={row.version} onChange={e=>update('version',e.target.value)} />
        <Input placeholder="Purpose" value={row.purpose} onChange={e=>update('purpose',e.target.value)} />
        <Input placeholder="Configuration" value={row.configuration} onChange={e=>update('configuration',e.target.value)} />
        <Input placeholder="Category" value={row.category} onChange={e=>update('category',e.target.value)} />
        <Input placeholder="Vendor" value={row.vendor} onChange={e=>update('vendor',e.target.value)} />
        <Input placeholder="License" value={row.license} onChange={e=>update('license',e.target.value)} />
        <Input placeholder="Support Level" value={row.supportLevel} onChange={e=>update('supportLevel',e.target.value)} />
      </div>
      <div>
        <label className="text-sm font-medium">Support Requirements</label>
        <div className="flex gap-2 mt-1">
          <Input value={req} onChange={e=>setReq(e.target.value)} placeholder="Add requirement..." />
          <Button type="button" onClick={addReq}>Add</Button>
        </div>
        {row.supportRequirements.length>0 && (
          <div className="flex flex-wrap gap-2 mt-2 text-xs">
            {row.supportRequirements.map(r=>(
              <span key={r} className="bg-gray-100 px-2 py-1 rounded">
                {r} <button type="button" onClick={()=>removeReq(r)} className="text-red-600 ml-1">x</button>
              </span>
            ))}
          </div>
        )}
      </div>
      <div className="flex gap-2">
        <Button onClick={add}>Add</Button>
        <Button disabled={isSaving} onClick={save}>{isSaving?'Saving...':'Save & Next'}</Button>
      </div>
      {list.length>0 && <div className="text-sm">{list.length} technology component(s)</div>}
    </div>
  );
};

export default TechnologyComponentStep;