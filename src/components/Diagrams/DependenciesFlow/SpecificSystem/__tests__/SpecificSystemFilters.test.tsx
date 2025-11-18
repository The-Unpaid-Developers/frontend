import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import SankeyFilters from '../SpecificSystemFilters';
import type { FilterState, Node, Link } from '../../../../../types/diagrams';

describe('SpecificSystemFilters (SankeyFilters)', () => {
  const mockOnFiltersChange = vi.fn();
  const mockOnApplyFilters = vi.fn();
  const mockOnResetFilters = vi.fn();

  const defaultFilters: FilterState = {
    systemSearch: '',
    systemType: 'All',
    connectionType: 'All',
    criticality: 'All',
    frequency: 'All',
    role: 'All',
  };

  const mockNodes: Node[] = [
    { id: '1', name: 'System 1', type: 'Application', criticality: 'Major' },
    { id: '2', name: 'System 2', type: 'Database', criticality: 'Standard-1' },
    { id: '3', name: 'System 3', type: 'Service', criticality: 'Standard-2' },
  ];

  const mockLinks: Link[] = [
    { source: '1', target: '2', value: 1, pattern: 'API', frequency: 'Daily', role: 'Producer' },
    { source: '2', target: '3', value: 1, pattern: 'Batch', frequency: 'Weekly', role: 'Consumer' },
    { source: '1', target: '3', value: 1, pattern: 'Web Service', frequency: 'Hourly', role: 'Producer' },
  ];

  const defaultProps = {
    filters: defaultFilters,
    onFiltersChange: mockOnFiltersChange,
    onApplyFilters: mockOnApplyFilters,
    onResetFilters: mockOnResetFilters,
    originalNodes: mockNodes,
    originalLinks: mockLinks,
    pinnedSystemId: 'SYS-001',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders the filters panel', () => {
      render(<SankeyFilters {...defaultProps} />);

      expect(screen.getByText('Filters')).toBeInTheDocument();
    });

    it('renders all filter inputs', () => {
      render(<SankeyFilters {...defaultProps} />);

      expect(screen.getByLabelText(/filter by system name\/code/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/system type/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/connection type/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/criticality/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/role to/i)).toBeInTheDocument();
    });

    it('renders action buttons', () => {
      render(<SankeyFilters {...defaultProps} />);

      expect(screen.getByText('Apply Filters')).toBeInTheDocument();
      expect(screen.getByText('Reset All')).toBeInTheDocument();
    });

    it('displays pinned system ID in role label', () => {
      render(<SankeyFilters {...defaultProps} />);

      expect(screen.getByText('Role to SYS-001')).toBeInTheDocument();
    });
  });

  describe('System Search Input', () => {
    it('displays current search value', () => {
      const propsWithSearch = {
        ...defaultProps,
        filters: { ...defaultFilters, systemSearch: 'test search' },
      };

      render(<SankeyFilters {...propsWithSearch} />);

      const searchInput = screen.getByLabelText(/filter by system name\/code/i) as HTMLInputElement;
      expect(searchInput.value).toBe('test search');
    });

    it('calls onFiltersChange when search text changes', () => {
      render(<SankeyFilters {...defaultProps} />);

      const searchInput = screen.getByLabelText(/filter by system name\/code/i);
      fireEvent.change(searchInput, { target: { value: 'new search' } });

      expect(mockOnFiltersChange).toHaveBeenCalledWith({
        ...defaultFilters,
        systemSearch: 'new search',
      });
    });

    it('handles empty search input', () => {
      const propsWithSearch = {
        ...defaultProps,
        filters: { ...defaultFilters, systemSearch: 'existing' },
      };

      render(<SankeyFilters {...propsWithSearch} />);

      const searchInput = screen.getByLabelText(/filter by system name\/code/i);
      fireEvent.change(searchInput, { target: { value: '' } });

      expect(mockOnFiltersChange).toHaveBeenCalledWith({
        ...defaultFilters,
        systemSearch: '',
      });
    });
  });

  describe('System Type Filter', () => {
    it('displays all unique system types', () => {
      render(<SankeyFilters {...defaultProps} />);

      const select = screen.getByLabelText(/system type/i) as HTMLSelectElement;
      const options = Array.from(select.options).map(opt => opt.value);

      expect(options).toContain('All');
      expect(options).toContain('Application');
      expect(options).toContain('Database');
      expect(options).toContain('Service');
    });

    it('displays current system type value', () => {
      const propsWithType = {
        ...defaultProps,
        filters: { ...defaultFilters, systemType: 'Application' },
      };

      render(<SankeyFilters {...propsWithType} />);

      const select = screen.getByLabelText(/system type/i) as HTMLSelectElement;
      expect(select.value).toBe('Application');
    });

    it('calls onFiltersChange when system type changes', () => {
      render(<SankeyFilters {...defaultProps} />);

      const select = screen.getByLabelText(/system type/i);
      fireEvent.change(select, { target: { value: 'Database' } });

      expect(mockOnFiltersChange).toHaveBeenCalledWith({
        ...defaultFilters,
        systemType: 'Database',
      });
    });
  });

  describe('Connection Type Filter', () => {
    it('displays all unique connection types', () => {
      render(<SankeyFilters {...defaultProps} />);

      const select = screen.getByLabelText(/connection type/i) as HTMLSelectElement;
      const options = Array.from(select.options).map(opt => opt.value);

      expect(options).toContain('All');
      expect(options).toContain('API');
      expect(options).toContain('Batch');
      expect(options).toContain('Web Service');
    });

    it('calls onFiltersChange when connection type changes', () => {
      render(<SankeyFilters {...defaultProps} />);

      const select = screen.getByLabelText(/connection type/i);
      fireEvent.change(select, { target: { value: 'API' } });

      expect(mockOnFiltersChange).toHaveBeenCalledWith({
        ...defaultFilters,
        connectionType: 'API',
      });
    });
  });

  describe('Criticality Filter', () => {
    it('displays all unique criticality levels', () => {
      render(<SankeyFilters {...defaultProps} />);

      const select = screen.getByLabelText(/criticality/i) as HTMLSelectElement;
      const options = Array.from(select.options).map(opt => opt.value);

      expect(options).toContain('All');
      expect(options).toContain('Major');
      expect(options).toContain('Standard-1');
      expect(options).toContain('Standard-2');
    });

    it('calls onFiltersChange when criticality changes', () => {
      render(<SankeyFilters {...defaultProps} />);

      const select = screen.getByLabelText(/criticality/i);
      fireEvent.change(select, { target: { value: 'Major' } });

      expect(mockOnFiltersChange).toHaveBeenCalledWith({
        ...defaultFilters,
        criticality: 'Major',
      });
    });
  });

  describe('Role Filter', () => {
    it('displays predefined role options', () => {
      render(<SankeyFilters {...defaultProps} />);

      const select = screen.getByLabelText(/role to/i) as HTMLSelectElement;
      const options = Array.from(select.options).map(opt => opt.value);

      expect(options).toContain('All');
      expect(options).toContain('Producer');
      expect(options).toContain('Consumer');
      expect(options).toHaveLength(3);
    });

    it('calls onFiltersChange when role changes', () => {
      render(<SankeyFilters {...defaultProps} />);

      const select = screen.getByLabelText(/role to/i);
      fireEvent.change(select, { target: { value: 'Producer' } });

      expect(mockOnFiltersChange).toHaveBeenCalledWith({
        ...defaultFilters,
        role: 'Producer',
      });
    });
  });

  describe('Action Buttons', () => {
    it('calls onApplyFilters when Apply Filters button is clicked', () => {
      render(<SankeyFilters {...defaultProps} />);

      const applyButton = screen.getByText('Apply Filters');
      fireEvent.click(applyButton);

      expect(mockOnApplyFilters).toHaveBeenCalled();
    });

    it('calls onResetFilters when Reset All button is clicked', () => {
      render(<SankeyFilters {...defaultProps} />);

      const resetButton = screen.getByText('Reset All');
      fireEvent.click(resetButton);

      expect(mockOnResetFilters).toHaveBeenCalled();
    });
  });

  describe('Edge Cases', () => {
    it('handles empty nodes array', () => {
      const propsWithEmptyNodes = {
        ...defaultProps,
        originalNodes: [],
      };

      render(<SankeyFilters {...propsWithEmptyNodes} />);

      const systemTypeSelect = screen.getByLabelText(/system type/i) as HTMLSelectElement;
      const options = Array.from(systemTypeSelect.options);

      expect(options).toHaveLength(1);
      expect(options[0].value).toBe('All');
    });

    it('handles empty links array', () => {
      const propsWithEmptyLinks = {
        ...defaultProps,
        originalLinks: [],
      };

      render(<SankeyFilters {...propsWithEmptyLinks} />);

      const connectionTypeSelect = screen.getByLabelText(/connection type/i) as HTMLSelectElement;
      const options = Array.from(connectionTypeSelect.options);

      expect(options).toHaveLength(1);
      expect(options[0].value).toBe('All');
    });

    it('handles nodes with duplicate types', () => {
      const duplicateNodes: Node[] = [
        { id: '1', name: 'System 1', type: 'Application', criticality: 'Major' },
        { id: '2', name: 'System 2', type: 'Application', criticality: 'Major' },
        { id: '3', name: 'System 3', type: 'Application', criticality: 'Major' },
      ];

      const propsWithDuplicates = {
        ...defaultProps,
        originalNodes: duplicateNodes,
      };

      render(<SankeyFilters {...propsWithDuplicates} />);

      const select = screen.getByLabelText(/system type/i) as HTMLSelectElement;
      const options = Array.from(select.options).map(opt => opt.value);

      expect(options).toEqual(['All', 'Application']);
    });

    it('handles different pinned system IDs', () => {
      const { rerender } = render(<SankeyFilters {...defaultProps} />);

      expect(screen.getByText('Role to SYS-001')).toBeInTheDocument();

      rerender(<SankeyFilters {...defaultProps} pinnedSystemId="SYS-999" />);

      expect(screen.getByText('Role to SYS-999')).toBeInTheDocument();
    });

    it('preserves filter values across renders', () => {
      const customFilters: FilterState = {
        systemSearch: 'custom search',
        systemType: 'Database',
        connectionType: 'API',
        criticality: 'Major',
        frequency: 'Daily',
        role: 'Producer',
      };

      const { rerender } = render(
        <SankeyFilters {...defaultProps} filters={customFilters} />
      );

      const searchInput = screen.getByLabelText(/filter by system name\/code/i) as HTMLInputElement;
      const systemTypeSelect = screen.getByLabelText(/system type/i) as HTMLSelectElement;
      const connectionTypeSelect = screen.getByLabelText(/connection type/i) as HTMLSelectElement;

      expect(searchInput.value).toBe('custom search');
      expect(systemTypeSelect.value).toBe('Database');
      expect(connectionTypeSelect.value).toBe('API');

      rerender(<SankeyFilters {...defaultProps} filters={customFilters} />);

      expect(searchInput.value).toBe('custom search');
      expect(systemTypeSelect.value).toBe('Database');
      expect(connectionTypeSelect.value).toBe('API');
    });
  });

  describe('Accessibility', () => {
    it('has proper labels for all inputs', () => {
      render(<SankeyFilters {...defaultProps} />);

      expect(screen.getByLabelText(/filter by system name\/code/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/system type/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/connection type/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/criticality/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/role to/i)).toBeInTheDocument();
    });

    it('has unique IDs for form controls', () => {
      render(<SankeyFilters {...defaultProps} />);

      expect(screen.getByLabelText(/filter by system name\/code/i)).toHaveAttribute('id', 'system-search');
      expect(screen.getByLabelText(/system type/i)).toHaveAttribute('id', 'system-type-filter');
      expect(screen.getByLabelText(/connection type/i)).toHaveAttribute('id', 'connection-type-filter');
      expect(screen.getByLabelText(/criticality/i)).toHaveAttribute('id', 'criticality-filter');
      expect(screen.getByLabelText(/role to/i)).toHaveAttribute('id', 'role-filter');
    });
  });

  describe('Component Structure', () => {
    it('renders without crashing', () => {
      expect(() => {
        render(<SankeyFilters {...defaultProps} />);
      }).not.toThrow();
    });

    it('applies proper CSS classes to main container', () => {
      const { container } = render(<SankeyFilters {...defaultProps} />);

      const mainDiv = container.firstChild as HTMLElement;
      expect(mainDiv.className).toContain('lg:col-span-3');
      expect(mainDiv.className).toContain('bg-white');
      expect(mainDiv.className).toContain('rounded-xl');
    });
  });
});
