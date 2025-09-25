import React, { use, useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent, Button } from '../../../ui';
import { useToast } from '../../../../context/ToastContext';
import type { SystemDependencyDiagramData } from '../../../../types/diagrams';
import { useFetchDiagramData } from '../../../../hooks/useFetchDiagramData';

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
  const iframeRef = useRef<HTMLIFrameElement>(null);
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [diagramData, setDiagramData] = useState<SystemDependencyDiagramData | null>(null);
  
  const { showError } = useToast();
  
  const currentSystemCode = propSystemCode || paramSystemCode;

  const { loadSystemFlows } = useFetchDiagramData();

  // Fetch diagram data from backend
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

  // Generate the HTML content with embedded data
  const generateDiagramHTML = (data: SystemDependencyDiagramData): string => {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${data.metadata.code} ${data.metadata.review} Visualisation</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://d3js.org/d3.v7.min.js"></script>
    <script src="https://unpkg.com/d3-sankey@0.12.3/dist/d3-sankey.min.js"></script>
    <link
      href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
      rel="stylesheet"
    />
    <style>
      .controls-container {
        background-color: white;
        border-radius: 0.75rem;
        box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
      }
      .graph-container {
        background-color: white;
        border-radius: 0.75rem;
        box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
        overflow: hidden;
      }
      .highlighted {
        stroke: #ef4444;
        stroke-width: 3px !important;
        stroke-opacity: 1;
      }
      .path-highlight-node circle {
        stroke: #10b981;
        stroke-width: 4px;
      }
      .path-highlight-link {
        stroke: #10b981;
        stroke-width: 4px;
        stroke-opacity: 1;
      }
      .dimmed {
        opacity: 0.1;
      }
      .select-input {
        width: 100%;
        padding: 0.5rem;
        border: 1px solid #d1d5db;
        border-radius: 0.375rem;
        background-color: #fff;
        box-shadow: inset 0 1px 2px 0 rgb(0 0 0 / 0.05);
      }
      body {
        font-family: 'Inter', sans-serif;
        background-color: #f3f4f6;
        color: #111827;
      }
      .container-box {
        background-color: white;
        border-radius: 0.75rem;
        box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
      }
      svg {
        width: 100%;
        height: 100%;
      }
      .node rect {
        stroke: #374151;
        stroke-width: 1px;
        cursor: pointer;
      }
      .node text {
        font-size: 12px;
        font-weight: 500;
        pointer-events: none;
        text-shadow: -1px -1px 0 #fff, 1px -1px 0 #fff, -1px 1px 0 #fff, 1px 1px 0 #fff;
      }
      .link {
        fill-opacity: 0.5;
        stroke-opacity: 0.3;
        transition: fill-opacity 0.2s ease-in-out;
      }
      .link:hover {
        fill-opacity: 0.7;
      }
      .tooltip {
        position: absolute;
        text-align: left;
        padding: 8px;
        font-size: 12px;
        background: #1f2937;
        color: #fff;
        border: 0px;
        border-radius: 8px;
        pointer-events: none;
        opacity: 0;
        transition: opacity 0.2s;
        z-index: 10;
      }
      .clickable-node {
        cursor: pointer;
      }
      .clickable-node:hover rect {
        stroke-width: 2px;
        stroke: #3b82f6;
      }
    </style>
</head>
<body class="p-4 lg:p-6">
    <div class="max-w-screen-2xl mx-auto">
      <header class="mb-6">
        <h1 class="text-3xl font-bold text-gray-800">
          ${data.metadata.code} ${data.metadata.review} Visualisation
        </h1>
        <p class="text-gray-600 mt-1">
          Generated on: <span>${data.metadata.generatedDate}</span>
        </p>
      </header>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <!-- Controls Column -->
        <div class="lg:col-span-3 controls-container p-5 self-start">
          <h2 class="text-xl font-semibold mb-4 border-b pb-2">Filters</h2>
          <div class="space-y-6">
            <div>
              <div class="space-y-4">
                <div>
                  <label for="system-search" class="block text-sm font-medium text-gray-700 mb-1">
                    Filter by System Name/Code
                  </label>
                  <input type="text" id="system-search" class="select-input" />
                </div>
                <div>
                  <label for="system-type-filter" class="block text-sm font-medium text-gray-700 mb-1">
                    System Type
                  </label>
                  <select id="system-type-filter" class="select-input"></select>
                </div>
                <div>
                  <label for="connection-type-filter" class="block text-sm font-medium text-gray-700 mb-1">
                    Connection Type
                  </label>
                  <select id="connection-type-filter" class="select-input"></select>
                </div>
                <div>
                  <label for="criticality-filter" class="block text-sm font-medium text-gray-700 mb-1">
                    Criticality
                  </label>
                  <select id="criticality-filter" class="select-input"></select>
                </div>
                <div>
                  <label for="role-filter" class="block text-sm font-medium text-gray-700 mb-1">
                    Role to ${data.metadata.code}
                  </label>
                  <select id="role-filter" class="select-input"></select>
                </div>
              </div>
            </div>
            <div class="border-t pt-4 flex space-x-2">
              <button id="apply-filters-button" 
                class="w-full bg-green-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-700 transition-colors">
                Apply Filters
              </button>
              <button id="reset-button" 
                class="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
                Reset All
              </button>
            </div>
            <div class="mt-8 border-t pt-4">
              <h3 class="text-lg font-semibold mb-2">Nodes Legend (Criticality)</h3>
              <div class="space-y-2">
                <div class="flex items-center">
                  <div class="w-4 h-4 rounded-full mr-2" style="background-color: #ef4444;"></div>
                  <span class="text-sm">Major</span>
                </div>
                <div class="flex items-center">
                  <div class="w-4 h-4 rounded-full mr-2" style="background-color: #f59e0b;"></div>
                  <span class="text-sm">Standard-1</span>
                </div>
                <div class="flex items-center">
                  <div class="w-4 h-4 rounded-full mr-2" style="background-color: #22c55e;"></div>
                  <span class="text-sm">Standard-2</span>
                </div>
                <div class="flex items-center">
                  <div class="w-4 h-4 rounded-full mr-2" style="background-color: #6b7280;"></div>
                  <span class="text-sm">N/A or Other</span>
                </div>
              </div>
              <h3 class="text-lg font-semibold mb-2 mt-4">Links Legend (Integration Pattern)</h3>
              <div class="space-y-2">
                <div class="flex items-center">
                  <div class="w-4 h-4 rounded-full mr-2" style="background-color: #1f77b4;"></div>
                  <span class="text-sm">Web Service</span>
                </div>
                <div class="flex items-center">
                  <div class="w-4 h-4 rounded-full mr-2" style="background-color: #9467bd;"></div>
                  <span class="text-sm">API</span>
                </div>
                <div class="flex items-center">
                  <div class="w-4 h-4 rounded-full mr-2" style="background-color: #2ca02c;"></div>
                  <span class="text-sm">Batch</span>
                </div>
                <div class="flex items-center">
                  <div class="w-4 h-4 rounded-full mr-2" style="background-color: #ff7f0e;"></div>
                  <span class="text-sm">File</span>
                </div>
                <div class="flex items-center">
                  <div class="w-4 h-4 rounded-full mr-2" style="background-color: #6b7280;"></div>
                  <span class="text-sm">N/A or Other</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Graph Column -->
        <div class="lg:col-span-9 container-box h-[85vh]" style="width: 1000px; height:1000px; overflow:scroll;">
          <div id="graph-wrapper" class="w-full h-full relative">
            <!-- SVG for D3 will be appended here -->
          </div>
        </div>
      </div>
    </div>

    <!-- Tooltip -->
    <div id="tooltip" class="tooltip"></div>

    <script type="module">
      // --- EMBEDDED DATA ---
      const defaultData = ${JSON.stringify(data)};

      // --- GLOBAL VARIABLES ---
      let originalNodes, originalLinks;
      let simulation, svg, g, link, node, linkLabel;
      const tooltip = d3.select("#tooltip");
      
      const linksColorScale = d3.scaleOrdinal(d3.schemeCategory10)
        .domain(["Web Service", "API", "Batch", "File"])
        .range(["#1f77b4", "#9467bd", "#2ca02c", "#ff7f0e"])
        .unknown("#6b7280");

      const nodesColorScale = d3.scaleOrdinal()
        .domain(["Major", "Standard-1", "Standard-2", "Standard-3"])
        .range(["#ef4444", "#f59e0b", "#22c55e", "#0ea5e9"])
        .unknown("#6b7280");

      // --- DOM ELEMENTS ---
      const wrapper = d3.select("#graph-wrapper");
      const systemSearchInput = document.getElementById("system-search");
      const systemTypeFilter = document.getElementById("system-type-filter");
      const connectionTypeFilter = document.getElementById("connection-type-filter");
      const criticalityFilter = document.getElementById("criticality-filter");
      const roleFilter = document.getElementById("role-filter");
      const applyFiltersButton = document.getElementById("apply-filters-button");
      const resetButton = document.getElementById("reset-button");

      const pinnedSystemCode = defaultData.metadata.code;
      const reviewCode = defaultData.metadata.review;
      const integrationMiddlewareNamelist = defaultData.metadata.integrationMiddleware;
      const generatedDate = defaultData.metadata.generatedDate;

      // --- NODE CLICK HANDLER FOR NAVIGATION ---
      function handleNodeClick(event, d) {
        if (d.id !== pinnedSystemCode) {
          // Post message to parent React component
          window.parent.postMessage({
            type: 'SYSTEM_NODE_CLICK',
            systemCode: d.id,
            systemName: d.name
          }, '*');
        }
      }

      // --- INITIALIZATION ---
      function initialize(defaultData) {
        originalNodes = JSON.parse(JSON.stringify(defaultData.nodes));
        originalLinks = JSON.parse(JSON.stringify(defaultData.links));
        populateFilters();
        setupEventListeners();
        createSankey(defaultData);
      }

      function createSankey(data) {
        console.log("Creating Sankey diagram with data:", data);
        wrapper.selectAll("*").remove();

        const { width, height } = wrapper.node().getBoundingClientRect();
        const margin = {top: 30, right: 200, bottom: 30, left: 200};
        const graphWidth = width - margin.left - margin.right;
        const graphHeight = height - margin.top - margin.bottom;

        svg = wrapper.append("svg")
          .attr("width", width)
          .attr("height", height);

        g = svg.append("g")
          .attr("transform", \`translate(\${margin.left},\${margin.top})\`);

        const sankey = d3.sankey()
          .nodeId(d => d.id)
          .nodeWidth(20)
          .nodePadding(25)
          .nodeAlign(d3.sankeyJustify)
          .nodeSort((a, b) => {
            const allLinks = node => [...(node.sourceLinks||[]), ...(node.targetLinks||[])];
            const touchesMW = node =>
              integrationMiddlewareNamelist.includes(node.id) ||
              allLinks(node).some(l =>
                integrationMiddlewareNamelist.includes(l.source.id) ||
                integrationMiddlewareNamelist.includes(l.target.id)
              );
            const directToMain = node =>
              allLinks(node).some(l =>
                (l.source.id === pinnedSystemCode && l.target.id !== pinnedSystemCode) ||
                (l.target.id === pinnedSystemCode && l.source.id !== pinnedSystemCode)
              );

            const aMW = touchesMW(a), bMW = touchesMW(b);
            if (aMW !== bMW) return aMW ? -1 : 1;

            const getBase = node => {
              if (integrationMiddlewareNamelist.includes(node.id)) {
                return node.id.split('-')[0];
              }
              const link = allLinks(node).find(l =>
                integrationMiddlewareNamelist.includes(l.source.id) ||
                integrationMiddlewareNamelist.includes(l.target.id)
              );
              const mw = link
                ? integrationMiddlewareNamelist.find(id => id === link.source.id || id === link.target.id)
                : '';
              return mw.split('-')[0] || '';
            };

            const bases = Array.from(
              new Set(integrationMiddlewareNamelist.map(id => id.split('-')[0]))
            ).sort();
            const aBase = getBase(a), bBase = getBase(b);
            if (aBase !== bBase) {
              return bases.indexOf(aBase) - bases.indexOf(bBase);
            }

            const aDir = directToMain(a), bDir = directToMain(b);
            if (aDir !== bDir) return aDir ? 1 : -1;

            return a.type.localeCompare(b.type);
          })
          .extent([[0, 0], [graphWidth, graphHeight]]);

        const graph = processDataForSankey(data);
        let { nodes, links } = sankey(graph);

        links = links.slice().sort((a, b) => {
          const isMWLink = l =>
            integrationMiddlewareNamelist.includes(l.source.id) ||
            integrationMiddlewareNamelist.includes(l.target.id);
          const aMW = isMWLink(a), bMW = isMWLink(b);
          if (aMW === bMW) return 0;
          return aMW ? -1 : 1;
        });

        const mwLinks = links.filter(l =>
          integrationMiddlewareNamelist.includes(l.source.id) ||
          integrationMiddlewareNamelist.includes(l.target.id)
        );
        const directLinks = links.filter(l => !mwLinks.includes(l));

        const directG = g.append("g").attr("class", "links links--direct");
        directG.selectAll("path")
          .data(directLinks)
          .join("path")
          .attr("class", "link")
          .attr("d", d3.sankeyLinkHorizontal())
          .attr("stroke", d => linksColorScale(d.pattern))
          .attr("stroke-width", d => Math.max(1, d.width))
          .attr("fill", "none")
          .on("mouseover", handleLinkMouseOver)
          .on("mouseout", handleMouseOut);

        const mwG = g.append("g").attr("class", "links links--mw");
        mwG.selectAll("path")
          .data(mwLinks)
          .join("path")
          .attr("class", "link")
          .attr("d", d3.sankeyLinkHorizontal())
          .attr("stroke", d => linksColorScale(d.pattern))
          .attr("stroke-width", d => Math.max(1, d.width))
          .attr("fill", "none")
          .on("mouseover", handleLinkMouseOver)
          .on("mouseout", handleMouseOut);

        const node = g.append("g")
          .attr("class", "nodes")
          .selectAll(".node")
          .data(nodes)
          .join("g")
          .attr("class", d => d.id === pinnedSystemCode ? "node" : "node clickable-node")
          .attr("transform", d => \`translate(\${d.x0},\${d.y0})\`)
          .on("mouseover", handleNodeMouseOver)
          .on("mouseout", handleMouseOut)
          .on("click", handleNodeClick);

        node.append("rect")
          .attr("height", d => d.y1 - d.y0)
          .attr("width", d => d.x1 - d.x0)
          .attr("fill", d => nodesColorScale(d.criticality));

        node.append("text")
          .attr("x", d => d.x0 < width / 2 ? -6 : d.x1 - d.x0 + 6)
          .attr("y", d => (d.y1 - d.y0) / 2)
          .attr("dy", "0.35em")
          .attr("text-anchor", d => d.x0 < width / 2 ? "end" : "start")
          .text(d => d.name);

        const zoom = d3.zoom()
          .scaleExtent([0.5, 5])
          .on("zoom", (event) => {
            g.attr("transform", event.transform);
          });
        svg.call(zoom);
      }

      function processDataForSankey(data) {
        const types = [...new Set(data.nodes.map(n => n.type))];
        data.nodes.forEach(node => {
          node.layer = types.indexOf(node.type);
        });
        const links = data.links.map(l => ({...l, value: l.value || 1}));
        return { nodes: data.nodes, links };
      }

      function handleNodeMouseOver(event, d) {
        tooltip.transition().duration(200).style("opacity", .9);
        const clickText = d.id !== pinnedSystemCode ? "<br/><em>Click to view this system's diagram</em>" : "";
        tooltip.html(\`<strong>\${d.name} (\${d.id})</strong><br/>Type: \${d.type}<br/>Criticality: \${d.criticality}<br/>Internet Facing: \${d.internetFacing}<br/>Environment: \${d.environment}\${clickText}\`)
          .style("left", (event.pageX + 15) + "px")
          .style("top", (event.pageY - 28) + "px");
      }

      function handleLinkMouseOver(event, d) {
        tooltip.transition().duration(200).style("opacity", .9);
        tooltip.html(\`<strong>\${d.source.name} → \${d.target.name}</strong><br/>Pattern: \${d.pattern}<br/>Frequency: \${d.frequency}<br/>Desc: \${d.description || 'N/A'}\`)
          .style("left", (event.pageX + 15) + "px")    
          .style("top", (event.pageY - 28) + "px");
      }

      function handleMouseOut() {
        tooltip.transition().duration(500).style("opacity", 0);
      }

      function setupEventListeners() {
        resetButton.addEventListener("click", resetAll);
        applyFiltersButton.addEventListener("click", applyFilters);
      }

      function applyFilters() {
        clearHighlightsAndSelections();
        const searchTerm = systemSearchInput.value.toLowerCase();
        const selectedType = systemTypeFilter.value;
        const selectedConnection = connectionTypeFilter.value;
        const selectedCriticality = criticalityFilter.value;
        const selectedRole = roleFilter.value;

        const focusNodes = originalNodes.filter(n => {
          const nameMatch = searchTerm === '' || n.name.toLowerCase().includes(searchTerm) || n.id.toLowerCase().includes(searchTerm);
          const typeMatch = selectedType === 'All' || n.type === selectedType;
          const criticalityMatch = selectedCriticality === 'All' || n.criticality === selectedCriticality;
          return nameMatch && typeMatch && criticalityMatch && n.id !== pinnedSystemCode;
        });
        const focusNodeIds = new Set(focusNodes.map(n => n.id));

        const linkFilteredLinks = originalLinks.filter(l => {
          const connectionMatch = selectedConnection === 'All' || l.pattern === selectedConnection;
          const roleMatch = selectedRole === 'All' || l.role.toLowerCase() === selectedRole.toLowerCase();
          return connectionMatch && roleMatch;
        });

        const finalLinks = new Array();
        linkFilteredLinks.forEach(l => {
          if (((l.source === pinnedSystemCode && integrationMiddlewareNamelist.includes(l.target)) || 
               (l.target === pinnedSystemCode && integrationMiddlewareNamelist.includes(l.source))) && 
               (originalLinks.length === linkFilteredLinks.length) && 
               (originalNodes.length-1 === focusNodes.length)) {
            // Skip
          } else if (focusNodeIds.has(l.source) && integrationMiddlewareNamelist.includes(l.target)) {
            const middlewareLink = originalLinks.filter(obj => obj.source === l.target && obj.target === pinnedSystemCode)[0];
            finalLinks.push(middlewareLink);
            finalLinks.push(l);
          } else if (focusNodeIds.has(l.target) && integrationMiddlewareNamelist.includes(l.source)) {
            const middlewareLink = originalLinks.filter(obj => obj.target === l.source && obj.source === pinnedSystemCode)[0];
            finalLinks.push(middlewareLink);
            finalLinks.push(l);
          } else if (focusNodeIds.has(l.source) || (focusNodeIds.has(l.target))) {
            finalLinks.push(l);
          }
        });

        const finalNodeIds = new Set();
        finalLinks.forEach(l => {
          finalNodeIds.add(l.source);
          finalNodeIds.add(l.target);
        });
        finalNodeIds.add(pinnedSystemCode);

        const finalNodes = originalNodes.filter(n => finalNodeIds.has(n.id));
        const data = {'nodes': finalNodes, 'links': finalLinks, 'metadata': defaultData.metadata};
        createSankey(data);
      }

      function populateFilters() {
        const systemTypes = ["All", ...new Set(originalNodes.map((d) => d.type))];
        const connectionTypes = ["All", ...new Set(originalLinks.map((d) => d.pattern))];
        const criticalities = ["All", ...new Set(originalNodes.map((d) => d.criticality))];
        const roles = ["All", "Producer", "Consumer"];

        populateSelect(systemTypeFilter, systemTypes);
        populateSelect(connectionTypeFilter, connectionTypes);
        populateSelect(criticalityFilter, criticalities);
        populateSelect(roleFilter, roles);
      }

      function populateSelect(selectElement, options) {
        selectElement.innerHTML = "";
        options.forEach((opt) => {
          const option = document.createElement("option");
          option.value = opt;
          option.textContent = opt;
          selectElement.appendChild(option);
        });
      }

      function clearHighlightsAndSelections() {
        if (node) node.classed('dimmed', false).classed('path-highlight-node', false);
        if (link) link.classed('dimmed', false).classed('path-highlight-link', false);
      }

      function resetAll() {
        systemSearchInput.value = "";
        systemTypeFilter.value = "All";
        connectionTypeFilter.value = "All";
        criticalityFilter.value = "All";
        clearHighlightsAndSelections();
        createSankey(defaultData);
      }

      initialize(defaultData);
    </script>
</body>
</html>`;
  };

  // Handle messages from iframe
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === 'SYSTEM_NODE_CLICK') {
        const { systemCode, systemName } = event.data;
        
        if (onSystemClick) {
          onSystemClick(systemCode);
        } else {
          navigate(`/view-system-flow-diagram/${systemCode}`);
        }
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [navigate, onSystemClick]);

  // Fetch data when systemCode changes
  useEffect(() => {
    if (currentSystemCode) {
      fetchDiagramData(currentSystemCode);
    }
  }, [currentSystemCode]);

  const handleRefresh = () => {
    if (currentSystemCode) {
      fetchDiagramData(currentSystemCode);
    }
  };

  const handleFullscreen = () => {
    if (containerRef.current) {
      if (containerRef.current.requestFullscreen) {
        containerRef.current.requestFullscreen();
      }
    }
  };

  if (!currentSystemCode) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <p className="text-gray-500">No system ID provided</p>
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
        
        <CardContent className="p-0 h-[calc(100%-4rem)]">
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
            <iframe
              ref={iframeRef}
              srcDoc={generateDiagramHTML(diagramData)}
              className="w-full h-full border-0"
              title={`System Flow Diagram for ${diagramData.metadata.code}`}
              sandbox="allow-scripts allow-same-origin"
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SpecificSystemFlowDiagram;