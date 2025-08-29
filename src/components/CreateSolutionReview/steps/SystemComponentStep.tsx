// import React, { useState } from 'react';
// import { useCreateSolutionReview } from '../../../hooks/useCreateSolutionReview';
// import { Button, Input } from '../../ui';

// const SystemComponentStep: React.FC = () => {
//   const { systemComponentData, saveSystemComponent } = useCreateSolutionReview();
//   const [systemComponent, setSystemComponent] = useState(systemComponentData || '');

//   const handleSave = async () => {
//     await saveSystemComponent(systemComponent);
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

// const SystemComponentStep: React.FC<StepProps> = ({ onSave, isSaving = false, initialData }) => {
//   const { systemComponent, setSystemComponent } = useCreateSolutionReview();
//   const [inputValue, setInputValue] = useState(systemComponent || '');

//   const [error, setError] = useState<string | null>(null);
//   // const handleSave = () => {
//   //   setSystemComponent(inputValue);
//   //   // Call the API to save the business capabilities
//   //   // Example: saveSystemComponent(inputValue);
//   // };
//   const handleSave = async () => {
//     console.log('hi');
//     setError(null);
//     const payload = { systemComponent /* add other fields here */ };
//     try {
//       await onSave(payload); // calls CreateSolutionReviewPage.handleSave
//     } catch (e) {
//       setError(e instanceof Error ? e.message : "Save failed");
//     }
//   };

//   return (
//     <div className="p-6 bg-white rounded-lg shadow-md">
//       <h2 className="text-xl font-semibold mb-4">System Component</h2>
//       <Input
//         placeholder="Enter system component details..."
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

// export default SystemComponentStep;

import type { SystemComponent } from '../../../types/createSolutionReview';
import {
  COMPONENT_STATUS_OPTIONS,
  COMPONENT_ROLE_OPTIONS,
  HOSTING_REGION_OPTIONS,
  SOLUTION_TYPE_OPTIONS,
  CUSTOMIZATION_LEVEL_OPTIONS,
  UPGRADE_STRATEGY_OPTIONS,
  AVAILABILITY_REQUIREMENT_OPTIONS,
  SCALABILITY_METHOD_OPTIONS,
  BACKUP_SITE_OPTIONS,
  DATA_ENCRYPTION_AT_REST_OPTIONS,
  SSL_TYPE_OPTIONS,
  FRAMEWORK_OPTIONS
} from './DropDownListValues';

const empty: SystemComponent = {
  name:'', status:'', role:'', hostedOn:'', hostingRegion:'', solutionType:'',
  languageFramework:'', isOwnedByUs:false, isCICDUsed:false, customizationLevel:'',
  upgradeStrategy:'', upgradeFrequency:'', isSubscription:false, isInternetFacing:false,
  availabilityRequirement:'', latencyRequirement:0, throughputRequirement:0,
  scalabilityMethod:'', backupSite:'', authenticationMethod:'', authorizationModel:'',
  isAuditLoggingEnabled:false, sensitiveDataElements:'', dataEncryptionAtRest:'',
  encryptionAlgorithmForDataAtRest:'', hasIpWhitelisting:false, ssl:'',
  payloadEncryptionAlgorithm:'', digitalCertificate:'', keyStore:'',
  vulnerabilityAssessmentFrequency:'', penetrationTestingFrequency:''
};

