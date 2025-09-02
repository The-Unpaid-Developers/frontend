import React, { useState, useEffect } from 'react';
import { Button, Input, DropDown } from '../../ui';
import type { StepProps } from './StepProps';
import type { SystemComponent } from '../../../types/solutionReview';
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
  FRAMEWORK_OPTIONS,
  LANGUAGE_OPTIONS
} from './DropDownListValues';

const empty: SystemComponent = {
  name: '',
  status: '',
  role: '',
  hostedOn: '',
  hostingRegion: '',
  solutionType: '',
  languageFramework: {'language': {'name': '', 'version': ''}, 'framework': {'name': '', 'version': ''}},
  isOwnedByUs: false,
  isCICDUsed: false,
  customizationLevel: '',
  upgradeStrategy: '',
  upgradeFrequency: '',
  isSubscription: false,
  isInternetFacing: false,
  availabilityRequirement: '',
  latencyRequirement: 0,
  throughputRequirement: 0,
  scalabilityMethod: '',
  backupSite: '',
  securityDetails: {
    authenticationMethod:'', authorizationModel:'',
  isAuditLoggingEnabled:false, sensitiveDataElements:'', dataEncryptionAtRest:'',
  encryptionAlgorithmForDataAtRest:'', hasIpWhitelisting:false, ssl:'',
  payloadEncryptionAlgorithm:'', digitalCertificate:'', keyStore:'',
  vulnerabilityAssessmentFrequency:'', penetrationTestingFrequency:''
  }
};

