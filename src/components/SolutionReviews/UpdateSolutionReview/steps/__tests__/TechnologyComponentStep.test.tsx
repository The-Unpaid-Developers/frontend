import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import TechnologyComponentStep from '../TechnologyComponentStep';

vi.mock('../../../../../hooks/useTechComponents', () => ({
  useTechComponents: () => ({
    data: {
      productNameOptions: [
        { label: 'Java', value: 'Java' },
        { label: 'Python', value: 'Python' },
      ],
      getVersionOptionsForProduct: (productName: string) => {
        if (productName === 'Java') {
          return [{ label: '11', value: '11' }, { label: '17', value: '17' }];
        }
        return [];
      },
    },
    loading: false,
    error: null,
  }),
}));

describe('TechnologyComponentStep', () => {
  const mockOnSave = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the step component', () => {
    render(<TechnologyComponentStep onSave={mockOnSave} initialData={{}} />);
    expect(screen.getAllByText(/Technology Components/i).length).toBeGreaterThan(0);
  });

  it('renders add button', () => {
    render(<TechnologyComponentStep onSave={mockOnSave} initialData={{}} />);
    expect(screen.getByText(/Add Component/i)).toBeInTheDocument();
  });

  it('renders save button', () => {
    render(<TechnologyComponentStep onSave={mockOnSave} initialData={{}} />);
    expect(screen.getByText(/^Save$/)).toBeInTheDocument();
  });

  it('calls onSave when save button clicked', () => {
    render(<TechnologyComponentStep onSave={mockOnSave} initialData={{}} />);
    const saveButton = screen.getByText(/^Save$/);
    fireEvent.click(saveButton);
    expect(mockOnSave).toHaveBeenCalled();
  });

  it('renders with initial data', () => {
    const initialData = {
      technologyComponents: [
        {
          id: '1',
          componentName: 'Test Component',
          productName: 'Java',
          productVersion: '11',
          usage: 'BACKEND',
        }
      ],
    };
    render(<TechnologyComponentStep onSave={mockOnSave} initialData={initialData} />);
    expect(screen.getByText('Test Component')).toBeInTheDocument();
  });

  it('shows isSaving state', () => {
    render(<TechnologyComponentStep onSave={mockOnSave} isSaving={true} initialData={{}} />);
    const saveButton = screen.getByText(/Saving/i);
    expect(saveButton).toBeDisabled();
  });

  it('displays empty state initially', () => {
    render(<TechnologyComponentStep onSave={mockOnSave} initialData={{}} />);
    expect(screen.getByText(/No technology components added/i)).toBeInTheDocument();
  });

  it('renders component name input', () => {
    render(<TechnologyComponentStep onSave={mockOnSave} initialData={{}} />);
    expect(screen.getByPlaceholderText(/Enter component name/i)).toBeInTheDocument();
  });

  it('renders product name dropdown', () => {
    render(<TechnologyComponentStep onSave={mockOnSave} initialData={{}} />);
    expect(screen.getByText(/Product Name/i)).toBeInTheDocument();
  });

  it('handles component name input change', () => {
    render(<TechnologyComponentStep onSave={mockOnSave} initialData={{}} />);
    const input = screen.getByPlaceholderText(/Enter component name/i);
    fireEvent.change(input, { target: { value: 'New Component' } });
    expect(input).toHaveValue('New Component');
  });

  it('displays loading state', () => {
    const { container } = render(<TechnologyComponentStep onSave={mockOnSave} initialData={{}} />);
    expect(container).toBeInTheDocument();
  });

  it('renders with multiple components', () => {
    const initialData = {
      technologyComponents: [
        {
          id: '1',
          componentName: 'Component 1',
          productName: 'Java',
          productVersion: '11',
          usage: 'BACKEND',
        },
        {
          id: '2',
          componentName: 'Component 2',
          productName: 'Python',
          productVersion: '3.9',
          usage: 'BACKEND',
        },
      ],
    };
    render(<TechnologyComponentStep onSave={mockOnSave} initialData={initialData} />);
    expect(screen.getByText('Component 1')).toBeInTheDocument();
    expect(screen.getByText('Component 2')).toBeInTheDocument();
  });

  it('renders usage dropdown', () => {
    render(<TechnologyComponentStep onSave={mockOnSave} initialData={{}} />);
    expect(screen.getAllByText(/Usage/i).length).toBeGreaterThan(0);
  });
});
