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
});
