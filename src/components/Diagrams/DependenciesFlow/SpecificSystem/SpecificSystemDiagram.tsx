import React, { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';
import { sankey, sankeyLinkHorizontal, sankeyJustify } from 'd3-sankey';
import type { SankeyData, ProcessedNode, ProcessedLink } from '../../../../types/diagrams';
import Tooltip from './Tooltip';
import { Navigate, useNavigate } from 'react-router-dom';

interface SankeyDiagramProps {
  data: SankeyData;
  width?: number;
  height?: number;
  pinnedSystemId: string;
  integrationMiddleware: string[];
}

const SankeyDiagram: React.FC<SankeyDiagramProps> = ({
  data,
  width = 1000,
  height = 1000,
  pinnedSystemId,
  integrationMiddleware,
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

  const processDataForSankey = (sankeyData: SankeyData) => {
    const types = [...new Set(sankeyData.nodes.map(n => n.type))];

    sankeyData.nodes.forEach(node => {
      (node as any).layer = types.indexOf(node.type);
    });

    const links = sankeyData.links.map(l => ({ ...l, value: l.value || 1 }));
    return { nodes: sankeyData.nodes, links };
  };

  // const processDataForSankey = (sankeyData: SankeyData) => {
  // const types = [...new Set(sankeyData.nodes.map(n => n.type))];

  // sankeyData.nodes.forEach(node => {
  //   (node as any).layer = types.indexOf(node.type);
  // });

  // // Consolidate duplicate links
  // const linkMap = new Map<string, any>();
  
  // sankeyData.links.forEach(link => {
  //   const key = `${link.source}-${link.target}-${link.pattern}`;
    
  //   if (linkMap.has(key)) {
  //     // Combine duplicate links by increasing value
  //     const existing = linkMap.get(key);
  //     existing.value += (link.value || 1);
  //     existing.frequency = existing.frequency; // Keep original frequency
  //   } else {
  //     linkMap.set(key, { 
  //       ...link, 
  //       value: link.value || 1 
  //     });
  //   }
  // });

//   const consolidatedLinks = Array.from(linkMap.values());
  
//   return { 
//     nodes: sankeyData.nodes, 
//     links: consolidatedLinks 
//   };
// };

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
      content: `<strong>${d.source.name} → ${d.target.name}</strong><br/>Pattern: ${d.pattern}<br/>Frequency: ${d.frequency}<br/>Role: ${d.role}`,
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
      .nodeSort((a, b) => {
        const allLinks = (node: ProcessedNode) => [
          ...(node.sourceLinks || []),
          ...(node.targetLinks || []),
        ];

        const touchesMW = (node: ProcessedNode) =>
          integrationMiddleware.includes(node.id) ||
          allLinks(node).some(
            l =>
              integrationMiddleware.includes(l.source.id) ||
              integrationMiddleware.includes(l.target.id)
          );

        const directToMain = (node: ProcessedNode) =>
          allLinks(node).some(
            l =>
              (l.source.id === pinnedSystemId && l.target.id !== pinnedSystemId) ||
              (l.target.id === pinnedSystemId && l.source.id !== pinnedSystemId)
          );

        // Prioritize nodes connected to middleware to be on top
        const aMW = touchesMW(a);
        const bMW = touchesMW(b);
        if (aMW !== bMW) return aMW ? -1 : 1;
        
        // Group nodes by their base system (prefix before '-') and sort within groups
        const getBase = (node: ProcessedNode) => {
          // if node is middleware itself, return its base
          if (integrationMiddleware.includes(node.id)) {
            return node.id.split('-')[0];
          }
          // else find a link that connects to middleware and return that base
          const link = allLinks(node).find(
            l =>
              integrationMiddleware.includes(l.source.id) ||
              integrationMiddleware.includes(l.target.id)
          );
          const mw = link
            ? integrationMiddleware.find(id => id === link.source.id || id === link.target.id)
            : '';
          return mw ? mw.split('-')[0] : '';
        };

        const bases = Array.from(
          new Set(integrationMiddleware.map(id => id.split('-')[0]))
        ).sort();
        // sort by base system first, then direct connections, then type
        const aBase = getBase(a);
        const bBase = getBase(b);
        if (aBase !== bBase) {
          return bases.indexOf(aBase) - bases.indexOf(bBase);
        }

        const aDir = directToMain(a);
        const bDir = directToMain(b);
        if (aDir !== bDir) return aDir ? 1 : -1;

        // return a.type.localeCompare(b.type);
        return 0;
      })
      .extent([[0, 0], [graphWidth, graphHeight]])
      .iterations(1000);

    const graph = processDataForSankey(data);
    let { nodes, links } = sankeyGenerator(graph as any);

    // const isMWLink = (l: ProcessedLink) =>
    //   integrationMiddleware.includes(l.source.id) ||
    //   integrationMiddleware.includes(l.target.id);

    // const mwLinks = links.filter(isMWLink);
    // const directLinks = links.filter(l => !isMWLink(l));

    // // Draw direct-to-A links first
    // const directG = g.append('g').attr('class', 'links links--direct');
    // directG
    //   .selectAll('path')
    //   .data(directLinks)
    //   .join('path')
    //   .attr('class', 'link')
    //   .attr('d', sankeyLinkHorizontal())
    //   .attr('stroke', (d: any) => linksColorScale(d.pattern) as string)
    //   .attr('stroke-width', (d: any) => Math.max(1, d.width))
    //   .attr('fill', 'none')
    //   .attr('fill-opacity', 0.5)
    //   .attr('stroke-opacity', 0.3)
    //   .style('transition', 'fill-opacity 0.2s ease-in-out')
    //   .on('mouseover', (event, d) => handleLinkMouseOver(event, d as ProcessedLink))
    //   .on('mouseout', handleMouseOut)
    //   .on('mouseover.hover', function() {
    //     d3.select(this).attr('fill-opacity', 0.7);
    //   })
    //   .on('mouseout.hover', function() {
    //     d3.select(this).attr('fill-opacity', 0.5);
    //   });

    // // Draw middleware-attached links on top
    // const mwG = g.append('g').attr('class', 'links links--mw');
    // mwG
    //   .selectAll('path')
    //   .data(mwLinks)
    //   .join('path')
    //   .attr('class', 'link')
    //   .attr('d', sankeyLinkHorizontal())
    //   .attr('stroke', (d: any) => linksColorScale(d.pattern) as string)
    //   .attr('stroke-width', (d: any) => Math.max(1, d.width))
    //   .attr('fill', 'none')
    //   .attr('fill-opacity', 0.5)
    //   .attr('stroke-opacity', 0.3)
    //   .style('transition', 'fill-opacity 0.2s ease-in-out')
    //   .on('mouseover', (event, d) => handleLinkMouseOver(event, d as ProcessedLink))
    //   .on('mouseout', handleMouseOut)
    //   .on('mouseover.hover', function() {
    //     d3.select(this).attr('fill-opacity', 0.7);
    //   })
    //   .on('mouseout.hover', function() {
    //     d3.select(this).attr('fill-opacity', 0.5);
    //   });
    // Sort links: direct links first (will be drawn first, appearing below)
    // indirect (middleware) links second (will be drawn on top)
    const sortedLinks = [...links].sort((a, b) => {
      const aIsMW = integrationMiddleware.includes(a.source.id) || integrationMiddleware.includes(a.target.id);
      const bIsMW = integrationMiddleware.includes(b.source.id) || integrationMiddleware.includes(b.target.id);
      
      // Direct links (false) should come first (return -1), MW links (true) should come second (return 1)
      if (!aIsMW && bIsMW) return -1;  // a is direct, b is MW -> a first
      if (aIsMW && !bIsMW) return 1;   // a is MW, b is direct -> b first
      
      // If both are same type, maintain relative order
      return 0;
    });

    // Use sortedLinks instead of the original split approach
    const linkGroup = g.append('g').attr('class', 'links');
    linkGroup
      .selectAll('path')
      .data(sortedLinks)
      .join('path')
      .attr('class', (d) => {
        const isMW = integrationMiddleware.includes(d.source.id) || integrationMiddleware.includes(d.target.id);
        return `link ${isMW ? 'link--mw' : 'link--direct'}`;
      })
      .attr('d', sankeyLinkHorizontal())
      .attr('stroke', (d: any) => linksColorScale(d.pattern) as string)
      .attr('stroke-width', (d: any) => Math.max(1, d.width))
      .attr('fill', 'none')
      .attr('fill-opacity', (d) => {
        const isMW = integrationMiddleware.includes(d.source.id) || integrationMiddleware.includes(d.target.id);
        return isMW ? 0.4 : 0.6; // MW links slightly less opaque
      })
      .attr('stroke-opacity', (d) => {
        const isMW = integrationMiddleware.includes(d.source.id) || integrationMiddleware.includes(d.target.id);
        return isMW ? 0.3 : 0.5; // MW links slightly less opaque
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
        const isMW = integrationMiddleware.includes(d.source.id) || integrationMiddleware.includes(d.target.id);
        // Reset the main link
        d3.select(this)
          .attr('fill-opacity', isMW ? 0.4 : 0.6)
          .attr('stroke-opacity', isMW ? 0.3 : 0.5);
          
        // Reset the corresponding border
        d3.selectAll('.link-border')
          .filter((borderD: any) => borderD === d)
          .attr('stroke-opacity', 0.8)
          .attr('stroke', '#2d3748');
          
        handleMouseOut();
      });

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
        navigate(`/view-system-flow-diagram/${d.id.slice(0, -2)}`);
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
  }, [data, width, height, pinnedSystemId, integrationMiddleware]);

  return (
    <div className="relative">
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

export default SankeyDiagram;