import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Card } from '../ui/Card';
import { useQuery } from '../../hooks/useQuery';
import type { Query } from '../../types/query';
import { useToast } from '../../context/ToastContext';

export const ViewAllQueriesPage: React.FC = () => {
  const navigate = useNavigate();
  const { loadAllQueries, isLoading } = useQuery();
  const { showError } = useToast();

  const [queries, setQueries] = useState<Query[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  // Load all queries on mount
  useEffect(() => {
    const fetchQueries = async () => {
      try {
        const data = await loadAllQueries();
        setQueries(data);
      } catch (error) {
        console.error('Error loading queries:', error);
        showError(`Failed to load queries: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    };

    fetchQueries();
  }, []);

  // Filter queries based on search term
  const filteredQueries = useMemo(() => {
    if (!searchTerm.trim()) {
      return queries;
    }

    const searchLower = searchTerm.toString().toLowerCase();
    return queries.filter(
      (query) =>
        query.name.toString().toLowerCase().includes(searchLower) ||
        query.description.toString().toLowerCase().includes(searchLower)
    );
  }, [queries, searchTerm]);

  const handleQueryClick = (queryName: string) => {
    navigate(`/view-query/${queryName}`);
  };

  const handleCreateNew = () => {
    navigate('/create-query');
  };

  if (isLoading && queries.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading queries...</p>
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
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Queries</h1>
              <p className="text-gray-600 mt-1">
                Manage and execute MongoDB aggregation pipelines
              </p>
            </div>
            <Button variant="primary" onClick={handleCreateNew}>
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
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Create New Query
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Bar */}
        <div className="mb-6">
          <Input
            placeholder="Search queries by name or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-md"
          />
        </div>

        {/* Stats */}
        <div className="mb-6 flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Showing <span className="font-semibold">{filteredQueries.length}</span> of{' '}
            <span className="font-semibold">{queries.length}</span> queries
          </p>
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="text-sm text-primary-600 hover:text-primary-700 font-medium"
            >
              Clear search
            </button>
          )}
        </div>

        {/* Query List */}
        {filteredQueries.length === 0 ? (
          <Card>
            <div className="p-12 text-center">
              {searchTerm ? (
                <>
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
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                  <p className="mt-4 text-gray-600">No queries match your search</p>
                  <p className="text-sm text-gray-500 mt-1">
                    Try adjusting your search terms
                  </p>
                  <Button
                    variant="secondary"
                    className="mt-4"
                    onClick={() => setSearchTerm('')}
                  >
                    Clear search
                  </Button>
                </>
              ) : (
                <>
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
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  <p className="mt-4 text-gray-600">No queries found</p>
                  <p className="text-sm text-gray-500 mt-1">
                    Get started by creating your first query
                  </p>
                  <Button variant="primary" className="mt-4" onClick={handleCreateNew}>
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
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                    Create New Query
                  </Button>
                </>
              )}
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredQueries.map((query) => (
              <Card
                key={query.name}
                className="cursor-pointer hover:shadow-lg transition-shadow"
              >
                <div className="p-6">
                  {/* Query Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 truncate">
                        {query.name}
                      </h3>
                    </div>
                </div>

                  {/* Description */}
                  <p className="text-sm text-gray-600 line-clamp-3 mb-4">
                    {query.description}
                  </p>

                  {/* Pipeline Stage Count */}
                  <div className="flex items-center text-xs text-gray-500">
                    <svg
                      className="w-4 h-4 mr-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 6h16M4 10h16M4 14h16M4 18h16"
                      />
                    </svg>
                    {JSON.parse(query.mongoQuery || '[]').length} pipeline stage(s)
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-4 pt-4 border-t border-gray-200 flex space-x-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/view-query/${query.name}`);
                      }}
                      className="flex-1 px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                    >
                      View Details
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/execute-query/${query.name}`);
                      }}
                      className="flex-1 px-3 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-md transition-colors flex items-center justify-center"
                    >
                      <svg
                        className="w-4 h-4 mr-1"
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
                      Execute
                    </button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
