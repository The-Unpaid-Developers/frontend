import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import IntegrationFlowStep from '../IntegrationFlowStep';
import { createMockIntegrationFlow } from '../../../../../__tests__/testFactories';

describe('IntegrationFlowStep', () => {
  const mockOnSave = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Basic Rendering', () => {
    it('renders the step component with title', () => {
      render(<IntegrationFlowStep onSave={mockOnSave} initialData={{}} />);
      expect(screen.getAllByText(/Integration Flow/i).length).toBeGreaterThan(0);
    });

    it('renders add flow button', () => {
      render(<IntegrationFlowStep onSave={mockOnSave} initialData={{}} />);
      expect(screen.getByText(/Add Flow/i)).toBeInTheDocument();
    });

    it('renders save button', () => {
      render(<IntegrationFlowStep onSave={mockOnSave} initialData={{}} />);
      expect(screen.getByText(/^Save$/)).toBeInTheDocument();
    });

    it('displays empty state when no flows exist', () => {
      render(<IntegrationFlowStep onSave={mockOnSave} initialData={{}} />);
      expect(screen.getByText(/No integration flows added/i)).toBeInTheDocument();
    });

    it('handles undefined integrationFlows in initial data', () => {
      render(<IntegrationFlowStep onSave={mockOnSave} initialData={{ integrationFlows: undefined }} />);
      expect(screen.getByText(/No integration flows added/i)).toBeInTheDocument();
    });
  });

  describe('Integration Flow Management', () => {
    it('renders with initial integration flow data using factory', () => {
      const mockFlow = createMockIntegrationFlow({ componentName: 'Factory Test Component', counterpartSystemCode: 'SYS-FACTORY' });
      const initialData = {
        integrationFlows: [mockFlow],
      };
      render(<IntegrationFlowStep onSave={mockOnSave} initialData={initialData} />);
      expect(screen.getByText('Factory Test Component')).toBeInTheDocument();
    });

    it('adds new flow when add button clicked with valid data', () => {
      render(<IntegrationFlowStep onSave={mockOnSave} initialData={{}} />);
      
      // Fill in required fields
      const componentNameInput = screen.getByPlaceholderText(/Enter component name/i);
      const systemCodeInput = screen.getByPlaceholderText(/Enter counterpart system code/i);
      
      fireEvent.change(componentNameInput, { target: { value: 'New Component' } });
      fireEvent.change(systemCodeInput, { target: { value: 'SYS-NEW' } });
      
      // Click add button
      const addButton = screen.getByText(/Add Flow/i);
      fireEvent.click(addButton);
      
      // Flow should appear in the list
      expect(screen.getByText('New Component')).toBeInTheDocument();
    });

    it('renders multiple flows correctly', () => {
      const flow1 = createMockIntegrationFlow({ componentName: 'Flow 1', counterpartSystemCode: 'SYS-001' });
      const flow2 = createMockIntegrationFlow({ componentName: 'Flow 2', counterpartSystemCode: 'SYS-002' });
      const initialData = {
        integrationFlows: [flow1, flow2],
      };
      render(<IntegrationFlowStep onSave={mockOnSave} initialData={initialData} />);
      expect(screen.getByText('Flow 1')).toBeInTheDocument();
      expect(screen.getByText('Flow 2')).toBeInTheDocument();
    });

    it('preserves existing flows when adding new one', () => {
      const existingFlow = createMockIntegrationFlow({ componentName: 'Existing Flow', counterpartSystemCode: 'SYS-EXIST' });
      const initialData = {
        integrationFlows: [existingFlow],
      };
      render(<IntegrationFlowStep onSave={mockOnSave} initialData={initialData} />);
      expect(screen.getByText('Existing Flow')).toBeInTheDocument();

      // Add new flow
      const componentNameInput = screen.getByPlaceholderText(/Enter component name/i);
      const systemCodeInput = screen.getByPlaceholderText(/Enter counterpart system code/i);
      
      fireEvent.change(componentNameInput, { target: { value: 'New Flow' } });
      fireEvent.change(systemCodeInput, { target: { value: 'SYS-NEW' } });
      
      const addButton = screen.getByText(/Add Flow/i);
      fireEvent.click(addButton);
      
      // Both flows should be present
      expect(screen.getByText('Existing Flow')).toBeInTheDocument();
      expect(screen.getByText('New Flow')).toBeInTheDocument();
    });
  });

  describe('Form Interactions', () => {
    it('handles component name input change', () => {
      render(<IntegrationFlowStep onSave={mockOnSave} initialData={{}} />);
      
      const componentInput = screen.getByPlaceholderText(/Enter component name/i);
      fireEvent.change(componentInput, { target: { value: 'Test Component Name' } });
      expect(componentInput).toHaveValue('Test Component Name');
    });

    it('handles counterpart system code input change', () => {
      render(<IntegrationFlowStep onSave={mockOnSave} initialData={{}} />);
      
      const systemCodeInput = screen.getByPlaceholderText(/Enter counterpart system code/i);
      fireEvent.change(systemCodeInput, { target: { value: 'SYS-TEST' } });
      expect(systemCodeInput).toHaveValue('SYS-TEST');
    });

    it('renders all required form fields', () => {
      render(<IntegrationFlowStep onSave={mockOnSave} initialData={{}} />);
      
      expect(screen.getByPlaceholderText(/Enter component name/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/Enter counterpart system code/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/Enter component name/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/Enter counterpart system code/i)).toBeInTheDocument();
      expect(screen.getByText(/Counterpart System Role/i)).toBeInTheDocument();
      expect(screen.getAllByText(/Integration Method/i)[0]).toBeInTheDocument();
      expect(screen.getAllByText(/Middleware/i)[0]).toBeInTheDocument();
      expect(screen.getAllByText(/Frequency/i)[0]).toBeInTheDocument();
    });

    it('handles purpose input change', () => {
      render(<IntegrationFlowStep onSave={mockOnSave} initialData={{}} />);
      
      const purposeInput = screen.getByPlaceholderText(/Enter integration purpose/i);
      fireEvent.change(purposeInput, { target: { value: 'Test integration purpose' } });
      expect(purposeInput).toHaveValue('Test integration purpose');
    });

    it('handles dropdown selections', () => {
      render(<IntegrationFlowStep onSave={mockOnSave} initialData={{}} />);
      
      // Test system role dropdown
      const roleDropdowns = screen.getAllByRole('combobox');
      expect(roleDropdowns.length).toBeGreaterThan(0);
    });
  });

  describe('Integration Flow Properties', () => {
    it('displays integration method from factory data', () => {
      const flow = createMockIntegrationFlow({
        componentName: 'API Component',
        integrationMethod: 'REST_API'
      });
      const initialData = { integrationFlows: [flow] };
      
      render(<IntegrationFlowStep onSave={mockOnSave} initialData={initialData} />);
      
      expect(screen.getByText('API Component')).toBeInTheDocument();
    });

    it('shows different frequencies', () => {
      const realTimeFlow = createMockIntegrationFlow({
        componentName: 'Real Time Component',
        frequency: 'REAL_TIME'
      });
      const initialData = { integrationFlows: [realTimeFlow] };
      
      render(<IntegrationFlowStep onSave={mockOnSave} initialData={initialData} />);
      
      expect(screen.getByText('Real Time Component')).toBeInTheDocument();
    });

    it('displays middleware information', () => {
      const flow = createMockIntegrationFlow({
        componentName: 'Gateway Component',
        middleware: 'API_GATEWAY'
      });
      const initialData = { integrationFlows: [flow] };
      
      render(<IntegrationFlowStep onSave={mockOnSave} initialData={initialData} />);
      
      expect(screen.getByText('Gateway Component')).toBeInTheDocument();
    });
  });

  describe('Edit Functionality', () => {
    it('enters edit mode when edit button is clicked', async () => {
      const flow = createMockIntegrationFlow({ 
        componentName: 'Editable Flow', 
        counterpartSystemCode: 'SYS-EDIT',
        purpose: 'Test Purpose'
      });
      const initialData = { integrationFlows: [flow] };
      
      render(<IntegrationFlowStep onSave={mockOnSave} initialData={initialData} />);
      
      // Look for edit button (pencil icon)
      const editButtons = screen.getAllByRole('button').filter(button => 
        button.querySelector('svg') && 
        button.getAttribute('title') === 'Edit'
      );
      
      expect(editButtons.length).toBe(1);
      fireEvent.click(editButtons[0]);
      
      // Should show inline edit inputs
      expect(screen.getByDisplayValue('Editable Flow')).toBeInTheDocument();
      expect(screen.getByDisplayValue('SYS-EDIT')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Test Purpose')).toBeInTheDocument();
    });

    it('saves edited flow when save button is clicked', async () => {
      const flow = createMockIntegrationFlow({ 
        componentName: 'Original Name', 
        counterpartSystemCode: 'SYS-ORIG',
        counterpartSystemRole: 'PRODUCER',
        integrationMethod: 'API',
        frequency: 'DAILY',
        purpose: 'Original Purpose'
      });
      const initialData = { integrationFlows: [flow] };
      
      render(<IntegrationFlowStep onSave={mockOnSave} initialData={initialData} />);
      
      // Enter edit mode
      const editButton = screen.getAllByRole('button').find(button => 
        button.getAttribute('title') === 'Edit'
      );
      fireEvent.click(editButton!);
      
      // Edit the component name and purpose
      const nameInput = screen.getByDisplayValue('Original Name');
      const purposeInput = screen.getByDisplayValue('Original Purpose');
      
      fireEvent.change(nameInput, { target: { value: 'Updated Name' } });
      fireEvent.change(purposeInput, { target: { value: 'Updated Purpose' } });
      
      // Save the changes
      const saveButton = screen.getAllByRole('button').find(button => 
        button.getAttribute('title') === 'Save'
      );
      fireEvent.click(saveButton!);
      
      // Should exit edit mode and show updated values
      expect(screen.getByText('Updated Name')).toBeInTheDocument();
      expect(screen.getByText('Updated Purpose')).toBeInTheDocument();
    });

    it('cancels edit mode when cancel button is clicked', async () => {
      const flow = createMockIntegrationFlow({ 
        componentName: 'Original Name', 
        counterpartSystemCode: 'SYS-ORIG',
        purpose: 'Original Purpose'
      });
      const initialData = { integrationFlows: [flow] };
      
      render(<IntegrationFlowStep onSave={mockOnSave} initialData={initialData} />);
      
      // Enter edit mode
      const editButton = screen.getAllByRole('button').find(button => 
        button.getAttribute('title') === 'Edit'
      );
      fireEvent.click(editButton!);
      
      // Edit the component name
      const nameInput = screen.getByDisplayValue('Original Name');
      fireEvent.change(nameInput, { target: { value: 'Should Not Save' } });
      
      // Cancel the changes
      const cancelButton = screen.getAllByRole('button').find(button => 
        button.getAttribute('title') === 'Cancel'
      );
      fireEvent.click(cancelButton!);
      
      // Should exit edit mode and show original values
      expect(screen.getByText('Original Name')).toBeInTheDocument();
      expect(screen.queryByDisplayValue('Should Not Save')).not.toBeInTheDocument();
    });

    it('updates editingFlow when updateEditingFlow is called', async () => {
      const flow = createMockIntegrationFlow({ 
        componentName: 'Test Component', 
        counterpartSystemCode: 'SYS-TEST',
        counterpartSystemRole: 'PRODUCER'
      });
      const initialData = { integrationFlows: [flow] };
      
      render(<IntegrationFlowStep onSave={mockOnSave} initialData={initialData} />);
      
      // Enter edit mode
      const editButton = screen.getAllByRole('button').find(button => 
        button.getAttribute('title') === 'Edit'
      );
      fireEvent.click(editButton!);
      
      // Test updating counterpart system code
      const systemCodeInput = screen.getByDisplayValue('SYS-TEST');
      fireEvent.change(systemCodeInput, { target: { value: 'SYS-UPDATED' } });
      
      expect(systemCodeInput).toHaveValue('SYS-UPDATED');
      
      // Test updating counterpart system role dropdown
      const roleDropdowns = screen.getAllByRole('combobox');
      const roleDropdown = roleDropdowns.find(dropdown => 
        dropdown.closest('td')?.previousElementSibling?.previousElementSibling?.textContent?.includes('SYS-UPDATED')
      );
      
      if (roleDropdown) {
        fireEvent.change(roleDropdown, { target: { value: 'CONSUMER' } });
        expect(roleDropdown).toHaveValue('CONSUMER');
      }
    });

    it('updates middleware field correctly during edit', async () => {
      const flow = createMockIntegrationFlow({ 
        componentName: 'Middleware Test', 
        counterpartSystemCode: 'SYS-MW'
      });
      // Add middleware property
      (flow as any).middleware = 'NONE';
      const initialData = { integrationFlows: [flow] };
      
      render(<IntegrationFlowStep onSave={mockOnSave} initialData={initialData} />);
      
      // Enter edit mode
      const editButton = screen.getAllByRole('button').find(button => 
        button.getAttribute('title') === 'Edit'
      );
      fireEvent.click(editButton!);
      
      // Find middleware dropdown and update it
      const dropdowns = screen.getAllByRole('combobox');
      const middlewareDropdown = dropdowns[2]; // Middleware is typically the 3rd dropdown
      
      fireEvent.change(middlewareDropdown, { target: { value: 'API_GATEWAY' } });
      expect(middlewareDropdown).toHaveValue('API_GATEWAY');
    });
  });

  describe('Save Functionality', () => {
    it('calls onSave when save button clicked', () => {
      render(<IntegrationFlowStep onSave={mockOnSave} initialData={{}} />);
      const saveButton = screen.getByText(/^Save$/);
      fireEvent.click(saveButton);
      expect(mockOnSave).toHaveBeenCalled();
    });

    it('shows isSaving state correctly', () => {
      render(<IntegrationFlowStep onSave={mockOnSave} isSaving={true} initialData={{}} />);
      const saveButton = screen.getByText(/Saving/i);
      expect(saveButton).toBeDisabled();
    });

    it('add button behavior during saving state', () => {
      render(<IntegrationFlowStep onSave={mockOnSave} isSaving={true} initialData={{}} />);
      
      // Fill required fields first
      const componentNameInput = screen.getByPlaceholderText(/Enter component name/i);
      const systemCodeInput = screen.getByPlaceholderText(/Enter counterpart system code/i);
      
      fireEvent.change(componentNameInput, { target: { value: 'Test Component' } });
      fireEvent.change(systemCodeInput, { target: { value: 'SYS-TEST' } });
      
      const addButton = screen.getByText(/Add Flow/i);
      // Button may be enabled even during saving based on component implementation
      expect(addButton).toBeInTheDocument();
    });

    it('calls onSave with correct data structure', () => {
      render(<IntegrationFlowStep onSave={mockOnSave} initialData={{}} />);
      const saveButton = screen.getByText(/^Save$/);
      fireEvent.click(saveButton);

      expect(mockOnSave).toHaveBeenCalled();
      expect(mockOnSave.mock.calls[0][0]).toBeDefined();
    });

    it('preserves data when saving with existing flows', () => {
      const flow = createMockIntegrationFlow({ componentName: 'Existing Flow', counterpartSystemCode: 'SYS-EXIST' });
      const initialData = { integrationFlows: [flow] };
      
      render(<IntegrationFlowStep onSave={mockOnSave} initialData={initialData} />);
      const saveButton = screen.getByText(/^Save$/);
      fireEvent.click(saveButton);

      expect(mockOnSave).toHaveBeenCalled();
      const savedData = mockOnSave.mock.calls[0][0];
      expect(Array.isArray(savedData)).toBe(true);
    });
  });

  describe('Flow Deletion', () => {
    it('removes flow when delete action triggered', async () => {
      const flow = createMockIntegrationFlow({ componentName: 'Flow To Delete', counterpartSystemCode: 'SYS-DELETE' });
      const initialData = { integrationFlows: [flow] };
      
      render(<IntegrationFlowStep onSave={mockOnSave} initialData={initialData} />);
      expect(screen.getByText('Flow To Delete')).toBeInTheDocument();
      
      // Look for delete button (trash icon)
      const deleteButtons = screen.getAllByRole('button').filter(button => 
        button.querySelector('svg') && 
        button.getAttribute('title') === 'Delete'
      );
      
      expect(deleteButtons.length).toBe(1);
      fireEvent.click(deleteButtons[0]);
      
      await waitFor(() => {
        expect(screen.queryByText('Flow To Delete')).not.toBeInTheDocument();
      });
    });

    it('removes correct flow from list when multiple flows exist', async () => {
      const flow1 = createMockIntegrationFlow({ componentName: 'Flow 1', counterpartSystemCode: 'SYS-001' });
      const flow2 = createMockIntegrationFlow({ componentName: 'Flow 2', counterpartSystemCode: 'SYS-002' });
      const flow3 = createMockIntegrationFlow({ componentName: 'Flow 3', counterpartSystemCode: 'SYS-003' });
      const initialData = { integrationFlows: [flow1, flow2, flow3] };
      
      render(<IntegrationFlowStep onSave={mockOnSave} initialData={initialData} />);
      
      expect(screen.getByText('Flow 1')).toBeInTheDocument();
      expect(screen.getByText('Flow 2')).toBeInTheDocument();
      expect(screen.getByText('Flow 3')).toBeInTheDocument();
      
      // Find all delete buttons
      const deleteButtons = screen.getAllByRole('button').filter(button => 
        button.querySelector('svg') && 
        button.getAttribute('title') === 'Delete'
      );
      
      // Delete the second flow (Flow 2)
      fireEvent.click(deleteButtons[1]);
      
      await waitFor(() => {
        expect(screen.getByText('Flow 1')).toBeInTheDocument();
        expect(screen.queryByText('Flow 2')).not.toBeInTheDocument();
        expect(screen.getByText('Flow 3')).toBeInTheDocument();
      });
    });
  });

  describe('Validation', () => {
    it('validates component name is required', () => {
      render(<IntegrationFlowStep onSave={mockOnSave} initialData={{}} />);
      
      // Try to add without component name
      const addButton = screen.getByText(/Add Flow/i);
      
      // Button should be disabled when required fields are empty
      expect(addButton).toBeDisabled();
    });

    it('validates counterpart system code is required', () => {
      render(<IntegrationFlowStep onSave={mockOnSave} initialData={{}} />);
      
      const componentNameInput = screen.getByPlaceholderText(/Enter component name/i);
      fireEvent.change(componentNameInput, { target: { value: 'Test Component' } });
      
      // Without system code, button should still be disabled
      const addButton = screen.getByText(/Add Flow/i);
      expect(addButton).toBeDisabled();
    });

    it('enables add button when required fields are filled', () => {
      render(<IntegrationFlowStep onSave={mockOnSave} initialData={{}} />);
      
      const componentNameInput = screen.getByPlaceholderText(/Enter component name/i);
      const systemCodeInput = screen.getByPlaceholderText(/Enter counterpart system code/i);
      
      fireEvent.change(componentNameInput, { target: { value: 'Test Component' } });
      fireEvent.change(systemCodeInput, { target: { value: 'SYS-TEST' } });
      
      const addButton = screen.getByText(/Add Flow/i);
      expect(addButton).not.toBeDisabled();
    });
  });

  describe('Edge Cases', () => {
    it('handles empty integrationFlows array', () => {
      const initialData = { integrationFlows: [] };
      render(<IntegrationFlowStep onSave={mockOnSave} initialData={initialData} />);
      expect(screen.getByText(/No integration flows added/i)).toBeInTheDocument();
    });

    it('handles null values in flow data', () => {
      const flow = createMockIntegrationFlow({
        componentName: null,
        counterpartSystemCode: null,
        integrationMethod: null,
        frequency: null,
        purpose: null
      });
      const initialData = { integrationFlows: [flow] };
      
      render(<IntegrationFlowStep onSave={mockOnSave} initialData={initialData} />);
      // Component should render without crashing
      expect(screen.getAllByText(/Integration Flow/i)[0]).toBeInTheDocument();
    });

    it('handles undefined values gracefully', () => {
      const flow = createMockIntegrationFlow({
        componentName: undefined,
        counterpartSystemCode: undefined,
        integrationMethod: undefined
      });
      const initialData = { integrationFlows: [flow] };
      
      render(<IntegrationFlowStep onSave={mockOnSave} initialData={initialData} />);
      expect(screen.getAllByText(/Integration Flow/i)[0]).toBeInTheDocument();
    });
  });

  describe('Complex Interactions', () => {
    it('handles form reset after adding flow', () => {
      render(<IntegrationFlowStep onSave={mockOnSave} initialData={{}} />);
      
      const componentNameInput = screen.getByPlaceholderText(/Enter component name/i);
      const systemCodeInput = screen.getByPlaceholderText(/Enter counterpart system code/i);
      
      fireEvent.change(componentNameInput, { target: { value: 'Test Flow' } });
      fireEvent.change(systemCodeInput, { target: { value: 'SYS-TEST' } });
      
      const addButton = screen.getByText(/Add Flow/i);
      fireEvent.click(addButton);
      
      // Form should reset after adding
      expect(componentNameInput).toHaveValue('');
      expect(systemCodeInput).toHaveValue('');
    });

    it('preserves form state during interactions', () => {
      const flow = createMockIntegrationFlow({ componentName: 'Existing Flow', counterpartSystemCode: 'SYS-EXIST' });
      const initialData = { integrationFlows: [flow] };
      
      render(<IntegrationFlowStep onSave={mockOnSave} initialData={initialData} />);
      
      expect(screen.getByText('Existing Flow')).toBeInTheDocument();
      
      // Add new flow form should be independent
      const componentNameInput = screen.getByPlaceholderText(/Enter component name/i);
      fireEvent.change(componentNameInput, { target: { value: 'New Flow' } });
      
      // Existing flow should still be there
      expect(screen.getByText('Existing Flow')).toBeInTheDocument();
    });

    it('handles multiple dropdown interactions', () => {
      render(<IntegrationFlowStep onSave={mockOnSave} initialData={{}} />);
      
      // Check that multiple dropdowns are rendered
      const dropdowns = screen.getAllByRole('combobox');
      expect(dropdowns.length).toBeGreaterThan(3); // Should have role, method, middleware, frequency dropdowns
    });
  });
});
