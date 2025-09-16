import { Routes, Route, BrowserRouter } from 'react-router-dom'
// import { SolutionReviewProvider } from "./context/SolutionReviewContext";
import { Dashboard } from "./components/Dashboard";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { CreateSolutionReviewPage } from "./components/CreateSolutionReview/CreateSolutionReviewPage";
import { UpdateSolutionReviewPage } from "./components/UpdateSolutionReview/UpdateSolutionReviewPage";
import { SystemDetailPage } from "./components/SystemDetail/SystemDetailPage";
import { SolutionReviewDetailPage } from "./components/SolutionReviewDetail/SolutionReviewDetailPage"
import { Login } from "./components/Authentication/Login";
import { ToastProvider } from './context/ToastContext';

function App() {
  return (
    <ToastProvider>
      <BrowserRouter>
        <ErrorBoundary>
          {/* <SolutionReviewProvider> */}
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/create-solution-review" element={<CreateSolutionReviewPage />} />
              <Route path="/update-solution-review/:id" element={<UpdateSolutionReviewPage />} />
              <Route path="/view-system-detail/:systemCode" element={<SystemDetailPage />} />
              <Route path="/view-solution-review/:id" element={<SolutionReviewDetailPage />} />
              <Route path="/login" element={<Login />} />
              {/* Add more routes as needed */}
            </Routes>
          {/* </SolutionReviewProvider> */}
        </ErrorBoundary>
      </BrowserRouter>
    </ToastProvider>
  )
}

export default App;