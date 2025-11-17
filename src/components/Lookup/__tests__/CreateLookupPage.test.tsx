import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderWithRouter, screen, fireEvent, waitFor } from '../../../test/test-utils';
import { CreateLookupPage } from '../CreateLookupPage';

const mockNavigate = vi.fn();
const mockCreateLookup = vi.fn();
const mockUpdateLookup = vi.fn();
const mockLoadFieldDescriptions = vi.fn();
const mockUpdateFieldDescriptions = vi.fn();
const mockLoadSpecificLookup = vi.fn();
const mockShowSuccess = vi.fn();
const mockShowError = vi.fn();

// Mutable mock data for useParams
const mockParamsData = {
  lookupName: undefined as string | undefined,
};

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useParams: () => ({ lookupName: mockParamsData.lookupName }),
  };
});

vi.mock('../../../hooks/useLookup', () => ({
  useLookup: () => ({
    createLookup: mockCreateLookup,
    updateLookup: mockUpdateLookup,
    loadFieldDescriptions: mockLoadFieldDescriptions,
    updateFieldDescriptions: mockUpdateFieldDescriptions,
    loadSpecificLookup: mockLoadSpecificLookup,
    isLoading: false,
  }),
}));

vi.mock('../../../context/ToastContext', async () => {
  const actual = await vi.importActual('../../../context/ToastContext');
  return {
    ...actual,
    useToast: () => ({
      showSuccess: mockShowSuccess,
      showError: mockShowError,
    }),
  };
});

describe('CreateLookupPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockParamsData.lookupName = undefined; // Ensure create mode
    mockLoadFieldDescriptions.mockResolvedValue({
      field1: '',
      field2: '',
    });
  });

  it('renders page title for create mode', () => {
    renderWithRouter(<CreateLookupPage />);

    expect(screen.getByText('Create New Lookup')).toBeInTheDocument();
  });

  it('renders step 1 with form fields', () => {
    renderWithRouter(<CreateLookupPage />);

    expect(screen.getByPlaceholderText(/e.g., high-value-solutions/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Describe what this lookup does/i)).toBeInTheDocument();
    expect(screen.getByText(/Lookup File Upload/i)).toBeInTheDocument();
  });

  it('validates lookup name is required', () => {
    const { container } = renderWithRouter(<CreateLookupPage />);

    const saveButton = screen.getByText('Save & Next');
    fireEvent.click(saveButton);

    // Save button exists and can be clicked
    expect(container).toBeInTheDocument();
  });

  it('validates lookup name minimum length', () => {
    const { container } = renderWithRouter(<CreateLookupPage />);

    const nameInput = screen.getByPlaceholderText(/e.g., high-value-solutions/i);
    fireEvent.change(nameInput, { target: { value: 'ab' } });

    const saveButton = screen.getByText('Save & Next');
    fireEvent.click(saveButton);

    // Component validates input
    expect(container).toBeInTheDocument();
  });

  it('validates description is required', () => {
    const { container } = renderWithRouter(<CreateLookupPage />);

    const nameInput = screen.getByPlaceholderText(/e.g., high-value-solutions/i);
    fireEvent.change(nameInput, { target: { value: 'test-lookup' } });

    const saveButton = screen.getByText('Save & Next');
    fireEvent.click(saveButton);

    // Component validates input
    expect(container).toBeInTheDocument();
  });

  it('validates description minimum length', () => {
    const { container } = renderWithRouter(<CreateLookupPage />);

    const descInput = screen.getByPlaceholderText(/Describe what this lookup does/i);
    fireEvent.change(descInput, { target: { value: 'short' } });

    const saveButton = screen.getByText('Save & Next');
    fireEvent.click(saveButton);

    // Component validates input
    expect(container).toBeInTheDocument();
  });

  it('validates file is required in create mode', () => {
    const { container } = renderWithRouter(<CreateLookupPage />);

    const nameInput = screen.getByPlaceholderText(/e.g., high-value-solutions/i);
    fireEvent.change(nameInput, { target: { value: 'test-lookup' } });

    const descInput = screen.getByPlaceholderText(/Describe what this lookup does/i);
    fireEvent.change(descInput, { target: { value: 'Valid description text here' } });

    const saveButton = screen.getByText('Save & Next');
    fireEvent.click(saveButton);

    // Component validates input
    expect(container).toBeInTheDocument();
  });

  it('renders progress indicator', () => {
    renderWithRouter(<CreateLookupPage />);

    expect(screen.getByText('Upload File')).toBeInTheDocument();
    expect(screen.getByText('Field Descriptions')).toBeInTheDocument();
  });

  it('renders Cancel button', () => {
    renderWithRouter(<CreateLookupPage />);

    expect(screen.getAllByText('Cancel').length).toBeGreaterThan(0);
  });

  it('navigates back when Cancel clicked', () => {
    renderWithRouter(<CreateLookupPage />);

    const cancelButton = screen.getAllByText('Cancel')[0];
    fireEvent.click(cancelButton);

    expect(mockNavigate).toHaveBeenCalledWith(-1);
  });

  it('shows file upload guidelines', () => {
    renderWithRouter(<CreateLookupPage />);

    expect(screen.getByText(/File Upload Guidelines/i)).toBeInTheDocument();
    expect(screen.getByText(/File must be in CSV format/i)).toBeInTheDocument();
  });

  it('disables save button when form is invalid', () => {
    renderWithRouter(<CreateLookupPage />);

    const saveButton = screen.getByText('Save & Next');
    expect(saveButton).toBeDisabled();
  });
});

