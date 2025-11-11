import React from 'react';
import { render, screen, fireEvent, within } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import OverallSystemsNewFilters from '../OverallSystemsFilters';
// Type definitions for testing
interface OverallSystemsDiagNode {
  id: string;
  name: string;
  type: string;
  criticality: string;
}

interface OverallSystemsDiagLink {
  source: OverallSystemsDiagNode;
  target: OverallSystemsDiagNode;
  count: string;
}

interface OverallSystemsDiagFilterState {
  systemSearch: string;
  systemType: string;
  criticality: string;
  role: string;
}

const mockNodes: OverallSystemsDiagNode[] = [
  {
    id: 'SYS001',
    name: 'Customer Management System',
    type: 'Core',
    criticality: 'Major',
  },
  {
    id: 'SYS002',
    name: 'Order Processing System',
    type: 'Business',
    criticality: 'Standard-1',
  },
  {
    id: 'SYS003',
    name: 'Payment Gateway',
    type: 'Integration',
    criticality: 'Standard-2',
  },
];

const mockNode1 = mockNodes[0];
const mockNode2 = mockNodes[1];
const mockNode3 = mockNodes[2];

const mockLinks: OverallSystemsDiagLink[] = [
  {
    source: mockNode1,
    target: mockNode2,
    count: '15',
  },
  {
    source: mockNode2,
    target: mockNode3,
    count: '8',
  },
];

const defaultFilters: OverallSystemsDiagFilterState = {
  systemSearch: '',
  systemType: 'All',
  criticality: 'All',
  role: 'All',
};

const mockProps = {
  filters: defaultFilters,
  onFiltersChange: vi.fn(),
  onApplyFilters: vi.fn(),
  onResetFilters: vi.fn(),
  originalNodes: mockNodes,
  originalLinks: mockLinks,
};