const SystemComponentStep: React.FC<StepProps> = ({ onSave, isSaving=false, initialData }) => {
  const initialList: SystemComponent[] | null | undefined = initialData.systemComponents;
  const [list,setList]=useState<SystemComponent[]>(() => initialList ?? []);
  const [row,setRow]=useState<SystemComponent>(empty);

  useEffect(() => {
        if (initialData.systemComponents) {
          setList(initialData.systemComponents);
        }
      }, [initialData.systemComponents]);

  const update = (k: keyof SystemComponent, v:any) =>
    setRow(r=>({...r,[k]:v}));

  const updateSecurityDetails = (k: keyof SystemComponent['securityDetails'], v:any) =>
    setRow(r=>({...r,securityDetails:{...r.securityDetails,[k]:v}}));

  const updateLanguageFramework = (
    section: 'language' | 'framework',
    key: 'name' | 'version',
    value: string
  ) => {
    setRow(r => ({
      ...r,
      languageFramework: {
        ...r.languageFramework,
        [section]: {
          ...r.languageFramework[section],
            [key]: value
        }
      }
    }));
  };

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
        {/* <DropDown
          label="Framework"
          value={row.languageFramework.framework}
          placeholder="Select Framework"
          onChange={e=>update('languageFramework', e.target.value)}
          options={FRAMEWORK_OPTIONS}
        /> */}
        <DropDown
        label="Language"
        value={row.languageFramework.language.name}
        placeholder="Select Language"
        onChange={e=>updateLanguageFramework('language','name', e.target.value)}
        options={LANGUAGE_OPTIONS}
      />
      <Input
        placeholder="Lang Version"
        value={row.languageFramework.language.version}
        onChange={e=>updateLanguageFramework('language','version', e.target.value)}
      />
      <DropDown
        label="Framework"
        value={row.languageFramework.framework.name}
        placeholder="Select Framework"
        onChange={e=>updateLanguageFramework('framework','name', e.target.value)}
        options={FRAMEWORK_OPTIONS}
      />
      <Input
        placeholder="Framework Version"
        value={row.languageFramework.framework.version}
        onChange={e=>updateLanguageFramework('framework','version', e.target.value)}
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
        <Input placeholder="Auth Method" value={row.securityDetails.authenticationMethod} onChange={e=>updateSecurityDetails('authenticationMethod',e.target.value)} />
        <Input placeholder="Authorization Model" value={row.securityDetails.authorizationModel} onChange={e=>updateSecurityDetails('authorizationModel',e.target.value)} />
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={row.securityDetails.isAuditLoggingEnabled} onChange={e=>updateSecurityDetails('isAuditLoggingEnabled',e.target.checked)} /> Audit Logging
        </label>
        <Input placeholder="Sensitive Data" value={row.securityDetails.sensitiveDataElements} onChange={e=>updateSecurityDetails('sensitiveDataElements',e.target.value)} />
        <DropDown
          label="Data Encryption At Rest"
          value={row.securityDetails.dataEncryptionAtRest}
          placeholder="Select Encryption"
          onChange={e=>updateSecurityDetails('dataEncryptionAtRest', e.target.value)}
          options={DATA_ENCRYPTION_AT_REST_OPTIONS}
        />
        <Input placeholder="Encryption Algorithm" value={row.securityDetails.encryptionAlgorithmForDataAtRest} onChange={e=>updateSecurityDetails('encryptionAlgorithmForDataAtRest',e.target.value)} />
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={row.securityDetails.hasIpWhitelisting} onChange={e=>updateSecurityDetails('hasIpWhitelisting',e.target.checked)} /> IP Whitelisting
        </label>
        <DropDown
          label="SSL Type"
          value={row.securityDetails.ssl}
          placeholder="Select SSL Type"
          onChange={e=>updateSecurityDetails('ssl', e.target.value)}
          options={SSL_TYPE_OPTIONS}
        />
        <Input placeholder="Payload Encryption Alg" value={row.securityDetails.payloadEncryptionAlgorithm} onChange={e=>updateSecurityDetails('payloadEncryptionAlgorithm',e.target.value)} />
        <Input placeholder="Digital Certificate" value={row.securityDetails.digitalCertificate} onChange={e=>updateSecurityDetails('digitalCertificate',e.target.value)} />
        <Input placeholder="Key Store" value={row.securityDetails.keyStore} onChange={e=>updateSecurityDetails('keyStore',e.target.value)} />
        <Input placeholder="Vulnerability Assess Freq" value={row.securityDetails.vulnerabilityAssessmentFrequency} onChange={e=>updateSecurityDetails('vulnerabilityAssessmentFrequency',e.target.value)} />
        <Input placeholder="Pen Test Frequency" value={row.securityDetails.penetrationTestingFrequency} onChange={e=>updateSecurityDetails('penetrationTestingFrequency',e.target.value)} />
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
                <th className="p-2 text-left">Language</th>
                <th className="p-2 text-left">Framework</th>
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
                  <td className="p-2">{c.languageFramework.language.name + ' - ' + c.languageFramework.language.version}</td>
                  <td className="p-2">{c.languageFramework.framework.name + ' - ' + c.languageFramework.framework.version}</td>
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
                  <td className="p-2">{c.securityDetails.authenticationMethod}</td>
                  <td className="p-2">{c.securityDetails.authorizationModel}</td>
                  <td className="p-2">{c.securityDetails.isAuditLoggingEnabled?'Yes':'No'}</td>
                  <td className="p-2">{c.securityDetails.sensitiveDataElements}</td>
                  <td className="p-2">{c.securityDetails.dataEncryptionAtRest}</td>
                  <td className="p-2">{c.securityDetails.encryptionAlgorithmForDataAtRest}</td>
                  <td className="p-2">{c.securityDetails.hasIpWhitelisting?'Yes':'No'}</td>
                  <td className="p-2">{c.securityDetails.ssl}</td>
                  <td className="p-2">{c.securityDetails.payloadEncryptionAlgorithm}</td>
                  <td className="p-2">{c.securityDetails.digitalCertificate}</td>
                  <td className="p-2">{c.securityDetails.keyStore}</td>
                  <td className="p-2">{c.securityDetails.vulnerabilityAssessmentFrequency}</td>
                  <td className="p-2">{c.securityDetails.penetrationTestingFrequency}</td>
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