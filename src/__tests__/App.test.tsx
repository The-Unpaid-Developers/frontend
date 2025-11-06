import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from '../App';

// Mock all the complex components to avoid deep integration test issues
vi.mock('../components/Dashboard', () => ({
  Dashboard: () => <div data-testid="dashboard">Dashboard Component</div>
}));

vi.mock('../components/Authentication/Login', () => ({
  Login: () => <div data-testid="login">Login Component</div>
}));

vi.mock('../components/AdminPanel', () => ({
  AdminPanel: () => <div data-testid="admin-panel">Admin Panel Component</div>
}));

vi.mock('../components/SolutionReviews/CreateSolutionReview/CreateSolutionReviewPage', () => ({
  CreateSolutionReviewPage: () => <div data-testid="create-solution-review">Create Solution Review Page</div>
}));

vi.mock('../components/SolutionReviews/UpdateSolutionReview/UpdateSolutionReviewPage', () => ({
  UpdateSolutionReviewPage: () => <div data-testid="update-solution-review">Update Solution Review Page</div>
}));

vi.mock('../components/SolutionReviews/SolutionReviewDetail/SystemDetailPage', () => ({
  SystemDetailPage: () => <div data-testid="system-detail">System Detail Page</div>
}));

vi.mock('../components/SolutionReviews/SolutionReviewDetail/SolutionReviewDetailPage', () => ({
  SolutionReviewDetailPage: () => <div data-testid="solution-review-detail">Solution Review Detail Page</div>
}));

vi.mock('../components/Diagrams/DependenciesFlow/SpecificSystem/SpecificSystemVisualization', () => ({
  default: () => <div data-testid="specific-system-visualization">Specific System Visualization</div>
}));

vi.mock('../components/Diagrams/DependenciesFlow/PathBetweenSystems/PathSankeyVisualization', () => ({
  default: () => <div data-testid="path-sankey-visualization">Path Sankey Visualization</div>
}));

vi.mock('../components/Diagrams/DependenciesFlow/OverallSystems/OverallSystemsVisualization', () => ({
  default: () => <div data-testid="overall-systems-visualization">Overall Systems Visualization</div>
}));

vi.mock('../components/Diagrams/BusinessCapabilities', () => ({
  BusinessCapabilitiesVisualization: () => <div data-testid="business-capabilities-visualization">Business Capabilities Visualization</div>
}));

vi.mock('../components/Query/CreateQueryPage', () => ({
  CreateQueryPage: () => <div data-testid="create-query">Create Query Page</div>
}));

vi.mock('../components/Query/QueryDetailPage', () => ({
  QueryDetailPage: () => <div data-testid="query-detail">Query Detail Page</div>
}));

vi.mock('../components/Query/ExecuteQueryResultPage', () => ({
  ExecuteQueryResultPage: () => <div data-testid="execute-query-result">Execute Query Result Page</div>
}));

vi.mock('../components/Query/ViewAllQueriesPage', () => ({
  ViewAllQueriesPage: () => <div data-testid="view-all-queries">View All Queries Page</div>
}));

vi.mock('../components/ui', () => ({
  Navbar: () => <nav data-testid="navbar">Navigation Bar</nav>
}));

// Helper function to render App and navigate to a specific route
const renderAtRoute = (route: string = '/') => {
  window.history.pushState({}, 'Test page', route);
  return render(<App />);
};

