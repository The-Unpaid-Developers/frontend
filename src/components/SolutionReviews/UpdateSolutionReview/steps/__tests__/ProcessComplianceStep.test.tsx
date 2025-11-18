import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import ProcessComplianceStep from '../ProcessComplianceStep';

describe('ProcessComplianceStep', () => {
  const mockOnSave = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the step component', () => {
    render(<ProcessComplianceStep onSave={mockOnSave} initialData={{}} />);
    expect(screen.getAllByText(/Add Process Compliance/i).length).toBeGreaterThan(0);
  });

  it('renders add button', () => {
    render(<ProcessComplianceStep onSave={mockOnSave} initialData={{}} />);
    expect(screen.getByText(/Add Compliance/i)).toBeInTheDocument();
  });

  it('renders save button', () => {
    render(<ProcessComplianceStep onSave={mockOnSave} initialData={{}} />);
    expect(screen.getByText(/^Save$/)).toBeInTheDocument();
  });

  it('calls onSave when save button clicked', () => {
    render(<ProcessComplianceStep onSave={mockOnSave} initialData={{}} />);
    const saveButton = screen.getByText(/^Save$/);
    fireEvent.click(saveButton);
    expect(mockOnSave).toHaveBeenCalled();
  });

  it('displays empty state initially', () => {
    render(<ProcessComplianceStep onSave={mockOnSave} initialData={{}} />);
    expect(screen.getByText(/No process compliances added yet/i)).toBeInTheDocument();
  });

  it('shows isSaving state', () => {
    render(<ProcessComplianceStep onSave={mockOnSave} isSaving={true} initialData={{}} />);
    const saveButton = screen.getByText(/Saving/i);
    expect(saveButton).toBeDisabled();
  });

  it('renders with initial data', () => {
    const initialData = {
      processCompliances: [
        {
          id: '1',
          standardGuideline: 'GDPR',
          compliant: 'Yes',
          description: 'Data protection compliance',
        }
      ],
    };
    render(<ProcessComplianceStep onSave={mockOnSave} initialData={initialData} />);
    expect(screen.getByText('GDPR')).toBeInTheDocument();
  });

  it('renders multiple compliances', () => {
    const initialData = {
      processCompliances: [
        {
          id: '1',
          standardGuideline: 'GDPR',
          compliant: 'Yes',
          description: 'Data protection',
        },
        {
          id: '2',
          standardGuideline: 'SOC2',
          compliant: 'No',
          description: 'Security controls',
        },
      ],
    };
    render(<ProcessComplianceStep onSave={mockOnSave} initialData={initialData} />);
    expect(screen.getByText('GDPR')).toBeInTheDocument();
    expect(screen.getByText('SOC2')).toBeInTheDocument();
  });

  it('add button is disabled when fields are empty', () => {
    render(<ProcessComplianceStep onSave={mockOnSave} initialData={{}} />);
    const addButton = screen.getByText(/Add Compliance/i);
    expect(addButton).toBeDisabled();
  });

  it('displays compliance count', () => {
    const initialData = {
      processCompliances: [
        { id: '1', standardGuideline: 'GDPR', compliant: 'Yes', description: 'Test' },
        { id: '2', standardGuideline: 'SOC2', compliant: 'No', description: 'Test' },
      ],
    };
    render(<ProcessComplianceStep onSave={mockOnSave} initialData={initialData} />);
    expect(screen.getByText(/Process Compliances \(2\)/i)).toBeInTheDocument();
  });

  it('renders description field with empty state dash', () => {
    const initialData = {
      processCompliances: [
        { id: '1', standardGuideline: 'GDPR', compliant: 'Yes' },
      ],
    };
    render(<ProcessComplianceStep onSave={mockOnSave} initialData={initialData} />);
    expect(screen.getByText('—')).toBeInTheDocument();
  });

  it('renders edit and delete buttons for each compliance', () => {
    const initialData = {
      processCompliances: [
        { id: '1', standardGuideline: 'GDPR', compliant: 'Yes', description: 'Test' },
      ],
    };
    render(<ProcessComplianceStep onSave={mockOnSave} initialData={initialData} />);
    const editButtons = screen.getAllByTitle('Edit');
    const deleteButtons = screen.getAllByTitle('Delete');
    expect(editButtons.length).toBeGreaterThan(0);
    expect(deleteButtons.length).toBeGreaterThan(0);
  });

  it('enters edit mode when edit button clicked', () => {
    const initialData = {
      processCompliances: [
        { id: '1', standardGuideline: 'GDPR', compliant: 'Yes', description: 'Test' },
      ],
    };
    render(<ProcessComplianceStep onSave={mockOnSave} initialData={initialData} />);
    const editButton = screen.getByTitle('Edit');
    fireEvent.click(editButton);
    expect(screen.getByRole('button', { name: /Update Compliance/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Cancel/i })).toBeInTheDocument();
  });

  it('exits edit mode when cancel button clicked', () => {
    const initialData = {
      processCompliances: [
        { id: '1', standardGuideline: 'GDPR', compliant: 'Yes', description: 'Test' },
      ],
    };
    render(<ProcessComplianceStep onSave={mockOnSave} initialData={initialData} />);
    const editButton = screen.getByTitle('Edit');
    fireEvent.click(editButton);
    const cancelButton = screen.getByRole('button', { name: /Cancel/i });
    fireEvent.click(cancelButton);
    expect(screen.queryByRole('button', { name: /Update Compliance/i })).not.toBeInTheDocument();
  });
});
