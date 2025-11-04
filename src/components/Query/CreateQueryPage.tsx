import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/Button';
import { Input, Textarea } from '../ui/Input';
import { Card } from '../ui/Card';
import { useQuery } from '../../hooks/useQuery';
import type { Query } from '../../types/query';
import { validateMongoQuery, formatQueryJSON } from '../../utils/queryValidation';
import { useToast } from '../../context/ToastContext';

export const CreateQueryPage: React.FC = () => {
  const navigate = useNavigate();
  const { createQuery, isLoading } = useQuery();
  const { showSuccess, showError } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    mongoQuery: '',
  });

  const [errors, setErrors] = useState({
    name: '',
    description: '',
    mongoQuery: '',
  });

  const [queryValidationError, setQueryValidationError] = useState<string>('');

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));

    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }

    // Clear query validation error when user modifies the query
    if (field === 'mongoQuery' && queryValidationError) {
      setQueryValidationError('');
    }
  };

  const validateForm = (): boolean => {
    const newErrors = {
      name: '',
      description: '',
      mongoQuery: '',
    };

    // Validate name
    if (!formData.name.trim()) {
      newErrors.name = 'Query name is required';
    } else if (formData.name.trim().length < 3) {
      newErrors.name = 'Query name must be at least 3 characters';
    }

    // Validate description
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.trim().length < 10) {
      newErrors.description = 'Description must be at least 10 characters';
    }

    // Validate query
    if (!formData.mongoQuery.trim()) {
      newErrors.mongoQuery = 'Query is required';
    } else {
      const validationResult = validateMongoQuery(formData.mongoQuery);
      if (!validationResult.isValid) {
        newErrors.mongoQuery = validationResult.error || 'Invalid query format';
        setQueryValidationError(validationResult.error || '');
      }
    }

    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error !== '');
  };

  const handleFormatQuery = () => {
    try {
      console.log('before formatting', formData.mongoQuery);
      const formatted = formatQueryJSON(formData.mongoQuery);
      console.log(formatted);
      setFormData(prev => ({ ...prev, mongoQuery: formatted }));
      showSuccess('Query formatted successfully');
    } catch (error) {
      showError('Failed to format query. Please check the JSON syntax.');
    }
  };

  const handleCreate = async () => {
    if (!validateForm()) {
      showError('Please fix the validation errors before submitting');
      return;
    }

    try {
      const queryData: Query = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        mongoQuery: formData.mongoQuery.trim(),
      };

      await createQuery(queryData);
      showSuccess('Query created successfully!');
      navigate('/view-query/' + formData.name.trim());
    } catch (error) {
      console.error('Failed to create query:', error);
      showError(
        `Failed to create query: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  };

  const isFormValid = () => {
    return (
      formData.name.trim() &&
      formData.description.trim() &&
      formData.mongoQuery.trim() &&
      !errors.name &&
      !errors.description &&
      !errors.mongoQuery
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Create New Query</h1>
              <p className="text-gray-600 mt-1">
                Define a MongoDB aggregation pipeline query
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

      {/* Form Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* Basic Information Card */}
          <Card>
            <div className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Basic Information
              </h2>
              <div className="space-y-4">
                <Input
                  label="Query Name"
                  placeholder="e.g., high-value-solutions"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  error={errors.name}
                  helpText="A unique identifier for this query (lowercase, hyphens allowed)"
                  required
                />

                <Textarea
                  label="Description"
                  placeholder="Describe what this query does and when to use it..."
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  error={errors.description}
                  helpText="Provide a clear description of the query's purpose"
                  rows={3}
                  required
                />
              </div>
            </div>
          </Card>

          {/* Query Definition Card */}
          <Card>
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    MongoDB Aggregation Pipeline
                  </h2>
                  <p className="text-sm text-gray-600 mt-1">
                    Enter your query as a JSON array of pipeline stages. <br />
                    Please do not include any comments within the JSON. <br />
                    Remember to filter $documentState to ACTIVE if you want only active solution reviews.
                  </p>
                </div>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleFormatQuery}
                  disabled={!formData.mongoQuery.trim() || isLoading}
                >
                  Format JSON
                </Button>
              </div>

              <div className="space-y-4">
                <Textarea
                  label="Query Pipeline"
                  placeholder={`[\n  {"$match": {"status": "active"}},\n  {"$group": {"_id": "$category", "count": {"$sum": 1}}}\n]`}
                  value={formData.mongoQuery}
                  onChange={(e) => handleInputChange('mongoQuery', e.target.value)}
                  error={errors.mongoQuery}
                  rows={12}
                  className="font-mono text-sm"
                  required
                />

                {queryValidationError && (
                  <div className="bg-red-50 border border-red-200 rounded-md p-4">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <svg
                          className="h-5 w-5 text-red-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-red-800">
                          Query Validation Error
                        </h3>
                        <p className="text-sm text-red-700 mt-1">
                          {queryValidationError}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Help Section */}
                <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                  <h4 className="text-sm font-medium text-blue-900 mb-2">
                    Query Guidelines
                  </h4>
                  <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
                    <li>Must be a valid JSON array starting with '[' and ending with ']'</li>
                    <li>Each stage must be an object (e.g., {`{"$match": {...}}`})</li>
                    <li>Only read-only operations are allowed</li>
                    <li>
                      Forbidden operations: $out, $merge, $function, $accumulator,
                      $where
                    </li>
                    <li>No JavaScript code execution is permitted</li>
                  </ul>
                </div>
              </div>
            </div>
          </Card>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3">
            <Button
              variant="secondary"
              onClick={() => navigate(-1)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleCreate}
              disabled={!isFormValid() || isLoading}
              isLoading={isLoading}
            >
              {isLoading ? 'Creating...' : 'Create Query'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
