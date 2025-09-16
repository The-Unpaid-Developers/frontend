import React, { createContext, useContext, useState, useCallback } from 'react';
import { Toast } from '../components/ui/Toast';
import { ErrorType } from '../types/errors';

interface ToastState {
  message: string;
  type: ErrorType;
  isVisible: boolean;
}

interface ToastContextType {
  showToast: (message: string, type: ErrorType) => void;
  showSuccess: (message: string) => void;
  showError: (message: string) => void;
  showInfo: (message: string) => void;
  hideToast: () => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toast, setToast] = useState<ToastState>({
    message: '',
    type: ErrorType.INFO,
    isVisible: false,
  });

  const showToast = useCallback((message: string, type: ErrorType) => {
    setToast({
      message,
      type,
      isVisible: true,
    });
  }, []);

  const hideToast = useCallback(() => {
    setToast(prev => ({
      ...prev,
      isVisible: false,
    }));
  }, []);

  const showSuccess = useCallback((message: string) => {
    showToast(message, ErrorType.SUCCESS);
  }, [showToast]);

  const showError = useCallback((message: string) => {
    showToast(message, ErrorType.SERVER_ERROR);
  }, [showToast]);

  const showInfo = useCallback((message: string) => {
    showToast(message, ErrorType.INFO);
  }, [showToast]);

  const contextValue: ToastContextType = {
    showToast,
    showSuccess,
    showError,
    showInfo,
    hideToast,
  };

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      {/* Global Toast component - appears on every page */}
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={hideToast}
      />
    </ToastContext.Provider>
  );
};

export const useToast = (): ToastContextType => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

// Export individual hooks for convenience (optional)
export const useSuccessToast = () => {
  const { showSuccess } = useToast();
  return showSuccess;
};

export const useErrorToast = () => {
  const { showError } = useToast();
  return showError;
};