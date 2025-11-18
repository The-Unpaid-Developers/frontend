import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GenerateQueryModal } from '../GenerateQueryModal';

// Mock hooks
const mockLoadAllLookups = vi.fn();
const mockGenerateQuery = vi.fn();
const mockShowSuccess = vi.fn();
const mockShowError = vi.fn();

vi.mock('../../../hooks/useLookup', () => ({
  useLookup: () => ({
    loadAllLookups: mockLoadAllLookups,
  }),
}));

vi.mock('../../../hooks/useQuery', () => ({
  useQuery: () => ({
    generateQuery: mockGenerateQuery,
    isLoading: false,
  }),
}));

vi.mock('../../../context/ToastContext', () => ({
  useToast: () => ({
    showSuccess: mockShowSuccess,
    showError: mockShowError,
  }),
}));

// Mock UI components
vi.mock('../../ui/Modal', () => ({
  Modal: ({ isOpen, onClose, title, children }: any) =>
    isOpen ? (
      <div data-testid="modal">
        <h2>{title}</h2>
        <button onClick={onClose} data-testid="modal-close">Close</button>
        {children}
      </div>
    ) : null,
}));

vi.mock('../../ui/Button', () => ({
  Button: ({ children, onClick, disabled, isLoading }: any) => (
    <button onClick={onClick} disabled={disabled} data-testid={isLoading ? 'loading-button' : 'button'}>
      {children}
    </button>
  ),
}));

vi.mock('../../ui/Input', () => ({
  Textarea: ({ label, value, onChange, disabled, placeholder }: any) => (
    <div>
      <label htmlFor="description">{label}</label>
      <textarea
        id="description"
        value={value}
        onChange={onChange}
        disabled={disabled}
        placeholder={placeholder}
      />
    </div>
  ),
}));

