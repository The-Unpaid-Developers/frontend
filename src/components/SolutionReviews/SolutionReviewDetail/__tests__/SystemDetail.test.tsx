import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import { SystemDetail } from '../SystemDetail';
import { DocumentState } from '../../../../types/solutionReview';

// Mock hooks
const mockNavigate = vi.fn();
const mockShowSuccess = vi.fn();
const mockShowError = vi.fn();
const mockTransitionSolutionReviewState = vi.fn();
const mockCreateSRFromExisting = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock('../../../../context/ToastContext', () => ({
  useToast: () => ({
    showSuccess: mockShowSuccess,
    showError: mockShowError,
  }),
}));

vi.mock('../../../../hooks/useUpdateSolutionReview', () => ({
  useUpdateSolutionReview: () => ({
    transitionSolutionReviewState: mockTransitionSolutionReviewState,
  }),
}));

vi.mock('../../../../hooks/useCreateSolutionOverview', () => ({
  useCreateSolutionOverview: () => ({
    createSRFromExisting: mockCreateSRFromExisting,
  }),
}));

// Mock modal components
vi.mock('../../AdminPanel', () => ({
  ApprovalModal: ({ isOpen }: any) => isOpen ? <div data-testid="approval-modal">Approval Modal</div> : null,
}));

vi.mock('../ReviewSubmissionModal', () => ({
  ReviewSubmissionModal: ({ showReview }: any) => showReview ? <div data-testid="submission-modal">Submission Modal</div> : null,
}));

