import { Routes, Route, BrowserRouter } from 'react-router-dom'
import { Dashboard } from "./components/Dashboard";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { CreateSolutionReviewPage } from "./components/SolutionReviews/CreateSolutionReview/CreateSolutionReviewPage";
import { UpdateSolutionReviewPage } from "./components/SolutionReviews/UpdateSolutionReview/UpdateSolutionReviewPage";
import { SystemDetailPage } from "./components/SolutionReviews/SolutionReviewDetail/SystemDetailPage";
import { SolutionReviewDetailPage } from "./components/SolutionReviews/SolutionReviewDetail/SolutionReviewDetailPage"
import { Login } from "./components/Authentication/Login";
import { AdminPanel } from "./components/AdminPanel";
import { ToastProvider } from './context/ToastContext';
import { Navbar } from './components/ui';
import SankeyVisualization from './components/Diagrams/DependenciesFlow/SpecificSystem/SpecificSystemVisualization';
import PathSankeyVisualization from './components/Diagrams/DependenciesFlow/PathBetweenSystems/PathSankeyVisualization';
import OverallSystemsNewVisualization from './components/Diagrams/DependenciesFlow/OverallSystems/OverallSystemsVisualization';
import { BusinessCapabilitiesVisualization } from './components/Diagrams/BusinessCapabilities';
import { CreateQueryPage } from './components/Query/CreateQueryPage';
import { QueryDetailPage } from './components/Query/QueryDetailPage';
import { ExecuteQueryResultPage } from './components/Query/ExecuteQueryResultPage';
import { ViewAllQueriesPage } from './components/Query/ViewAllQueriesPage';

function App() {

  return (
    <ToastProvider>
      <BrowserRouter>
        <ErrorBoundary>
          <Navbar/>
          {/* <SolutionReviewProvider> */}
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/create-solution-review" element={<CreateSolutionReviewPage />} />
              <Route path="/update-solution-review/:id" element={<UpdateSolutionReviewPage />} />
              <Route path="/view-system-detail/:systemCode" element={<SystemDetailPage />} />
              <Route path="/view-solution-review/:id" element={<SolutionReviewDetailPage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/admin" element={<AdminPanel />} />
              <Route path="/view-system-flow-diagram/:systemCode" element={<SankeyVisualization />} />
              <Route path="/view-overall-systems-diagram" element={<OverallSystemsNewVisualization />} />
              <Route path="/view-paths-between-systems" element={<PathSankeyVisualization />} />
              <Route path="/view-business-capabilities/:systemCode?" element={<BusinessCapabilitiesVisualization />} />
              <Route path="/create-query" element={<CreateQueryPage />} />
              <Route path="/view-query/:queryName" element={<QueryDetailPage />} />
              <Route path="/execute-query/:queryName" element={<ExecuteQueryResultPage />} />
              <Route path="/view-queries" element={<ViewAllQueriesPage />} />
              {/* Add more routes as needed */}
            </Routes>
          {/* </SolutionReviewProvider> */}
        </ErrorBoundary>
      </BrowserRouter>
    </ToastProvider>
  )
}

export default App;