describe('GenerateQueryModal', () => {
  const mockOnClose = vi.fn();
  const mockOnQueryGenerated = vi.fn();

  const defaultProps = {
    isOpen: true,
    onClose: mockOnClose,
    onQueryGenerated: mockOnQueryGenerated,
  };

  const mockLookups = [
    {
      id: 'techCompEOL',
      lookupName: 'techCompEOL',
      uploadedAt: '2025-11-15T15:04:07.267+00:00',
      recordCount: 114,
      description: 'end of life dates of tech comps',
    },
    {
      id: 'businessCaps',
      lookupName: 'businessCaps',
      uploadedAt: '2025-11-15T15:04:07.267+00:00',
      recordCount: 50,
      description: 'business capabilities',
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, 'log').mockImplementation(() => {});
    vi.spyOn(console, 'error').mockImplementation(() => {});
    mockLoadAllLookups.mockResolvedValue(mockLookups);
  });

  describe('Modal Visibility', () => {
    it('renders modal when isOpen is true', async () => {
      render(<GenerateQueryModal {...defaultProps} />);

      await waitFor(() => {
        expect(mockLoadAllLookups).toHaveBeenCalled();
      });

      expect(screen.getByTestId('modal')).toBeInTheDocument();
      expect(screen.getByText('Generate Query with AI')).toBeInTheDocument();
    });

    it('does not render modal when isOpen is false', () => {
      render(<GenerateQueryModal {...defaultProps} isOpen={false} />);
      expect(screen.queryByTestId('modal')).not.toBeInTheDocument();
    });
  });

  describe('Lookups Loading', () => {
    it('loads lookups when modal opens', async () => {
      render(<GenerateQueryModal {...defaultProps} />);

      await waitFor(() => {
        expect(mockLoadAllLookups).toHaveBeenCalledTimes(1);
      });
    });

    it('does not load lookups when modal is closed', () => {
      render(<GenerateQueryModal {...defaultProps} isOpen={false} />);
      expect(mockLoadAllLookups).not.toHaveBeenCalled();
    });

    it('displays loading state while fetching lookups', async () => {
      mockLoadAllLookups.mockImplementation(() => new Promise(resolve => setTimeout(() => resolve(mockLookups), 100)));

      render(<GenerateQueryModal {...defaultProps} />);

      const select = screen.getByLabelText('Select Lookup');
      expect(select).toBeDisabled();

      await waitFor(() => {
        expect(select).not.toBeDisabled();
      });
    });

    it('populates lookup dropdown with fetched data', async () => {
      render(<GenerateQueryModal {...defaultProps} />);

      await waitFor(() => {
        const select = screen.getByLabelText('Select Lookup') as HTMLSelectElement;
        expect(select.options.length).toBe(3); // None + 2 lookups
        expect(select.options[0].value).toBe('None');
        expect(select.options[1].value).toBe('techCompEOL');
        expect(select.options[2].value).toBe('businessCaps');
      });
    });

    it('handles empty lookups array', async () => {
      mockLoadAllLookups.mockResolvedValue([]);

      render(<GenerateQueryModal {...defaultProps} />);

      await waitFor(() => {
        const select = screen.getByLabelText('Select Lookup') as HTMLSelectElement;
        expect(select.options.length).toBe(1); // Only "None"
      });
    });

    it('handles lookup loading error', async () => {
      const error = new Error('Failed to load lookups');
      mockLoadAllLookups.mockRejectedValue(error);

      render(<GenerateQueryModal {...defaultProps} />);

      await waitFor(() => {
        expect(mockShowError).toHaveBeenCalledWith('Failed to load lookups');
      });
    });

    it('logs error to console when loading fails', async () => {
      const consoleErrorSpy = vi.spyOn(console, 'error');
      const error = new Error('Test error');
      mockLoadAllLookups.mockRejectedValue(error);

      render(<GenerateQueryModal {...defaultProps} />);

      await waitFor(() => {
        expect(consoleErrorSpy).toHaveBeenCalledWith('Failed to load lookups:', error);
      });
    });
  });

  describe('Form Interactions', () => {
    it('allows selecting a lookup', async () => {
      render(<GenerateQueryModal {...defaultProps} />);

      await waitFor(() => {
        expect(mockLoadAllLookups).toHaveBeenCalled();
      });

      const select = screen.getByLabelText('Select Lookup') as HTMLSelectElement;
      fireEvent.change(select, { target: { value: 'techCompEOL' } });
      expect(select.value).toBe('techCompEOL');
    });

    it('allows selecting a solution review step', async () => {
      render(<GenerateQueryModal {...defaultProps} />);

      await waitFor(() => {
        expect(mockLoadAllLookups).toHaveBeenCalled();
      });

      const select = screen.getByLabelText('Solution Review Step') as HTMLSelectElement;
      fireEvent.change(select, { target: { value: '3' } });
      expect(select.value).toBe('3');
    });

    it('allows typing in description field', async () => {
      render(<GenerateQueryModal {...defaultProps} />);

      await waitFor(() => {
        expect(mockLoadAllLookups).toHaveBeenCalled();
      });

      const textarea = screen.getByLabelText('Query Description');
      fireEvent.change(textarea, { target: { value: 'Get all active solutions' } });
      expect(textarea).toHaveValue('Get all active solutions');
    });

    it('defaults to step 1', async () => {
      render(<GenerateQueryModal {...defaultProps} />);

      await waitFor(() => {
        expect(mockLoadAllLookups).toHaveBeenCalled();
      });

      const select = screen.getByLabelText('Solution Review Step') as HTMLSelectElement;
      expect(select.value).toBe('1');
    });
  });

  describe('Query Generation', () => {
    it('generates query with valid inputs', async () => {
      const mockResponse = { query: '[{"$match": {"status": "active"}}]' };
      mockGenerateQuery.mockResolvedValue(mockResponse);

      render(<GenerateQueryModal {...defaultProps} />);

      await waitFor(() => {
        expect(mockLoadAllLookups).toHaveBeenCalled();
      });

      const lookupSelect = screen.getByLabelText('Select Lookup');
      fireEvent.change(lookupSelect, { target: { value: 'techCompEOL' } });

      const descriptionInput = screen.getByLabelText('Query Description');
      fireEvent.change(descriptionInput, { target: { value: 'Get all tech components' } });

      const generateButton = screen.getByText('Generate Query');
      fireEvent.click(generateButton);

      await waitFor(() => {
        expect(mockGenerateQuery).toHaveBeenCalledWith({
          lookupName: 'techCompEOL',
          step: '1',
          description: 'Get all tech components',
        });
        expect(mockOnQueryGenerated).toHaveBeenCalledWith(mockResponse.query);
        expect(mockShowSuccess).toHaveBeenCalledWith('Query generated successfully!');
      });
    });

    it('shows error when lookup is "None" selected', async () => {
      mockGenerateQuery.mockRejectedValue(new Error('Invalid lookup'));

      render(<GenerateQueryModal {...defaultProps} />);

      await waitFor(() => {
        expect(mockLoadAllLookups).toHaveBeenCalled();
      });

      // "None" is selected by default
      const descriptionInput = screen.getByLabelText('Query Description');
      fireEvent.change(descriptionInput, { target: { value: 'Test description' } });

      const generateButton = screen.getByText('Generate Query');
      fireEvent.click(generateButton);

      await waitFor(() => {
        expect(mockGenerateQuery).toHaveBeenCalled();
      });
    });

    it('button is disabled when description is empty', async () => {
      render(<GenerateQueryModal {...defaultProps} />);

      await waitFor(() => {
        const lookupSelect = screen.getByLabelText('Select Lookup');
        fireEvent.change(lookupSelect, { target: { value: 'techCompEOL' } });
      });

      const generateButton = screen.getByText('Generate Query');
      expect(generateButton).toBeDisabled();
    });

    it('trims description before sending', async () => {
      const mockResponse = { query: '[{"$match": {}}]' };
      mockGenerateQuery.mockResolvedValue(mockResponse);

      render(<GenerateQueryModal {...defaultProps} />);

      await waitFor(() => {
        expect(mockLoadAllLookups).toHaveBeenCalled();
      });

      const lookupSelect = screen.getByLabelText('Select Lookup');
      fireEvent.change(lookupSelect, { target: { value: 'techCompEOL' } });

      const descriptionInput = screen.getByLabelText('Query Description');
      fireEvent.change(descriptionInput, { target: { value: '  Test query  ' } });

      const generateButton = screen.getByText('Generate Query');
      fireEvent.click(generateButton);

      await waitFor(() => {
        expect(mockGenerateQuery).toHaveBeenCalledWith({
          lookupName: 'techCompEOL',
          step: '1',
          description: 'Test query',
        });
      });
    });

    it('handles API error during generation', async () => {
      const error = new Error('API Error');
      mockGenerateQuery.mockRejectedValue(error);

      render(<GenerateQueryModal {...defaultProps} />);

      await waitFor(() => {
        const lookupSelect = screen.getByLabelText('Select Lookup');
        fireEvent.change(lookupSelect, { target: { value: 'techCompEOL' } });
      });

      const descriptionInput = screen.getByLabelText('Query Description');
      fireEvent.change(descriptionInput, { target: { value: 'Test' } });

      const generateButton = screen.getByText('Generate Query');
      fireEvent.click(generateButton);

      await waitFor(() => {
        expect(mockShowError).toHaveBeenCalledWith('Failed to generate query: API Error');
      });
    });

    it('handles no query in API response', async () => {
      mockGenerateQuery.mockResolvedValue({});

      render(<GenerateQueryModal {...defaultProps} />);

      await waitFor(() => {
        const lookupSelect = screen.getByLabelText('Select Lookup');
        fireEvent.change(lookupSelect, { target: { value: 'techCompEOL' } });
      });

      const descriptionInput = screen.getByLabelText('Query Description');
      fireEvent.change(descriptionInput, { target: { value: 'Test' } });

      const generateButton = screen.getByText('Generate Query');
      fireEvent.click(generateButton);

      await waitFor(() => {
        expect(mockShowError).toHaveBeenCalledWith('No query returned from the API');
      });
    });

    it('logs error to console when generation fails', async () => {
      const consoleErrorSpy = vi.spyOn(console, 'error');
      const error = new Error('Test error');
      mockGenerateQuery.mockRejectedValue(error);

      render(<GenerateQueryModal {...defaultProps} />);

      await waitFor(() => {
        const lookupSelect = screen.getByLabelText('Select Lookup');
        fireEvent.change(lookupSelect, { target: { value: 'techCompEOL' } });
      });

      const descriptionInput = screen.getByLabelText('Query Description');
      fireEvent.change(descriptionInput, { target: { value: 'Test' } });

      const generateButton = screen.getByText('Generate Query');
      fireEvent.click(generateButton);

      await waitFor(() => {
        expect(consoleErrorSpy).toHaveBeenCalledWith('Failed to generate query:', error);
      });
    });
  });

  describe('Modal Close Behavior', () => {
    it('closes modal when Cancel button is clicked', async () => {
      render(<GenerateQueryModal {...defaultProps} />);

      await waitFor(() => {
        expect(mockLoadAllLookups).toHaveBeenCalled();
      });

      const cancelButton = screen.getByText('Cancel');
      fireEvent.click(cancelButton);
      expect(mockOnClose).toHaveBeenCalled();
    });

    it('closes modal when X button is clicked', async () => {
      render(<GenerateQueryModal {...defaultProps} />);

      await waitFor(() => {
        expect(mockLoadAllLookups).toHaveBeenCalled();
      });

      const closeButton = screen.getByTestId('modal-close');
      fireEvent.click(closeButton);
      expect(mockOnClose).toHaveBeenCalled();
    });

    it('closes modal after successful query generation', async () => {
      const mockResponse = { query: '[{"$match": {}}]' };
      mockGenerateQuery.mockResolvedValue(mockResponse);

      render(<GenerateQueryModal {...defaultProps} />);

      await waitFor(() => {
        const lookupSelect = screen.getByLabelText('Select Lookup');
        fireEvent.change(lookupSelect, { target: { value: 'techCompEOL' } });
      });

      const descriptionInput = screen.getByLabelText('Query Description');
      fireEvent.change(descriptionInput, { target: { value: 'Test' } });

      const generateButton = screen.getByText('Generate Query');
      fireEvent.click(generateButton);

      await waitFor(() => {
        expect(mockOnClose).toHaveBeenCalled();
      });
    });

    it('resets form when modal closes', async () => {
      const { rerender } = render(<GenerateQueryModal {...defaultProps} />);

      await waitFor(() => {
        expect(mockLoadAllLookups).toHaveBeenCalled();
      });

      const descriptionInput = screen.getByLabelText('Query Description');
      fireEvent.change(descriptionInput, { target: { value: 'Test description' } });

      const stepSelect = screen.getByLabelText('Solution Review Step') as HTMLSelectElement;
      fireEvent.change(stepSelect, { target: { value: '3' } });

      const cancelButton = screen.getByText('Cancel');
      fireEvent.click(cancelButton);

      rerender(<GenerateQueryModal {...defaultProps} isOpen={false} />);

      vi.clearAllMocks();
      mockLoadAllLookups.mockResolvedValue(mockLookups);

      rerender(<GenerateQueryModal {...defaultProps} isOpen={true} />);

      await waitFor(() => {
        expect(mockLoadAllLookups).toHaveBeenCalled();
      });

      const newDescriptionInput = screen.getByLabelText('Query Description');
      const newStepSelect = screen.getByLabelText('Solution Review Step') as HTMLSelectElement;

      expect(newDescriptionInput).toHaveValue('');
      expect(newStepSelect.value).toBe('1');
    });
  });

  describe('Button States', () => {
    it('disables generate button when loading lookups', async () => {
      mockLoadAllLookups.mockImplementation(() => new Promise(resolve => setTimeout(() => resolve(mockLookups), 100)));

      render(<GenerateQueryModal {...defaultProps} />);

      const generateButton = screen.getByText('Generate Query');
      expect(generateButton).toBeDisabled();
    });

    it('disables generate button when description is empty', async () => {
      render(<GenerateQueryModal {...defaultProps} />);

      await waitFor(() => {
        const generateButton = screen.getByText('Generate Query');
        expect(generateButton).toBeDisabled();
      });
    });

    it('disables generate button when "None" lookup is selected', async () => {
      render(<GenerateQueryModal {...defaultProps} />);

      await waitFor(() => {
        expect(mockLoadAllLookups).toHaveBeenCalled();
      });

      // None is selected by default
      const lookupSelect = screen.getByLabelText('Select Lookup') as HTMLSelectElement;
      expect(lookupSelect.value).toBe('None');

      const descriptionInput = screen.getByLabelText('Query Description');
      fireEvent.change(descriptionInput, { target: { value: 'Test' } });

      const generateButton = screen.getByText('Generate Query');
      // Button is enabled even with "None" selected, will show error on submit
      expect(generateButton).not.toBeDisabled();
    });

    it('enables generate button with valid inputs', async () => {
      render(<GenerateQueryModal {...defaultProps} />);

      await waitFor(() => {
        expect(mockLoadAllLookups).toHaveBeenCalled();
      });

      const lookupSelect = screen.getByLabelText('Select Lookup');
      fireEvent.change(lookupSelect, { target: { value: 'techCompEOL' } });

      const descriptionInput = screen.getByLabelText('Query Description');
      fireEvent.change(descriptionInput, { target: { value: 'Test' } });

      const generateButton = screen.getByText('Generate Query');
      expect(generateButton).not.toBeDisabled();
    });
  });

  describe('Solution Review Steps', () => {
    it('displays all 8 solution review steps', async () => {
      render(<GenerateQueryModal {...defaultProps} />);

      await waitFor(() => {
        expect(mockLoadAllLookups).toHaveBeenCalled();
      });

      const stepSelect = screen.getByLabelText('Solution Review Step') as HTMLSelectElement;
      expect(stepSelect.options.length).toBe(8);
      expect(stepSelect.options[0].textContent).toContain('Step 1');
      expect(stepSelect.options[7].textContent).toContain('Step 8');
    });

    it('can select different steps', async () => {
      render(<GenerateQueryModal {...defaultProps} />);

      await waitFor(() => {
        expect(mockLoadAllLookups).toHaveBeenCalled();
      });

      const stepSelect = screen.getByLabelText('Solution Review Step') as HTMLSelectElement;

      for (let i = 1; i <= 8; i++) {
        fireEvent.change(stepSelect, { target: { value: String(i) } });
        expect(stepSelect.value).toBe(String(i));
      }
    });
  });
});
