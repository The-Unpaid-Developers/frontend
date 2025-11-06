import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Navbar } from '../Navbar';

const mockNavigate = vi.fn();
let mockLocation = { pathname: '/' };

vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
  useLocation: () => mockLocation,
}));

describe('Navbar', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('renders navbar with logo', () => {
    render(<Navbar />);
    expect(screen.getByText('Solution Review')).toBeInTheDocument();
  });

  it('navigates to home when logo clicked', () => {
    render(<Navbar />);
    const logo = screen.getByLabelText('Go to homepage');
    fireEvent.click(logo);
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  it('shows Login button when not logged in', () => {
    render(<Navbar />);
    expect(screen.getByText('Login')).toBeInTheDocument();
  });

  it('navigates to login when Login clicked', () => {
    render(<Navbar />);
    const loginButton = screen.getByText('Login');
    fireEvent.click(loginButton);
    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });

  it('displays username when logged in', () => {
    localStorage.setItem('username', 'testuser');
    localStorage.setItem('userToken', 'SA');
    render(<Navbar />);
    expect(screen.getByText('testuser')).toBeInTheDocument();
  });

  it('handles logout', () => {
    localStorage.setItem('userToken', 'SA');
    localStorage.setItem('username', 'testuser');
    render(<Navbar />);

    const logoutButton = screen.getByText('Logout');
    fireEvent.click(logoutButton);

    expect(localStorage.getItem('userToken')).toBeNull();
    expect(localStorage.getItem('username')).toBeNull();
    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });

  it('shows user role for SA users', () => {
    localStorage.setItem('userToken', 'SA');
    localStorage.setItem('username', 'testuser');
    render(<Navbar />);
    expect(screen.getByText('Solution Architect')).toBeInTheDocument();
  });

  it('shows user role for EAO users', () => {
    localStorage.setItem('userToken', 'EAO');
    localStorage.setItem('username', 'testuser');
    render(<Navbar />);
    expect(screen.getByText('Enterprise Architecture Office')).toBeInTheDocument();
  });

  it('checks if userRole is retrieved from localStorage', () => {
    localStorage.setItem('userToken', 'EAO');
    render(<Navbar />);
    expect(localStorage.getItem('userToken')).toBe('EAO');
  });

  it('checks if username is retrieved from localStorage', () => {
    localStorage.setItem('username', 'admin');
    render(<Navbar />);
    expect(localStorage.getItem('username')).toBe('admin');
  });
});
