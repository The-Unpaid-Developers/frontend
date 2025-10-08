import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';
import type { SankeyData } from '../../../../types/diagrams';

interface OverallSystemsNewDiagramProps {
  data: SankeyData;
  onNodeClick?: (nodeId: string) => void;
}

const OverallSystemsNewDiagram: React.FC<OverallSystemsNewDiagramProps> = ({
  data,
  onNodeClick
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  const nodesColorScale = d3.scaleOrdinal()
    .domain(["Major", "Standard-1", "Standard-2", "Standard-3"])
    .range(["#ef4444", "#f59e0b", "#22c55e", "#0ea5e9"])
    .unknown("#6b7280");

  useEffect(() => {
    if (!svgRef.current || !wrapperRef.current || !tooltipRef.current || !data) return;

    // Clear previous content
    d3.select(svgRef.current).selectAll("*").remove();

    const wrapper = d3.select(wrapperRef.current);
    const { width, height } = wrapper.node()!.getBoundingClientRect();
    const tooltip = d3.select(tooltipRef.current);

    const svg = d3.select(svgRef.current)
      .attr("viewBox", [0, 0, width, height])
      .call(
        d3.zoom<SVGSVGElement, unknown>()
          .on("zoom", (event) => {
            g.attr("transform", event.transform);
          })
      );

    const g = svg.append("g");

    // Add CSS styles directly to the SVG elements
    const styleElement = document.createElement('style');
    styleElement.textContent = `
      .node circle {
        stroke: #fff;
        stroke-width: 2px;
        transition: transform 0.2s ease-in-out, stroke 0.2s;
        cursor: pointer;
      }
      .node:hover circle {
        transform: scale(1.2);
      }
      .node text {
        font-size: 10px;
        pointer-events: none;
        fill: #374151;
        font-weight: 500;
      }
      .link {
        stroke-opacity: 0.6;
        transition: stroke-opacity 0.3s, stroke 0.3s, stroke-width 0.3s;
        cursor: pointer;
      }
      .link-label {
        font-size: 9px;
        fill: #4b5563;
        pointer-events: none;
        text-anchor: middle;
      }
      .highlighted {
        stroke: #ef4444 !important;
        stroke-width: 3px !important;
        stroke-opacity: 1 !important;
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
    `;
    document.head.appendChild(styleElement);

    // Add arrow markers
    svg.append("defs")
      .selectAll("marker")
      .data(["end"])
      .join("marker")
      .attr("id", String)
      .attr("viewBox", "0 -5 10 10")
      .attr("refX", 30)
      .attr("refY", 0)
      .attr("markerWidth", 6)
      .attr("markerHeight", 6)
      .attr("orient", "auto")
      .append("path")
      .attr("d", "M0,-5L10,0L0,5")
      .attr("fill", "#999");

    // Event handlers - matching the working HTML template
    function handleNodeMouseOver(event: any, d: any) {
      tooltip.transition().duration(200).style("opacity", 0.9);
      tooltip
        .html(`<strong>${d.name} (${d.id})</strong><br/>Type: ${d.type}<br/>Criticality: ${d.criticality}`)
        .style("left", (event.pageX + 15) + "px")
        .style("top", (event.pageY - 28) + "px");

      // Add hover effect via D3
      d3.select(event.currentTarget).select("circle")
        .transition().duration(200)
        .attr("r", 15);
    }

    function handleNodeMouseOut(event: any) {
      tooltip.transition().duration(500).style("opacity", 0);

      // Remove hover effect via D3
      d3.select(event.currentTarget).select("circle")
        .transition().duration(200)
        .attr("r", 12);
    }

    function handleLinkMouseOver(event: any, d: any) {
      tooltip.transition().duration(200).style("opacity", 0.9);
      tooltip
        .html(`<strong>Connection</strong><br/>From: ${d.source.id} To: ${d.target.id}<br/>Pattern: ${d.pattern}<br/>Frequency: ${d.frequency}<br/>Desc: ${d.description || "N/A"}`)
        .style("left", (event.pageX + 15) + "px")
        .style("top", (event.pageY - 28) + "px");
      
      d3.select(event.currentTarget)
        .transition().duration(200)
        .attr("stroke", "#ef4444")
        .attr("stroke-width", 3)
        .attr("stroke-opacity", 1);
    }

    function handleLinkMouseOut(event: any) {
      tooltip.transition().duration(500).style("opacity", 0);
      
      d3.select(event.currentTarget)
        .transition().duration(200)
        .attr("stroke", "#999")
        .attr("stroke-width", 1)
        .attr("stroke-opacity", 0.6);
    }

    // Handle node click function
    function handleNodeClick(event: any, d: any) {
      console.log("Node clicked:", d);
      event.stopPropagation();
      if (onNodeClick) {
        onNodeClick(d.id);
      }
    }

    // Drag functions with click detection - matching the working template
    function drag(simulation: d3.Simulation<any, any>) {
      let startTime = 0;
      let startPos = { x: 0, y: 0 };
      let hasDragged = false;

      function dragstarted(event: any, d: any) {
        startTime = Date.now();
        startPos = { x: event.x, y: event.y };
        hasDragged = false;
        
        if (!event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
      }

      function dragged(event: any, d: any) {
        const deltaX = Math.abs(event.x - startPos.x);
        const deltaY = Math.abs(event.y - startPos.y);
        
        // If moved more than 5 pixels, consider it a drag
        if (deltaX > 5 || deltaY > 5) {
          hasDragged = true;
        }
        
        d.fx = event.x;
        d.fy = event.y;
      }

      function dragended(event: any, d: any) {
        if (!event.active) simulation.alphaTarget(0);
        
        const endTime = Date.now();
        const duration = endTime - startTime;
        
        // If it was a quick action (< 200ms) and didn't drag much, treat as click
        if (duration < 200 && !hasDragged) {
          handleNodeClick(event, d);
        }
        
        // Optionally uncomment these lines if you want nodes to float freely after dragging
        // d.fx = null;
        // d.fy = null;
      }

      return d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended);
    }

    // Create simulation
    const simulation = d3.forceSimulation(data.nodes as any)
      .force("link", d3.forceLink(data.links as any)
        .id((d: any) => d.id)
        .distance(150)
      )
      .force("charge", d3.forceManyBody().strength(-200))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .on("tick", ticked);

    // Create links
    const link = g.append("g")
      .selectAll("line")
      .data(data.links)
      .join("line")
      .attr("class", "link")
      .attr("stroke", "#999")
      .attr("stroke-opacity", 0.6)
      .attr("stroke-width", 1)
      .style("cursor", "pointer")
      .on("mouseover", handleLinkMouseOver)
      .on("mouseout", handleLinkMouseOut);

    // Create nodes - REMOVED the separate click handler
    const node = g.append("g")
      .selectAll("g")
      .data(data.nodes)
      .join("g")
      .attr("class", "node")
      .style("cursor", "pointer")
      .call(drag(simulation) as any)
      .on("mouseover", handleNodeMouseOver)
      .on("mouseout", handleNodeMouseOut);
      // Removed the .on("click", ...) here because drag handles it now

    node.append("circle")
      .attr("r", 12)
      .attr("fill", (d: any) => nodesColorScale(d.criticality) as string)
      .attr("stroke", "#fff")
      .attr("stroke-width", 2);

    node.append("text")
      .text((d: any) => d.name)
      .attr("dx", 15)
      .attr("dy", "0.35em")
      .style("font-size", "10px")
      .style("pointer-events", "none")
      .style("fill", "#374151")
      .style("font-weight", "500");

    // Create link labels
    const linkLabel = g.append("g")
      .selectAll("text")
      .data(data.links)
      .join("text")
      .attr("class", "link-label")
      .text((d: any) => d.pattern || '')
      .style("font-size", "9px")
      .style("fill", "#4b5563")
      .style("pointer-events", "none")
      .style("text-anchor", "middle");

    function ticked() {
      link
        .attr("x1", (d: any) => d.source.x)
        .attr("y1", (d: any) => d.source.y)
        .attr("x2", (d: any) => d.target.x)
        .attr("y2", (d: any) => d.target.y);

      node.attr("transform", (d: any) => `translate(${d.x},${d.y})`);

      linkLabel
        .attr("x", (d: any) => (d.source.x + d.target.x) / 2)
        .attr("y", (d: any) => (d.source.y + d.target.y) / 2);
    }

    // Cleanup function
    return () => {
      simulation.stop();
      // Remove the style element when component unmounts
      if (styleElement.parentNode) {
        styleElement.parentNode.removeChild(styleElement);
      }
    };

  }, [data, onNodeClick, nodesColorScale]);

  return (
    <div ref={wrapperRef} className="w-full h-full relative">
      <svg ref={svgRef} className="w-full h-full" />
      <div
        ref={tooltipRef}
        className="fixed text-left p-2 text-xs bg-gray-800 text-white border-0 rounded-lg pointer-events-none opacity-0 transition-opacity duration-200 z-50"
        style={{ maxWidth: '300px' }}
      />
    </div>
  );
};

export default OverallSystemsNewDiagram;