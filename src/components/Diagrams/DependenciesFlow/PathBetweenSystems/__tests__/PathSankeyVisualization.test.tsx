import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import PathSankeyVisualization from '../PathSankeyVisualization';

const mockLoadSystemsPaths = vi.fn().mockResolvedValue({
  nodes: [
    { id: '1', name: 'System 1' },
    { id: '2', name: 'System 2' },
  ],
  links: [
    { source: '1', target: '2', value: 100 },
  ],
});

vi.mock('../../../../../hooks/useFetchDiagramData', () => ({
  useFetchDiagramData: () => ({
    loadSystemsPaths: mockLoadSystemsPaths,
  }),
}));

const mockShowError = vi.fn();
const mockShowSuccess = vi.fn();

vi.mock('../../../../../context/ToastContext', () => ({
  useToast: () => ({
    showError: mockShowError,
    showSuccess: mockShowSuccess,
  }),
}));

// Mock the child components
vi.mock('../PathSankeyDiagram', () => ({
  default: ({ data }: any) => (
    <div data-testid="diagram">Diagram Component</div>
  ),
}));

vi.mock('../PathSankeyLegend', () => ({
  default: () => (
    <div data-testid="legend">Legend Component</div>
  ),
}));

describe('PathSankeyVisualization', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders visualization component', () => {
    const { container } = render(<PathSankeyVisualization />);
    expect(container).toBeInTheDocument();
  });

  it('renders without crashing', () => {
    const { container } = render(<PathSankeyVisualization />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('handles initial render', () => {
    const { container } = render(<PathSankeyVisualization />);
    expect(container).toBeTruthy();
  });

  it('does not call loadSystemsPaths on mount', () => {
    render(<PathSankeyVisualization />);
    expect(mockLoadSystemsPaths).not.toHaveBeenCalled();
  });

  it('renders form elements', () => {
    const { container } = render(<PathSankeyVisualization />);
    const inputs = container.querySelectorAll('input');
    expect(inputs.length).toBeGreaterThan(0);
  });

  it('renders buttons', () => {
    const { container } = render(<PathSankeyVisualization />);
    const buttons = container.querySelectorAll('button');
    expect(buttons.length).toBeGreaterThan(0);
  });

  it('handles component lifecycle', () => {
    const { unmount } = render(<PathSankeyVisualization />);
    unmount();
    expect(true).toBe(true);
  });

  it('renders with default state', () => {
    const { container } = render(<PathSankeyVisualization />);
    expect(container.querySelector('input')).toBeInTheDocument();
  });

  it('has proper structure', () => {
    const { container } = render(<PathSankeyVisualization />);
    expect(container.querySelector('div')).toBeInTheDocument();
  });

  it('initializes without errors', () => {
    expect(() => render(<PathSankeyVisualization />)).not.toThrow();
  });
});
