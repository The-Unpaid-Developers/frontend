// import React, { useState } from 'react';
// import { useCreateSolutionReview } from '../../../hooks/useCreateSolutionReview';
// import { Button, Input } from '../../ui';

// const SystemComponentStep: React.FC = () => {
//   const { systemComponentData, saveSystemComponent } = useCreateSolutionReview();
//   const [systemComponent, setSystemComponent] = useState(systemComponentData || '');

//   const handleSave = async () => {
//     await saveSystemComponent(systemComponent);
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
  const initial: SystemComponent[] = initialData?.systemComponent ?? [];
  const [list,setList]=useState<SystemComponent[]>(initial);
  const [row,setRow]=useState<SystemComponent>(empty);

  const update = (k: keyof SystemComponent, v:any) =>
    setRow(r=>({...r,[k]:v}));

  const add=()=>{
    if(!row.name) return;
    setList(l=>[...l,row]);
    setRow(empty);
  };

  const save=async()=>{ await onSave(list); };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">System Components</h2>
      <div className="grid md:grid-cols-3 gap-3 max-h-[380px] overflow-y-auto pr-1">
        <Input placeholder="Name" value={row.name} onChange={e=>update('name',e.target.value)} />
        <Input placeholder="Status" value={row.status} onChange={e=>update('status',e.target.value)} />
        <Input placeholder="Role" value={row.role} onChange={e=>update('role',e.target.value)} />
        <Input placeholder="Hosted On" value={row.hostedOn} onChange={e=>update('hostedOn',e.target.value)} />
        <Input placeholder="Hosting Region" value={row.hostingRegion} onChange={e=>update('hostingRegion',e.target.value)} />
        <Input placeholder="Solution Type" value={row.solutionType} onChange={e=>update('solutionType',e.target.value)} />
        <Input placeholder="Language/Framework" value={row.languageFramework} onChange={e=>update('languageFramework',e.target.value)} />
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={row.isOwnedByUs} onChange={e=>update('isOwnedByUs',e.target.checked)} /> Owned By Us
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={row.isCICDUsed} onChange={e=>update('isCICDUsed',e.target.checked)} /> CI/CD Used
        </label>
        <Input placeholder="Customization Level" value={row.customizationLevel} onChange={e=>update('customizationLevel',e.target.value)} />
        <Input placeholder="Upgrade Strategy" value={row.upgradeStrategy} onChange={e=>update('upgradeStrategy',e.target.value)} />
        <Input placeholder="Upgrade Frequency" value={row.upgradeFrequency} onChange={e=>update('upgradeFrequency',e.target.value)} />
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={row.isSubscription} onChange={e=>update('isSubscription',e.target.checked)} /> Subscription
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={row.isInternetFacing} onChange={e=>update('isInternetFacing',e.target.checked)} /> Internet Facing
        </label>
        <Input placeholder="Availability Req" value={row.availabilityRequirement} onChange={e=>update('availabilityRequirement',e.target.value)} />
        <Input type="number" placeholder="Latency" value={row.latencyRequirement} onChange={e=>update('latencyRequirement',Number(e.target.value))} />
        <Input type="number" placeholder="Throughput" value={row.throughputRequirement} onChange={e=>update('throughputRequirement',Number(e.target.value))} />
        <Input placeholder="Scalability Method" value={row.scalabilityMethod} onChange={e=>update('scalabilityMethod',e.target.value)} />
        <Input placeholder="Backup Site" value={row.backupSite} onChange={e=>update('backupSite',e.target.value)} />
        <Input placeholder="Auth Method" value={row.authenticationMethod} onChange={e=>update('authenticationMethod',e.target.value)} />
        <Input placeholder="Authorization Model" value={row.authorizationModel} onChange={e=>update('authorizationModel',e.target.value)} />
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={row.isAuditLoggingEnabled} onChange={e=>update('isAuditLoggingEnabled',e.target.checked)} /> Audit Logging
        </label>
        <Input placeholder="Sensitive Data" value={row.sensitiveDataElements} onChange={e=>update('sensitiveDataElements',e.target.value)} />
        <Input placeholder="Data Encryption At Rest" value={row.dataEncryptionAtRest} onChange={e=>update('dataEncryptionAtRest',e.target.value)} />
        <Input placeholder="Encryption Algorithm" value={row.encryptionAlgorithmForDataAtRest} onChange={e=>update('encryptionAlgorithmForDataAtRest',e.target.value)} />
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={row.hasIpWhitelisting} onChange={e=>update('hasIpWhitelisting',e.target.checked)} /> IP Whitelisting
        </label>
        <Input placeholder="SSL" value={row.ssl} onChange={e=>update('ssl',e.target.value)} />
        <Input placeholder="Payload Encryption Alg" value={row.payloadEncryptionAlgorithm} onChange={e=>update('payloadEncryptionAlgorithm',e.target.value)} />
        <Input placeholder="Digital Certificate" value={row.digitalCertificate} onChange={e=>update('digitalCertificate',e.target.value)} />
        <Input placeholder="Key Store" value={row.keyStore} onChange={e=>update('keyStore',e.target.value)} />
        <Input placeholder="Vulnerability Assess Freq" value={row.vulnerabilityAssessmentFrequency} onChange={e=>update('vulnerabilityAssessmentFrequency',e.target.value)} />
        <Input placeholder="Pen Test Frequency" value={row.penetrationTestingFrequency} onChange={e=>update('penetrationTestingFrequency',e.target.value)} />
      </div>
      <div className="flex gap-2">
        <Button type="button" onClick={add}>Add</Button>
        <Button type="button" disabled={isSaving} onClick={save}>{isSaving?'Saving...':'Save & Next'}</Button>
      </div>
      {list.length>0 && <div className="text-sm">{list.length} component(s) added</div>}
    </div>
  );
};

export default SystemComponentStep;