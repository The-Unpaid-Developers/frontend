import { Component } from "react";
import type { ErrorInfo, ReactNode } from "react";
import { Button, Card, CardContent } from "./ui";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

/**
 * Error Boundary component that catches JavaScript errors anywhere in the child component tree,
 * logs those errors, and displays a fallback UI instead of the component tree that crashed.
 */
export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  /**
   * Static method that is called when an error is thrown during rendering
   * @param error - The error that was thrown
   * @returns New state object
   */
  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  /**
   * Called when an error has been thrown by a descendant component
   * @param error - The error that was thrown
   * @param errorInfo - Information about where the error was thrown
   */
  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);

    this.setState({
      error,
      errorInfo,
    });

    // You can also log the error to an error reporting service here
    // logErrorToService(error, errorInfo);
  }

  /**
   * Reset the error boundary state
   */
  private readonly handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  /**
   * Reload the page as a fallback recovery method
   */
  private readonly handleReload = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error UI
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-md">
            <CardContent className="text-center space-y-4">
              <div className="text-red-500 mb-4">
                <svg
                  className="w-16 h-16 mx-auto"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
              </div>

              <h2 className="text-xl font-semibold text-gray-900">
                Something went wrong
              </h2>

              <p className="text-gray-600">
                We encountered an unexpected error. Please try refreshing the
                page or contact support if the problem persists.
              </p>

              {process.env.NODE_ENV === "development" && this.state.error && (
                <details className="text-left bg-gray-100 p-3 rounded text-sm">
                  <summary className="cursor-pointer font-medium text-gray-700 mb-2">
                    Error Details (Development)
                  </summary>
                  <pre className="whitespace-pre-wrap text-red-600">
                    {this.state.error.toString()}
                    {this.state.errorInfo?.componentStack}
                  </pre>
                </details>
              )}

              <div className="flex space-x-3 justify-center">
                <Button variant="secondary" onClick={this.handleReset}>
                  Try Again
                </Button>
                <Button variant="primary" onClick={this.handleReload}>
                  Reload Page
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}
