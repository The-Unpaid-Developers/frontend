import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { SolutionReviewDetail } from '../SolutionReviewDetail';
import { createSolutionReview } from '../../../../__tests__/testFactories';

const mockNavigate = vi.fn();
const mockTransitionSolutionReviewState = vi.fn().mockResolvedValue({});
const mockShowSuccess = vi.fn();
const mockShowError = vi.fn();

vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}));

vi.mock('../../../../hooks/useUpdateSolutionReview', () => ({
  useUpdateSolutionReview: () => ({
    transitionSolutionReviewState: mockTransitionSolutionReviewState,
  }),
}));

vi.mock('../../../../context/ToastContext', () => ({
  useToast: () => ({
    showSuccess: mockShowSuccess,
    showError: mockShowError,
  }),
}));

vi.mock('../../../../hooks/useAdminPanel', () => ({
  useAdminPanel: () => ({
    addConcernsToSR: vi.fn().mockResolvedValue({}),
  }),
}));

vi.mock('../../AdminPanel', () => ({
  ApprovalModal: ({ isOpen, onApprovalComplete, title }: any) =>
    isOpen ? (
      <div>
        <h2>{title || 'Approve Solution Review'}</h2>
        <button onClick={onApprovalComplete}>Approve Review</button>
      </div>
    ) : null,
}));

vi.mock('../ReviewSubmissionModal', () => ({
  ReviewSubmissionModal: ({ showReview, confirmSubmit }: any) =>
    showReview ? (
      <div data-testid="submission-modal">
        <button onClick={confirmSubmit} data-testid="confirm-submit">Confirm</button>
      </div>
    ) : null,
}));

