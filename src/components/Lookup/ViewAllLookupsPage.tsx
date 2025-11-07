import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Card } from '../ui/Card';
import { useLookup } from '../../hooks/useLookup';
import type { LookupWOData } from '../../types/lookup';
import { useToast } from '../../context/ToastContext';

export const ViewAllLookupsPage: React.FC = () => {
  const navigate = useNavigate();
  const { loadAllLookups, isLoading } = useLookup();
  const { showError } = useToast();

  const [lookups, setLookups] = useState<LookupWOData[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  // Load all lookups on mount
  useEffect(() => {
    const fetchLookups = async () => {
      try {
        const data = await loadAllLookups();
        setLookups(data);
      } catch (error) {
        console.error('Error loading lookups:', error);
        showError(`Failed to load lookups: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    };

    fetchLookups();
  }, []);

  // Filter lookups based on search term
  const filteredLookups = useMemo(() => {
    if (!searchTerm.trim()) {
      return lookups;
    }

    const searchLower = searchTerm.toString().toLowerCase();
    return lookups.filter(
      (lookup) =>
        lookup.lookupName.toString().toLowerCase().includes(searchLower) ||
        lookup.description.toString().toLowerCase().includes(searchLower)
    );
  }, [lookups, searchTerm]);

  const handleLookupClick = (lookupName: string) => {
    navigate(`/view-lookup/${lookupName}`);
  };

  const handleCreateNew = () => {
    navigate('/create-lookup');
  };

  if (isLoading && lookups.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading lookups...</p>
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
              <h1 className="text-2xl font-bold text-gray-900">Lookups</h1>
              <p className="text-gray-600 mt-1">
                View and Manage Lookups
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
              Create New LookupWOData
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Bar */}
        <div className="mb-6">
          <Input
            placeholder="Search lookups by name or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-md"
          />
        </div>

        {/* Stats */}
        <div className="mb-6 flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Showing <span className="font-semibold">{filteredLookups.length}</span> of{' '}
            <span className="font-semibold">{lookups.length}</span> lookups
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

        {/* LookupWOData List */}
        {filteredLookups.length === 0 ? (
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
                  <p className="mt-4 text-gray-600">No lookups match your search</p>
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
                  <p className="mt-4 text-gray-600">No lookups found</p>
                  <p className="text-sm text-gray-500 mt-1">
                    Get started by creating your first lookup
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
                    Create New LookupWOData
                  </Button>
                </>
              )}
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredLookups.map((lookup) => (
              <Card
                key={lookup.lookupName}
                className="cursor-pointer hover:shadow-lg transition-shadow"
              >
                <div className="p-6">
                  {/* LookupWOData Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 truncate">
                        {lookup.lookupName}
                      </h3>
                    </div>
                </div>

                  {/* Description */}
                  <p className="text-sm text-gray-600 line-clamp-3 mb-4">
                    {lookup.description}
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
                    {lookup.recordCount} record(s)
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-4 pt-4 border-t border-gray-200 flex space-x-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/view-lookup/${lookup.lookupName}`);
                      }}
                      className="flex-1 px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                    >
                      View Details
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
