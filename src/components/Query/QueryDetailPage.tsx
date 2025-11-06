import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '../ui/Button';
import { Input, Textarea } from '../ui/Input';
import { Card } from '../ui/Card';
import { Modal } from '../ui/Modal';
import { useQuery } from '../../hooks/useQuery';
import type { Query } from '../../types/query';
import { validateMongoQuery, formatQueryJSON } from '../../utils/queryValidation';
import { useToast } from '../../context/ToastContext';

export const QueryDetailPage: React.FC = () => {
  const { queryName } = useParams<{ queryName: string }>();
  const navigate = useNavigate();
  const { loadSpecificQuery, updateQuery, deleteQuery, isLoading } = useQuery();
  const { showSuccess, showError } = useToast();

  const [query, setQuery] = useState<Query | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [formData, setFormData] = useState({
    description: '',
    mongoQuery: '',
  });

  const [errors, setErrors] = useState({
    description: '',
    mongoQuery: '',
  });

  // Load query details on mount
  useEffect(() => {
    const fetchQuery = async () => {
      if (!queryName) {
        showError('Query name is required');
        navigate('/view-queries');
        return;
      }

      try {
        const data = await loadSpecificQuery(queryName);
        setQuery(data);
        setFormData({
          description: data.description,
          mongoQuery: data.mongoQuery,
        });
      } catch (error) {
        console.error('Error loading query:', error);
        showError(`Failed to load query: ${error instanceof Error ? error.message : 'Unknown error'}`);
        navigate('/view-queries');
      }
    };

    fetchQuery();
  }, [queryName]);

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));

    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors = {
      description: '',
      mongoQuery: '',
    };

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
      }
    }

    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error !== '');
  };

  const handleFormatQuery = () => {
    try {
      const formatted = formatQueryJSON(formData.mongoQuery);
      setFormData(prev => ({ ...prev, mongoQuery: formatted }));
      showSuccess('Query formatted successfully');
    } catch (error) {
      showError('Failed to format query. Please check the JSON syntax.');
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    // Reset form to original values
    if (query) {
      setFormData({
        description: query.description,
        mongoQuery: query.mongoQuery,
      });
    }
    setErrors({ description: '', mongoQuery: '' });
  };

  const handleUpdate = async () => {
    if (!validateForm() || !queryName) {
      showError('Please fix the validation errors before submitting');
      return;
    }

    try {
      const updatedQuery = await updateQuery(queryName, {
        mongoQuery: formData.mongoQuery.trim(),
        description: formData.description.trim(),
      });

      setQuery(updatedQuery);
      setIsEditing(false);
      showSuccess('Query updated successfully!');
    } catch (error) {
      console.error('Failed to update query:', error);
      showError(
        `Failed to update query: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  };

  const handleDelete = async () => {
    if (!queryName) return;

    try {
      await deleteQuery(queryName);
      showSuccess('Query deleted successfully!');
      navigate('/view-queries');
    } catch (error) {
      console.error('Failed to delete query:', error);
      showError(
        `Failed to delete query: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
      setShowDeleteModal(false);
    }
  };

  if (!query) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading query...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex-1">
              <div className="flex items-center space-x-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate('/view-queries')}
                  aria-label="Back to queries"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </Button>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{query.name}</h1>
                  <p className="text-gray-600 mt-1">MongoDB Aggregation Pipeline</p>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              {!isEditing ? (
                <>
                  <Button
                    variant="primary"
                    onClick={() => navigate(`/execute-query/${query.name}`)}
                    disabled={isLoading}
                  >
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    Execute Query
                  </Button>
                  <Button variant="secondary" onClick={handleEdit} disabled={isLoading}>
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                    Edit
                  </Button>
                  <Button
                    variant="danger"
                    onClick={() => setShowDeleteModal(true)}
                    disabled={isLoading}
                  >
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                    Delete
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="ghost" onClick={handleCancelEdit} disabled={isLoading}>
                    Cancel
                  </Button>
                  <Button
                    variant="primary"
                    onClick={handleUpdate}
                    disabled={isLoading}
                    isLoading={isLoading}
                  >
                    {isLoading ? 'Saving...' : 'Save Changes'}
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* Description Section */}
          <Card>
            <div className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Description</h2>
              {isEditing ? (
                <Textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  error={errors.description}
                  rows={3}
                  placeholder="Enter query description..."
                />
              ) : (
                <p className="text-gray-700 whitespace-pre-wrap">{query.description}</p>
              )}
            </div>
          </Card>

          {/* Query Section */}
          <Card>
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Aggregation Pipeline
                </h2> 
                
                  </div>
                {isEditing && (
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={handleFormatQuery}
                    disabled={!formData.mongoQuery.trim() || isLoading}
                  >
                    Format JSON
                  </Button>
                )}
              </div>

              {isEditing ? (
                
                <div className="space-y-4">
                  <p className="text-sm text-gray-600 mt-1">
                    Enter your query as a JSON array of pipeline stages. <br />
                    Please do not include any comments within the JSON. <br />
                    Remember to filter $documentState to ACTIVE if you want only active solution reviews.
                  </p>
                  <Textarea
                    value={formData.mongoQuery}
                    onChange={(e) => handleInputChange('mongoQuery', e.target.value)}
                    error={errors.mongoQuery}
                    rows={20}
                    className="font-mono text-sm"
                    placeholder="Enter MongoDB aggregation pipeline..."
                  />

                  {errors.mongoQuery && (
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
                          <p className="text-sm text-red-700 mt-1">{errors.mongoQuery}</p>
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
                        Forbidden operations: $out, $merge, $function, $accumulator, $where
                      </li>
                      <li>No JavaScript code execution is permitted</li>
                    </ul>
                  </div>
                </div>
              ) : (
                <div className="bg-gray-50 rounded-md p-4 overflow-x-auto">
                  <pre className="text-sm font-mono text-gray-800 whitespace-pre">
                    {formatQueryJSON(query.mongoQuery)}
                  </pre>
                </div>
              )}
            </div>
          </Card>

          {/* Metadata Section */}
          {!isEditing && (
            <Card>
              <div className="p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Metadata</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Query Name
                    </label>
                    <p className="text-gray-900">{query.name}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Pipeline Stages
                    </label>
                    <p className="text-gray-900">
                      {JSON.parse(query.mongoQuery).length} stage(s)
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Query"
        maxWidth="md"
      >
        <div className="space-y-4">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg
                className="h-6 w-6 text-red-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-gray-900">
                Are you sure you want to delete this query?
              </h3>
              <div className="mt-2 text-sm text-gray-500">
                <p>
                  You are about to delete the query <strong>"{query.name}"</strong>. This
                  action cannot be undone.
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <Button
              variant="secondary"
              onClick={() => setShowDeleteModal(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleDelete}
              disabled={isLoading}
              isLoading={isLoading}
            >
              {isLoading ? 'Deleting...' : 'Delete Query'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
