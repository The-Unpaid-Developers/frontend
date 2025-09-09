import React, { useState, useEffect } from "react";
import { Button, Input, DropDown } from "../../ui";
import type { StepProps } from "./StepProps";
import type { EnterpriseTool } from "../../../types/solutionReview";
import {
  ONBOARDING_STATUS_OPTIONS,
  TOOL_TYPE_OPTIONS,
} from "./DropDownListValues";

const empty: EnterpriseTool = {
  tool: { name: "", type: "" },
  onboarded: "",
  integrationDetails: "",
  issues: "",
};

const EnterpriseToolsStep: React.FC<StepProps> = ({
  onSave,
  isSaving = false,
  initialData,
}) => {
  const initialList: EnterpriseTool[] | null | undefined =
    initialData.enterpriseTools;
  const [list, setList] = useState<EnterpriseTool[]>(() => initialList ?? []);
  const [row, setRow] = useState<EnterpriseTool>(empty);

  // useEffect(() => {
  //   // setList(initialList);
  //   if (initialList && initialList !== list) {
  //     setList(initialList);
  //   }
  // }, [initialList]);

  useEffect(() => {
    if (initialData.enterpriseTools) {
      setList(initialData.enterpriseTools);
    }
  }, [initialData.enterpriseTools]);

  const update = (k: keyof EnterpriseTool, v: string) =>
    setRow((r) => ({ ...r, [k]: v }));
  // const add=()=>{ if(!row.toolName) return; setList(l=>[...l,row]); setRow(empty); };

  const updateTool = <K extends keyof EnterpriseTool["tool"]>(
    k: K,
    v: EnterpriseTool["tool"][K]
  ) => setRow((r) => ({ ...r, tool: { ...r.tool, [k]: v } }));

  const save = async () => {
    await onSave(list);
  };

  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const resetForm = () => {
    setRow(empty);
    setEditingIndex(null);
  };

  const addOrUpdate = () => {
    if (editingIndex != null) {
      setList((l) => l.map((item, i) => (i === editingIndex ? row : item)));
    } else {
      setList((l) => [...l, row]);
    }
    resetForm();
  };
  const edit = (i: number) => {
    setRow(list[i]);
    setEditingIndex(i);
  };

  const del = (i: number) => {
    setList((l) => l.filter((_, idx) => idx !== i));
    if (editingIndex === i) resetForm();
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Enterprise Tools</h2>
      <div className="grid md:grid-cols-3 gap-3">
        <Input
          placeholder="Tool Name"
          value={row.tool.name}
          onChange={(e) => updateTool("name", e.target.value)}
        />
        {/* <Input placeholder="Tool Type" value={row.toolType} onChange={e=>update('toolType',e.target.value)} />
        <Input placeholder="Onboarding Status" value={row.onboarded} onChange={e=>update('onboarded',e.target.value)} /> */}
        <DropDown
          label="Tool Type"
          placeholder="Select Tool Type"
          value={row.tool.type}
          onChange={(e) => updateTool("type", e.target.value)}
          options={TOOL_TYPE_OPTIONS}
        />

        <DropDown
          label="Onboarding Status"
          placeholder="Select Onboarding Status"
          value={row.onboarded}
          onChange={(e) => update("onboarded", e.target.value)}
          options={ONBOARDING_STATUS_OPTIONS}
        />
        <Input
          placeholder="Integration Details"
          value={row.integrationDetails}
          onChange={(e) => update("integrationDetails", e.target.value)}
        />
        <Input
          placeholder="Issues"
          value={row.issues}
          onChange={(e) => update("issues", e.target.value)}
        />
      </div>
      {/* <div className="flex gap-2">
        <Button onClick={add}>Add</Button>
        <Button disabled={isSaving} onClick={save}>{isSaving?'Saving...':'Save'}</Button>
      </div> */}
      <div className="flex gap-2">
        <Button type="button" onClick={addOrUpdate}>
          {editingIndex != null ? "Update" : "Add"}
        </Button>
        {editingIndex != null && (
          <Button type="button" variant="secondary" onClick={resetForm}>
            Cancel Edit
          </Button>
        )}
        <Button type="button" disabled={isSaving} onClick={save}>
          {isSaving ? "Saving..." : "Save"}
        </Button>
      </div>
      {list.length > 0 && (
        <div className="border rounded max-h-80 overflow-auto">
          <table className="w-full text-sm border">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-2 text-left">Tool Name</th>
                <th className="p-2 text-left">Tool Type</th>
                <th className="p-2 text-left">Onboarding Status</th>
                <th className="p-2 text-left">Integration Details</th>
                <th className="p-2 text-left">Issues</th>
                <th className="p-2 text-left w-32">Actions</th>
              </tr>
            </thead>
            <tbody>
              {list.map((t, i) => (
                <tr key={i} className="border-t">
                  <td className="p-2">{t.tool.name}</td>
                  <td className="p-2">{t.tool.type}</td>
                  <td className="p-2">{t.onboarded}</td>
                  <td className="p-2">{t.integrationDetails}</td>
                  <td className="p-2">{t.issues}</td>
                  <td className="p-2">
                    <div className="flex gap-2">
                      <Button onClick={() => edit(i)}>Edit</Button>
                      <Button onClick={() => del(i)}>Del</Button>
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
export default EnterpriseToolsStep;
