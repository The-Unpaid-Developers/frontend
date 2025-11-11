import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import IntegrationFlowStep from '../IntegrationFlowStep';

describe('IntegrationFlowStep', () => {
  const mockOnSave = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the step component', () => {
    render(<IntegrationFlowStep onSave={mockOnSave} initialData={{}} />);
    expect(screen.getAllByText(/Integration Flow/i).length).toBeGreaterThan(0);
  });

  it('renders add button', () => {
    render(<IntegrationFlowStep onSave={mockOnSave} initialData={{}} />);
    expect(screen.getByText(/Add Flow/i)).toBeInTheDocument();
  });

  it('renders save button', () => {
    render(<IntegrationFlowStep onSave={mockOnSave} initialData={{}} />);
    expect(screen.getByText(/^Save$/)).toBeInTheDocument();
  });

  it('calls onSave when save button clicked', () => {
    render(<IntegrationFlowStep onSave={mockOnSave} initialData={{}} />);
    const saveButton = screen.getByText(/^Save$/);
    fireEvent.click(saveButton);
    expect(mockOnSave).toHaveBeenCalled();
  });

  it('renders with initial data', () => {
    const initialData = {
      integrationFlows: [
        {
          id: '1',
          componentName: 'Test Component',
          counterpartSystemCode: 'SYS-001',
          counterpartSystemRole: 'CONSUMER',
          integrationMethod: 'REST_API',
          frequency: 'REAL_TIME',
          purpose: 'Test Purpose',
        }
      ],
    };
    render(<IntegrationFlowStep onSave={mockOnSave} initialData={initialData} />);
    expect(screen.getByText('Test Component')).toBeInTheDocument();
  });

  it('shows isSaving state', () => {
    render(<IntegrationFlowStep onSave={mockOnSave} isSaving={true} initialData={{}} />);
    const saveButton = screen.getByText(/Saving/i);
    expect(saveButton).toBeDisabled();
  });

  it('displays empty state initially', () => {
    render(<IntegrationFlowStep onSave={mockOnSave} initialData={{}} />);
    expect(screen.getByText(/No integration flows added/i)).toBeInTheDocument();
  });

  it('renders component name input', () => {
    render(<IntegrationFlowStep onSave={mockOnSave} initialData={{}} />);
    expect(screen.getByPlaceholderText(/Enter component name/i)).toBeInTheDocument();
  });

  it('renders counterpart system code input', () => {
    render(<IntegrationFlowStep onSave={mockOnSave} initialData={{}} />);
    expect(screen.getByPlaceholderText(/Enter counterpart system code/i)).toBeInTheDocument();
  });
});
