import React, { useState, useEffect } from "react";
import { Button, Input, DropDown, Card, CardHeader, CardTitle, CardContent } from "../../ui";
import type { StepProps } from "./StepProps";
import {
  L1_CAPABILITY_OPTIONS,
  L2_CAPABILITY_OPTIONS,
  L3_CAPABILITY_OPTIONS,
} from "./DropDownListValues";

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
  const [capabilities, setCapabilities] = useState<BusinessCapability[]>([]);
  const [newCapability, setNewCapability] = useState<BusinessCapability>({
    l1Capability: "",
    l2Capability: "",
    l3Capability: "",
    remarks: "",
  });
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingCapability, setEditingCapability] = useState<BusinessCapability | null>(null);

  useEffect(() => {
    if (initialData?.businessCapabilities) {
      setCapabilities(initialData.businessCapabilities);
    }
  }, [initialData]);

  const addCapability = () => {
    if (!newCapability.l1Capability || !newCapability.l2Capability || !newCapability.l3Capability) {
      return;
    }
    
    setCapabilities([...capabilities, { ...newCapability, id: `temp-${Date.now()}` }]);
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
    setEditingCapability({ ...capabilities[index] });
  };

  const saveEdit = () => {
    if (editingIndex !== null && editingCapability) {
      const updated = [...capabilities];
      updated[editingIndex] = editingCapability;
      setCapabilities(updated);
      setEditingIndex(null);
      setEditingCapability(null);
    }
  };

  const cancelEdit = () => {
    setEditingIndex(null);
    setEditingCapability(null);
  };

  const updateNewCapability = (field: keyof BusinessCapability, value: string) => {
    setNewCapability(prev => ({ ...prev, [field]: value }));
  };

  const updateEditingCapability = (field: keyof BusinessCapability, value: string) => {
    setEditingCapability(prev => prev ? { ...prev, [field]: value } : null);
  };

  const save = async () => {
    await onSave(capabilities);
  };

  return (
    <div className="space-y-6">

      {/* Add New Capability Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <svg className="w-5 h-5 mr-2 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Business Capability
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                L1 Capability <span className="text-red-500">*</span>
                <DropDown
                  placeholder="Select L1 capability"
                  value={newCapability.l1Capability}
                  onChange={e => updateNewCapability('l1Capability', e.target.value)}
                  options={L1_CAPABILITY_OPTIONS}
                />
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                L2 Capability <span className="text-red-500">*</span>
                <DropDown
                  placeholder="Select L2 capability"
                  value={newCapability.l2Capability}
                  onChange={e => updateNewCapability('l2Capability', e.target.value)}
                  options={L2_CAPABILITY_OPTIONS}
                />
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                L3 Capability <span className="text-red-500">*</span>
                <DropDown
                  placeholder="Select L3 capability"
                  value={newCapability.l3Capability}
                  onChange={e => updateNewCapability('l3Capability', e.target.value)}
                  options={L3_CAPABILITY_OPTIONS}
                />
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Remarks
                <Input
                  placeholder="Enter remarks"
                  value={newCapability.remarks}
                  onChange={e => updateNewCapability('remarks', e.target.value)}
                />
              </label>
            </div>
          </div>

          <div className="mt-4 flex justify-end">
            <Button
              onClick={addCapability}
              disabled={!newCapability.l1Capability || !newCapability.l2Capability || !newCapability.l3Capability}
              variant="secondary"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Capability
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
                      {editingIndex === index && editingCapability ? (
                        // Edit mode
                        <>
                          <td className="px-4 py-3">
                            <DropDown
                              value={editingCapability.l1Capability}
                              onChange={e => updateEditingCapability('l1Capability', e.target.value)}
                              options={L1_CAPABILITY_OPTIONS}
                            />
                          </td>
                          <td className="px-4 py-3">
                            <DropDown
                              value={editingCapability.l2Capability}
                              onChange={e => updateEditingCapability('l2Capability', e.target.value)}
                              options={L2_CAPABILITY_OPTIONS}
                            />
                          </td>
                          <td className="px-4 py-3">
                            <DropDown
                              value={editingCapability.l3Capability}
                              onChange={e => updateEditingCapability('l3Capability', e.target.value)}
                              options={L3_CAPABILITY_OPTIONS}
                            />
                          </td>
                          <td className="px-4 py-3">
                            <Input
                              value={editingCapability.remarks}
                              onChange={e => updateEditingCapability('remarks', e.target.value)}
                              placeholder="Enter remarks"
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

export default BusinessCapabilitiesStep;