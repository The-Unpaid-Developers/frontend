import React, { useState, useEffect } from "react";
import { Button, Input, DropDown, Card, CardHeader, CardTitle, CardContent } from "../../../ui";
import type { StepProps } from "./StepProps";
import type { EnterpriseTool } from "../../../../types/solutionReview";
import {
  ONBOARDING_STATUS_OPTIONS,
  TOOL_TYPE_OPTIONS,
} from "../../DropDownListValues";

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
  const initialList: EnterpriseTool[] | null | undefined = initialData.enterpriseTools;
  const [list, setList] = useState<EnterpriseTool[]>(() => initialList ?? []);
  const [row, setRow] = useState<EnterpriseTool>(empty);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  useEffect(() => {
    if (initialData.enterpriseTools) {
      setList(initialData.enterpriseTools);
    }
  }, [initialData.enterpriseTools]);

  const update = (k: keyof EnterpriseTool, v: string) =>
    setRow((r) => ({ ...r, [k]: v }));

  const updateTool = <K extends keyof EnterpriseTool["tool"]>(
    k: K,
    v: EnterpriseTool["tool"][K]
  ) => setRow((r) => ({ ...r, tool: { ...r.tool, [k]: v } }));

  const addTool = () => {
    if (!row.tool.name || !row.tool.type) return;

    if (editingIndex !== null) {
      // Update existing tool
      const updated = [...list];
      updated[editingIndex] = { ...row };
      setList(updated);
      setEditingIndex(null);
    } else {
      // Add new tool
      setList([...list, { ...row, id: `temp-${Date.now()}` }]);
    }
    setRow(empty);
  };

  const removeTool = (index: number) => {
    setList(list.filter((_, i) => i !== index));
  };

  const startEdit = (index: number) => {
    setEditingIndex(index);
    setRow({ ...list[index] });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEdit = () => {
    setEditingIndex(null);
    setRow(empty);
  };

  const save = async () => {
    await onSave(list);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      {/* <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Enterprise Tools</h2>
        <p className="text-gray-600">Define the enterprise tools that your solution will integrate with</p>
      </div> */}

      {/* Add/Edit Enterprise Tool Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {editingIndex !== null ? 'Edit Enterprise Tool' : 'Add Enterprise Tool'}
            </div>
            {editingIndex !== null && (
              <span className="text-sm text-blue-600 font-normal">
                Editing tool #{editingIndex + 1}
              </span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tool Name <span className="text-red-500">*</span>
                  <Input
                    placeholder="Enter tool name"
                    value={row.tool.name}
                    onChange={(e) => updateTool("name", e.target.value)}
                  />
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tool Type <span className="text-red-500">*</span>
                  <DropDown
                    placeholder="Select tool type"
                    value={row.tool.type}
                    onChange={(e) => updateTool("type", e.target.value)}
                    options={TOOL_TYPE_OPTIONS}
                  />
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Onboarding Status <span className="text-red-500">*</span>
                  <DropDown
                    placeholder="Select status"
                    value={row.onboarded}
                    onChange={(e) => update("onboarded", e.target.value)}
                    options={ONBOARDING_STATUS_OPTIONS}
                  />
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Integration Details
                  <Input
                    placeholder="Enter integration details"
                    value={row.integrationDetails}
                    onChange={(e) => update("integrationDetails", e.target.value)}
                  />
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Issues
                  <Input
                    placeholder="Enter any issues"
                    value={row.issues}
                    onChange={(e) => update("issues", e.target.value)}
                  />
                </label>
              </div>
            </div>

            <div className="mt-4 flex justify-end gap-2">
              {editingIndex !== null && (
                <Button
                  onClick={cancelEdit}
                  variant="ghost"
                >
                  Cancel
                </Button>
              )}
              <Button
                onClick={addTool}
                disabled={!row.tool.name || !row.tool.type}
                variant="secondary"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={editingIndex !== null ? "M5 13l4 4L19 7" : "M12 4v16m8-8H4"} />
                </svg>
                {editingIndex !== null ? 'Update Tool' : 'Add Tool'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Current Enterprise Tools */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <svg className="w-5 h-5 mr-2 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Enterprise Tools ({list.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {list.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <svg className="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <p>No enterprise tools added yet</p>
              <p className="text-sm">Add your first tool above</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tool Name
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tool Type
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Integration Details
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Issues
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {list.map((tool, index) => (
                    <tr key={tool.id || index} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">
                        {tool.tool.name}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {tool.tool.type}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800`}>
                          {tool.onboarded ?? 'N/A'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {tool.integrationDetails ?? '—'}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {tool.issues ?? '—'}
                      </td>
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
                            onClick={() => removeTool(index)}
                            className="text-red-600 hover:text-red-900 transition-colors"
                            title="Delete"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </td>
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

export default EnterpriseToolsStep;