import { SolutionReviewProvider } from "./context/SolutionReviewContext";
import { Dashboard } from "./components/Dashboard";
import { ErrorBoundary } from "./components/ErrorBoundary";

function App() {
  return (
    <ErrorBoundary>
      <SolutionReviewProvider>
        <Dashboard />
      </SolutionReviewProvider>
    </ErrorBoundary>
  );
}

export default App;
