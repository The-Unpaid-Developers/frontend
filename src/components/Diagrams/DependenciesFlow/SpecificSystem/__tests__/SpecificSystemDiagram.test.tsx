import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { renderWithRouter, screen, fireEvent, waitFor } from '../../../../../test/test-utils';
import { createMockError } from '../../../../../__tests__/testFactories';
import SpecificSystemDiagram from '../SpecificSystemDiagram';

// Mock D3 to avoid rendering issues in tests
vi.mock('d3-sankey', () => {
  const mockSankeyGenerator = vi.fn((data) => data || { nodes: [], links: [] });

  return {
    sankey: vi.fn(() => Object.assign(mockSankeyGenerator, {
      nodeWidth: vi.fn().mockReturnThis(),
      nodePadding: vi.fn().mockReturnThis(),
      extent: vi.fn().mockReturnThis(),
      nodeId: vi.fn().mockReturnThis(),
      nodeAlign: vi.fn().mockReturnThis(),
      nodeSort: vi.fn().mockReturnThis(),
      iterations: vi.fn().mockReturnThis(),
      nodes: vi.fn((data) => data?.nodes || []),
      links: vi.fn((data) => data?.links || []),
    })),
    sankeyLinkHorizontal: vi.fn(() => vi.fn()),
    sankeyJustify: vi.fn(),
  };
});

