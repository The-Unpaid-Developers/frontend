import React, { useState, useEffect } from "react";
import { Button, Input, Card, CardHeader, CardTitle, CardContent, DropDown } from "../../../ui";
import type { StepProps } from "./StepProps";
import { useBusinessCapabilities } from "../../../../hooks/useBusinessCapabilities";

interface BusinessCapability {
  id?: string;
  l1Capability: string;
  l2Capability: string;
  l3Capability: string;
  remarks: string;
}

const BusinessCapabilitiesStep: React.FC<StepProps> = ({
  onSave,
  isSaving = false,
  initialData,
}) => {
  const { data, loading, error } = useBusinessCapabilities();
  
  const [capabilities, setCapabilities] = useState<BusinessCapability[]>([]);
  const [newCapability, setNewCapability] = useState<BusinessCapability>({
    l1Capability: "",
    l2Capability: "",
    l3Capability: "",
    remarks: "",
  });
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  // Determine if we should use fallback mode (text inputs instead of dropdowns)
  const useFallbackMode = !!error;

  // Get filtered options based on current selections (only if data is available)
  const l1Options = data?.l1Options || [];
  const l2Options = data?.getL2OptionsForL1(newCapability.l1Capability) || [];
  const l3Options = data?.getL3OptionsForL1AndL2(newCapability.l1Capability, newCapability.l2Capability) || [];

  useEffect(() => {
    if (initialData?.businessCapabilities) {
      setCapabilities(initialData.businessCapabilities);
    }
  }, [initialData]);

  const addCapability = () => {
    if (!newCapability.l1Capability || !newCapability.l2Capability || !newCapability.l3Capability) {
      return;
    }

    if (editingIndex !== null) {
      // Update existing capability
      const updated = [...capabilities];
      updated[editingIndex] = { ...newCapability };
      setCapabilities(updated);
      setEditingIndex(null);
    } else {
      // Add new capability
      setCapabilities([...capabilities, { ...newCapability, id: `temp-${Date.now()}` }]);
    }
    setNewCapability({
      l1Capability: "",
      l2Capability: "",
      l3Capability: "",
      remarks: "",
    });
  };

  const removeCapability = (index: number) => {
    setCapabilities(capabilities.filter((_, i) => i !== index));
  };

  const startEdit = (index: number) => {
    setEditingIndex(index);
    setNewCapability({ ...capabilities[index] });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEdit = () => {
    setEditingIndex(null);
    setNewCapability({
      l1Capability: "",
      l2Capability: "",
      l3Capability: "",
      remarks: "",
    });
  };

  const updateNewCapability = (field: keyof BusinessCapability, value: string) => {
    setNewCapability(prev => {
      const updated = { ...prev, [field]: value };
      // Reset dependent dropdowns when parent changes (only in dropdown mode)
      if (!useFallbackMode) {
        if (field === 'l1Capability') {
          updated.l2Capability = '';
          updated.l3Capability = '';
        } else if (field === 'l2Capability') {
          updated.l3Capability = '';
        }
      }
      return updated;
    });
  };

  const save = async () => {
    await onSave(capabilities);
  };

  // Render input field based on mode (dropdown or text input)
  const renderCapabilityInput = (
    label: string,
    value: string,
    onChange: (value: string) => void,
    options: Array<{ value: string; label: string }>,
    disabled: boolean = false,
    placeholder: string = ""
  ) => {
    if (useFallbackMode) {
      // Fallback to text input
      return (
        <Input
          placeholder={placeholder}
          value={value}
          onChange={e => onChange(e.target.value)}
          disabled={disabled}
        />
      );
    } else {
      // Use dropdown
      return (
        <DropDown
          placeholder={placeholder}
          value={value}
          onChange={e => onChange(e.target.value)}
          options={options}
          disabled={disabled}
        />
      );
    }
  };

  return (
    <div className="space-y-6">

      {/* Add New Capability Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              {editingIndex !== null ? 'Edit Business Capability' : 'Add Business Capability'}
            </div>
            {editingIndex !== null && (
              <span className="text-sm text-blue-600 font-normal">
                Editing capability #{editingIndex + 1}
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
              <p className="mt-2 text-sm text-gray-600">Loading business capabilities...</p>
            </div>
          )}
          
          {error && (
            <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded mb-4">
              <div className="flex items-start">
                <svg className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <div>
                  <p className="font-medium">Could not load business capabilities from server</p>
                  <p className="text-sm mt-1">You can still enter capabilities manually using text input fields.</p>
                </div>
              </div>
            </div>
          )}
          
          {!loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  L1 Capability <span className="text-red-500">*</span>
                  {useFallbackMode && <span className="ml-1 text-xs text-gray-500">(Manual entry)</span>}
                </label>
                {renderCapabilityInput(
                  "L1 Capability",
                  newCapability.l1Capability,
                  (value) => updateNewCapability('l1Capability', value),
                  l1Options,
                  false,
                  useFallbackMode ? "Enter L1 capability" : "Select L1 capability"
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  L2 Capability <span className="text-red-500">*</span>
                  {useFallbackMode && <span className="ml-1 text-xs text-gray-500">(Manual entry)</span>}
                </label>
                {renderCapabilityInput(
                  "L2 Capability",
                  newCapability.l2Capability,
                  (value) => updateNewCapability('l2Capability', value),
                  l2Options,
                  !useFallbackMode && !newCapability.l1Capability,
                  useFallbackMode ? "Enter L2 capability" : "Select L2 capability"
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  L3 Capability <span className="text-red-500">*</span>
                  {useFallbackMode && <span className="ml-1 text-xs text-gray-500">(Manual entry)</span>}
                </label>
                {renderCapabilityInput(
                  "L3 Capability",
                  newCapability.l3Capability,
                  (value) => updateNewCapability('l3Capability', value),
                  l3Options,
                  !useFallbackMode && (!newCapability.l1Capability || !newCapability.l2Capability),
                  useFallbackMode ? "Enter L3 capability" : "Select L3 capability"
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Remarks
                </label>
                <Input
                  placeholder="Enter remarks"
                  value={newCapability.remarks}
                  onChange={e => updateNewCapability('remarks', e.target.value)}
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
              onClick={addCapability}
              disabled={!newCapability.l1Capability || !newCapability.l2Capability || !newCapability.l3Capability}
              variant="secondary"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={editingIndex !== null ? "M5 13l4 4L19 7" : "M12 4v16m8-8H4"} />
              </svg>
              {editingIndex !== null ? 'Update Capability' : 'Add Capability'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Current Capabilities Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              Business Capabilities ({capabilities.length})
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {capabilities.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <svg className="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <p>No business capabilities added yet</p>
              <p className="text-sm">Add your first capability above</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      L1 Capability
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      L2 Capability
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      L3 Capability
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Remarks
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {capabilities.map((capability, index) => (
                    <tr key={capability.id || index} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-900">{capability.l1Capability}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{capability.l2Capability}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{capability.l3Capability}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{capability.remarks ?? '—'}</td>
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
                            onClick={() => removeCapability(index)}
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

export default BusinessCapabilitiesStep;