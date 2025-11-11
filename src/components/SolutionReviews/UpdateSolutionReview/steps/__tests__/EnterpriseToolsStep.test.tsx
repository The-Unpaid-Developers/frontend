import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import EnterpriseToolsStep from '../EnterpriseToolsStep';

describe('EnterpriseToolsStep', () => {
  const mockOnSave = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the step component', () => {
    render(<EnterpriseToolsStep onSave={mockOnSave} initialData={{}} />);
    expect(screen.getAllByText(/Enterprise Tools/i).length).toBeGreaterThan(0);
  });

  it('renders add button', () => {
    render(<EnterpriseToolsStep onSave={mockOnSave} initialData={{}} />);
    expect(screen.getByText(/Add Tool/i)).toBeInTheDocument();
  });

  it('renders save button', () => {
    render(<EnterpriseToolsStep onSave={mockOnSave} initialData={{}} />);
    expect(screen.getByText(/^Save$/)).toBeInTheDocument();
  });

  it('calls onSave when save button clicked', () => {
    render(<EnterpriseToolsStep onSave={mockOnSave} initialData={{}} />);
    const saveButton = screen.getByText(/^Save$/);
    fireEvent.click(saveButton);
    expect(mockOnSave).toHaveBeenCalled();
  });

  it('renders with initial data', () => {
    const initialData = {
      enterpriseTools: [
        {
          id: '1',
          tool: {
            name: 'Test Tool',
            type: 'MONITORING',
          },
          onboarded: 'FULLY_ONBOARDED',
          integrationDetails: 'Test integration details',
          issues: 'No issues',
        }
      ],
    };
    render(<EnterpriseToolsStep onSave={mockOnSave} initialData={initialData} />);
    expect(screen.getByText('Test Tool')).toBeInTheDocument();
  });

  it('shows isSaving state', () => {
    render(<EnterpriseToolsStep onSave={mockOnSave} isSaving={true} initialData={{}} />);
    const saveButton = screen.getByText(/Saving/i);
    expect(saveButton).toBeDisabled();
  });

  it('displays empty state initially', () => {
    render(<EnterpriseToolsStep onSave={mockOnSave} initialData={{}} />);
    expect(screen.getByText(/No enterprise tools added/i)).toBeInTheDocument();
  });

  it('renders tool name input', () => {
    render(<EnterpriseToolsStep onSave={mockOnSave} initialData={{}} />);
    expect(screen.getByPlaceholderText(/Enter tool name/i)).toBeInTheDocument();
  });
});
