import React, { useState, useEffect } from "react";
import { Button, Input, DropDown, Card, CardHeader, CardTitle, CardContent } from "../../ui";
import type { StepProps } from "./StepProps";
import type { SystemComponent } from "../../../types/solutionReview";
import {
  COMPONENT_STATUS_OPTIONS,
  COMPONENT_ROLE_OPTIONS,
  HOSTING_REGION_OPTIONS,
  SOLUTION_TYPE_OPTIONS,
  CUSTOMIZATION_LEVEL_OPTIONS,
  UPGRADE_STRATEGY_OPTIONS,
  AVAILABILITY_REQUIREMENT_OPTIONS,
  SCALABILITY_METHOD_OPTIONS,
  BACKUP_SITE_OPTIONS,
  DATA_ENCRYPTION_AT_REST_OPTIONS,
  SSL_TYPE_OPTIONS,
  FRAMEWORK_OPTIONS,
  LANGUAGE_OPTIONS,
  LOCATION_OPTIONS,
  FREQUENCY_OPTIONS,
} from "./DropDownListValues";

const empty: SystemComponent = {
  name: "",
  status: "",
  role: "",
  hostedOn: "",
  hostingRegion: "",
  solutionType: "",
  languageFramework: {
    language: { name: "", version: "" },
    framework: { name: "", version: "" },
  },
  isOwnedByUs: false,
  isCICDUsed: false,
  customizationLevel: "",
  upgradeStrategy: "",
  upgradeFrequency: "",
  isSubscription: false,
  isInternetFacing: false,
  availabilityRequirement: "",
  latencyRequirement: 0,
  throughputRequirement: 0,
  scalabilityMethod: "",
  backupSite: "",
  securityDetails: {
    authenticationMethod: "",
    authorizationModel: "",
    isAuditLoggingEnabled: false,
    sensitiveDataElements: "",
    dataEncryptionAtRest: "",
    encryptionAlgorithmForDataAtRest: "",
    hasIpWhitelisting: false,
    ssl: "",
    payloadEncryptionAlgorithm: "",
    digitalCertificate: "",
    keyStore: "",
    vulnerabilityAssessmentFrequency: "",
    penetrationTestingFrequency: "",
  },
};

