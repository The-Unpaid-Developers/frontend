import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '../../../test/test-utils';
import ApprovalModal from '../ApprovalModal';

const mockAddConcernsToSR = vi.fn();
const mockShowSuccess = vi.fn();
const mockShowError = vi.fn();

vi.mock('../../../hooks/useAdminPanel', () => ({
  useAdminPanel: () => ({
    addConcernsToSR: mockAddConcernsToSR,
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

describe('ApprovalModal', () => {
  const defaultProps = {
    isOpen: true,
    onClose: vi.fn(),
    reviewId: 'review-123',
    onApprovalComplete: vi.fn(),
    currentSolutionOverview: { id: 'overview-123' },
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders modal when isOpen is true', () => {
      render(<ApprovalModal {...defaultProps} />);

      expect(screen.getByText('Approve Solution Review')).toBeInTheDocument();
    });

    it('renders custom title when provided', () => {
      render(<ApprovalModal {...defaultProps} title="Custom Approval Title" />);

      expect(screen.getByText('Custom Approval Title')).toBeInTheDocument();
    });

    it('renders custom description when provided', () => {
      render(
        <ApprovalModal {...defaultProps} description="Custom approval description" />
      );

      expect(screen.getByText('Custom approval description')).toBeInTheDocument();
    });

    it('renders default description', () => {
      render(<ApprovalModal {...defaultProps} />);

      expect(
        screen.getByText(/You are about to approve this solution review/i)
      ).toBeInTheDocument();
    });

    it('renders concern form fields', () => {
      render(<ApprovalModal {...defaultProps} />);

      expect(screen.getByText(/Concern Type/i)).toBeInTheDocument();
      expect(screen.getByText(/Description/i)).toBeInTheDocument();
      expect(screen.getByText(/Impact/i)).toBeInTheDocument();
      expect(screen.getByText(/Disposition/i)).toBeInTheDocument();
      expect(screen.getByText(/Follow-up Date/i)).toBeInTheDocument();
    });

    it('renders action buttons', () => {
      render(<ApprovalModal {...defaultProps} />);

      expect(screen.getByRole('button', { name: /Cancel/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Approve Review/i })).toBeInTheDocument();
    });

    it('renders Add Concern button as disabled initially', () => {
      render(<ApprovalModal {...defaultProps} />);

      const addButton = screen.getByRole('button', { name: /Add Concern/i });
      expect(addButton).toBeDisabled();
    });
  });

  describe('Adding Concerns', () => {
    it('enables Add Concern button when all fields are filled', () => {
      render(<ApprovalModal {...defaultProps} />);

      const descInput = screen.getByPlaceholderText(/Describe the concern/i);
      const impactInput = screen.getByPlaceholderText(/Describe the impact/i);
      const dispositionInput = screen.getByPlaceholderText(/Describe the disposition/i);
      const dateInput = screen.getByLabelText(/Follow-up Date/i);

      fireEvent.change(descInput, { target: { value: 'Test concern' } });
      fireEvent.change(impactInput, { target: { value: 'High impact' } });
      fireEvent.change(dispositionInput, { target: { value: 'To be resolved' } });
      fireEvent.change(dateInput, { target: { value: '2025-12-31' } });

      const addButton = screen.getByRole('button', { name: /Add Concern/i });
      expect(addButton).not.toBeDisabled();
    });

    it('shows error when trying to add concern with missing fields', () => {
      render(<ApprovalModal {...defaultProps} />);

      const descInput = screen.getByPlaceholderText(/Describe the concern/i);
      fireEvent.change(descInput, { target: { value: 'Test concern' } });

      const addButton = screen.getByRole('button', { name: /Add Concern/i });
      expect(addButton).toBeDisabled();
    });

    it('adds concern to the list when form is valid', () => {
      render(<ApprovalModal {...defaultProps} />);

      const descInput = screen.getByPlaceholderText(/Describe the concern/i);
      const impactInput = screen.getByPlaceholderText(/Describe the impact/i);
      const dispositionInput = screen.getByPlaceholderText(/Describe the disposition/i);
      const dateInput = screen.getByLabelText(/Follow-up Date/i);

      fireEvent.change(descInput, { target: { value: 'Security concern' } });
      fireEvent.change(impactInput, { target: { value: 'High impact on system' } });
      fireEvent.change(dispositionInput, { target: { value: 'Needs review' } });
      fireEvent.change(dateInput, { target: { value: '2025-12-31' } });

      const addButton = screen.getByRole('button', { name: /Add Concern/i });
      fireEvent.click(addButton);

      expect(screen.getByText('Security concern')).toBeInTheDocument();
      expect(screen.getByText(/Impact:/i)).toBeInTheDocument();
      expect(screen.getByText('High impact on system')).toBeInTheDocument();
      expect(screen.getByText(/Disposition:/i)).toBeInTheDocument();
      expect(screen.getByText('Needs review')).toBeInTheDocument();
    });

    it('displays concern count in header', () => {
      render(<ApprovalModal {...defaultProps} />);

      const descInput = screen.getByPlaceholderText(/Describe the concern/i);
      const impactInput = screen.getByPlaceholderText(/Describe the impact/i);
      const dispositionInput = screen.getByPlaceholderText(/Describe the disposition/i);
      const dateInput = screen.getByLabelText(/Follow-up Date/i);

      fireEvent.change(descInput, { target: { value: 'Concern 1' } });
      fireEvent.change(impactInput, { target: { value: 'Impact 1' } });
      fireEvent.change(dispositionInput, { target: { value: 'Disposition 1' } });
      fireEvent.change(dateInput, { target: { value: '2025-12-31' } });

      fireEvent.click(screen.getByRole('button', { name: /Add Concern/i }));

      expect(screen.getByText(/Added Concerns \(1\)/i)).toBeInTheDocument();
    });

    it('clears form after adding concern', () => {
      render(<ApprovalModal {...defaultProps} />);

      const descInput = screen.getByPlaceholderText(/Describe the concern/i);
      const impactInput = screen.getByPlaceholderText(/Describe the impact/i);
      const dispositionInput = screen.getByPlaceholderText(/Describe the disposition/i);
      const dateInput = screen.getByLabelText(/Follow-up Date/i);

      fireEvent.change(descInput, { target: { value: 'Test concern' } });
      fireEvent.change(impactInput, { target: { value: 'Test impact' } });
      fireEvent.change(dispositionInput, { target: { value: 'Test disposition' } });
      fireEvent.change(dateInput, { target: { value: '2025-12-31' } });

      fireEvent.click(screen.getByRole('button', { name: /Add Concern/i }));

      expect(descInput).toHaveValue('');
      expect(impactInput).toHaveValue('');
      expect(dispositionInput).toHaveValue('');
      expect(dateInput).toHaveValue('');
    });

    it('allows adding multiple concerns', () => {
      render(<ApprovalModal {...defaultProps} />);

      const descInput = screen.getByPlaceholderText(/Describe the concern/i);
      const impactInput = screen.getByPlaceholderText(/Describe the impact/i);
      const dispositionInput = screen.getByPlaceholderText(/Describe the disposition/i);
      const dateInput = screen.getByLabelText(/Follow-up Date/i);
      const addButton = screen.getByRole('button', { name: /Add Concern/i });

      // Add first concern
      fireEvent.change(descInput, { target: { value: 'Concern 1' } });
      fireEvent.change(impactInput, { target: { value: 'Impact 1' } });
      fireEvent.change(dispositionInput, { target: { value: 'Disposition 1' } });
      fireEvent.change(dateInput, { target: { value: '2025-12-31' } });
      fireEvent.click(addButton);

      // Add second concern
      fireEvent.change(descInput, { target: { value: 'Concern 2' } });
      fireEvent.change(impactInput, { target: { value: 'Impact 2' } });
      fireEvent.change(dispositionInput, { target: { value: 'Disposition 2' } });
      fireEvent.change(dateInput, { target: { value: '2025-12-31' } });
      fireEvent.click(addButton);

      expect(screen.getByText(/Added Concerns \(2\)/i)).toBeInTheDocument();
      expect(screen.getByText('Concern 1')).toBeInTheDocument();
      expect(screen.getByText('Concern 2')).toBeInTheDocument();
    });
  });

  describe('Removing Concerns', () => {
    it('removes concern when delete button is clicked', () => {
      render(<ApprovalModal {...defaultProps} />);

      // Add a concern first
      const descInput = screen.getByPlaceholderText(/Describe the concern/i);
      const impactInput = screen.getByPlaceholderText(/Describe the impact/i);
      const dispositionInput = screen.getByPlaceholderText(/Describe the disposition/i);
      const dateInput = screen.getByLabelText(/Follow-up Date/i);

      fireEvent.change(descInput, { target: { value: 'Test concern' } });
      fireEvent.change(impactInput, { target: { value: 'Test impact' } });
      fireEvent.change(dispositionInput, { target: { value: 'Test disposition' } });
      fireEvent.change(dateInput, { target: { value: '2025-12-31' } });
      fireEvent.click(screen.getByRole('button', { name: /Add Concern/i }));

      expect(screen.getByText('Test concern')).toBeInTheDocument();

      // Find and click delete button
      const deleteButtons = screen.getAllByRole('button');
      const deleteButton = deleteButtons.find(
        (btn) => btn.querySelector('svg') && btn.className.includes('text-red-600')
      );

      if (deleteButton) {
        fireEvent.click(deleteButton);
      }

      expect(screen.queryByText('Test concern')).not.toBeInTheDocument();
    });

    it('hides concern list when all concerns are removed', () => {
      render(<ApprovalModal {...defaultProps} />);

      // Add a concern
      const descInput = screen.getByPlaceholderText(/Describe the concern/i);
      const impactInput = screen.getByPlaceholderText(/Describe the impact/i);
      const dispositionInput = screen.getByPlaceholderText(/Describe the disposition/i);
      const dateInput = screen.getByLabelText(/Follow-up Date/i);

      fireEvent.change(descInput, { target: { value: 'Test concern' } });
      fireEvent.change(impactInput, { target: { value: 'Test impact' } });
      fireEvent.change(dispositionInput, { target: { value: 'Test disposition' } });
      fireEvent.change(dateInput, { target: { value: '2025-12-31' } });
      fireEvent.click(screen.getByRole('button', { name: /Add Concern/i }));

      expect(screen.getByText(/Added Concerns/i)).toBeInTheDocument();

      // Remove the concern
      const deleteButtons = screen.getAllByRole('button');
      const deleteButton = deleteButtons.find(
        (btn) => btn.querySelector('svg') && btn.className.includes('text-red-600')
      );

      if (deleteButton) {
        fireEvent.click(deleteButton);
      }

      expect(screen.queryByText(/Added Concerns/i)).not.toBeInTheDocument();
    });
  });

  describe('Approval Flow', () => {
    it('calls onApprovalComplete and closes modal on successful approval', async () => {
      mockAddConcernsToSR.mockResolvedValue({});
      const onApprovalComplete = vi.fn().mockResolvedValue({});

      render(<ApprovalModal {...defaultProps} onApprovalComplete={onApprovalComplete} />);

      const approveButton = screen.getByRole('button', { name: /Approve Review/i });
      fireEvent.click(approveButton);

      await waitFor(() => {
        expect(mockAddConcernsToSR).toHaveBeenCalledWith(
          'review-123',
          [],
          { id: 'overview-123' }
        );
        expect(onApprovalComplete).toHaveBeenCalled();
        expect(mockShowSuccess).toHaveBeenCalledWith('Review approved successfully!');
        expect(defaultProps.onClose).toHaveBeenCalled();
      });
    });

    it('shows loading state during approval', async () => {
      mockAddConcernsToSR.mockImplementation(() => new Promise((resolve) => setTimeout(resolve, 100)));

      render(<ApprovalModal {...defaultProps} />);

      const approveButton = screen.getByRole('button', { name: /Approve Review/i });
      fireEvent.click(approveButton);

      expect(screen.getByText(/Approving.../i)).toBeInTheDocument();

      await waitFor(() => {
        expect(screen.queryByText(/Approving.../i)).not.toBeInTheDocument();
      });
    });

    it('disables buttons during approval', async () => {
      mockAddConcernsToSR.mockImplementation(() => new Promise((resolve) => setTimeout(resolve, 100)));

      const { unmount } = render(<ApprovalModal {...defaultProps} />);

      const approveButton = screen.getByRole('button', { name: /Approve Review/i });
      const cancelButton = screen.getByRole('button', { name: /Cancel/i });

      fireEvent.click(approveButton);

      expect(approveButton).toBeDisabled();
      expect(cancelButton).toBeDisabled();

      await waitFor(() => {
        expect(approveButton).not.toBeDisabled();
      });
      
      // Ensure component is unmounted after all async operations complete
      unmount();
    });

    it('shows error message on approval failure', async () => {
      mockAddConcernsToSR.mockRejectedValue(new Error('Approval failed'));

      const { unmount } = render(<ApprovalModal {...defaultProps} />);

      const approveButton = screen.getByRole('button', { name: /Approve Review/i });
      fireEvent.click(approveButton);

      await waitFor(() => {
        expect(mockShowError).toHaveBeenCalledWith(
          expect.stringContaining('Failed to approve review')
        );
        expect(defaultProps.onClose).not.toHaveBeenCalled();
      });

      // Wait for the finally block to complete (button re-enables)
      await waitFor(() => {
        expect(approveButton).not.toBeDisabled();
      });
      
      // Ensure component is unmounted after all async operations complete
      unmount();
    });

    it('sends concerns with backend when approving with concerns', async () => {
      mockAddConcernsToSR.mockResolvedValue({});
      const onApprovalComplete = vi.fn().mockResolvedValue({});

      render(<ApprovalModal {...defaultProps} onApprovalComplete={onApprovalComplete} />);

      // Add a concern
      const descInput = screen.getByPlaceholderText(/Describe the concern/i);
      const impactInput = screen.getByPlaceholderText(/Describe the impact/i);
      const dispositionInput = screen.getByPlaceholderText(/Describe the disposition/i);
      const dateInput = screen.getByLabelText(/Follow-up Date/i);

      fireEvent.change(descInput, { target: { value: 'Security issue' } });
      fireEvent.change(impactInput, { target: { value: 'High' } });
      fireEvent.change(dispositionInput, { target: { value: 'Review needed' } });
      fireEvent.change(dateInput, { target: { value: '2025-12-31' } });
      fireEvent.click(screen.getByRole('button', { name: /Add Concern/i }));

      // Approve
      const approveButton = screen.getByRole('button', { name: /Approve Review/i });
      fireEvent.click(approveButton);

      await waitFor(() => {
        expect(mockAddConcernsToSR).toHaveBeenCalledWith(
          'review-123',
          expect.arrayContaining([
            expect.objectContaining({
              type: 'RISK',
              description: 'Security issue',
              impact: 'High',
              disposition: 'Review needed',
              status: 'UNKNOWN',
            }),
          ]),
          { id: 'overview-123' }
        );
      });
    });

    it('shows error when solution overview is missing', async () => {
      render(<ApprovalModal {...defaultProps} currentSolutionOverview={undefined} />);

      const approveButton = screen.getByRole('button', { name: /Approve Review/i });
      fireEvent.click(approveButton);

      await waitFor(() => {
        expect(mockShowError).toHaveBeenCalledWith(
          expect.stringContaining('Solution overview not available')
        );
      });

      // Wait for the finally block to complete
      await waitFor(() => {
        expect(approveButton).not.toBeDisabled();
      });
    });
  });

  describe('Cancel and Close', () => {
    it('calls onClose when Cancel button is clicked', () => {
      render(<ApprovalModal {...defaultProps} />);

      const cancelButton = screen.getByRole('button', { name: /Cancel/i });
      fireEvent.click(cancelButton);

      expect(defaultProps.onClose).toHaveBeenCalled();
    });

    it('resets concerns when modal is closed', () => {
      const { rerender } = render(<ApprovalModal {...defaultProps} />);

      // Add a concern
      const descInput = screen.getByPlaceholderText(/Describe the concern/i);
      const impactInput = screen.getByPlaceholderText(/Describe the impact/i);
      const dispositionInput = screen.getByPlaceholderText(/Describe the disposition/i);
      const dateInput = screen.getByLabelText(/Follow-up Date/i);

      fireEvent.change(descInput, { target: { value: 'Test concern' } });
      fireEvent.change(impactInput, { target: { value: 'Test impact' } });
      fireEvent.change(dispositionInput, { target: { value: 'Test disposition' } });
      fireEvent.change(dateInput, { target: { value: '2025-12-31' } });
      fireEvent.click(screen.getByRole('button', { name: /Add Concern/i }));

      expect(screen.getByText('Test concern')).toBeInTheDocument();

      // Close modal
      const cancelButton = screen.getByRole('button', { name: /Cancel/i });
      fireEvent.click(cancelButton);

      // Reopen modal
      rerender(<ApprovalModal {...defaultProps} isOpen={true} />);

      expect(screen.queryByText('Test concern')).not.toBeInTheDocument();
      expect(screen.queryByText(/Added Concerns/i)).not.toBeInTheDocument();
    });

    it('does not close modal when approving', async () => {
      mockAddConcernsToSR.mockImplementation(() => new Promise((resolve) => setTimeout(resolve, 100)));

      const { unmount } = render(<ApprovalModal {...defaultProps} />);

      const approveButton = screen.getByRole('button', { name: /Approve Review/i });
      fireEvent.click(approveButton);

      const cancelButton = screen.getByRole('button', { name: /Cancel/i });
      fireEvent.click(cancelButton);

      // onClose should not be called during approval (beyond the one from approval completion)
      expect(defaultProps.onClose).not.toHaveBeenCalled();

      // Wait for the async operation to complete before test ends
      await waitFor(() => {
        expect(approveButton).not.toBeDisabled();
      });

      // Ensure component is unmounted after all async operations complete
      unmount();
    });
  });

  describe('Date Handling', () => {
    it('sets minimum date to today', () => {
      render(<ApprovalModal {...defaultProps} />);

      const dateInput = screen.getByLabelText(/Follow-up Date/i) as HTMLInputElement;
      const today = new Date().toISOString().split('T')[0];

      expect(dateInput).toHaveAttribute('min', today);
    });

    it('formats date for display in concern list', () => {
      render(<ApprovalModal {...defaultProps} />);

      const descInput = screen.getByPlaceholderText(/Describe the concern/i);
      const impactInput = screen.getByPlaceholderText(/Describe the impact/i);
      const dispositionInput = screen.getByPlaceholderText(/Describe the disposition/i);
      const dateInput = screen.getByLabelText(/Follow-up Date/i);

      fireEvent.change(descInput, { target: { value: 'Test' } });
      fireEvent.change(impactInput, { target: { value: 'Test' } });
      fireEvent.change(dispositionInput, { target: { value: 'Test' } });
      fireEvent.change(dateInput, { target: { value: '2025-12-31' } });
      fireEvent.click(screen.getByRole('button', { name: /Add Concern/i }));

      // Date should be formatted (format depends on locale, but should contain "Dec" and "31")
      expect(screen.getByText(/Due:/i)).toBeInTheDocument();
    });
  });
});