describe('OverallSystemsNewFilters', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Component Rendering', () => {
    it('renders without crashing', () => {
      const { container } = render(<OverallSystemsNewFilters {...mockProps} />);
      expect(container).toBeInTheDocument();
    });

    it('renders the filters title', () => {
      render(<OverallSystemsNewFilters {...mockProps} />);
      expect(screen.getByText('Filters')).toBeInTheDocument();
    });

    it('renders system search input', () => {
      render(<OverallSystemsNewFilters {...mockProps} />);
      expect(screen.getByLabelText('Filter by System Name/Code')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Search systems...')).toBeInTheDocument();
    });

    it('renders system type dropdown', () => {
      render(<OverallSystemsNewFilters {...mockProps} />);
      expect(screen.getByLabelText('System Type')).toBeInTheDocument();
    });

    it('renders criticality dropdown', () => {
      render(<OverallSystemsNewFilters {...mockProps} />);
      expect(screen.getByLabelText('Criticality')).toBeInTheDocument();
    });

    it('renders role dropdown', () => {
      render(<OverallSystemsNewFilters {...mockProps} />);
      expect(screen.getByLabelText('Role')).toBeInTheDocument();
    });

    it('renders action buttons', () => {
      render(<OverallSystemsNewFilters {...mockProps} />);
      expect(screen.getByRole('button', { name: 'Apply Filters' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Reset All' })).toBeInTheDocument();
    });

    it('has correct container structure', () => {
      const { container } = render(<OverallSystemsNewFilters {...mockProps} />);
      const wrapper = container.firstChild;
      expect(wrapper).toHaveClass('bg-white', 'rounded-xl', 'shadow-lg');
    });
  });

  describe('Filter Values Display', () => {
    it('displays current filter values', () => {
      const filtersWithValues: OverallSystemsDiagFilterState = {
        systemSearch: 'Customer',
        systemType: 'Core',
        criticality: 'Major',
        role: 'Producer',
      };
      
      render(<OverallSystemsNewFilters {...mockProps} filters={filtersWithValues} />);
      
      expect(screen.getByDisplayValue('Customer')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Core')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Major')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Producer')).toBeInTheDocument();
    });

  it('displays default values when no filters are set', () => {
    const props = {
      ...mockProps,
      filters: {
        systemSearch: '',
        systemType: 'All',
        criticality: 'All',
        role: 'All'
      }
    };
    
    render(<OverallSystemsNewFilters {...props} />);
    
    expect(screen.getByDisplayValue('')).toBeInTheDocument(); // search input
    
    // Check each dropdown individually by their labels
    const systemTypeSelect = screen.getByLabelText('System Type');
    const criticalitySelect = screen.getByLabelText('Criticality');
    const roleSelect = screen.getByLabelText('Role');
    
    expect(systemTypeSelect).toHaveValue('All');
    expect(criticalitySelect).toHaveValue('All');
    expect(roleSelect).toHaveValue('All');
  });

  it('shows empty search when search filter is empty', () => {
      render(<OverallSystemsNewFilters {...mockProps} />);
      const searchInput = screen.getByLabelText('Filter by System Name/Code');
      expect(searchInput).toHaveValue('');
    });
  });

  describe('Dynamic Options Generation', () => {
    it('generates system type options from nodes', () => {
      render(<OverallSystemsNewFilters {...mockProps} />);
      const systemTypeSelect = screen.getByLabelText('System Type');
      
      // Check that options include "All" plus unique types from nodes
      expect(systemTypeSelect).toBeInTheDocument();
      
      // Check options are present in the select by their values
      within(systemTypeSelect).getByRole('option', { name: 'All' });
      within(systemTypeSelect).getByRole('option', { name: 'Core' });
      within(systemTypeSelect).getByRole('option', { name: 'Business' });
      within(systemTypeSelect).getByRole('option', { name: 'Integration' });
    });

    it('generates criticality options from nodes', () => {
      render(<OverallSystemsNewFilters {...mockProps} />);
      const criticalitySelect = screen.getByLabelText('Criticality');
      
      // Check options are present in the select
      within(criticalitySelect).getByRole('option', { name: 'All' });
      within(criticalitySelect).getByRole('option', { name: 'Major' });
      within(criticalitySelect).getByRole('option', { name: 'Standard-1' });
      within(criticalitySelect).getByRole('option', { name: 'Standard-2' });
    });

    it('handles empty nodes array', () => {
      const propsWithEmptyNodes = {
        ...mockProps,
        originalNodes: [],
      };
      
      render(<OverallSystemsNewFilters {...propsWithEmptyNodes} />);
      
      const systemTypeSelect = screen.getByLabelText('System Type');
      // Should still have the "All" option
      within(systemTypeSelect).getByRole('option', { name: 'All' });
    });

    it('handles duplicate types in nodes', () => {
      const nodesWithDuplicates: OverallSystemsDiagNode[] = [
        { id: 'SYS1', name: 'System 1', type: 'Core', criticality: 'Major' },
        { id: 'SYS2', name: 'System 2', type: 'Core', criticality: 'Major' },
        { id: 'SYS3', name: 'System 3', type: 'Business', criticality: 'Standard-1' },
      ];
      
      const propsWithDuplicates = {
        ...mockProps,
        originalNodes: nodesWithDuplicates,
      };
      
      render(<OverallSystemsNewFilters {...propsWithDuplicates} />);
      
      const systemTypeSelect = screen.getByLabelText('System Type');
      fireEvent.mouseDown(systemTypeSelect);
      
      // Should only show unique types
      const coreOptions = screen.getAllByText('Core');
      expect(coreOptions).toHaveLength(1);
    });
  });

  describe('User Interactions', () => {
    it('calls onFiltersChange when search input changes', () => {
      render(<OverallSystemsNewFilters {...mockProps} />);
      
      const searchInput = screen.getByLabelText('Filter by System Name/Code');
      fireEvent.change(searchInput, { target: { value: 'Customer' } });
      
      expect(mockProps.onFiltersChange).toHaveBeenCalledWith({
        ...defaultFilters,
        systemSearch: 'Customer',
      });
    });

    it('calls onFiltersChange when system type changes', () => {
      render(<OverallSystemsNewFilters {...mockProps} />);
      
      const systemTypeSelect = screen.getByLabelText('System Type');
      fireEvent.change(systemTypeSelect, { target: { value: 'Core' } });
      
      expect(mockProps.onFiltersChange).toHaveBeenCalledWith({
        ...defaultFilters,
        systemType: 'Core',
      });
    });

    it('calls onFiltersChange when criticality changes', () => {
      render(<OverallSystemsNewFilters {...mockProps} />);
      
      const criticalitySelect = screen.getByLabelText('Criticality');
      fireEvent.change(criticalitySelect, { target: { value: 'Major' } });
      
      expect(mockProps.onFiltersChange).toHaveBeenCalledWith({
        ...defaultFilters,
        criticality: 'Major',
      });
    });

    it('calls onFiltersChange when role changes', () => {
      render(<OverallSystemsNewFilters {...mockProps} />);
      
      const roleSelect = screen.getByLabelText('Role');
      fireEvent.change(roleSelect, { target: { value: 'Producer' } });
      
      expect(mockProps.onFiltersChange).toHaveBeenCalledWith({
        ...defaultFilters,
        role: 'Producer',
      });
    });

    it('calls onApplyFilters when Apply Filters button is clicked', () => {
      render(<OverallSystemsNewFilters {...mockProps} />);
      
      const applyButton = screen.getByRole('button', { name: 'Apply Filters' });
      fireEvent.click(applyButton);
      
      expect(mockProps.onApplyFilters).toHaveBeenCalledTimes(1);
    });

    it('calls onResetFilters when Reset All button is clicked', () => {
      render(<OverallSystemsNewFilters {...mockProps} />);
      
      const resetButton = screen.getByRole('button', { name: 'Reset All' });
      fireEvent.click(resetButton);
      
      expect(mockProps.onResetFilters).toHaveBeenCalledTimes(1);
    });
  });

  describe('Accessibility', () => {
    it('has proper labels for all form inputs', () => {
      render(<OverallSystemsNewFilters {...mockProps} />);
      
      expect(screen.getByLabelText('Filter by System Name/Code')).toBeInTheDocument();
      expect(screen.getByLabelText('System Type')).toBeInTheDocument();
      expect(screen.getByLabelText('Criticality')).toBeInTheDocument();
      expect(screen.getByLabelText('Role')).toBeInTheDocument();
    });

    it('has proper form element structure', () => {
      render(<OverallSystemsNewFilters {...mockProps} />);
      
      const searchInput = screen.getByLabelText('Filter by System Name/Code');
      expect(searchInput).toHaveAttribute('type', 'text');
      expect(searchInput).toHaveAttribute('id', 'system-search');
      
      const systemTypeSelect = screen.getByLabelText('System Type');
      expect(systemTypeSelect.tagName).toBe('SELECT');
      expect(systemTypeSelect).toHaveAttribute('id', 'system-type-filter');
    });

    it('supports keyboard navigation', () => {
      render(<OverallSystemsNewFilters {...mockProps} />);
      
      const searchInput = screen.getByLabelText('Filter by System Name/Code');
      searchInput.focus();
      expect(document.activeElement).toBe(searchInput);
    });

    it('has accessible button roles', () => {
      render(<OverallSystemsNewFilters {...mockProps} />);
      
      const applyButton = screen.getByRole('button', { name: 'Apply Filters' });
      const resetButton = screen.getByRole('button', { name: 'Reset All' });
      
      expect(applyButton).toBeInTheDocument();
      expect(resetButton).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('handles special characters in search input', () => {
      render(<OverallSystemsNewFilters {...mockProps} />);
      
      const searchInput = screen.getByLabelText('Filter by System Name/Code');
      fireEvent.change(searchInput, { target: { value: 'System & <Special> "Chars"' } });
      
      expect(mockProps.onFiltersChange).toHaveBeenCalledWith({
        ...defaultFilters,
        systemSearch: 'System & <Special> "Chars"',
      });
    });

    it('handles very long search input', () => {
      render(<OverallSystemsNewFilters {...mockProps} />);
      
      const longSearchTerm = 'A'.repeat(1000);
      const searchInput = screen.getByLabelText('Filter by System Name/Code');
      fireEvent.change(searchInput, { target: { value: longSearchTerm } });
      
      expect(mockProps.onFiltersChange).toHaveBeenCalledWith({
        ...defaultFilters,
        systemSearch: longSearchTerm,
      });
    });

    it('handles rapid filter changes', () => {
      render(<OverallSystemsNewFilters {...mockProps} />);
      
      const searchInput = screen.getByLabelText('Filter by System Name/Code');
      
      // Simulate rapid typing
      fireEvent.change(searchInput, { target: { value: 'C' } });
      fireEvent.change(searchInput, { target: { value: 'Cu' } });
      fireEvent.change(searchInput, { target: { value: 'Cus' } });
      
      expect(mockProps.onFiltersChange).toHaveBeenCalledTimes(3);
    });

    it('maintains state with malformed props', () => {
      const malformedProps = {
        ...mockProps,
        originalNodes: [],
        originalLinks: [],
        nodes: []
      };
      
      // Should not crash even with empty arrays
      expect(() => {
        render(<OverallSystemsNewFilters {...malformedProps} />);
      }).not.toThrow();
      
      // Should still render basic structure
      expect(screen.getByText('Filters')).toBeInTheDocument();
    });
  });

  describe('Button Styling and States', () => {
    it('applies correct CSS classes to buttons', () => {
      render(<OverallSystemsNewFilters {...mockProps} />);
      
      const applyButton = screen.getByRole('button', { name: 'Apply Filters' });
      expect(applyButton).toHaveClass('bg-green-600', 'text-white', 'font-bold');
      
      const resetButton = screen.getByRole('button', { name: 'Reset All' });
      expect(resetButton).toHaveClass('bg-blue-600', 'text-white', 'font-bold');
    });

    it('applies focus styles to form controls', () => {
      render(<OverallSystemsNewFilters {...mockProps} />);
      
      const searchInput = screen.getByLabelText('Filter by System Name/Code');
      expect(searchInput).toHaveClass('focus:ring-blue-500', 'focus:border-blue-500');
    });

    it('has proper button layout', () => {
      const { container } = render(<OverallSystemsNewFilters {...mockProps} />);
      
      const buttonContainer = container.querySelector('.flex.space-x-2');
      expect(buttonContainer).toBeInTheDocument();
      expect(buttonContainer).toHaveClass('border-t', 'pt-4');
    });
  });
});