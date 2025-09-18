import React, { useState, useEffect } from "react";
import { Button, DropDown, Input, Card, CardHeader, CardTitle, CardContent } from "../../ui";
import type { StepProps } from "./StepProps";
import type { IntegrationFlow } from "../../../types/solutionReview";
import {
  COUNTERPART_SYSTEM_ROLE_OPTIONS,
  INTEGRATION_METHOD_OPTIONS,
  FREQUENCY_OPTIONS,
} from "./DropDownListValues";

const empty: IntegrationFlow = {
  componentName: "",
  counterpartSystemCode: "",
  counterpartSystemRole: "",
  integrationMethod: "",
  frequency: "",
  purpose: "",
};

const IntegrationFlowStep: React.FC<StepProps> = ({
  onSave,
  isSaving = false,
  initialData,
}) => {
  const initialList: IntegrationFlow[] | null | undefined = initialData.integrationFlows;
  const [list, setList] = useState<IntegrationFlow[]>(() => initialList ?? []);
  const [row, setRow] = useState<IntegrationFlow>(empty);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingFlow, setEditingFlow] = useState<IntegrationFlow | null>(null);

  useEffect(() => {
    if (initialData.integrationFlows) {
      setList(initialData.integrationFlows);
    }
  }, [initialData.integrationFlows]);

  const update = (k: keyof IntegrationFlow, v: string) =>
    setRow((r) => ({ ...r, [k]: v }));

  const addFlow = () => {
    if (!row.componentName || !row.counterpartSystemCode) return;
    
    setList([...list, { ...row, id: `temp-${Date.now()}` }]);
    setRow(empty);
  };

  const removeFlow = (index: number) => {
    setList(list.filter((_, i) => i !== index));
  };

  const startEdit = (index: number) => {
    setEditingIndex(index);
    setEditingFlow({ ...list[index] });
  };

  const saveEdit = () => {
    if (editingIndex !== null && editingFlow) {
      const updated = [...list];
      updated[editingIndex] = editingFlow;
      setList(updated);
      setEditingIndex(null);
      setEditingFlow(null);
    }
  };

  const cancelEdit = () => {
    setEditingIndex(null);
    setEditingFlow(null);
  };

  const updateEditingFlow = (field: keyof IntegrationFlow, value: string) => {
    setEditingFlow(prev => prev ? { ...prev, [field]: value } : null);
  };

  const save = async () => {
    await onSave(list);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      {/* <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Integration Flow</h2>
        <p className="text-gray-600">Define the integration flows between your solution components and external systems</p>
      </div> */}

      {/* Add Integration Flow Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <svg className="w-5 h-5 mr-2 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
            </svg>
            Add Integration Flow
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Component Name <span className="text-red-500">*</span>
                </label>
                <Input
                  placeholder="Enter component name"
                  value={row.componentName}
                  onChange={(e) => update("componentName", e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Counterpart System Code <span className="text-red-500">*</span>
                </label>
                <Input
                  placeholder="Enter counterpart system code"
                  value={row.counterpartSystemCode}
                  onChange={(e) => update("counterpartSystemCode", e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Counterpart System Role
                </label>
                <DropDown
                  placeholder="Select system role"
                  value={row.counterpartSystemRole}
                  onChange={(e) => update("counterpartSystemRole", e.target.value)}
                  options={COUNTERPART_SYSTEM_ROLE_OPTIONS}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Integration Method
                </label>
                <DropDown
                  placeholder="Select integration method"
                  value={row.integrationMethod}
                  onChange={(e) => update("integrationMethod", e.target.value)}
                  options={INTEGRATION_METHOD_OPTIONS}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Frequency
                </label>
                <DropDown
                  placeholder="Select frequency"
                  value={row.frequency}
                  onChange={(e) => update("frequency", e.target.value)}
                  options={FREQUENCY_OPTIONS}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Purpose
                </label>
                <Input
                  placeholder="Enter integration purpose"
                  value={row.purpose}
                  onChange={(e) => update("purpose", e.target.value)}
                />
              </div>
            </div>

            <div className="flex justify-end">
              <Button
                onClick={addFlow}
                disabled={!row.componentName || !row.counterpartSystemCode}
                variant="secondary"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add Flow
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Current Integration Flows */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <svg className="w-5 h-5 mr-2 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
            </svg>
            Integration Flows ({list.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {list.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <svg className="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
              </svg>
              <p>No integration flows added yet</p>
              <p className="text-sm">Add your first integration flow above</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Component Name
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Counterpart System
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      System Role
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Integration Method
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Frequency
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Purpose
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {list.map((flow, index) => (
                    <tr key={flow.id || index} className="hover:bg-gray-50">
                      {editingIndex === index && editingFlow ? (
                        // Edit mode
                        <>
                          <td className="px-4 py-3">
                            <Input
                              value={editingFlow.componentName}
                              onChange={e => updateEditingFlow('componentName', e.target.value)}
                              placeholder="Component name"
                            />
                          </td>
                          <td className="px-4 py-3">
                            <Input
                              value={editingFlow.counterpartSystemCode}
                              onChange={e => updateEditingFlow('counterpartSystemCode', e.target.value)}
                              placeholder="Counterpart system"
                            />
                          </td>
                          <td className="px-4 py-3">
                            <DropDown
                              value={editingFlow.counterpartSystemRole}
                              onChange={e => updateEditingFlow('counterpartSystemRole', e.target.value)}
                              options={COUNTERPART_SYSTEM_ROLE_OPTIONS}
                            />
                          </td>
                          <td className="px-4 py-3">
                            <DropDown
                              value={editingFlow.integrationMethod}
                              onChange={e => updateEditingFlow('integrationMethod', e.target.value)}
                              options={INTEGRATION_METHOD_OPTIONS}
                            />
                          </td>
                          <td className="px-4 py-3">
                            <DropDown
                              value={editingFlow.frequency}
                              onChange={e => updateEditingFlow('frequency', e.target.value)}
                              options={FREQUENCY_OPTIONS}
                            />
                          </td>
                          <td className="px-4 py-3">
                            <Input
                              value={editingFlow.purpose}
                              onChange={e => updateEditingFlow('purpose', e.target.value)}
                              placeholder="Purpose"
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
                          <td className="px-4 py-3 text-sm font-medium text-gray-900">{flow.componentName}</td>
                          <td className="px-4 py-3 text-sm text-gray-900">{flow.counterpartSystemCode}</td>
                          <td className="px-4 py-3 text-sm text-gray-900">
                            {flow.counterpartSystemRole ? (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                {flow.counterpartSystemRole}
                              </span>
                            ) : '—'}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-900">
                            {flow.integrationMethod ? (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                {flow.integrationMethod}
                              </span>
                            ) : '—'}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-900">
                            {flow.frequency ? (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                {flow.frequency}
                              </span>
                            ) : '—'}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-900">{flow.purpose || '—'}</td>
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
                                onClick={() => removeFlow(index)}
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

export default IntegrationFlowStep;