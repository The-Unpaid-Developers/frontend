import { Routes, Route, BrowserRouter } from 'react-router-dom'
import { SolutionReviewProvider } from "./context/SolutionReviewContext";
import { Dashboard } from "./components/Dashboard";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { CreateSolutionReviewPage } from "./components/CreateSolutionReview/CreateSolutionReviewPage";
import { UpdateSolutionReviewPage } from "./components/UpdateSolutionReview/UpdateSolutionReviewPage";

function App() {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <SolutionReviewProvider>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/create-solution-review" element={<CreateSolutionReviewPage />} />
            <Route path="/update-solution-review/:id" element={<UpdateSolutionReviewPage />} />
            {/* Add more routes as needed */}
          </Routes>
        </SolutionReviewProvider>
      </ErrorBoundary>
    </BrowserRouter>
  )
}

export default App;