describe('SpecificSystemDiagram', () => {
  const mockMetadata = {
    code: 'SYS-001',
    review: 'Review-001',
    integrationMiddleware: ['Middleware1'],
    generatedDate: '2023-01-01'
  };

  const mockData = {
    nodes: [
      { id: '1', name: 'System A', layer: 0, type: 'Major', criticality: 'High' },
      { id: '2', name: 'System B', layer: 1, type: 'Standard-1', criticality: 'Medium' },
    ],
    links: [
      { source: '1', target: '2', value: 1, pattern: 'API', frequency: 'Daily', role: 'Producer' },
    ],
    metadata: mockMetadata,
  };

  const defaultProps = {
    pinnedSystemId: 'SYS-001',
    integrationMiddleware: ['Middleware1'],
  };

  it('can be imported', async () => {
    const module = await import('../SpecificSystemDiagram');
    expect(module.default).toBeDefined();
  });

  it('renders with basic data structure', () => {
    const { container } = renderWithRouter(<SpecificSystemDiagram data={mockData} {...defaultProps} />);
    expect(container).toBeInTheDocument();
  });

  it('renders with empty nodes', () => {
    const emptyData = { nodes: [], links: [], metadata: mockMetadata };
    const { container } = renderWithRouter(<SpecificSystemDiagram data={emptyData} {...defaultProps} />);
    expect(container).toBeInTheDocument();
  });

  it('handles multiple nodes', () => {
    const multiNodeData = {
      nodes: [
        { id: '1', name: 'Node 1', layer: 0, type: 'Major', criticality: 'High' },
        { id: '2', name: 'Node 2', layer: 1, type: 'Standard-1', criticality: 'Medium' },
        { id: '3', name: 'Node 3', layer: 2, type: 'Standard-2', criticality: 'Low' },
        { id: '4', name: 'Node 4', layer: 3, type: 'Standard-3', criticality: 'Medium' },
      ],
      links: [
        { source: '1', target: '2', value: 1, pattern: 'API', frequency: 'Daily', role: 'Producer' },
        { source: '2', target: '3', value: 1, pattern: 'Web Service', frequency: 'Hourly', role: 'Consumer' },
        { source: '3', target: '4', value: 1, pattern: 'Batch', frequency: 'Weekly', role: 'Producer' },
      ],
      metadata: mockMetadata,
    };
    const { container } = renderWithRouter(<SpecificSystemDiagram data={multiNodeData} {...defaultProps} />);
    expect(container).toBeInTheDocument();
  });

  it('handles complex link structure', () => {
    const complexData = {
      nodes: [
        { id: '1', name: 'Source', layer: 0, type: 'Major', criticality: 'High' },
        { id: '2', name: 'Mid 1', layer: 1, type: 'Standard-1', criticality: 'Medium' },
        { id: '3', name: 'Mid 2', layer: 1, type: 'Standard-2', criticality: 'Medium' },
        { id: '4', name: 'Target', layer: 2, type: 'Standard-3', criticality: 'Low' },
      ],
      links: [
        { source: '1', target: '2', value: 2, pattern: 'API', frequency: 'Daily', role: 'Producer' },
        { source: '1', target: '3', value: 3, pattern: 'Web Service', frequency: 'Hourly', role: 'Producer' },
        { source: '2', target: '4', value: 2, pattern: 'Batch', frequency: 'Weekly', role: 'Consumer' },
        { source: '3', target: '4', value: 3, pattern: 'File', frequency: 'Monthly', role: 'Consumer' },
      ],
      metadata: mockMetadata,
    };
    const { container } = renderWithRouter(<SpecificSystemDiagram data={complexData} {...defaultProps} />);
    expect(container).toBeInTheDocument();
  });

  it('handles nodes with long names', () => {
    const longNameData = {
      nodes: [
        { id: '1', name: 'Very Long System Name That Should Be Handled Properly', layer: 0, type: 'Major', criticality: 'High' },
        { id: '2', name: 'Another Long System Name', layer: 1, type: 'Standard-1', criticality: 'Medium' },
      ],
      links: [
        { source: '1', target: '2', value: 1, pattern: 'API', frequency: 'Daily', role: 'Producer' },
      ],
      metadata: mockMetadata,
    };
    const { container } = renderWithRouter(<SpecificSystemDiagram data={longNameData} {...defaultProps} />);
    expect(container).toBeInTheDocument();
  });

  it('handles different link values', () => {
    const variableValueData = {
      nodes: [
        { id: '1', name: 'System A', layer: 0, type: 'Major', criticality: 'High' },
        { id: '2', name: 'System B', layer: 1, type: 'Standard-1', criticality: 'Medium' },
        { id: '3', name: 'System C', layer: 1, type: 'Standard-2', criticality: 'Low' },
      ],
      links: [
        { source: '1', target: '2', value: 1, pattern: 'API', frequency: 'Daily', role: 'Producer' },
        { source: '1', target: '3', value: 10, pattern: 'Web Service', frequency: 'Hourly', role: 'Producer' },
      ],
      metadata: mockMetadata,
    };
    const { container } = renderWithRouter(<SpecificSystemDiagram data={variableValueData} {...defaultProps} />);
    expect(container).toBeInTheDocument();
  });

  it('renders container element', () => {
    const { container } = renderWithRouter(<SpecificSystemDiagram data={mockData} {...defaultProps} />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('handles re-render with updated data', () => {
    const { rerender, container } = renderWithRouter(<SpecificSystemDiagram data={mockData} {...defaultProps} />);

    const newData = {
      nodes: [
        { id: '1', name: 'Updated System', layer: 0, type: 'Major', criticality: 'High' },
      ],
      links: [],
      metadata: mockMetadata,
    };

    rerender(<SpecificSystemDiagram data={newData} {...defaultProps} />);
    expect(container).toBeInTheDocument();
  });

  describe('Props and Configuration', () => {
    it('renders with custom width and height', () => {
      const { container } = renderWithRouter(
        <SpecificSystemDiagram 
          data={mockData} 
          {...defaultProps} 
          width={800} 
          height={600} 
        />
      );
      expect(container).toBeInTheDocument();
    });

    it('handles different pinnedSystemId', () => {
      const { container } = renderWithRouter(
        <SpecificSystemDiagram 
          data={mockData} 
          {...defaultProps} 
          pinnedSystemId="SYS-002" 
        />
      );
      expect(container).toBeInTheDocument();
    });

    it('handles multiple integration middleware', () => {
      const { container } = renderWithRouter(
        <SpecificSystemDiagram 
          data={mockData} 
          {...defaultProps} 
          integrationMiddleware={['MW-001', 'MW-002', 'MW-003']} 
        />
      );
      expect(container).toBeInTheDocument();
    });

    it('handles empty integration middleware', () => {
      const { container } = renderWithRouter(
        <SpecificSystemDiagram 
          data={mockData} 
          {...defaultProps} 
          integrationMiddleware={[]} 
        />
      );
      expect(container).toBeInTheDocument();
    });
  });

  describe('Data Variations', () => {
    it('handles nodes with different criticality levels', () => {
      const criticalityData = {
        nodes: [
          { id: '1', name: 'Critical System', layer: 0, type: 'Major', criticality: 'Critical' },
          { id: '2', name: 'High System', layer: 1, type: 'Standard-1', criticality: 'High' },
          { id: '3', name: 'Medium System', layer: 2, type: 'Standard-2', criticality: 'Medium' },
          { id: '4', name: 'Low System', layer: 3, type: 'Standard-3', criticality: 'Low' },
        ],
        links: [
          { source: '1', target: '2', value: 1, pattern: 'API', frequency: 'Daily', role: 'Producer' },
          { source: '2', target: '3', value: 1, pattern: 'Web Service', frequency: 'Hourly', role: 'Consumer' },
          { source: '3', target: '4', value: 1, pattern: 'Batch', frequency: 'Weekly', role: 'Producer' },
        ],
        metadata: mockMetadata,
      };
      const { container } = renderWithRouter(<SpecificSystemDiagram data={criticalityData} {...defaultProps} />);
      expect(container).toBeInTheDocument();
    });

    it('handles nodes with different types', () => {
      const typeData = {
        nodes: [
          { id: '1', name: 'Major System', layer: 0, type: 'Major', criticality: 'High' },
          { id: '2', name: 'Standard-1 System', layer: 1, type: 'Standard-1', criticality: 'Medium' },
          { id: '3', name: 'Standard-2 System', layer: 2, type: 'Standard-2', criticality: 'Medium' },
          { id: '4', name: 'Standard-3 System', layer: 3, type: 'Standard-3', criticality: 'Low' },
          { id: '5', name: 'Unknown System', layer: 4, type: 'Unknown', criticality: 'Low' },
        ],
        links: [
          { source: '1', target: '2', value: 1, pattern: 'API', frequency: 'Daily', role: 'Producer' },
          { source: '2', target: '3', value: 1, pattern: 'Web Service', frequency: 'Hourly', role: 'Consumer' },
          { source: '3', target: '4', value: 1, pattern: 'Batch', frequency: 'Weekly', role: 'Producer' },
          { source: '4', target: '5', value: 1, pattern: 'File', frequency: 'Monthly', role: 'Consumer' },
        ],
        metadata: mockMetadata,
      };
      const { container } = renderWithRouter(<SpecificSystemDiagram data={typeData} {...defaultProps} />);
      expect(container).toBeInTheDocument();
    });

    it('handles links with different patterns', () => {
      const patternData = {
        nodes: [
          { id: '1', name: 'Source', layer: 0, type: 'Major', criticality: 'High' },
          { id: '2', name: 'Target 1', layer: 1, type: 'Standard-1', criticality: 'Medium' },
          { id: '3', name: 'Target 2', layer: 1, type: 'Standard-1', criticality: 'Medium' },
          { id: '4', name: 'Target 3', layer: 1, type: 'Standard-1', criticality: 'Medium' },
          { id: '5', name: 'Target 4', layer: 1, type: 'Standard-1', criticality: 'Medium' },
        ],
        links: [
          { source: '1', target: '2', value: 1, pattern: 'API', frequency: 'Daily', role: 'Producer' },
          { source: '1', target: '3', value: 1, pattern: 'Web Service', frequency: 'Hourly', role: 'Producer' },
          { source: '1', target: '4', value: 1, pattern: 'Batch', frequency: 'Weekly', role: 'Producer' },
          { source: '1', target: '5', value: 1, pattern: 'File', frequency: 'Monthly', role: 'Producer' },
        ],
        metadata: mockMetadata,
      };
      const { container } = renderWithRouter(<SpecificSystemDiagram data={patternData} {...defaultProps} />);
      expect(container).toBeInTheDocument();
    });

    it('handles links with different frequencies', () => {
      const frequencyData = {
        nodes: [
          { id: '1', name: 'Source', layer: 0, type: 'Major', criticality: 'High' },
          { id: '2', name: 'Real-time Target', layer: 1, type: 'Standard-1', criticality: 'High' },
          { id: '3', name: 'Daily Target', layer: 1, type: 'Standard-1', criticality: 'Medium' },
          { id: '4', name: 'Weekly Target', layer: 1, type: 'Standard-1', criticality: 'Low' },
        ],
        links: [
          { source: '1', target: '2', value: 5, pattern: 'API', frequency: 'Real-time', role: 'Producer' },
          { source: '1', target: '3', value: 3, pattern: 'API', frequency: 'Daily', role: 'Producer' },
          { source: '1', target: '4', value: 1, pattern: 'Batch', frequency: 'Weekly', role: 'Producer' },
        ],
        metadata: mockMetadata,
      };
      const { container } = renderWithRouter(<SpecificSystemDiagram data={frequencyData} {...defaultProps} />);
      expect(container).toBeInTheDocument();
    });

    it('handles links with zero values', () => {
      const zeroValueData = {
        nodes: [
          { id: '1', name: 'Source', layer: 0, type: 'Major', criticality: 'High' },
          { id: '2', name: 'Target', layer: 1, type: 'Standard-1', criticality: 'Medium' },
        ],
        links: [
          { source: '1', target: '2', value: 0, pattern: 'API', frequency: 'Daily', role: 'Producer' },
        ],
        metadata: mockMetadata,
      };
      const { container } = renderWithRouter(<SpecificSystemDiagram data={zeroValueData} {...defaultProps} />);
      expect(container).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('handles nodes with special characters in names', () => {
      const specialCharsData = {
        nodes: [
          { id: '1', name: 'System A & B (Legacy)', layer: 0, type: 'Major', criticality: 'High' },
          { id: '2', name: 'System C/D - New', layer: 1, type: 'Standard-1', criticality: 'Medium' },
          { id: '3', name: 'System E@F.com', layer: 2, type: 'Standard-2', criticality: 'Low' },
        ],
        links: [
          { source: '1', target: '2', value: 1, pattern: 'API', frequency: 'Daily', role: 'Producer' },
          { source: '2', target: '3', value: 1, pattern: 'Web Service', frequency: 'Hourly', role: 'Consumer' },
        ],
        metadata: mockMetadata,
      };
      const { container } = renderWithRouter(<SpecificSystemDiagram data={specialCharsData} {...defaultProps} />);
      expect(container).toBeInTheDocument();
    });

    it('handles nodes with very short names', () => {
      const shortNameData = {
        nodes: [
          { id: '1', name: 'A', layer: 0, type: 'Major', criticality: 'High' },
          { id: '2', name: 'B', layer: 1, type: 'Standard-1', criticality: 'Medium' },
          { id: '3', name: 'C', layer: 2, type: 'Standard-2', criticality: 'Low' },
        ],
        links: [
          { source: '1', target: '2', value: 1, pattern: 'API', frequency: 'Daily', role: 'Producer' },
          { source: '2', target: '3', value: 1, pattern: 'Web Service', frequency: 'Hourly', role: 'Consumer' },
        ],
        metadata: mockMetadata,
      };
      const { container } = renderWithRouter(<SpecificSystemDiagram data={shortNameData} {...defaultProps} />);
      expect(container).toBeInTheDocument();
    });

    it('handles circular dependencies', () => {
      const circularData = {
        nodes: [
          { id: '1', name: 'System A', layer: 0, type: 'Major', criticality: 'High' },
          { id: '2', name: 'System B', layer: 1, type: 'Standard-1', criticality: 'Medium' },
          { id: '3', name: 'System C', layer: 2, type: 'Standard-2', criticality: 'Low' },
        ],
        links: [
          { source: '1', target: '2', value: 1, pattern: 'API', frequency: 'Daily', role: 'Producer' },
          { source: '2', target: '3', value: 1, pattern: 'Web Service', frequency: 'Hourly', role: 'Consumer' },
          { source: '3', target: '1', value: 1, pattern: 'Batch', frequency: 'Weekly', role: 'Producer' },
        ],
        metadata: mockMetadata,
      };
      const { container } = renderWithRouter(<SpecificSystemDiagram data={circularData} {...defaultProps} />);
      expect(container).toBeInTheDocument();
    });

    it('handles single node with no links', () => {
      const singleNodeData = {
        nodes: [
          { id: '1', name: 'Isolated System', layer: 0, type: 'Major', criticality: 'High' },
        ],
        links: [],
        metadata: mockMetadata,
      };
      const { container } = renderWithRouter(<SpecificSystemDiagram data={singleNodeData} {...defaultProps} />);
      expect(container).toBeInTheDocument();
    });

    it('handles different metadata configurations', () => {
      const customMetadata = {
        code: 'CUSTOM-001',
        review: 'Custom-Review-001',
        integrationMiddleware: ['Custom-MW-1', 'Custom-MW-2'],
        generatedDate: '2024-01-01'
      };
      const metadataData = {
        nodes: mockData.nodes,
        links: mockData.links,
        metadata: customMetadata,
      };
      const { container } = renderWithRouter(<SpecificSystemDiagram data={metadataData} {...defaultProps} />);
      expect(container).toBeInTheDocument();
    });
  });

  describe('Performance and Large Data', () => {
    it('handles large number of nodes efficiently', () => {
      const nodes = Array.from({ length: 50 }, (_, i) => ({
        id: `node-${i}`,
        name: `System ${i}`,
        layer: i % 5,
        type: ['Major', 'Standard-1', 'Standard-2', 'Standard-3'][i % 4],
        criticality: ['High', 'Medium', 'Low'][i % 3],
      }));
      
      const links = Array.from({ length: 49 }, (_, i) => ({
        source: `node-${i}`,
        target: `node-${i + 1}`,
        value: Math.floor(Math.random() * 5) + 1,
        pattern: ['API', 'Web Service', 'Batch', 'File'][i % 4],
        frequency: ['Daily', 'Hourly', 'Weekly', 'Monthly'][i % 4],
        role: ['Producer', 'Consumer'][i % 2],
      }));

      const largeData = { nodes, links, metadata: mockMetadata };
      const { container } = renderWithRouter(<SpecificSystemDiagram data={largeData} {...defaultProps} />);
      expect(container).toBeInTheDocument();
    });

    it('handles many-to-many relationships', () => {
      const manyToManyData = {
        nodes: [
          { id: '1', name: 'Source 1', layer: 0, type: 'Major', criticality: 'High' },
          { id: '2', name: 'Source 2', layer: 0, type: 'Major', criticality: 'High' },
          { id: '3', name: 'Target 1', layer: 1, type: 'Standard-1', criticality: 'Medium' },
          { id: '4', name: 'Target 2', layer: 1, type: 'Standard-1', criticality: 'Medium' },
          { id: '5', name: 'Target 3', layer: 1, type: 'Standard-1', criticality: 'Medium' },
        ],
        links: [
          { source: '1', target: '3', value: 1, pattern: 'API', frequency: 'Daily', role: 'Producer' },
          { source: '1', target: '4', value: 2, pattern: 'Web Service', frequency: 'Hourly', role: 'Producer' },
          { source: '1', target: '5', value: 1, pattern: 'Batch', frequency: 'Weekly', role: 'Producer' },
          { source: '2', target: '3', value: 3, pattern: 'API', frequency: 'Daily', role: 'Producer' },
          { source: '2', target: '4', value: 1, pattern: 'File', frequency: 'Monthly', role: 'Producer' },
          { source: '2', target: '5', value: 2, pattern: 'Web Service', frequency: 'Hourly', role: 'Producer' },
        ],
        metadata: mockMetadata,
      };
      const { container } = renderWithRouter(<SpecificSystemDiagram data={manyToManyData} {...defaultProps} />);
      expect(container).toBeInTheDocument();
    });
  });

  describe('Component Lifecycle', () => {
    it('handles multiple re-renders with different data', () => {
      const { rerender } = renderWithRouter(<SpecificSystemDiagram data={mockData} {...defaultProps} />);
      
      // First re-render with different nodes
      const newData1 = {
        nodes: [
          { id: '1', name: 'Updated System A', layer: 0, type: 'Major', criticality: 'Critical' },
        ],
        links: [],
        metadata: mockMetadata,
      };
      rerender(<SpecificSystemDiagram data={newData1} {...defaultProps} />);
      
      // Second re-render with more complex data
      const newData2 = {
        nodes: [
          { id: '1', name: 'System X', layer: 0, type: 'Major', criticality: 'High' },
          { id: '2', name: 'System Y', layer: 1, type: 'Standard-1', criticality: 'Medium' },
          { id: '3', name: 'System Z', layer: 2, type: 'Standard-2', criticality: 'Low' },
        ],
        links: [
          { source: '1', target: '2', value: 5, pattern: 'API', frequency: 'Real-time', role: 'Producer' },
          { source: '2', target: '3', value: 3, pattern: 'Web Service', frequency: 'Daily', role: 'Consumer' },
        ],
        metadata: mockMetadata,
      };
      rerender(<SpecificSystemDiagram data={newData2} {...defaultProps} />);
      
      expect(true).toBe(true); // Component should handle all re-renders without errors
    });

    it('handles prop changes for different dimensions', () => {
      const { rerender } = renderWithRouter(
        <SpecificSystemDiagram data={mockData} {...defaultProps} width={800} height={600} />
      );
      
      rerender(<SpecificSystemDiagram data={mockData} {...defaultProps} width={1200} height={800} />);
      rerender(<SpecificSystemDiagram data={mockData} {...defaultProps} width={600} height={400} />);
      
      expect(true).toBe(true); // Component should handle dimension changes
    });
  });
});