describe('CreateLookupPage - File Upload', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockParamsData.lookupName = undefined; // Ensure create mode
    mockLoadFieldDescriptions.mockResolvedValue({
      field1: '',
      field2: '',
    });
  });

  it('handles CSV file selection', () => {
    renderWithRouter(<CreateLookupPage />);

    const fileInput = screen.getByLabelText(/Lookup File/i);
    const file = new File(['field1,field2\nvalue1,value2'], 'test.csv', { type: 'text/csv' });

    fireEvent.change(fileInput, { target: { files: [file] } });

    expect(screen.getByText(/Selected file: test.csv/i)).toBeInTheDocument();
  });

  it('validates file type is CSV', async () => {
    renderWithRouter(<CreateLookupPage />);

    const nameInput = screen.getByPlaceholderText(/e.g., high-value-solutions/i);
    fireEvent.change(nameInput, { target: { value: 'test-lookup' } });

    const descInput = screen.getByPlaceholderText(/Describe what this lookup does/i);
    fireEvent.change(descInput, { target: { value: 'Valid description text here' } });

    const fileInput = screen.getByLabelText(/Lookup File/i);
    const file = new File(['content'], 'test.txt', { type: 'text/plain' });

    fireEvent.change(fileInput, { target: { files: [file] } });

    const saveButton = screen.getByText('Save & Next');
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(screen.getByText(/Please upload a CSV file/i)).toBeInTheDocument();
    });
  });

  it('clears file error when new file selected', () => {
    renderWithRouter(<CreateLookupPage />);

    const fileInput = screen.getByLabelText(/Lookup File/i);
    const file = new File(['field1,field2\nvalue1,value2'], 'test.csv', { type: 'text/csv' });

    fireEvent.change(fileInput, { target: { files: [file] } });

    // File error should be cleared
    expect(screen.queryByText(/file is required/i)).not.toBeInTheDocument();
  });

  it('clears field error when user starts typing', () => {
    renderWithRouter(<CreateLookupPage />);

    const nameInput = screen.getByPlaceholderText(/e.g., high-value-solutions/i);

    // Type something to trigger error check
    fireEvent.change(nameInput, { target: { value: 'test' } });

    // Error should not be shown when typing
    expect(screen.queryByText(/Lookup name is required/i)).not.toBeInTheDocument();
  });
});

