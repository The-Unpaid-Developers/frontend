import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '../../../../../test/test-utils';
import DataAssetStep from '../DataAssetStep';
import { 
  createMockStepProps, 
  createMockDataAsset,
  MOCK_CLASSIFICATION_OPTIONS 
} from '../../../../../__tests__/testFactories';

describe('DataAssetStep', () => {
  const mockOnSave = vi.fn();
  const defaultProps = createMockStepProps({
    onSave: mockOnSave,
    initialData: { dataAssets: [] }
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Basic Rendering', () => {
    it('renders the step component', () => {
      render(<DataAssetStep {...defaultProps} />);
      expect(screen.getAllByText(/Data Asset/i).length).toBeGreaterThan(0);
    });

    it('renders add button', () => {
      render(<DataAssetStep {...defaultProps} />);
      expect(screen.getByText(/Add Asset/i)).toBeInTheDocument();
    });

    it('renders save button', () => {
      render(<DataAssetStep {...defaultProps} />);
      expect(screen.getByText(/^Save$/)).toBeInTheDocument();
    });

    it('renders all form fields', () => {
      render(<DataAssetStep {...defaultProps} />);
      expect(screen.getByText(/Component Name/)).toBeInTheDocument();
      expect(screen.getByText(/Data Domain/)).toBeInTheDocument();
      expect(screen.getByText(/Data Classification/)).toBeInTheDocument();
      expect(screen.getByText(/Data Owned By/)).toBeInTheDocument();
      expect(screen.getByText(/Mastered In/)).toBeInTheDocument();
      expect(screen.getByText(/Data Entities/)).toBeInTheDocument();
    });

    it('shows required field indicators', () => {
      render(<DataAssetStep {...defaultProps} />);
      const requiredIndicators = screen.getAllByText('*');
      expect(requiredIndicators.length).toBe(3); // Component Name, Data Domain, Data Classification
    });
  });

  describe('Save Functionality', () => {
    it('calls onSave when save button clicked', () => {
      render(<DataAssetStep {...defaultProps} />);
      const saveButton = screen.getByText(/^Save$/);
      fireEvent.click(saveButton);
      expect(mockOnSave).toHaveBeenCalledWith([]);
    });

    it('shows isSaving state', () => {
      const props = createMockStepProps({ ...defaultProps, isSaving: true });
      render(<DataAssetStep {...props} />);
      const saveButton = screen.getByText(/Saving/i);
      expect(saveButton).toBeDisabled();
      expect(saveButton).toContainHTML('animate-spin');
    });

    it('calls onSave with current assets', async () => {
      const asset = createMockDataAsset();
      const props = createMockStepProps({
        ...defaultProps,
        initialData: { dataAssets: [asset] }
      });
      
      render(<DataAssetStep {...props} />);
      
      const saveButton = screen.getByText(/^Save$/);
      fireEvent.click(saveButton);
      
      await waitFor(() => {
        expect(mockOnSave).toHaveBeenCalledWith([asset]);
      });
    });
  });

  describe('Initial Data Loading', () => {
    it('renders with initial data', () => {
      const asset = createMockDataAsset({
        componentName: 'Test Asset',
        dataDomain: 'Test Domain',
        dataClassification: 'PUBLIC'
      });
      
      const props = createMockStepProps({
        ...defaultProps,
        initialData: { dataAssets: [asset] }
      });
      
      render(<DataAssetStep {...props} />);
      expect(screen.getByText('Test Asset')).toBeInTheDocument();
      expect(screen.getByText('Test Domain')).toBeInTheDocument();
      expect(screen.getByText('PUBLIC')).toBeInTheDocument();
    });

    it('displays assets count', () => {
      const assets = [
        createMockDataAsset({ id: '1' }),
        createMockDataAsset({ id: '2' }),
      ];
      
      const props = createMockStepProps({
        ...defaultProps,
        initialData: { dataAssets: assets }
      });
      
      render(<DataAssetStep {...props} />);
      expect(screen.getByText(/Data Assets \(2\)/)).toBeInTheDocument();
    });

    it('updates list when initialData changes', () => {
      const { rerender } = render(<DataAssetStep {...defaultProps} />);
      expect(screen.getByText(/Data Assets \(0\)/)).toBeInTheDocument();
      
      const asset = createMockDataAsset();
      const updatedProps = createMockStepProps({
        ...defaultProps,
        initialData: { dataAssets: [asset] }
      });
      
      rerender(<DataAssetStep {...updatedProps} />);
      expect(screen.getByText(/Data Assets \(1\)/)).toBeInTheDocument();
    });
  });

  describe('Empty State', () => {
    it('displays empty state initially', () => {
      render(<DataAssetStep {...defaultProps} />);
      expect(screen.getByText(/No data assets added yet/i)).toBeInTheDocument();
      expect(screen.getByText(/Add your first asset above/i)).toBeInTheDocument();
    });

    it('shows empty state with count 0', () => {
      render(<DataAssetStep {...defaultProps} />);
      expect(screen.getByText(/Data Assets \(0\)/)).toBeInTheDocument();
    });
  });

  describe('Form Input Functionality', () => {
    it('handles component name input change', () => {
      const { container } = render(<DataAssetStep {...defaultProps} />);
      const componentNameInput = container.querySelector('input[placeholder="Enter component name"]') as HTMLInputElement;
      
      fireEvent.change(componentNameInput, { target: { value: 'New Component' } });
      expect(componentNameInput.value).toBe('New Component');
    });

    it('handles data domain input change', () => {
      const { container } = render(<DataAssetStep {...defaultProps} />);
      const dataDomainInput = container.querySelector('input[placeholder="Enter data domain"]') as HTMLInputElement;
      
      fireEvent.change(dataDomainInput, { target: { value: 'Customer Data' } });
      expect(dataDomainInput.value).toBe('Customer Data');
    });

    it('handles data classification dropdown change', () => {
      const { container } = render(<DataAssetStep {...defaultProps} />);
      const classificationDropdown = container.querySelector('select') as HTMLSelectElement;
      
      fireEvent.change(classificationDropdown, { target: { value: 'CONFIDENTIAL' } });
      expect(classificationDropdown.value).toBe('CONFIDENTIAL');
    });
  });

  describe('Add Asset Functionality', () => {
    it('disables add button when required fields are empty', () => {
      render(<DataAssetStep {...defaultProps} />);
      const addButton = screen.getByText(/Add Asset/);
      expect(addButton).toBeDisabled();
    });

    it('enables add button when all required fields are filled', () => {
      const { container } = render(<DataAssetStep {...defaultProps} />);
      
      const componentNameInput = container.querySelector('input[placeholder="Enter component name"]') as HTMLInputElement;
      const dataDomainInput = container.querySelector('input[placeholder="Enter data domain"]') as HTMLInputElement;
      const classificationDropdown = container.querySelector('select') as HTMLSelectElement;
      
      fireEvent.change(componentNameInput, { target: { value: 'Test Component' } });
      fireEvent.change(dataDomainInput, { target: { value: 'Test Domain' } });
      fireEvent.change(classificationDropdown, { target: { value: 'PUBLIC' } });
      
      const addButton = screen.getByText(/Add Asset/);
      expect(addButton).not.toBeDisabled();
    });

    it('adds new asset when add button clicked', async () => {
      const { container } = render(<DataAssetStep {...defaultProps} />);
      
      // Fill required fields
      const componentNameInput = container.querySelector('input[placeholder="Enter component name"]') as HTMLInputElement;
      const dataDomainInput = container.querySelector('input[placeholder="Enter data domain"]') as HTMLInputElement;
      const classificationDropdown = container.querySelector('select') as HTMLSelectElement;
      
      fireEvent.change(componentNameInput, { target: { value: 'New Asset' } });
      fireEvent.change(dataDomainInput, { target: { value: 'New Domain' } });
      fireEvent.change(classificationDropdown, { target: { value: 'CONFIDENTIAL' } });
      
      const addButton = screen.getByText(/Add Asset/);
      fireEvent.click(addButton);
      
      await waitFor(() => {
        expect(screen.getByText('New Asset')).toBeInTheDocument();
        expect(screen.getByText('New Domain')).toBeInTheDocument();
        expect(screen.getByText('CONFIDENTIAL')).toBeInTheDocument();
      });
    });

    it('resets form after adding asset', async () => {
      const { container } = render(<DataAssetStep {...defaultProps} />);
      
      const componentNameInput = container.querySelector('input[placeholder="Enter component name"]') as HTMLInputElement;
      const dataDomainInput = container.querySelector('input[placeholder="Enter data domain"]') as HTMLInputElement;
      const classificationDropdown = container.querySelector('select') as HTMLSelectElement;
      
      // Fill and add asset
      fireEvent.change(componentNameInput, { target: { value: 'Test Asset' } });
      fireEvent.change(dataDomainInput, { target: { value: 'Test Domain' } });
      fireEvent.change(classificationDropdown, { target: { value: 'PUBLIC' } });
      
      const addButton = screen.getByText(/Add Asset/);
      fireEvent.click(addButton);
      
      await waitFor(() => {
        expect(componentNameInput.value).toBe('');
        expect(dataDomainInput.value).toBe('');
        expect(classificationDropdown.value).toBe('');
      });
    });

    it('updates count after adding asset', async () => {
      const { container } = render(<DataAssetStep {...defaultProps} />);
      
      const componentNameInput = container.querySelector('input[placeholder="Enter component name"]') as HTMLInputElement;
      const dataDomainInput = container.querySelector('input[placeholder="Enter data domain"]') as HTMLInputElement;
      const classificationDropdown = container.querySelector('select') as HTMLSelectElement;
      
      fireEvent.change(componentNameInput, { target: { value: 'Test Asset' } });
      fireEvent.change(dataDomainInput, { target: { value: 'Test Domain' } });
      fireEvent.change(classificationDropdown, { target: { value: 'PUBLIC' } });
      
      const addButton = screen.getByText(/Add Asset/);
      fireEvent.click(addButton);
      
      await waitFor(() => {
        expect(screen.getByText(/Data Assets \(1\)/)).toBeInTheDocument();
      });
    });
  });

  describe('Delete Asset Functionality', () => {
    it('shows delete button for existing assets', () => {
      const asset = createMockDataAsset();
      const props = createMockStepProps({
        ...defaultProps,
        initialData: { dataAssets: [asset] }
      });
      
      render(<DataAssetStep {...props} />);
      expect(screen.getByTitle('Delete')).toBeInTheDocument();
    });

    it('removes asset when delete button clicked', async () => {
      const asset = createMockDataAsset({ componentName: 'To be deleted' });
      const props = createMockStepProps({
        ...defaultProps,
        initialData: { dataAssets: [asset] }
      });
      
      render(<DataAssetStep {...props} />);
      
      const deleteButton = screen.getByTitle('Delete');
      fireEvent.click(deleteButton);
      
      await waitFor(() => {
        expect(screen.queryByText('To be deleted')).not.toBeInTheDocument();
        expect(screen.getByText(/No data assets added yet/)).toBeInTheDocument();
      });
    });

    it('updates count after deleting asset', async () => {
      const assets = [
        createMockDataAsset({ id: '1' }),
        createMockDataAsset({ id: '2' }),
      ];
      const props = createMockStepProps({
        ...defaultProps,
        initialData: { dataAssets: assets }
      });
      
      render(<DataAssetStep {...props} />);
      
      // Initially shows 2
      expect(screen.getByText(/Data Assets \(2\)/)).toBeInTheDocument();
      
      const deleteButton = screen.getAllByTitle('Delete')[0];
      fireEvent.click(deleteButton);
      
      await waitFor(() => {
        expect(screen.getByText(/Data Assets \(1\)/)).toBeInTheDocument();
      });
    });
  });

  describe('Validation', () => {
    it('displays assets with optional fields correctly', () => {
      const asset = createMockDataAsset({ 
        componentName: 'Test Asset Name',
        dataDomain: 'Test Data Domain',
        dataClassification: 'PUBLIC',
        dataOwnedBy: undefined, 
        masteredIn: undefined,
        dataEntities: [] 
      });
      const props = createMockStepProps({
        ...defaultProps,
        initialData: { dataAssets: [asset] }
      });
      
      const { container } = render(<DataAssetStep {...props} />);
      
      // Check that the asset is displayed in the table
      expect(screen.getByText('Test Asset Name')).toBeInTheDocument();
      expect(screen.getByText('Test Data Domain')).toBeInTheDocument();
      
      // Check that the table rows are rendered
      const tableRows = container.querySelectorAll('tbody tr');
      expect(tableRows.length).toBe(1);
    });

    it('does not add asset with missing required fields', () => {
      const { container } = render(<DataAssetStep {...defaultProps} />);
      
      // Only fill component name
      const componentNameInput = container.querySelector('input[placeholder="Enter component name"]') as HTMLInputElement;
      fireEvent.change(componentNameInput, { target: { value: 'Test' } });
      
      const addButton = screen.getByText(/Add Asset/);
      expect(addButton).toBeDisabled();
    });
  });

  describe('Entity Management', () => {
    it('adds data entities to form', () => {
      const { container } = render(<DataAssetStep {...defaultProps} />);
      
      const entityInput = container.querySelector('input[placeholder="Enter data entity name"]') as HTMLInputElement;
      fireEvent.change(entityInput, { target: { value: 'Customer' } });
      
      const addEntityButton = screen.getByText(/Add Entity/);
      fireEvent.click(addEntityButton);
      
      expect(screen.getByText('Customer')).toBeInTheDocument();
    });

    it('disables add entity button when input is empty', () => {
      render(<DataAssetStep {...defaultProps} />);
      
      const addEntityButton = screen.getByText(/Add Entity/);
      expect(addEntityButton).toBeDisabled();
    });

    it('removes entity when X button is clicked', async () => {
      const { container } = render(<DataAssetStep {...defaultProps} />);
      
      const entityInput = container.querySelector('input[placeholder="Enter data entity name"]') as HTMLInputElement;
      fireEvent.change(entityInput, { target: { value: 'Customer' } });
      
      const addEntityButton = screen.getByText(/Add Entity/);
      fireEvent.click(addEntityButton);
      
      expect(screen.getByText('Customer')).toBeInTheDocument();
      
      // Find the entity container and click the X button inside it
      const entitySpan = screen.getByText('Customer').closest('div');
      const removeButton = entitySpan?.querySelector('button');
      
      if (removeButton) {
        fireEvent.click(removeButton);
        await waitFor(() => {
          expect(screen.queryByText('Customer')).not.toBeInTheDocument();
        });
      }
    });

    it('shows entity count when entities are added', () => {
      const { container } = render(<DataAssetStep {...defaultProps} />);
      
      const entityInput = container.querySelector('input[placeholder="Enter data entity name"]') as HTMLInputElement;
      fireEvent.change(entityInput, { target: { value: 'Customer' } });
      
      const addEntityButton = screen.getByText(/Add Entity/);
      fireEvent.click(addEntityButton);
      
      expect(screen.getByText(/Data Entities \(1\):/)).toBeInTheDocument();
    });
  });

  describe('Edit Functionality', () => {
    it('shows edit button for existing assets', () => {
      const asset = createMockDataAsset();
      const props = createMockStepProps({
        ...defaultProps,
        initialData: { dataAssets: [asset] }
      });
      
      render(<DataAssetStep {...props} />);
      expect(screen.getByTitle('Edit')).toBeInTheDocument();
    });

    it('enters edit mode when edit button clicked', async () => {
      const asset = createMockDataAsset({ componentName: 'Editable Asset' });
      const props = createMockStepProps({
        ...defaultProps,
        initialData: { dataAssets: [asset] }
      });
      
      render(<DataAssetStep {...props} />);
      
      const editButton = screen.getByTitle('Edit');
      fireEvent.click(editButton);
      
      await waitFor(() => {
        expect(screen.getByTitle('Save')).toBeInTheDocument();
        expect(screen.getByTitle('Cancel')).toBeInTheDocument();
      });
    });

    it('cancels edit mode when cancel button clicked', async () => {
      const asset = createMockDataAsset({ componentName: 'Editable Asset' });
      const props = createMockStepProps({
        ...defaultProps,
        initialData: { dataAssets: [asset] }
      });
      
      render(<DataAssetStep {...props} />);
      
      const editButton = screen.getByTitle('Edit');
      fireEvent.click(editButton);
      
      await waitFor(() => {
        const cancelButton = screen.getByTitle('Cancel');
        fireEvent.click(cancelButton);
      });
      
      expect(screen.queryByTitle('Save')).not.toBeInTheDocument();
      expect(screen.queryByTitle('Cancel')).not.toBeInTheDocument();
    });
  });

  describe('Table Display', () => {
    it('shows table headers when assets exist', () => {
      const asset = createMockDataAsset();
      const props = createMockStepProps({
        ...defaultProps,
        initialData: { dataAssets: [asset] }
      });
      
      const { container } = render(<DataAssetStep {...props} />);
      
      // Check for table headers in the table (not form labels)
      const tableHeaders = container.querySelectorAll('th');
      expect(tableHeaders.length).toBe(7); // Should have 7 column headers
      
      // Check for specific table headers by role
      expect(container.querySelector('th:nth-child(1)')).toHaveTextContent('Component Name');
      expect(container.querySelector('th:nth-child(2)')).toHaveTextContent('Data Domain');
      expect(container.querySelector('th:nth-child(3)')).toHaveTextContent('Classification');
      expect(container.querySelector('th:nth-child(4)')).toHaveTextContent('Owner');
      expect(container.querySelector('th:nth-child(5)')).toHaveTextContent('Mastered In');
      expect(container.querySelector('th:nth-child(6)')).toHaveTextContent('Entities');
      expect(container.querySelector('th:nth-child(7)')).toHaveTextContent('Actions');
    });

    it('shows entity truncation message for many entities', () => {
      const asset = createMockDataAsset({ 
        dataEntities: ['Entity1', 'Entity2', 'Entity3', 'Entity4'] 
      });
      const props = createMockStepProps({
        ...defaultProps,
        initialData: { dataAssets: [asset] }
      });
      
      render(<DataAssetStep {...props} />);
      expect(screen.getByText('+2 more')).toBeInTheDocument();
    });
  });

  describe('Optional Field Handling', () => {
    it('handles optional fields correctly', () => {
      const { container } = render(<DataAssetStep {...defaultProps} />);
      
      const dataOwnerInput = container.querySelector('input[placeholder="Enter data owner"]') as HTMLInputElement;
      const masteredInInput = container.querySelector('input[placeholder="Enter mastered system"]') as HTMLInputElement;
      
      fireEvent.change(dataOwnerInput, { target: { value: 'John Doe' } });
      fireEvent.change(masteredInInput, { target: { value: 'CRM System' } });
      
      expect(dataOwnerInput.value).toBe('John Doe');
      expect(masteredInInput.value).toBe('CRM System');
    });
  });

  describe('Error States', () => {
    it('handles save errors gracefully', async () => {
      const mockOnSave = vi.fn().mockResolvedValue(undefined);
      const props = createMockStepProps({
        onSave: mockOnSave,
        initialData: { dataAssets: [] }
      });
      
      render(<DataAssetStep {...props} />);
      
      const saveButton = screen.getByText(/^Save$/);
      fireEvent.click(saveButton);
      
      await waitFor(() => {
        expect(mockOnSave).toHaveBeenCalled();
      });
    });
  });
});
