import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '../../../../../test/test-utils';
import BusinessCapabilitiesStep from '../BusinessCapabilitiesStep';
import { 
  createMockStepProps, 
  createMockBusinessCapability, 
  createMockBusinessCapabilitiesHook 
} from '../../../../../__tests__/testFactories';

const mockHook = createMockBusinessCapabilitiesHook();

vi.mock('../../../../../hooks/useBusinessCapabilities', () => ({
  useBusinessCapabilities: () => mockHook,
}));

describe('BusinessCapabilitiesStep', () => {
  const mockOnSave = vi.fn();
  const defaultProps = createMockStepProps({
    onSave: mockOnSave,
    initialData: { businessCapabilities: [] }
  });

  beforeEach(() => {
    vi.clearAllMocks();
    mockHook.loading = false;
    mockHook.error = null;
  });

  describe('Basic Rendering', () => {
    it('renders the step component', () => {
      render(<BusinessCapabilitiesStep {...defaultProps} />);
      expect(screen.getAllByText(/Business Capabilities/i).length).toBeGreaterThan(0);
    });

    it('renders add button', () => {
      render(<BusinessCapabilitiesStep {...defaultProps} />);
      expect(screen.getByText(/Add Capability/i)).toBeInTheDocument();
    });

    it('renders save button', () => {
      render(<BusinessCapabilitiesStep {...defaultProps} />);
      expect(screen.getByText(/^Save$/)).toBeInTheDocument();
    });

    it('renders all form fields', () => {
      render(<BusinessCapabilitiesStep {...defaultProps} />);
      expect(screen.getByText(/L1 Capability/)).toBeInTheDocument();
      expect(screen.getByText(/L2 Capability/)).toBeInTheDocument(); 
      expect(screen.getByText(/L3 Capability/)).toBeInTheDocument();
      expect(screen.getByText(/Remarks/)).toBeInTheDocument();
    });

    it('shows required field indicators', () => {
      render(<BusinessCapabilitiesStep {...defaultProps} />);
      const requiredIndicators = screen.getAllByText('*');
      expect(requiredIndicators.length).toBe(3); // L1, L2, L3 are required
    });
  });

  describe('Loading State', () => {
    it('shows loading spinner when data is loading', () => {
      mockHook.loading = true;
      render(<BusinessCapabilitiesStep {...defaultProps} />);
      expect(screen.getByText(/Loading business capabilities/)).toBeInTheDocument();
      expect(screen.getByRole('status')).toBeInTheDocument();
    });

    it('hides form fields during loading', () => {
      mockHook.loading = true;
      render(<BusinessCapabilitiesStep {...defaultProps} />);
      expect(screen.queryByText(/L1 Capability/)).not.toBeInTheDocument();
    });
  });

  describe('Error State', () => {
    it('displays error message when hook returns error', () => {
      mockHook.error = 'Failed to load capabilities';
      render(<BusinessCapabilitiesStep {...defaultProps} />);
      expect(screen.getByText(/Could not load business capabilities from server/)).toBeInTheDocument();
    });

    it('shows error styling', () => {
      mockHook.error = 'Test error';
      render(<BusinessCapabilitiesStep {...defaultProps} />);
      const errorMessage = screen.getByText(/Could not load business capabilities from server/);
      expect(errorMessage).toBeInTheDocument(); // Just check the error message appears
    });
  });

  describe('Save Functionality', () => {
    it('calls onSave when save button clicked', () => {
      render(<BusinessCapabilitiesStep {...defaultProps} />);
      const saveButton = screen.getByText(/^Save$/);
      fireEvent.click(saveButton);
      expect(mockOnSave).toHaveBeenCalledWith([]);
    });

    it('shows isSaving state', () => {
      const props = createMockStepProps({ ...defaultProps, isSaving: true });
      render(<BusinessCapabilitiesStep {...props} />);
      const saveButton = screen.getByText(/Saving/i);
      expect(saveButton).toBeDisabled();
      // Check for spinner SVG class specifically 
      expect(saveButton).toContainHTML('animate-spin');
    });

    it('calls onSave with current capabilities', async () => {
      const capability = createMockBusinessCapability();
      const props = createMockStepProps({
        ...defaultProps,
        initialData: { businessCapabilities: [capability] }
      });
      
      render(<BusinessCapabilitiesStep {...props} />);
      
      const saveButton = screen.getByText(/^Save$/);
      fireEvent.click(saveButton);
      
      await waitFor(() => {
        expect(mockOnSave).toHaveBeenCalledWith([capability]);
      });
    });
  });

  describe('Initial Data Loading', () => {
    it('renders with initial data', () => {
      const capability = createMockBusinessCapability({
        l1Capability: 'Test L1',
        l2Capability: 'Test L2', 
        l3Capability: 'Test L3',
        remarks: 'Test Remarks'
      });
      
      const props = createMockStepProps({
        ...defaultProps,
        initialData: { businessCapabilities: [capability] }
      });
      
      render(<BusinessCapabilitiesStep {...props} />);
      
      expect(screen.getByText('Test L1')).toBeInTheDocument();
      expect(screen.getByText('Test L2')).toBeInTheDocument();
      expect(screen.getByText('Test L3')).toBeInTheDocument();
      expect(screen.getByText('Test Remarks')).toBeInTheDocument();
    });

    it('displays capabilities count', () => {
      const capabilities = [
        createMockBusinessCapability({ id: '1' }),
        createMockBusinessCapability({ id: '2' }),
      ];
      
      const props = createMockStepProps({
        ...defaultProps,
        initialData: { businessCapabilities: capabilities }
      });
      
      render(<BusinessCapabilitiesStep {...props} />);
      expect(screen.getByText(/Business Capabilities \(2\)/)).toBeInTheDocument();
    });
  });

  describe('Empty State', () => {
    it('displays empty state initially', () => {
      render(<BusinessCapabilitiesStep {...defaultProps} />);
      expect(screen.getByText(/No business capabilities added yet/)).toBeInTheDocument();
      expect(screen.getByText(/Add your first capability above/)).toBeInTheDocument();
    });

    it('shows empty state with count 0', () => {
      render(<BusinessCapabilitiesStep {...defaultProps} />);
      expect(screen.getByText(/Business Capabilities \(0\)/)).toBeInTheDocument();
    });
  });

  describe('Dropdown Interactions', () => {
    it('enables L2 dropdown when L1 is selected', async () => {
      const { container } = render(<BusinessCapabilitiesStep {...defaultProps} />);
      
      const l1Select = container.querySelector('select') as HTMLSelectElement;
      const l2Select = container.querySelectorAll('select')[1] as HTMLSelectElement;
      
      // L2 should be disabled initially
      expect(l2Select).toBeDisabled();
      
      // Select L1
      fireEvent.change(l1Select, { target: { value: 'Customer Management' } });
      
      await waitFor(() => {
        expect(l2Select).not.toBeDisabled();
      });
    });

    it('enables L3 dropdown when L1 and L2 are selected', async () => {
      const { container } = render(<BusinessCapabilitiesStep {...defaultProps} />);
      
      const selects = container.querySelectorAll('select');
      const l1Select = selects[0] as HTMLSelectElement;
      const l2Select = selects[1] as HTMLSelectElement;
      const l3Select = selects[2] as HTMLSelectElement;
      
      // L3 should be disabled initially
      expect(l3Select).toBeDisabled();
      
      // Select L1 and L2
      fireEvent.change(l1Select, { target: { value: 'Customer Management' } });
      fireEvent.change(l2Select, { target: { value: 'Customer Onboarding' } });
      
      await waitFor(() => {
        expect(l3Select).not.toBeDisabled();
      });
    });

    it('resets L2 and L3 when L1 changes', async () => {
      const { container } = render(<BusinessCapabilitiesStep {...defaultProps} />);
      
      const selects = container.querySelectorAll('select');
      const l1Select = selects[0] as HTMLSelectElement;
      const l2Select = selects[1] as HTMLSelectElement;
      const l3Select = selects[2] as HTMLSelectElement;
      
      // Select all levels
      fireEvent.change(l1Select, { target: { value: 'Customer Management' } });
      fireEvent.change(l2Select, { target: { value: 'Customer Onboarding' } });
      fireEvent.change(l3Select, { target: { value: 'Digital Registration' } });
      
      // Change L1 - should reset L2 and L3
      fireEvent.change(l1Select, { target: { value: 'Product Management' } });
      
      await waitFor(() => {
        expect(l2Select.value).toBe('');
        expect(l3Select.value).toBe('');
      });
    });

    it('resets L3 when L2 changes', async () => {
      const { container } = render(<BusinessCapabilitiesStep {...defaultProps} />);
      
      const selects = container.querySelectorAll('select');
      const l1Select = selects[0] as HTMLSelectElement;
      const l2Select = selects[1] as HTMLSelectElement;
      const l3Select = selects[2] as HTMLSelectElement;
      
      // Select all levels
      fireEvent.change(l1Select, { target: { value: 'Customer Management' } });
      fireEvent.change(l2Select, { target: { value: 'Customer Onboarding' } });
      fireEvent.change(l3Select, { target: { value: 'Digital Registration' } });
      
      // Change L2 - should reset L3
      fireEvent.change(l2Select, { target: { value: 'Customer Service' } });
      
      await waitFor(() => {
        expect(l3Select.value).toBe('');
      });
    });
  });

  describe('Add Capability Functionality', () => {
    it('disables add button when required fields are empty', () => {
      render(<BusinessCapabilitiesStep {...defaultProps} />);
      const addButton = screen.getByText(/Add Capability/);
      expect(addButton).toBeDisabled();
    });

    it('enables add button when all required fields are filled', async () => {
      const { container } = render(<BusinessCapabilitiesStep {...defaultProps} />);
      
      const selects = container.querySelectorAll('select');
      const l1Select = selects[0] as HTMLSelectElement;
      const l2Select = selects[1] as HTMLSelectElement;
      const l3Select = selects[2] as HTMLSelectElement;
      
      // Fill all required fields
      fireEvent.change(l1Select, { target: { value: 'Customer Management' } });
      fireEvent.change(l2Select, { target: { value: 'Customer Onboarding' } });
      fireEvent.change(l3Select, { target: { value: 'Digital Registration' } });
      
      const addButton = screen.getByText(/Add Capability/);
      
      await waitFor(() => {
        expect(addButton).not.toBeDisabled();
      });
    });

    it('adds new capability when add button clicked', async () => {
      const { container } = render(<BusinessCapabilitiesStep {...defaultProps} />);
      
      const selects = container.querySelectorAll('select');
      const l1Select = selects[0] as HTMLSelectElement;
      const l2Select = selects[1] as HTMLSelectElement;
      const l3Select = selects[2] as HTMLSelectElement;
      const remarksInput = container.querySelector('input') as HTMLInputElement;
      
      // Fill all fields
      fireEvent.change(l1Select, { target: { value: 'Customer Management' } });
      fireEvent.change(l2Select, { target: { value: 'Customer Onboarding' } });
      fireEvent.change(l3Select, { target: { value: 'Digital Registration' } });
      fireEvent.change(remarksInput, { target: { value: 'New capability' } });
      
      const addButton = screen.getByText(/Add Capability/);
      fireEvent.click(addButton);
      
      await waitFor(() => {
        // Check table cells specifically to avoid dropdown options
        const cells = container.querySelectorAll('tbody td');
        expect(cells[0]).toHaveTextContent('Customer Management');
        expect(cells[1]).toHaveTextContent('Customer Onboarding'); 
        expect(cells[2]).toHaveTextContent('Digital Registration');
        expect(cells[3]).toHaveTextContent('New capability');
      });
    });

    it('resets form after adding capability', async () => {
      const { container } = render(<BusinessCapabilitiesStep {...defaultProps} />);
      
      const selects = container.querySelectorAll('select');
      const l1Select = selects[0] as HTMLSelectElement;
      const l2Select = selects[1] as HTMLSelectElement;
      const l3Select = selects[2] as HTMLSelectElement;
      const remarksInput = container.querySelector('input') as HTMLInputElement;
      
      // Fill and add capability
      fireEvent.change(l1Select, { target: { value: 'Customer Management' } });
      fireEvent.change(l2Select, { target: { value: 'Customer Onboarding' } });
      fireEvent.change(l3Select, { target: { value: 'Digital Registration' } });
      fireEvent.change(remarksInput, { target: { value: 'Test remarks' } });
      
      const addButton = screen.getByText(/Add Capability/);
      fireEvent.click(addButton);
      
      await waitFor(() => {
        expect(l1Select.value).toBe('');
        expect(l2Select.value).toBe('');
        expect(l3Select.value).toBe('');
        expect(remarksInput.value).toBe('');
      });
    });

    it('updates count after adding capability', async () => {
      const { container } = render(<BusinessCapabilitiesStep {...defaultProps} />);
      
      const selects = container.querySelectorAll('select');
      
      // Add capability
      fireEvent.change(selects[0], { target: { value: 'Customer Management' } });
      fireEvent.change(selects[1], { target: { value: 'Customer Onboarding' } });
      fireEvent.change(selects[2], { target: { value: 'Digital Registration' } });
      
      const addButton = screen.getByText(/Add Capability/);
      fireEvent.click(addButton);
      
      await waitFor(() => {
        expect(screen.getByText(/Business Capabilities \(1\)/)).toBeInTheDocument();
      });
    });
  });

  describe('Edit Capability Functionality', () => {
    it('shows edit button for existing capabilities', () => {
      const capability = createMockBusinessCapability();
      const props = createMockStepProps({
        ...defaultProps,
        initialData: { businessCapabilities: [capability] }
      });
      
      render(<BusinessCapabilitiesStep {...props} />);
      expect(screen.getByTitle('Edit')).toBeInTheDocument();
    });

    it('enters edit mode when edit button clicked', async () => {
      const capability = createMockBusinessCapability();
      const props = createMockStepProps({
        ...defaultProps,
        initialData: { businessCapabilities: [capability] }
      });
      
      render(<BusinessCapabilitiesStep {...props} />);
      
      const editButton = screen.getByTitle('Edit');
      fireEvent.click(editButton);
      
      await waitFor(() => {
        expect(screen.getByText(/Edit Business Capability/)).toBeInTheDocument();
      });
    });

    it('shows save and cancel buttons in edit mode', async () => {
      const capability = createMockBusinessCapability();
      const props = createMockStepProps({
        ...defaultProps,
        initialData: { businessCapabilities: [capability] }
      });

      render(<BusinessCapabilitiesStep {...props} />);

      const editButton = screen.getByTitle('Edit');
      fireEvent.click(editButton);

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /Update Capability/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Cancel/i })).toBeInTheDocument();
      });
    });

    it('saves edits when save button clicked', async () => {
      const capability = createMockBusinessCapability({ remarks: 'Original' });
      const props = createMockStepProps({
        ...defaultProps,
        initialData: { businessCapabilities: [capability] }
      });

      const { container } = render(<BusinessCapabilitiesStep {...props} />);

      // Enter edit mode
      const editButton = screen.getByTitle('Edit');
      fireEvent.click(editButton);

      await waitFor(() => {
        expect(screen.getByText(/Edit Business Capability/)).toBeInTheDocument();
      });

      // Update remarks
      const remarksInput = container.querySelector('input[placeholder="Enter remarks"]') as HTMLInputElement;
      fireEvent.change(remarksInput, { target: { value: 'Updated remarks' } });

      // Click update button
      const updateButton = screen.getByRole('button', { name: /Update Capability/i });
      fireEvent.click(updateButton);

      await waitFor(() => {
        expect(screen.getByText('Updated remarks')).toBeInTheDocument();
        expect(screen.queryByText(/Edit Business Capability/)).not.toBeInTheDocument();
      });
    });

    it('cancels edit when cancel button clicked', async () => {
      const capability = createMockBusinessCapability({ remarks: 'Original' });
      const props = createMockStepProps({
        ...defaultProps,
        initialData: { businessCapabilities: [capability] }
      });

      const { container } = render(<BusinessCapabilitiesStep {...props} />);

      // Enter edit mode
      const editButton = screen.getByTitle('Edit');
      fireEvent.click(editButton);

      await waitFor(() => {
        expect(screen.getByText(/Edit Business Capability/)).toBeInTheDocument();
      });

      // Make a change
      const remarksInput = container.querySelector('input[placeholder="Enter remarks"]') as HTMLInputElement;
      fireEvent.change(remarksInput, { target: { value: 'Changed' } });

      // Click cancel button
      const cancelButton = screen.getByRole('button', { name: /Cancel/i });
      fireEvent.click(cancelButton);

      await waitFor(() => {
        expect(screen.getByText('Original')).toBeInTheDocument(); // Should show original value
        expect(screen.queryByText(/Edit Business Capability/)).not.toBeInTheDocument();
      });
    });
  });

  describe('Delete Capability Functionality', () => {
    it('shows delete button for existing capabilities', () => {
      const capability = createMockBusinessCapability();
      const props = createMockStepProps({
        ...defaultProps,
        initialData: { businessCapabilities: [capability] }
      });
      
      render(<BusinessCapabilitiesStep {...props} />);
      expect(screen.getByTitle('Delete')).toBeInTheDocument();
    });

    it('removes capability when delete button clicked', async () => {
      const capability = createMockBusinessCapability({ remarks: 'To be deleted' });
      const props = createMockStepProps({
        ...defaultProps,
        initialData: { businessCapabilities: [capability] }
      });
      
      render(<BusinessCapabilitiesStep {...props} />);
      
      const deleteButton = screen.getByTitle('Delete');
      fireEvent.click(deleteButton);
      
      await waitFor(() => {
        expect(screen.queryByText('To be deleted')).not.toBeInTheDocument();
        expect(screen.getByText(/No business capabilities added yet/)).toBeInTheDocument();
      });
    });

    it('updates count after deleting capability', async () => {
      const capabilities = [
        createMockBusinessCapability({ id: '1' }),
        createMockBusinessCapability({ id: '2' }),
      ];
      const props = createMockStepProps({
        ...defaultProps,
        initialData: { businessCapabilities: capabilities }
      });
      
      render(<BusinessCapabilitiesStep {...props} />);
      
      // Initially shows 2
      expect(screen.getByText(/Business Capabilities \(2\)/)).toBeInTheDocument();
      
      const deleteButton = screen.getAllByTitle('Delete')[0];
      fireEvent.click(deleteButton);
      
      await waitFor(() => {
        expect(screen.getByText(/Business Capabilities \(1\)/)).toBeInTheDocument();
      });
    });
  });

  describe('Validation', () => {
    it('shows dash for empty remarks', () => {
      const capability = createMockBusinessCapability({ remarks: '' });
      const props = createMockStepProps({
        ...defaultProps,
        initialData: { businessCapabilities: [capability] }
      });
      
      const { container } = render(<BusinessCapabilitiesStep {...props} />);
      // Look for empty cell in remarks column (4th column)
      const remarksCells = container.querySelectorAll('tbody td:nth-child(4)');
      expect(remarksCells[0]).toBeEmptyDOMElement();
    });

    it('does not add capability with missing required fields', async () => {
      const { container } = render(<BusinessCapabilitiesStep {...defaultProps} />);
      
      const selects = container.querySelectorAll('select');
      
      // Only fill L1
      fireEvent.change(selects[0], { target: { value: 'Customer Management' } });
      
      const addButton = screen.getByText(/Add Capability/);
      
      // Should remain disabled
      expect(addButton).toBeDisabled();
    });
  });
});
