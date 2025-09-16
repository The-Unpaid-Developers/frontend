import React, { useEffect, useState, useCallback } from "react";
import { ErrorType } from "../../types/errors";

interface ToastProps {
  message: string;
  type: ErrorType;
  isVisible: boolean;
  onClose: () => void;
  autoCloseDelay?: number;
}

/**
 * Toast notification component for displaying temporary messages
 * @param message - The message to display
 * @param type - The type of message (affects styling)
 * @param isVisible - Whether the toast should be visible
 * @param onClose - Callback when toast is closed
 * @param autoCloseDelay - Auto-close delay in milliseconds (default: 5000)
 */
export const Toast: React.FC<ToastProps> = ({
  message,
  type,
  isVisible,
  onClose,
  autoCloseDelay = 5000,
}) => {
  const [isAnimatingOut, setIsAnimatingOut] = useState(false);

  const handleClose = useCallback(() => {
    setIsAnimatingOut(true);
    setTimeout(() => {
      onClose();
      setIsAnimatingOut(false);
    }, 300); // Animation duration
  }, [onClose]);

  useEffect(() => {
    if (!isVisible) return;

    const timer = setTimeout(() => {
      handleClose();
    }, autoCloseDelay);

    return () => clearTimeout(timer);
  }, [isVisible, autoCloseDelay, handleClose]);

  /**
   * Handle toast close with animation
   */

  /**
   * Get toast styling based on error type
   */
  const getToastStyles = () => {
    const baseClasses =
      "flex items-start p-4 rounded-lg shadow-lg border max-w-md";

    switch (type) {
      case ErrorType.VALIDATION_ERROR:
        return `${baseClasses} bg-yellow-50 border-yellow-200 text-yellow-800`;
      case ErrorType.NETWORK_ERROR:
      case ErrorType.SERVER_ERROR:
        return `${baseClasses} bg-red-50 border-red-200 text-red-800`;
      case ErrorType.PERMISSION_ERROR:
        return `${baseClasses} bg-orange-50 border-orange-200 text-orange-800`;
      case ErrorType.NOT_FOUND_ERROR:
        return `${baseClasses} bg-blue-50 border-blue-200 text-blue-800`;
      case ErrorType.SUCCESS:
  return `${baseClasses} bg-green-50 border-green-200 text-green-800`;
case ErrorType.INFO:
  return `${baseClasses} bg-blue-50 border-blue-200 text-blue-800`;
      default:
        return `${baseClasses} bg-gray-50 border-gray-200 text-gray-800`;
    }
  };

  /**
   * Get icon for error type
   */
  const getIcon = () => {
    const iconClasses = "w-5 h-5 mr-3 mt-0.5 flex-shrink-0";

    switch (type) {
      case ErrorType.VALIDATION_ERROR:
        return (
          <svg
            className={`${iconClasses} text-yellow-500`}
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
        );
      case ErrorType.NETWORK_ERROR:
      case ErrorType.SERVER_ERROR:
        return (
          <svg
            className={`${iconClasses} text-red-500`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        );
      case ErrorType.PERMISSION_ERROR:
        return (
          <svg
            className={`${iconClasses} text-orange-500`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 15v2m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
            />
          </svg>
        );
      case ErrorType.SUCCESS:
        return (
          <svg
            className={`${iconClasses} text-green-500`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        );
      case ErrorType.INFO:
        return (
          <svg
            className={`${iconClasses} text-blue-500`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        );
      default:
        return (
          <svg
            className={`${iconClasses} text-blue-500`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        );
    }
  };

  if (!isVisible) return null;

  return (
    <div
      className={`fixed top-4 right-4 z-50 transition-all duration-300 transform ${
        isAnimatingOut
          ? "translate-x-full opacity-0"
          : "translate-x-0 opacity-100"
      }`}
    >
      <div className={getToastStyles()}>
        {getIcon()}
        <div className="flex-1">
          <p className="font-medium">{getErrorTypeLabel(type)}</p>
          <p className="text-sm mt-1">{message}</p>
        </div>
        <button
          onClick={handleClose}
          className="ml-4 text-current hover:opacity-70 focus:outline-none focus:ring-2 focus:ring-current rounded"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

/**
 * Get user-friendly label for error type
 */
const getErrorTypeLabel = (type: ErrorType): string => {
  switch (type) {
    case ErrorType.VALIDATION_ERROR:
      return "Validation Error";
    case ErrorType.NETWORK_ERROR:
      return "Network Error";
    case ErrorType.SERVER_ERROR:
      return "Server Error";
    case ErrorType.PERMISSION_ERROR:
      return "Permission Error";
    case ErrorType.NOT_FOUND_ERROR:
      return "Not Found";
    case ErrorType.SUCCESS:
      return "Success";
    case ErrorType.INFO:
      return "Info";
    default:
      return "Error";
  }
};
