import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '../ui/Button';
import { Input, Textarea } from '../ui/Input';
import { Card } from '../ui/Card';
import { useLookup } from '../../hooks/useLookup';
import type { UploadLookup } from '../../types/lookup';
import { useToast } from '../../context/ToastContext';

export const CreateLookupPage: React.FC = () => {
  const navigate = useNavigate();
  const { lookupName: urlLookupName } = useParams<{ lookupName?: string }>();
  const { createLookup, updateLookup, loadFieldDescriptions, updateFieldDescriptions, loadSpecificLookup, isLoading } = useLookup();
  const { showSuccess, showError } = useToast();

  const isUpdate = !!urlLookupName;
  const [currentStep, setCurrentStep] = useState<1 | 2>(1);
  const [createdLookupName, setCreatedLookupName] = useState(urlLookupName || '');

  const [formData, setFormData] = useState({
    lookupName: urlLookupName || '',
    description: '',
    lookupFile: null as File | null,
  });

  const [errors, setErrors] = useState({
    lookupName: '',
    description: '',
    lookupFile: '',
  });

  const [fields, setFields] = useState<string[]>([]);
  const [fieldDescriptions, setFieldDescriptions] = useState<Record<string, string>>({});

  // Load existing lookup data when in update mode
  useEffect(() => {
    const loadExistingData = async () => {
      if (isUpdate && urlLookupName) {
        try {
          const lookupData = await loadSpecificLookup(urlLookupName);
          setFormData(prev => ({
            ...prev,
            description: lookupData.description || '',
          }));
        } catch (error) {
          console.error('Failed to load existing lookup data:', error);
          showError('Failed to load existing lookup data');
        }
      }
    };
    loadExistingData();
  }, [isUpdate, urlLookupName, showError]);

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));

    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData(prev => ({ ...prev, lookupFile: file }));

    // Clear error when file is selected
    if (errors.lookupFile) {
      setErrors(prev => ({ ...prev, lookupFile: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors = {
      lookupName: '',
      description: '',
      lookupFile: '',
    };

    // Validate lookupName only if not in update mode
    if (!isUpdate) {
      if (!formData.lookupName.trim()) {
        newErrors.lookupName = 'Lookup name is required';
      } else if (formData.lookupName.trim().length < 3) {
        newErrors.lookupName = 'Lookup name must be at least 3 characters';
      }
    }

    // Validate description
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.trim().length < 10) {
      newErrors.description = 'Description must be at least 10 characters';
    }

    // Validate file - only required if not in update mode OR if a file is selected
    if (!isUpdate && !formData.lookupFile) {
      newErrors.lookupFile = 'Lookup file is required';
    } else if (formData.lookupFile) {
      // Validate file type (CSV) if a file is provided
      const fileExtension = formData.lookupFile.name.split('.').pop()?.toLowerCase();
      if (fileExtension !== 'csv') {
        newErrors.lookupFile = 'Please upload a CSV file';
      }
    }

    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error !== '');
  };

  const handleSkipToStep2 = async () => {
    try {
      setCreatedLookupName(formData.lookupName.trim());

      // Load field descriptions for step 2 without saving changes
      const fieldData = await loadFieldDescriptions(formData.lookupName.trim());
      console.log('Field data received:', fieldData);

      // Handle nested structure - check if data has a fieldDescriptions property
      const descriptionsData = fieldData?.fieldDescriptions || fieldData || {};
      console.log('Descriptions data:', descriptionsData);

      // Extract field names (keys from the fieldDescriptions object)
      const fieldNames = Object.keys(descriptionsData);
      setFields(fieldNames);
      setFieldDescriptions(descriptionsData);

      // Move to step 2
      setCurrentStep(2);
    } catch (error) {
      console.error('Failed to load field descriptions:', error);
      showError(
        `Failed to load field descriptions: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  };

  const handleStep1Submit = async () => {
    if (!validateForm()) {
      showError('Please fix the validation errors before submitting');
      return;
    }

    try {
      // If updating and a file is provided, update the lookup with new file
      if (isUpdate) {
        const formDataToSend = new FormData();
        formDataToSend.append('lookupName', formData.lookupName.trim());
        formDataToSend.append('description', formData.description.trim());
        if (formData.lookupFile) {
          formDataToSend.append('lookupFile', formData.lookupFile); 
        }

        await updateLookup(formData.lookupName.trim(), formDataToSend);
        showSuccess('Lookup saved successfully!');
      }
      // If creating, file is required
      else if (!isUpdate && formData.lookupFile) {
        const formDataToSend = new FormData();
        formDataToSend.append('lookupName', formData.lookupName.trim());
        formDataToSend.append('description', formData.description.trim());
        formDataToSend.append('lookupFile', formData.lookupFile);

        await createLookup(formDataToSend);
        showSuccess('Lookup created successfully!');
      }

      setCreatedLookupName(formData.lookupName.trim());

      // Load field descriptions for step 2
      const fieldData = await loadFieldDescriptions(formData.lookupName.trim());
      console.log('Field data received:', fieldData);

      // Handle nested structure - check if data has a fieldDescriptions property
      const descriptionsData = fieldData?.fieldDescriptions || fieldData || {};
      console.log('Descriptions data:', descriptionsData);

      // Extract field names (keys from the fieldDescriptions object)
      const fieldNames = Object.keys(descriptionsData);
      setFields(fieldNames);
      setFieldDescriptions(descriptionsData);

      // Move to step 2
      setCurrentStep(2);
    } catch (error) {
      console.error(`Failed to ${isUpdate ? 'update' : 'create'} lookup:`, error);
      showError(
        `Failed to ${isUpdate ? 'update' : 'create'} lookup: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  };

  const handleFieldDescriptionChange = (fieldName: string, description: string) => {
    setFieldDescriptions(prev => ({
      ...prev,
      [fieldName]: description,
    }));
  };

  const handleStep2Submit = async () => {
    try {
      console.log('Updating field descriptions for:', createdLookupName, fieldDescriptions);
      const data = {'fieldDescriptions': fieldDescriptions};
      await updateFieldDescriptions(createdLookupName, data);
      showSuccess('Field descriptions saved successfully!');
      navigate('/view-lookup/' + createdLookupName);
    } catch (error) {
      console.error('Failed to update field descriptions:', error);
      showError(
        `Failed to save field descriptions: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  };

  const isStep1Valid = () => {
    if (isUpdate) {
      // In update mode, only description is required. File is optional.
      return (
        formData.description.trim() &&
        !errors.description &&
        !errors.lookupFile
      );
    }
    // In create mode, all fields including file are required
    return (
      formData.lookupName.trim() &&
      formData.description.trim() &&
      formData.lookupFile !== null &&
      !errors.lookupName &&
      !errors.description &&
      !errors.lookupFile
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {isUpdate ? 'Update Lookup' : 'Create New Lookup'}
              </h1>
              <p className="text-gray-600 mt-1">
                {currentStep === 1
                  ? 'Upload a CSV file to create a new lookup table'
                  : 'Provide descriptions for each field'}
              </p>
            </div>
            <Button
              variant="ghost"
              onClick={() => navigate(-1)}
              aria-label="Cancel"
              disabled={isLoading}
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
              Cancel
            </Button>
          </div>
        </div>
      </div>

      {/* Progress Indicator */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-center">
          <div className="flex items-center space-x-4">
            <div className={`flex items-center ${currentStep === 1 ? 'text-blue-600' : 'text-green-600'}`}>
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-full ${
                  currentStep === 1 ? 'bg-blue-600 text-white' : 'bg-green-600 text-white'
                }`}
              >
                {currentStep === 1 ? '1' : '✓'}
              </div>
              <span className="ml-2 font-medium">Upload File</span>
            </div>
            <div className="w-16 h-1 bg-gray-300" />
            <div className={`flex items-center ${currentStep === 2 ? 'text-blue-600' : 'text-gray-400'}`}>
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-full ${
                  currentStep === 2 ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-600'
                }`}
              >
                2
              </div>
              <span className="ml-2 font-medium">Field Descriptions</span>
            </div>
          </div>
        </div>
      </div>

      {/* Form Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentStep === 1 ? (
          <div className="space-y-6">
            {/* Basic Information Card */}
            <Card>
              <div className="p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Basic Information
                </h2>
                <div className="space-y-4">
                  <Input
                    label="Lookup Name"
                    placeholder="e.g., high-value-solutions"
                    value={formData.lookupName}
                    onChange={(e) => handleInputChange('lookupName', e.target.value)}
                    error={errors.lookupName}
                    helpText="A unique identifier for this lookup (lowercase, hyphens allowed)"
                    required
                    disabled={isUpdate}
                  />

                  <Textarea
                    label="Description"
                    placeholder="Describe what this lookup does and when to use it..."
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    error={errors.description}
                    helpText="Provide a clear description of the lookup's purpose"
                    rows={3}
                    required
                  />
                </div>
              </div>
            </Card>

            {/* Lookup File Upload Card */}
            <Card>
              <div className="p-6">
                <div className="mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Lookup File Upload
                  </h2>
                  <p className="text-sm text-gray-600 mt-1">
                    {isUpdate
                      ? 'Upload a CSV file to replace the existing lookup data (optional)'
                      : 'Upload a CSV file containing your lookup data'
                    }
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Lookup File {!isUpdate && <span className="text-red-500">*</span>}
                    </label>
                    <input
                      type="file"
                      accept=".csv"
                      onChange={handleFileChange}
                      className="block w-full text-sm text-gray-500
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-md file:border-0
                        file:text-sm file:font-semibold
                        file:bg-blue-50 file:text-blue-700
                        hover:file:bg-blue-100
                        cursor-pointer"
                    />
                    {errors.lookupFile && (
                      <p className="mt-1 text-sm text-red-600">{errors.lookupFile}</p>
                    )}
                    {formData.lookupFile && (
                      <p className="mt-2 text-sm text-gray-600">
                        Selected file: {formData.lookupFile.name}
                      </p>
                    )}
                  </div>

                  {/* Help Section */}
                  <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                    <h4 className="text-sm font-medium text-blue-900 mb-2">
                      File Upload Guidelines
                    </h4>
                    <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
                      <li>File must be in CSV format</li>
                      <li>First row should contain column headers</li>
                      <li>Ensure data is properly formatted and validated</li>
                    </ul>
                  </div>
                </div>
              </div>
            </Card>

            {/* Action Buttons */}
            <div className="flex justify-between">
              <Button
                variant="secondary"
                onClick={() => navigate(-1)}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <div className="flex space-x-3">
                {isUpdate && (
                  <Button
                    variant="secondary"
                    onClick={handleSkipToStep2}
                    disabled={isLoading}
                  >
                    Skip
                  </Button>
                )}
                <Button
                  variant="primary"
                  onClick={handleStep1Submit}
                  disabled={!isStep1Valid() || isLoading}
                  isLoading={isLoading}
                >
                  {isLoading ? 'Uploading...' : 'Save & Next'}
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Field Descriptions Card */}
            <Card>
              <div className="p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Field Descriptions
                </h2>
                <p className="text-sm text-gray-600 mb-6">
                  Provide descriptions for each field in your lookup table to help users understand the data.
                </p>
                <div className="space-y-4">
                  {fields.length === 0 ? (
                    <p className="text-sm text-gray-500">No fields found in the uploaded file.</p>
                  ) : (
                    fields.map((fieldName) => {
                      // const currentValue = fieldDescriptions[fieldName];
                      const displayValue = fieldDescriptions[fieldName];

                      return (
                        <div key={fieldName} className="border border-gray-200 rounded-md p-4 bg-gray-50">
                          <label className="block text-sm font-semibold text-gray-900 mb-2">
                            Field: {fieldName}
                          </label>
                          <Input
                            placeholder={`Describe the ${fieldName} field...`}
                            value={displayValue}
                            onChange={(e) => handleFieldDescriptionChange(fieldName, e.target.value)}
                          />
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </Card>

            {/* Action Buttons */}
            <div className="flex justify-between">
              <Button
                variant="secondary"
                onClick={() => setCurrentStep(1)}
                disabled={isLoading}
              >
                Back
              </Button>
              <Button
                variant="primary"
                onClick={handleStep2Submit}
                disabled={isLoading}
                isLoading={isLoading}
              >
                {isLoading ? 'Saving...' : 'Save'}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
