import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { OverallSystemsDiagData, OverallSystemsDiagFilterState } from '../../../../types/diagrams';
import { useFetchDiagramData } from '../../../../hooks/useFetchDiagramData';
import { useToast } from '../../../../context/ToastContext';
import OverallSystemsNewFilters from './OverallSystemsFilters';
import OverallSystemsNewDiagram from './OverallSystemsDiagram';
import OverallSystemsNewLegend from './OverallSystemsLegend';

const OverallSystemsNewVisualization: React.FC = () => {
  const navigate = useNavigate();
  // Data loading state
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<OverallSystemsDiagData | null>(null);

  const [filters, setFilters] = useState<OverallSystemsDiagFilterState>({
    systemSearch: '',
    systemType: 'All',
    criticality: 'All',
  });

  const [filteredData, setFilteredData] = useState<OverallSystemsDiagData | null>(null);

  // Hooks
  const { loadOverallSystemFlows } = useFetchDiagramData();
  const { showError } = useToast();

  // Fetch data from backend
  const fetchDiagramData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const diagramData = await loadOverallSystemFlows();
      setData(diagramData);
      setFilteredData(diagramData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load overall systems diagram data';
      setError(errorMessage);
      showError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch data when system code changes
  useEffect(() => {
    fetchDiagramData();
  }, []);

  // Handle refresh
  const handleRefresh = () => {
    fetchDiagramData();
  };

  // Apply filters - matching the working HTML template logic
  const applyFilters = () => {
    if (!data) return;

    const searchTerm = filters.systemSearch.toLowerCase();
    
    // 1. Filter nodes based on node-specific criteria. These are our "focus" nodes.
    const focusNodes = data.nodes.filter(n => {
      const typeMatch = filters.systemType === 'All' || n.type === filters.systemType;
      const criticalityMatch = filters.criticality === 'All' || n.criticality === filters.criticality;
      return typeMatch && criticalityMatch;
    });
    const focusNodeIds = new Set(focusNodes.map(n => n.id));

    // 3. The final links are the ones from linkFilteredLinks that touch at least one of the focusNodes.
    console.log(focusNodeIds);
    console.log(data.links);
    let finalLinks;
    if (searchTerm !== '') {
      finalLinks = data.links.filter(l =>
        (focusNodeIds.has(l.source.id) && l.target.id.toLowerCase().includes(searchTerm)) || 
        (focusNodeIds.has(l.target.id) && l.source.id.toLowerCase().includes(searchTerm))
      );
    } else {
      finalLinks = data.links.filter(l =>
        (focusNodeIds.has(l.source.id)) && (focusNodeIds.has(l.target.id))
      );
    }

    // 4. The final set of nodes includes all nodes from the final links, plus any focus nodes that might be isolates.
    const finalNodeIds = new Set<string>();
    finalLinks.forEach(l => {
      finalNodeIds.add(l.source.id);
      finalNodeIds.add(l.target.id);
    });
    if (searchTerm === '') {
      focusNodeIds.forEach(id => finalNodeIds.add(id)); // Add back isolates that match filters
    }

    const finalNodes = data.nodes.filter(n => finalNodeIds.has(n.id));
    console.log("After filtering, nodes:", finalNodes, "links:", finalLinks);

    setFilteredData({
      nodes: finalNodes,
      links: finalLinks,
      metadata: data.metadata,
    });
  };

  const resetFilters = () => {
    setFilters({
      systemSearch: '',
      systemType: 'All',
      criticality: 'All'
    });
    if (data) {
      setFilteredData(data);
    }
  };

  // Handle node click
  const handleNodeClick = (nodeId: string) => {
    console.log("Node clicked in visualization:", nodeId);
    navigate(`/view-system-flow-diagram/${nodeId}`);
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
              <span className="text-gray-500 text-lg">Loading overall systems diagram...</span>
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
              <p className="text-red-600 font-medium text-lg">Failed to load overall systems diagram</p>
              <p className="text-gray-500 text-sm mt-1">{error || 'No data available'}</p>
              <button
                onClick={handleRefresh}
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
                Overall Systems
              </h1>
              <p className="text-gray-600 mt-1">
                Generated on: <span>{data.metadata.generatedDate || new Date().toLocaleDateString()}</span>
              </p>
            </div>
            <button
              onClick={handleRefresh}
              disabled={isLoading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center space-x-2"
              title="Refresh diagram"
            >
              <svg className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span>Refresh</span>
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Filters Column */}
          <div className="lg:col-span-3">
            <OverallSystemsNewFilters
              filters={filters}
              onFiltersChange={setFilters}
              onApplyFilters={applyFilters}
              onResetFilters={resetFilters}
              originalNodes={data.nodes}
              originalLinks={data.links}
            />
            <OverallSystemsNewLegend />
          </div>

          {/* Graph Column */}
          <div className="lg:col-span-9">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden" style={{ height: '85vh' }}>
              <div className="w-full h-full relative overflow-auto">
                {filteredData && (
                  <OverallSystemsNewDiagram
                    data={filteredData}
                    onNodeClick={handleNodeClick}
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

export default OverallSystemsNewVisualization;