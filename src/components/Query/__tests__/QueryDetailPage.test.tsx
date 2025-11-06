import React from 'react';
import { render } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { QueryDetailPage } from '../QueryDetailPage';

const mockNavigate = vi.fn();
const mockParams = { queryName: 'test-query' };
const mockLoadSpecificQuery = vi.fn().mockResolvedValue({
  name: 'test-query',
  description: 'Test Description',
  mongoQuery: '[{"$match": {}}]',
});

vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
  useParams: () => mockParams,
}));

vi.mock('../../../hooks/useQuery', () => ({
  useQuery: () => ({
    loadSpecificQuery: mockLoadSpecificQuery,
    updateQuery: vi.fn(),
    deleteQuery: vi.fn(),
    isLoading: false,
  }),
}));

vi.mock('../../../context/ToastContext', () => ({
  useToast: () => ({
    showSuccess: vi.fn(),
    showError: vi.fn(),
    showInfo: vi.fn(),
    hideToast: vi.fn(),
  }),
}));

describe('QueryDetailPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders query detail page without crashing', () => {
    const { container } = render(<QueryDetailPage />);
    expect(container).toBeInTheDocument();
  });

  it('calls loadSpecificQuery on mount', () => {
    render(<QueryDetailPage />);
    expect(mockLoadSpecificQuery).toHaveBeenCalledWith('test-query');
  });
});
