import React, { useState, useEffect } from "react";
import { Button, Input, DropDown, Card, CardHeader, CardTitle, CardContent } from "../../../ui";
import type { StepProps } from "./StepProps";
import type { TechnologyComponent } from "../../../../types/solutionReview";
import { USAGE_OPTIONS } from "../../DropDownListValues";

const empty: TechnologyComponent = {
  componentName: "",
  productName: "",
  productVersion: "",
  usage: "",
};

const TechnologyComponentStep: React.FC<StepProps> = ({
  onSave,
  isSaving = false,
  initialData,
}) => {
  const initialList: TechnologyComponent[] = initialData.technologyComponents;
  const [list, setList] = useState<TechnologyComponent[]>(
    () => initialList ?? []
  );
  const [row, setRow] = useState<TechnologyComponent>(empty);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingComponent, setEditingComponent] = useState<TechnologyComponent | null>(null);

  useEffect(() => {
    if (initialData.technologyComponents) {
      setList(initialData.technologyComponents);
    }
  }, [initialData.technologyComponents]);

  const update = (k: keyof TechnologyComponent, v: any) =>
    setRow((r) => ({ ...r, [k]: v }));

  const addComponent = () => {
    if (!row.componentName || !row.productName || !row.usage) return;
    
    setList([...list, { ...row, id: `temp-${Date.now()}` }]);
    setRow(empty);
  };

  const removeComponent = (index: number) => {
    setList(list.filter((_, i) => i !== index));
  };

  const startEdit = (index: number) => {
    setEditingIndex(index);
    setEditingComponent({ ...list[index] });
  };

  const saveEdit = () => {
    if (editingIndex !== null && editingComponent) {
      const updated = [...list];
      updated[editingIndex] = editingComponent;
      setList(updated);
      setEditingIndex(null);
      setEditingComponent(null);
    }
  };

  const cancelEdit = () => {
    setEditingIndex(null);
    setEditingComponent(null);
  };

  const updateEditingComponent = (field: keyof TechnologyComponent, value: string) => {
    setEditingComponent(prev => prev ? { ...prev, [field]: value } : null);
  };

  const save = async () => {
    await onSave(list);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      {/* <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Technology Components</h2>
        <p className="text-gray-600">Define the technology components and products used in your solution</p>
      </div> */}

      {/* Add Technology Component Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <svg className="w-5 h-5 mr-2 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
            </svg>
            Add Technology Component
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Component Name <span className="text-red-500">*</span>
                <Input
                  placeholder="Enter component name"
                  value={row.componentName}
                  onChange={(e) => update("componentName", e.target.value)}
                />
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Product Name <span className="text-red-500">*</span>
                <Input
                  placeholder="Enter product name"
                  value={row.productName}
                  onChange={(e) => update("productName", e.target.value)}
                />
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Product Version
                <Input
                  placeholder="Enter product version"
                  value={row.productVersion}
                  onChange={(e) => update("productVersion", e.target.value)}
                />
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Usage <span className="text-red-500">*</span>
                <DropDown
                  placeholder="Select usage"
                  value={row.usage}
                  onChange={(e) => update("usage", e.target.value)}
                  options={USAGE_OPTIONS}
                />
              </label>
            </div>
          </div>

          <div className="mt-4 flex justify-end">
            <Button
              onClick={addComponent}
              disabled={!row.componentName || !row.productName || !row.usage}
              variant="secondary"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Component
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Current Technology Components */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <svg className="w-5 h-5 mr-2 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
            </svg>
            Technology Components ({list.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {list.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <svg className="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
              </svg>
              <p>No technology components added yet</p>
              <p className="text-sm">Add your first component above</p>
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
                      Product Name
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Product Version
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Usage
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {list.map((component, index) => (
                    <tr key={(component as any).id || `tech-${component.componentName}-${component.productName}-${index}`} className="hover:bg-gray-50">
                      {editingIndex === index && editingComponent ? (
                        // Edit mode
                        <>
                          <td className="px-4 py-3">
                            <Input
                              value={editingComponent.componentName}
                              onChange={e => updateEditingComponent('componentName', e.target.value)}
                              placeholder="Component name"
                            />
                          </td>
                          <td className="px-4 py-3">
                            <Input
                              value={editingComponent.productName}
                              onChange={e => updateEditingComponent('productName', e.target.value)}
                              placeholder="Product name"
                            />
                          </td>
                          <td className="px-4 py-3">
                            <Input
                              value={editingComponent.productVersion}
                              onChange={e => updateEditingComponent('productVersion', e.target.value)}
                              placeholder="Product version"
                            />
                          </td>
                          <td className="px-4 py-3">
                            <DropDown
                              value={editingComponent.usage}
                              onChange={e => updateEditingComponent('usage', e.target.value)}
                              options={USAGE_OPTIONS}
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
                          <td className="px-4 py-3 text-sm font-medium text-gray-900">{component.componentName}</td>
                          <td className="px-4 py-3 text-sm text-gray-900">{component.productName}</td>
                          <td className="px-4 py-3 text-sm text-gray-900">{component.productVersion || '—'}</td>
                          <td className="px-4 py-3 text-sm text-gray-900">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              {component.usage}
                            </span>
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
                                onClick={() => removeComponent(index)}
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

export default TechnologyComponentStep;