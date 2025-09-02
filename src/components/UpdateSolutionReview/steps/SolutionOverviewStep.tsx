import React, { useState, useEffect } from 'react';
import { Button, Input } from '../../ui';
import type { StepProps } from './StepProps';
import type { SolutionOverview } from '../../../types/solutionReview';
import { useUpdateSolutionReview } from '../../../hooks/useUpdateSolutionReview';

const emptyData: SolutionOverview = {
  solutionDetails: {
    solutionName: '',
    projectName: '',
    systemCode: '',
    solutionArchitectName: '',
    deliveryProjectManagerName: '',
    itBusinessPartner: '',
  },
  reviewType: '',
  businessUnit: '',
  businessDriver: '',
  valueOutcomes: '',
  applicationUsers: [],
};

const SolutionOverviewStep: React.FC<StepProps> = ({ onSave, isSaving = false, initialData }) => {
  const [data, setData] = useState<SolutionOverview>(initialData.solutionOverview ?? emptyData);
  const [appUser, setAppUser] = useState('');

  useEffect(() => {
    if (initialData.solutionOverview) {
      setData(initialData.solutionOverview);
    }
  }, [initialData.solutionOverview]);
  const update = (k: keyof SolutionOverview, v: any) => setData(d => ({ ...d, [k]: v }));

  const updateSolutionDetails = <K extends keyof SolutionOverview['solutionDetails']>(k: K, v: SolutionOverview['solutionDetails'][K]) =>
    setData(d => ({ ...d, solutionDetails: { ...d.solutionDetails, [k]: v } }));

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
        <Input placeholder="Solution Name" value={data.solutionDetails.solutionName} onChange={e => updateSolutionDetails('solutionName', e.target.value)} />
        <Input placeholder="Project Name" value={data.solutionDetails.projectName} onChange={e => updateSolutionDetails('projectName', e.target.value)} />
        <Input placeholder="System Code" value={data.solutionDetails.systemCode} onChange={e => updateSolutionDetails('systemCode', e.target.value)} />
        <Input placeholder="Solution Architect" value={data.solutionDetails.solutionArchitectName} onChange={e => updateSolutionDetails('solutionArchitectName', e.target.value)} />
        <Input placeholder="Delivery PM" value={data.solutionDetails.deliveryProjectManagerName} onChange={e => updateSolutionDetails('deliveryProjectManagerName', e.target.value)} />
        <Input placeholder="IT Business Partner" value={data.solutionDetails.itBusinessPartner} onChange={e => updateSolutionDetails('itBusinessPartner', e.target.value)} />
        <Input placeholder="Review Type" value={data.reviewType} onChange={e => update('reviewType', e.target.value)} />
        <Input placeholder="Business Unit" value={data.businessUnit} onChange={e => update('businessUnit', e.target.value)} />
        <Input placeholder="Business Driver" value={data.businessDriver} onChange={e => update('businessDriver', e.target.value)} />
        <Input placeholder="Value Outcomes" value={data.valueOutcomes} onChange={e => update('valueOutcomes', e.target.value)} />
      </div>

      <div>
        <label className="text-sm font-medium">Application Users</label>
        <div className="flex gap-2 mt-1">
          <Input value={appUser} onChange={e => setAppUser(e.target.value)} placeholder="Add user..." />
          <Button type="button" onClick={addUser}>Add</Button>
        </div>
        {data.applicationUsers.length > 0 && (
          <ul className="mt-2 text-sm space-y-1">
            {data.applicationUsers.map(u => (
              <li key={u} className="flex justify-between bg-gray-50 px-2 py-1 rounded">
                <span>{u}</span>
                <button type="button" onClick={() => removeUser(u)} className="text-red-600 text-xs">x</button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <Button disabled={isSaving} onClick={save}>{isSaving ? 'Saving...' : 'Save'}</Button>
    </div>
  );
};

export default SolutionOverviewStep;