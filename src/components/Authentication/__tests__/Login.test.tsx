import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { Login } from '../Login';
import { mockApiService } from '../../../services/mockApiUpdated';
import { createLoginCredentials } from '../../../__tests__/testFactories';

// Mock the navigation
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mock the API service
vi.mock('../../../services/mockApiUpdated', () => ({
  mockApiService: {
    login: vi.fn(),
  },
}));

const renderLogin = () => {
  return render(
    <BrowserRouter>
      <Login />
    </BrowserRouter>
  );
};

describe('Login Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders login form with all required elements', () => {
    renderLogin();
    
    expect(screen.getByRole('heading', { name: /login/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByText(/role/i)).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: /solution architect/i })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: /enterprise architecture office/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });

  it('disables login button when form is incomplete', () => {
    renderLogin();
    
    const loginButton = screen.getByRole('button', { name: /login/i });
    expect(loginButton).toBeDisabled();
  });

  it('enables login button when both name and role are provided', async () => {
    const user = userEvent.setup();
    renderLogin();
    
    const nameInput = screen.getByLabelText(/name/i);
    const roleRadio = screen.getByRole('radio', { name: /solution architect/i });
    const loginButton = screen.getByRole('button', { name: /login/i });
    
    await user.type(nameInput, 'John Doe');
    await user.click(roleRadio);
    
    expect(loginButton).toBeEnabled();
  });

  it('handles username input correctly', async () => {
    const user = userEvent.setup();
    renderLogin();
    
    const nameInput = screen.getByLabelText(/name/i);
    await user.type(nameInput, 'Test User');
    
    expect(nameInput).toHaveValue('Test User');
  });

  it('handles role selection correctly', async () => {
    const user = userEvent.setup();
    renderLogin();
    
    const saRadio = screen.getByRole('radio', { name: /solution architect/i });
    const eaoRadio = screen.getByRole('radio', { name: /enterprise architecture office/i });
    
    await user.click(saRadio);
    expect(saRadio).toBeChecked();
    expect(eaoRadio).not.toBeChecked();
    
    await user.click(eaoRadio);
    expect(eaoRadio).toBeChecked();
    expect(saRadio).not.toBeChecked();
  });

  it('should submit form with valid data', async () => {
    const user = userEvent.setup();
    const mockLogin = vi.mocked(mockApiService.login);
    mockLogin.mockResolvedValue({ token: 'mock-token' });
    const credentials = createLoginCredentials();
    
    renderLogin();
    
    const nameInput = screen.getByLabelText(/name/i);
    const roleRadio = screen.getByRole('radio', { name: /solution architect/i });
    const loginButton = screen.getByRole('button', { name: /login/i });
    
    await user.type(nameInput, credentials.username);
    await user.click(roleRadio);
    await user.click(loginButton);
    
    expect(mockLogin).toHaveBeenCalledWith(credentials.username, credentials.role);
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });

  it('trims whitespace from username before submission', async () => {
    const user = userEvent.setup();
    const mockLogin = vi.mocked(mockApiService.login);
    mockLogin.mockResolvedValue({ token: 'mock-token' });
    
    renderLogin();
    
    const nameInput = screen.getByLabelText(/name/i);
    const roleRadio = screen.getByRole('radio', { name: /solution architect/i });
    const loginButton = screen.getByRole('button', { name: /login/i });
    
    await user.type(nameInput, '  John Doe  ');
    await user.click(roleRadio);
    await user.click(loginButton);
    
    expect(mockLogin).toHaveBeenCalledWith('John Doe', 'SA');
  });

  it('shows loading state during login', async () => {
    const user = userEvent.setup();
    const mockLogin = vi.mocked(mockApiService.login);
    mockLogin.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));
    
    renderLogin();
    
    const nameInput = screen.getByLabelText(/name/i);
    const roleRadio = screen.getByRole('radio', { name: /solution architect/i });
    const loginButton = screen.getByRole('button', { name: /login/i });
    
    await user.type(nameInput, 'John Doe');
    await user.click(roleRadio);
    await user.click(loginButton);
    
    expect(screen.getByText(/signing in/i)).toBeInTheDocument();
    expect(loginButton).toBeDisabled();
  });

  it('displays error message on login failure', async () => {
    const user = userEvent.setup();
    const mockLogin = vi.mocked(mockApiService.login);
    mockLogin.mockRejectedValue(new Error('Invalid credentials'));
    
    renderLogin();
    
    const nameInput = screen.getByLabelText(/name/i);
    const roleRadio = screen.getByRole('radio', { name: /solution architect/i });
    const loginButton = screen.getByRole('button', { name: /login/i });
    
    await user.type(nameInput, 'John Doe');
    await user.click(roleRadio);
    await user.click(loginButton);
    
    await waitFor(() => {
      expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument();
    });
  });

  it('displays generic error message when error has no message', async () => {
    const user = userEvent.setup();
    const mockLogin = vi.mocked(mockApiService.login);
    mockLogin.mockRejectedValue({});
    
    renderLogin();
    
    const nameInput = screen.getByLabelText(/name/i);
    const roleRadio = screen.getByRole('radio', { name: /solution architect/i });
    const loginButton = screen.getByRole('button', { name: /login/i });
    
    await user.type(nameInput, 'John Doe');
    await user.click(roleRadio);
    await user.click(loginButton);
    
    await waitFor(() => {
      expect(screen.getByText(/login failed/i)).toBeInTheDocument();
    });
  });

  it('prevents form submission when username is only whitespace', () => {
    renderLogin();
    
    const nameInput = screen.getByLabelText(/name/i);
    const roleRadio = screen.getByRole('radio', { name: /solution architect/i });
    const loginButton = screen.getByRole('button', { name: /login/i });
    
    fireEvent.change(nameInput, { target: { value: '   ' } });
    fireEvent.click(roleRadio);
    
    expect(loginButton).toBeDisabled();
  });

  it('handles form submission via Enter key', async () => {
    const user = userEvent.setup();
    const mockLogin = vi.mocked(mockApiService.login);
    mockLogin.mockResolvedValue({ token: 'mock-token' });
    
    renderLogin();
    
    const nameInput = screen.getByLabelText(/name/i);
    const roleRadio = screen.getByRole('radio', { name: /solution architect/i });
    
    await user.type(nameInput, 'John Doe');
    await user.click(roleRadio);
    await user.keyboard('{Enter}');
    
    expect(mockLogin).toHaveBeenCalledWith('John Doe', 'SA');
  });

  it('does not submit when form is incomplete and Enter is pressed', async () => {
    const user = userEvent.setup();
    const mockLogin = vi.mocked(mockApiService.login);
    
    renderLogin();
    
    const nameInput = screen.getByLabelText(/name/i);
    await user.type(nameInput, 'John Doe');
    await user.keyboard('{Enter}');
    
    expect(mockLogin).not.toHaveBeenCalled();
  });

  it('does not submit form when submitted programmatically with invalid data', () => {
    const mockLogin = vi.mocked(mockApiService.login);

    const { container } = renderLogin();

    // Get form element and try to submit it programmatically without valid data
    const form = container.querySelector('form');
    expect(form).toBeInTheDocument();

    fireEvent.submit(form!);

    // Should not call login when form is incomplete
    expect(mockLogin).not.toHaveBeenCalled();
  });

  it('clears error when starting a new login attempt', async () => {
    const user = userEvent.setup();
    const mockLogin = vi.mocked(mockApiService.login);

    // First, cause an error
    mockLogin.mockRejectedValueOnce(new Error('Test error'));

    renderLogin();

    const nameInput = screen.getByLabelText(/name/i);
    const roleRadio = screen.getByRole('radio', { name: /solution architect/i });
    const loginButton = screen.getByRole('button', { name: /login/i });

    await user.type(nameInput, 'John Doe');
    await user.click(roleRadio);
    await user.click(loginButton);

    await waitFor(() => {
      expect(screen.getByText(/test error/i)).toBeInTheDocument();
    });

    // Now try again, error should be cleared
    mockLogin.mockResolvedValue({ token: 'mock-token' });
    await user.click(loginButton);

    expect(screen.queryByText(/test error/i)).not.toBeInTheDocument();
  });
});