const SystemComponentStep: React.FC<StepProps> = ({
  onSave,
  isSaving = false,
  initialData,
}) => {
  const initialList: SystemComponent[] | null | undefined = initialData.systemComponents;
  const [list, setList] = useState<SystemComponent[]>(() => initialList ?? []);
  const [row, setRow] = useState<SystemComponent>(empty);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingComponent, setEditingComponent] = useState<SystemComponent | null>(null);

  useEffect(() => {
    if (initialData.systemComponents) {
      setList(initialData.systemComponents);
    }
  }, [initialData.systemComponents]);

  const update = (k: keyof SystemComponent, v: any) =>
    setRow((r) => ({ ...r, [k]: v }));

  const updateSecurityDetails = (
    k: keyof SystemComponent["securityDetails"],
    v: any
  ) =>
    setRow((r) => ({
      ...r,
      securityDetails: { ...r.securityDetails, [k]: v },
    }));

  const updateLanguageFramework = (
    section: "language" | "framework",
    key: "name" | "version",
    value: string
  ) => {
    setRow((r) => ({
      ...r,
      languageFramework: {
        ...r.languageFramework,
        [section]: {
          ...r.languageFramework[section],
          [key]: value,
        },
      },
    }));
  };

  const addComponent = () => {
    if (!row.name || !row.status || !row.role) return;
    
    setList([...list, { ...row }]);
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

  const updateEditingComponent = (field: keyof SystemComponent, value: any) => {
    setEditingComponent(prev => prev ? { ...prev, [field]: value } : null);
  };

  const updateEditingSecurityDetails = (
    k: keyof SystemComponent["securityDetails"],
    v: any
  ) => {
    if (!editingComponent) return;
    setEditingComponent(prev => prev ? {
      ...prev,
      securityDetails: { ...prev.securityDetails, [k]: v },
    } : null);
  };

  const updateEditingLanguageFramework = (
    section: "language" | "framework",
    key: "name" | "version",
    value: string
  ) => {
    if (!editingComponent) return;
    setEditingComponent(prev => prev ? {
      ...prev,
      languageFramework: {
        ...prev.languageFramework,
        [section]: {
          ...prev.languageFramework[section],
          [key]: value,
        },
      },
    } : null);
  };

  const save = async () => {
    await onSave(list);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      {/* <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">System Components</h2>
        <p className="text-gray-600">Define the system components that make up your solution architecture</p>
      </div> */}

      {/* Add New System Component Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <svg className="w-5 h-5 mr-2 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14-7l-7 7-7-7m14 14l-7-7-7 7" />
            </svg>
            Add System Component
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6 max-h-96 overflow-y-auto pr-2">
            {/* Basic Information */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Component Name <span className="text-red-500">*</span>
                    <Input
                      placeholder="Enter component name"
                      value={row.name}
                      onChange={(e) => update("name", e.target.value)}
                    />
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status <span className="text-red-500">*</span>
                    <DropDown
                      placeholder="Select status"
                      value={row.status}
                      onChange={(e) => update("status", e.target.value)}
                      options={COMPONENT_STATUS_OPTIONS}
                    />
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Role <span className="text-red-500">*</span>
                    <DropDown
                      placeholder="Select role"
                      value={row.role}
                      onChange={(e) => update("role", e.target.value)}
                      options={COMPONENT_ROLE_OPTIONS}
                    />
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Hosted On
                    <DropDown
                      placeholder="Select hosting platform"
                      value={row.hostedOn}
                      onChange={(e) => update("hostedOn", e.target.value)}
                      options={LOCATION_OPTIONS}
                    />
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Hosting Region
                    <DropDown
                      placeholder="Select region"
                      value={row.hostingRegion}
                      onChange={(e) => update("hostingRegion", e.target.value)}
                      options={HOSTING_REGION_OPTIONS}
                    />
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Solution Type
                    <DropDown
                      placeholder="Select type"
                      value={row.solutionType}
                      onChange={(e) => update("solutionType", e.target.value)}
                      options={SOLUTION_TYPE_OPTIONS}
                    />
                  </label>
                </div>
              </div>
            </div>

            {/* Technology Stack */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Technology Stack</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Language
                    <DropDown
                      placeholder="Select language"
                      value={row.languageFramework.language.name}
                      onChange={(e) => updateLanguageFramework("language", "name", e.target.value)}
                      options={LANGUAGE_OPTIONS}
                    />
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Language Version
                    <Input
                      placeholder="Enter version"
                      value={row.languageFramework.language.version}
                      onChange={(e) => updateLanguageFramework("language", "version", e.target.value)}
                    />
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Framework
                    <DropDown
                      placeholder="Select framework"
                      value={row.languageFramework.framework.name}
                      onChange={(e) => updateLanguageFramework("framework", "name", e.target.value)}
                      options={FRAMEWORK_OPTIONS}
                    />
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Framework Version
                    <Input
                      placeholder="Enter version"
                      value={row.languageFramework.framework.version}
                      onChange={(e) => updateLanguageFramework("framework", "version", e.target.value)}
                    />
                  </label>
                </div>
              </div>
            </div>

            {/* Configuration & Management */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Configuration & Management</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="isOwnedByUs"
                    checked={row.isOwnedByUs}
                    onChange={(e) => update("isOwnedByUs", e.target.checked)}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <label htmlFor="isOwnedByUs" className="text-sm font-medium text-gray-700">
                    
                    Owned By Us
                  </label>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="isCICDUsed"
                    checked={row.isCICDUsed}
                    onChange={(e) => update("isCICDUsed", e.target.checked)}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <label htmlFor="isCICDUsed" className="text-sm font-medium text-gray-700">
                    
                    CI/CD Used
                  </label>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="isSubscription"
                    checked={row.isSubscription}
                    onChange={(e) => update("isSubscription", e.target.checked)}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <label htmlFor="isSubscription" className="text-sm font-medium text-gray-700">
                    Subscription
                  </label>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="isInternetFacing"
                    checked={row.isInternetFacing}
                    onChange={(e) => update("isInternetFacing", e.target.checked)}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <label htmlFor="isInternetFacing" className="text-sm font-medium text-gray-700">
                    Internet Facing
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Customization Level
                    <DropDown
                      placeholder="Select level"
                      value={row.customizationLevel}
                      onChange={(e) => update("customizationLevel", e.target.value)}
                      options={CUSTOMIZATION_LEVEL_OPTIONS}
                    />
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Upgrade Strategy
                    <DropDown
                      placeholder="Select strategy"
                      value={row.upgradeStrategy}
                      onChange={(e) => update("upgradeStrategy", e.target.value)}
                      options={UPGRADE_STRATEGY_OPTIONS}
                    />
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Upgrade Frequency
                    <DropDown
                      placeholder="Select frequency"
                      value={row.upgradeFrequency}
                      onChange={(e) => update("upgradeFrequency", e.target.value)}
                      options={FREQUENCY_OPTIONS}
                    />
                  </label>
                </div>
              </div>
            </div>

            {/* Performance & Availability */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Performance & Availability</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Availability Requirement
                    <DropDown
                      placeholder="Select availability"
                      value={row.availabilityRequirement}
                      onChange={(e) => update("availabilityRequirement", e.target.value)}
                      options={AVAILABILITY_REQUIREMENT_OPTIONS}
                    />
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Latency Requirement (ms)
                    <Input
                      type="number"
                      placeholder="Enter latency"
                      value={row.latencyRequirement ?? ""}
                      onChange={(e) => update("latencyRequirement", (Number(e.target.value) ?? 0))}
                    />
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Throughput Requirement
                    <Input
                      type="number"
                      placeholder="Enter throughput"
                      value={row.throughputRequirement ?? ""}
                      onChange={(e) => update("throughputRequirement", (Number(e.target.value) ?? 0))}
                    />
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Scalability Method
                    <DropDown
                      placeholder="Select method"
                      value={row.scalabilityMethod}
                      onChange={(e) => update("scalabilityMethod", e.target.value)}
                      options={SCALABILITY_METHOD_OPTIONS}
                    />
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Backup Site
                    <DropDown
                      placeholder="Select backup site"
                      value={row.backupSite}
                      onChange={(e) => update("backupSite", e.target.value)}
                      options={BACKUP_SITE_OPTIONS}
                    />
                  </label>
                </div>
              </div>
            </div>

            {/* Security Details */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Security Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Authentication Method
                    <Input
                      placeholder="Enter auth method"
                      value={row.securityDetails.authenticationMethod}
                      onChange={(e) => updateSecurityDetails("authenticationMethod", e.target.value)}
                    />
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Authorization Model
                    <Input
                      placeholder="Enter authorization model"
                      value={row.securityDetails.authorizationModel}
                      onChange={(e) => updateSecurityDetails("authorizationModel", e.target.value)}
                    />
                  </label>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="isAuditLoggingEnabled"
                    checked={row.securityDetails.isAuditLoggingEnabled}
                    onChange={(e) => updateSecurityDetails("isAuditLoggingEnabled", e.target.checked)}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <label htmlFor="isAuditLoggingEnabled" className="text-sm font-medium text-gray-700">
                    Audit Logging Enabled
                  </label>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="hasIpWhitelisting"
                    checked={row.securityDetails.hasIpWhitelisting}
                    onChange={(e) => updateSecurityDetails("hasIpWhitelisting", e.target.checked)}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <label htmlFor="hasIpWhitelisting" className="text-sm font-medium text-gray-700">
                    IP Whitelisting
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Sensitive Data Elements
                    <Input
                      placeholder="Enter sensitive data"
                      value={row.securityDetails.sensitiveDataElements}
                      onChange={(e) => updateSecurityDetails("sensitiveDataElements", e.target.value)}
                    />
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Data Encryption At Rest
                  <DropDown
                    placeholder="Select encryption"
                    value={row.securityDetails.dataEncryptionAtRest}
                    onChange={(e) => updateSecurityDetails("dataEncryptionAtRest", e.target.value)}
                    options={DATA_ENCRYPTION_AT_REST_OPTIONS}
                  /></label>
                  
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    SSL Type
                  <DropDown
                    placeholder="Select SSL type"
                    value={row.securityDetails.ssl}
                    onChange={(e) => updateSecurityDetails("ssl", e.target.value)}
                    options={SSL_TYPE_OPTIONS}
                  /></label>
                  
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Vulnerability Assessment Frequency
                  <DropDown
                    placeholder="Select frequency"
                    value={row.securityDetails.vulnerabilityAssessmentFrequency}
                    onChange={(e) => updateSecurityDetails("vulnerabilityAssessmentFrequency", e.target.value)}
                    options={FREQUENCY_OPTIONS}
                  /></label>
                  
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Penetration Testing Frequency
                  <DropDown
                    placeholder="Select frequency"
                    value={row.securityDetails.penetrationTestingFrequency}
                    onChange={(e) => updateSecurityDetails("penetrationTestingFrequency", e.target.value)}
                    options={FREQUENCY_OPTIONS}
                  /></label>
                  
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <Button
                onClick={addComponent}
                disabled={!row.name || !row.status || !row.role}
                variant="secondary"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add Component
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Edit Modal */}
      {editingIndex !== null && editingComponent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-medium text-gray-900">Edit System Component</h3>
                <button
                  onClick={cancelEdit}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-6">
                {/* Basic Information */}
                <div>
                  <h4 className="text-md font-medium text-gray-900 mb-4">Basic Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Component Name <span className="text-red-500">*</span>
                        <Input
                          placeholder="Enter component name"
                          value={editingComponent.name}
                          onChange={(e) => updateEditingComponent("name", e.target.value)}
                        />
                      </label>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Status <span className="text-red-500">*</span>
                        <DropDown
                          placeholder="Select status"
                          value={editingComponent.status}
                          onChange={(e) => updateEditingComponent("status", e.target.value)}
                          options={COMPONENT_STATUS_OPTIONS}
                        />
                      </label>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Role <span className="text-red-500">*</span>
                        <DropDown
                          placeholder="Select role"
                          value={editingComponent.role}
                          onChange={(e) => updateEditingComponent("role", e.target.value)}
                          options={COMPONENT_ROLE_OPTIONS}
                        />
                      </label>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Hosted On
                        <DropDown
                          placeholder="Select hosting platform"
                          value={editingComponent.hostedOn}
                          onChange={(e) => updateEditingComponent("hostedOn", e.target.value)}
                          options={LOCATION_OPTIONS}
                        />
                      </label>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Hosting Region
                        <DropDown
                          placeholder="Select region"
                          value={editingComponent.hostingRegion}
                          onChange={(e) => updateEditingComponent("hostingRegion", e.target.value)}
                          options={HOSTING_REGION_OPTIONS}
                        />
                      </label>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Solution Type
                        <DropDown
                          placeholder="Select type"
                          value={editingComponent.solutionType}
                          onChange={(e) => updateEditingComponent("solutionType", e.target.value)}
                          options={SOLUTION_TYPE_OPTIONS}
                        />
                      </label>
                    </div>
                  </div>
                </div>

                {/* Technology Stack */}
                <div>
                  <h4 className="text-md font-medium text-gray-900 mb-4">Technology Stack</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Language
                        <DropDown
                          placeholder="Select language"
                          value={editingComponent.languageFramework.language.name}
                          onChange={(e) => updateEditingLanguageFramework("language", "name", e.target.value)}
                          options={LANGUAGE_OPTIONS}
                        />
                      </label>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Language Version
                        <Input
                          placeholder="Enter version"
                          value={editingComponent.languageFramework.language.version}
                          onChange={(e) => updateEditingLanguageFramework("language", "version", e.target.value)}
                        />
                      </label>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Framework
                        <DropDown
                          placeholder="Select framework"
                          value={editingComponent.languageFramework.framework.name}
                          onChange={(e) => updateEditingLanguageFramework("framework", "name", e.target.value)}
                          options={FRAMEWORK_OPTIONS}
                        />
                      </label>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Framework Version
                        <Input
                          placeholder="Enter version"
                          value={editingComponent.languageFramework.framework.version}
                          onChange={(e) => updateEditingLanguageFramework("framework", "version", e.target.value)}
                        />
                      </label>
                    </div>
                  </div>
                </div>

                {/* Configuration & Management */}
                <div>
                  <h4 className="text-md font-medium text-gray-900 mb-4">Configuration & Management</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="editIsOwnedByUs"
                        checked={editingComponent.isOwnedByUs}
                        onChange={(e) => updateEditingComponent("isOwnedByUs", e.target.checked)}
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                      />
                      <label htmlFor="editIsOwnedByUs" className="text-sm font-medium text-gray-700">
                        Owned By Us
                      </label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="editIsCICDUsed"
                        checked={editingComponent.isCICDUsed}
                        onChange={(e) => updateEditingComponent("isCICDUsed", e.target.checked)}
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                      />
                      <label htmlFor="editIsCICDUsed" className="text-sm font-medium text-gray-700">
                        CI/CD Used
                      </label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="editIsSubscription"
                        checked={editingComponent.isSubscription}
                        onChange={(e) => updateEditingComponent("isSubscription", e.target.checked)}
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                      />
                      <label htmlFor="editIsSubscription" className="text-sm font-medium text-gray-700">
                        Subscription
                      </label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="editIsInternetFacing"
                        checked={editingComponent.isInternetFacing}
                        onChange={(e) => updateEditingComponent("isInternetFacing", e.target.checked)}
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                      />
                      <label htmlFor="editIsInternetFacing" className="text-sm font-medium text-gray-700">
                        Internet Facing
                      </label>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Customization Level
                        <DropDown
                          placeholder="Select level"
                          value={editingComponent.customizationLevel}
                          onChange={(e) => updateEditingComponent("customizationLevel", e.target.value)}
                          options={CUSTOMIZATION_LEVEL_OPTIONS}
                        />
                      </label>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Upgrade Strategy
                        <DropDown
                          placeholder="Select strategy"
                          value={editingComponent.upgradeStrategy}
                          onChange={(e) => updateEditingComponent("upgradeStrategy", e.target.value)}
                          options={UPGRADE_STRATEGY_OPTIONS}
                        />
                      </label>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Upgrade Frequency
                        <DropDown
                          placeholder="Select frequency"
                          value={editingComponent.upgradeFrequency}
                          onChange={(e) => updateEditingComponent("upgradeFrequency", e.target.value)}
                          options={FREQUENCY_OPTIONS}
                        />
                      </label>
                    </div>
                  </div>
                </div>

                {/* Performance & Availability */}
                <div>
                  <h4 className="text-md font-medium text-gray-900 mb-4">Performance & Availability</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Availability Requirement
                        <DropDown
                          placeholder="Select availability"
                          value={editingComponent.availabilityRequirement}
                          onChange={(e) => updateEditingComponent("availabilityRequirement", e.target.value)}
                          options={AVAILABILITY_REQUIREMENT_OPTIONS}
                        />
                      </label>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Latency Requirement (ms)
                        <Input
                          type="number"
                          placeholder="Enter latency"
                          value={editingComponent.latencyRequirement ?? ""}
                          onChange={(e) => updateEditingComponent("latencyRequirement", (Number(e.target.value) ?? 0))}
                        />
                      </label>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Throughput Requirement
                        <Input
                          type="number"
                          placeholder="Enter throughput"
                          value={editingComponent.throughputRequirement ?? ""}
                          onChange={(e) => updateEditingComponent("throughputRequirement", (Number(e.target.value) ?? 0))}
                        />
                      </label>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Scalability Method
                        <DropDown
                          placeholder="Select method"
                          value={editingComponent.scalabilityMethod}
                          onChange={(e) => updateEditingComponent("scalabilityMethod", e.target.value)}
                          options={SCALABILITY_METHOD_OPTIONS}
                        />
                      </label>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Backup Site
                        <DropDown
                          placeholder="Select backup site"
                          value={editingComponent.backupSite}
                          onChange={(e) => updateEditingComponent("backupSite", e.target.value)}
                          options={BACKUP_SITE_OPTIONS}
                        />
                      </label>
                    </div>
                  </div>
                </div>

                {/* Security Details */}
                <div>
                  <h4 className="text-md font-medium text-gray-900 mb-4">Security Details</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Authentication Method
                        <Input
                          placeholder="Enter auth method"
                          value={editingComponent.securityDetails.authenticationMethod}
                          onChange={(e) => updateEditingSecurityDetails("authenticationMethod", e.target.value)}
                        />
                      </label>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Authorization Model
                        <Input
                          placeholder="Enter authorization model"
                          value={editingComponent.securityDetails.authorizationModel}
                          onChange={(e) => updateEditingSecurityDetails("authorizationModel", e.target.value)}
                        />
                      </label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="editIsAuditLoggingEnabled"
                        checked={editingComponent.securityDetails.isAuditLoggingEnabled}
                        onChange={(e) => updateEditingSecurityDetails("isAuditLoggingEnabled", e.target.checked)}
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                      />
                      <label htmlFor="editIsAuditLoggingEnabled" className="text-sm font-medium text-gray-700">
                        Audit Logging Enabled
                      </label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="editHasIpWhitelisting"
                        checked={editingComponent.securityDetails.hasIpWhitelisting}
                        onChange={(e) => updateEditingSecurityDetails("hasIpWhitelisting", e.target.checked)}
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                      />
                      <label htmlFor="editHasIpWhitelisting" className="text-sm font-medium text-gray-700">
                        IP Whitelisting
                      </label>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Sensitive Data Elements
                        <Input
                          placeholder="Enter sensitive data"
                          value={editingComponent.securityDetails.sensitiveDataElements}
                          onChange={(e) => updateEditingSecurityDetails("sensitiveDataElements", e.target.value)}
                        />
                      </label>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Data Encryption At Rest
                        <DropDown
                          placeholder="Select encryption"
                          value={editingComponent.securityDetails.dataEncryptionAtRest}
                          onChange={(e) => updateEditingSecurityDetails("dataEncryptionAtRest", e.target.value)}
                          options={DATA_ENCRYPTION_AT_REST_OPTIONS}
                        />
                      </label>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        SSL Type
                        <DropDown
                          placeholder="Select SSL type"
                          value={editingComponent.securityDetails.ssl}
                          onChange={(e) => updateEditingSecurityDetails("ssl", e.target.value)}
                          options={SSL_TYPE_OPTIONS}
                        />
                      </label>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Vulnerability Assessment Frequency
                        <DropDown
                          placeholder="Select frequency"
                          value={editingComponent.securityDetails.vulnerabilityAssessmentFrequency}
                          onChange={(e) => updateEditingSecurityDetails("vulnerabilityAssessmentFrequency", e.target.value)}
                          options={FREQUENCY_OPTIONS}
                        />
                      </label>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Penetration Testing Frequency
                        <DropDown
                          placeholder="Select frequency"
                          value={editingComponent.securityDetails.penetrationTestingFrequency}
                          onChange={(e) => updateEditingSecurityDetails("penetrationTestingFrequency", e.target.value)}
                          options={FREQUENCY_OPTIONS}
                        />
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6 pt-4 border-t">
                <Button
                  onClick={cancelEdit}
                  variant="ghost"
                >
                  Cancel
                </Button>
                <Button
                  onClick={saveEdit}
                  disabled={!editingComponent.name || !editingComponent.status || !editingComponent.role}
                >
                  Save Changes
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Current System Components */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <svg className="w-5 h-5 mr-2 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14-7l-7 7-7-7m14 14l-7-7-7 7" />
            </svg>
            System Components ({list.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {list.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <svg className="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14-7l-7 7-7-7m14 14l-7-7-7 7" />
              </svg>
              <p>No system components added yet</p>
              <p className="text-sm">Add your first component above</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {list.map((component, index) => (
                <div key={`component-${index}`} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="font-medium text-gray-900 truncate">{component.name}</h4>
                    <div className="flex space-x-1 ml-2">
                      <button
                        onClick={() => startEdit(index)}
                        className="text-blue-600 hover:text-blue-900"
                        title="Edit"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => removeComponent(index)}
                        className="text-red-600 hover:text-red-900"
                        title="Delete"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex justify-between">
                      <span>Status:</span>
                      <span className="font-medium">{component.status}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Role:</span>
                      <span className="font-medium">{component.role}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Hosted:</span>
                      <span className="font-medium">{component.hostedOn ?? 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Type:</span>
                      <span className="font-medium">{component.solutionType ?? 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Language:</span>
                      <span className="font-medium">
                        {component.languageFramework?.language?.name ?? 'N/A'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
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

export default SystemComponentStep;