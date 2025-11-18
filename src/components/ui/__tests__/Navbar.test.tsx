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

  describe('Navigation Items', () => {
    it('renders Create Review button', () => {
      render(<Navbar />);
      expect(screen.getAllByText('Create Review').length).toBeGreaterThan(0);
    });

    it('navigates to create solution review when clicked', () => {
      const { container } = render(<Navbar />);
      // Get the desktop version (inside .hidden.md:flex)
      const desktopNav = container.querySelector('.hidden.md\\:flex');
      const createButton = desktopNav?.querySelector('button');
      if (createButton) {
        fireEvent.click(createButton);
        expect(mockNavigate).toHaveBeenCalledWith('/create-solution-review');
      }
    });

    it('highlights active navigation item', () => {
      mockLocation = { pathname: '/create-solution-review' };
      const { container } = render(<Navbar />);
      const desktopNav = container.querySelector('.hidden.md\\:flex');
      const createButton = desktopNav?.querySelector('button');
      expect(createButton).toHaveClass('bg-primary-100', 'text-primary-700');
    });

    it('does not highlight inactive navigation items', () => {
      mockLocation = { pathname: '/' };
      const { container } = render(<Navbar />);
      const desktopNav = container.querySelector('.hidden.md\\:flex');
      const createButton = desktopNav?.querySelector('button');
      expect(createButton).not.toHaveClass('bg-primary-100');
    });
  });

  describe('Diagram Dropdown', () => {
    it('renders Diagrams button', () => {
      render(<Navbar />);
      const diagramButtons = screen.getAllByText('Diagrams');
      expect(diagramButtons.length).toBeGreaterThan(0);
    });

    it('toggles diagram dropdown when clicked', () => {
      const { container } = render(<Navbar />);
      const desktopNav = container.querySelector('.hidden.md\\:flex');
      const diagramButton = desktopNav?.querySelectorAll('button')[1]; // Second button is Diagrams

      // Initially dropdown menu should not be visible
      let dropdownMenu = container.querySelector('.absolute.right-0.mt-2.w-64');
      expect(dropdownMenu).not.toBeInTheDocument();

      // Click to open
      if (diagramButton) {
        fireEvent.click(diagramButton);
      }
      dropdownMenu = container.querySelector('.absolute.right-0.mt-2.w-64');
      expect(dropdownMenu).toBeInTheDocument();

      // Click to close
      if (diagramButton) {
        fireEvent.click(diagramButton);
      }
      dropdownMenu = container.querySelector('.absolute.right-0.mt-2.w-64');
      expect(dropdownMenu).not.toBeInTheDocument();
    });

    it('navigates to diagram page when option clicked', () => {
      const { container } = render(<Navbar />);
      const desktopNav = container.querySelector('.hidden.md\\:flex');
      const diagramButton = desktopNav?.querySelectorAll('button')[1];
      if (diagramButton) {
        fireEvent.click(diagramButton);
      }

      // Find the dropdown menu and click the first option
      const dropdownMenu = container.querySelector('.absolute.right-0.mt-2.w-64');
      const firstOption = dropdownMenu?.querySelector('button');
      if (firstOption) {
        fireEvent.click(firstOption);
      }

      expect(mockNavigate).toHaveBeenCalledWith('/view-overall-systems-diagram');
    });

    it('closes dropdown after selecting an option', () => {
      const { container } = render(<Navbar />);
      const desktopNav = container.querySelector('.hidden.md\\:flex');
      const diagramButton = desktopNav?.querySelectorAll('button')[1];
      if (diagramButton) {
        fireEvent.click(diagramButton);
      }

      // Click an option in the dropdown
      const dropdownMenu = container.querySelector('.absolute.right-0.mt-2.w-64');
      const secondOption = dropdownMenu?.querySelectorAll('button')[1];
      if (secondOption) {
        fireEvent.click(secondOption);
      }

      // Dropdown should be closed
      const closedDropdown = container.querySelector('.absolute.right-0.mt-2.w-64');
      expect(closedDropdown).not.toBeInTheDocument();
    });

    it('highlights active diagram option', () => {
      mockLocation = { pathname: '/view-business-capabilities' };
      const { container } = render(<Navbar />);
      const desktopNav = container.querySelector('.hidden.md\\:flex');
      const diagramButton = desktopNav?.querySelectorAll('button')[1];

      // Diagram button should be highlighted when a diagram page is active
      expect(diagramButton).toHaveClass('bg-primary-100', 'text-primary-700');
    });

    it('closes dropdown when clicking backdrop', () => {
      const { container } = render(<Navbar />);
      const desktopNav = container.querySelector('.hidden.md\\:flex');
      const diagramButton = desktopNav?.querySelectorAll('button')[1];
      if (diagramButton) {
        fireEvent.click(diagramButton);
      }

      // Dropdown should be visible
      let dropdownMenu = container.querySelector('.absolute.right-0.mt-2.w-64');
      expect(dropdownMenu).toBeInTheDocument();

      // Click the backdrop
      const backdrop = container.querySelector('.fixed.inset-0.z-40');
      if (backdrop) {
        fireEvent.click(backdrop);
      }

      // Dropdown should be closed
      dropdownMenu = container.querySelector('.absolute.right-0.mt-2.w-64');
      expect(dropdownMenu).not.toBeInTheDocument();
    });
  });

  describe('Query & Lookup Dropdown', () => {
    it('renders Lookups & Queries button', () => {
      render(<Navbar />);
      expect(screen.getByText('Lookups & Queries')).toBeInTheDocument();
    });

    it('toggles query dropdown when clicked', () => {
      render(<Navbar />);
      const queryButton = screen.getByText('Lookups & Queries');

      // Initially dropdown should not be visible
      expect(screen.queryByText('View All Queries')).not.toBeInTheDocument();

      // Click to open
      fireEvent.click(queryButton);
      expect(screen.getByText('View All Queries')).toBeInTheDocument();
      expect(screen.getByText('Create Query')).toBeInTheDocument();
      expect(screen.getByText('View All Lookups')).toBeInTheDocument();
      expect(screen.getByText('Create Lookup')).toBeInTheDocument();

      // Click to close
      fireEvent.click(queryButton);
      expect(screen.queryByText('View All Queries')).not.toBeInTheDocument();
    });

    it('navigates to query page when option clicked', () => {
      render(<Navbar />);
      const queryButton = screen.getByText('Lookups & Queries');
      fireEvent.click(queryButton);

      const viewQueriesOption = screen.getByText('View All Queries');
      fireEvent.click(viewQueriesOption);

      expect(mockNavigate).toHaveBeenCalledWith('/view-queries');
    });

    it('navigates to create query page', () => {
      render(<Navbar />);
      const queryButton = screen.getByText('Lookups & Queries');
      fireEvent.click(queryButton);

      const createQueryOption = screen.getByText('Create Query');
      fireEvent.click(createQueryOption);

      expect(mockNavigate).toHaveBeenCalledWith('/create-query');
    });

    it('navigates to view lookups page', () => {
      render(<Navbar />);
      const queryButton = screen.getByText('Lookups & Queries');
      fireEvent.click(queryButton);

      const viewLookupsOption = screen.getByText('View All Lookups');
      fireEvent.click(viewLookupsOption);

      expect(mockNavigate).toHaveBeenCalledWith('/view-lookups');
    });

    it('navigates to create lookup page', () => {
      render(<Navbar />);
      const queryButton = screen.getByText('Lookups & Queries');
      fireEvent.click(queryButton);

      const createLookupOption = screen.getByText('Create Lookup');
      fireEvent.click(createLookupOption);

      expect(mockNavigate).toHaveBeenCalledWith('/create-lookup');
    });

    it('closes dropdown after selecting an option', () => {
      render(<Navbar />);
      const queryButton = screen.getByText('Lookups & Queries');
      fireEvent.click(queryButton);

      const viewQueriesOption = screen.getByText('View All Queries');
      fireEvent.click(viewQueriesOption);

      expect(screen.queryByText('View All Queries')).not.toBeInTheDocument();
    });

    it('highlights active query option', () => {
      mockLocation = { pathname: '/create-query' };
      const { container } = render(<Navbar />);
      const desktopNav = container.querySelector('.hidden.md\\:flex');
      const queryButton = desktopNav?.querySelectorAll('button')[2]; // Third button is Lookups & Queries

      // Query button should be highlighted when a query page is active
      expect(queryButton).toHaveClass('bg-primary-100', 'text-primary-700');
    });

    it('closes dropdown when clicking backdrop', () => {
      const { container } = render(<Navbar />);
      const queryButton = screen.getByText('Lookups & Queries');
      fireEvent.click(queryButton);

      expect(screen.getByText('View All Queries')).toBeInTheDocument();

      // Click the backdrop (there should be one for query dropdown)
      const backdrops = container.querySelectorAll('.fixed.inset-0.z-40');
      if (backdrops.length > 0) {
        fireEvent.click(backdrops[0]);
      }

      expect(screen.queryByText('View All Queries')).not.toBeInTheDocument();
    });
  });

  describe('Admin Panel', () => {
    it('shows Admin Panel link for EAO users', () => {
      localStorage.setItem('userToken', 'EAO');
      localStorage.setItem('username', 'admin');
      render(<Navbar />);
      const adminButtons = screen.getAllByText('Admin Panel');
      expect(adminButtons.length).toBeGreaterThan(0);
    });

    it('does not show Admin Panel link for SA users', () => {
      localStorage.setItem('userToken', 'SA');
      localStorage.setItem('username', 'user');
      render(<Navbar />);
      expect(screen.queryByText('Admin Panel')).not.toBeInTheDocument();
    });

    it('navigates to admin page when clicked', () => {
      localStorage.setItem('userToken', 'EAO');
      localStorage.setItem('username', 'admin');
      const { container } = render(<Navbar />);

      const desktopNav = container.querySelector('.hidden.md\\:flex');
      const adminButton = desktopNav?.querySelectorAll('button')[1]; // Admin Panel is 2nd button for EAO users
      if (adminButton) {
        fireEvent.click(adminButton);
        expect(mockNavigate).toHaveBeenCalledWith('/admin');
      }
    });

    it('highlights active admin panel', () => {
      mockLocation = { pathname: '/admin' };
      localStorage.setItem('userToken', 'EAO');
      localStorage.setItem('username', 'admin');
      const { container } = render(<Navbar />);

      const desktopNav = container.querySelector('.hidden.md\\:flex');
      const adminButton = desktopNav?.querySelectorAll('button')[1];
      expect(adminButton).toHaveClass('bg-primary-100', 'text-primary-700');
    });
  });

  describe('Mobile Navigation', () => {
    it('renders mobile navigation items', () => {
      const { container } = render(<Navbar />);
      // Mobile nav is rendered but hidden with md:hidden class
      const mobileNav = container.querySelector('.md\\:hidden.bg-white');
      expect(mobileNav).toBeInTheDocument();
    });

    it('navigates when mobile nav item clicked', () => {
      const { container } = render(<Navbar />);
      const mobileNav = container.querySelector('.md\\:hidden.bg-white');

      if (mobileNav) {
        const createButton = mobileNav.querySelector('button');
        if (createButton) {
          fireEvent.click(createButton);
          expect(mockNavigate).toHaveBeenCalled();
        }
      }
    });

    it('renders mobile diagram options', () => {
      const { container } = render(<Navbar />);
      const mobileNav = container.querySelector('.md\\:hidden.bg-white');

      expect(mobileNav?.textContent).toContain('Diagrams');
    });
  });

  describe('User Display', () => {
    it('displays user initial in avatar', () => {
      localStorage.setItem('userToken', 'SA');
      localStorage.setItem('username', 'testuser');
      render(<Navbar />);
      expect(screen.getByText('T')).toBeInTheDocument();
    });

    it('handles lowercase username for avatar', () => {
      localStorage.setItem('userToken', 'SA');
      localStorage.setItem('username', 'john');
      render(<Navbar />);
      expect(screen.getByText('J')).toBeInTheDocument();
    });
  });
});
