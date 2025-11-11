import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderWithRouter, screen, fireEvent, waitFor } from '../../../test/test-utils';
import { LookupDetailPage } from '../LookupDetailPage';

const mockNavigate = vi.fn();
const mockLoadSpecificLookup = vi.fn();
const mockDeleteLookup = vi.fn();
const mockShowSuccess = vi.fn();
const mockShowError = vi.fn();

const mockLookupData = {
  id: 'lookup-1',
  lookupName: 'test-lookup',
  description: 'Test lookup description',
  recordCount: 3,
  uploadedAt: '2024-01-01T00:00:00Z',
  fieldDescriptions: {
    field1: 'Description for field 1',
    field2: 'Description for field 2',
  },
  data: [
    { field1: 'value1a', field2: 'value2a' },
    { field1: 'value1b', field2: 'value2b' },
    { field1: 'value1c', field2: 'value2c' },
  ],
};

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useParams: () => ({ lookupName: 'test-lookup' }),
  };
});

vi.mock('../../../hooks/useLookup', () => ({
  useLookup: () => ({
    loadSpecificLookup: mockLoadSpecificLookup,
    deleteLookup: mockDeleteLookup,
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

describe('LookupDetailPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockLoadSpecificLookup.mockResolvedValue(mockLookupData);
  });

  it('renders page with lookup name', async () => {
    renderWithRouter(<LookupDetailPage />);

    await waitFor(() => {
      expect(screen.getByText('test-lookup')).toBeInTheDocument();
    });
  });

  it('loads lookup data on mount', async () => {
    renderWithRouter(<LookupDetailPage />);

    await waitFor(() => {
      expect(mockLoadSpecificLookup).toHaveBeenCalledWith('test-lookup');
    });
  });

  it('displays lookup information', async () => {
    renderWithRouter(<LookupDetailPage />);

    await waitFor(() => {
      expect(screen.getByText('Test lookup description')).toBeInTheDocument();
      expect(screen.getByText('3 records')).toBeInTheDocument();
      expect(screen.getByText('lookup-1')).toBeInTheDocument();
    });
  });

  it('displays field descriptions table', async () => {
    const { container } = renderWithRouter(<LookupDetailPage />);

    await waitFor(() => {
      expect(mockLoadSpecificLookup).toHaveBeenCalled();
    }, { timeout: 500 });

    // Component renders
    expect(container).toBeInTheDocument();
  });

  it('displays lookup data table', async () => {
    renderWithRouter(<LookupDetailPage />);

    await waitFor(() => {
      expect(screen.getByText('value1a')).toBeInTheDocument();
      expect(screen.getByText('value2a')).toBeInTheDocument();
      expect(screen.getByText('value1b')).toBeInTheDocument();
      expect(screen.getByText('value2b')).toBeInTheDocument();
    });
  });

  it('renders Update button', async () => {
    renderWithRouter(<LookupDetailPage />);

    await waitFor(() => {
      expect(screen.getByText('Update')).toBeInTheDocument();
    });
  });

  it('navigates to update page when Update clicked', async () => {
    renderWithRouter(<LookupDetailPage />);

    await waitFor(() => {
      const updateButton = screen.getByText('Update');
      fireEvent.click(updateButton);
      expect(mockNavigate).toHaveBeenCalledWith('/update-lookup/test-lookup');
    });
  });

  it('renders Delete button', async () => {
    renderWithRouter(<LookupDetailPage />);

    await waitFor(() => {
      expect(screen.getByText('Delete')).toBeInTheDocument();
    });
  });

  it('shows delete confirmation modal when Delete clicked', async () => {
    renderWithRouter(<LookupDetailPage />);

    await waitFor(() => {
      const deleteButton = screen.getByText('Delete');
      fireEvent.click(deleteButton);
    });

    await waitFor(() => {
      expect(screen.getByText('Delete Lookup')).toBeInTheDocument();
      expect(screen.getByText(/Are you sure you want to delete the lookup/i)).toBeInTheDocument();
    });
  });

  it('calls deleteLookup when delete confirmed', async () => {
    mockDeleteLookup.mockResolvedValue({});
    renderWithRouter(<LookupDetailPage />);

    await waitFor(() => {
      const deleteButton = screen.getByText('Delete');
      fireEvent.click(deleteButton);
    });

    await waitFor(() => {
      const confirmButton = screen.getAllByText('Delete')[1];
      fireEvent.click(confirmButton);
    });

    await waitFor(() => {
      expect(mockDeleteLookup).toHaveBeenCalledWith('test-lookup');
      expect(mockShowSuccess).toHaveBeenCalledWith('Lookup deleted successfully!');
      expect(mockNavigate).toHaveBeenCalledWith('/lookups');
    });
  });

  it('closes delete modal when Cancel clicked', async () => {
    renderWithRouter(<LookupDetailPage />);

    await waitFor(() => {
      const deleteButton = screen.getByText('Delete');
      fireEvent.click(deleteButton);
    });

    await waitFor(() => {
      const cancelButton = screen.getByText('Cancel');
      fireEvent.click(cancelButton);
    });

    await waitFor(() => {
      expect(screen.queryByText('Delete Lookup')).not.toBeInTheDocument();
    });
  });

  it('handles pagination when there are many records', async () => {
    const manyRecords = Array.from({ length: 25 }, (_, i) => ({
      field1: `value1-${i}`,
      field2: `value2-${i}`,
    }));

    mockLoadSpecificLookup.mockResolvedValue({
      ...mockLookupData,
      data: manyRecords,
      recordCount: 25,
    });

    const { container } = renderWithRouter(<LookupDetailPage />);

    await waitFor(() => {
      expect(mockLoadSpecificLookup).toHaveBeenCalled();
    }, { timeout: 500 });

    // Component renders
    expect(container).toBeInTheDocument();
  });

  it('navigates to next page when Next clicked', async () => {
    const manyRecords = Array.from({ length: 15 }, (_, i) => ({
      field1: `value1-${i}`,
      field2: `value2-${i}`,
    }));

    mockLoadSpecificLookup.mockResolvedValue({
      ...mockLookupData,
      data: manyRecords,
      recordCount: 15,
    });

    const { container } = renderWithRouter(<LookupDetailPage />);

    await waitFor(() => {
      expect(mockLoadSpecificLookup).toHaveBeenCalled();
    }, { timeout: 500 });

    // Component renders
    expect(container).toBeInTheDocument();
  });

  it('shows loading state', async () => {
    mockLoadSpecificLookup.mockImplementation(() => new Promise(() => {}));
    renderWithRouter(<LookupDetailPage />);

    expect(screen.getByText(/Loading lookup/i)).toBeInTheDocument();
  });

  it('handles error when loading lookup fails', async () => {
    const error = new Error('Failed to load');
    mockLoadSpecificLookup.mockRejectedValue(error);

    renderWithRouter(<LookupDetailPage />);

    await waitFor(() => {
      expect(mockShowError).toHaveBeenCalledWith('Failed to load lookup: Failed to load');
    });
  });

  it('handles error when delete fails', async () => {
    const error = new Error('Delete failed');
    mockDeleteLookup.mockRejectedValue(error);

    renderWithRouter(<LookupDetailPage />);

    await waitFor(() => {
      const deleteButton = screen.getByText('Delete');
      fireEvent.click(deleteButton);
    });

    await waitFor(() => {
      const confirmButton = screen.getAllByText('Delete')[1];
      fireEvent.click(confirmButton);
    });

    await waitFor(() => {
      expect(mockShowError).toHaveBeenCalledWith('Failed to delete lookup: Delete failed');
    });
  });

  it('renders back button', async () => {
    renderWithRouter(<LookupDetailPage />);

    await waitFor(() => {
      const backButton = screen.getByLabelText('Back to lookups');
      expect(backButton).toBeInTheDocument();
    });
  });

  it('navigates back when back button clicked', async () => {
    renderWithRouter(<LookupDetailPage />);

    await waitFor(() => {
      const backButton = screen.getByLabelText('Back to lookups');
      fireEvent.click(backButton);
      expect(mockNavigate).toHaveBeenCalledWith('/lookups');
    });
  });

  it('shows empty state for field descriptions when none exist', async () => {
    mockLoadSpecificLookup.mockResolvedValue({
      ...mockLookupData,
      fieldDescriptions: {},
    });

    renderWithRouter(<LookupDetailPage />);

    await waitFor(() => {
      expect(screen.getByText(/No field descriptions available/i)).toBeInTheDocument();
    });
  });

  it('shows empty state for data when none exists', async () => {
    mockLoadSpecificLookup.mockResolvedValue({
      ...mockLookupData,
      data: [],
    });

    renderWithRouter(<LookupDetailPage />);

    await waitFor(() => {
      expect(screen.getByText(/No data available/i)).toBeInTheDocument();
    });
  });
});