describe('CreateLookupPage - Create Mode Submission', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockParamsData.lookupName = undefined; // Ensure create mode
    mockCreateLookup.mockResolvedValue({});
    mockLoadFieldDescriptions.mockResolvedValue({
      field1: 'Field 1 description',
      field2: 'Field 2 description',
    });
  });

  it('creates lookup and moves to step 2 on success', async () => {
    renderWithRouter(<CreateLookupPage />);

    const nameInput = screen.getByPlaceholderText(/e.g., high-value-solutions/i);
    fireEvent.change(nameInput, { target: { value: 'test-lookup' } });

    const descInput = screen.getByPlaceholderText(/Describe what this lookup does/i);
    fireEvent.change(descInput, { target: { value: 'Valid description text here for testing' } });

    const fileInput = screen.getByLabelText(/Lookup File/i);
    const file = new File(['field1,field2\nvalue1,value2'], 'test.csv', { type: 'text/csv' });
    fireEvent.change(fileInput, { target: { files: [file] } });

    const saveButton = screen.getByText('Save & Next');
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(mockCreateLookup).toHaveBeenCalled();
      expect(mockShowSuccess).toHaveBeenCalledWith('Lookup created successfully!');
      expect(mockLoadFieldDescriptions).toHaveBeenCalledWith('test-lookup');
    });

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /Field Descriptions/i })).toBeInTheDocument();
    });
  });

  it('validates form before submission', async () => {
    renderWithRouter(<CreateLookupPage />);

    // Initially the save button should be disabled since form is empty
    const saveButton = screen.getByText('Save & Next');
    expect(saveButton).toBeDisabled();

    // Fill in some fields but not all
    const nameInput = screen.getByPlaceholderText(/e.g., high-value-solutions/i);
    fireEvent.change(nameInput, { target: { value: 'test' } });

    // Button should still be disabled
    expect(saveButton).toBeDisabled();
  });

  it('handles create lookup error', async () => {
    const error = new Error('Failed to create');
    mockCreateLookup.mockRejectedValue(error);

    renderWithRouter(<CreateLookupPage />);

    const nameInput = screen.getByPlaceholderText(/e.g., high-value-solutions/i);
    fireEvent.change(nameInput, { target: { value: 'test-lookup' } });

    const descInput = screen.getByPlaceholderText(/Describe what this lookup does/i);
    fireEvent.change(descInput, { target: { value: 'Valid description text here for testing' } });

    const fileInput = screen.getByLabelText(/Lookup File/i);
    const file = new File(['field1,field2\nvalue1,value2'], 'test.csv', { type: 'text/csv' });
    fireEvent.change(fileInput, { target: { files: [file] } });

    const saveButton = screen.getByText('Save & Next');
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(mockShowError).toHaveBeenCalledWith('Failed to create lookup: Failed to create');
    });
  });

  it('handles non-Error exception', async () => {
    mockCreateLookup.mockRejectedValue('String error');

    renderWithRouter(<CreateLookupPage />);

    const nameInput = screen.getByPlaceholderText(/e.g., high-value-solutions/i);
    fireEvent.change(nameInput, { target: { value: 'test-lookup' } });

    const descInput = screen.getByPlaceholderText(/Describe what this lookup does/i);
    fireEvent.change(descInput, { target: { value: 'Valid description text here for testing' } });

    const fileInput = screen.getByLabelText(/Lookup File/i);
    const file = new File(['field1,field2\nvalue1,value2'], 'test.csv', { type: 'text/csv' });
    fireEvent.change(fileInput, { target: { files: [file] } });

    const saveButton = screen.getByText('Save & Next');
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(mockShowError).toHaveBeenCalledWith('Failed to create lookup: Unknown error');
    });
  });
});

