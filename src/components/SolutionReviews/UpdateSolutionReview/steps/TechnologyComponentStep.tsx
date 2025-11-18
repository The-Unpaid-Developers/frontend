import React, { useState, useEffect } from "react";
import { Button, Input, DropDown, Card, CardHeader, CardTitle, CardContent } from "../../../ui";
import type { StepProps } from "./StepProps";
import type { TechnologyComponent } from "../../../../types/solutionReview";
import { USAGE_OPTIONS } from "../../DropDownListValues";
import { useTechComponents } from "../../../../hooks/useTechComponents";

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
  const { data, loading, error } = useTechComponents();
  
  const initialList: TechnologyComponent[] = initialData.technologyComponents;
  const [list, setList] = useState<TechnologyComponent[]>(
    () => initialList ?? []
  );
  const [row, setRow] = useState<TechnologyComponent>(empty);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  // Determine if we should use fallback mode (text inputs instead of dropdowns)
  const useFallbackMode = !!error;

  // Get version options based on current product selection (only if data is available)
  const versionOptionsForNew = data?.getVersionOptionsForProduct(row.productName) || [];
  const productNameOptions = data?.productNameOptions || [];

  useEffect(() => {
    if (initialData.technologyComponents) {
      setList(initialData.technologyComponents);
    }
  }, [initialData.technologyComponents]);

  const update = (k: keyof TechnologyComponent, v: any) => {
    setRow((r) => {
      const updated = { ...r, [k]: v };
      // Reset product version when product name changes (only in dropdown mode)
      if (!useFallbackMode && k === 'productName') {
        updated.productVersion = '';
      }
      return updated;
    });
  };

  const addComponent = () => {
    if (!row.componentName || !row.productName || !row.usage) return;

    if (editingIndex !== null) {
      // Update existing component
      const updated = [...list];
      updated[editingIndex] = { ...row };
      setList(updated);
      setEditingIndex(null);
    } else {
      // Add new component
      setList([...list, { ...row }]);
    }
    setRow(empty);
  };

  const removeComponent = (index: number) => {
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

  // Render input field based on mode (dropdown or text input)
  const renderProductNameInput = (
    value: string,
    onChange: (value: string) => void,
    disabled: boolean = false
  ) => {
    if (useFallbackMode) {
      return (
        <Input
          placeholder="Enter product name"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
        />
      );
    } else {
      return (
        <DropDown
          placeholder="Select product"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          options={productNameOptions}
          disabled={disabled}
        />
      );
    }
  };

  const renderProductVersionInput = (
    value: string,
    onChange: (value: string) => void,
    productName: string,
    disabled: boolean = false
  ) => {
    if (useFallbackMode) {
      return (
        <Input
          placeholder="Enter product version"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
        />
      );
    } else {
      const options = productName && data ? data.getVersionOptionsForProduct(productName) : [];
      return (
        <DropDown
          placeholder="Select version"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          options={options}
          disabled={disabled || !productName}
        />
      );
    }
  };

  return (
    <div className="space-y-6">
      {/* Add/Edit Technology Component Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
              </svg>
              {editingIndex !== null ? 'Edit Technology Component' : 'Add Technology Component'}
            </div>
            {editingIndex !== null && (
              <span className="text-sm text-blue-600 font-normal">
                Editing component #{editingIndex + 1}
              </span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading && (
            <div className="text-center py-4">
              <div className="animate-spin inline-block w-6 h-6 border-[3px] border-current border-t-transparent text-blue-600 rounded-full" role="status" aria-label="loading">
                <span className="sr-only">Loading...</span>
              </div>
              <p className="mt-2 text-sm text-gray-600">Loading tech components...</p>
            </div>
          )}
          
          {error && (
            <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded mb-4">
              <div className="flex items-start">
                <svg className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <div>
                  <p className="font-medium">Could not load tech components from server</p>
                  <p className="text-sm mt-1">You can still enter product information manually using text input fields.</p>
                </div>
              </div>
            </div>
          )}
          
          {!loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
                  Product Name <span className="text-red-500">*</span>
                  {useFallbackMode && <span className="ml-1 text-xs text-gray-500">(Manual entry)</span>}
                </label>
                {renderProductNameInput(
                  row.productName,
                  (value) => update("productName", value)
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Product Version <span className="text-red-500">*</span>
                  {useFallbackMode && <span className="ml-1 text-xs text-gray-500">(Manual entry)</span>}
                </label>
                {renderProductVersionInput(
                  row.productVersion,
                  (value) => update("productVersion", value),
                  row.productName
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Usage <span className="text-red-500">*</span>
                </label>
                <DropDown
                  placeholder="Select usage"
                  value={row.usage}
                  onChange={(e) => update("usage", e.target.value)}
                  options={USAGE_OPTIONS}
                />
              </div>
            </div>
          )}

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
              onClick={addComponent}
              disabled={!row.componentName || !row.productName || !row.usage}
              variant="secondary"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={editingIndex !== null ? "M5 13l4 4L19 7" : "M12 4v16m8-8H4"} />
              </svg>
              {editingIndex !== null ? 'Update Component' : 'Add Component'}
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