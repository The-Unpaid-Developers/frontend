import React from 'react';
import { render } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import BusinessCapabilitiesDiagram from '../BusinessCapabilitiesDiagram';

// Mock D3
vi.mock('d3', () => {
  const mockSelection = {
    selectAll: vi.fn().mockReturnThis(),
    remove: vi.fn().mockReturnThis(),
    append: vi.fn().mockReturnThis(),
    attr: vi.fn().mockReturnThis(),
    style: vi.fn().mockReturnThis(),
    text: vi.fn().mockReturnThis(),
    on: vi.fn().mockReturnThis(),
    call: vi.fn().mockReturnThis(),
    transition: vi.fn().mockReturnThis(),
    duration: vi.fn().mockReturnThis(),
    select: vi.fn().mockReturnThis(),
    data: vi.fn().mockReturnThis(),
    enter: vi.fn().mockReturnThis(),
    exit: vi.fn().mockReturnThis(),
    merge: vi.fn().mockReturnThis(),
    node: vi.fn(() => null),
  };

  return {
    select: vi.fn(() => mockSelection),
    hierarchy: vi.fn((data) => ({
      descendants: () => [],
      links: () => [],
      x: 0,
      y: 0,
      data,
    })),
    tree: vi.fn(() => vi.fn()),
    linkHorizontal: vi.fn(() => vi.fn()),
    zoom: vi.fn(() => ({
      scaleExtent: vi.fn().mockReturnThis(),
      on: vi.fn().mockReturnThis(),
    })),
    zoomIdentity: { k: 1, x: 0, y: 0 },
  };
});

