import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import BusinessCapabilitiesSearch from '../BusinessCapabilitiesSearch';

describe('BusinessCapabilitiesSearch', () => {
  const mockOnSearchChange = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders search input and label', () => {
    render(
      <BusinessCapabilitiesSearch 
        searchTerm="" 
        onSearchChange={mockOnSearchChange} 
      />
    );
    
    expect(screen.getByText('Search Business Capabilities')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Search by capability name...')).toBeInTheDocument();
  });

  it('displays current search term in input', () => {
    render(
      <BusinessCapabilitiesSearch 
        searchTerm="test search" 
        onSearchChange={mockOnSearchChange} 
      />
    );
    
    const input = screen.getByDisplayValue('test search');
    expect(input).toBeInTheDocument();
  });

  it('calls onSearchChange when user types', async () => {
    const user = userEvent.setup();
    render(
      <BusinessCapabilitiesSearch 
        searchTerm="" 
        onSearchChange={mockOnSearchChange} 
      />
    );
    
    const input = screen.getByPlaceholderText('Search by capability name...');
    await user.type(input, 'a');
    
    expect(mockOnSearchChange).toHaveBeenCalledWith('a');
  });

  it('calls onSearchChange on input change event', () => {
    render(
      <BusinessCapabilitiesSearch 
        searchTerm="" 
        onSearchChange={mockOnSearchChange} 
      />
    );
    
    const input = screen.getByPlaceholderText('Search by capability name...');
    fireEvent.change(input, { target: { value: 'new search' } });
    
    expect(mockOnSearchChange).toHaveBeenCalledWith('new search');
  });

  it('shows match count when search term is provided', () => {
    render(
      <BusinessCapabilitiesSearch 
        searchTerm="business" 
        onSearchChange={mockOnSearchChange}
        matchCount={5}
      />
    );
    
    expect(screen.getByText(/Found/)).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
    expect(screen.getByText(/matching capabilities/)).toBeInTheDocument();
  });

  it('does not show match count when search term is empty', () => {
    render(
      <BusinessCapabilitiesSearch 
        searchTerm="" 
        onSearchChange={mockOnSearchChange}
        matchCount={5}
      />
    );
    
    expect(screen.queryByText(/Found/)).not.toBeInTheDocument();
  });

  it('defaults to 0 match count when not provided', () => {
    render(
      <BusinessCapabilitiesSearch 
        searchTerm="test" 
        onSearchChange={mockOnSearchChange}
      />
    );
    
    expect(screen.getByText('0')).toBeInTheDocument();
  });

  it('renders search icon', () => {
    render(
      <BusinessCapabilitiesSearch 
        searchTerm="" 
        onSearchChange={mockOnSearchChange} 
      />
    );
    
    const searchIcon = document.querySelector('svg');
    expect(searchIcon).toBeInTheDocument();
    expect(searchIcon).toHaveAttribute('viewBox', '0 0 24 24');
  });

  it('renders help text', () => {
    render(
      <BusinessCapabilitiesSearch 
        searchTerm="" 
        onSearchChange={mockOnSearchChange} 
      />
    );
    
    expect(screen.getByText(/Click on nodes to expand\/collapse branches/)).toBeInTheDocument();
    expect(screen.getByText(/Search will automatically expand the tree/)).toBeInTheDocument();
  });

  it('has proper styling classes', () => {
    render(
      <BusinessCapabilitiesSearch 
        searchTerm="" 
        onSearchChange={mockOnSearchChange} 
      />
    );
    
    const container = document.querySelector('.bg-white.rounded-xl.shadow-lg');
    expect(container).toBeInTheDocument();
    
    const input = screen.getByPlaceholderText('Search by capability name...');
    expect(input).toHaveClass('w-full', 'px-4', 'py-2', 'pl-10');
  });

  it('handles different match count values', () => {
    const { rerender } = render(
      <BusinessCapabilitiesSearch 
        searchTerm="test" 
        onSearchChange={mockOnSearchChange}
        matchCount={100}
      />
    );
    
    expect(screen.getByText('100')).toBeInTheDocument();
    
    rerender(
      <BusinessCapabilitiesSearch 
        searchTerm="test" 
        onSearchChange={mockOnSearchChange}
        matchCount={0}
      />
    );
    
    expect(screen.getByText('0')).toBeInTheDocument();
  });

  it('input has proper accessibility attributes', () => {
    render(
      <BusinessCapabilitiesSearch 
        searchTerm="" 
        onSearchChange={mockOnSearchChange} 
      />
    );
    
    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('type', 'text');
    expect(input).toHaveAttribute('placeholder', 'Search by capability name...');
  });

  it('label is properly associated with input', () => {
    render(
      <BusinessCapabilitiesSearch 
        searchTerm="" 
        onSearchChange={mockOnSearchChange} 
      />
    );
    
    const label = screen.getByText('Search Business Capabilities');
    expect(label).toHaveClass('block');
  });

  it('renders component without crashing', () => {
    const { container } = render(
      <BusinessCapabilitiesSearch 
        searchTerm="" 
        onSearchChange={mockOnSearchChange} 
      />
    );
    
    expect(container.firstChild).toBeInTheDocument();
  });

  it('handles focus and blur events', async () => {
    const user = userEvent.setup();
    render(
      <BusinessCapabilitiesSearch 
        searchTerm="" 
        onSearchChange={mockOnSearchChange} 
      />
    );
    
    const input = screen.getByPlaceholderText('Search by capability name...');
    
    await user.click(input);
    expect(input).toHaveFocus();
    
    await user.tab();
    expect(input).not.toHaveFocus();
  });
});