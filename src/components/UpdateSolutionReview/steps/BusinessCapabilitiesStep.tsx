import React, { useState, useEffect } from "react";
import { Button, Input, DropDown } from "../../ui";
import type { StepProps } from "./StepProps";
import type { BusinessCapability } from "../../../types/solutionReview";
import {
  L1_CAPABILITY_OPTIONS,
  L2_CAPABILITY_OPTIONS,
  L3_CAPABILITY_OPTIONS,
} from "./DropDownListValues";

const emptyRow: BusinessCapability = {
  l1Capability: "",
  l2Capability: "",
  l3Capability: "",
  remarks: "",
};

const BusinessCapabilitiesStep: React.FC<StepProps> = ({
  onSave,
  isSaving = false,
  initialData,
}) => {
  const initialList: BusinessCapability[] | null | undefined =
    initialData.businessCapabilities;
  const [list, setList] = useState<BusinessCapability[]>(
    () => initialList ?? []
  );
  const [row, setRow] = useState<BusinessCapability>(emptyRow);

  // useEffect(() => {
  //   // setList(initialList);
  //   if (initialList && initialList !== list) {
  //     setList(initialList);
  //   }
  // }, [initialList]);
  useEffect(() => {
    if (initialData.businessCapabilities) {
      setList(initialData.businessCapabilities);
    }
  }, [initialData.businessCapabilities]);

  const update = (k: keyof BusinessCapability, v: string) =>
    setRow((r) => ({ ...r, [k]: v }));

  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const resetForm = () => {
    setRow(emptyRow);
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

  const save = async () => {
    await onSave(list);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Business Capabilities</h2>
      <div className="grid md:grid-cols-4 gap-3">
        <DropDown
          placeholder="L1 Capability"
          value={row.l1Capability}
          onChange={(e) => update("l1Capability", e.target.value)}
          options={L1_CAPABILITY_OPTIONS}
        />
        <DropDown
          placeholder="L2 Capability"
          value={row.l2Capability}
          onChange={(e) => update("l2Capability", e.target.value)}
          options={L2_CAPABILITY_OPTIONS}
        />
        <DropDown
          placeholder="L3 Capability"
          value={row.l3Capability}
          onChange={(e) => update("l3Capability", e.target.value)}
          options={L3_CAPABILITY_OPTIONS}
        />
        <Input
          placeholder="Remarks"
          value={row.remarks}
          onChange={(e) => update("remarks", e.target.value)}
        />
      </div>
      {/* <div className="flex gap-2">
        <Button type="button" onClick={addOrUpdate}>Add</Button>
        <Button type="button" disabled={isSaving} onClick={save}>{isSaving?'Saving...':'Save'}</Button>
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
                <th className="p-2 text-left">L1</th>
                <th className="p-2 text-left">L2</th>
                <th className="p-2 text-left">L3</th>
                <th className="p-2 text-left">Remarks</th>
              </tr>
            </thead>
            <tbody>
              {list.map((r, i) => (
                <tr key={i} className="border-t">
                  <td className="p-2">{r.l1Capability}</td>
                  <td className="p-2">{r.l2Capability}</td>
                  <td className="p-2">{r.l3Capability}</td>
                  <td className="p-2">{r.remarks}</td>
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
export default BusinessCapabilitiesStep;