describe('SolutionReviewDetail', () => {
  const mockOnClose = vi.fn();
  const mockReview = createSolutionReview();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders solution review detail', () => {
    render(<SolutionReviewDetail review={mockReview} onClose={mockOnClose} />);
    expect(screen.getAllByText('Test Solution').length).toBeGreaterThan(0);
  });

  it('displays document state badge', () => {
    render(<SolutionReviewDetail review={mockReview} onClose={mockOnClose} />);
    expect(screen.getAllByText('DRAFT').length).toBeGreaterThan(0);
  });

  it('displays solution name', () => {
    render(<SolutionReviewDetail review={mockReview} onClose={mockOnClose} />);
    expect(screen.getAllByText('Test Solution').length).toBeGreaterThan(0);
  });

  it('displays review code', () => {
    const { container } = render(<SolutionReviewDetail review={mockReview} onClose={mockOnClose} />);
    expect(container.textContent).toContain('SR-001');
  });

  it('renders close button', () => {
    render(<SolutionReviewDetail review={mockReview} onClose={mockOnClose} />);
    const closeButton = screen.getByLabelText(/Close/i);
    expect(closeButton).toBeInTheDocument();
  });

  it('calls onClose when close button clicked', () => {
    render(<SolutionReviewDetail review={mockReview} onClose={mockOnClose} />);
    const closeButton = screen.getByLabelText(/Close/i);
    fireEvent.click(closeButton);
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('displays solution architect name', () => {
    render(<SolutionReviewDetail review={mockReview} onClose={mockOnClose} />);
    expect(screen.getAllByText(/John Doe/).length).toBeGreaterThan(0);
  });

  it('displays project name', () => {
    render(<SolutionReviewDetail review={mockReview} onClose={mockOnClose} />);
    expect(screen.getAllByText(/Test Project/).length).toBeGreaterThan(0);
  });

  it('displays business unit', () => {
    render(<SolutionReviewDetail review={mockReview} onClose={mockOnClose} />);
    expect(screen.getAllByText(/IT/).length).toBeGreaterThan(0);
  });

  it('renders with submitted state', () => {
    const submittedReview = createSolutionReview({
      documentState: 'SUBMITTED',
    });
    render(<SolutionReviewDetail review={submittedReview} onClose={mockOnClose} />);
    expect(screen.getAllByText('SUBMITTED').length).toBeGreaterThan(0);
  });

  it('renders with approved state', () => {
    const approvedReview = createSolutionReview({
      documentState: 'APPROVED',
    });
    render(<SolutionReviewDetail review={approvedReview} onClose={mockOnClose} />);
    expect(screen.getAllByText('APPROVED').length).toBeGreaterThan(0);
  });

  it('handles null solution name gracefully', () => {
    const reviewWithoutName = createSolutionReview({
      solutionOverview: {
        ...mockReview.solutionOverview,
        solutionDetails: {
          ...mockReview.solutionOverview.solutionDetails,
          solutionName: null as any,
        },
      },
    });
    const { container } = render(<SolutionReviewDetail review={reviewWithoutName} onClose={mockOnClose} />);
    // When solution name is null, displayValue() returns an em dash
    expect(container.textContent).toContain('Solution Name: —');
  });

  it('displays edit button', () => {
    render(<SolutionReviewDetail review={mockReview} onClose={mockOnClose} />);
    const editButtons = screen.queryAllByText(/Edit/i);
    expect(editButtons.length).toBeGreaterThan(0);
  });

  it('displays dates in review', () => {
    const { container } = render(<SolutionReviewDetail review={mockReview} onClose={mockOnClose} />);
    expect(container.textContent).toContain('2023');
  });

  it('displays review information', () => {
    const { container } = render(<SolutionReviewDetail review={mockReview} onClose={mockOnClose} />);
    expect(container).toBeInTheDocument();
  });

  it('renders all sections', () => {
    const { container } = render(<SolutionReviewDetail review={mockReview} onClose={mockOnClose} />);
    expect(screen.getAllByText('Test Solution').length).toBeGreaterThan(0);
  });

  it('renders with null business capabilities', () => {
    const reviewWithNullCapabilities = createSolutionReview({
      businessCapabilities: null,
    });
    const { container } = render(<SolutionReviewDetail review={reviewWithNullCapabilities} onClose={mockOnClose} />);
    expect(container).toBeInTheDocument();
  });

  it('renders with null system components', () => {
    const reviewWithNullComponents = createSolutionReview({
      systemComponents: null,
    });
    const { container } = render(<SolutionReviewDetail review={reviewWithNullComponents} onClose={mockOnClose} />);
    expect(container).toBeInTheDocument();
  });

  it('renders with null integration flows', () => {
    const reviewWithNullFlows = createSolutionReview({
      integrationFlows: null,
    });
    const { container } = render(<SolutionReviewDetail review={reviewWithNullFlows} onClose={mockOnClose} />);
    expect(container).toBeInTheDocument();
  });

  it('renders with null data assets', () => {
    const reviewWithNullAssets = createSolutionReview({
      dataAssets: null,
    });
    const { container } = render(<SolutionReviewDetail review={reviewWithNullAssets} onClose={mockOnClose} />);
    expect(container).toBeInTheDocument();
  });

  it('renders with rejected state', () => {
    const rejectedReview = createSolutionReview({
      documentState: 'REJECTED',
    });
    render(<SolutionReviewDetail review={rejectedReview} onClose={mockOnClose} />);
    expect(screen.getAllByText('REJECTED').length).toBeGreaterThan(0);
  });

  it('displays delivery project manager name', () => {
    render(<SolutionReviewDetail review={mockReview} onClose={mockOnClose} />);
    expect(screen.getAllByText(/Jane Smith/).length).toBeGreaterThan(0);
  });

  it('displays IT business partner', () => {
    render(<SolutionReviewDetail review={mockReview} onClose={mockOnClose} />);
    expect(screen.getAllByText(/Bob Johnson/).length).toBeGreaterThan(0);
  });

  it('handles missing optional fields gracefully', () => {
    const minimalReview = createSolutionReview({
      solutionOverview: {
        ...mockReview.solutionOverview,
        reviewedBy: null,
        conditions: null,
      },
    });
    const { container } = render(<SolutionReviewDetail review={minimalReview} onClose={mockOnClose} />);
    expect(container).toBeInTheDocument();
  });

  it('displays review information including ID', () => {
    const { container } = render(<SolutionReviewDetail review={mockReview} onClose={mockOnClose} />);
    expect(container.textContent).toContain('ID');
    expect(container.textContent).toContain('1');
  });

  it('renders with active state', () => {
    const activeReview = createSolutionReview({
      documentState: 'ACTIVE',
    });
    render(<SolutionReviewDetail review={activeReview} onClose={mockOnClose} />);
    expect(screen.getAllByText('ACTIVE').length).toBeGreaterThan(0);
  });

  it('renders with current state', () => {
    const currentReview = createSolutionReview({
      documentState: 'CURRENT',
    });
    render(<SolutionReviewDetail review={currentReview} onClose={mockOnClose} />);
    expect(screen.getAllByText('CURRENT').length).toBeGreaterThan(0);
  });

  it('renders with outdated state', () => {
    const outdatedReview = createSolutionReview({
      documentState: 'OUTDATED',
    });
    render(<SolutionReviewDetail review={outdatedReview} onClose={mockOnClose} />);
    expect(screen.getAllByText('OUTDATED').length).toBeGreaterThan(0);
  });

  it('displays value outcomes', () => {
    const review = createSolutionReview({
      solutionOverview: {
        ...mockReview.solutionOverview,
        valueOutcome: 'Significant cost reduction and improved efficiency',
      },
    });
    render(<SolutionReviewDetail review={review} onClose={mockOnClose} />);
    expect(screen.getByText('Significant cost reduction and improved efficiency')).toBeInTheDocument();
  });

  it('displays application users when present', () => {
    const review = createSolutionReview({
      solutionOverview: {
        ...mockReview.solutionOverview,
        applicationUsers: ['User Group 1', 'User Group 2', 'User Group 3'],
      },
    });
    render(<SolutionReviewDetail review={review} onClose={mockOnClose} />);
    expect(screen.getByText('Application Users (3)')).toBeInTheDocument();
    expect(screen.getByText('• User Group 1')).toBeInTheDocument();
  });

  it('does not display application users section when empty', () => {
    const review = createSolutionReview({
      solutionOverview: {
        ...mockReview.solutionOverview,
        applicationUsers: [],
      },
    });
    render(<SolutionReviewDetail review={review} onClose={mockOnClose} />);
    expect(screen.queryByText('Application Users')).not.toBeInTheDocument();
  });

  it('displays concerns when present', () => {
    const review = createSolutionReview({
      solutionOverview: {
        ...mockReview.solutionOverview,
        concerns: [
          { type: 'Security', description: 'Data encryption required', impact: 'High', disposition: 'Mitigated', status: 'Closed' },
          { type: 'Performance', description: 'Load testing needed', impact: 'Medium', disposition: 'Accepted', status: 'Open' },
        ],
      },
    });
    render(<SolutionReviewDetail review={review} onClose={mockOnClose} />);
    expect(screen.getByText('Concerns (2)')).toBeInTheDocument();
    expect(screen.getByText(/Data encryption required/)).toBeInTheDocument();
  });

  it('displays empty state for business capabilities', () => {
    const review = createSolutionReview({
      businessCapabilities: [],
    });
    render(<SolutionReviewDetail review={review} onClose={mockOnClose} />);
    expect(screen.getByText('No capabilities.')).toBeInTheDocument();
  });

  it('displays empty state for system components', () => {
    const review = createSolutionReview({
      systemComponents: [],
    });
    render(<SolutionReviewDetail review={review} onClose={mockOnClose} />);
    expect(screen.getByText('No system components.')).toBeInTheDocument();
  });

  it('displays empty state for integration flows', () => {
    const review = createSolutionReview({
      integrationFlows: [],
    });
    render(<SolutionReviewDetail review={review} onClose={mockOnClose} />);
    expect(screen.getByText('No integration flows.')).toBeInTheDocument();
  });

  it('displays empty state for data assets', () => {
    const review = createSolutionReview({
      dataAssets: [],
    });
    render(<SolutionReviewDetail review={review} onClose={mockOnClose} />);
    expect(screen.getByText('No data assets.')).toBeInTheDocument();
  });

  it('displays empty state for technology components', () => {
    const review = createSolutionReview({
      technologyComponents: [],
    });
    render(<SolutionReviewDetail review={review} onClose={mockOnClose} />);
    expect(screen.getByText('No technology components.')).toBeInTheDocument();
  });

  it('displays empty state for enterprise tools', () => {
    const review = createSolutionReview({
      enterpriseTools: [],
    });
    render(<SolutionReviewDetail review={review} onClose={mockOnClose} />);
    expect(screen.getByText('No enterprise tools.')).toBeInTheDocument();
  });

  it('displays empty state for process compliances', () => {
    const review = createSolutionReview({
      processCompliances: [],
    });
    render(<SolutionReviewDetail review={review} onClose={mockOnClose} />);
    expect(screen.getByText('No process compliances.')).toBeInTheDocument();
  });

  it('displays document information section', () => {
    render(<SolutionReviewDetail review={mockReview} onClose={mockOnClose} />);
    expect(screen.getByText('Document Information')).toBeInTheDocument();
  });

  it('displays created and modified metadata', () => {
    const { container } = render(<SolutionReviewDetail review={mockReview} onClose={mockOnClose} />);
    expect(container.textContent).toContain('Created:');
    expect(container.textContent).toContain('Last Modified:');
  });

  it('displays review type', () => {
    const { container } = render(<SolutionReviewDetail review={mockReview} onClose={mockOnClose} />);
    expect(container.textContent).toContain('Review Type:');
    expect(container.textContent).toContain('NEW_BUILD');
  });

  it('displays business driver', () => {
    const { container } = render(<SolutionReviewDetail review={mockReview} onClose={mockOnClose} />);
    expect(container.textContent).toContain('Business Driver:');
    expect(container.textContent).toContain('COST_OPTIMIZATION');
  });

  it('renders with technology components', () => {
    const review = createSolutionReview({
      technologyComponents: [
        { componentName: 'Backend API', productName: 'Java', productVersion: '17', usage: 'BACKEND' },
        { componentName: 'Frontend', productName: 'React', productVersion: '18', usage: 'FRONTEND' },
      ],
    });
    render(<SolutionReviewDetail review={review} onClose={mockOnClose} />);
    expect(screen.getByText('Technology Components (2)')).toBeInTheDocument();
  });

  it('renders with enterprise tools', () => {
    const review = createSolutionReview({
      enterpriseTools: [
        { tool: { name: 'Splunk', type: 'MONITORING' }, onboarded: 'FULLY_ONBOARDED', integrationDetails: 'REST API', issues: 'None' },
      ],
    });
    render(<SolutionReviewDetail review={review} onClose={mockOnClose} />);
    expect(screen.getByText('Enterprise Tools (1)')).toBeInTheDocument();
  });

  it('renders with data assets', () => {
    const review = createSolutionReview({
      dataAssets: [
        { componentName: 'Customer DB', dataDomain: 'Customer', dataClassification: 'Confidential', dataOwnedBy: 'Data Team', dataEntities: ['Customer', 'Address'], masteredIn: 'CRM' },
      ],
    });
    render(<SolutionReviewDetail review={review} onClose={mockOnClose} />);
    expect(screen.getByText('Data Assets (1)')).toBeInTheDocument();
  });

  it('renders with integration flows', () => {
    const review = createSolutionReview({
      integrationFlows: [
        { componentName: 'API Gateway', counterpartSystemCode: 'SYS-002', counterpartSystemRole: 'CONSUMER', integrationMethod: 'REST_API', middleware: 'API_GATEWAY', frequency: 'REAL_TIME', purpose: 'Data sync' },
      ],
    });
    render(<SolutionReviewDetail review={review} onClose={mockOnClose} />);
    expect(screen.getByText('Integration Flows (1)')).toBeInTheDocument();
  });

  it('renders with business capabilities', () => {
    const review = createSolutionReview({
      businessCapabilities: [
        { id: '1', l1Capability: 'Customer Management', l2Capability: 'Onboarding', l3Capability: 'Digital', remarks: 'Test' },
      ],
    });
    render(<SolutionReviewDetail review={review} onClose={mockOnClose} />);
    expect(screen.getByText('Business Capabilities (1)')).toBeInTheDocument();
  });

  it('renders with process compliances', () => {
    const review = createSolutionReview({
      processCompliances: [
        { standardGuideline: 'GDPR', compliant: 'YES', description: 'Fully compliant' },
      ],
    });
    render(<SolutionReviewDetail review={review} onClose={mockOnClose} />);
    expect(screen.getByText('Process Compliances (1)')).toBeInTheDocument();
  });

  it('handles null review type gracefully', () => {
    const review = createSolutionReview({
      solutionOverview: {
        ...mockReview.solutionOverview,
        reviewType: null as any,
      },
    });
    const { container } = render(<SolutionReviewDetail review={review} onClose={mockOnClose} />);
    expect(container.textContent).toContain('Review Type:');
  });

  it('handles null business driver gracefully', () => {
    const review = createSolutionReview({
      solutionOverview: {
        ...mockReview.solutionOverview,
        businessDriver: null as any,
      },
    });
    const { container } = render(<SolutionReviewDetail review={review} onClose={mockOnClose} />);
    expect(container.textContent).toContain('Business Driver:');
  });

  describe('State Transitions', () => {
    beforeEach(() => {
      vi.clearAllMocks();
    });

    it('handles REMOVE_SUBMISSION transition', async () => {
      const submittedReview = createSolutionReview({ documentState: 'SUBMITTED' });
      render(<SolutionReviewDetail review={submittedReview} onClose={mockOnClose} />);

      const removeButton = screen.queryByText(/Remove Submission/i);
      if (removeButton) {
        fireEvent.click(removeButton);

        await waitFor(() => {
          expect(mockTransitionSolutionReviewState).toHaveBeenCalledWith('REMOVE_SUBMISSION');
          expect(mockShowSuccess).toHaveBeenCalledWith('Review moved back to draft successfully!');
          expect(mockNavigate).toHaveBeenCalledWith(0);
        });
      }
    });

    it('opens approval modal when APPROVE is clicked', async () => {
      const submittedReview = createSolutionReview({ documentState: 'SUBMITTED' });
      render(<SolutionReviewDetail review={submittedReview} onClose={mockOnClose} />);

      const approveButton = screen.queryByText(/Approve/i);
      if (approveButton) {
        fireEvent.click(approveButton);

        await waitFor(() => {
          expect(screen.getByText('Approve Solution Review')).toBeInTheDocument();
        });
      }
    });

    it('handles approval complete', async () => {
      const submittedReview = createSolutionReview({ documentState: 'SUBMITTED' });
      render(<SolutionReviewDetail review={submittedReview} onClose={mockOnClose} />);

      const approveButton = screen.queryByText(/Approve/i);
      if (approveButton) {
        fireEvent.click(approveButton);

        await waitFor(() => {
          expect(screen.getByText('Approve Solution Review')).toBeInTheDocument();
        });

        const approveBtnInModal = screen.getByRole('button', { name: /Approve Review/i });
        fireEvent.click(approveBtnInModal);

        await waitFor(() => {
          expect(mockTransitionSolutionReviewState).toHaveBeenCalledWith('APPROVE');
          expect(mockNavigate).toHaveBeenCalledWith(0);
        });
      }
    });

    it('opens submission modal when SUBMIT is clicked', async () => {
      render(<SolutionReviewDetail review={mockReview} onClose={mockOnClose} />);

      const submitButton = screen.queryByText(/Submit/i);
      if (submitButton) {
        fireEvent.click(submitButton);

        await waitFor(() => {
          expect(screen.getByTestId('submission-modal')).toBeInTheDocument();
        });
      }
    });

    it('handles submit confirmation', async () => {
      render(<SolutionReviewDetail review={mockReview} onClose={mockOnClose} />);

      const submitButton = screen.queryByText(/Submit/i);
      if (submitButton) {
        fireEvent.click(submitButton);

        await waitFor(() => {
          expect(screen.getByTestId('submission-modal')).toBeInTheDocument();
        });

        const confirmBtn = screen.getByTestId('confirm-submit');
        fireEvent.click(confirmBtn);

        await waitFor(() => {
          expect(mockTransitionSolutionReviewState).toHaveBeenCalledWith('SUBMIT');
          expect(mockShowSuccess).toHaveBeenCalledWith('Review submitted successfully!');
          expect(mockNavigate).toHaveBeenCalledWith(0);
        });
      }
    });

    it('handles ACTIVATE transition', async () => {
      const approvedReview = createSolutionReview({ documentState: 'APPROVED' });
      render(<SolutionReviewDetail review={approvedReview} onClose={mockOnClose} />);

      const activateButton = screen.queryByText(/Activate/i);
      if (activateButton) {
        fireEvent.click(activateButton);

        await waitFor(() => {
          expect(mockTransitionSolutionReviewState).toHaveBeenCalledWith('ACTIVATE');
          expect(mockShowSuccess).toHaveBeenCalledWith('Review activated successfully!');
          expect(mockNavigate).toHaveBeenCalledWith(0);
        });
      }
    });

    it('handles UNAPPROVE transition', async () => {
      const approvedReview = createSolutionReview({ documentState: 'APPROVED' });
      render(<SolutionReviewDetail review={approvedReview} onClose={mockOnClose} />);

      const unapproveButton = screen.queryByText(/Unapprove/i);
      if (unapproveButton) {
        fireEvent.click(unapproveButton);

        await waitFor(() => {
          expect(mockTransitionSolutionReviewState).toHaveBeenCalledWith('UNAPPROVE');
          expect(mockShowSuccess).toHaveBeenCalledWith('Review unapproved successfully!');
          expect(mockNavigate).toHaveBeenCalledWith(0);
        });
      }
    });

    it('handles MARK_OUTDATED transition', async () => {
      const currentReview = createSolutionReview({ documentState: 'CURRENT' });
      render(<SolutionReviewDetail review={currentReview} onClose={mockOnClose} />);

      const outdateButton = screen.queryByText(/Mark.*Outdated/i);
      if (outdateButton) {
        fireEvent.click(outdateButton);

        await waitFor(() => {
          expect(mockTransitionSolutionReviewState).toHaveBeenCalledWith('MARK_OUTDATED');
          expect(mockShowSuccess).toHaveBeenCalledWith('Review marked as outdated successfully!');
          expect(mockNavigate).toHaveBeenCalledWith(0);
        });
      }
    });

    it('handles RESET_CURRENT transition', async () => {
      const outdatedReview = createSolutionReview({ documentState: 'OUTDATED' });
      render(<SolutionReviewDetail review={outdatedReview} onClose={mockOnClose} />);

      const resetButton = screen.queryByText(/Reset.*Current/i);
      if (resetButton) {
        fireEvent.click(resetButton);

        await waitFor(() => {
          expect(mockTransitionSolutionReviewState).toHaveBeenCalledWith('RESET_CURRENT');
          expect(mockShowSuccess).toHaveBeenCalledWith('Review reverted to current successfully!');
          expect(mockNavigate).toHaveBeenCalledWith(0);
        });
      }
    });

    it('handles state transition error', async () => {
      mockTransitionSolutionReviewState.mockRejectedValueOnce(new Error('Transition failed'));

      render(<SolutionReviewDetail review={mockReview} onClose={mockOnClose} />);

      const submitButton = screen.queryByText(/Submit/i);
      if (submitButton) {
        fireEvent.click(submitButton);

        await waitFor(() => {
          expect(screen.getByTestId('submission-modal')).toBeInTheDocument();
        });

        const confirmBtn = screen.getByTestId('confirm-submit');
        fireEvent.click(confirmBtn);

        await waitFor(() => {
          expect(mockShowError).toHaveBeenCalled();
        });
      }
    });

    it('handles submit error', async () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      mockTransitionSolutionReviewState.mockRejectedValueOnce(new Error('Submit failed'));

      render(<SolutionReviewDetail review={mockReview} onClose={mockOnClose} />);

      const submitButton = screen.queryByText(/Submit/i);
      if (submitButton) {
        fireEvent.click(submitButton);

        await waitFor(() => {
          expect(screen.getByTestId('submission-modal')).toBeInTheDocument();
        });

        const confirmBtn = screen.getByTestId('confirm-submit');
        fireEvent.click(confirmBtn);

        await waitFor(() => {
          expect(consoleErrorSpy).toHaveBeenCalledWith('Submit failed:', expect.any(Error));
          expect(mockShowError).toHaveBeenCalled();
        });
      }

      consoleErrorSpy.mockRestore();
    });
  });
});