const SystemComponentStep: React.FC<StepProps> = ({ onSave, isSaving=false, initialData }) => {
  const initialList: SystemComponent[] | null | undefined = initialData?.systemComponent;
  const [list,setList]=useState<SystemComponent[]>(() => initialList ?? []);
  const [row,setRow]=useState<SystemComponent>(empty);

  useEffect(() => {
      // setList(initialList);
      if (initialList && initialList !== list) {
        setList(initialList);
      }
    }, [initialList]);

  const update = (k: keyof SystemComponent, v:any) =>
    setRow(r=>({...r,[k]:v}));

  const add=()=>{
    if(!row.name) return;
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
      <h2 className="text-xl font-bold">System Components</h2>
      <div className="grid md:grid-cols-3 gap-3 max-h-[380px] overflow-y-auto pr-1">
        <Input placeholder="Name" value={row.name} onChange={e=>update('name',e.target.value)} />
        <DropDown
          label="Status"
          value={row.status}
          placeholder="Select Status"
          onChange={e=>update('status', e.target.value)}
          options={COMPONENT_STATUS_OPTIONS}
        />
        <DropDown
          label="Role"
          value={row.role}
          placeholder="Select Role"
          onChange={e=>update('role', e.target.value)}
          options={COMPONENT_ROLE_OPTIONS}
        />
        <Input placeholder="Hosted On" value={row.hostedOn} onChange={e=>update('hostedOn',e.target.value)} />
        <DropDown
          label="Hosting Region"
          value={row.hostingRegion}
          placeholder="Select Region"
          onChange={e=>update('hostingRegion', e.target.value)}
          options={HOSTING_REGION_OPTIONS}
        />
        <DropDown
          label="Solution Type"
          value={row.solutionType}
          placeholder="Select Type"
          onChange={e=>update('solutionType', e.target.value)}
          options={SOLUTION_TYPE_OPTIONS}
        />
        <DropDown
          label="Framework"
          value={row.languageFramework}
          placeholder="Select Framework"
          onChange={e=>update('languageFramework', e.target.value)}
          options={FRAMEWORK_OPTIONS}
        />
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={row.isOwnedByUs} onChange={e=>update('isOwnedByUs',e.target.checked)} /> Owned By Us
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={row.isCICDUsed} onChange={e=>update('isCICDUsed',e.target.checked)} /> CI/CD Used
        </label>
        <DropDown
          label="Customization Level"
          value={row.customizationLevel}
          placeholder="Select Level"
          onChange={e=>update('customizationLevel', e.target.value)}
          options={CUSTOMIZATION_LEVEL_OPTIONS}
        />
        <DropDown
          label="Upgrade Strategy"
          value={row.upgradeStrategy}
          placeholder="Select Strategy"
          onChange={e=>update('upgradeStrategy', e.target.value)}
          options={UPGRADE_STRATEGY_OPTIONS}
        />
        <Input placeholder="Upgrade Frequency" value={row.upgradeFrequency} onChange={e=>update('upgradeFrequency',e.target.value)} />
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={row.isSubscription} onChange={e=>update('isSubscription',e.target.checked)} /> Subscription
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={row.isInternetFacing} onChange={e=>update('isInternetFacing',e.target.checked)} /> Internet Facing
        </label>
        <DropDown
          label="Availability Requirement"
          value={row.availabilityRequirement}
          placeholder="Select Availability"
          onChange={e=>update('availabilityRequirement', e.target.value)}
          options={AVAILABILITY_REQUIREMENT_OPTIONS}
        />
        <Input type="number" placeholder="Latency" value={row.latencyRequirement} onChange={e=>update('latencyRequirement',Number(e.target.value))} />
        <Input type="number" placeholder="Throughput" value={row.throughputRequirement} onChange={e=>update('throughputRequirement',Number(e.target.value))} />
        <DropDown
          label="Scalability Method"
          value={row.scalabilityMethod}
          placeholder="Select Method"
          onChange={e=>update('scalabilityMethod', e.target.value)}
          options={SCALABILITY_METHOD_OPTIONS}
        />
        <DropDown
          label="Backup Site"
          value={row.backupSite}
          placeholder="Select Backup Site"
          onChange={e=>update('backupSite', e.target.value)}
          options={BACKUP_SITE_OPTIONS}
        />
        <Input placeholder="Auth Method" value={row.authenticationMethod} onChange={e=>update('authenticationMethod',e.target.value)} />
        <Input placeholder="Authorization Model" value={row.authorizationModel} onChange={e=>update('authorizationModel',e.target.value)} />
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={row.isAuditLoggingEnabled} onChange={e=>update('isAuditLoggingEnabled',e.target.checked)} /> Audit Logging
        </label>
        <Input placeholder="Sensitive Data" value={row.sensitiveDataElements} onChange={e=>update('sensitiveDataElements',e.target.value)} />
        <DropDown
          label="Data Encryption At Rest"
          value={row.dataEncryptionAtRest}
          placeholder="Select Encryption"
          onChange={e=>update('dataEncryptionAtRest', e.target.value)}
          options={DATA_ENCRYPTION_AT_REST_OPTIONS}
        />
        <Input placeholder="Encryption Algorithm" value={row.encryptionAlgorithmForDataAtRest} onChange={e=>update('encryptionAlgorithmForDataAtRest',e.target.value)} />
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={row.hasIpWhitelisting} onChange={e=>update('hasIpWhitelisting',e.target.checked)} /> IP Whitelisting
        </label>
        <DropDown
          label="SSL Type"
          value={row.ssl}
          placeholder="Select SSL Type"
          onChange={e=>update('ssl', e.target.value)}
          options={SSL_TYPE_OPTIONS}
        />
        <Input placeholder="Payload Encryption Alg" value={row.payloadEncryptionAlgorithm} onChange={e=>update('payloadEncryptionAlgorithm',e.target.value)} />
        <Input placeholder="Digital Certificate" value={row.digitalCertificate} onChange={e=>update('digitalCertificate',e.target.value)} />
        <Input placeholder="Key Store" value={row.keyStore} onChange={e=>update('keyStore',e.target.value)} />
        <Input placeholder="Vulnerability Assess Freq" value={row.vulnerabilityAssessmentFrequency} onChange={e=>update('vulnerabilityAssessmentFrequency',e.target.value)} />
        <Input placeholder="Pen Test Frequency" value={row.penetrationTestingFrequency} onChange={e=>update('penetrationTestingFrequency',e.target.value)} />
      </div>
      {/* <div className="flex gap-2">
        <Button type="button" onClick={add}>Add</Button>
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
          <table className="w-full text-xs md:text-sm">
            <thead className="bg-gray-50 sticky top-0">
              <tr>
                <th className="p-2 text-left">Name</th>
                <th className="p-2 text-left">Status</th>
                <th className="p-2 text-left">Role</th>
                <th className="p-2 text-left">Hosted On</th>
                <th className="p-2 text-left">Region</th>
                <th className="p-2 text-left">Type</th>
                <th className="p-2 text-left">Lang/Framework</th>
                <th className="p-2 text-left">Owned?</th>
                <th className="p-2 text-left">CI/CD</th>
                <th className="p-2 text-left">Customization</th>
                <th className="p-2 text-left">Upgrade Strat</th>
                <th className="p-2 text-left">Upgrade Freq</th>
                <th className="p-2 text-left">Subscription</th>
                <th className="p-2 text-left">Internet Facing</th>
                <th className="p-2 text-left">Avail Req</th>
                <th className="p-2 text-left">Latency</th>
                <th className="p-2 text-left">Throughput</th>
                <th className="p-2 text-left">Scalability</th>
                <th className="p-2 text-left">Backup Site</th>
                <th className="p-2 text-left">Auth Method</th>
                <th className="p-2 text-left">Authorization</th>
                <th className="p-2 text-left">Audit Log</th>
                <th className="p-2 text-left">Sensitive Data</th>
                <th className="p-2 text-left">Data Enc Rest</th>
                <th className="p-2 text-left">Enc Algo</th>
                <th className="p-2 text-left">IP WL</th>
                <th className="p-2 text-left">SSL</th>
                <th className="p-2 text-left">Payload Enc</th>
                <th className="p-2 text-left">Cert</th>
                <th className="p-2 text-left">Key Store</th>
                <th className="p-2 text-left">Vuln Assess Freq</th>
                <th className="p-2 text-left">Pen Test Freq</th>
                <th className="p-2 text-left w-28">Actions</th>
              </tr>
            </thead>
            <tbody>
              {list.map((c,i)=>(
                <tr key={i} className="border-t">
                  <td className="p-2">{c.name}</td>
                  <td className="p-2">{c.status}</td>
                  <td className="p-2">{c.role}</td>
                  <td className="p-2">{c.hostedOn}</td>
                  <td className="p-2">{c.hostingRegion}</td>
                  <td className="p-2">{c.solutionType}</td>
                  <td className="p-2">{c.languageFramework}</td>
                  <td className="p-2">{c.isOwnedByUs?'Yes':'No'}</td>
                  <td className="p-2">{c.isCICDUsed?'Yes':'No'}</td>
                  <td className="p-2">{c.customizationLevel}</td>
                  <td className="p-2">{c.upgradeStrategy}</td>
                  <td className="p-2">{c.upgradeFrequency}</td>
                  <td className="p-2">{c.isSubscription?'Yes':'No'}</td>
                  <td className="p-2">{c.isInternetFacing?'Yes':'No'}</td>
                  <td className="p-2">{c.availabilityRequirement}</td>
                  <td className="p-2">{c.latencyRequirement}</td>
                  <td className="p-2">{c.throughputRequirement}</td>
                  <td className="p-2">{c.scalabilityMethod}</td>
                  <td className="p-2">{c.backupSite}</td>
                  <td className="p-2">{c.authenticationMethod}</td>
                  <td className="p-2">{c.authorizationModel}</td>
                  <td className="p-2">{c.isAuditLoggingEnabled?'Yes':'No'}</td>
                  <td className="p-2">{c.sensitiveDataElements}</td>
                  <td className="p-2">{c.dataEncryptionAtRest}</td>
                  <td className="p-2">{c.encryptionAlgorithmForDataAtRest}</td>
                  <td className="p-2">{c.hasIpWhitelisting?'Yes':'No'}</td>
                  <td className="p-2">{c.ssl}</td>
                  <td className="p-2">{c.payloadEncryptionAlgorithm}</td>
                  <td className="p-2">{c.digitalCertificate}</td>
                  <td className="p-2">{c.keyStore}</td>
                  <td className="p-2">{c.vulnerabilityAssessmentFrequency}</td>
                  <td className="p-2">{c.penetrationTestingFrequency}</td>
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
      )}    </div>
  );
};

export default SystemComponentStep;