import React, { useState, useEffect } from "react";
import { Button, Input, DropDown, Card, CardHeader, CardTitle, CardContent } from "../../ui";
import type { StepProps } from "./StepProps";
import { CLASSIFICATION_OPTIONS } from "./DropDownListValues";
import type { DataAsset } from "../../../types/solutionReview";

const empty: DataAsset = {
  componentName: "",
  dataDomain: "",
  dataClassification: "",
  dataOwnedBy: "",
  dataEntities: [],
  masteredIn: "",
};

const DataAssetStep: React.FC<StepProps> = ({
  onSave,
  isSaving = false,
  initialData,
}) => {
  const initialList: DataAsset[] | null | undefined = initialData.dataAssets;
  const [list, setList] = useState<DataAsset[]>(() => initialList ?? []);
  const [row, setRow] = useState<DataAsset>(empty);
  const [entity, setEntity] = useState("");
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingAsset, setEditingAsset] = useState<DataAsset | null>(null);

  useEffect(() => {
    if (initialData.dataAssets) {
      setList(initialData.dataAssets);
    }
  }, [initialData.dataAssets]);

  const update = (k: keyof DataAsset, v: any) =>
    setRow((r) => ({ ...r, [k]: v }));

  const addEntity = () => {
    if (!entity.trim()) return;
    update("dataEntities", [...row.dataEntities, entity.trim()]);
    setEntity("");
  };

  const removeEntity = (e: string) => {
    update(
      "dataEntities",
      row.dataEntities.filter((x) => x !== e)
    );
  };

  const addAsset = () => {
    if (!row.componentName || !row.dataDomain || !row.dataClassification) return;
    
    setList([...list, { ...row, id: `temp-${Date.now()}` }]);
    setRow(empty);
    setEntity("");
  };

  const removeAsset = (index: number) => {
    setList(list.filter((_, i) => i !== index));
  };

  const startEdit = (index: number) => {
    setEditingIndex(index);
    setEditingAsset({ ...list[index] });
  };

  const saveEdit = () => {
    if (editingIndex !== null && editingAsset) {
      const updated = [...list];
      updated[editingIndex] = editingAsset;
      setList(updated);
      setEditingIndex(null);
      setEditingAsset(null);
    }
  };

  const cancelEdit = () => {
    setEditingIndex(null);
    setEditingAsset(null);
  };

  const updateEditingAsset = (field: keyof DataAsset, value: any) => {
    setEditingAsset(prev => prev ? { ...prev, [field]: value } : null);
  };

  const addEntityToEditingAsset = () => {
    if (!entity.trim() || !editingAsset) return;
    updateEditingAsset("dataEntities", [...editingAsset.dataEntities, entity.trim()]);
    setEntity("");
  };

  const removeEntityFromEditingAsset = (e: string) => {
    if (!editingAsset) return;
    updateEditingAsset(
      "dataEntities",
      editingAsset.dataEntities.filter((x) => x !== e)
    );
  };

  const save = async () => {
    await onSave(list);
  };

  return (
    <div className="space-y-6">

      {/* Add New Data Asset Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <svg className="w-5 h-5 mr-2 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
            </svg>
            Add Data Asset
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Basic Information */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Asset Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
                    Data Domain <span className="text-red-500">*</span>
                    <Input
                      placeholder="Enter data domain"
                      value={row.dataDomain}
                      onChange={(e) => update("dataDomain", e.target.value)}
                    />
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Data Classification <span className="text-red-500">*</span>
                    <DropDown
                      placeholder="Select data classification"
                      value={row.dataClassification}
                      onChange={(e) => update("dataClassification", e.target.value)}
                      options={CLASSIFICATION_OPTIONS}
                    />
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Data Owned By
                    <Input
                      placeholder="Enter data owner"
                      value={row.dataOwnedBy}
                      onChange={(e) => update("dataOwnedBy", e.target.value)}
                    />
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mastered In
                    <Input
                      placeholder="Enter mastered system"
                      value={row.masteredIn}
                      onChange={(e) => update("masteredIn", e.target.value)}
                    />
                  </label>
                </div>
              </div>
            </div>

            {/* Data Entities */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Data Entities</h3>
              <div className="space-y-4">
                <div className="flex gap-2">
                  <div className="flex-1">
                    <label className="block">
                      <Input
                        value={entity}
                        onChange={(e) => setEntity(e.target.value)}
                        placeholder="Enter data entity name"
                        onKeyPress={(e) => e.key === 'Enter' && addEntity()}
                      />
                    </label>
                  </div>
                  <Button
                    type="button"
                    onClick={addEntity}
                    disabled={!entity.trim()}
                    variant="secondary"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Add Entity
                  </Button>
                </div>

                {row.dataEntities.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">
                      Data Entities ({row.dataEntities.length}):
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {row.dataEntities.map((de) => (
                        <div key={de} className="flex items-center bg-primary-50 text-primary-700 px-3 py-1 rounded-full text-sm">
                          <span>{de}</span>
                          <button
                            type="button"
                            onClick={() => removeEntity(de)}
                            className="ml-2 text-primary-500 hover:text-primary-700"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-4 flex justify-end">
              <Button
                onClick={addAsset}
                disabled={!row.componentName || !row.dataDomain || !row.dataClassification}
                variant="secondary"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add Asset
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Current Data Assets */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <svg className="w-5 h-5 mr-2 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
            </svg>
            Data Assets ({list.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {list.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <svg className="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
              </svg>
              <p>No data assets added yet</p>
              <p className="text-sm">Add your first asset above</p>
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
                      Data Domain
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Classification
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Owner
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Mastered In
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Entities
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {list.map((asset, index) => (
                    <tr key={(asset as any).id || `asset-${asset.componentName}-${asset.dataDomain}-${index}`} className="hover:bg-gray-50">
                      {editingIndex === index && editingAsset ? (
                        // Edit mode
                        <>
                          <td className="px-4 py-3">
                            <Input
                              value={editingAsset.componentName}
                              onChange={e => updateEditingAsset('componentName', e.target.value)}
                              placeholder="Component name"
                            />
                          </td>
                          <td className="px-4 py-3">
                            <Input
                              value={editingAsset.dataDomain}
                              onChange={e => updateEditingAsset('dataDomain', e.target.value)}
                              placeholder="Data domain"
                            />
                          </td>
                          <td className="px-4 py-3">
                            <DropDown
                              value={editingAsset.dataClassification}
                              onChange={e => updateEditingAsset('dataClassification', e.target.value)}
                              options={CLASSIFICATION_OPTIONS}
                            />
                          </td>
                          <td className="px-4 py-3">
                            <Input
                              value={editingAsset.dataOwnedBy}
                              onChange={e => updateEditingAsset('dataOwnedBy', e.target.value)}
                              placeholder="Data owner"
                            />
                          </td>
                          <td className="px-4 py-3">
                            <Input
                              value={editingAsset.masteredIn}
                              onChange={e => updateEditingAsset('masteredIn', e.target.value)}
                              placeholder="Mastered in"
                            />
                          </td>
                          <td className="px-4 py-3">
                            <div className="space-y-2">
                              <div className="flex gap-1">
                                <Input
                                  value={entity}
                                  onChange={(e) => setEntity(e.target.value)}
                                  placeholder="Add entity"
                                />
                                <Button
                                  size="sm"
                                  onClick={addEntityToEditingAsset}
                                  disabled={!entity.trim()}
                                >
                                  +
                                </Button>
                              </div>
                              {editingAsset.dataEntities.length > 0 && (
                                <div className="flex flex-wrap gap-1">
                                  {editingAsset.dataEntities.map((e, idx) => (
                                    <span key={e} className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-blue-100 text-blue-800">
                                      {e}
                                      <button
                                        onClick={() => removeEntityFromEditingAsset(e)}
                                        className="ml-1 text-blue-600 hover:text-blue-800"
                                      >
                                        ×
                                      </button>
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
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
                          <td className="px-4 py-3 text-sm font-medium text-gray-900">
                            {asset.componentName}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-900">
                            {asset.dataDomain}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-900">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800`}>
                              {asset.dataClassification}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-900">
                            {asset.dataOwnedBy ?? '—'}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-900">
                            {asset.masteredIn ?? '—'}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-900">
                            {asset.dataEntities.length > 0 ? (
                              <div className="max-w-xs">
                                <div className="flex flex-wrap gap-1">
                                  {asset.dataEntities.slice(0, 2).map((entity, idx) => (
                                    <span key={entity} className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-blue-100 text-blue-800">
                                      {entity}
                                    </span>
                                  ))}
                                  {asset.dataEntities.length > 2 && (
                                    <span className="text-xs text-gray-500">
                                      +{asset.dataEntities.length - 2} more
                                    </span>
                                  )}
                                </div>
                              </div>
                            ) : (
                              '—'
                            )}
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
                                onClick={() => removeAsset(index)}
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

export default DataAssetStep;