import { useState, useCallback } from "react";
import { APIError, ErrorType } from "../types/errors";

interface UseErrorHandlerReturn {
  error: APIError | null;
  isRetrying: boolean;
  clearError: () => void;
  handleError: (error: unknown) => void;
  retryLastAction: () => Promise<void>;
  showErrorToast: (message: string, type?: ErrorType) => void;
}

// interface ErrorToast {
//   id: string;
//   message: string;
//   type: ErrorType;
//   timestamp: number;
// }

/**
 * Custom hook for centralized error handling with retry capabilities
 * @param onRetry - Optional callback function to execute when retrying an action
 * @returns Error handling utilities and state
 */
export const useErrorHandler = (
  onRetry?: () => Promise<void>
): UseErrorHandlerReturn => {
  const [error, setError] = useState<APIError | null>(null);
  const [isRetrying, setIsRetrying] = useState(false);
  const [lastRetryAction] = useState<(() => Promise<void>) | null>(null);

  /**
   * Clear the current error state
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  /**
   * Handle and normalize different types of errors
   * @param error - The error to handle (can be any type)
   */
  const handleError = useCallback((error: unknown) => {
    console.error("Error caught by useErrorHandler:", error);

    if (error instanceof APIError) {
      setError(error);
      return;
    }

    if (error instanceof Error) {
      if (error.name === "TypeError" && error.message.includes("fetch")) {
        setError(APIError.fromNetworkError(error));
        return;
      }

      // Convert generic Error to APIError
      setError(
        new APIError(
          ErrorType.UNKNOWN_ERROR,
          error.message || "An unexpected error occurred",
          error.stack,
          undefined,
          true
        )
      );
      return;
    }

    // Handle non-Error objects
    if (typeof error === "string") {
      setError(
        new APIError(
          ErrorType.UNKNOWN_ERROR,
          error,
          undefined,
          undefined,
          false
        )
      );
      return;
    }

    // Last resort for unknown error types
    setError(
      new APIError(
        ErrorType.UNKNOWN_ERROR,
        "An unexpected error occurred",
        JSON.stringify(error),
        undefined,
        true
      )
    );
  }, []);

  /**
   * Retry the last failed action
   */
  const retryLastAction = useCallback(async () => {
    if (!lastRetryAction && !onRetry) {
      console.warn("No retry action available");
      return;
    }

    setIsRetrying(true);
    clearError();

    try {
      if (lastRetryAction) {
        await lastRetryAction();
      } else if (onRetry) {
        await onRetry();
      }
    } catch (retryError) {
      handleError(retryError);
    } finally {
      setIsRetrying(false);
    }
  }, [lastRetryAction, onRetry, clearError, handleError]);

  /**
   * Show a temporary error toast notification
   * @param message - The error message to display
   * @param type - The type of error (affects styling)
   */
  const showErrorToast = useCallback(
    (message: string, type: ErrorType = ErrorType.UNKNOWN_ERROR) => {
      // Create a temporary error for toast display
      const tempError = new APIError(
        type,
        message,
        undefined,
        undefined,
        false
      );
      setError(tempError);

      // Auto-clear after 5 seconds
      setTimeout(() => {
        setError((current) => (current === tempError ? null : current));
      }, 5000);
    },
    []
  );

  return {
    error,
    isRetrying,
    clearError,
    handleError,
    retryLastAction,
    showErrorToast,
  };
};
