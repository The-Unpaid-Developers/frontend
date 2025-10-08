import React, { useState } from 'react';
import type { PathSankeyData, FilterState, Link } from '../../../../types/diagrams';
import { useFetchDiagramData } from '../../../../hooks/useFetchDiagramData';
import { useToast } from '../../../../context/ToastContext';
import PathSankeyFilters from './PathSankeyFilters';
import PathSankeyDiagram from './PathSankeyDiagram';
import PathSankeyLegend from './PathSankeyLegend';

interface SystemCodesForm {
  producerSystemCode: string;
  consumerSystemCode: string;
}

const PathSankeyVisualization: React.FC = () => {
  // System codes state
  const [systemCodes, setSystemCodes] = useState<SystemCodesForm>({
    producerSystemCode: '',
    consumerSystemCode: '',
  });

  // Data loading state
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<PathSankeyData | null>(null);

  const [filters, setFilters] = useState<FilterState>({
    systemSearch: '',
    systemType: 'All',
    connectionType: 'All',
    criticality: 'All',
    frequency: 'All',
    role: 'All',
  });

  const [filteredData, setFilteredData] = useState<PathSankeyData | null>(null);

  // Hooks
  const { loadSystemsPaths } = useFetchDiagramData();
  const { showError, showSuccess } = useToast();

  // Handle system code changes
  const handleSystemCodeChange = (field: keyof SystemCodesForm, value: string) => {
    setSystemCodes(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Validation
  const isValidSystemCodes = () => {
    return systemCodes.producerSystemCode.trim() && 
           systemCodes.consumerSystemCode.trim() && 
           systemCodes.producerSystemCode.trim() !== systemCodes.consumerSystemCode.trim();
  };

  // Fetch data from backend
  const fetchDiagramData = async (producer: string, consumer: string) => {
    try {
      setIsLoading(true);
      setError(null);

      const diagramData = await loadSystemsPaths(producer.trim(), consumer.trim());
      setData(diagramData);
      setFilteredData(diagramData);
      showSuccess(`Successfully loaded paths between ${producer} and ${consumer}`);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load paths diagram data';
      setError(errorMessage);
      showError(errorMessage);
      setData(null);
      setFilteredData(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle apply system codes
  const handleApplySystemCodes = () => {
    if (!isValidSystemCodes()) {
      showError('Please enter valid producer and consumer system codes (must be different)');
      return;
    }

    fetchDiagramData(systemCodes.producerSystemCode, systemCodes.consumerSystemCode);
  };

  // Handle reset system codes
  const handleResetSystemCodes = () => {
    setSystemCodes({
      producerSystemCode: '',
      consumerSystemCode: '',
    });
    setData(null);
    setFilteredData(null);
    setError(null);
  };

  const applyFilters = () => {
    if (!data) return;

    const searchTerm = filters.systemSearch.toLowerCase();
    
    // Filter nodes based on node-specific criteria
    const focusNodes = data.nodes.filter(n => {
      const nameMatch = searchTerm === '' ||
        n.name.toLowerCase().includes(searchTerm) ||
        n.id.toLowerCase().includes(searchTerm);
      const typeMatch = filters.systemType === 'All' || n.type === filters.systemType;
      const criticalityMatch = filters.criticality === 'All' || n.criticality === filters.criticality;
      return nameMatch && typeMatch && criticalityMatch;
    });

    const focusNodeIds = new Set(focusNodes.map(n => n.id));

    // Filter links based on link-specific criteria
    const linkFilteredLinks = data.links.filter(l => {
      const connectionMatch = filters.connectionType === 'All' || l.pattern === filters.connectionType;
      const frequencyMatch = filters.frequency === 'All' || l.frequency === filters.frequency;
      const roleMatch = filters.role === 'All' || l.role.toLowerCase() === filters.role.toLowerCase();
      
      // Only include links that connect filtered nodes
      return connectionMatch && frequencyMatch && roleMatch && 
             focusNodeIds.has(l.source) && focusNodeIds.has(l.target);
    });

    // Build final nodes based on remaining links
    const finalNodeIds = new Set<string>();
    linkFilteredLinks.forEach(l => {
      finalNodeIds.add(l.source);
      finalNodeIds.add(l.target);
    });

    const finalNodes = data.nodes.filter(n => finalNodeIds.has(n.id));

    setFilteredData({
      nodes: finalNodes,
      links: linkFilteredLinks,
      metadata: {
        ...data.metadata,
        producerSystem: systemCodes.producerSystemCode,
        consumerSystem: systemCodes.consumerSystemCode,
      },
    });
  };

  const resetFilters = () => {
    setFilters({
      systemSearch: '',
      systemType: 'All',
      connectionType: 'All',
      criticality: 'All',
      frequency: 'All',
      role: 'All',
    });
    if (data) {
      setFilteredData(data);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen font-inter text-gray-800">
      <div className="max-w-screen-2xl mx-auto p-4 lg:p-6">
        {/* Header */}
        <header className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                Integration Paths Between Systems
              </h1>
              <p className="text-gray-600 mt-1">
                Analyze integration paths between producer and consumer systems
              </p>
              {data && (
                <div className="flex items-center space-x-4 mt-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span className="text-sm text-gray-600">Producer: {systemCodes.producerSystemCode}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-gray-600">Consumer: {systemCodes.consumerSystemCode}</span>
                  </div>
                  <span className="text-xs text-gray-500">
                    Generated: {data.metadata?.generatedDate || new Date().toLocaleDateString()}
                  </span>
                </div>
              )}
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Filters Column */}
          <div className="lg:col-span-3 space-y-6">
            {/* System Configuration Panel */}
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">System Configuration</h3>
              
              <div className="space-y-4">
                {/* Producer System */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Producer System <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={systemCodes.producerSystemCode}
                    onChange={(e) => handleSystemCodeChange('producerSystemCode', e.target.value)}
                    placeholder="e.g., P1"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    disabled={isLoading}
                  />
                </div>

                {/* Consumer System */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Consumer System <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={systemCodes.consumerSystemCode}
                    onChange={(e) => handleSystemCodeChange('consumerSystemCode', e.target.value)}
                    placeholder="e.g., C1"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    disabled={isLoading}
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-2 pt-2">
                  <button
                    onClick={handleApplySystemCodes}
                    disabled={isLoading || !isValidSystemCodes()}
                    className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium flex items-center justify-center space-x-1"
                  >
                    {isLoading ? (
                      <>
                        <svg className="animate-spin h-3 w-3" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>Loading</span>
                      </>
                    ) : (
                      <>
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>Apply</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={handleResetSystemCodes}
                    disabled={isLoading}
                    className="px-3 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium flex items-center justify-center"
                    title="Reset system codes"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  </button>
                </div>

                {/* Status Messages */}
                <div className="pt-2">
                  {error && (
                    <div className="text-red-600 text-xs flex items-start space-x-1">
                      <svg className="w-3 h-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>{error}</span>
                    </div>
                  )}
                  
                  {!systemCodes.producerSystemCode || !systemCodes.consumerSystemCode ? (
                    <div className="text-gray-500 text-xs flex items-center space-x-1">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>Enter both system codes and click Apply</span>
                    </div>
                  ) : systemCodes.producerSystemCode === systemCodes.consumerSystemCode ? (
                    <div className="text-orange-600 text-xs flex items-center space-x-1">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L5.232 15.5c-.77.833.192 2.5 1.732 2.5z" />
                      </svg>
                      <span>Systems must be different</span>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>

            {/* Standard Filters */}
            {data && (
              <PathSankeyFilters
                filters={filters}
                onFiltersChange={setFilters}
                onApplyFilters={applyFilters}
                onResetFilters={resetFilters}
                originalNodes={data.nodes}
                originalLinks={data.links}
                producerSystemId={systemCodes.producerSystemCode}
                consumerSystemId={systemCodes.consumerSystemCode}
              />
            )}

            {/* Legend */}
            <PathSankeyLegend />
          </div>

          {/* Graph Column */}
          <div className="lg:col-span-9">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden" style={{ height: '85vh' }}>
              <div className="w-full h-full relative overflow-auto">
                {!data && !isLoading && !error && (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <p className="text-gray-500 text-lg">Enter system codes to view integration paths</p>
                      <p className="text-gray-400 text-sm mt-1">
                        Use the System Configuration panel and click Apply to analyze paths
                      </p>
                    </div>
                  </div>
                )}

                {isLoading && (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <svg className="animate-spin h-12 w-12 text-blue-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <p className="text-gray-600 text-lg">Loading integration paths...</p>
                      <p className="text-gray-500 text-sm mt-1">
                        Analyzing paths between {systemCodes.producerSystemCode} and {systemCodes.consumerSystemCode}
                      </p>
                    </div>
                  </div>
                )}

                {error && !data && (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <svg className="w-16 h-16 text-red-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <p className="text-red-600 font-medium text-lg">Failed to load integration paths</p>
                      <p className="text-gray-500 text-sm mt-1">{error}</p>
                    </div>
                  </div>
                )}

                {filteredData && (
                  <PathSankeyDiagram
                    data={filteredData}
                    width={1000}
                    height={1000}
                    producerSystemId={systemCodes.producerSystemCode}
                    consumerSystemId={systemCodes.consumerSystemCode}
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

export default PathSankeyVisualization;