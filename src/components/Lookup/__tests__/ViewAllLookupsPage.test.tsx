import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderWithRouter, screen, fireEvent, waitFor } from '../../../test/test-utils';
import { ViewAllLookupsPage } from '../ViewAllLookupsPage';

const mockNavigate = vi.fn();
const mockLoadAllLookups = vi.fn();
const mockShowError = vi.fn();

// Mutable mock data
const mockLookupData = {
  lookups: [] as any[],
  isLoading: false,
};

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock('../../../hooks/useLookup', () => ({
  useLookup: () => ({
    loadAllLookups: mockLoadAllLookups,
    isLoading: mockLookupData.isLoading,
  }),
}));

vi.mock('../../../context/ToastContext', () => ({
  useToast: () => ({
    showError: mockShowError,
    showSuccess: vi.fn(),
  }),
  ToastProvider: ({ children }: { children: React.ReactNode }) => children,
}));

describe('ViewAllLookupsPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockLookupData.lookups = [];
    mockLookupData.isLoading = false;
    mockLoadAllLookups.mockResolvedValue([]);
  });

  it('renders lookups page', async () => {
    renderWithRouter(<ViewAllLookupsPage />);

    await waitFor(() => {
      expect(screen.getByText('Lookups')).toBeInTheDocument();
    });
  });

  it('displays page title and description', async () => {
    renderWithRouter(<ViewAllLookupsPage />);

    await waitFor(() => {
      expect(screen.getByText('Lookups')).toBeInTheDocument();
      expect(screen.getByText('View and Manage Lookups')).toBeInTheDocument();
    });
  });

  it('has create new lookup button', async () => {
    renderWithRouter(<ViewAllLookupsPage />);

    await waitFor(() => {
      const createButtons = screen.getAllByText(/Create New/i);
      expect(createButtons.length).toBeGreaterThan(0);
    });
  });

  it('navigates to create lookup page when create button clicked', async () => {
    renderWithRouter(<ViewAllLookupsPage />);

    await waitFor(() => {
      const createButtons = screen.getAllByText(/Create New/i);
      fireEvent.click(createButtons[0]); // Click the header button
    });

    expect(mockNavigate).toHaveBeenCalledWith('/create-lookup');
  });

  it('displays search input', async () => {
    renderWithRouter(<ViewAllLookupsPage />);

    await waitFor(() => {
      expect(screen.getByPlaceholderText(/Search lookups/i)).toBeInTheDocument();
    });
  });

  it('calls loadAllLookups on mount', async () => {
    renderWithRouter(<ViewAllLookupsPage />);

    await waitFor(() => {
      expect(mockLoadAllLookups).toHaveBeenCalled();
    });
  });
});

describe('ViewAllLookupsPage - Loading State', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockLookupData.lookups = [];
    mockLookupData.isLoading = true;
    mockLoadAllLookups.mockImplementation(() => new Promise(() => {})); // Never resolves
  });

  it('displays loading state', () => {
    renderWithRouter(<ViewAllLookupsPage />);

    expect(screen.getByText(/Loading lookups/i)).toBeInTheDocument();
  });

  it('shows spinner during loading', () => {
    const { container } = renderWithRouter(<ViewAllLookupsPage />);

    const spinner = container.querySelector('.animate-spin');
    expect(spinner).toBeInTheDocument();
  });
});

describe('ViewAllLookupsPage - Empty State', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockLookupData.lookups = [];
    mockLookupData.isLoading = false;
    mockLoadAllLookups.mockResolvedValue([]);
  });

  it('displays empty state when no lookups', async () => {
    renderWithRouter(<ViewAllLookupsPage />);

    await waitFor(() => {
      expect(screen.getByText(/No lookups found/i)).toBeInTheDocument();
    });
  });

  it('shows create button in empty state', async () => {
    renderWithRouter(<ViewAllLookupsPage />);

    await waitFor(() => {
      expect(screen.getAllByText(/Create New/i).length).toBeGreaterThan(0);
    });
  });

  it('displays helpful message in empty state', async () => {
    renderWithRouter(<ViewAllLookupsPage />);

    await waitFor(() => {
      expect(screen.getByText(/Get started by creating your first lookup/i)).toBeInTheDocument();
    });
  });
});

