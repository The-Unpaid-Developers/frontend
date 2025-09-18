import React, { useState, useEffect } from "react";
import { Button, DropDown, Input, Card, CardHeader, CardTitle, CardContent } from "../../ui";
import type { StepProps } from "./StepProps";
import type { ProcessCompliance } from "../../../types/solutionReview";
import {
  STANDARD_GUIDELINE_OPTIONS,
  COMPLIANT_OPTIONS,
} from "./DropDownListValues";

const empty: ProcessCompliance = {
  standardGuideline: "",
  compliant: "",
  description: "",
};

const ProcessComplianceStep: React.FC<StepProps> = ({
  onSave,
  isSaving = false,
  initialData,
}) => {
  const initialList: ProcessCompliance[] | null | undefined =
    initialData.processCompliances;
  const [list, setList] = useState<ProcessCompliance[]>(
    () => initialList ?? []
  );
  const [row, setRow] = useState<ProcessCompliance>(empty);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingCompliance, setEditingCompliance] = useState<ProcessCompliance | null>(null);

  useEffect(() => {
    if (initialData.processCompliances) {
      setList(initialData.processCompliances);
    }
  }, [initialData.processCompliances]);

  const update = (k: keyof ProcessCompliance, v: string) =>
    setRow((r) => ({ ...r, [k]: v }));

  const addCompliance = () => {
    if (!row.standardGuideline || !row.compliant) return;
    setList([...list, { ...row, id: `temp-${Date.now()}` }]);
    setRow(empty);
  };

  const removeCompliance = (index: number) => {
    setList(list.filter((_, i) => i !== index));
  };

  const startEdit = (index: number) => {
    setEditingIndex(index);
    setEditingCompliance({ ...list[index] });
  };

  const saveEdit = () => {
    if (editingIndex !== null && editingCompliance) {
      const updated = [...list];
      updated[editingIndex] = editingCompliance;
      setList(updated);
      setEditingIndex(null);
      setEditingCompliance(null);
    }
  };

  const cancelEdit = () => {
    setEditingIndex(null);
    setEditingCompliance(null);
  };

  const updateEditingCompliance = (field: keyof ProcessCompliance, value: string) => {
    setEditingCompliance(prev => prev ? { ...prev, [field]: value } : null);
  };

  const save = async () => {
    await onSave(list);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      {/* <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Process Compliance</h2>
        <p className="text-gray-600">Define the compliance standards and guidelines that your solution must adhere to</p>
      </div> */}

      {/* Add Process Compliance Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <svg className="w-5 h-5 mr-2 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
            </svg>
            Add Process Compliance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Standard / Guideline <span className="text-red-500">*</span>
              </label>
              <DropDown
                placeholder="Select standard/guideline"
                value={row.standardGuideline}
                onChange={(e) => update("standardGuideline", e.target.value)}
                options={STANDARD_GUIDELINE_OPTIONS}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Compliant <span className="text-red-500">*</span>
              </label>
              <DropDown
                placeholder="Select compliance status"
                value={row.compliant}
                onChange={(e) => update("compliant", e.target.value)}
                options={COMPLIANT_OPTIONS}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <Input
                placeholder="Enter description"
                value={row.description}
                onChange={(e) => update("description", e.target.value)}
              />
            </div>
          </div>

          <div className="mt-4 flex justify-end">
            <Button
              onClick={addCompliance}
              disabled={!row.standardGuideline || !row.compliant}
              variant="secondary"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Compliance
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Current Process Compliances */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <svg className="w-5 h-5 mr-2 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
            </svg>
            Process Compliances ({list.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {list.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <svg className="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 713.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 713.138-3.138z" />
              </svg>
              <p>No process compliances added yet</p>
              <p className="text-sm">Add your first compliance requirement above</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Standard / Guideline
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Compliant
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Description
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {list.map((compliance, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      {editingIndex === index && editingCompliance ? (
                        // Edit mode
                        <>
                          <td className="px-4 py-3">
                            <DropDown
                              value={editingCompliance.standardGuideline}
                              onChange={e => updateEditingCompliance('standardGuideline', e.target.value)}
                              options={STANDARD_GUIDELINE_OPTIONS}
                            />
                          </td>
                          <td className="px-4 py-3">
                            <DropDown
                              value={editingCompliance.compliant}
                              onChange={e => updateEditingCompliance('compliant', e.target.value)}
                              options={COMPLIANT_OPTIONS}
                            />
                          </td>
                          <td className="px-4 py-3">
                            <Input
                              value={editingCompliance.description}
                              onChange={e => updateEditingCompliance('description', e.target.value)}
                              placeholder="Description"
                            />
                          </td>
                          <td className="px-4 py-3 text-right">
                            <div className="flex justify-end space-x-2">
                              <button
                                onClick={saveEdit}
                                className="text-green-600 hover:text-green-900 transition-colors"
                                title="Save"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                              </button>
                              <button
                                onClick={cancelEdit}
                                className="text-gray-600 hover:text-gray-900 transition-colors"
                                title="Cancel"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                              </button>
                            </div>
                          </td>
                        </>
                      ) : (
                        // Display mode
                        <>
                          <td className="px-4 py-3 text-sm text-gray-900">{compliance.standardGuideline}</td>
                          <td className="px-4 py-3 text-sm text-gray-900">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              compliance.compliant === 'Yes' ? 'bg-green-100 text-green-800' :
                              compliance.compliant === 'No' ? 'bg-red-100 text-red-800' :
                              compliance.compliant === 'Partial' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {compliance.compliant}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-900">{compliance.description || '—'}</td>
                          <td className="px-4 py-3 text-sm text-right">
                            <div className="flex justify-end space-x-2">
                              <button
                                onClick={() => startEdit(index)}
                                className="text-blue-600 hover:text-blue-900 transition-colors"
                                title="Edit"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                              </button>
                              <button
                                onClick={() => removeCompliance(index)}
                                className="text-red-600 hover:text-red-900 transition-colors"
                                title="Delete"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </button>
                            </div>
                          </td>
                        </>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end pt-4">
        <Button 
          disabled={isSaving} 
          onClick={save}
          className="min-w-[120px]"
        >
          {isSaving ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Saving...
            </>
          ) : (
            <>
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Save
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default ProcessComplianceStep;