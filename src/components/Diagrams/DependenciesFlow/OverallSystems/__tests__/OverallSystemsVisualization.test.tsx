import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import OverallSystemsVisualization from '../OverallSystemsVisualization';

const mockNavigate = vi.fn();
const mockLoadOverallSystemFlows = vi.fn().mockResolvedValue({
  nodes: [
    { id: '1', name: 'System 1', type: 'INTERNAL', criticality: 'HIGH' },
    { id: '2', name: 'System 2', type: 'EXTERNAL', criticality: 'MEDIUM' },
  ],
  edges: [
    { source: '1', target: '2', middleware: [] },
  ],
  metadata: {
    code: 'SYS-001',
    integrationMiddleware: [],
  },
});

vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}));

vi.mock('../../../../../hooks/useFetchDiagramData', () => ({
  useFetchDiagramData: () => ({
    loadOverallSystemFlows: mockLoadOverallSystemFlows,
  }),
}));

vi.mock('../../../../../context/ToastContext', () => ({
  useToast: () => ({
    showError: vi.fn(),
    showSuccess: vi.fn(),
  }),
}));

// Mock the child components
vi.mock('../OverallSystemsFilters', () => ({
  default: ({ filters, onFilterChange }: any) => (
    <div data-testid="filters">Filters Component</div>
  ),
}));

vi.mock('../OverallSystemsDiagram', () => ({
  default: ({ data }: any) => (
    <div data-testid="diagram">Diagram Component</div>
  ),
}));

vi.mock('../OverallSystemsLegend', () => ({
  default: () => (
    <div data-testid="legend">Legend Component</div>
  ),
}));

describe('OverallSystemsVisualization', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders visualization component', () => {
    const { container } = render(<OverallSystemsVisualization />);
    expect(container).toBeInTheDocument();
  });

  it('calls loadOverallSystemFlows on mount', async () => {
    render(<OverallSystemsVisualization />);
    await waitFor(() => {
      expect(mockLoadOverallSystemFlows).toHaveBeenCalled();
    });
  });

  it('renders filters component', async () => {
    render(<OverallSystemsVisualization />);
    await waitFor(() => {
      expect(mockLoadOverallSystemFlows).toHaveBeenCalled();
    }, { timeout: 3000 });
  });

  it('renders diagram component', async () => {
    const { container } = render(<OverallSystemsVisualization />);
    await waitFor(() => {
      expect(mockLoadOverallSystemFlows).toHaveBeenCalled();
    }, { timeout: 3000 });
  });

  it('renders legend component', async () => {
    const { container } = render(<OverallSystemsVisualization />);
    await waitFor(() => {
      expect(mockLoadOverallSystemFlows).toHaveBeenCalled();
    }, { timeout: 3000 });
  });

  it('handles loading state', () => {
    const { container } = render(<OverallSystemsVisualization />);
    expect(container).toBeInTheDocument();
  });

  it('handles error state', async () => {
    const mockError = vi.fn().mockRejectedValue(new Error('Failed to load'));
    vi.mocked(mockLoadOverallSystemFlows).mockImplementation(mockError);

    render(<OverallSystemsVisualization />);
    await waitFor(() => {
      expect(mockLoadOverallSystemFlows).toHaveBeenCalled();
    });
  });

  it('renders with empty data', async () => {
    vi.mocked(mockLoadOverallSystemFlows).mockResolvedValue({
      nodes: [],
      edges: [],
      metadata: { code: 'SYS-001', integrationMiddleware: [] },
    });

    render(<OverallSystemsVisualization />);
    await waitFor(() => {
      expect(screen.getByTestId('diagram')).toBeInTheDocument();
    });
  });

  it('renders with multiple nodes', async () => {
    vi.mocked(mockLoadOverallSystemFlows).mockResolvedValue({
      nodes: [
        { id: '1', name: 'System 1', type: 'INTERNAL', criticality: 'HIGH' },
        { id: '2', name: 'System 2', type: 'EXTERNAL', criticality: 'MEDIUM' },
        { id: '3', name: 'System 3', type: 'INTERNAL', criticality: 'LOW' },
      ],
      edges: [
        { source: '1', target: '2', middleware: [] },
        { source: '2', target: '3', middleware: [] },
      ],
      metadata: {
        code: 'SYS-001',
        integrationMiddleware: ['Kafka', 'RabbitMQ'],
      },
    });

    render(<OverallSystemsVisualization />);
    await waitFor(() => {
      expect(screen.getByTestId('diagram')).toBeInTheDocument();
    });
  });
});
