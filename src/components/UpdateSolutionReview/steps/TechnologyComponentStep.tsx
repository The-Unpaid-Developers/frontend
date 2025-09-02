import React, { useState, useEffect } from 'react';
import { Button, Input, DropDown } from '../../ui';
import type { StepProps } from './StepProps';
import type { TechnologyComponent } from '../../../types/solutionReview';
import { USAGE_OPTIONS } from './DropDownListValues';

const empty: TechnologyComponent = {
  componentName:'', productName:'', productVersion:'', usage:''
};

const TechnologyComponentStep: React.FC<StepProps> = ({ onSave, isSaving=false, initialData }) => {
  const initialList: TechnologyComponent[] = initialData.technologyComponents;
  const [list,setList]=useState<TechnologyComponent[]>(() => initialList ?? []);
  const [row,setRow]=useState<TechnologyComponent>(empty);

  // useEffect(() => {
  //     // setList(initialList);
  //     if (initialList && initialList !== list) {
  //       setList(initialList);
  //     }
  //   }, [initialList]);
    useEffect(() => {
      if (initialData.technologyComponents) {
        setList(initialData.technologyComponents);
      }
    }, [initialData.technologyComponents]);

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