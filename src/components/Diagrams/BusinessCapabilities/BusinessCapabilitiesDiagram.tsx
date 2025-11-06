import React, { useRef, useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import * as d3 from 'd3';
import type { BusinessCapability } from '../../../types/diagrams';

interface BusinessCapabilitiesDiagramProps {
  data: BusinessCapability[];
  searchTerm?: string;
  onSearchMatch?: (matchedNodes: string[]) => void;
  onSystemClick?: (systemCode: string) => void;
}

export interface BusinessCapabilitiesDiagramHandle {
  expandAll: () => void;
  collapseAll: () => void;
}

const BusinessCapabilitiesDiagram = forwardRef<BusinessCapabilitiesDiagramHandle, BusinessCapabilitiesDiagramProps>(({
  data,
  searchTerm = '',
  onSearchMatch,
  onSystemClick
}, ref) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const contextMenuRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; node: any } | null>(null);
  const rootNodeRef = useRef<any>(null);
  const updateFunctionRef = useRef<((source: any) => void) | null>(null);

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

  // Close context menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (contextMenuRef.current && !contextMenuRef.current.contains(event.target as Node)) {
        setContextMenu(null);
      }
    };

    if (contextMenu) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [contextMenu]);

  // Context menu handlers
  const handleExpandChildren = (node: any) => {
    if (!updateFunctionRef.current) return;

    function expandAllChildren(d: any) {
      if (d._children) {
        d.children = d._children;
        d._children = null;
      }
      if (d.children) {
        d.children.forEach((child: any) => expandAllChildren(child));
      }
    }

    expandAllChildren(node);
    updateFunctionRef.current(node);
    setContextMenu(null);
  };

  const handleCollapseChildren = (node: any) => {
    if (!updateFunctionRef.current) return;

    function collapseAllChildren(d: any) {
      if (d.children) {
        d._children = d.children;
        d.children = null;
      }
      if (d._children) {
        d._children.forEach((child: any) => collapseAllChildren(child));
      }
    }

    collapseAllChildren(node);
    updateFunctionRef.current(node);
    setContextMenu(null);
  };

  // Expose expand/collapse functions to parent
  useImperativeHandle(ref, () => ({
    expandAll: () => {
      if (!rootNodeRef.current || !updateFunctionRef.current) return;

      function expand(d: any) {
        if (d._children) {
          d.children = d._children;
          d._children = null;
        }
        if (d.children) {
          d.children.forEach((child: any) => expand(child));
        }
      }

      expand(rootNodeRef.current);
      updateFunctionRef.current(rootNodeRef.current);
    },
    collapseAll: () => {
      if (!rootNodeRef.current || !updateFunctionRef.current) return;

      function collapse(d: any) {
        if (d.children) {
          d._children = d.children;
          d.children = null;
        }
        if (d._children) {
          d._children.forEach((child: any) => collapse(child));
        }
      }

      // Collapse all nodes except root
      rootNodeRef.current.descendants().forEach((d: any) => {
        if (d.depth > 0) {
          collapse(d);
        }
      });

      updateFunctionRef.current(rootNodeRef.current);
    }
  }));

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

      // Check if we're in system-specific view (has a top-level System node)
      const topLevelSystemNode = capabilities.find(cap =>
        cap.parentId === null && cap.level === 'Root'
      );

      // Create a map of all nodes
      capabilities.forEach(cap => {
        idMap.set(cap.id, { ...cap, children: [] });
      });

      // Build tree structure
      let root: any;

      if (topLevelSystemNode) {
        // System-specific view: use the system node as root with level 'Root'
        const systemNode = idMap.get(topLevelSystemNode.id);
        root = { ...systemNode, level: 'Root' };

        // Rebuild the tree structure with the system as root
        capabilities.forEach(cap => {
          if (cap.id === topLevelSystemNode.id) {
            // Skip the system node itself
            return;
          }

          const node = idMap.get(cap.id);
          if (cap.parentId === topLevelSystemNode.id) {
            // Direct children of system become children of root
            root.children.push(node);
          } else if (cap.parentId !== null) {
            // Other nodes attach to their parents
            const parent = idMap.get(cap.parentId);
            if (parent) {
              parent.children.push(node);
            }
          }
        });
      } else {
        // General view: use default root
        root = { id: 'root', name: 'Business Capabilities', level: 'Root', children: [] };

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
      }

      return root;
    };

    const hierarchyData = buildHierarchy(data);
    const root = d3.hierarchy(hierarchyData);
    rootNodeRef.current = root;

    // Tree layout
    const treeLayout = d3.tree<any>()
      .size([innerHeight, innerWidth])
      .separation((a, b) => (a.parent === b.parent ? 1 : 1.2));

    treeLayout(root);

    // Color scale for levels
    const levelColors: { [key: string]: string } = {
      'Root': '#1f2937',
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
        // Only process nodes that are in the path to a matched node
        if (nodesInPath.has(node)) {
          // Expand this node if it's collapsed
          if (node._children) {
            node.children = node._children;
            node._children = null;
          }

          // Recurse on children only if this node is in the path
          if (node.children) {
            node.children.forEach((child: any) => expandPathNodes(child));
          }
        }
        // Don't recurse on nodes not in the path - keep them collapsed
      }

      expandPathNodes(root);

      // Keep matched nodes collapsed ONLY if they have children AND none of their descendants match
      root.descendants().forEach((d: any) => {
        if (matchedNodes.has(d.data.id) && d.children && d.children.length > 0) {
          // Check if any descendant also matches
          const hasMatchedDescendant = d.descendants().some((descendant: any) =>
            descendant !== d && matchedNodes.has(descendant.data.id)
          );

          // Only collapse if no descendants match
          if (!hasMatchedDescendant) {
            d._children = d.children;
            d.children = null;
          }
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
      updateFunctionRef.current = update;

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
          // If it's a System level node, navigate to the system view
          if (d.data.level === 'System' && onSystemClick) {
            onSystemClick(d.data.systemCode);
            return;
          }

          // Otherwise, handle expand/collapse
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
        .on('contextmenu', (event, d: any) => {
          event.preventDefault();
          if (d.children || d._children) {
            setContextMenu({
              x: event.pageX,
              y: event.pageY,
              node: d
            });
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

      // Shape for each node (square for System, circle for others)
      nodeEnter.each(function(d: any) {
        const node = d3.select(this);

        if (d.data.level === 'System') {
          // Square for System nodes
          node.append('rect')
            .attr('x', -8)
            .attr('y', -8)
            .attr('width', 16)
            .attr('height', 16)
            .attr('rx', 2)
            .attr('fill', () => {
              if (matchedNodes.has(d.data.id)) {
                return '#fbbf24'; // Matched node - yellow
              }
              if (pathNodes.has(d.data.id) && matchedNodes.size > 0) {
                return '#fb923c'; // Path node - lighter orange
              }
              return levelColors[d.data.level] || levelColors['root'];
            })
            .attr('stroke', () => {
              const isInPath = matchedNodes.has(d.data.id) || (pathNodes.has(d.data.id) && matchedNodes.size > 0);
              return isInPath ? '#f59e0b' : '#fff';
            })
            .attr('stroke-width', () => {
              const isInPath = matchedNodes.has(d.data.id) || (pathNodes.has(d.data.id) && matchedNodes.size > 0);
              return isInPath ? 3 : 2;
            })
            .style('cursor', () => (d.children || d._children || d.data.level === 'System') ? 'pointer' : 'default');
        } else {
          // Circle for non-System nodes
          node.append('circle')
            .attr('r', 8)
            .attr('fill', () => {
              if (matchedNodes.has(d.data.id)) {
                return '#fbbf24'; // Matched node - yellow
              }
              if (pathNodes.has(d.data.id) && matchedNodes.size > 0) {
                return '#fb923c'; // Path node - lighter orange
              }
              return levelColors[d.data.level] || levelColors['root'];
            })
            .attr('stroke', () => {
              const isInPath = matchedNodes.has(d.data.id) || (pathNodes.has(d.data.id) && matchedNodes.size > 0);
              return isInPath ? '#f59e0b' : '#fff';
            })
            .attr('stroke-width', () => {
              const isInPath = matchedNodes.has(d.data.id) || (pathNodes.has(d.data.id) && matchedNodes.size > 0);
              return isInPath ? 3 : 2;
            })
            .style('cursor', () => (d.children || d._children || d.data.level === 'System') ? 'pointer' : 'default');
        }
      });

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

      // Update circles
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
        .style('cursor', (d: any) => (d.children || d._children || d.data.level === 'System') ? 'pointer' : 'default');

      // Update rectangles (System nodes)
      nodeUpdate.select('rect')
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
        .style('cursor', (d: any) => (d.children || d._children || d.data.level === 'System') ? 'pointer' : 'default');

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
      {contextMenu && (
        <div
          ref={contextMenuRef}
          className="fixed bg-white shadow-lg rounded-lg border border-gray-200 py-1 z-50"
          style={{ left: contextMenu.x, top: contextMenu.y }}
        >
          <button
            onClick={() => handleExpandChildren(contextMenu.node)}
            className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center space-x-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span>Expand All Children</span>
          </button>
          <button
            onClick={() => handleCollapseChildren(contextMenu.node)}
            className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center space-x-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
            </svg>
            <span>Collapse All Children</span>
          </button>
        </div>
      )}
    </div>
  );
});

BusinessCapabilitiesDiagram.displayName = 'BusinessCapabilitiesDiagram';

export default BusinessCapabilitiesDiagram;
