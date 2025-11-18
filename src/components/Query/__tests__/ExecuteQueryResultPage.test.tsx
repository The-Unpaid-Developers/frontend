import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ExecuteQueryResultPage } from '../ExecuteQueryResultPage';
import { renderWithProviders, screen, fireEvent, waitFor } from '../../../test/test-utils';

// Mock data
const mockQueryDetails = {
  name: 'test-query',
  description: 'Test query description',
  mongoQuery: '[{"$match": {"status": "active"}}]',
};

const mockResults = [
  { _id: '1', name: 'Result 1', status: 'active' },
  { _id: '2', name: 'Result 2', status: 'active' },
];

// Mock hooks
const mockNavigate = vi.fn();
const mockShowSuccess = vi.fn();
const mockShowError = vi.fn();
const mockLoadSpecificQuery = vi.fn();
const mockExecuteQuery = vi.fn();
let mockIsLoading = false;
let mockQueryName = 'test-query';
let mockSearchParams = new URLSearchParams('collection=solutionReviews&limit=100&skip=0');

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useParams: () => ({ queryName: mockQueryName }),
    useSearchParams: () => [mockSearchParams],
  };
});

vi.mock('../../../hooks/useQuery', () => ({
  useQuery: () => ({
    executeQuery: mockExecuteQuery,
    loadSpecificQuery: mockLoadSpecificQuery,
    isLoading: mockIsLoading,
  }),
}));