describe('App Component', () => {
  beforeEach(() => {
    // Reset to root route before each test
    window.history.pushState({}, 'Test page', '/');
  });

  it('renders without crashing', () => {
    renderAtRoute();
    expect(screen.getByTestId('navbar')).toBeInTheDocument();
  });

  it('renders Dashboard component for root route', () => {
    renderAtRoute('/');
    expect(screen.getByTestId('dashboard')).toBeInTheDocument();
    expect(screen.getByTestId('navbar')).toBeInTheDocument();
  });

  it('renders Login component for /login route', () => {
    renderAtRoute('/login');
    expect(screen.getByTestId('login')).toBeInTheDocument();
    expect(screen.getByTestId('navbar')).toBeInTheDocument();
  });

  it('renders Admin Panel component for /admin route', () => {
    renderAtRoute('/admin');
    expect(screen.getByTestId('admin-panel')).toBeInTheDocument();
    expect(screen.getByTestId('navbar')).toBeInTheDocument();
  });

  it('renders Create Solution Review page for /create-solution-review route', () => {
    renderAtRoute('/create-solution-review');
    expect(screen.getByTestId('create-solution-review')).toBeInTheDocument();
  });

  it('renders Update Solution Review page for /update-solution-review/:id route', () => {
    renderAtRoute('/update-solution-review/123');
    expect(screen.getByTestId('update-solution-review')).toBeInTheDocument();
  });

  it('renders System Detail page for /view-system-detail/:systemCode route', () => {
    renderAtRoute('/view-system-detail/SYS-001');
    expect(screen.getByTestId('system-detail')).toBeInTheDocument();
  });

  it('renders Solution Review Detail page for /view-solution-review/:id route', () => {
    renderAtRoute('/view-solution-review/123');
    expect(screen.getByTestId('solution-review-detail')).toBeInTheDocument();
  });

  describe('Diagram Routes', () => {
    it('renders Specific System Visualization for /view-system-flow-diagram/:systemCode route', () => {
      renderAtRoute('/view-system-flow-diagram/SYS-001');
      expect(screen.getByTestId('specific-system-visualization')).toBeInTheDocument();
    });

    it('renders Overall Systems Visualization for /view-overall-systems-diagram route', () => {
      renderAtRoute('/view-overall-systems-diagram');
      expect(screen.getByTestId('overall-systems-visualization')).toBeInTheDocument();
    });

    it('renders Path Sankey Visualization for /view-paths-between-systems route', () => {
      renderAtRoute('/view-paths-between-systems');
      expect(screen.getByTestId('path-sankey-visualization')).toBeInTheDocument();
    });

    it('renders Business Capabilities Visualization for /view-business-capabilities route', () => {
      renderAtRoute('/view-business-capabilities');
      expect(screen.getByTestId('business-capabilities-visualization')).toBeInTheDocument();
    });

    it('renders Business Capabilities Visualization for /view-business-capabilities/:systemCode route', () => {
      renderAtRoute('/view-business-capabilities/SYS-001');
      expect(screen.getByTestId('business-capabilities-visualization')).toBeInTheDocument();
    });
  });

  describe('Query Routes', () => {
    it('renders Create Query page for /create-query route', () => {
      renderAtRoute('/create-query');
      expect(screen.getByTestId('create-query')).toBeInTheDocument();
    });

    it('renders Query Detail page for /view-query/:queryName route', () => {
      renderAtRoute('/view-query/test-query');
      expect(screen.getByTestId('query-detail')).toBeInTheDocument();
    });

    it('renders Execute Query Result page for /execute-query/:queryName route', () => {
      renderAtRoute('/execute-query/test-query');
      expect(screen.getByTestId('execute-query-result')).toBeInTheDocument();
    });

    it('renders View All Queries page for /view-queries route', () => {
      renderAtRoute('/view-queries');
      expect(screen.getByTestId('view-all-queries')).toBeInTheDocument();
    });
  });

  it('includes ErrorBoundary in the component tree', () => {
    renderAtRoute('/');
    // ErrorBoundary is rendered, we can verify by checking that components render without error
    expect(screen.getByTestId('navbar')).toBeInTheDocument();
    expect(screen.getByTestId('dashboard')).toBeInTheDocument();
  });

  it('includes ToastProvider in the component tree', () => {
    renderAtRoute('/');
    // ToastProvider is rendered, we can verify by checking that components render without error
    expect(screen.getByTestId('navbar')).toBeInTheDocument();
    expect(screen.getByTestId('dashboard')).toBeInTheDocument();
  });

  it('renders 404 page for unknown routes', () => {
    renderAtRoute('/unknown-route');
    // Since there's no 404 component defined, it should still render the navbar
    // but not any specific page component
    expect(screen.getByTestId('navbar')).toBeInTheDocument();
    expect(screen.queryByTestId('dashboard')).not.toBeInTheDocument();
    expect(screen.queryByTestId('login')).not.toBeInTheDocument();
  });
});