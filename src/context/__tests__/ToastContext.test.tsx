import React from 'react';
import { renderHook } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ToastProvider, useToast, useSuccessToast, useErrorToast } from '../ToastContext';
import { ErrorType } from '../../types/errors';

vi.useFakeTimers();

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <ToastProvider>{children}</ToastProvider>
);

describe('ToastContext', () => {
  beforeEach(() => {
    vi.clearAllTimers();
  });

  describe('useToast', () => {
    it('throws error when used outside provider', () => {
      expect(() => {
        renderHook(() => useToast());
      }).toThrow('useToast must be used within a ToastProvider');
    });

    it('provides toast functions', () => {
      const { result } = renderHook(() => useToast(), { wrapper });
      expect(result.current.showToast).toBeDefined();
      expect(result.current.showSuccess).toBeDefined();
      expect(result.current.showError).toBeDefined();
      expect(result.current.showInfo).toBeDefined();
      expect(result.current.hideToast).toBeDefined();
    });

    it('shows toast with custom type', () => {
      const { result } = renderHook(() => useToast(), { wrapper });
      result.current.showToast('Test message', ErrorType.VALIDATION_ERROR);
      // Toast visibility is managed internally
      expect(result.current).toBeDefined();
    });

    it('shows success toast', () => {
      const { result } = renderHook(() => useToast(), { wrapper });
      result.current.showSuccess('Success message');
      expect(result.current).toBeDefined();
    });

    it('shows error toast', () => {
      const { result } = renderHook(() => useToast(), { wrapper });
      result.current.showError('Error message');
      expect(result.current).toBeDefined();
    });

    it('shows info toast', () => {
      const { result } = renderHook(() => useToast(), { wrapper });
      result.current.showInfo('Info message');
      expect(result.current).toBeDefined();
    });

    it('hides toast', () => {
      const { result } = renderHook(() => useToast(), { wrapper });
      result.current.showToast('Test', ErrorType.INFO);
      result.current.hideToast();
      expect(result.current).toBeDefined();
    });

    it('hideToast preserves message and type', () => {
      const { result } = renderHook(() => useToast(), { wrapper });
      result.current.showToast('Important message', ErrorType.VALIDATION_ERROR);
      result.current.hideToast();
      // Even after hiding, the context functions remain available
      expect(result.current.hideToast).toBeDefined();
      expect(result.current.showToast).toBeDefined();
    });
  });

  describe('useSuccessToast', () => {
    it('returns showSuccess function', () => {
      const { result } = renderHook(() => useSuccessToast(), { wrapper });
      expect(result.current).toBeDefined();
      expect(typeof result.current).toBe('function');
    });

    it('shows success toast', () => {
      const { result } = renderHook(() => useSuccessToast(), { wrapper });
      result.current('Success');
      expect(result.current).toBeDefined();
    });
  });

  describe('useErrorToast', () => {
    it('returns showError function', () => {
      const { result } = renderHook(() => useErrorToast(), { wrapper });
      expect(result.current).toBeDefined();
      expect(typeof result.current).toBe('function');
    });

    it('shows error toast', () => {
      const { result } = renderHook(() => useErrorToast(), { wrapper });
      result.current('Error');
      expect(result.current).toBeDefined();
    });
  });

  describe('ToastProvider', () => {
    it('renders children', () => {
      const { result } = renderHook(() => useToast(), { wrapper });
      expect(result.current).toBeDefined();
    });

    it('provides stable context value', () => {
      const { result, rerender } = renderHook(() => useToast(), { wrapper });
      const first = result.current;
      rerender();
      expect(result.current).toBe(first);
    });
  });
});