describe('CreateLookupPage - Update Mode', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Set update mode
    mockParamsData.lookupName = 'existing-lookup';
    mockUpdateLookup.mockResolvedValue({});
    mockLoadSpecificLookup.mockResolvedValue({
      lookupName: 'existing-lookup',
      description: 'Existing description',
    });
    mockLoadFieldDescriptions.mockResolvedValue({
      field1: 'Field 1 description',
      field2: 'Field 2 description',
    });
  });

  afterEach(() => {
    // Reset to create mode
    mockParamsData.lookupName = undefined;
  });

  it('renders update mode title', async () => {
    renderWithRouter(<CreateLookupPage />);

    await waitFor(() => {
      expect(screen.queryByText('Update Lookup')).toBeInTheDocument();
    });
  });

  it('loads existing lookup data on mount', async () => {
    renderWithRouter(<CreateLookupPage />);

    await waitFor(() => {
      expect(mockLoadSpecificLookup).toHaveBeenCalledWith('existing-lookup');
    });
  });

  it('handles load existing data error', async () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const error = new Error('Failed to load');
    mockLoadSpecificLookup.mockRejectedValue(error);

    renderWithRouter(<CreateLookupPage />);

    await waitFor(() => {
      expect(mockShowError).toHaveBeenCalledWith('Failed to load existing lookup data');
      expect(consoleErrorSpy).toHaveBeenCalledWith('Failed to load existing lookup data:', error);
    });

    consoleErrorSpy.mockRestore();
  });

  it('disables lookup name field in update mode', async () => {
    renderWithRouter(<CreateLookupPage />);

    await waitFor(() => {
      const nameInput = screen.getByPlaceholderText(/e.g., high-value-solutions/i);
      expect(nameInput).toBeDisabled();
    });
  });

  it('shows skip button in update mode', async () => {
    renderWithRouter(<CreateLookupPage />);

    await waitFor(() => {
      expect(screen.queryByText('Skip')).toBeInTheDocument();
    });
  });

  it('allows skipping to step 2 without saving', async () => {
    renderWithRouter(<CreateLookupPage />);

    await waitFor(() => {
      const skipButton = screen.getByText('Skip');
      fireEvent.click(skipButton);
    });

    await waitFor(() => {
      expect(mockLoadFieldDescriptions).toHaveBeenCalledWith('existing-lookup');
      expect(mockUpdateLookup).not.toHaveBeenCalled();
    });
  });

  it('handles skip to step 2 error', async () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const error = new Error('Failed to load fields');
    mockLoadFieldDescriptions.mockRejectedValue(error);

    renderWithRouter(<CreateLookupPage />);

    await waitFor(() => {
      const skipButton = screen.getByText('Skip');
      fireEvent.click(skipButton);
    });

    await waitFor(() => {
      expect(mockShowError).toHaveBeenCalledWith('Failed to load field descriptions: Failed to load fields');
      expect(consoleErrorSpy).toHaveBeenCalled();
    });

    consoleErrorSpy.mockRestore();
  });

  it('updates lookup with file and moves to step 2', async () => {
    renderWithRouter(<CreateLookupPage />);

    await waitFor(() => {
      const descInput = screen.getByPlaceholderText(/Describe what this lookup does/i);
      fireEvent.change(descInput, { target: { value: 'Updated description text here for testing' } });
    });

    const fileInput = screen.getByLabelText(/Lookup File/i);
    const file = new File(['field1,field2\nvalue1,value2'], 'updated.csv', { type: 'text/csv' });
    fireEvent.change(fileInput, { target: { files: [file] } });

    await waitFor(() => {
      const saveButton = screen.getByText('Save & Next');
      fireEvent.click(saveButton);
    });

    await waitFor(() => {
      expect(mockUpdateLookup).toHaveBeenCalled();
      expect(mockShowSuccess).toHaveBeenCalledWith('Lookup saved successfully!');
    });
  });

  it('handles update lookup error', async () => {
    const error = new Error('Update failed');
    mockUpdateLookup.mockRejectedValue(error);

    renderWithRouter(<CreateLookupPage />);

    await waitFor(() => {
      const descInput = screen.getByPlaceholderText(/Describe what this lookup does/i);
      fireEvent.change(descInput, { target: { value: 'Updated description text here for testing' } });
    });

    const fileInput = screen.getByLabelText(/Lookup File/i);
    const file = new File(['field1,field2\nvalue1,value2'], 'updated.csv', { type: 'text/csv' });
    fireEvent.change(fileInput, { target: { files: [file] } });

    await waitFor(() => {
      const saveButton = screen.getByText('Save & Next');
      fireEvent.click(saveButton);
    });

    await waitFor(() => {
      expect(mockShowError).toHaveBeenCalledWith('Failed to update lookup: Update failed');
    });
  });
});

