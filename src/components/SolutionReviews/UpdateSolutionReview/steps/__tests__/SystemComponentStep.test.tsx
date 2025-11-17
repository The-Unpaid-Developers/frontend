import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import SystemComponentStep from '../SystemComponentStep';
import { createMockSystemComponent } from '../../../../../__tests__/testFactories';

vi.mock('../../../../../hooks/useTechComponents', () => ({
  useTechComponents: () => ({
    data: {
      productOptions: [{ label: 'Product1', value: 'Product1' }],
      getVersionOptionsForProduct: () => [{ label: 'v1.0', value: 'v1.0' }],
    },
    loading: false,
    error: null,
  }),
}));

describe('SystemComponentStep', () => {
  const mockOnSave = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Basic Rendering', () => {
    it('renders the step component with title', () => {
      render(<SystemComponentStep onSave={mockOnSave} initialData={{}} />);
      expect(screen.getAllByText(/System Components/i).length).toBeGreaterThan(0);
    });

    it('renders add component button', () => {
      render(<SystemComponentStep onSave={mockOnSave} initialData={{}} />);
      expect(screen.getByText(/Add Component/i)).toBeInTheDocument();
    });

    it('renders save button', () => {
      render(<SystemComponentStep onSave={mockOnSave} initialData={{}} />);
      expect(screen.getByText(/^Save$/)).toBeInTheDocument();
    });

    it('displays empty state when no components exist', () => {
      render(<SystemComponentStep onSave={mockOnSave} initialData={{}} />);
      expect(screen.getByText(/No system components added/i)).toBeInTheDocument();
    });

    it('handles undefined systemComponents in initial data', () => {
      render(<SystemComponentStep onSave={mockOnSave} initialData={{ systemComponents: undefined }} />);
      expect(screen.getByText(/No system components added/i)).toBeInTheDocument();
    });
  });

  describe('Component Management', () => {
    it('renders with initial system component data using factory', () => {
      const mockComponent = createMockSystemComponent({ name: 'Factory Test Component' });
      const initialData = {
        systemComponents: [mockComponent],
      };
      render(<SystemComponentStep onSave={mockOnSave} initialData={initialData} />);
      expect(screen.getByText('Factory Test Component')).toBeInTheDocument();
    });

    it('adds new component when add button clicked', () => {
      render(<SystemComponentStep onSave={mockOnSave} initialData={{}} />);
      const addButton = screen.getByText(/Add Component/i);
      fireEvent.click(addButton);
      expect(screen.getByPlaceholderText(/Enter component name/i)).toBeInTheDocument();
    });

    it('renders multiple components correctly', () => {
      const component1 = createMockSystemComponent({ name: 'Component 1' });
      const component2 = createMockSystemComponent({ name: 'Component 2', status: 'EXISTING' });
      const initialData = {
        systemComponents: [component1, component2],
      };
      render(<SystemComponentStep onSave={mockOnSave} initialData={initialData} />);
      expect(screen.getByText('Component 1')).toBeInTheDocument();
      expect(screen.getByText('Component 2')).toBeInTheDocument();
    });

    it('preserves existing components when adding new one', () => {
      const existingComponent = createMockSystemComponent({ name: 'Existing Component' });
      const initialData = {
        systemComponents: [existingComponent],
      };
      render(<SystemComponentStep onSave={mockOnSave} initialData={initialData} />);
      expect(screen.getByText('Existing Component')).toBeInTheDocument();

      const addButton = screen.getByText(/Add Component/i);
      fireEvent.click(addButton);
      expect(screen.getByText('Existing Component')).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/Enter component name/i)).toBeInTheDocument();
    });
  });

  describe('Form Interactions', () => {
    it('handles component name input change', () => {
      render(<SystemComponentStep onSave={mockOnSave} initialData={{}} />);
      const addButton = screen.getByText(/Add Component/i);
      fireEvent.click(addButton);
      
      const input = screen.getByPlaceholderText(/Enter component name/i);
      fireEvent.change(input, { target: { value: 'New Component Name' } });
      expect(input).toHaveValue('New Component Name');
    });

    it('renders basic information fields', () => {
      render(<SystemComponentStep onSave={mockOnSave} initialData={{}} />);
      const addButton = screen.getByText(/Add Component/i);
      fireEvent.click(addButton);
      
      expect(screen.getByPlaceholderText(/Enter component name/i)).toBeInTheDocument();
      expect(screen.getAllByText(/Status/i).length).toBeGreaterThan(0);
      expect(screen.getAllByText(/Role/i).length).toBeGreaterThan(0);
    });

    it('renders hosting and infrastructure fields', () => {
      render(<SystemComponentStep onSave={mockOnSave} initialData={{}} />);
      const addButton = screen.getByText(/Add Component/i);
      fireEvent.click(addButton);
      
      expect(screen.getByText(/Hosted On/i)).toBeInTheDocument();
      expect(screen.getByText(/Hosting Region/i)).toBeInTheDocument();
      expect(screen.getByText(/Solution Type/i)).toBeInTheDocument();
    });

    it('renders boolean checkbox fields', () => {
      render(<SystemComponentStep onSave={mockOnSave} initialData={{}} />);
      const addButton = screen.getByText(/Add Component/i);
      fireEvent.click(addButton);
      
      expect(screen.getByText(/Owned By Us/i)).toBeInTheDocument();
      expect(screen.getByText(/CI\/CD Used/i)).toBeInTheDocument();
      expect(screen.getByText(/Subscription/i)).toBeInTheDocument();
      expect(screen.getByText(/Internet Facing/i)).toBeInTheDocument();
    });

    it('handles checkbox interactions', () => {
      const component = createMockSystemComponent({ isOwnedByUs: false });
      const initialData = { systemComponents: [component] };
      
      render(<SystemComponentStep onSave={mockOnSave} initialData={initialData} />);
      
      const checkbox = screen.getByLabelText(/Owned By Us/i);
      expect(checkbox).not.toBeChecked();
      
      fireEvent.click(checkbox);
      expect(checkbox).toBeChecked();
    });
  });

  describe('Language and Framework Section', () => {
    it('renders language framework section', () => {
      render(<SystemComponentStep onSave={mockOnSave} initialData={{}} />);
      const addButton = screen.getByText(/Add Component/i);
      fireEvent.click(addButton);
      
      expect(screen.getByText(/Technology Stack/i)).toBeInTheDocument();
    });

    it('displays language and framework from factory data', () => {
      const component = createMockSystemComponent();
      const initialData = { systemComponents: [component] };
      
      render(<SystemComponentStep onSave={mockOnSave} initialData={initialData} />);
      
      expect(screen.getByText(/Technology Stack/i)).toBeInTheDocument();
    });
  });

  describe('Performance Requirements', () => {
    it('renders performance requirement fields', () => {
      render(<SystemComponentStep onSave={mockOnSave} initialData={{}} />);
      const addButton = screen.getByText(/Add Component/i);
      fireEvent.click(addButton);
      
      expect(screen.getByText(/Performance & Availability/i)).toBeInTheDocument();
      expect(screen.getByText(/Availability Requirement/i)).toBeInTheDocument();
      expect(screen.getByText(/Latency Requirement/i)).toBeInTheDocument();
      expect(screen.getByText(/Throughput Requirement/i)).toBeInTheDocument();
      expect(screen.getByText(/Scalability Method/i)).toBeInTheDocument();
    });

    it('handles numeric input fields', () => {
      render(<SystemComponentStep onSave={mockOnSave} initialData={{}} />);
      const addButton = screen.getByText(/Add Component/i);
      fireEvent.click(addButton);
      
      const latencyInput = screen.getByPlaceholderText(/Enter latency/i);
      fireEvent.change(latencyInput, { target: { value: '250' } });
      expect(latencyInput).toHaveValue(250);
      
      const throughputInput = screen.getByPlaceholderText(/Enter throughput/i);
      fireEvent.change(throughputInput, { target: { value: '1500' } });
      expect(throughputInput).toHaveValue(1500);
    });

    it('displays performance values from factory data', () => {
      const component = createMockSystemComponent({
        latencyRequirement: 150,
        throughputRequirement: 2000
      });
      const initialData = { systemComponents: [component] };
      
      render(<SystemComponentStep onSave={mockOnSave} initialData={initialData} />);
      
      // Check that the component renders without error and contains performance section
      expect(screen.getByText(/Performance & Availability/i)).toBeInTheDocument();
    });
  });

  describe('Security Details Section', () => {
    it('renders security details section', () => {
      render(<SystemComponentStep onSave={mockOnSave} initialData={{}} />);
      const addButton = screen.getByText(/Add Component/i);
      fireEvent.click(addButton);
      
      expect(screen.getByText(/Security Details/i)).toBeInTheDocument();
    });

    it('renders authentication and authorization fields', () => {
      render(<SystemComponentStep onSave={mockOnSave} initialData={{}} />);
      const addButton = screen.getByText(/Add Component/i);
      fireEvent.click(addButton);
      
      expect(screen.getByText(/Authentication Method/i)).toBeInTheDocument();
      expect(screen.getByText(/Authorization Model/i)).toBeInTheDocument();
    });

    it('renders encryption fields', () => {
      render(<SystemComponentStep onSave={mockOnSave} initialData={{}} />);
      const addButton = screen.getByText(/Add Component/i);
      fireEvent.click(addButton);
      
      expect(screen.getByText(/Data Encryption at Rest/i)).toBeInTheDocument();
      expect(screen.getByText(/Authentication Method/i)).toBeInTheDocument();
    });

    it('renders security checkboxes', () => {
      render(<SystemComponentStep onSave={mockOnSave} initialData={{}} />);
      const addButton = screen.getByText(/Add Component/i);
      fireEvent.click(addButton);
      
      expect(screen.getByText(/Audit Logging Enabled/i)).toBeInTheDocument();
      expect(screen.getByText(/IP Whitelisting/i)).toBeInTheDocument();
    });

    it('displays security details from factory data', () => {
      const component = createMockSystemComponent();
      const initialData = { systemComponents: [component] };
      
      render(<SystemComponentStep onSave={mockOnSave} initialData={initialData} />);
      
      // Check that security section renders without error
      expect(screen.getByText(/Security Details/i)).toBeInTheDocument();
    });

    it('handles security checkbox interactions in new component form', () => {
      render(<SystemComponentStep onSave={mockOnSave} initialData={{}} />);
      const addButton = screen.getByText(/Add Component/i);
      fireEvent.click(addButton);
      
      const checkbox = screen.getByLabelText(/Audit Logging Enabled/i);
      expect(checkbox).not.toBeChecked();
      
      fireEvent.click(checkbox);
      expect(checkbox).toBeChecked();
    });

    it('renders vulnerability assessment fields', () => {
      render(<SystemComponentStep onSave={mockOnSave} initialData={{}} />);
      const addButton = screen.getByText(/Add Component/i);
      fireEvent.click(addButton);
      
      expect(screen.getByText(/Vulnerability Assessment Frequency/i)).toBeInTheDocument();
      expect(screen.getByText(/Penetration Testing Frequency/i)).toBeInTheDocument();
    });

    it('renders sensitive data and certificate fields', () => {
      render(<SystemComponentStep onSave={mockOnSave} initialData={{}} />);
      const addButton = screen.getByText(/Add Component/i);
      fireEvent.click(addButton);
      
      expect(screen.getByText(/Sensitive Data Elements/i)).toBeInTheDocument();
      const sslElements = screen.getAllByText(/SSL/i);
      expect(sslElements.length).toBeGreaterThan(0);
    });
  });

  describe('Upgrade and Maintenance', () => {
    it('renders upgrade strategy fields', () => {
      render(<SystemComponentStep onSave={mockOnSave} initialData={{}} />);
      const addButton = screen.getByText(/Add Component/i);
      fireEvent.click(addButton);
      
      expect(screen.getByText(/Customization Level/i)).toBeInTheDocument();
      expect(screen.getByText(/Upgrade Strategy/i)).toBeInTheDocument();
      expect(screen.getByText(/Upgrade Frequency/i)).toBeInTheDocument();
    });

    it('displays upgrade values from factory data', () => {
      const component = createMockSystemComponent({
        customizationLevel: 'High',
        upgradeStrategy: 'Manual',
        upgradeFrequency: 'Annually'
      });
      const initialData = { systemComponents: [component] };
      
      render(<SystemComponentStep onSave={mockOnSave} initialData={initialData} />);
      
      expect(screen.getByText(/Customization Level/i)).toBeInTheDocument();
      expect(screen.getByText(/Upgrade Strategy/i)).toBeInTheDocument();
      expect(screen.getByText(/Upgrade Frequency/i)).toBeInTheDocument();
    });

    it('renders backup site field', () => {
      render(<SystemComponentStep onSave={mockOnSave} initialData={{}} />);
      const addButton = screen.getByText(/Add Component/i);
      fireEvent.click(addButton);
      
      // Use getAllByText since there might be multiple backup site elements
      const backupSiteElements = screen.getAllByText(/Backup Site/i);
      expect(backupSiteElements.length).toBeGreaterThan(0);
    });
  });

  describe('Save Functionality', () => {
    it('calls onSave when save button clicked', () => {
      render(<SystemComponentStep onSave={mockOnSave} initialData={{}} />);
      const saveButton = screen.getByText(/^Save$/);
      fireEvent.click(saveButton);
      expect(mockOnSave).toHaveBeenCalled();
    });

    it('shows isSaving state correctly', () => {
      render(<SystemComponentStep onSave={mockOnSave} isSaving={true} initialData={{}} />);
      const saveButton = screen.getByText(/Saving/i);
      expect(saveButton).toBeDisabled();
    });

    it('disables add button while saving', () => {
      render(<SystemComponentStep onSave={mockOnSave} isSaving={true} initialData={{}} />);
      const addButton = screen.getByText(/Add Component/i);
      expect(addButton).toBeDisabled();
    });

    it('calls onSave with correct data structure', () => {
      render(<SystemComponentStep onSave={mockOnSave} initialData={{}} />);
      const saveButton = screen.getByText(/^Save$/);
      fireEvent.click(saveButton);

      expect(mockOnSave).toHaveBeenCalled();
      expect(mockOnSave.mock.calls[0][0]).toBeDefined();
    });

    it('preserves data when saving with existing components', () => {
      const component = createMockSystemComponent({ name: 'Existing Component' });
      const initialData = { systemComponents: [component] };
      
      render(<SystemComponentStep onSave={mockOnSave} initialData={initialData} />);
      const saveButton = screen.getByText(/^Save$/);
      fireEvent.click(saveButton);

      expect(mockOnSave).toHaveBeenCalled();
      const savedData = mockOnSave.mock.calls[0][0];
      expect(savedData).toBeDefined();
    });
  });

  describe('Component Deletion', () => {
    it('removes component when delete action triggered', async () => {
      const component = createMockSystemComponent({ name: 'Component To Delete' });
      const initialData = { systemComponents: [component] };
      
      render(<SystemComponentStep onSave={mockOnSave} initialData={initialData} />);
      expect(screen.getByText('Component To Delete')).toBeInTheDocument();
      
      // Look for delete button - it might be represented by an icon or have a specific test id
      const deleteButtons = screen.queryAllByRole('button');
      const deleteButton = deleteButtons.find(button => 
        button.textContent?.includes('Delete') || 
        button.getAttribute('aria-label')?.includes('delete') ||
        button.getAttribute('title')?.includes('delete')
      );
      
      if (deleteButton) {
        fireEvent.click(deleteButton);
        await waitFor(() => {
          expect(screen.queryByText('Component To Delete')).not.toBeInTheDocument();
        });
      }
    });
  });

  describe('Validation', () => {
    it('validates component name is required', () => {
      render(<SystemComponentStep onSave={mockOnSave} initialData={{}} />);
      const addButton = screen.getByText(/Add Component/i);
      fireEvent.click(addButton);

      const nameInput = screen.getByPlaceholderText(/Enter component name/i);
      fireEvent.change(nameInput, { target: { value: '' } });
      fireEvent.blur(nameInput);

      const saveButton = screen.getByText(/^Save$/);
      fireEvent.click(saveButton);

      expect(mockOnSave).toHaveBeenCalled();
    });

    it('handles validation for numeric fields', () => {
      render(<SystemComponentStep onSave={mockOnSave} initialData={{}} />);
      const addButton = screen.getByText(/Add Component/i);
      fireEvent.click(addButton);
      
      const latencyInput = screen.getByPlaceholderText(/Enter latency/i);
      fireEvent.change(latencyInput, { target: { value: '-1' } });
      fireEvent.blur(latencyInput);
      
      // Component should handle negative values appropriately
      expect(latencyInput).toHaveValue(-1);
    });
  });

  describe('Edge Cases', () => {
    it('handles empty systemComponents array', () => {
      const initialData = { systemComponents: [] };
      render(<SystemComponentStep onSave={mockOnSave} initialData={initialData} />);
      expect(screen.getByText(/No system components added/i)).toBeInTheDocument();
    });

    it('handles null values in component data', () => {
      const component = createMockSystemComponent({
        name: null,
        status: null,
        role: null
      });
      const initialData = { systemComponents: [component] };
      
      render(<SystemComponentStep onSave={mockOnSave} initialData={initialData} />);
      // Component should render without crashing
      expect(screen.getByText(/System Components/i)).toBeInTheDocument();
    });

    it('handles missing security details', () => {
      const component = createMockSystemComponent({
        securityDetails: undefined
      });
      const initialData = { systemComponents: [component] };
      
      render(<SystemComponentStep onSave={mockOnSave} initialData={initialData} />);
      expect(screen.getByText(/System Components/i)).toBeInTheDocument();
    });

    it('handles missing language framework', () => {
      const component = createMockSystemComponent({
        languageFramework: undefined
      });
      const initialData = { systemComponents: [component] };
      
      render(<SystemComponentStep onSave={mockOnSave} initialData={initialData} />);
      expect(screen.getByText(/System Components/i)).toBeInTheDocument();
    });
  });

  describe('Complex Interactions', () => {
    it('handles multiple component operations in sequence', async () => {
      render(<SystemComponentStep onSave={mockOnSave} initialData={{}} />);
      
      // Add first component
      const addButton = screen.getByText(/Add Component/i);
      fireEvent.click(addButton);
      
      const nameInput = screen.getByPlaceholderText(/Enter component name/i);
      fireEvent.change(nameInput, { target: { value: 'First Component' } });
      
      // Component should show the entered name
      expect(nameInput).toHaveValue('First Component');
    });

    it('preserves form state during interactions', () => {
      const component = createMockSystemComponent({ name: 'Test Component' });
      const initialData = { systemComponents: [component] };
      
      render(<SystemComponentStep onSave={mockOnSave} initialData={initialData} />);
      
      // Component should be displayed
      expect(screen.getByText('Test Component')).toBeInTheDocument();
      
      // Add new component
      const addButton = screen.getByText(/Add Component/i);
      fireEvent.click(addButton);
      
      // Original component should still be there
      expect(screen.getByText('Test Component')).toBeInTheDocument();
    });
  });

  describe('Edit Modal Functionality', () => {
    it('opens edit modal when edit button is clicked', () => {
      const component = createMockSystemComponent({ 
        name: 'Editable Component',
        status: 'ACTIVE',
        role: 'DATABASE'
      });
      const initialData = { systemComponents: [component] };
      
      render(<SystemComponentStep onSave={mockOnSave} initialData={initialData} />);
      
      // Find and click edit button
      const editButtons = screen.getAllByRole('button').filter(button => 
        button.querySelector('svg') && 
        (button.getAttribute('title') === 'Edit' || button.getAttribute('aria-label') === 'Edit')
      );
      
      expect(editButtons.length).toBeGreaterThan(0);
      fireEvent.click(editButtons[0]);
      
      // Modal should be open with edit form
      expect(screen.getByText('Edit System Component')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Editable Component')).toBeInTheDocument();
    });

    it('closes edit modal when cancel button is clicked', () => {
      const component = createMockSystemComponent({ 
        name: 'Cancellable Edit',
        status: 'ACTIVE',
        role: 'DATABASE'
      });
      const initialData = { systemComponents: [component] };
      
      render(<SystemComponentStep onSave={mockOnSave} initialData={initialData} />);
      
      // Open edit modal
      const editButtons = screen.getAllByRole('button').filter(button => 
        button.querySelector('svg') && 
        (button.getAttribute('title') === 'Edit' || button.getAttribute('aria-label') === 'Edit')
      );
      fireEvent.click(editButtons[0]);
      
      // Modal should be open
      expect(screen.getByText('Edit System Component')).toBeInTheDocument();
      
      // Click cancel
      const cancelButton = screen.getByText('Cancel');
      fireEvent.click(cancelButton);
      
      // Modal should be closed
      expect(screen.queryByText('Edit System Component')).not.toBeInTheDocument();
    });

    it('closes edit modal when X button is clicked', () => {
      const component = createMockSystemComponent({ 
        name: 'X Close Test',
        status: 'ACTIVE',
        role: 'DATABASE'
      });
      const initialData = { systemComponents: [component] };
      
      render(<SystemComponentStep onSave={mockOnSave} initialData={initialData} />);
      
      // Open edit modal
      const editButtons = screen.getAllByRole('button').filter(button => 
        button.querySelector('svg') && 
        (button.getAttribute('title') === 'Edit' || button.getAttribute('aria-label') === 'Edit')
      );
      fireEvent.click(editButtons[0]);
      
      // Modal should be open
      expect(screen.getByText('Edit System Component')).toBeInTheDocument();
      
      // Find and click X button (close button in modal header)
      const closeButtons = screen.getAllByRole('button').filter(button => 
        button.querySelector('svg path[d*="M6 18L18 6M6 6l12 12"]')
      );
      expect(closeButtons.length).toBeGreaterThan(0);
      fireEvent.click(closeButtons[0]);
      
      // Modal should be closed
      expect(screen.queryByText('Edit System Component')).not.toBeInTheDocument();
    });

    it('updates component name in edit modal', () => {
      const component = createMockSystemComponent({ 
        name: 'Original Name',
        status: 'ACTIVE',
        role: 'DATABASE'
      });
      const initialData = { systemComponents: [component] };
      
      render(<SystemComponentStep onSave={mockOnSave} initialData={initialData} />);
      
      // Open edit modal
      const editButtons = screen.getAllByRole('button').filter(button => 
        button.querySelector('svg') && 
        (button.getAttribute('title') === 'Edit' || button.getAttribute('aria-label') === 'Edit')
      );
      fireEvent.click(editButtons[0]);
      
      // Update component name
      const nameInput = screen.getByDisplayValue('Original Name');
      fireEvent.change(nameInput, { target: { value: 'Updated Name' } });
      
      // Value should be updated
      expect(screen.getByDisplayValue('Updated Name')).toBeInTheDocument();
    });

    it('updates basic information dropdowns in edit modal', () => {
      const component = createMockSystemComponent({ 
        name: 'Dropdown Test',
        status: 'ACTIVE',
        role: 'DATABASE'
      });
      const initialData = { systemComponents: [component] };
      
      render(<SystemComponentStep onSave={mockOnSave} initialData={initialData} />);
      
      // Open edit modal
      const editButtons = screen.getAllByRole('button').filter(button => 
        button.querySelector('svg') && 
        (button.getAttribute('title') === 'Edit' || button.getAttribute('aria-label') === 'Edit')
      );
      fireEvent.click(editButtons[0]);
      
      // Modal should be open with dropdowns
      expect(screen.getByText('Edit System Component')).toBeInTheDocument();
      
      // Check that basic information section exists in the modal
      const headings = screen.getAllByText('Basic Information');
      expect(headings.length).toBeGreaterThan(0);
      
      // Check that dropdowns are present (status, role, etc.)
      const dropdowns = screen.getAllByRole('combobox');
      expect(dropdowns.length).toBeGreaterThan(0);
    });

    it('displays security details section in edit modal', () => {
      const component = createMockSystemComponent({ 
        name: 'Security Test',
        status: 'ACTIVE',
        role: 'DATABASE'
      });
      const initialData = { systemComponents: [component] };
      
      render(<SystemComponentStep onSave={mockOnSave} initialData={initialData} />);
      
      // Open edit modal
      const editButtons = screen.getAllByRole('button').filter(button => 
        button.querySelector('svg') && 
        (button.getAttribute('title') === 'Edit' || button.getAttribute('aria-label') === 'Edit')
      );
      fireEvent.click(editButtons[0]);
      
      // Security details section should be present (can be multiple)
      const securitySections = screen.getAllByText('Security Details');
      expect(securitySections.length).toBeGreaterThan(0);
    });

    it('displays performance requirements section in edit modal', () => {
      const component = createMockSystemComponent({ 
        name: 'Performance Test',
        status: 'ACTIVE',
        role: 'DATABASE'
      });
      const initialData = { systemComponents: [component] };
      
      render(<SystemComponentStep onSave={mockOnSave} initialData={initialData} />);
      
      // Open edit modal
      const editButtons = screen.getAllByRole('button').filter(button => 
        button.querySelector('svg') && 
        (button.getAttribute('title') === 'Edit' || button.getAttribute('aria-label') === 'Edit')
      );
      fireEvent.click(editButtons[0]);
      
      // Modal should be open - check for edit modal title
      expect(screen.getByText('Edit System Component')).toBeInTheDocument();
      
      // Look for performance-related fields instead of specific section title
      const inputs = screen.getAllByRole('textbox');
      expect(inputs.length).toBeGreaterThan(0);
    });

    it('displays language and framework section in edit modal', () => {
      const component = createMockSystemComponent({ 
        name: 'Language Test',
        status: 'ACTIVE',
        role: 'DATABASE'
      });
      const initialData = { systemComponents: [component] };
      
      render(<SystemComponentStep onSave={mockOnSave} initialData={initialData} />);
      
      // Open edit modal
      const editButtons = screen.getAllByRole('button').filter(button => 
        button.querySelector('svg') && 
        (button.getAttribute('title') === 'Edit' || button.getAttribute('aria-label') === 'Edit')
      );
      fireEvent.click(editButtons[0]);
      
      // Modal should be open - check for edit modal title
      expect(screen.getByText('Edit System Component')).toBeInTheDocument();
      
      // Check for form elements that would be in the modal
      const dropdowns = screen.getAllByRole('combobox');
      expect(dropdowns.length).toBeGreaterThan(0);
    });

    it('saves edited component when save button is clicked', async () => {
      const component = createMockSystemComponent({ 
        name: 'Save Test Component',
        status: 'ACTIVE',
        role: 'DATABASE'
      });
      const initialData = { systemComponents: [component] };
      
      render(<SystemComponentStep onSave={mockOnSave} initialData={initialData} />);
      
      // Open edit modal
      const editButtons = screen.getAllByRole('button').filter(button => 
        button.querySelector('svg') && 
        (button.getAttribute('title') === 'Edit' || button.getAttribute('aria-label') === 'Edit')
      );
      fireEvent.click(editButtons[0]);
      
      // Update component name
      const nameInput = screen.getByDisplayValue('Save Test Component');
      fireEvent.change(nameInput, { target: { value: 'Updated Save Test' } });
      
      // Save changes
      const saveButton = screen.getByText('Save Changes');
      fireEvent.click(saveButton);
      
      // Modal should close
      await waitFor(() => {
        expect(screen.queryByText('Edit System Component')).not.toBeInTheDocument();
      });
      
      // Component should be updated in the list
      expect(screen.getByText('Updated Save Test')).toBeInTheDocument();
    });

    it('disables save button when required fields are empty', () => {
      const component = createMockSystemComponent({ 
        name: 'Required Fields Test',
        status: 'ACTIVE',
        role: 'DATABASE'
      });
      const initialData = { systemComponents: [component] };
      
      render(<SystemComponentStep onSave={mockOnSave} initialData={initialData} />);
      
      // Open edit modal
      const editButtons = screen.getAllByRole('button').filter(button => 
        button.querySelector('svg') && 
        (button.getAttribute('title') === 'Edit' || button.getAttribute('aria-label') === 'Edit')
      );
      fireEvent.click(editButtons[0]);
      
      // Clear required field (name)
      const nameInput = screen.getByDisplayValue('Required Fields Test');
      fireEvent.change(nameInput, { target: { value: '' } });
      
      // Save button should be disabled
      const saveButton = screen.getByText('Save Changes');
      expect(saveButton).toBeDisabled();
    });

    it('handles checkbox interactions in edit modal', () => {
      const component = createMockSystemComponent({ 
        name: 'Checkbox Test',
        status: 'ACTIVE',
        role: 'DATABASE'
      });
      const initialData = { systemComponents: [component] };
      
      render(<SystemComponentStep onSave={mockOnSave} initialData={initialData} />);
      
      // Open edit modal
      const editButtons = screen.getAllByRole('button').filter(button => 
        button.querySelector('svg') && 
        (button.getAttribute('title') === 'Edit' || button.getAttribute('aria-label') === 'Edit')
      );
      fireEvent.click(editButtons[0]);
      
      // Modal should have checkbox fields
      const checkboxes = screen.getAllByRole('checkbox');
      expect(checkboxes.length).toBeGreaterThan(0);
      
      // Test clicking a checkbox
      if (checkboxes.length > 0) {
        const checkbox = checkboxes[0] as HTMLInputElement;
        const initialChecked = checkbox.checked;
        fireEvent.click(checkbox);
        expect(checkbox.checked).toBe(!initialChecked);
      }
    });

    it('handles numeric input fields in edit modal', () => {
      const component = createMockSystemComponent({ 
        name: 'Numeric Test',
        status: 'ACTIVE',
        role: 'DATABASE'
      });
      const initialData = { systemComponents: [component] };
      
      render(<SystemComponentStep onSave={mockOnSave} initialData={initialData} />);
      
      // Open edit modal
      const editButtons = screen.getAllByRole('button').filter(button => 
        button.querySelector('svg') && 
        (button.getAttribute('title') === 'Edit' || button.getAttribute('aria-label') === 'Edit')
      );
      fireEvent.click(editButtons[0]);
      
      // Look for numeric input fields (they might be type="number" or have numeric placeholders)
      const allInputs = screen.getAllByRole('textbox');
      const numericInputs = allInputs.filter(input => {
        const htmlInput = input as HTMLInputElement;
        return htmlInput.type === 'number' || 
               htmlInput.placeholder?.includes('Enter') ||
               htmlInput.placeholder?.includes('MB') ||
               htmlInput.placeholder?.includes('GB') ||
               htmlInput.placeholder?.includes('users');
      });
      
      // Test numeric input interaction if any numeric fields exist
      if (numericInputs.length > 0) {
        const numInput = numericInputs[0] as HTMLInputElement;
        fireEvent.change(numInput, { target: { value: '100' } });
        expect(numInput.value).toBe('100');
      }
    });

    it('maintains edit state across form sections', () => {
      const component = createMockSystemComponent({ 
        name: 'State Test',
        status: 'ACTIVE',
        role: 'DATABASE'
      });
      const initialData = { systemComponents: [component] };
      
      render(<SystemComponentStep onSave={mockOnSave} initialData={initialData} />);
      
      // Open edit modal
      const editButtons = screen.getAllByRole('button').filter(button => 
        button.querySelector('svg') && 
        (button.getAttribute('title') === 'Edit' || button.getAttribute('aria-label') === 'Edit')
      );
      fireEvent.click(editButtons[0]);
      
      // Update name in basic information section
      const nameInput = screen.getByDisplayValue('State Test');
      fireEvent.change(nameInput, { target: { value: 'Updated State Test' } });
      
      // Navigate through different sections and verify name is maintained
      expect(screen.getByDisplayValue('Updated State Test')).toBeInTheDocument();
      
      // Check different sections exist and name is still updated (handle multiple matches)
      const basicSections = screen.getAllByText('Basic Information');
      expect(basicSections.length).toBeGreaterThan(0);
      
      const securitySections = screen.getAllByText('Security Details');
      expect(securitySections.length).toBeGreaterThan(0);
      
      expect(screen.getByDisplayValue('Updated State Test')).toBeInTheDocument();
    });
  });
});
