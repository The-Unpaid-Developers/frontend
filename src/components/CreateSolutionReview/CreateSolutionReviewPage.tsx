import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Input, DropDown } from '../ui';
import type { SolutionOverview } from '../../types/solutionReview';
import { useCreateSolutionOverview } from '../../hooks/useCreateSolutionOverview';
import {
  APPLICATION_USER_OPTIONS,
  REVIEW_TYPE_OPTIONS,
  BUSINESS_UNIT_OPTIONS,
  BUSINESS_DRIVER_OPTIONS,
} from '../UpdateSolutionReview/steps/DropDownListValues';
import { useToast } from '../../context/ToastContext';

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
  valueOutcome: '',
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
  const { createNewSR, isCreating, error } = useCreateSolutionOverview();
  const [systemCode, setSystemCode] = useState('');
  const { showSuccess, showError } = useToast();

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
    try {
      data.solutionDetails.solutionReviewCode = "";
      data.createdBy = localStorage.getItem("username") || "unknown";
      data.modifiedBy = localStorage.getItem("username") || "unknown";
      
      const created = await createNewSR(data, systemCode);
      const id = (created as any).id || systemCode;
      
      showSuccess("Solution review created successfully!");
      
      // Navigate after a short delay to let user see the success message
      setTimeout(() => {
        navigate(`/update-solution-review/${id}`);
      }, 1000);
      
    } catch (error) {
      console.error("Failed to create solution review:", error);
      showError("Failed to create solution review. Please try again." + error.message);
    }
  };

  return (
    <div className="p-6">
      <div className="mb-4">
        <h1 className="text-2xl font-bold">New Solution Review</h1>
      </div>
      <div className="fixed top-4 right-4 z-50">
        <Button variant="ghost" onClick={() => navigate(-1)} aria-label="Close">
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </Button>
      </div>
      
      <div className="grid md:grid-cols-2 gap-4">
        <Input placeholder="Solution Name" value={data.solutionDetails.solutionName} onChange={e=>update('solutionDetails', {...data.solutionDetails, solutionName: e.target.value})} />
        <Input placeholder="Project Name" value={data.solutionDetails.projectName} onChange={e=>update('solutionDetails', {...data.solutionDetails, projectName: e.target.value})} />
        <Input placeholder="System Code" value={systemCode} onChange={e=>setSystemCode(e.target.value)} />
        <Input placeholder="Solution Architect" value={data.solutionDetails.solutionArchitectName} onChange={e=>update('solutionDetails', {...data.solutionDetails, solutionArchitectName: e.target.value})} />
        <Input placeholder="Delivery PM" value={data.solutionDetails.deliveryProjectManagerName} onChange={e=>update('solutionDetails', {...data.solutionDetails, deliveryProjectManagerName: e.target.value})} />
        <Input placeholder="IT Business Partner" value={data.solutionDetails.itBusinessPartner} onChange={e=>update('solutionDetails', {...data.solutionDetails, itBusinessPartner: e.target.value})} />
        <DropDown
          placeholder="Review Type"
          value={data.reviewType}
          onChange={e => update('reviewType', e.target.value)}
          options={REVIEW_TYPE_OPTIONS}
        />
        <DropDown
          placeholder="Business Unit"
          value={data.businessUnit}
          onChange={e => update('businessUnit', e.target.value)}
          options={BUSINESS_UNIT_OPTIONS}
        />
        <DropDown
          placeholder="Business Driver"
          value={data.businessDriver}
          onChange={e => update('businessDriver', e.target.value)}
          options={BUSINESS_DRIVER_OPTIONS}
        /><Input placeholder="Value Outcomes" value={data.valueOutcome} onChange={e=>update('valueOutcome',e.target.value)} />
      </div>

      <div>
        <label className="text-sm font-medium">Application Users</label>
        <div className="flex gap-2 mt-1">
          <DropDown
            placeholder="Select Application User"
            value={appUser}
            onChange={e => setAppUser(e.target.value)}
            options={APPLICATION_USER_OPTIONS}
          />
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