describe('SystemDetail', () => {
  const mockSystem = [
    {
      id: 'sr-1',
      systemCode: 'SYS-001',
      documentState: DocumentState.DRAFT,
      solutionOverview: {
        solutionDetails: {
          solutionName: 'Test Solution',
          projectName: 'Test Project',
          solutionArchitectName: 'John Doe',
          deliveryProjectManagerName: 'Jane Smith',
          itBusinessPartner: 'Bob Johnson',
        },
        reviewType: 'Standard',
        businessUnit: 'IT',
        businessDriver: 'Cost Reduction',
        valueOutcome: 'Improved efficiency',
        applicationUsers: [],
      },
      createdAt: '2024-01-01T00:00:00Z',
      lastModifiedAt: '2024-01-02T00:00:00Z',
      businessCapabilities: null,
      dataAssets: null,
      enterpriseTools: null,
      integrationFlows: null,
      systemComponents: null,
      technologyComponents: null,
      processCompliances: null,
      createdBy: 'user@test.com',
      lastModifiedBy: 'admin@test.com',
    },
  ];

  const mockOnClose = vi.fn();
  const mockOnViewReview = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    mockTransitionSolutionReviewState.mockResolvedValue(undefined);
    mockCreateSRFromExisting.mockResolvedValue({ id: 'new-draft-id' });
  });

  it('renders system code as header', () => {
    render(
      <BrowserRouter>
        <SystemDetail
          systemCode="SYS-001"
          system={mockSystem}
          onClose={mockOnClose}
          onViewReview={mockOnViewReview}
        />
      </BrowserRouter>
    );
    expect(screen.getByText('SYS-001')).toBeInTheDocument();
  });

  it('renders close button', () => {
    render(
      <BrowserRouter>
        <SystemDetail
          systemCode="SYS-001"
          system={mockSystem}
          onClose={mockOnClose}
          onViewReview={mockOnViewReview}
        />
      </BrowserRouter>
    );
    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBeGreaterThan(0);
  });

  it('renders View Flow Diagram button', () => {
    render(
      <BrowserRouter>
        <SystemDetail
          systemCode="SYS-001"
          system={mockSystem}
          onClose={mockOnClose}
          onViewReview={mockOnViewReview}
        />
      </BrowserRouter>
    );
    expect(screen.getByText(/View Flow Diagram/i)).toBeInTheDocument();
  });

  it('navigates to flow diagram when button clicked', () => {
    render(
      <BrowserRouter>
        <SystemDetail
          systemCode="SYS-001"
          system={mockSystem}
          onClose={mockOnClose}
          onViewReview={mockOnViewReview}
        />
      </BrowserRouter>
    );
    const viewDiagramButton = screen.getByText(/View Flow Diagram/i);
    fireEvent.click(viewDiagramButton);
    expect(mockNavigate).toHaveBeenCalledWith('/view-system-flow-diagram/SYS-001');
  });

  it('renders Version History section', () => {
    render(
      <BrowserRouter>
        <SystemDetail
          systemCode="SYS-001"
          system={mockSystem}
          onClose={mockOnClose}
          onViewReview={mockOnViewReview}
        />
      </BrowserRouter>
    );
    expect(screen.getByText(/Version History/i)).toBeInTheDocument();
  });

  it('renders review details', () => {
    render(
      <BrowserRouter>
        <SystemDetail
          systemCode="SYS-001"
          system={mockSystem}
          onClose={mockOnClose}
          onViewReview={mockOnViewReview}
        />
      </BrowserRouter>
    );
    expect(screen.getByText('Test Solution')).toBeInTheDocument();
  });

  it('renders document state badge', () => {
    render(
      <BrowserRouter>
        <SystemDetail
          systemCode="SYS-001"
          system={mockSystem}
          onClose={mockOnClose}
          onViewReview={mockOnViewReview}
        />
      </BrowserRouter>
    );
    expect(screen.getByText('DRAFT')).toBeInTheDocument();
  });

  it('renders View Details button', () => {
    render(
      <BrowserRouter>
        <SystemDetail
          systemCode="SYS-001"
          system={mockSystem}
          onClose={mockOnClose}
          onViewReview={mockOnViewReview}
        />
      </BrowserRouter>
    );
    expect(screen.getByText(/View Details/i)).toBeInTheDocument();
  });

  it('calls onViewReview when View Details clicked', () => {
    render(
      <BrowserRouter>
        <SystemDetail
          systemCode="SYS-001"
          system={mockSystem}
          onClose={mockOnClose}
          onViewReview={mockOnViewReview}
        />
      </BrowserRouter>
    );
    const viewDetailsButton = screen.getByText(/View Details/i);
    fireEvent.click(viewDetailsButton);
    expect(mockOnViewReview).toHaveBeenCalledWith(mockSystem[0]);
  });

  it('renders Edit Draft button for draft state', () => {
    render(
      <BrowserRouter>
        <SystemDetail
          systemCode="SYS-001"
          system={mockSystem}
          onClose={mockOnClose}
          onViewReview={mockOnViewReview}
        />
      </BrowserRouter>
    );
    expect(screen.getByText(/Edit Draft/i)).toBeInTheDocument();
  });

  it('navigates to edit page when Edit Draft clicked', () => {
    render(
      <BrowserRouter>
        <SystemDetail
          systemCode="SYS-001"
          system={mockSystem}
          onClose={mockOnClose}
          onViewReview={mockOnViewReview}
        />
      </BrowserRouter>
    );
    const editButton = screen.getByText(/Edit Draft/i);
    fireEvent.click(editButton);
    expect(mockNavigate).toHaveBeenCalledWith('/update-solution-review/sr-1');
  });

  it('renders Create New Draft button for active state', () => {
    const activeSystem = [
      {
        ...mockSystem[0],
        documentState: DocumentState.ACTIVE,
      },
    ];

    render(
      <BrowserRouter>
        <SystemDetail
          systemCode="SYS-001"
          system={activeSystem}
          onClose={mockOnClose}
          onViewReview={mockOnViewReview}
        />
      </BrowserRouter>
    );
    expect(screen.getByText(/Create New Draft/i)).toBeInTheDocument();
  });

  it('creates new draft when button clicked', async () => {
    const activeSystem = [
      {
        ...mockSystem[0],
        documentState: DocumentState.ACTIVE,
      },
    ];

    render(
      <BrowserRouter>
        <SystemDetail
          systemCode="SYS-001"
          system={activeSystem}
          onClose={mockOnClose}
          onViewReview={mockOnViewReview}
        />
      </BrowserRouter>
    );

    const createDraftButton = screen.getByText(/Create New Draft/i);
    fireEvent.click(createDraftButton);

    await waitFor(() => {
      expect(mockCreateSRFromExisting).toHaveBeenCalledWith('SYS-001');
    });
  });

  it('shows success message after creating new draft', async () => {
    const activeSystem = [
      {
        ...mockSystem[0],
        documentState: DocumentState.ACTIVE,
      },
    ];

    render(
      <BrowserRouter>
        <SystemDetail
          systemCode="SYS-001"
          system={activeSystem}
          onClose={mockOnClose}
          onViewReview={mockOnViewReview}
        />
      </BrowserRouter>
    );

    const createDraftButton = screen.getByText(/Create New Draft/i);
    fireEvent.click(createDraftButton);

    await waitFor(() => {
      expect(mockShowSuccess).toHaveBeenCalledWith('New draft created successfully!');
    });
  });

  it('renders multiple reviews', () => {
    const multipleReviews = [
      mockSystem[0],
      {
        ...mockSystem[0],
        id: 'sr-2',
        documentState: DocumentState.SUBMITTED,
      },
    ];

    render(
      <BrowserRouter>
        <SystemDetail
          systemCode="SYS-001"
          system={multipleReviews}
          onClose={mockOnClose}
          onViewReview={mockOnViewReview}
        />
      </BrowserRouter>
    );

    expect(screen.getByText('sr-1')).toBeInTheDocument();
    expect(screen.getByText('sr-2')).toBeInTheDocument();
  });

  it('renders with current document state', () => {
    const currentSystem = [
      {
        ...mockSystem[0],
        documentState: DocumentState.CURRENT,
      },
    ];

    const { container } = render(
      <BrowserRouter>
        <SystemDetail
          systemCode="SYS-001"
          system={currentSystem}
          onClose={mockOnClose}
          onViewReview={mockOnViewReview}
        />
      </BrowserRouter>
    );
    // Just verify component renders without error
    expect(container.querySelector('.max-w-6xl')).toBeInTheDocument();
  });

  it('handles create draft error', async () => {
    mockCreateSRFromExisting.mockRejectedValue({ message: 'Creation failed' });

    const activeSystem = [
      {
        ...mockSystem[0],
        documentState: DocumentState.ACTIVE,
      },
    ];

    render(
      <BrowserRouter>
        <SystemDetail
          systemCode="SYS-001"
          system={activeSystem}
          onClose={mockOnClose}
          onViewReview={mockOnViewReview}
        />
      </BrowserRouter>
    );

    const createDraftButton = screen.getByText(/Create New Draft/i);
    fireEvent.click(createDraftButton);

    await waitFor(() => {
      expect(mockShowError).toHaveBeenCalled();
    });
  });

  it('handles empty system array', () => {
    render(
      <BrowserRouter>
        <SystemDetail
          systemCode="SYS-001"
          system={[]}
          onClose={mockOnClose}
          onViewReview={mockOnViewReview}
        />
      </BrowserRouter>
    );

    expect(screen.getByText('SYS-001')).toBeInTheDocument();
  });

  it('renders system code with special characters', () => {
    render(
      <BrowserRouter>
        <SystemDetail
          systemCode="SYS-001-TEST_SPECIAL"
          system={mockSystem}
          onClose={mockOnClose}
          onViewReview={mockOnViewReview}
        />
      </BrowserRouter>
    );

    expect(screen.getByText('SYS-001-TEST_SPECIAL')).toBeInTheDocument();
  });

  it('renders multiple reviews correctly', () => {
    const multipleReviews = [
      { ...mockSystem[0], id: 'sr-1' },
      { ...mockSystem[0], id: 'sr-2' },
      { ...mockSystem[0], id: 'sr-3' },
    ];

    render(
      <BrowserRouter>
        <SystemDetail
          systemCode="SYS-001"
          system={multipleReviews}
          onClose={mockOnClose}
          onViewReview={mockOnViewReview}
        />
      </BrowserRouter>
    );

    expect(screen.getByText('sr-1')).toBeInTheDocument();
    expect(screen.getByText('sr-2')).toBeInTheDocument();
    expect(screen.getByText('sr-3')).toBeInTheDocument();
  });

  it('navigates when View Flow Diagram is clicked on specific system', () => {
    render(
      <BrowserRouter>
        <SystemDetail
          systemCode="CUSTOM-SYS"
          system={mockSystem}
          onClose={mockOnClose}
          onViewReview={mockOnViewReview}
        />
      </BrowserRouter>
    );

    const viewDiagramButton = screen.getByText(/View Flow Diagram/i);
    fireEvent.click(viewDiagramButton);

    expect(mockNavigate).toHaveBeenCalledWith('/view-system-flow-diagram/CUSTOM-SYS');
  });

  it('navigates to edit page for correct draft ID', () => {
    const draftWithId = [
      {
        ...mockSystem[0],
        id: 'draft-123',
        documentState: DocumentState.DRAFT,
      },
    ];

    render(
      <BrowserRouter>
        <SystemDetail
          systemCode="SYS-001"
          system={draftWithId}
          onClose={mockOnClose}
          onViewReview={mockOnViewReview}
        />
      </BrowserRouter>
    );

    const editButton = screen.getByText(/Edit Draft/i);
    fireEvent.click(editButton);

    expect(mockNavigate).toHaveBeenCalledWith('/update-solution-review/draft-123');
  });

  it('navigates with newly created draft ID', async () => {
    mockCreateSRFromExisting.mockResolvedValue({ id: 'new-draft-999' });

    const activeSystem = [
      {
        ...mockSystem[0],
        documentState: DocumentState.ACTIVE,
      },
    ];

    render(
      <BrowserRouter>
        <SystemDetail
          systemCode="SYS-001"
          system={activeSystem}
          onClose={mockOnClose}
          onViewReview={mockOnViewReview}
        />
      </BrowserRouter>
    );

    const createDraftButton = screen.getByText(/Create New Draft/i);
    fireEvent.click(createDraftButton);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/update-solution-review/new-draft-999');
    });
  });
});
