import React, { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';
import { sankey, sankeyLinkHorizontal, sankeyJustify } from 'd3-sankey';
import type { PathSankeyData, ProcessedNode, ProcessedLink } from '../../../../types/diagrams';
import PathTooltip from './PathTooltip';
import { useNavigate } from 'react-router-dom';

interface SankeyDiagramProps {
  data: PathSankeyData;
  width?: number;
  height?: number;
  producerSystemId?: string;
  consumerSystemId?: string;
}

const SankeyDiagram: React.FC<SankeyDiagramProps> = ({
  data,
  width = 1000,
  height = 1000,
  producerSystemId,
  consumerSystemId,
}) => {
  const navigate = useNavigate();
  const svgRef = useRef<SVGSVGElement>(null);
  const [tooltip, setTooltip] = useState({
    visible: false,
    x: 0,
    y: 0,
    content: '',
  });

  const linksColorScale = d3.scaleOrdinal()
    .domain(['Web Service', 'API', 'Batch', 'File'])
    .range(['#1f77b4', '#9467bd', '#2ca02c', '#ff7f0e'])
    .unknown('#6b7280');

  const nodesColorScale = d3.scaleOrdinal()
    .domain(['Major', 'Standard-1', 'Standard-2', 'Standard-3'])
    .range(['#ef4444', '#f59e0b', '#22c55e', '#0ea5e9'])
    .unknown('#6b7280');

  const processDataForSankey = (sankeyData: PathSankeyData) => {
    const types = [...new Set(sankeyData.nodes.map(n => n.type))];

    sankeyData.nodes.forEach(node => {
      (node as any).layer = types.indexOf(node.type);
    });

    const links = sankeyData.links.map(l => ({ ...l, value: l.value || 1 }));
    return { nodes: sankeyData.nodes, links };
  };

  const handleNodeMouseOver = (event: MouseEvent, d: ProcessedNode) => {
    setTooltip({
      visible: true,
      x: event.pageX,
      y: event.pageY,
      content: `<strong>${d.name} (${d.id})</strong><br/>Type: ${d.type}<br/>Criticality: ${d.criticality}`,
    });
  };

  const handleLinkMouseOver = (event: MouseEvent, d: ProcessedLink) => {
    setTooltip({
      visible: true,
      x: event.pageX,
      y: event.pageY,
      content: `<strong>${d.source.name} → ${d.target.name}</strong><br/>Pattern: ${d.pattern}<br/>Frequency: ${d.frequency}<br/>Middleware: ${d.middleware}`,
    });
  };

  const handleMouseOut = () => {
    setTooltip({ visible: false, x: 0, y: 0, content: '' });
  };

  useEffect(() => {
    if (!svgRef.current || !data.nodes.length) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const margin = { top: 30, right: 20, bottom: 30, left: 20 };
    const graphWidth = width - margin.left - margin.right;
    const graphHeight = height - margin.top - margin.bottom;

    const g = svg
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const sankeyGenerator = sankey<ProcessedNode, ProcessedLink>()
      .nodeId((d: any) => d.id)
      .nodeWidth(20)
      .nodePadding(50)
      .nodeAlign(sankeyJustify)
      .extent([[0, 0], [graphWidth, graphHeight]])
      .iterations(100);

    const graph = processDataForSankey(data);
    let { nodes, links } = sankeyGenerator(graph as any);

    // Use sortedLinks instead of the original split approach
    const linkGroup = g.append('g').attr('class', 'links');
    linkGroup
      .selectAll('path')
      .data(links)
      .join('path')
      .attr('d', sankeyLinkHorizontal())
      .attr('stroke', (d: any) => linksColorScale(d.pattern) as string)
      .attr('stroke-width', (d: any) => Math.max(1, d.width))
      .attr('fill', 'none')
      .attr('fill-opacity', (d) => {
        return 0.4;
      })
      .attr('border', '1px solid black')
      .attr('stroke-opacity', (d) => {
        return 0.3;
      })
      .style('transition', 'fill-opacity 0.2s ease-in-out')
      .on('mouseover', function(event, d) {
        // Enhance the hovered link
        d3.select(this)
          .attr('fill-opacity', 0.8)
          .attr('stroke-opacity', 0.9);
        
        // Also enhance the corresponding border
        d3.selectAll('.link-border')
          .filter((borderD: any) => borderD === d)
          .attr('stroke-opacity', 1)
          .attr('stroke', '#1a202c'); // Darker on hover
          
        handleLinkMouseOver(event, d as ProcessedLink);
      })
      .on('mouseout', function(event, d) {
        // Reset the main link
        d3.select(this)
          .attr('fill-opacity', 0.4)
          .attr('stroke-opacity', 0.3);
          
        // Reset the corresponding border
        d3.selectAll('.link-border')
          .filter((borderD: any) => borderD === d)
          .attr('stroke-opacity', 0.8)
          .attr('stroke', '#2d3748');
          
        handleMouseOut();
      })

    // Draw nodes
    const node = g
      .append('g')
      .attr('class', 'nodes')
      .selectAll('.node')
      .data(nodes)
      .join('g')
      .attr('class', 'node')
      .attr('transform', (d: any) => `translate(${d.x0},${d.y0})`)
      .on('mouseover', (event, d) => handleNodeMouseOver(event, d as ProcessedNode))
      .on('mouseout', handleMouseOut)
      .on('click', (_event, d: any) => {
        navigate(`/view-system-flow-diagram/${d.id}`);
      });

    node
      .append('rect')
      .attr('height', (d: any) => d.y1 - d.y0)
      .attr('width', (d: any) => d.x1 - d.x0)
      .attr('fill', (d: any) => nodesColorScale(d.criticality) as string)
      .attr('stroke', '#374151')
      .attr('stroke-width', 1);

    node
      .append('text')
      .attr('x', (d: any) => (d.x0 < width / 2 ? -6 : d.x1 - d.x0 + 6))
      .attr('y', (d: any) => (d.y1 - d.y0) / 2)
      .attr('dy', '0.35em')
      .attr('text-anchor', (d: any) => (d.x0 < width / 2 ? 'end' : 'start'))
      .attr('font-size', '12px')
      .attr('font-weight', '500')
      .style('pointer-events', 'none')
      .style('text-shadow', '-1px -1px 0 #fff, 1px -1px 0 #fff, -1px 1px 0 #fff, 1px 1px 0 #fff')
      .text((d: any) => d.name);

    // Add zoom functionality
    const zoom = d3.zoom()
      .scaleExtent([0.5, 5])
      .on('zoom', (event) => {
        g.attr('transform', event.transform);
      });

    svg.call(zoom as any);
  }, [data, width, height]);

  return (
    <div className="relative">
      <svg ref={svgRef} className="w-full h-full" />
      <PathTooltip
        visible={tooltip.visible}
        x={tooltip.x}
        y={tooltip.y}
        content={tooltip.content}
      />
    </div>
  );
};

export default SankeyDiagram;