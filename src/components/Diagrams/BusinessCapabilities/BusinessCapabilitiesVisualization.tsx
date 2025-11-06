import React, { useState, useEffect, useRef } from 'react';
import type { BusinessCapabilitiesData } from '../../../types/diagrams';
import { useFetchDiagramData } from '../../../hooks/useFetchDiagramData';
import { useToast } from '../../../context/ToastContext';
import BusinessCapabilitiesSearch from './BusinessCapabilitiesSearch';
import BusinessCapabilitiesDiagram, { type BusinessCapabilitiesDiagramHandle } from './BusinessCapabilitiesDiagram';
import BusinessCapabilitiesLegend from './BusinessCapabilitiesLegend';
import { useParams, useNavigate, useLocation } from 'react-router-dom';


const BusinessCapabilitiesVisualization: React.FC = () => {
  // Data loading state
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<BusinessCapabilitiesData | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [matchCount, setMatchCount] = useState(0);
  const diagramRef = useRef<BusinessCapabilitiesDiagramHandle>(null);
  const systemCode = useParams<{ systemCode?: string }>().systemCode;

  // Hooks
  const { loadBusinessCapabilities, loadSystemBusinessCapabilities } = useFetchDiagramData();
  const { showError } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  // Fetch data from backend
  const fetchDiagramData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const diagramData = systemCode
        ? await loadSystemBusinessCapabilities(systemCode)
        : await loadBusinessCapabilities();
      setData(diagramData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load business capabilities data';
      setError(errorMessage);
      showError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch data on mount and when systemCode changes
  useEffect(() => {
    fetchDiagramData();
  }, [systemCode]);

  // Handle expand/collapse
  const handleExpandAll = () => {
    diagramRef.current?.expandAll();
  };

  const handleCollapseAll = () => {
    diagramRef.current?.collapseAll();
  };

  // Handle system node click - navigate with systemCode query param
  const handleSystemClick = (systemCode: string) => {
    const currentPath = location.pathname;
    navigate(`${currentPath}/${systemCode}`);
  };

  // Handle search match callback
  const handleSearchMatch = (matchedNodes: string[]) => {
    setMatchCount(matchedNodes.length);
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="bg-gray-100 min-h-screen font-inter text-gray-800">
        <div className="max-w-screen-2xl mx-auto p-4 lg:p-6">
          <div className="flex items-center justify-center h-96">
            <div className="flex items-center space-x-2">
              <svg className="animate-spin h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span className="text-gray-500 text-lg">Loading business capabilities...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !data) {
    return (
      <div className="bg-gray-100 min-h-screen font-inter text-gray-800">
        <div className="max-w-screen-2xl mx-auto p-4 lg:p-6">
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <svg className="w-16 h-16 text-red-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-red-600 font-medium text-lg">Failed to load business capabilities</p>
              <p className="text-gray-500 text-sm mt-1">{error || 'No data available'}</p>
              <button
                onClick={fetchDiagramData}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen font-inter text-gray-800">
      <div className="max-w-screen-2xl mx-auto p-4 lg:p-6">
        {/* Header */}
        <header className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                Business Capabilities
              </h1>
              <p className="text-gray-600 mt-1">
                Hierarchical view of business capabilities and systems
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={handleExpandAll}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
                title="Expand all nodes"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span>Expand All</span>
              </button>
              <button
                onClick={handleCollapseAll}
                className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors flex items-center space-x-2"
                title="Collapse all nodes"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                </svg>
                <span>Collapse All</span>
              </button>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Search and Legend Column */}
          <div className="lg:col-span-3">
            <BusinessCapabilitiesSearch
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              matchCount={matchCount}
            />
            <BusinessCapabilitiesLegend />
          </div>

          {/* Diagram Column */}
          <div className="lg:col-span-9">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden" style={{ height: '85vh' }}>
              <div className="w-full h-full relative overflow-hidden">
                {data && (
                  <BusinessCapabilitiesDiagram
                    ref={diagramRef}
                    data={data.capabilities}
                    searchTerm={searchTerm}
                    onSearchMatch={handleSearchMatch}
                    onSystemClick={handleSystemClick}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessCapabilitiesVisualization;
