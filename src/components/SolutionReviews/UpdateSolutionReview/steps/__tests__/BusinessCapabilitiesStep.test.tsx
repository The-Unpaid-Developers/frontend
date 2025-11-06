import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import BusinessCapabilitiesStep from '../BusinessCapabilitiesStep';

vi.mock('../../../../../hooks/useBusinessCapabilities', () => ({
  useBusinessCapabilities: () => ({
    data: {
      l1Options: [{ label: 'L1', value: 'L1' }],
      getL2OptionsForL1: () => [{ label: 'L2', value: 'L2' }],
      getL3OptionsForL1AndL2: () => [{ label: 'L3', value: 'L3' }],
    },
    loading: false,
    error: null,
  }),
}));

describe('BusinessCapabilitiesStep', () => {
  const mockOnSave = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the step component', () => {
    render(<BusinessCapabilitiesStep onSave={mockOnSave} />);
    expect(screen.getAllByText(/Business Capabilities/i).length).toBeGreaterThan(0);
  });

  it('renders add button', () => {
    render(<BusinessCapabilitiesStep onSave={mockOnSave} />);
    expect(screen.getByText(/Add Capability/i)).toBeInTheDocument();
  });

  it('renders save button', () => {
    render(<BusinessCapabilitiesStep onSave={mockOnSave} />);
    expect(screen.getByText(/^Save$/)).toBeInTheDocument();
  });

  it('calls onSave when save button clicked', () => {
    render(<BusinessCapabilitiesStep onSave={mockOnSave} />);
    const saveButton = screen.getByText(/^Save$/);
    fireEvent.click(saveButton);
    expect(mockOnSave).toHaveBeenCalled();
  });

  it('renders with initial data', () => {
    const initialData = {
      businessCapabilities: [
        { id: '1', l1Capability: 'Test L1', l2Capability: 'Test L2', l3Capability: 'Test L3', remarks: 'Test' }
      ],
    };
    render(<BusinessCapabilitiesStep onSave={mockOnSave} initialData={initialData} />);
    expect(screen.getByText('Test L1')).toBeInTheDocument();
  });

  it('shows isSaving state', () => {
    render(<BusinessCapabilitiesStep onSave={mockOnSave} isSaving={true} />);
    const saveButton = screen.getByText(/Saving/i);
    expect(saveButton).toBeDisabled();
  });

  it('displays empty state initially', () => {
    render(<BusinessCapabilitiesStep onSave={mockOnSave} />);
    expect(screen.getByText(/No business capabilities added/i)).toBeInTheDocument();
  });
});
