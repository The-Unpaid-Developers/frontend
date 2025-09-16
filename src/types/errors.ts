/**
 * Custom error types for the application
 */

const ErrorType = {
  NETWORK_ERROR: "NETWORK_ERROR",
  VALIDATION_ERROR: "VALIDATION_ERROR",
  PERMISSION_ERROR: "PERMISSION_ERROR",
  NOT_FOUND_ERROR: "NOT_FOUND_ERROR",
  SERVER_ERROR: "SERVER_ERROR",
  UNKNOWN_ERROR: "UNKNOWN_ERROR",
  SUCCESS: 'SUCCESS',
  INFO: 'INFO',
} as const;

export type ErrorType = (typeof ErrorType)[keyof typeof ErrorType];
export { ErrorType };

export interface AppError {
  type: ErrorType;
  message: string;
  details?: string;
  code?: string | number;
  retryable?: boolean;
}

export class APIError extends Error implements AppError {
  type: ErrorType;
  details?: string;
  code?: string | number;
  retryable: boolean;

  constructor(
    type: ErrorType,
    message: string,
    details?: string,
    code?: string | number,
    retryable: boolean = false
  ) {
    super(message);
    this.name = "APIError";
    this.type = type;
    this.details = details;
    this.code = code;
    this.retryable = retryable;
  }

  static fromResponse(response: Response, details?: string): APIError {
    const { status } = response;

    if (status >= 500) {
      return new APIError(
        ErrorType.SERVER_ERROR,
        "Server error occurred. Please try again later.",
        details,
        status,
        true
      );
    }

    if (status === 404) {
      return new APIError(
        ErrorType.NOT_FOUND_ERROR,
        "The requested resource was not found.",
        details,
        status,
        false
      );
    }

    if (status === 403) {
      return new APIError(
        ErrorType.PERMISSION_ERROR,
        "You do not have permission to perform this action.",
        details,
        status,
        false
      );
    }

    if (status >= 400) {
      return new APIError(
        ErrorType.VALIDATION_ERROR,
        "Invalid request. Please check your input.",
        details,
        status,
        false
      );
    }

    return new APIError(
      ErrorType.UNKNOWN_ERROR,
      "An unexpected error occurred.",
      details,
      status,
      true
    );
  }

  static fromNetworkError(error: Error): APIError {
    return new APIError(
      ErrorType.NETWORK_ERROR,
      "Network connection failed. Please check your internet connection.",
      error.message,
      undefined,
      true
    );
  }
}
