import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ExecuteQueryResultPage } from '../ExecuteQueryResultPage';

const mockNavigate = vi.fn();
const mockParams = { queryName: 'test-query' };
const mockSearchParams = new URLSearchParams('collection=solutionReviews&limit=100&skip=0');
const mockLoadSpecificQuery = vi.fn().mockResolvedValue({
  name: 'test-query',
  description: 'Test Description',
  mongoQuery: '[{"$match": {}}]',
});
const mockExecuteQuery = vi.fn().mockResolvedValue([
  { id: '1', name: 'Result 1' },
  { id: '2', name: 'Result 2' },
]);

vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
  useParams: () => mockParams,
  useSearchParams: () => [mockSearchParams],
}));

vi.mock('../../../hooks/useQuery', () => ({
  useQuery: () => ({
    executeQuery: mockExecuteQuery,
    loadSpecificQuery: mockLoadSpecificQuery,
    isLoading: false,
  }),
}));

vi.mock('../../../context/ToastContext', () => ({
  useToast: () => ({
    showSuccess: vi.fn(),
    showError: vi.fn(),
  }),
}));

describe('ExecuteQueryResultPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders execute query result page', () => {
    const { container } = render(<ExecuteQueryResultPage />);
    expect(container).toBeInTheDocument();
  });

  it('calls loadSpecificQuery on mount', () => {
    render(<ExecuteQueryResultPage />);
    expect(mockLoadSpecificQuery).toHaveBeenCalledWith('test-query');
  });

  it('calls executeQuery on mount', async () => {
    render(<ExecuteQueryResultPage />);
    // Wait a bit for the async initialization
    await new Promise(resolve => setTimeout(resolve, 100));
    expect(mockExecuteQuery).toHaveBeenCalled();
  });

  it('renders with query name in document', () => {
    const { container } = render(<ExecuteQueryResultPage />);
    expect(container.textContent).toContain('test-query');
  });
});
