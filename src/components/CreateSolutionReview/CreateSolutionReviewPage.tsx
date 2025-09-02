import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Input } from '../ui';
import type { SolutionOverview } from '../../types/solutionReview';
import { useCreateSolutionOverview } from '../../hooks/useCreateSolutionOverview';

const empty: SolutionOverview = { solutionDetails: {
  solutionName: '',
  projectName: '',
  systemCode: '',
  solutionArchitectName: '',
  deliveryProjectManagerName: '',
  itBusinessPartner: ''
},
  reviewType: '',
  businessUnit: '',
  businessDriver: '',
  valueOutcomes: '',
  applicationUsers: [],
  concerns: []
};

// type Props = {
//   onCreated: (created: SolutionOverview) => void;
//   isCreating?: boolean;
// };

export const CreateSolutionReviewPage: React.FC = () => {
  const navigate = useNavigate();
  const [data,setData] = useState<SolutionOverview>(empty);
  const [appUser,setAppUser]=useState('');
  const { create, isCreating, error } = useCreateSolutionOverview();


  const update = (k: keyof SolutionOverview, v:any)=>
    setData(d=>({...d,[k]:v}));

  const addUser=()=>{
    if(!appUser.trim()) return;
    update('applicationUsers',[...data.applicationUsers, appUser.trim()]);
    setAppUser('');
  };
  const removeUser=(u:string)=>
    update('applicationUsers', data.applicationUsers.filter(x=>x!==u));

  const handleCreate = async () => {
    const created = await create(data, data.solutionDetails.systemCode);
    const id = (created as any).id || data.solutionDetails.systemCode;
    navigate(`/update-solution-review/${id}`);
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">New Solution Review</h1>
      <div className="grid md:grid-cols-2 gap-4">
        <Input placeholder="Solution Name" value={data.solutionDetails.solutionName} onChange={e=>update('solutionDetails', {...data.solutionDetails, solutionName: e.target.value})} />
        <Input placeholder="Project Name" value={data.solutionDetails.projectName} onChange={e=>update('solutionDetails', {...data.solutionDetails, projectName: e.target.value})} />
        <Input placeholder="System Code" value={data.solutionDetails.systemCode} onChange={e=>update('solutionDetails', {...data.solutionDetails, systemCode: e.target.value})} />
        <Input placeholder="Solution Architect" value={data.solutionDetails.solutionArchitectName} onChange={e=>update('solutionDetails', {...data.solutionDetails, solutionArchitectName: e.target.value})} />
        <Input placeholder="Delivery PM" value={data.solutionDetails.deliveryProjectManagerName} onChange={e=>update('solutionDetails', {...data.solutionDetails, deliveryProjectManagerName: e.target.value})} />
        <Input placeholder="IT Business Partner" value={data.solutionDetails.itBusinessPartner} onChange={e=>update('solutionDetails', {...data.solutionDetails, itBusinessPartner: e.target.value})} />
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
        {data.applicationUsers.length>0 && (
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

      <Button disabled={isCreating} onClick={handleCreate}>
        {isCreating ? 'Creating...' : 'Create'}
      </Button>
    </div>
  );
};