import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Card } from '../ui/Card';
import { useQuery } from '../../hooks/useQuery';
import { useToast } from '../../context/ToastContext';

export const ExecuteQueryResultPage: React.FC = () => {
  const { queryName } = useParams<{ queryName: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { executeQuery, loadSpecificQuery, isLoading } = useQuery();
  const { showSuccess, showError } = useToast();

  const [queryDetails, setQueryDetails] = useState<any>(null);
  const [executionParams, setExecutionParams] = useState({
    collection: searchParams.get('collection') || 'solutionReviews',
    limit: Number(searchParams.get('limit')) || 100,
    skip: Number(searchParams.get('skip')) || 0,
  });

  const [executionResults, setExecutionResults] = useState<any[] | null>(null);
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionError, setExecutionError] = useState<string>('');
  const [executionTime, setExecutionTime] = useState<number | null>(null);

  // Load query details and execute on mount
  useEffect(() => {
    const initialize = async () => {
      if (!queryName) {
        showError('Query name is required');
        navigate('/view-queries');
        return;
      }

      try {
        // Load query details
        const details = await loadSpecificQuery(queryName);
        setQueryDetails(details);

        // Auto-execute query with initial parameters
        await handleExecute(executionParams);
      } catch (error) {
        console.error('Error loading query:', error);
        showError(`Failed to load query: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    };

    initialize();
  }, [queryName]);

  const handleExecute = async (params = executionParams) => {
    if (!queryName) return;

    setIsExecuting(true);
    setExecutionError('');
    setExecutionResults(null);

    const startTime = performance.now();

    try {
      const payload = {
        collection: params.collection || 'solutionReviews',
        limit: params.limit || 100,
        skip: params.skip || 0,
      };

      const results = await executeQuery(queryName, payload);
      const endTime = performance.now();

      setExecutionResults(results);
      setExecutionTime(endTime - startTime);
      showSuccess(`Query executed successfully! Found ${results.length} result(s)`);
    } catch (error) {
      console.error('Failed to execute query:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setExecutionError(errorMessage);
      showError(`Failed to execute query: ${errorMessage}`);
    } finally {
      setIsExecuting(false);
    }
  };

  const handleParamChange = (field: keyof typeof executionParams, value: string | number) => {
    setExecutionParams(prev => ({
      ...prev,
      [field]: field === 'collection' ? value : Number(value),
    }));
  };

  const handleReExecute = () => {
    handleExecute();
  };

  const formatJSON = (data: any) => {
    try {
      return JSON.stringify(data, null, 2);
    } catch {
      return String(data);
    }
  };

  const downloadResults = () => {
    if (!executionResults) return;

    const dataStr = JSON.stringify(executionResults, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${queryName}-results-${new Date().toISOString()}.json`;
    link.click();
    URL.revokeObjectURL(url);
    showSuccess('Results downloaded successfully!');
  };

  if (!queryDetails && isLoading) {
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex-1">
              <div className="flex items-center space-x-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate(`/view-query/${queryName}`)}
                  aria-label="Back to query details"
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
                  <h1 className="text-2xl font-bold text-gray-900">Execute Query: {queryName}</h1>
                  {queryDetails && (
                    <p className="text-gray-600 mt-1">{queryDetails.description}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Button
                variant="ghost"
                onClick={() => navigate(`/view-query/${queryName}`)}
                disabled={isExecuting}
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
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                View Query Details
              </Button>
              {executionResults && (
                <Button
                  variant="secondary"
                  onClick={downloadResults}
                  disabled={isExecuting}
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
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                    />
                  </svg>
                  Download Results
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* Execution Parameters Card */}
          <Card>
            <div className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Execution Parameters
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input
                  label="Collection"
                  placeholder="e.g., solutionReviews"
                  value={executionParams.collection}
                  onChange={(e) => handleParamChange('collection', e.target.value)}
                  helpText="MongoDB collection name"
                />
                <Input
                  label="Limit"
                  type="number"
                  min="1"
                  max="1000"
                  value={executionParams.limit}
                  onChange={(e) => handleParamChange('limit', e.target.value)}
                  helpText="Maximum number of results"
                />
                <Input
                  label="Skip"
                  type="number"
                  min="0"
                  value={executionParams.skip}
                  onChange={(e) => handleParamChange('skip', e.target.value)}
                  helpText="Number of documents to skip"
                />
              </div>
              <div className="mt-4 flex justify-end">
                <Button
                  variant="primary"
                  onClick={handleReExecute}
                  disabled={isExecuting}
                  isLoading={isExecuting}
                >
                  {isExecuting ? 'Executing...' : 'Execute Query'}
                </Button>
              </div>
            </div>
          </Card>

          {/* Execution Status */}
          {isExecuting && (
            <Card>
              <div className="p-6">
                <div className="flex items-center space-x-3">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600"></div>
                  <p className="text-gray-700">Executing query...</p>
                </div>
              </div>
            </Card>
          )}

          {/* Error Display */}
          {executionError && (
            <Card>
              <div className="p-6">
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
                      <h3 className="text-sm font-medium text-red-800">Execution Error</h3>
                      <p className="text-sm text-red-700 mt-1">{executionError}</p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          )}

          {/* Results Display */}
          {executionResults && (
            <>
              {/* Results Summary */}
              <Card>
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Results Count
                      </label>
                      <p className="text-2xl font-bold text-primary-600">
                        {executionResults.length}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Execution Time
                      </label>
                      <p className="text-2xl font-bold text-green-600">
                        {executionTime ? `${executionTime.toFixed(2)} ms` : 'N/A'}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Collection
                      </label>
                      <p className="text-2xl font-bold text-gray-900">
                        {executionParams.collection}
                      </p>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Results Data */}
              <Card>
                <div className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold text-gray-900">Query Results</h2>
                    <span className="text-sm text-gray-500">
                      Showing {executionResults.length} document(s)
                    </span>
                  </div>

                  {executionResults.length === 0 ? (
                    <div className="text-center py-12">
                      <svg
                        className="mx-auto h-12 w-12 text-gray-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                        />
                      </svg>
                      <p className="mt-2 text-sm text-gray-500">No results found</p>
                      <p className="text-sm text-gray-400">
                        Try adjusting your query parameters or collection name
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {/* Results as formatted JSON */}
                      <div className="bg-gray-50 rounded-md p-4 overflow-x-auto max-h-[600px] overflow-y-auto">
                        <pre className="text-xs font-mono text-gray-800 whitespace-pre">
                          {formatJSON(executionResults)}
                        </pre>
                      </div>

                      {/* Individual Result Cards (collapsed by default) */}
                      <details className="border border-gray-200 rounded-md">
                        <summary className="px-4 py-3 cursor-pointer hover:bg-gray-50 font-medium text-gray-900">
                          View Individual Documents ({executionResults.length})
                        </summary>
                        <div className="border-t border-gray-200 p-4 space-y-4">
                          {executionResults.map((result, index) => (
                            <div
                              key={index}
                              className="border border-gray-200 rounded-md p-4 bg-white"
                            >
                              <div className="flex justify-between items-center mb-2">
                                <span className="text-sm font-medium text-gray-700">
                                  Document {index + 1}
                                </span>
                                {result._id && (
                                  <span className="text-xs text-gray-500 font-mono">
                                    ID: {String(result._id)}
                                  </span>
                                )}
                              </div>
                              <div className="bg-gray-50 rounded p-3 overflow-x-auto">
                                <pre className="text-xs font-mono text-gray-800 whitespace-pre">
                                  {formatJSON(result)}
                                </pre>
                              </div>
                            </div>
                          ))}
                        </div>
                      </details>
                    </div>
                  )}
                </div>
              </Card>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
