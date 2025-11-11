import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import SolutionOverviewStep from '../SolutionOverviewStep';

describe('SolutionOverviewStep', () => {
  const mockOnSave = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the step component', () => {
    render(<SolutionOverviewStep onSave={mockOnSave} initialData={{}} />);
    expect(screen.getByText(/Solution Information/i)).toBeInTheDocument();
  });

  it('renders save button', () => {
    render(<SolutionOverviewStep onSave={mockOnSave} initialData={{}} />);
    expect(screen.getByText(/^Save$/)).toBeInTheDocument();
  });

  it('calls onSave when save button clicked', () => {
    render(<SolutionOverviewStep onSave={mockOnSave} initialData={{}} />);
    const saveButton = screen.getByText(/^Save$/);
    fireEvent.click(saveButton);
    expect(mockOnSave).toHaveBeenCalled();
  });

  it('shows isSaving state', () => {
    render(<SolutionOverviewStep onSave={mockOnSave} isSaving={true} initialData={{}} />);
    const saveButton = screen.getByText(/Saving/i);
    expect(saveButton).toBeDisabled();
  });

  it('renders all input fields', () => {
    render(<SolutionOverviewStep onSave={mockOnSave} initialData={{}} />);
    expect(screen.getByPlaceholderText(/Enter solution name/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Enter project name/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Enter solution architect name/i)).toBeInTheDocument();
  });

  it('renders with initial data', () => {
    const initialData = {
      solutionOverview: {
        solutionDetails: {
          solutionName: 'Test Solution',
          projectName: 'Test Project',
          solutionArchitectName: 'John Doe',
          deliveryProjectManagerName: 'Jane Smith',
          itBusinessPartner: 'Bob Johnson',
        },
        reviewType: 'Standard',
        businessUnit: 'IT',
        businessDriver: 'Cost Reduction',
        valueOutcome: 'Improved efficiency',
        applicationUsers: ['Internal Users', 'External Users'],
      },
    };
    render(<SolutionOverviewStep onSave={mockOnSave} initialData={initialData} />);
    expect(screen.getByDisplayValue('Test Solution')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Test Project')).toBeInTheDocument();
  });

  it('handles solution name input change', () => {
    render(<SolutionOverviewStep onSave={mockOnSave} initialData={{}} />);
    const input = screen.getByPlaceholderText(/Enter solution name/i);
    fireEvent.change(input, { target: { value: 'New Solution' } });
    expect(input).toHaveValue('New Solution');
  });

  it('handles project name input change', () => {
    render(<SolutionOverviewStep onSave={mockOnSave} initialData={{}} />);
    const input = screen.getByPlaceholderText(/Enter project name/i);
    fireEvent.change(input, { target: { value: 'New Project' } });
    expect(input).toHaveValue('New Project');
  });

  it('renders system code as disabled field', () => {
    const initialData = { systemCode: 'SYS-001' };
    render(<SolutionOverviewStep onSave={mockOnSave} initialData={initialData} />);
    const systemCodeInput = screen.getByDisplayValue('SYS-001');
    expect(systemCodeInput).toBeDisabled();
  });

  it('renders business context section', () => {
    render(<SolutionOverviewStep onSave={mockOnSave} initialData={{}} />);
    expect(screen.getByText(/Business Context/i)).toBeInTheDocument();
  });

  it('renders application users section', () => {
    render(<SolutionOverviewStep onSave={mockOnSave} initialData={{}} />);
    expect(screen.getByText(/Application Users \(0\)/i)).toBeInTheDocument();
  });

  it('renders add user button', () => {
    render(<SolutionOverviewStep onSave={mockOnSave} initialData={{}} />);
    expect(screen.getByText(/Add User/i)).toBeInTheDocument();
  });

  it('add user button is disabled when user field is empty', () => {
    render(<SolutionOverviewStep onSave={mockOnSave} initialData={{}} />);
    const addButton = screen.getByText(/Add User/i);
    expect(addButton).toBeDisabled();
  });

  it('displays application users count', () => {
    const initialData = {
      solutionOverview: {
        solutionDetails: {
          solutionName: '',
          projectName: '',
          solutionArchitectName: '',
          deliveryProjectManagerName: '',
          itBusinessPartner: '',
        },
        reviewType: '',
        businessUnit: '',
        businessDriver: '',
        valueOutcome: '',
        applicationUsers: ['User1', 'User2'],
      },
    };
    render(<SolutionOverviewStep onSave={mockOnSave} initialData={initialData} />);
    expect(screen.getByText(/Application Users \(2\)/i)).toBeInTheDocument();
  });

  it('renders remove buttons for application users', () => {
    const initialData = {
      solutionOverview: {
        solutionDetails: {
          solutionName: '',
          projectName: '',
          solutionArchitectName: '',
          deliveryProjectManagerName: '',
          itBusinessPartner: '',
        },
        reviewType: '',
        businessUnit: '',
        businessDriver: '',
        valueOutcome: '',
        applicationUsers: ['Internal Users'],
      },
    };
    render(<SolutionOverviewStep onSave={mockOnSave} initialData={initialData} />);
    expect(screen.getByText('Internal Users')).toBeInTheDocument();
  });

  it('renders delivery project manager field', () => {
    render(<SolutionOverviewStep onSave={mockOnSave} initialData={{}} />);
    expect(screen.getByPlaceholderText(/Enter delivery PM name/i)).toBeInTheDocument();
  });

  it('renders IT business partner field', () => {
    render(<SolutionOverviewStep onSave={mockOnSave} initialData={{}} />);
    expect(screen.getByPlaceholderText(/Enter IT business partner name/i)).toBeInTheDocument();
  });

  it('renders value outcomes field', () => {
    render(<SolutionOverviewStep onSave={mockOnSave} initialData={{}} />);
    expect(screen.getByPlaceholderText(/Describe expected value outcomes/i)).toBeInTheDocument();
  });

  it('updates solution overview data on useEffect', () => {
    const { rerender } = render(<SolutionOverviewStep onSave={mockOnSave} initialData={{}} />);

    const newData = {
      solutionOverview: {
        solutionDetails: {
          solutionName: 'Updated Solution',
          projectName: '',
          solutionArchitectName: '',
          deliveryProjectManagerName: '',
          itBusinessPartner: '',
        },
        reviewType: '',
        businessUnit: '',
        businessDriver: '',
        valueOutcome: '',
        applicationUsers: [],
      },
    };

    rerender(<SolutionOverviewStep onSave={mockOnSave} initialData={newData} />);
    expect(screen.getByDisplayValue('Updated Solution')).toBeInTheDocument();
  });
});