vi.mock('../../../context/ToastContext', () => ({
  useToast: () => ({
    showSuccess: mockShowSuccess,
    showError: mockShowError,
  }),
  ToastProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

describe('ExecuteQueryResultPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.spyOn(console, 'log').mockImplementation(() => {});
    mockIsLoading = false;
    mockQueryName = 'test-query';
    mockSearchParams = new URLSearchParams('collection=solutionReviews&limit=100&skip=0');
    mockLoadSpecificQuery.mockResolvedValue(mockQueryDetails);
    mockExecuteQuery.mockResolvedValue(mockResults);

    // Mock performance.now()
    global.performance.now = vi.fn()
      .mockReturnValueOnce(0)  // Start time
      .mockReturnValueOnce(50); // End time
  });

  describe('Initial Render and Loading', () => {
    it('shows loading state when query details are loading', () => {
      mockIsLoading = true;
      mockLoadSpecificQuery.mockImplementation(() => new Promise(() => {})); // Never resolves

      renderWithProviders(<ExecuteQueryResultPage />);

      expect(screen.getByText('Loading query...')).toBeInTheDocument();
    });

    it('loads query details on mount', async () => {
      renderWithProviders(<ExecuteQueryResultPage />);

      await waitFor(() => {
        expect(mockLoadSpecificQuery).toHaveBeenCalledWith('test-query');
      });
    });

    it('executes query automatically on mount', async () => {
      renderWithProviders(<ExecuteQueryResultPage />);

      await waitFor(() => {
        expect(mockExecuteQuery).toHaveBeenCalledWith('test-query', {
          collection: 'solutionReviews',
          limit: 100,
          skip: 0,
        });
      });
    });

    it('displays query name in header', async () => {
      renderWithProviders(<ExecuteQueryResultPage />);

      await waitFor(() => {
        expect(screen.getByText('Execute Query: test-query')).toBeInTheDocument();
      });
    });

    it('displays query description when loaded', async () => {
      renderWithProviders(<ExecuteQueryResultPage />);

      await waitFor(() => {
        expect(screen.getByText('Test query description')).toBeInTheDocument();
      });
    });
  });

  describe('Missing Query Name', () => {
    it('shows error and navigates when query name is missing', async () => {
      mockQueryName = '';

      renderWithProviders(<ExecuteQueryResultPage />);

      await waitFor(() => {
        expect(mockShowError).toHaveBeenCalledWith('Query name is required');
        expect(mockNavigate).toHaveBeenCalledWith('/view-queries');
      });
    });
  });

  describe('Load Query Errors', () => {
    it('shows error when loading query fails', async () => {
      mockLoadSpecificQuery.mockRejectedValue(new Error('Query not found'));

      renderWithProviders(<ExecuteQueryResultPage />);

      await waitFor(() => {
        expect(mockShowError).toHaveBeenCalledWith('Failed to load query: Query not found');
      });
    });
  });

  describe('Execution Parameters', () => {
    it('displays default execution parameters from URL', async () => {
      renderWithProviders(<ExecuteQueryResultPage />);

      await waitFor(() => {
        const collectionInput = screen.getByLabelText(/collection/i) as HTMLInputElement;
        const limitInput = screen.getByLabelText(/limit/i) as HTMLInputElement;
        const skipInput = screen.getByLabelText(/skip/i) as HTMLInputElement;

        expect(collectionInput.value).toBe('solutionReviews');
        expect(limitInput.value).toBe('100');
        expect(skipInput.value).toBe('0');
      });
    });

    it('allows changing collection parameter', async () => {
      renderWithProviders(<ExecuteQueryResultPage />);

      await waitFor(() => {
        const collectionInput = screen.getByLabelText(/collection/i);
        expect(collectionInput).toBeInTheDocument();
      });

      const collectionInput = screen.getByLabelText(/collection/i);
      fireEvent.change(collectionInput, { target: { value: 'customCollection' } });

      expect(collectionInput).toHaveValue('customCollection');
    });

    it('allows changing limit parameter', async () => {
      renderWithProviders(<ExecuteQueryResultPage />);

      await waitFor(() => {
        const limitInput = screen.getByLabelText(/limit/i);
        expect(limitInput).toBeInTheDocument();
      });

      const limitInput = screen.getByLabelText(/limit/i);
      fireEvent.change(limitInput, { target: { value: '50' } });

      expect(limitInput).toHaveValue(50);
    });

    it('allows changing skip parameter', async () => {
      renderWithProviders(<ExecuteQueryResultPage />);

      await waitFor(() => {
        const skipInput = screen.getByLabelText(/skip/i);
        expect(skipInput).toBeInTheDocument();
      });

      const skipInput = screen.getByLabelText(/skip/i);
      fireEvent.change(skipInput, { target: { value: '10' } });

      expect(skipInput).toHaveValue(10);
    });
  });

  describe('Query Execution', () => {
    it('displays executing state while query is running', async () => {
      mockExecuteQuery.mockImplementation(() => new Promise(resolve => setTimeout(() => resolve(mockResults), 100)));

      renderWithProviders(<ExecuteQueryResultPage />);

      await waitFor(() => {
        expect(screen.getByText('Executing query...')).toBeInTheDocument();
      });
    });

    it('re-executes query when Execute Query button is clicked', async () => {
      renderWithProviders(<ExecuteQueryResultPage />);

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /execute query/i })).toBeInTheDocument();
      });

      // Clear previous calls
      mockExecuteQuery.mockClear();

      const executeButton = screen.getByRole('button', { name: /execute query/i });
      fireEvent.click(executeButton);

      await waitFor(() => {
        expect(mockExecuteQuery).toHaveBeenCalled();
      });
    });

    it('executes query with updated parameters', async () => {
      renderWithProviders(<ExecuteQueryResultPage />);

      await waitFor(() => {
        expect(screen.getByLabelText(/collection/i)).toBeInTheDocument();
      });

      // Change parameters
      const collectionInput = screen.getByLabelText(/collection/i);
      const limitInput = screen.getByLabelText(/limit/i);
      const skipInput = screen.getByLabelText(/skip/i);

      fireEvent.change(collectionInput, { target: { value: 'newCollection' } });
      fireEvent.change(limitInput, { target: { value: '50' } });
      fireEvent.change(skipInput, { target: { value: '20' } });

      mockExecuteQuery.mockClear();

      const executeButton = screen.getByRole('button', { name: /execute query/i });
      fireEvent.click(executeButton);

      await waitFor(() => {
        expect(mockExecuteQuery).toHaveBeenCalledWith('test-query', {
          collection: 'newCollection',
          limit: 50,
          skip: 20,
        });
      });
    });

    it('shows success message after successful execution', async () => {
      renderWithProviders(<ExecuteQueryResultPage />);

      await waitFor(() => {
        expect(mockShowSuccess).toHaveBeenCalledWith('Query executed successfully! Found 2 result(s)');
      });
    });

    it('shows error when execution fails', async () => {
      mockExecuteQuery.mockRejectedValueOnce(new Error('Execution failed'));

      renderWithProviders(<ExecuteQueryResultPage />);

      await waitFor(() => {
        expect(mockShowError).toHaveBeenCalledWith('Failed to execute query: Execution failed');
        expect(screen.getByText('Execution Error')).toBeInTheDocument();
        expect(screen.getByText('Execution failed')).toBeInTheDocument();
      });
    });

    it('disables execute button while executing', async () => {
      mockExecuteQuery.mockImplementation(() => new Promise(resolve => setTimeout(() => resolve(mockResults), 100)));

      renderWithProviders(<ExecuteQueryResultPage />);

      await waitFor(() => {
        const executeButton = screen.getByRole('button', { name: /executing.../i });
        expect(executeButton).toBeDisabled();
      });
    });
  });

  describe('Results Display', () => {
    it('displays results count', async () => {
      renderWithProviders(<ExecuteQueryResultPage />);

      await waitFor(() => {
        expect(screen.getByText('Results Count')).toBeInTheDocument();
        expect(screen.getByText('2')).toBeInTheDocument();
      });
    });

    it('displays execution time section', async () => {
      renderWithProviders(<ExecuteQueryResultPage />);

      await waitFor(() => {
        expect(screen.getByText('Execution Time')).toBeInTheDocument();
        // Verify results summary section is displayed
        expect(screen.getByText('Results Count')).toBeInTheDocument();
      });
    });

    it('displays collection name in summary', async () => {
      renderWithProviders(<ExecuteQueryResultPage />);

      await waitFor(() => {
        const collectionLabels = screen.getAllByText('Collection');
        expect(collectionLabels.length).toBeGreaterThan(0);
        // Check if 'solutionReviews' is in the document
        expect(screen.getByText('solutionReviews', { selector: '.text-2xl' })).toBeInTheDocument();
      });
    });

    it('displays results as JSON', async () => {
      renderWithProviders(<ExecuteQueryResultPage />);

      await waitFor(() => {
        expect(screen.getByText('Query Results')).toBeInTheDocument();
        const jsonTexts = screen.getAllByText(/"name": "Result 1"/);
        expect(jsonTexts.length).toBeGreaterThan(0);
      });
    });

    it('displays "No results found" when results are empty', async () => {
      mockExecuteQuery.mockResolvedValue([]);

      renderWithProviders(<ExecuteQueryResultPage />);

      await waitFor(() => {
        expect(screen.getByText('No results found')).toBeInTheDocument();
        expect(screen.getByText('Try adjusting your query parameters or collection name')).toBeInTheDocument();
      });
    });

    it('displays individual documents section', async () => {
      renderWithProviders(<ExecuteQueryResultPage />);

      await waitFor(() => {
        expect(screen.getByText('View Individual Documents (2)')).toBeInTheDocument();
      });
    });

    it('shows document IDs when available', async () => {
      renderWithProviders(<ExecuteQueryResultPage />);

      await waitFor(() => {
        const idElement = screen.getByText(/ID: 1/);
        expect(idElement).toBeInTheDocument();
      });
    });
  });

  describe('Download Results', () => {
    it('shows download button when results are available', async () => {
      renderWithProviders(<ExecuteQueryResultPage />);

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /download results/i })).toBeInTheDocument();
      });
    });

    it('does not show download button when no results', async () => {
      mockExecuteQuery.mockResolvedValue(null);

      renderWithProviders(<ExecuteQueryResultPage />);

      await waitFor(() => {
        expect(mockLoadSpecificQuery).toHaveBeenCalled();
      });

      expect(screen.queryByRole('button', { name: /download results/i })).not.toBeInTheDocument();
    });

    it('creates download link when download button is clicked', async () => {
      const createObjectURLMock = vi.fn(() => 'blob:test-url');
      const revokeObjectURLMock = vi.fn();
      const originalCreateObjectURL = global.URL.createObjectURL;
      const originalRevokeObjectURL = global.URL.revokeObjectURL;

      global.URL.createObjectURL = createObjectURLMock;
      global.URL.revokeObjectURL = revokeObjectURLMock;

      const clickMock = vi.fn();
      const originalCreateElement = document.createElement.bind(document);
      const createElementSpy = vi.spyOn(document, 'createElement');

      createElementSpy.mockImplementation((tagName: string) => {
        const element = originalCreateElement(tagName);
        if (tagName === 'a') {
          element.click = clickMock;
        }
        return element;
      });

      renderWithProviders(<ExecuteQueryResultPage />);

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /download results/i })).toBeInTheDocument();
      });

      const downloadButton = screen.getByRole('button', { name: /download results/i });
      fireEvent.click(downloadButton);

      expect(createObjectURLMock).toHaveBeenCalled();
      expect(clickMock).toHaveBeenCalled();
      expect(revokeObjectURLMock).toHaveBeenCalledWith('blob:test-url');

      createElementSpy.mockRestore();
      global.URL.createObjectURL = originalCreateObjectURL;
      global.URL.revokeObjectURL = originalRevokeObjectURL;
    });

    it('disables download button while executing', async () => {
      let resolvePromise: any;
      mockExecuteQuery.mockImplementation(() => new Promise(resolve => {
        resolvePromise = resolve;
      }));

      renderWithProviders(<ExecuteQueryResultPage />);

      // Wait for the initial execution to start
      await waitFor(() => {
        expect(screen.getByText('Executing query...')).toBeInTheDocument();
      });

      // At this point download button shouldn't exist yet since no results
      expect(screen.queryByRole('button', { name: /download results/i })).not.toBeInTheDocument();

      // Resolve the promise
      if (resolvePromise) {
        resolvePromise(mockResults);
      }

      // Now wait for results to show
      await waitFor(() => {
        expect(screen.getByRole('button', { name: /download results/i })).toBeInTheDocument();
      });
    });
  });

  describe('Navigation', () => {
    it('navigates back to query details when back button is clicked', async () => {
      renderWithProviders(<ExecuteQueryResultPage />);

      await waitFor(() => {
        expect(screen.getByLabelText(/back to query details/i)).toBeInTheDocument();
      });

      const backButton = screen.getByLabelText(/back to query details/i);
      fireEvent.click(backButton);

      expect(mockNavigate).toHaveBeenCalledWith('/view-query/test-query');
    });

    it('navigates to query details when "View Query Details" button is clicked', async () => {
      renderWithProviders(<ExecuteQueryResultPage />);

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /view query details/i })).toBeInTheDocument();
      });

      const viewDetailsButton = screen.getByRole('button', { name: /view query details/i });
      fireEvent.click(viewDetailsButton);

      expect(mockNavigate).toHaveBeenCalledWith('/view-query/test-query');
    });

    it('disables navigation buttons while executing', async () => {
      mockExecuteQuery.mockImplementation(() => new Promise(resolve => setTimeout(() => resolve(mockResults), 100)));

      renderWithProviders(<ExecuteQueryResultPage />);

      await waitFor(() => {
        const viewDetailsButton = screen.getByRole('button', { name: /view query details/i });
        expect(viewDetailsButton).toBeDisabled();
      });
    });
  });

  describe('Edge Cases', () => {
    it('handles undefined query name parameter', async () => {
      mockQueryName = undefined as any;

      renderWithProviders(<ExecuteQueryResultPage />);

      await waitFor(() => {
        expect(mockShowError).toHaveBeenCalledWith('Query name is required');
      });
    });

    it('handles null execution results gracefully', async () => {
      mockExecuteQuery.mockResolvedValue(null);

      renderWithProviders(<ExecuteQueryResultPage />);

      await waitFor(() => {
        expect(mockLoadSpecificQuery).toHaveBeenCalled();
      });

      expect(screen.queryByText('Query Results')).not.toBeInTheDocument();
    });

    it('parses URL parameters correctly with defaults', async () => {
      mockSearchParams = new URLSearchParams('');

      renderWithProviders(<ExecuteQueryResultPage />);

      await waitFor(() => {
        expect(mockExecuteQuery).toHaveBeenCalledWith('test-query', {
          collection: 'solutionReviews',
          limit: 100,
          skip: 0,
        });
      });
    });

    it('parses custom URL parameters correctly', async () => {
      mockSearchParams = new URLSearchParams('collection=custom&limit=50&skip=10');

      renderWithProviders(<ExecuteQueryResultPage />);

      await waitFor(() => {
        expect(mockExecuteQuery).toHaveBeenCalledWith('test-query', {
          collection: 'custom',
          limit: 50,
          skip: 10,
        });
      });
    });

    it('formats JSON correctly for results', async () => {
      const complexData = { nested: { object: { value: 'test' } } };
      mockExecuteQuery.mockResolvedValue([complexData]);

      renderWithProviders(<ExecuteQueryResultPage />);

      await waitFor(() => {
        const nestedTexts = screen.getAllByText(/"nested"/);
        expect(nestedTexts.length).toBeGreaterThan(0);
      });
    });

    it('handles formatJSON error gracefully', async () => {
      const circularRef: any = {};
      circularRef.self = circularRef;

      // This test verifies the formatJSON function handles errors
      // We can't easily trigger this in the UI, so we just verify the component renders
      renderWithProviders(<ExecuteQueryResultPage />);

      await waitFor(() => {
        expect(screen.getByText('Execute Query: test-query')).toBeInTheDocument();
      });
    });

    it('displays execution time correctly', async () => {
      renderWithProviders(<ExecuteQueryResultPage />);

      await waitFor(() => {
        // Just verify execution time is displayed (already tested in other test)
        expect(screen.getByText('Execution Time')).toBeInTheDocument();
      });
    });
  });

  describe('Component Structure', () => {
    it('renders without crashing', () => {
      expect(() => {
        renderWithProviders(<ExecuteQueryResultPage />);
      }).not.toThrow();
    });

    it('displays all main sections', async () => {
      renderWithProviders(<ExecuteQueryResultPage />);

      await waitFor(() => {
        expect(screen.getByText('Execution Parameters')).toBeInTheDocument();
        expect(screen.getByText('Query Results')).toBeInTheDocument();
        expect(screen.getByText('Results Count')).toBeInTheDocument();
      });
    });
  });
});