describe('ViewAllLookupsPage - With Lookups', () => {
  const mockLookups = [
    {
      lookupName: 'high-value-solutions',
      description: 'Solutions with high business value',
      recordCount: 10,
    },
    {
      lookupName: 'critical-systems',
      description: 'Mission-critical system codes',
      recordCount: 25,
    },
    {
      lookupName: 'tech-stack',
      description: 'Approved technology stack',
      recordCount: 15,
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    mockLookupData.lookups = mockLookups;
    mockLookupData.isLoading = false;
    mockLoadAllLookups.mockResolvedValue(mockLookups);
  });

  it('displays all lookups', async () => {
    renderWithRouter(<ViewAllLookupsPage />);

    await waitFor(() => {
      expect(screen.getByText('high-value-solutions')).toBeInTheDocument();
      expect(screen.getByText('critical-systems')).toBeInTheDocument();
      expect(screen.getByText('tech-stack')).toBeInTheDocument();
    });
  });

  it('shows lookup descriptions', async () => {
    renderWithRouter(<ViewAllLookupsPage />);

    await waitFor(() => {
      expect(screen.getByText(/Solutions with high business value/i)).toBeInTheDocument();
      expect(screen.getByText(/Mission-critical system codes/i)).toBeInTheDocument();
    });
  });

  it('displays record counts', async () => {
    renderWithRouter(<ViewAllLookupsPage />);

    await waitFor(() => {
      expect(screen.getByText(/10 record\(s\)/i)).toBeInTheDocument();
      expect(screen.getByText(/25 record\(s\)/i)).toBeInTheDocument();
      expect(screen.getByText(/15 record\(s\)/i)).toBeInTheDocument();
    });
  });

  it('shows stats summary', async () => {
    renderWithRouter(<ViewAllLookupsPage />);

    await waitFor(() => {
      expect(screen.getByText(/Showing/i)).toBeInTheDocument();
      const statsText = screen.getByText((content, element) => {
        return element?.tagName === 'P' && /Showing.*3.*of.*3.*lookups/.test(element.textContent || '');
      });
      expect(statsText).toBeInTheDocument();
    });
  });

  it('has view details button for each lookup', async () => {
    renderWithRouter(<ViewAllLookupsPage />);

    await waitFor(() => {
      const viewButtons = screen.getAllByText(/View Details/i);
      expect(viewButtons.length).toBe(3);
    });
  });

  it('navigates to lookup detail when view button clicked', async () => {
    renderWithRouter(<ViewAllLookupsPage />);

    await waitFor(() => {
      const viewButtons = screen.getAllByText(/View Details/i);
      fireEvent.click(viewButtons[0]);
    });

    expect(mockNavigate).toHaveBeenCalledWith('/view-lookup/high-value-solutions');
  });
});

