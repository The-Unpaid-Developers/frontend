import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import DataAssetStep from '../DataAssetStep';

describe('DataAssetStep', () => {
  const mockOnSave = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the step component', () => {
    render(<DataAssetStep onSave={mockOnSave} initialData={{}} />);
    expect(screen.getAllByText(/Data Assets/i).length).toBeGreaterThan(0);
  });

  it('renders add button', () => {
    render(<DataAssetStep onSave={mockOnSave} initialData={{}} />);
    expect(screen.getByText(/Add Data Asset/i)).toBeInTheDocument();
  });

  it('renders save button', () => {
    render(<DataAssetStep onSave={mockOnSave} initialData={{}} />);
    expect(screen.getByText(/^Save$/)).toBeInTheDocument();
  });

  it('calls onSave when save button clicked', () => {
    render(<DataAssetStep onSave={mockOnSave} initialData={{}} />);
    const saveButton = screen.getByText(/^Save$/);
    fireEvent.click(saveButton);
    expect(mockOnSave).toHaveBeenCalled();
  });

  it('renders with initial data', () => {
    const initialData = {
      dataAssets: [
        {
          id: '1',
          componentName: 'Test Component',
          dataDomain: 'Test Domain',
          dataClassification: 'CONFIDENTIAL',
          dataOwnedBy: 'Test Owner',
          dataEntities: ['Entity1'],
          masteredIn: 'Test System',
        }
      ],
    };
    render(<DataAssetStep onSave={mockOnSave} initialData={initialData} />);
    expect(screen.getByText('Test Component')).toBeInTheDocument();
  });

  it('shows isSaving state', () => {
    render(<DataAssetStep onSave={mockOnSave} isSaving={true} initialData={{}} />);
    const saveButton = screen.getByText(/Saving/i);
    expect(saveButton).toBeDisabled();
  });

  it('displays empty state initially', () => {
    render(<DataAssetStep onSave={mockOnSave} initialData={{}} />);
    expect(screen.getByText(/No data assets added/i)).toBeInTheDocument();
  });
});
