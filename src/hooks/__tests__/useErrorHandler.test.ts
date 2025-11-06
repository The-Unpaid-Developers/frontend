import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useErrorHandler } from "../useErrorHandler";
import { APIError, ErrorType } from "../../types/errors";

describe("useErrorHandler Hook", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.clearAllTimers();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("initializes with no error", () => {
    const { result } = renderHook(() => useErrorHandler());

    expect(result.current.error).toBeNull();
    expect(result.current.isRetrying).toBe(false);
  });

  it("handles APIError correctly", () => {
    const { result } = renderHook(() => useErrorHandler());
    const apiError = new APIError(
      ErrorType.VALIDATION_ERROR,
      "Validation failed",
      "Invalid input",
      400,
      false
    );

    act(() => {
      result.current.handleError(apiError);
    });

    expect(result.current.error).toBe(apiError);
    expect(result.current.error?.type).toBe(ErrorType.VALIDATION_ERROR);
    expect(result.current.error?.message).toBe("Validation failed");
  });

  it("converts generic Error to APIError", () => {
    const { result } = renderHook(() => useErrorHandler());
    const genericError = new Error("Generic error message");

    act(() => {
      result.current.handleError(genericError);
    });

    expect(result.current.error).toBeInstanceOf(APIError);
    expect(result.current.error?.message).toBe("Generic error message");
    expect(result.current.error?.type).toBe(ErrorType.UNKNOWN_ERROR);
  });

  it("converts generic Error without message to APIError with default message", () => {
    const { result } = renderHook(() => useErrorHandler());
    const genericError = new Error();
    // Set message to undefined to cover the ?? branch
    (genericError as any).message = undefined;

    act(() => {
      result.current.handleError(genericError);
    });

    expect(result.current.error).toBeInstanceOf(APIError);
    expect(result.current.error?.message).toBe("An unexpected error occurred");
    expect(result.current.error?.type).toBe(ErrorType.UNKNOWN_ERROR);
  });

  it("handles network errors specifically", () => {
    const { result } = renderHook(() => useErrorHandler());
    const networkError = new TypeError("Failed to fetch");

    act(() => {
      result.current.handleError(networkError);
    });

    expect(result.current.error?.type).toBe(ErrorType.NETWORK_ERROR);
    expect(result.current.error?.message).toContain(
      "Network connection failed"
    );
    expect(result.current.error?.retryable).toBe(true);
  });

  it("handles string errors", () => {
    const { result } = renderHook(() => useErrorHandler());

    act(() => {
      result.current.handleError("String error message");
    });

    expect(result.current.error?.message).toBe("String error message");
    expect(result.current.error?.type).toBe(ErrorType.UNKNOWN_ERROR);
  });

  it("handles unknown error types", () => {
    const { result } = renderHook(() => useErrorHandler());

    act(() => {
      result.current.handleError({ unknown: "object" });
    });

    expect(result.current.error?.message).toBe("An unexpected error occurred");
    expect(result.current.error?.type).toBe(ErrorType.UNKNOWN_ERROR);
  });

  it("clears error state", () => {
    const { result } = renderHook(() => useErrorHandler());

    act(() => {
      result.current.handleError("Test error");
    });

    expect(result.current.error).not.toBeNull();

    act(() => {
      result.current.clearError();
    });

    expect(result.current.error).toBeNull();
  });

  it("executes retry action successfully", async () => {
    const mockRetry = vi.fn().mockResolvedValue(undefined);
    const { result } = renderHook(() => useErrorHandler(mockRetry));

    act(() => {
      result.current.handleError("Test error");
    });

    expect(result.current.error).not.toBeNull();

    await act(async () => {
      await result.current.retryLastAction();
    });

    expect(mockRetry).toHaveBeenCalledTimes(1);
    expect(result.current.error).toBeNull();
    expect(result.current.isRetrying).toBe(false);
  });

  it("handles retry action failure", async () => {
    const retryError = new Error("Retry failed");
    const mockRetry = vi.fn().mockRejectedValue(retryError);
    const { result } = renderHook(() => useErrorHandler(mockRetry));

    await act(async () => {
      await result.current.retryLastAction();
    });

    expect(mockRetry).toHaveBeenCalledTimes(1);
    expect(result.current.error?.message).toBe("Retry failed");
    expect(result.current.isRetrying).toBe(false);
  });

  it("sets isRetrying flag during retry", async () => {
    let resolveRetry: () => void;
    const retryPromise = new Promise<void>((resolve) => {
      resolveRetry = resolve;
    });
    const mockRetry = vi.fn().mockReturnValue(retryPromise);

    const { result } = renderHook(() => useErrorHandler(mockRetry));

    // Start retry but don't await it yet
    act(() => {
      result.current.retryLastAction();
    });

    // Check that isRetrying is true during the retry
    expect(result.current.isRetrying).toBe(true);

    // Resolve the retry
    act(() => {
      resolveRetry!();
    });

    // Wait for the retry to complete
    await vi.waitFor(() => {
      expect(result.current.isRetrying).toBe(false);
    });
  });

  it("shows error toast and auto-clears after timeout", () => {
    const { result } = renderHook(() => useErrorHandler());

    if (result.current) {
      act(() => {
        result.current.showErrorToast(
          "Toast message",
          ErrorType.VALIDATION_ERROR
        );
      });

      expect(result.current.error?.message).toBe("Toast message");
      expect(result.current.error?.type).toBe(ErrorType.VALIDATION_ERROR);

      // Fast-forward time to trigger auto-clear
      act(() => {
        vi.advanceTimersByTime(5000);
      });

      expect(result.current.error).toBeNull();
    }
  });

  it("does not auto-clear error if a different error is set", () => {
    const { result } = renderHook(() => useErrorHandler());

    if (result.current) {
      act(() => {
        result.current.showErrorToast("Toast message");
      });

      act(() => {
        result.current.handleError("Different error");
      });

      // Fast-forward time
      act(() => {
        vi.advanceTimersByTime(5000);
      });

      // Should still have the different error, not cleared
      expect(result.current.error?.message).toBe("Different error");
    }
  });

  it("logs errors to console", () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    const { result } = renderHook(() => useErrorHandler());

    if (result.current) {
      act(() => {
        result.current.handleError("Test error");
      });

      expect(consoleSpy).toHaveBeenCalledWith(
        "Error caught by useErrorHandler:",
        "Test error"
      );
    }

    consoleSpy.mockRestore();
  });

  it("warns when retryLastAction is called without any retry action", async () => {
    const { result } = renderHook(() => useErrorHandler());
    const consoleSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

    if (result.current) {
      await act(async () => {
        await result.current.retryLastAction();
      });

      expect(consoleSpy).toHaveBeenCalledWith("No retry action available");
    }

    consoleSpy.mockRestore();
  });
});