describe('ViewAllLookupsPage - Search Functionality', () => {
  const mockLookups = [
    {
      lookupName: 'high-value-solutions',
      description: 'Solutions with high business value',
      recordCount: 10,
    },
    {
      lookupName: 'critical-systems',
      description: 'Mission-critical system codes',
      recordCount: 25,
    },
    {
      lookupName: 'tech-stack',
      description: 'Approved technology stack for projects',
      recordCount: 15,
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    mockLookupData.lookups = mockLookups;
    mockLookupData.isLoading = false;
    mockLoadAllLookups.mockResolvedValue(mockLookups);
  });

  it('filters lookups by name', async () => {
    renderWithRouter(<ViewAllLookupsPage />);

    await waitFor(() => {
      const searchInput = screen.getByPlaceholderText(/Search lookups/i);
      fireEvent.change(searchInput, { target: { value: 'critical' } });
    });

    await waitFor(() => {
      expect(screen.getByText('critical-systems')).toBeInTheDocument();
      expect(screen.queryByText('high-value-solutions')).not.toBeInTheDocument();
    });
  });

  it('filters lookups by description', async () => {
    renderWithRouter(<ViewAllLookupsPage />);

    await waitFor(() => {
      const searchInput = screen.getByPlaceholderText(/Search lookups/i);
      fireEvent.change(searchInput, { target: { value: 'technology' } });
    });

    await waitFor(() => {
      expect(screen.getByText('tech-stack')).toBeInTheDocument();
      expect(screen.queryByText('critical-systems')).not.toBeInTheDocument();
    });
  });

  it('search is case insensitive', async () => {
    renderWithRouter(<ViewAllLookupsPage />);

    await waitFor(() => {
      const searchInput = screen.getByPlaceholderText(/Search lookups/i);
      fireEvent.change(searchInput, { target: { value: 'CRITICAL' } });
    });

    await waitFor(() => {
      expect(screen.getByText('critical-systems')).toBeInTheDocument();
    });
  });

  it('shows filtered count', async () => {
    renderWithRouter(<ViewAllLookupsPage />);

    await waitFor(() => {
      const searchInput = screen.getByPlaceholderText(/Search lookups/i);
      fireEvent.change(searchInput, { target: { value: 'system' } });
    });

    await waitFor(() => {
      // Should show "1 of 3 lookups"
      expect(screen.getByText(/Showing/i)).toBeInTheDocument();
      expect(screen.getByText(/1/)).toBeInTheDocument();
      expect(screen.getByText(/3/)).toBeInTheDocument();
    });
  });

  it('displays clear search button when searching', async () => {
    renderWithRouter(<ViewAllLookupsPage />);

    await waitFor(() => {
      const searchInput = screen.getByPlaceholderText(/Search lookups/i);
      fireEvent.change(searchInput, { target: { value: 'test' } });
    });

    await waitFor(() => {
      expect(screen.getAllByText(/Clear search/i).length).toBeGreaterThan(0);
    });
  });

  it('clears search when clear button clicked', async () => {
    renderWithRouter(<ViewAllLookupsPage />);

    const searchInput = screen.getByPlaceholderText(/Search lookups/i);

    await waitFor(() => {
      fireEvent.change(searchInput, { target: { value: 'critical' } });
    });

    await waitFor(() => {
      const clearButton = screen.getAllByText(/Clear search/i)[0];
      fireEvent.click(clearButton);
    });

    expect((searchInput as HTMLInputElement).value).toBe('');
  });

  it('shows no results message for empty search', async () => {
    renderWithRouter(<ViewAllLookupsPage />);

    await waitFor(() => {
      const searchInput = screen.getByPlaceholderText(/Search lookups/i);
      fireEvent.change(searchInput, { target: { value: 'nonexistent' } });
    });

    await waitFor(() => {
      expect(screen.getByText(/No lookups match your search/i)).toBeInTheDocument();
      expect(screen.getByText(/Try adjusting your search terms/i)).toBeInTheDocument();
    });
  });

  it('shows clear search button in empty search state', async () => {
    renderWithRouter(<ViewAllLookupsPage />);

    await waitFor(() => {
      const searchInput = screen.getByPlaceholderText(/Search lookups/i);
      fireEvent.change(searchInput, { target: { value: 'nonexistent' } });
    });

    await waitFor(() => {
      const clearButtons = screen.getAllByText(/Clear search/i);
      expect(clearButtons.length).toBeGreaterThan(0);
    });
  });
});

describe('ViewAllLookupsPage - Error Handling', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockLookupData.lookups = [];
    mockLookupData.isLoading = false;
  });

  it('shows error when loading fails', async () => {
    const error = new Error('Failed to load');
    mockLoadAllLookups.mockRejectedValue(error);

    renderWithRouter(<ViewAllLookupsPage />);

    await waitFor(() => {
      expect(mockShowError).toHaveBeenCalledWith('Failed to load lookups: Failed to load');
    });
  });

  it('handles non-Error rejection', async () => {
    mockLoadAllLookups.mockRejectedValue('String error');

    renderWithRouter(<ViewAllLookupsPage />);

    await waitFor(() => {
      expect(mockShowError).toHaveBeenCalledWith('Failed to load lookups: Unknown error');
    });
  });

  it('logs error to console', async () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const error = new Error('Test error');
    mockLoadAllLookups.mockRejectedValue(error);

    renderWithRouter(<ViewAllLookupsPage />);

    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalledWith('Error loading lookups:', error);
    });

    consoleErrorSpy.mockRestore();
  });
});

describe('ViewAllLookupsPage - Navigation Stopppropagation', () => {
  const mockLookups = [
    {
      lookupName: 'test-lookup',
      description: 'Test description',
      recordCount: 5,
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    mockLookupData.lookups = mockLookups;
    mockLookupData.isLoading = false;
    mockLoadAllLookups.mockResolvedValue(mockLookups);
  });

  it('stops event propagation on view details click', async () => {
    renderWithRouter(<ViewAllLookupsPage />);

    await waitFor(() => {
      const viewButton = screen.getByText(/View Details/i);
      const clickEvent = new MouseEvent('click', { bubbles: true });
      const stopPropagationSpy = vi.spyOn(clickEvent, 'stopPropagation');

      viewButton.dispatchEvent(clickEvent);

      expect(stopPropagationSpy).toHaveBeenCalled();
    });
  });
});