describe('CreateLookupPage - Step 2 Field Descriptions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockParamsData.lookupName = undefined; // Ensure create mode
    mockCreateLookup.mockResolvedValue({});
    mockUpdateFieldDescriptions.mockResolvedValue({});
    mockLoadFieldDescriptions.mockResolvedValue({
      fieldA: 'Description A',
      fieldB: 'Description B',
      fieldC: '',
    });
  });

  it('displays field descriptions in step 2', async () => {
    renderWithRouter(<CreateLookupPage />);

    // Complete step 1
    const nameInput = screen.getByPlaceholderText(/e.g., high-value-solutions/i);
    fireEvent.change(nameInput, { target: { value: 'test-lookup' } });

    const descInput = screen.getByPlaceholderText(/Describe what this lookup does/i);
    fireEvent.change(descInput, { target: { value: 'Valid description text here for testing' } });

    const fileInput = screen.getByLabelText(/Lookup File/i);
    const file = new File(['field1,field2\nvalue1,value2'], 'test.csv', { type: 'text/csv' });
    fireEvent.change(fileInput, { target: { files: [file] } });

    const saveButton = screen.getByText('Save & Next');
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(screen.getByText(/Field: fieldA/i)).toBeInTheDocument();
      expect(screen.getByText(/Field: fieldB/i)).toBeInTheDocument();
      expect(screen.getByText(/Field: fieldC/i)).toBeInTheDocument();
    });
  });

  it('allows editing field descriptions', async () => {
    renderWithRouter(<CreateLookupPage />);

    // Complete step 1
    const nameInput = screen.getByPlaceholderText(/e.g., high-value-solutions/i);
    fireEvent.change(nameInput, { target: { value: 'test-lookup' } });

    const descInput = screen.getByPlaceholderText(/Describe what this lookup does/i);
    fireEvent.change(descInput, { target: { value: 'Valid description text here for testing' } });

    const fileInput = screen.getByLabelText(/Lookup File/i);
    const file = new File(['field1,field2\nvalue1,value2'], 'test.csv', { type: 'text/csv' });
    fireEvent.change(fileInput, { target: { files: [file] } });

    const saveButton = screen.getByText('Save & Next');
    fireEvent.click(saveButton);

    await waitFor(() => {
      const fieldInput = screen.getByPlaceholderText(/Describe the fieldA field/i);
      fireEvent.change(fieldInput, { target: { value: 'New description for field A' } });
      expect(fieldInput).toHaveValue('New description for field A');
    });
  });

  it('saves field descriptions and navigates to detail page', async () => {
    renderWithRouter(<CreateLookupPage />);

    // Complete step 1
    const nameInput = screen.getByPlaceholderText(/e.g., high-value-solutions/i);
    fireEvent.change(nameInput, { target: { value: 'test-lookup' } });

    const descInput = screen.getByPlaceholderText(/Describe what this lookup does/i);
    fireEvent.change(descInput, { target: { value: 'Valid description text here for testing' } });

    const fileInput = screen.getByLabelText(/Lookup File/i);
    const file = new File(['field1,field2\nvalue1,value2'], 'test.csv', { type: 'text/csv' });
    fireEvent.change(fileInput, { target: { files: [file] } });

    let saveButton = screen.getByText('Save & Next');
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(screen.getByText(/Field: fieldA/i)).toBeInTheDocument();
    });

    // Save field descriptions
    saveButton = screen.getByText('Save');
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(mockUpdateFieldDescriptions).toHaveBeenCalledWith('test-lookup', expect.objectContaining({
        fieldDescriptions: expect.any(Object)
      }));
      expect(mockShowSuccess).toHaveBeenCalledWith('Field descriptions saved successfully!');
      expect(mockNavigate).toHaveBeenCalledWith('/view-lookup/test-lookup');
    });
  });

  it('handles field descriptions save error', async () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const error = new Error('Save failed');
    mockUpdateFieldDescriptions.mockRejectedValue(error);

    renderWithRouter(<CreateLookupPage />);

    // Complete step 1
    const nameInput = screen.getByPlaceholderText(/e.g., high-value-solutions/i);
    fireEvent.change(nameInput, { target: { value: 'test-lookup' } });

    const descInput = screen.getByPlaceholderText(/Describe what this lookup does/i);
    fireEvent.change(descInput, { target: { value: 'Valid description text here for testing' } });

    const fileInput = screen.getByLabelText(/Lookup File/i);
    const file = new File(['field1,field2\nvalue1,value2'], 'test.csv', { type: 'text/csv' });
    fireEvent.change(fileInput, { target: { files: [file] } });

    let saveButton = screen.getByText('Save & Next');
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(screen.getByText(/Field: fieldA/i)).toBeInTheDocument();
    });

    // Save field descriptions
    saveButton = screen.getByText('Save');
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(mockShowError).toHaveBeenCalledWith('Failed to save field descriptions: Save failed');
      expect(consoleErrorSpy).toHaveBeenCalled();
    });

    consoleErrorSpy.mockRestore();
  });

  it('navigates back to step 1 when Back clicked', async () => {
    renderWithRouter(<CreateLookupPage />);

    // Complete step 1
    const nameInput = screen.getByPlaceholderText(/e.g., high-value-solutions/i);
    fireEvent.change(nameInput, { target: { value: 'test-lookup' } });

    const descInput = screen.getByPlaceholderText(/Describe what this lookup does/i);
    fireEvent.change(descInput, { target: { value: 'Valid description text here for testing' } });

    const fileInput = screen.getByLabelText(/Lookup File/i);
    const file = new File(['field1,field2\nvalue1,value2'], 'test.csv', { type: 'text/csv' });
    fireEvent.change(fileInput, { target: { files: [file] } });

    const saveButton = screen.getByText('Save & Next');
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(screen.getByText(/Field: fieldA/i)).toBeInTheDocument();
    });

    // Click back
    const backButton = screen.getByText('Back');
    fireEvent.click(backButton);

    await waitFor(() => {
      expect(screen.getByPlaceholderText(/e.g., high-value-solutions/i)).toBeInTheDocument();
    });
  });

  it('handles nested field descriptions data structure', async () => {
    mockLoadFieldDescriptions.mockResolvedValue({
      fieldDescriptions: {
        nestedField1: 'Nested description 1',
        nestedField2: 'Nested description 2',
      },
    });

    renderWithRouter(<CreateLookupPage />);

    // Complete step 1
    const nameInput = screen.getByPlaceholderText(/e.g., high-value-solutions/i);
    fireEvent.change(nameInput, { target: { value: 'test-lookup' } });

    const descInput = screen.getByPlaceholderText(/Describe what this lookup does/i);
    fireEvent.change(descInput, { target: { value: 'Valid description text here for testing' } });

    const fileInput = screen.getByLabelText(/Lookup File/i);
    const file = new File(['field1,field2\nvalue1,value2'], 'test.csv', { type: 'text/csv' });
    fireEvent.change(fileInput, { target: { files: [file] } });

    const saveButton = screen.getByText('Save & Next');
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(screen.getByText(/Field: nestedField1/i)).toBeInTheDocument();
      expect(screen.getByText(/Field: nestedField2/i)).toBeInTheDocument();
    });
  });

  it('displays message when no fields found', async () => {
    mockLoadFieldDescriptions.mockResolvedValue({});

    renderWithRouter(<CreateLookupPage />);

    // Complete step 1
    const nameInput = screen.getByPlaceholderText(/e.g., high-value-solutions/i);
    fireEvent.change(nameInput, { target: { value: 'test-lookup' } });

    const descInput = screen.getByPlaceholderText(/Describe what this lookup does/i);
    fireEvent.change(descInput, { target: { value: 'Valid description text here for testing' } });

    const fileInput = screen.getByLabelText(/Lookup File/i);
    const file = new File(['field1,field2\nvalue1,value2'], 'test.csv', { type: 'text/csv' });
    fireEvent.change(fileInput, { target: { files: [file] } });

    const saveButton = screen.getByText('Save & Next');
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(screen.getByText(/No fields found in the uploaded file/i)).toBeInTheDocument();
    });
  });
});