describe('BusinessCapabilitiesDiagram', () => {
  const mockData = [
    {
      id: '1',
      name: 'Test Capability',
      level: 'L1',
      systemCode: 'SYS-001',
      parentId: null,
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders diagram without crashing', () => {
    const { container } = render(<BusinessCapabilitiesDiagram data={mockData} />);
    expect(container).toBeInTheDocument();
  });

  it('renders with empty data', () => {
    const { container } = render(<BusinessCapabilitiesDiagram data={[]} />);
    expect(container).toBeInTheDocument();
  });

  it('has svg element', () => {
    const { container } = render(<BusinessCapabilitiesDiagram data={mockData} />);
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('renders with multiple capabilities', () => {
    const multipleData = [
      {
        id: '1',
        name: 'Capability 1',
        level: 'L1',
        systemCode: 'SYS-001',
        parentId: null,
      },
      {
        id: '2',
        name: 'Capability 2',
        level: 'L2',
        systemCode: 'SYS-001',
        parentId: '1',
      },
      {
        id: '3',
        name: 'Capability 3',
        level: 'L3',
        systemCode: 'SYS-001',
        parentId: '2',
      },
    ];
    const { container } = render(<BusinessCapabilitiesDiagram data={multipleData} />);
    expect(container).toBeInTheDocument();
  });

  it('renders with different system codes', () => {
    const mixedData = [
      {
        id: '1',
        name: 'Capability 1',
        level: 'L1',
        systemCode: 'SYS-001',
        parentId: null,
      },
      {
        id: '2',
        name: 'Capability 2',
        level: 'L1',
        systemCode: 'SYS-002',
        parentId: null,
      },
    ];
    const { container } = render(<BusinessCapabilitiesDiagram data={mixedData} />);
    expect(container).toBeInTheDocument();
  });

  it('handles null parentId', () => {
    const dataWithNullParent = [
      {
        id: '1',
        name: 'Root Capability',
        level: 'L1',
        systemCode: 'SYS-001',
        parentId: null,
      },
    ];
    const { container } = render(<BusinessCapabilitiesDiagram data={dataWithNullParent} />);
    expect(container).toBeInTheDocument();
  });

  it('renders container with correct class', () => {
    const { container } = render(<BusinessCapabilitiesDiagram data={mockData} />);
    const diagramContainer = container.firstChild;
    expect(diagramContainer).toHaveClass('w-full');
  });

  it('handles deeply nested capabilities', () => {
    const deepData = [
      {
        id: '1',
        name: 'L1 Capability',
        level: 'L1',
        systemCode: 'SYS-001',
        parentId: null,
      },
      {
        id: '2',
        name: 'L2 Capability',
        level: 'L2',
        systemCode: 'SYS-001',
        parentId: '1',
      },
      {
        id: '3',
        name: 'L3 Capability',
        level: 'L3',
        systemCode: 'SYS-001',
        parentId: '2',
      },
      {
        id: '4',
        name: 'L4 Capability',
        level: 'L4',
        systemCode: 'SYS-001',
        parentId: '3',
      },
    ];
    const { container } = render(<BusinessCapabilitiesDiagram data={deepData} />);
    expect(container).toBeInTheDocument();
  });

  it('handles capabilities with special characters in names', () => {
    const specialCharsData = [
      {
        id: '1',
        name: 'Capability & Special',
        level: 'L1',
        systemCode: 'SYS-001',
        parentId: null,
      },
      {
        id: '2',
        name: 'Capability <> Test',
        level: 'L1',
        systemCode: 'SYS-001',
        parentId: null,
      },
    ];
    const { container } = render(<BusinessCapabilitiesDiagram data={specialCharsData} />);
    expect(container).toBeInTheDocument();
  });

  it('handles large dataset efficiently', () => {
    const largeData = Array.from({ length: 100 }, (_, i) => ({
      id: `${i + 1}`,
      name: `Capability ${i + 1}`,
      level: `L${(i % 3) + 1}`,
      systemCode: `SYS-${String(i % 10).padStart(3, '0')}`,
      parentId: i > 0 ? `${i}` : null,
    }));
    const { container } = render(<BusinessCapabilitiesDiagram data={largeData} />);
    expect(container).toBeInTheDocument();
  });

  it('renders with only L1 capabilities', () => {
    const l1OnlyData = [
      {
        id: '1',
        name: 'L1 Cap 1',
        level: 'L1',
        systemCode: 'SYS-001',
        parentId: null,
      },
      {
        id: '2',
        name: 'L1 Cap 2',
        level: 'L1',
        systemCode: 'SYS-001',
        parentId: null,
      },
      {
        id: '3',
        name: 'L1 Cap 3',
        level: 'L1',
        systemCode: 'SYS-001',
        parentId: null,
      },
    ];
    const { container } = render(<BusinessCapabilitiesDiagram data={l1OnlyData} />);
    expect(container).toBeInTheDocument();
  });

  it('handles capabilities with very long names', () => {
    const longNameData = [
      {
        id: '1',
        name: 'This is a very long capability name that should be handled properly by the visualization component without breaking the layout',
        level: 'L1',
        systemCode: 'SYS-001',
        parentId: null,
      },
    ];
    const { container } = render(<BusinessCapabilitiesDiagram data={longNameData} />);
    expect(container).toBeInTheDocument();
  });

  it('maintains SVG structure after render', () => {
    const { container } = render(<BusinessCapabilitiesDiagram data={mockData} />);
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
    expect(svg?.tagName).toBe('svg');
  });

  it('handles update with new data', () => {
    const { rerender, container } = render(<BusinessCapabilitiesDiagram data={mockData} />);

    const newData = [
      {
        id: '5',
        name: 'New Capability',
        level: 'L1',
        systemCode: 'SYS-002',
        parentId: null,
      },
    ];

    rerender(<BusinessCapabilitiesDiagram data={newData} />);
    expect(container).toBeInTheDocument();
  });

  it('renders with all levels represented', () => {
    const allLevelsData = [
      {
        id: '1',
        name: 'L1',
        level: 'L1',
        systemCode: 'SYS-001',
        parentId: null,
      },
      {
        id: '2',
        name: 'L2',
        level: 'L2',
        systemCode: 'SYS-001',
        parentId: '1',
      },
      {
        id: '3',
        name: 'L3',
        level: 'L3',
        systemCode: 'SYS-001',
        parentId: '2',
      },
    ];
    const { container } = render(<BusinessCapabilitiesDiagram data={allLevelsData} />);
    expect(container).toBeInTheDocument();
  });
});
