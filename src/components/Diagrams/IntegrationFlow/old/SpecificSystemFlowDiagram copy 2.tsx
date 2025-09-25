import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent, Button, Input, DropDown } from '../../../ui';
import { useToast } from '../../../../context/ToastContext';
import type { SystemDependencyDiagramData } from '../../../../types/diagrams';
import { useFetchDiagramData } from '../../../../hooks/useFetchDiagramData';
import * as d3 from 'd3';
import { sankey, sankeyLinkHorizontal, sankeyJustify } from 'd3-sankey';

interface SpecificSystemFlowDiagramProps {
  systemCode?: string;
  onSystemClick?: (systemCode: string) => void;
}

const SpecificSystemFlowDiagram: React.FC<SpecificSystemFlowDiagramProps> = ({
  systemCode: propSystemCode,
  onSystemClick
}) => {
  const { systemCode: paramSystemCode } = useParams<{ systemCode: string }>();
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [diagramData, setDiagramData] = useState<SystemDependencyDiagramData | null>(null);
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('All');
  const [selectedConnection, setSelectedConnection] = useState('All');
  const [selectedCriticality, setSelectedCriticality] = useState('All');
  const [selectedRole, setSelectedRole] = useState('All');
  
  const { showError } = useToast();
  const { loadSystemFlows } = useFetchDiagramData();
  
  const currentSystemCode = propSystemCode || paramSystemCode;

  // Color scales
  const linksColorScale = d3.scaleOrdinal()
    .domain(["Web Service", "API", "Batch", "File"])
    .range(["#1f77b4", "#9467bd", "#2ca02c", "#ff7f0e"])
    .unknown("#6b7280");

  const nodesColorScale = d3.scaleOrdinal()
    .domain(["Major", "Standard-1", "Standard-2", "Standard-3"])
    .range(["#ef4444", "#f59e0b", "#22c55e", "#0ea5e9"])
    .unknown("#6b7280");

  // Fetch diagram data
  const fetchDiagramData = async (systemCode: string) => {
    try {
      setIsLoading(true);
      setError(null);

      const data: SystemDependencyDiagramData = await loadSystemFlows(systemCode);
      setDiagramData(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load diagram';
      setError(errorMessage);
      showError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Node click handler
  const handleNodeClick = useCallback((event: any, d: any) => {
    if (d.id !== currentSystemCode) {
      if (onSystemClick) {
        onSystemClick(d.id);
      } else {
        navigate(`/view-system-flow-diagram/${d.id}`);
      }
    }
  }, [currentSystemCode, onSystemClick, navigate]);

  // Tooltip handlers
  const handleNodeMouseOver = useCallback((event: any, d: any) => {
    if (!tooltipRef.current) return;
    
    const tooltip = d3.select(tooltipRef.current);
    tooltip.transition().duration(200).style("opacity", 0.9);
    
    const clickText = d.id !== currentSystemCode ? "<br/><em>Click to view this system's diagram</em>" : "";
    tooltip.html(`<strong>${d.name} (${d.id})</strong><br/>Type: ${d.type}<br/>Criticality: ${d.criticality}<br/>Internet Facing: ${d.internetFacing}<br/>Environment: ${d.environment}${clickText}`)
      .style("left", (event.pageX + 15) + "px")
      .style("top", (event.pageY - 28) + "px");
  }, [currentSystemCode]);

  const handleLinkMouseOver = useCallback((event: any, d: any) => {
    if (!tooltipRef.current) return;
    
    const tooltip = d3.select(tooltipRef.current);
    tooltip.transition().duration(200).style("opacity", 0.9);
    tooltip.html(`<strong>${d.source.name} → ${d.target.name}</strong><br/>Pattern: ${d.pattern}<br/>Frequency: ${d.frequency}<br/>Description: ${d.description || 'N/A'}`)
      .style("left", (event.pageX + 15) + "px")
      .style("top", (event.pageY - 28) + "px");
  }, []);

  const handleMouseOut = useCallback(() => {
    if (!tooltipRef.current) return;
    
    const tooltip = d3.select(tooltipRef.current);
    tooltip.transition().duration(500).style("opacity", 0);
  }, []);

  // Create Sankey diagram
  const createSankey = useCallback((data: SystemDependencyDiagramData) => {
    if (!svgRef.current || !containerRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const containerRect = containerRef.current.getBoundingClientRect();
    const margin = { top: 30, right: 50, bottom: 30, left: 50 };
    const width = containerRect.width - margin.left - margin.right;
    const height = 600 - margin.top - margin.bottom;

    svg.attr("width", containerRect.width).attr("height", 600);

    const g = svg.append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

    // Create sankey generator
    const sankeyGenerator = sankey()
      .nodeId((d: any) => d.id)
      .nodeWidth(20)
      .nodePadding(25)
      .nodeAlign(sankeyJustify)
      .extent([[0, 0], [width, height]]);

    // Process data
    const graph = {
      nodes: data.nodes.map(d => ({ ...d })),
      links: data.links.map(d => ({ ...d, value: d.value || 1 }))
    };

    const { nodes, links } = sankeyGenerator(graph);

    // Draw links
    g.append("g")
      .selectAll("path")
      .data(links)
      .join("path")
      .attr("class", "link")
      .attr("d", sankeyLinkHorizontal())
      .attr("stroke", (d: any) => linksColorScale(d.pattern))
      .attr("stroke-width", (d: any) => Math.max(1, d.width))
      .attr("fill", "none")
      .attr("opacity", 0.5)
      .style("cursor", "pointer")
      .on("mouseover", handleLinkMouseOver)
      .on("mouseout", handleMouseOut)
      .on("mouseenter", function() {
        d3.select(this).attr("opacity", 0.7);
      })
      .on("mouseleave", function() {
        d3.select(this).attr("opacity", 0.5);
      });

    // Draw nodes
    const node = g.append("g")
      .selectAll("g")
      .data(nodes)
      .join("g")
      .attr("class", (d: any) => d.id === currentSystemCode ? "node" : "node clickable-node")
      .attr("transform", (d: any) => `translate(${d.x0}, ${d.y0})`)
      .style("cursor", (d: any) => d.id === currentSystemCode ? "default" : "pointer")
      .on("mouseover", handleNodeMouseOver)
      .on("mouseout", handleMouseOut)
      .on("click", handleNodeClick);

    // Node rectangles
    node.append("rect")
      .attr("height", (d: any) => d.y1 - d.y0)
      .attr("width", (d: any) => d.x1 - d.x0)
      .attr("fill", (d: any) => nodesColorScale(d.criticality))
      .attr("stroke", "#374151")
      .attr("stroke-width", 1)
      .on("mouseenter", function(event, d: any) {
        if (d.id !== currentSystemCode) {
          d3.select(this).attr("stroke", "#3b82f6").attr("stroke-width", 2);
        }
      })
      .on("mouseleave", function(event, d: any) {
        if (d.id !== currentSystemCode) {
          d3.select(this).attr("stroke", "#374151").attr("stroke-width", 1);
        }
      });

    // Node labels
    node.append("text")
      .attr("x", (d: any) => d.x0 < width / 2 ? -6 : (d.x1 - d.x0) + 6)
      .attr("y", (d: any) => (d.y1 - d.y0) / 2)
      .attr("dy", "0.35em")
      .attr("text-anchor", (d: any) => d.x0 < width / 2 ? "end" : "start")
      .style("font-size", "12px")
      .style("font-weight", "500")
      .style("pointer-events", "none")
      .style("text-shadow", "-1px -1px 0 #fff, 1px -1px 0 #fff, -1px 1px 0 #fff, 1px 1px 0 #fff")
      .text((d: any) => d.name);

    // Add zoom functionality
    const zoom = d3.zoom()
      .scaleExtent([0.5, 3])
      .on("zoom", (event) => {
        g.attr("transform", `translate(${margin.left}, ${margin.top}) ${event.transform}`);
      });
    
    svg.call(zoom as any);
  }, [currentSystemCode, linksColorScale, nodesColorScale, handleNodeClick, handleNodeMouseOver, handleLinkMouseOver, handleMouseOut]);

  // Apply filters
  const applyFilters = useCallback(() => {
    if (!diagramData) return;

    let filteredNodes = diagramData.nodes.filter(n => {
      const nameMatch = searchTerm === '' || 
        n.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        n.id.toLowerCase().includes(searchTerm.toLowerCase());
      const typeMatch = selectedType === 'All' || n.type === selectedType;
      const criticalityMatch = selectedCriticality === 'All' || n.criticality === selectedCriticality;
      return nameMatch && typeMatch && criticalityMatch;
    });

    let filteredLinks = diagramData.links.filter(l => {
      const connectionMatch = selectedConnection === 'All' || l.pattern === selectedConnection;
      const roleMatch = selectedRole === 'All' || l.role.toLowerCase() === selectedRole.toLowerCase();
      return connectionMatch && roleMatch;
    });

    // Ensure we have nodes for all links
    const nodeIds = new Set(filteredNodes.map(n => n.id));
    filteredLinks = filteredLinks.filter(l => nodeIds.has(l.source) && nodeIds.has(l.target));

    // Ensure we include the pinned system
    if (currentSystemCode && !nodeIds.has(currentSystemCode)) {
      const pinnedNode = diagramData.nodes.find(n => n.id === currentSystemCode);
      if (pinnedNode) {
        filteredNodes.push(pinnedNode);
      }
    }

    const filteredData = {
      ...diagramData,
      nodes: filteredNodes,
      links: filteredLinks
    };

    createSankey(filteredData);
  }, [diagramData, searchTerm, selectedType, selectedConnection, selectedCriticality, selectedRole, currentSystemCode, createSankey]);

  // Reset filters
  const resetFilters = useCallback(() => {
    setSearchTerm('');
    setSelectedType('All');
    setSelectedConnection('All');
    setSelectedCriticality('All');
    setSelectedRole('All');
    
    if (diagramData) {
      createSankey(diagramData);
    }
  }, [diagramData, createSankey]);

  // Get filter options
  const getFilterOptions = useCallback(() => {
    if (!diagramData) return { types: [], connections: [], criticalities: [] };

    return {
      types: ["All", ...new Set(diagramData.nodes.map(d => d.type))],
      connections: ["All", ...new Set(diagramData.links.map(d => d.pattern))],
      criticalities: ["All", ...new Set(diagramData.nodes.map(d => d.criticality))],
      roles: ["All", "Producer", "Consumer"]
    };
  }, [diagramData]);

  // Fetch data when systemCode changes
  useEffect(() => {
    if (currentSystemCode) {
      fetchDiagramData(currentSystemCode);
    }
  }, [currentSystemCode]);

  // Create diagram when data changes
  useEffect(() => {
    if (diagramData) {
      createSankey(diagramData);
    }
  }, [diagramData, createSankey]);

  // Handle refresh
  const handleRefresh = () => {
    if (currentSystemCode) {
      fetchDiagramData(currentSystemCode);
    }
  };

  // Handle fullscreen
  const handleFullscreen = () => {
    if (containerRef.current?.requestFullscreen) {
      containerRef.current.requestFullscreen();
    }
  };

  const filterOptions = getFilterOptions();

  if (!currentSystemCode) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <p className="text-gray-500">No system code provided</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div ref={containerRef} className="w-full h-full">
      <Card className="h-full">
        <CardHeader className="flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="flex items-center">
            <svg className="w-5 h-5 mr-2 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
            </svg>
            System Integration Flow
            {diagramData && (
              <span className="ml-2 text-sm font-normal text-gray-500">
                ({diagramData.metadata.code})
              </span>
            )}
          </CardTitle>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRefresh}
              disabled={isLoading}
              title="Refresh diagram"
            >
              <svg className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={handleFullscreen}
              title="Fullscreen"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
              </svg>
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="p-6">
          {isLoading && (
            <div className="flex items-center justify-center h-96">
              <div className="flex items-center space-x-2">
                <svg className="animate-spin h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 714 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span className="text-gray-500">Loading system flow diagram...</span>
              </div>
            </div>
          )}
          
          {error && (
            <div className="flex items-center justify-center h-96">
              <div className="text-center">
                <svg className="w-12 h-12 text-red-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-red-600 font-medium">Failed to load diagram</p>
                <p className="text-gray-500 text-sm mt-1">{error}</p>
                <Button className="mt-4" onClick={handleRefresh}>
                  Try Again
                </Button>
              </div>
            </div>
          )}
          
          {diagramData && !isLoading && !error && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Controls Column */}
              <div className="lg:col-span-3 space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Filters</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Filter by System Name/Code
                        <Input
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          placeholder="Search systems..."
                        />
                      </label>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        System Type
                        <DropDown
                          value={selectedType}
                          onChange={(e) => setSelectedType(e.target.value)}
                          options={filterOptions.types.map(type => ({ value: type, label: type }))}
                        />
                      </label>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Connection Type
                        <DropDown
                          value={selectedConnection}
                          onChange={(e) => setSelectedConnection(e.target.value)}
                          options={filterOptions.connections.map(conn => ({ value: conn, label: conn }))}
                        />
                      </label>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Criticality
                        <DropDown
                          value={selectedCriticality}
                          onChange={(e) => setSelectedCriticality(e.target.value)}
                          options={filterOptions.criticalities.map(crit => ({ value: crit, label: crit }))}
                        />
                      </label>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Role to {diagramData.metadata.code}
                        <DropDown
                          value={selectedRole}
                          onChange={(e) => setSelectedRole(e.target.value)}
                          options={filterOptions.roles.map(role => ({ value: role, label: role }))}
                        />
                      </label>
                    </div>
                    
                    <div className="flex space-x-2 pt-4 border-t">
                      <Button
                        onClick={applyFilters}
                        className="flex-1 bg-green-600 hover:bg-green-700"
                      >
                        Apply Filters
                      </Button>
                      <Button
                        onClick={resetFilters}
                        variant="secondary"
                        className="flex-1"
                      >
                        Reset All
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Legend */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Legend</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold mb-2">Nodes (Criticality)</h4>
                        <div className="space-y-2">
                          {[
                            { color: "#ef4444", label: "Major" },
                            { color: "#f59e0b", label: "Standard-1" },
                            { color: "#22c55e", label: "Standard-2" },
                            { color: "#6b7280", label: "N/A or Other" }
                          ].map(({ color, label }) => (
                            <div key={label} className="flex items-center">
                              <div 
                                className="w-4 h-4 rounded-full mr-2" 
                                style={{ backgroundColor: color }}
                              />
                              <span className="text-sm">{label}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold mb-2">Links (Integration Pattern)</h4>
                        <div className="space-y-2">
                          {[
                            { color: "#1f77b4", label: "Web Service" },
                            { color: "#9467bd", label: "API" },
                            { color: "#2ca02c", label: "Batch" },
                            { color: "#ff7f0e", label: "File" },
                            { color: "#6b7280", label: "N/A or Other" }
                          ].map(({ color, label }) => (
                            <div key={label} className="flex items-center">
                              <div 
                                className="w-4 h-4 rounded-full mr-2" 
                                style={{ backgroundColor: color }}
                              />
                              <span className="text-sm">{label}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Graph Column */}
              <div className="lg:col-span-9">
                <Card>
                  <CardHeader>
                    <CardTitle>
                      {diagramData.metadata.code} {diagramData.metadata.review} Visualization
                    </CardTitle>
                    <p className="text-sm text-gray-600">
                      Generated on: {diagramData.metadata.generatedDate}
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="relative">
                      <svg
                        ref={svgRef}
                        className="w-full border rounded"
                        style={{ minHeight: '600px' }}
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Tooltip */}
      <div
        ref={tooltipRef}
        className="absolute pointer-events-none opacity-0 bg-gray-800 text-white text-xs rounded p-2 z-10 transition-opacity duration-200"
        style={{ maxWidth: '300px' }}
      />
    </div>
  );
};

export default SpecificSystemFlowDiagram;