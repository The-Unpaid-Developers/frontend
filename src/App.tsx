import { SolutionReviewProvider } from "./context/SolutionReviewContext";
import { Dashboard } from "./components/Dashboard";

function App() {
  return (
    <SolutionReviewProvider>
      <Dashboard />
    </SolutionReviewProvider>
  );
}

export default App;
