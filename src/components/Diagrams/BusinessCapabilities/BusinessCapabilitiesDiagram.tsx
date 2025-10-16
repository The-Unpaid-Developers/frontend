import React, { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';
import type { BusinessCapability, HierarchyNode } from '../../../types/diagrams';

interface BusinessCapabilitiesDiagramProps {
  data: BusinessCapability[];
  searchTerm?: string;
  onSearchMatch?: (matchedNodes: string[]) => void;
}

const BusinessCapabilitiesDiagram: React.FC<BusinessCapabilitiesDiagramProps> = ({
  data,
  searchTerm = '',
  onSearchMatch
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  // Update dimensions on mount and resize
  useEffect(() => {
    if (!wrapperRef.current) return;

    const updateDimensions = () => {
      const { width, height } = wrapperRef.current!.getBoundingClientRect();
      setDimensions({ width, height });
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  useEffect(() => {
    if (!svgRef.current || !wrapperRef.current || !tooltipRef.current || !data.length || dimensions.width === 0) return;

    // Clear previous content
    d3.select(svgRef.current).selectAll("*").remove();

    const { width, height } = dimensions;
    const margin = { top: 20, right: 120, bottom: 20, left: 120 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const tooltip = d3.select(tooltipRef.current);

    // Create SVG
    const svg = d3.select(svgRef.current)
      .attr("viewBox", [0, 0, width, height])
      .call(
        d3.zoom<SVGSVGElement, unknown>()
          .scaleExtent([0.5, 3])
          .on("zoom", (event) => {
            g.attr("transform", event.transform);
          })
      );

    const g = svg.append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Build hierarchy from flat data
    const buildHierarchy = (capabilities: BusinessCapability[]) => {
      const idMap = new Map<string, any>();
      const root: any = { id: 'root', name: 'Business Capabilities', children: [] };

      // Create a map of all nodes
      capabilities.forEach(cap => {
        idMap.set(cap.id, { ...cap, children: [] });
      });

      // Build tree structure
      capabilities.forEach(cap => {
        const node = idMap.get(cap.id);
        if (cap.parentId === null) {
          root.children.push(node);
        } else {
          const parent = idMap.get(cap.parentId);
          if (parent) {
            parent.children.push(node);
          }
        }
      });

      return root;
    };

    const hierarchyData = buildHierarchy(data);
    const root = d3.hierarchy(hierarchyData);

    // Tree layout
    const treeLayout = d3.tree<any>()
      .size([innerHeight, innerWidth])
      .separation((a, b) => (a.parent === b.parent ? 1 : 1.2));

    treeLayout(root);

    // Color scale for levels
    const levelColors: { [key: string]: string } = {
      'root': '#1f2937',
      'L1': '#3b82f6',
      'L2': '#10b981',
      'L3': '#f59e0b',
      'System': '#ef4444'
    };

    // Search highlighting - MUST happen before collapsing
    const matchedNodes = new Set<string>();
    const pathNodes = new Set<string>(); // Nodes in the path to matched nodes

    if (searchTerm) {
      root.descendants().forEach((d: any) => {
        if (d.data.name && d.data.name.toLowerCase().includes(searchTerm.toLowerCase())) {
          matchedNodes.add(d.data.id);

          // Add all ancestors to path
          let current = d.parent;
          while (current) {
            pathNodes.add(current.data.id);
            current = current.parent;
          }
        }
      });

      if (onSearchMatch) {
        onSearchMatch(Array.from(matchedNodes));
      }
    }

    // Build a map of nodes that are in the path to matched results
    const nodesInPath = new Set<any>();
    if (searchTerm && matchedNodes.size > 0) {
      // Get all nodes (before collapsing)
      const allNodes = root.descendants();

      allNodes.forEach((d: any) => {
        if (matchedNodes.has(d.data.id)) {
          // Add the matched node itself
          nodesInPath.add(d);

          // Mark all ancestors as being in path
          let current = d.parent;
          while (current) {
            nodesInPath.add(current);
            current = current.parent;
          }
        }
      });
    }

    // Collapse ALL nodes first
    function collapseAll(node: any) {
      if (node.children) {
        node._children = node.children;
        node.children = null;
      }
      if (node._children) {
        node._children.forEach((child: any) => collapseAll(child));
      }
    }

    // Start by collapsing everything except root
    root.descendants().forEach((d: any) => {
      if (d.depth > 0) {
        collapseAll(d);
      }
    });

    // Expand ONLY paths to matched nodes
    if (searchTerm && matchedNodes.size > 0) {
      function expandPathNodes(node: any) {
        // If this node is in the path to a matched node, expand it
        if (nodesInPath.has(node)) {
          if (node._children) {
            node.children = node._children;
            node._children = null;
          }

          // Recursively process children
          if (node.children) {
            node.children.forEach((child: any) => expandPathNodes(child));
          }
        }

        // Also check collapsed children in case they're in the path
        if (node._children) {
          node._children.forEach((child: any) => {
            if (nodesInPath.has(child)) {
              expandPathNodes(child);
            }
          });
        }
      }

      expandPathNodes(root);

      // Keep matched nodes themselves collapsed if they have children
      root.descendants().forEach((d: any) => {
        if (matchedNodes.has(d.data.id) && d.children && d.children.length > 0) {
          d._children = d.children;
          d.children = null;
        }
      });
    } else {
      // No search term: default collapsed state (depth > 1)
      root.descendants().forEach((d: any) => {
        if (d.depth > 1) {
          d._children = d.children;
          d.children = null;
        }
      });
    }

    // Update function
    function update(source: any) {
      const duration = 300;

      // Recompute layout
      treeLayout(root);

      const nodes = root.descendants();
      const links = root.links();

      // Normalize for fixed-depth
      nodes.forEach((d: any) => {
        d.y = d.depth * 200;
      });

      // Links
      const link = g.selectAll<SVGPathElement, any>('.link')
        .data(links, (d: any) => d.target.data.id);

      const linkEnter = link.enter()
        .append('path')
        .attr('class', 'link')
        .attr('d', () => {
          const o = { x: source.x0 || 0, y: source.y0 || 0 };
          return diagonal(o, o);
        })
        .attr('fill', 'none')
        .attr('stroke', (d: any) => {
          // Highlight path if target is matched or in path to matched node
          if (matchedNodes.has(d.target.data.id) || (pathNodes.has(d.target.data.id) && matchedNodes.size > 0)) {
            return '#f59e0b';
          }
          return '#cbd5e1';
        })
        .attr('stroke-width', (d: any) => {
          const isInPath = matchedNodes.has(d.target.data.id) || (pathNodes.has(d.target.data.id) && matchedNodes.size > 0);
          return isInPath ? 3 : 2;
        })
        .attr('stroke-opacity', (d: any) => {
          const isInPath = matchedNodes.has(d.target.data.id) || (pathNodes.has(d.target.data.id) && matchedNodes.size > 0);
          return isInPath ? 1 : 0.6;
        });

      link.merge(linkEnter as any)
        .transition()
        .duration(duration)
        .attr('d', (d: any) => diagonal(d.source, d.target))
        .attr('stroke', (d: any) => {
          // Highlight path if target is matched or in path to matched node
          if (matchedNodes.has(d.target.data.id) || (pathNodes.has(d.target.data.id) && matchedNodes.size > 0)) {
            return '#f59e0b';
          }
          return '#cbd5e1';
        })
        .attr('stroke-width', (d: any) => {
          const isInPath = matchedNodes.has(d.target.data.id) || (pathNodes.has(d.target.data.id) && matchedNodes.size > 0);
          return isInPath ? 3 : 2;
        })
        .attr('stroke-opacity', (d: any) => {
          const isInPath = matchedNodes.has(d.target.data.id) || (pathNodes.has(d.target.data.id) && matchedNodes.size > 0);
          return isInPath ? 1 : 0.6;
        });

      link.exit()
        .transition()
        .duration(duration)
        .attr('d', () => {
          const o = { x: source.x, y: source.y };
          return diagonal(o, o);
        })
        .remove();

      // Nodes
      const node = g.selectAll<SVGGElement, any>('.node')
        .data(nodes, (d: any) => d.data.id);

      const nodeEnter = node.enter()
        .append('g')
        .attr('class', 'node')
        .attr('transform', () => `translate(${source.y0 || 0},${source.x0 || 0})`)
        .on('click', (event, d: any) => {
          if (d.children || d._children) {
            if (d.children) {
              d._children = d.children;
              d.children = null;
            } else {
              d.children = d._children;
              d._children = null;
            }
            update(d);
          }
        })
        .on('mouseover', (event, d: any) => {
          tooltip.transition().duration(200).style('opacity', 0.95);

          let tooltipContent = `<strong>${d.data.name}</strong><br/>Level: ${d.data.level || 'Root'}`;

          if (d.data.systemCount !== undefined && d.data.systemCount !== null) {
            tooltipContent += `<br/>Systems: ${d.data.systemCount}`;
          }

          if (d.data.metadata) {
            tooltipContent += `<br/>Project: ${d.data.metadata.projectName}`;
            tooltipContent += `<br/>Architect: ${d.data.metadata.architect}`;
            tooltipContent += `<br/>Status: ${d.data.metadata.reviewStatus}`;
          }

          tooltip
            .html(tooltipContent)
            .style('left', (event.pageX + 15) + 'px')
            .style('top', (event.pageY - 28) + 'px');
        })
        .on('mouseout', () => {
          tooltip.transition().duration(500).style('opacity', 0);
        });

      // Circle for each node
      nodeEnter.append('circle')
        .attr('r', 8)
        .attr('fill', (d: any) => {
          if (matchedNodes.has(d.data.id)) {
            return '#fbbf24'; // Matched node - yellow
          }
          if (pathNodes.has(d.data.id) && matchedNodes.size > 0) {
            return '#fb923c'; // Path node - lighter orange
          }
          return levelColors[d.data.level] || levelColors['root'];
        })
        .attr('stroke', (d: any) => {
          const isInPath = matchedNodes.has(d.data.id) || (pathNodes.has(d.data.id) && matchedNodes.size > 0);
          return isInPath ? '#f59e0b' : '#fff';
        })
        .attr('stroke-width', (d: any) => {
          const isInPath = matchedNodes.has(d.data.id) || (pathNodes.has(d.data.id) && matchedNodes.size > 0);
          return isInPath ? 3 : 2;
        })
        .style('cursor', (d: any) => (d.children || d._children) ? 'pointer' : 'default');

      // Text label
      nodeEnter.append('text')
        .attr('y', (d: any) => d.children ? -12 : 0)
        .attr('dy', (d: any) => d.children ? '-0.5em' : '0.35em')
        .attr('x', (d: any) => d.children ? 0 : 12)
        .attr('text-anchor', (d: any) => d.children ? 'middle' : 'start')
        .text((d: any) => d.data.name)
        .style('font-size', '12px')
        .style('font-weight', (d: any) => {
          const isInPath = matchedNodes.has(d.data.id) || (pathNodes.has(d.data.id) && matchedNodes.size > 0);
          return isInPath ? 'bold' : 'normal';
        })
        .style('fill', (d: any) => {
          if (matchedNodes.has(d.data.id)) {
            return '#d97706'; // Matched node - darker orange
          }
          if (pathNodes.has(d.data.id) && matchedNodes.size > 0) {
            return '#ea580c'; // Path node - orange
          }
          return '#374151';
        })
        .style('pointer-events', 'none');

      // Merge and transition
      const nodeUpdate = nodeEnter.merge(node as any);

      nodeUpdate.transition()
        .duration(duration)
        .attr('transform', (d: any) => `translate(${d.y},${d.x})`);

      nodeUpdate.select('circle')
        .attr('r', 8)
        .attr('fill', (d: any) => {
          if (matchedNodes.has(d.data.id)) {
            return '#fbbf24'; // Matched node - yellow
          }
          if (pathNodes.has(d.data.id) && matchedNodes.size > 0) {
            return '#fb923c'; // Path node - lighter orange
          }
          return levelColors[d.data.level] || levelColors['root'];
        })
        .attr('stroke', (d: any) => {
          const isInPath = matchedNodes.has(d.data.id) || (pathNodes.has(d.data.id) && matchedNodes.size > 0);
          return isInPath ? '#f59e0b' : '#fff';
        })
        .attr('stroke-width', (d: any) => {
          const isInPath = matchedNodes.has(d.data.id) || (pathNodes.has(d.data.id) && matchedNodes.size > 0);
          return isInPath ? 3 : 2;
        })
        .style('cursor', (d: any) => (d.children || d._children) ? 'pointer' : 'default');

      nodeUpdate.select('text')
        .transition()
        .duration(duration)
        .attr('y', (d: any) => d.children ? -12 : 0)
        .attr('dy', (d: any) => d.children ? '-0.5em' : '0.35em')
        .attr('x', (d: any) => d.children ? 0 : 12)
        .attr('text-anchor', (d: any) => d.children ? 'middle' : 'start')
        .style('font-weight', (d: any) => {
          const isInPath = matchedNodes.has(d.data.id) || (pathNodes.has(d.data.id) && matchedNodes.size > 0);
          return isInPath ? 'bold' : 'normal';
        })
        .style('fill', (d: any) => {
          if (matchedNodes.has(d.data.id)) {
            return '#d97706'; // Matched node - darker orange
          }
          if (pathNodes.has(d.data.id) && matchedNodes.size > 0) {
            return '#ea580c'; // Path node - orange
          }
          return '#374151';
        });

      // Exit nodes
      node.exit()
        .transition()
        .duration(duration)
        .attr('transform', () => `translate(${source.y},${source.x})`)
        .remove();

      // Store positions for transitions
      nodes.forEach((d: any) => {
        d.x0 = d.x;
        d.y0 = d.y;
      });
    }

    // Diagonal path generator
    function diagonal(s: any, d: any) {
      return `M ${s.y} ${s.x}
              C ${(s.y + d.y) / 2} ${s.x},
                ${(s.y + d.y) / 2} ${d.x},
                ${d.y} ${d.x}`;
    }

    // Initialize positions
    (root as any).x0 = innerHeight / 2;
    (root as any).y0 = 0;

    // Initial render
    update(root);

  }, [data, searchTerm, dimensions, onSearchMatch]);

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

export default BusinessCapabilitiesDiagram;
