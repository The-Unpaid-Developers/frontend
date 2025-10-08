import React, { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';
import type { SankeyData } from '../../../../types/diagrams';
import Tooltip from './Tooltip';
import { useNavigate } from 'react-router-dom';

interface OverallSystemsDiagramProps {
  data: SankeyData;
  onNodeClick?: (nodeId: string) => void;
}

const OverallSystemsDiagram: React.FC<OverallSystemsDiagramProps> = ({
  data,
  onNodeClick
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const nodesColorScale = d3.scaleOrdinal()
    .domain(["Major", "Standard-1", "Standard-2", "Standard-3"])
    .range(["#ef4444", "#f59e0b", "#22c55e", "#0ea5e9"])
    .unknown("#6b7280");

  const [tooltip, setTooltip] = useState({
    visible: false,
    x: 0,
    y: 0,
    content: '',
  });

  // Helper function to hide tooltip
  const hideTooltip = () => {
    setTooltip({ visible: false, x: 0, y: 0, content: '' });
  };

  // Define event handlers with proper relative positioning
  const handleLinkMouseOver = (event: any, d: any) => {
    const rect = wrapperRef.current?.getBoundingClientRect();
    if (rect) {
      setTooltip({
        visible: true,
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
        content: `<strong>${d.source.name} <-> ${d.target.name}</strong><br/>Pattern: ${d.pattern}<br/>Frequency: ${d.frequency}`,
      });
    }

    d3.select(event.currentTarget)
      .attr("stroke", "#ef4444")
      .attr("stroke-width", 3)
      .attr("stroke-opacity", 1);
  };

  const handleLinkMouseMove = (event: any) => {
    const rect = wrapperRef.current?.getBoundingClientRect();
    if (rect) {
      setTooltip(prev => ({
        ...prev,
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
      }));
    }
  };

  const handleLinkMouseOut = (event: any) => {
    hideTooltip();

    d3.select(event.currentTarget)
      .attr("stroke", "#999")
      .attr("stroke-width", 1)
      .attr("stroke-opacity", 0.6);
  };

  const handleNodeMouseOver = (event: any, d: any) => {
    const rect = wrapperRef.current?.getBoundingClientRect();
    if (rect) {
      setTooltip({
        visible: true,
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
        content: `<strong>${d.name}</strong><br/>Type: ${d.type}<br/>Criticality: ${d.criticality}`,
      });
    }

    // Scale effect - use r attribute instead of transform scale
    d3.select(event.currentTarget).select("circle")
      .transition().duration(200)
      .attr("r", 15);
  };

  const handleNodeMouseMove = (event: any) => {
    const rect = wrapperRef.current?.getBoundingClientRect();
    if (rect) {
      setTooltip(prev => ({
        ...prev,
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
      }));
    }
  };

  const handleNodeMouseOut = (event: any) => {
    hideTooltip();

    // Reset scale
    d3.select(event.currentTarget).select("circle")
      .transition().duration(200)
      .attr("r", 12);
  };

  // Handle node click
  const handleNodeClick = (event: any, d: any) => {
    console.log("Node clicked:", d);
    event.stopPropagation(); // Prevent event bubbling
    
    // Hide tooltip on click
    hideTooltip();
    
    // Use onNodeClick prop if provided, otherwise navigate
    if (onNodeClick) {
      onNodeClick(d.id);
    } else {
      navigate(`/view-system-flow-diagram/${d.id}`);
    }
  };

  useEffect(() => {
    if (!svgRef.current || !wrapperRef.current || !data) return;

    // Clear previous content
    d3.select(svgRef.current).selectAll("*").remove();

    const wrapper = d3.select(wrapperRef.current);
    const { width, height } = wrapper.node()!.getBoundingClientRect();

    const svg = d3.select(svgRef.current)
      .attr("viewBox", [0, 0, width, height])
      .call(
        d3.zoom<SVGSVGElement, unknown>()
          .on("zoom", (event) => {
            g.attr("transform", event.transform);
          })
      );

    // Add mousemove handler to SVG to detect when mouse is not over any interactive element
    svg.on("mousemove", (event) => {
      // Check if mouse is over a node or link
      const target = event.target;
      const isOverInteractiveElement = target.closest('.node') || target.closest('.link');
      
      if (!isOverInteractiveElement) {
        hideTooltip();
      }
    });

    // Add mouse leave handler to SVG
    svg.on("mouseleave", hideTooltip);

    const g = svg.append("g");

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
      .on("mousemove", handleLinkMouseMove)
      .on("mouseout", handleLinkMouseOut);

    // Create nodes
    const node = g.append("g")
      .selectAll("g")
      .data(data.nodes)
      .join("g")
      .attr("class", "node")
      .style("cursor", "pointer")
      .call(drag(simulation) as any)
      .on("mouseover", handleNodeMouseOver)
      .on("mousemove", handleNodeMouseMove)
      .on("mouseout", handleNodeMouseOut);
      

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
      .style("pointer-events", "none") // This is important - prevents text from blocking clicks
      .style("fill", "#374151")
      .style("font-weight", "500");
      // Removed the click handler from text - it's handled by the parent group

    // Create link labels
    const linkLabel = g.append("g")
      .selectAll("text")
      .data(data.links)
      .join("text")
      .attr("class", "link-label")
      .text((d: any) => d.pattern)
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

    function drag(simulation: d3.Simulation<any, any>) {
      let startX: number, startY: number;
      const dragThreshold = 5; // pixels

      function dragstarted(event: any, d: any) {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
        startX = event.x;
        startY = event.y;
        hideTooltip();
      }

      function dragged(event: any, d: any) {
        d.fx = event.x;
        d.fy = event.y;
      }

      function dragended(event: any, d: any) {
        if (!event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;

        // Check if this was a click (minimal movement)
        const dx = event.x - startX;
        const dy = event.y - startY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < dragThreshold) {
          // This was a click, not a drag
          console.log("Node clicked:", d);
          event.sourceEvent.stopPropagation();

          // Use onNodeClick prop if provided, otherwise navigate
          if (onNodeClick) {
            onNodeClick(d.id);
          } else {
            navigate(`/view-system-flow-diagram/${d.id}`);
          }
        }
      }

      return d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended);
    }

    // Stop simulation after initial layout to prevent continuous movement
    setTimeout(() => {
      simulation.stop();
    }, 3000);

    // Cleanup function
    return () => {
      simulation.stop();
    };

  }, [data, onNodeClick, nodesColorScale, navigate]);

  return (
    <div 
      ref={wrapperRef} 
      className="w-full h-full relative"
      onMouseLeave={hideTooltip}
    >
      <svg ref={svgRef} className="w-full h-full" />
      <Tooltip 
        visible={tooltip.visible}
        x={tooltip.x}
        y={tooltip.y}
        content={tooltip.content} 
      />
    </div>
  );
};

export default OverallSystemsDiagram;