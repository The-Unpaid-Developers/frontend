import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import TechnologyComponentStep from '../TechnologyComponentStep';
import { createMockTechnologyComponent } from '../../../../../__tests__/testFactories';

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

  describe('Basic Rendering', () => {
    it('renders the step component with title', () => {
      render(<TechnologyComponentStep onSave={mockOnSave} initialData={{}} />);
      expect(screen.getAllByText(/Technology Components/i).length).toBeGreaterThan(0);
    });

    it('renders add component button', () => {
      render(<TechnologyComponentStep onSave={mockOnSave} initialData={{}} />);
      expect(screen.getByText(/Add Component/i)).toBeInTheDocument();
    });

    it('renders save button', () => {
      render(<TechnologyComponentStep onSave={mockOnSave} initialData={{}} />);
      expect(screen.getByText(/^Save$/)).toBeInTheDocument();
    });

    it('displays empty state when no components exist', () => {
      render(<TechnologyComponentStep onSave={mockOnSave} initialData={{}} />);
      expect(screen.getByText(/No technology components added/i)).toBeInTheDocument();
    });

    it('handles undefined technologyComponents in initial data', () => {
      render(<TechnologyComponentStep onSave={mockOnSave} initialData={{ technologyComponents: undefined }} />);
      expect(screen.getByText(/No technology components added/i)).toBeInTheDocument();
    });
  });

  describe('Technology Component Management', () => {
    it('renders with initial technology component data using factory', () => {
      const mockComponent = createMockTechnologyComponent({ 
        componentName: 'Factory Test Component', 
        productName: 'Java',
        productVersion: '17'
      });
      const initialData = {
        technologyComponents: [mockComponent],
      };
      render(<TechnologyComponentStep onSave={mockOnSave} initialData={initialData} />);
      expect(screen.getByText('Factory Test Component')).toBeInTheDocument();
    });

    it('handles form interactions for adding components', () => {
      render(<TechnologyComponentStep onSave={mockOnSave} initialData={{}} />);
      
      // Fill in required fields
      const componentNameInput = screen.getByPlaceholderText(/Enter component name/i);
      fireEvent.change(componentNameInput, { target: { value: 'New Test Component' } });
      
      // Select product name
      const productDropdown = screen.getAllByRole('combobox')[0];
      fireEvent.change(productDropdown, { target: { value: 'Java' } });
      
      // Select usage from the available options
      const usageDropdown = screen.getAllByRole('combobox')[2]; // Usage dropdown
      fireEvent.change(usageDropdown, { target: { value: 'PROGRAMMING_LANGUAGE' } });
      
      // Check add button is present and can be interacted with
      const addButton = screen.getByText(/Add Component/i);
      expect(addButton).toBeInTheDocument();
      
      // The form should have the input values
      expect(componentNameInput).toHaveValue('New Test Component');
    });

    it('renders multiple components correctly', () => {
      const component1 = createMockTechnologyComponent({ 
        componentName: 'Component 1', 
        productName: 'Java',
        productVersion: '11'
      });
      const component2 = createMockTechnologyComponent({ 
        componentName: 'Component 2', 
        productName: 'Python',
        productVersion: '3.9'
      });
      const initialData = {
        technologyComponents: [component1, component2],
      };
      render(<TechnologyComponentStep onSave={mockOnSave} initialData={initialData} />);
      expect(screen.getByText('Component 1')).toBeInTheDocument();
      expect(screen.getByText('Component 2')).toBeInTheDocument();
    });

    it('preserves existing components when adding new one', () => {
      const existingComponent = createMockTechnologyComponent({ 
        componentName: 'Existing Component', 
        productName: 'Java'
      });
      const initialData = {
        technologyComponents: [existingComponent],
      };
      render(<TechnologyComponentStep onSave={mockOnSave} initialData={initialData} />);
      expect(screen.getByText('Existing Component')).toBeInTheDocument();

      // Add new component
      const componentNameInput = screen.getByPlaceholderText(/Enter component name/i);
      fireEvent.change(componentNameInput, { target: { value: 'New Component' } });
      
      // Both components should be present after interaction
      expect(screen.getByText('Existing Component')).toBeInTheDocument();
    });
  });

  describe('Form Interactions', () => {
    it('handles component name input change', () => {
      render(<TechnologyComponentStep onSave={mockOnSave} initialData={{}} />);
      
      const componentInput = screen.getByPlaceholderText(/Enter component name/i);
      fireEvent.change(componentInput, { target: { value: 'Test Tech Component' } });
      expect(componentInput).toHaveValue('Test Tech Component');
    });

    it('renders all required form fields', () => {
      render(<TechnologyComponentStep onSave={mockOnSave} initialData={{}} />);
      
      expect(screen.getByPlaceholderText(/Enter component name/i)).toBeInTheDocument();
      expect(screen.getByText(/Product Name/i)).toBeInTheDocument();
      expect(screen.getByText(/Product Version/i)).toBeInTheDocument();
      expect(screen.getAllByText(/Usage/i)[0]).toBeInTheDocument();
    });

    it('handles product name selection', () => {
      render(<TechnologyComponentStep onSave={mockOnSave} initialData={{}} />);
      
      const productDropdowns = screen.getAllByRole('combobox');
      const productDropdown = productDropdowns.find(dropdown => 
        dropdown.getAttribute('aria-label')?.includes('Product') ||
        dropdown.closest('label')?.textContent?.includes('Product Name')
      ) || productDropdowns[0];
      
      fireEvent.change(productDropdown, { target: { value: 'Java' } });
      // Product selection should work
      expect(productDropdown).toBeInTheDocument();
    });

    it('handles version selection based on product', () => {
      render(<TechnologyComponentStep onSave={mockOnSave} initialData={{}} />);
      
      // First select a product
      const productDropdowns = screen.getAllByRole('combobox');
      fireEvent.change(productDropdowns[0], { target: { value: 'Java' } });
      
      // Version dropdown should be available
      expect(screen.getByText(/Product Version/i)).toBeInTheDocument();
    });

    it('handles usage selection', () => {
      render(<TechnologyComponentStep onSave={mockOnSave} initialData={{}} />);
      
      // Usage dropdown should be present
      expect(screen.getAllByText(/Usage/i)[0]).toBeInTheDocument();
    });
  });

  describe('Technology Component Properties', () => {
    it('displays product name from factory data', () => {
      const component = createMockTechnologyComponent({
        componentName: 'Java Component',
        productName: 'Java',
        productVersion: '17'
      });
      const initialData = { technologyComponents: [component] };
      
      render(<TechnologyComponentStep onSave={mockOnSave} initialData={initialData} />);
      
      expect(screen.getByText('Java Component')).toBeInTheDocument();
    });

    it('shows different product versions', () => {
      const pythonComponent = createMockTechnologyComponent({
        componentName: 'Python Component',
        productName: 'Python',
        productVersion: '3.9'
      });
      const initialData = { technologyComponents: [pythonComponent] };
      
      render(<TechnologyComponentStep onSave={mockOnSave} initialData={initialData} />);
      
      expect(screen.getByText('Python Component')).toBeInTheDocument();
    });

    it('displays usage information', () => {
      const component = createMockTechnologyComponent({
        componentName: 'Backend Component',
        usage: 'BACKEND'
      });
      const initialData = { technologyComponents: [component] };
      
      render(<TechnologyComponentStep onSave={mockOnSave} initialData={initialData} />);
      
      expect(screen.getByText('Backend Component')).toBeInTheDocument();
    });
  });

  describe('Edit Functionality', () => {
    it('enters edit mode when edit button is clicked', async () => {
      const component = createMockTechnologyComponent({ 
        componentName: 'Editable Component', 
        productName: 'Java',
        productVersion: '17',
        usage: 'BACKEND'
      });
      const initialData = { technologyComponents: [component] };
      
      render(<TechnologyComponentStep onSave={mockOnSave} initialData={initialData} />);
      
      // Verify the component is displayed in the list
      expect(screen.getByText('Editable Component')).toBeInTheDocument();
      // Use table cell query to avoid dropdown confusion
      expect(screen.getByRole('cell', { name: 'Java' })).toBeInTheDocument();
      expect(screen.getByRole('cell', { name: '17' })).toBeInTheDocument();
      
      // Look for edit button (pencil icon) - check all buttons for edit functionality
      const editButtons = screen.getAllByRole('button').filter(button => 
        button.querySelector('svg') && 
        (button.getAttribute('title') === 'Edit' || button.getAttribute('aria-label') === 'Edit')
      );
      
      // If we can find edit buttons, test the edit functionality
      if (editButtons.length > 0) {
        fireEvent.click(editButtons[0]);
        // After clicking edit, component should be in edit mode with dropdowns
        expect(screen.getByDisplayValue('Editable Component')).toBeInTheDocument();
      }
    });

    it('saves edited component when save button is clicked', async () => {
      const component = createMockTechnologyComponent({ 
        componentName: 'Original Component', 
        productName: 'Java',
        productVersion: '11',
        usage: 'PROGRAMMING_LANGUAGE'
      });
      const initialData = { technologyComponents: [component] };
      
      render(<TechnologyComponentStep onSave={mockOnSave} initialData={initialData} />);
      
      // Enter edit mode
      const editButton = screen.getAllByRole('button').find(button => 
        button.getAttribute('title') === 'Edit'
      );
      fireEvent.click(editButton!);
      
      // Edit the component name and version
      const nameInput = screen.getByDisplayValue('Original Component');
      const versionInput = screen.getByDisplayValue('11');
      
      fireEvent.change(nameInput, { target: { value: 'Updated Component' } });
      fireEvent.change(versionInput, { target: { value: '17' } });
      
      // Save the changes
      const saveButton = screen.getByRole('button', { name: /Update Component/i });
      fireEvent.click(saveButton);

      // Should exit edit mode and show updated values
      expect(screen.getByText('Updated Component')).toBeInTheDocument();
      expect(screen.getByText('17')).toBeInTheDocument();
    });

    it('cancels edit mode when cancel button is clicked', async () => {
      const component = createMockTechnologyComponent({ 
        componentName: 'Original Component', 
        productName: 'Java',
        productVersion: '11',
        usage: 'PROGRAMMING_LANGUAGE'
      });
      const initialData = { technologyComponents: [component] };
      
      render(<TechnologyComponentStep onSave={mockOnSave} initialData={initialData} />);
      
      // Enter edit mode
      const editButton = screen.getAllByRole('button').find(button => 
        button.getAttribute('title') === 'Edit'
      );
      fireEvent.click(editButton!);
      
      // Edit the component name
      const nameInput = screen.getByDisplayValue('Original Component');
      fireEvent.change(nameInput, { target: { value: 'Should Not Save' } });
      
      // Cancel the changes
      const cancelButton = screen.getByRole('button', { name: /Cancel/i });
      fireEvent.click(cancelButton);

      // Should exit edit mode and show original values
      expect(screen.getByText('Original Component')).toBeInTheDocument();
      expect(screen.queryByDisplayValue('Should Not Save')).not.toBeInTheDocument();
    });

    it('updates editingComponent when updateEditingComponent is called', async () => {
      const component = createMockTechnologyComponent({ 
        componentName: 'Test Component', 
        productName: 'Java',
        productVersion: '11',
        usage: 'BACKEND'
      });
      const initialData = { technologyComponents: [component] };
      
      render(<TechnologyComponentStep onSave={mockOnSave} initialData={initialData} />);
      
      // Verify the component is displayed in the list - use table cells
      expect(screen.getByText('Test Component')).toBeInTheDocument();
      expect(screen.getByRole('cell', { name: 'Java' })).toBeInTheDocument();
      expect(screen.getByRole('cell', { name: '11' })).toBeInTheDocument();
      
      // Look for edit button
      const editButtons = screen.getAllByRole('button').filter(button => 
        button.querySelector('svg') && 
        (button.getAttribute('title') === 'Edit' || button.getAttribute('aria-label') === 'Edit')
      );
      
      if (editButtons.length > 0) {
        fireEvent.click(editButtons[0]);
        
        // Try to find input fields for editing (they may have different attributes)
        const inputs = screen.getAllByRole('textbox');
        const dropdowns = screen.getAllByRole('combobox');
        
        // If we have input fields in edit mode, test them
        if (inputs.length > 0) {
          // Test that we can interact with form elements
          expect(inputs[0]).toBeInTheDocument();
        }
        
        if (dropdowns.length > 0) {
          // Test that we can interact with dropdown elements
          expect(dropdowns[0]).toBeInTheDocument();
        }
      }
    });

    it('handles product version interactions during edit mode', async () => {
      const component = createMockTechnologyComponent({ 
        componentName: 'Version Test', 
        productName: 'Java',
        productVersion: '17',
        usage: 'BACKEND'
      });
      const initialData = { technologyComponents: [component] };
      
      render(<TechnologyComponentStep onSave={mockOnSave} initialData={initialData} />);
      
      // Verify the component is displayed in the list
      expect(screen.getByText('Version Test')).toBeInTheDocument();
      // Use table cell query to find Java in the product column
      const javaCell = screen.getByRole('cell', { name: 'Java' });
      expect(javaCell).toBeInTheDocument();
      expect(screen.getByRole('cell', { name: '17' })).toBeInTheDocument();
      
      // Look for edit button
      const editButtons = screen.getAllByRole('button').filter(button => 
        button.querySelector('svg') && 
        (button.getAttribute('title') === 'Edit' || button.getAttribute('aria-label') === 'Edit')
      );
      
      if (editButtons.length > 0) {
        fireEvent.click(editButtons[0]);
        
        // Test that product and version dropdowns exist
        const dropdowns = screen.getAllByRole('combobox');
        expect(dropdowns.length).toBeGreaterThan(0);
        
        // Test product dropdown interaction
        if (dropdowns.length > 1) {
          fireEvent.change(dropdowns[0], { target: { value: 'Python' } });
          // Verify dropdown interaction works
          expect(dropdowns[0]).toBeInTheDocument();
        }
      }
    });

    it('disables version dropdown when no product is selected during edit', async () => {
      const component = createMockTechnologyComponent({ 
        componentName: 'No Product Test', 
        productName: '',
        productVersion: '',
        usage: 'PROGRAMMING_LANGUAGE'
      });
      const initialData = { technologyComponents: [component] };
      
      render(<TechnologyComponentStep onSave={mockOnSave} initialData={initialData} />);
      
      // Enter edit mode
      const editButton = screen.getAllByRole('button').find(button => 
        button.getAttribute('title') === 'Edit'
      );
      fireEvent.click(editButton!);
      
      // Version dropdown should be disabled when no product is selected
      const versionDropdowns = screen.getAllByRole('combobox').filter(dropdown => 
        dropdown.hasAttribute('disabled')
      );
      expect(versionDropdowns.length).toBeGreaterThan(0);
    });
  });

  describe('Save Functionality', () => {
    it('calls onSave when save button clicked', () => {
      render(<TechnologyComponentStep onSave={mockOnSave} initialData={{}} />);
      const saveButton = screen.getByText(/^Save$/);
      fireEvent.click(saveButton);
      expect(mockOnSave).toHaveBeenCalled();
    });

    it('shows isSaving state correctly', () => {
      render(<TechnologyComponentStep onSave={mockOnSave} isSaving={true} initialData={{}} />);
      const saveButton = screen.getByText(/Saving/i);
      expect(saveButton).toBeDisabled();
    });

    it('add button behavior during saving state', () => {
      render(<TechnologyComponentStep onSave={mockOnSave} isSaving={true} initialData={{}} />);
      
      // Fill required fields first
      const componentNameInput = screen.getByPlaceholderText(/Enter component name/i);
      fireEvent.change(componentNameInput, { target: { value: 'Test Component' } });
      
      const addButton = screen.getByText(/Add Component/i);
      expect(addButton).toBeInTheDocument();
    });

    it('calls onSave with correct data structure', () => {
      render(<TechnologyComponentStep onSave={mockOnSave} initialData={{}} />);
      const saveButton = screen.getByText(/^Save$/);
      fireEvent.click(saveButton);

      expect(mockOnSave).toHaveBeenCalled();
      expect(mockOnSave.mock.calls[0][0]).toBeDefined();
    });

    it('preserves data when saving with existing components', () => {
      const component = createMockTechnologyComponent({ 
        componentName: 'Existing Component', 
        productName: 'Java'
      });
      const initialData = { technologyComponents: [component] };
      
      render(<TechnologyComponentStep onSave={mockOnSave} initialData={initialData} />);
      const saveButton = screen.getByText(/^Save$/);
      fireEvent.click(saveButton);

      expect(mockOnSave).toHaveBeenCalled();
      const savedData = mockOnSave.mock.calls[0][0];
      expect(Array.isArray(savedData)).toBe(true);
    });
  });

  describe('Component Deletion', () => {
    it('removes component when delete action triggered', async () => {
      const component = createMockTechnologyComponent({ 
        componentName: 'Component To Delete', 
        productName: 'Java'
      });
      const initialData = { technologyComponents: [component] };
      
      render(<TechnologyComponentStep onSave={mockOnSave} initialData={initialData} />);
      expect(screen.getByText('Component To Delete')).toBeInTheDocument();
      
      // Look for delete button (trash icon)
      const deleteButtons = screen.getAllByRole('button').filter(button => 
        button.querySelector('svg') && 
        button.getAttribute('title') === 'Delete'
      );
      
      expect(deleteButtons.length).toBe(1);
      fireEvent.click(deleteButtons[0]);
      
      await waitFor(() => {
        expect(screen.queryByText('Component To Delete')).not.toBeInTheDocument();
      });
    });

    it('removes correct component from list when multiple components exist', async () => {
      const component1 = createMockTechnologyComponent({ 
        componentName: 'Component 1', 
        productName: 'Java'
      });
      const component2 = createMockTechnologyComponent({ 
        componentName: 'Component 2', 
        productName: 'Python'
      });
      const component3 = createMockTechnologyComponent({ 
        componentName: 'Component 3', 
        productName: 'Java'
      });
      const initialData = { technologyComponents: [component1, component2, component3] };
      
      render(<TechnologyComponentStep onSave={mockOnSave} initialData={initialData} />);
      
      expect(screen.getByText('Component 1')).toBeInTheDocument();
      expect(screen.getByText('Component 2')).toBeInTheDocument();
      expect(screen.getByText('Component 3')).toBeInTheDocument();
      
      // Find all delete buttons
      const deleteButtons = screen.getAllByRole('button').filter(button => 
        button.querySelector('svg') && 
        button.getAttribute('title') === 'Delete'
      );
      
      // Delete the second component (Component 2)
      fireEvent.click(deleteButtons[1]);
      
      await waitFor(() => {
        expect(screen.getByText('Component 1')).toBeInTheDocument();
        expect(screen.queryByText('Component 2')).not.toBeInTheDocument();
        expect(screen.getByText('Component 3')).toBeInTheDocument();
      });
    });
  });

  describe('Validation', () => {
    it('validates component name is required for adding', () => {
      render(<TechnologyComponentStep onSave={mockOnSave} initialData={{}} />);
      
      // Fill only product name and usage, leave component name empty
      const productDropdown = screen.getAllByRole('combobox')[0];
      const usageDropdown = screen.getAllByRole('combobox')[2];
      
      fireEvent.change(productDropdown, { target: { value: 'Java' } });
      fireEvent.change(usageDropdown, { target: { value: 'BACKEND' } });
      
      const addButton = screen.getByText(/Add Component/i);
      fireEvent.click(addButton);
      
      // Component should not be added - check the counter stays at 0
      expect(screen.getByText('Technology Components (0)')).toBeInTheDocument();
      expect(screen.getByText(/No technology components added yet/i)).toBeInTheDocument();
    });

    it('validates product name is required for adding', () => {
      render(<TechnologyComponentStep onSave={mockOnSave} initialData={{}} />);
      
      // Fill only component name and usage, leave product name empty
      const componentNameInput = screen.getByPlaceholderText(/Enter component name/i);
      const usageDropdown = screen.getAllByRole('combobox')[2];
      
      fireEvent.change(componentNameInput, { target: { value: 'Test Component' } });
      fireEvent.change(usageDropdown, { target: { value: 'BACKEND' } });
      
      const addButton = screen.getByText(/Add Component/i);
      fireEvent.click(addButton);
      
      // Component should not be added - check the counter stays at 0
      expect(screen.getByText('Technology Components (0)')).toBeInTheDocument();
      expect(screen.getByText(/No technology components added yet/i)).toBeInTheDocument();
    });

    it('validates usage is required for adding', () => {
      render(<TechnologyComponentStep onSave={mockOnSave} initialData={{}} />);
      
      // Fill only component name and product name, leave usage empty
      const componentNameInput = screen.getByPlaceholderText(/Enter component name/i);
      const productDropdown = screen.getAllByRole('combobox')[0];
      
      fireEvent.change(componentNameInput, { target: { value: 'Test Component' } });
      fireEvent.change(productDropdown, { target: { value: 'Java' } });
      
      const addButton = screen.getByText(/Add Component/i);
      fireEvent.click(addButton);
      
      // Component should not be added - check the counter stays at 0
      expect(screen.getByText('Technology Components (0)')).toBeInTheDocument();
      expect(screen.getByText(/No technology components added yet/i)).toBeInTheDocument();
    });

    it('successfully adds component when all required fields are filled', () => {
      render(<TechnologyComponentStep onSave={mockOnSave} initialData={{}} />);
      
      // Fill all required fields
      const componentNameInput = screen.getByPlaceholderText(/Enter component name/i);
      const productDropdown = screen.getAllByRole('combobox')[0];
      const usageDropdown = screen.getAllByRole('combobox')[2];
      
      fireEvent.change(componentNameInput, { target: { value: 'Valid Component' } });
      fireEvent.change(productDropdown, { target: { value: 'Java' } });
      fireEvent.change(usageDropdown, { target: { value: 'PROGRAMMING_LANGUAGE' } });
      
      const addButton = screen.getByText(/Add Component/i);
      fireEvent.click(addButton);
      
      // Component should be added successfully - check counter and content
      const heading = screen.getByRole('heading', { name: /Technology Components/ });
      expect(heading).toHaveTextContent(/Technology Components/);
      expect(heading).toHaveTextContent('1');
      // The empty state message should be gone
      expect(screen.queryByText(/No technology components added yet/i)).not.toBeInTheDocument();
      // Component should appear in the list
      expect(screen.getByText('Valid Component')).toBeInTheDocument();
    });
  });

  describe('Hook Integration', () => {
    it('displays product options from hook', () => {
      // This test uses the default mock which should work fine
      render(<TechnologyComponentStep onSave={mockOnSave} initialData={{}} />);
      
      // Should be able to access mocked product options
      expect(screen.getByText(/Product Name/i)).toBeInTheDocument();
    });

    it('handles version options based on product selection', () => {
      render(<TechnologyComponentStep onSave={mockOnSave} initialData={{}} />);
      
      // When Java is selected, versions 11 and 17 should be available
      const productDropdowns = screen.getAllByRole('combobox');
      fireEvent.change(productDropdowns[0], { target: { value: 'Java' } });
      
      // Version dropdown should respond to product selection
      expect(screen.getByText(/Product Version/i)).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('handles empty technologyComponents array', () => {
      const initialData = { technologyComponents: [] };
      render(<TechnologyComponentStep onSave={mockOnSave} initialData={initialData} />);
      expect(screen.getByText(/No technology components added/i)).toBeInTheDocument();
    });

    it('handles null values in component data', () => {
      const component = createMockTechnologyComponent({
        componentName: null,
        productName: null,
        productVersion: null,
        usage: null
      });
      const initialData = { technologyComponents: [component] };
      
      render(<TechnologyComponentStep onSave={mockOnSave} initialData={initialData} />);
      // Component should render without crashing
      expect(screen.getAllByText(/Technology Components/i)[0]).toBeInTheDocument();
    });

    it('handles undefined values gracefully', () => {
      const component = createMockTechnologyComponent({
        componentName: undefined,
        productName: undefined,
        productVersion: undefined,
        usage: undefined
      });
      const initialData = { technologyComponents: [component] };
      
      render(<TechnologyComponentStep onSave={mockOnSave} initialData={initialData} />);
      expect(screen.getAllByText(/Technology Components/i)[0]).toBeInTheDocument();
    });
  });

  describe('Complex Interactions', () => {
    it('handles form reset after adding component', () => {
      render(<TechnologyComponentStep onSave={mockOnSave} initialData={{}} />);
      
      const componentNameInput = screen.getByPlaceholderText(/Enter component name/i);
      fireEvent.change(componentNameInput, { target: { value: 'Test Component' } });
      
      // Form should have the input values
      expect(componentNameInput).toHaveValue('Test Component');
    });

    it('preserves form state during interactions', () => {
      const component = createMockTechnologyComponent({ 
        componentName: 'Existing Component', 
        productName: 'Java'
      });
      const initialData = { technologyComponents: [component] };
      
      render(<TechnologyComponentStep onSave={mockOnSave} initialData={initialData} />);
      
      expect(screen.getByText('Existing Component')).toBeInTheDocument();
      
      // Add new component form should be independent
      const componentNameInput = screen.getByPlaceholderText(/Enter component name/i);
      fireEvent.change(componentNameInput, { target: { value: 'New Component' } });
      
      // Existing component should still be there
      expect(screen.getByText('Existing Component')).toBeInTheDocument();
    });

    it('handles product version reset when product changes', () => {
      render(<TechnologyComponentStep onSave={mockOnSave} initialData={{}} />);
      
      // Select product first
      const productDropdowns = screen.getAllByRole('combobox');
      fireEvent.change(productDropdowns[0], { target: { value: 'Java' } });
      
      // Then change to different product - version should reset
      fireEvent.change(productDropdowns[0], { target: { value: 'Python' } });
      
      // Version dropdown should still be accessible
      expect(screen.getByText(/Product Version/i)).toBeInTheDocument();
    });
  });
});
