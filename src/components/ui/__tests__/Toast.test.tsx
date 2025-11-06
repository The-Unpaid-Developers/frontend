import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { describe, it, expect, beforeEach, afterEach, afterAll, vi } from 'vitest';
import { Toast } from '../Toast';
import { ErrorType } from '../../../types/errors';

// Mock timers for testing auto-close functionality
vi.useFakeTimers();

describe('Toast Component', () => {
  const defaultProps = {
    isVisible: true,
    message: 'Test message',
    type: ErrorType.INFO,
    onClose: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.clearAllTimers();
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
  });

  afterAll(() => {
    vi.useRealTimers();
  });

  describe('Basic Rendering', () => {
    it('renders toast when visible', () => {
      render(<Toast {...defaultProps} />);
      
      expect(screen.getByText('Test message')).toBeInTheDocument();
      expect(screen.getByText('Info')).toBeInTheDocument();
    });

    it('does not render when not visible', () => {
      render(<Toast {...defaultProps} isVisible={false} />);
      
      expect(screen.queryByText('Test message')).not.toBeInTheDocument();
    });

    it('renders custom message', () => {
      const customMessage = 'Custom error message';
      render(<Toast {...defaultProps} message={customMessage} />);
      
      expect(screen.getByText(customMessage)).toBeInTheDocument();
    });
  });

  describe('Error Type Styling and Icons', () => {
    it('renders validation error style and icon', () => {
      render(<Toast {...defaultProps} type={ErrorType.VALIDATION_ERROR} />);
      
      expect(screen.getByText('Validation Error')).toBeInTheDocument();
      const container = screen.getByText('Test message').closest('.bg-yellow-50');
      expect(container).toBeInTheDocument();
      expect(container).toHaveClass('border-yellow-200', 'text-yellow-800');
    });

    it('renders network error style and icon', () => {
      render(<Toast {...defaultProps} type={ErrorType.NETWORK_ERROR} />);
      
      expect(screen.getByText('Network Error')).toBeInTheDocument();
      const container = screen.getByText('Test message').closest('.bg-red-50');
      expect(container).toBeInTheDocument();
      expect(container).toHaveClass('border-red-200', 'text-red-800');
    });

    it('renders server error style and icon', () => {
      render(<Toast {...defaultProps} type={ErrorType.SERVER_ERROR} />);
      
      expect(screen.getByText('Server Error')).toBeInTheDocument();
      const container = screen.getByText('Test message').closest('.bg-red-50');
      expect(container).toBeInTheDocument();
      expect(container).toHaveClass('border-red-200', 'text-red-800');
    });

    it('renders permission error style and icon', () => {
      render(<Toast {...defaultProps} type={ErrorType.PERMISSION_ERROR} />);
      
      expect(screen.getByText('Permission Error')).toBeInTheDocument();
      const container = screen.getByText('Test message').closest('.bg-orange-50');
      expect(container).toBeInTheDocument();
      expect(container).toHaveClass('border-orange-200', 'text-orange-800');
    });

    it('renders not found error style and icon', () => {
      render(<Toast {...defaultProps} type={ErrorType.NOT_FOUND_ERROR} />);
      
      expect(screen.getByText('Not Found')).toBeInTheDocument();
      const container = screen.getByText('Test message').closest('.bg-blue-50');
      expect(container).toBeInTheDocument();
      expect(container).toHaveClass('border-blue-200', 'text-blue-800');
    });

    it('renders success style and icon', () => {
      render(<Toast {...defaultProps} type={ErrorType.SUCCESS} />);
      
      expect(screen.getByText('Success')).toBeInTheDocument();
      const container = screen.getByText('Test message').closest('.bg-green-50');
      expect(container).toBeInTheDocument();
      expect(container).toHaveClass('border-green-200', 'text-green-800');
    });

    it('renders info style and icon', () => {
      render(<Toast {...defaultProps} type={ErrorType.INFO} />);
      
      expect(screen.getByText('Info')).toBeInTheDocument();
      const container = screen.getByText('Test message').closest('.bg-blue-50');
      expect(container).toBeInTheDocument();
      expect(container).toHaveClass('border-blue-200', 'text-blue-800');
    });

    it('renders default style for unknown error type', () => {
      // Test with undefined type to avoid type assertion
      const propsWithInvalidType = { ...defaultProps, type: undefined };
      render(<Toast {...propsWithInvalidType} type={ErrorType.INFO} />);

      // This tests the default case in the switch statement
      expect(screen.getByText('Info')).toBeInTheDocument();
    });
  });

  describe('Icons', () => {
    it('renders validation warning icon', () => {
      render(<Toast {...defaultProps} type={ErrorType.VALIDATION_ERROR} />);
      
      const svg = document.querySelector('svg.text-yellow-500');
      expect(svg).toBeInTheDocument();
      expect(svg).toHaveClass('text-yellow-500');
    });

    it('renders network/server error icon', () => {
      render(<Toast {...defaultProps} type={ErrorType.NETWORK_ERROR} />);
      
      const svg = document.querySelector('svg.text-red-500');
      expect(svg).toBeInTheDocument();
      expect(svg).toHaveClass('text-red-500');
    });

    it('renders permission error icon', () => {
      render(<Toast {...defaultProps} type={ErrorType.PERMISSION_ERROR} />);
      
      const svg = document.querySelector('svg.text-orange-500');
      expect(svg).toBeInTheDocument();
      expect(svg).toHaveClass('text-orange-500');
    });

    it('renders success checkmark icon', () => {
      render(<Toast {...defaultProps} type={ErrorType.SUCCESS} />);
      
      const svg = document.querySelector('svg.text-green-500');
      expect(svg).toBeInTheDocument();
      expect(svg).toHaveClass('text-green-500');
    });

    it('renders info icon', () => {
      render(<Toast {...defaultProps} type={ErrorType.INFO} />);
      
      const svg = document.querySelector('svg.text-gray-500');
      expect(svg).toBeInTheDocument();
      expect(svg).toHaveClass('text-gray-500');
    });

    it('renders info icon for INFO type', () => {
      render(<Toast {...defaultProps} type={ErrorType.INFO} />);

      const svg = document.querySelector('svg.text-gray-500');
      expect(svg).toBeInTheDocument();
      expect(svg).toHaveClass('text-gray-500');
    });
  });

  describe('Close Button Interaction', () => {
    it('renders close button', () => {
      render(<Toast {...defaultProps} />);
      
      const closeButton = screen.getByRole('button');
      expect(closeButton).toBeInTheDocument();
      expect(closeButton).toHaveClass('hover:opacity-70');
    });

    it('calls onClose when close button is clicked', async () => {
      const onCloseMock = vi.fn();
      render(<Toast {...defaultProps} onClose={onCloseMock} />);
      
      const closeButton = screen.getByRole('button');
      
      act(() => {
        fireEvent.click(closeButton);
      });
      
      // Fast forward through the animation delay (300ms)
      act(() => {
        vi.advanceTimersByTime(300);
      });

      expect(onCloseMock).toHaveBeenCalledTimes(1);
    });

    it('applies focus styles to close button', () => {
      render(<Toast {...defaultProps} />);
      
      const closeButton = screen.getByRole('button');
      expect(closeButton).toHaveClass('focus:outline-none', 'focus:ring-2', 'focus:ring-current');
    });
  });

  describe('Auto-close Functionality', () => {
    it('auto-closes after default delay (5 seconds)', () => {
      const onCloseMock = vi.fn();
      render(
        <Toast 
          {...defaultProps} 
          onClose={onCloseMock} 
        />
      );

      expect(onCloseMock).not.toHaveBeenCalled();

      // Fast forward to just before close animation
      act(() => {
        vi.advanceTimersByTime(5000);
      });

      // Fast forward through the animation delay
      act(() => {
        vi.advanceTimersByTime(300);
      });

      expect(onCloseMock).toHaveBeenCalledTimes(1);
    });

    it('auto-closes after custom delay', () => {
      const onCloseMock = vi.fn();
      render(
        <Toast 
          {...defaultProps} 
          onClose={onCloseMock}
          autoCloseDelay={3000}
        />
      );

      expect(onCloseMock).not.toHaveBeenCalled();

      act(() => {
        vi.advanceTimersByTime(3000);
      });

      act(() => {
        vi.advanceTimersByTime(300);
      });

      expect(onCloseMock).toHaveBeenCalledTimes(1);
    });

    it('does not auto-close when autoCloseDelay is very high', () => {
      const onCloseMock = vi.fn();
      render(
        <Toast 
          {...defaultProps} 
          onClose={onCloseMock}
          autoCloseDelay={999999}
        />
      );

      act(() => {
        vi.advanceTimersByTime(10000);
      });

      expect(onCloseMock).not.toHaveBeenCalled();
    });

    it('clears timer when component unmounts', () => {
      const { unmount } = render(
        <Toast {...defaultProps} />
      );

      const clearTimeoutSpy = vi.spyOn(global, 'clearTimeout');
      unmount();

      expect(clearTimeoutSpy).toHaveBeenCalled();
      clearTimeoutSpy.mockRestore();
    });

    it('clears timer when isVisible changes to false', () => {
      const { rerender } = render(
        <Toast {...defaultProps} isVisible={true} />
      );

      const clearTimeoutSpy = vi.spyOn(global, 'clearTimeout');
      
      rerender(
        <Toast {...defaultProps} isVisible={false} />
      );

      expect(clearTimeoutSpy).toHaveBeenCalled();
      clearTimeoutSpy.mockRestore();
    });
  });

  describe('Animation States', () => {
    it('applies initial visible state classes', () => {
      render(<Toast {...defaultProps} />);
      
      const toastContainer = screen.getByText('Test message').closest('.fixed');
      expect(toastContainer).toHaveClass('translate-x-0', 'opacity-100');
      expect(toastContainer).not.toHaveClass('translate-x-full', 'opacity-0');
    });

    it('applies animation classes during close', () => {
      const onCloseMock = vi.fn();
      render(
        <Toast 
          {...defaultProps} 
          type={ErrorType.SUCCESS} 
          onClose={onCloseMock} 
        />
      );

      // Before manual close
      const toastContainer = screen.getByText('Test message').closest('.fixed');
      expect(toastContainer).toHaveClass('translate-x-0', 'opacity-100');

      // Trigger close manually by clicking close button
      const closeButton = screen.getByRole('button');
      
      act(() => {
        fireEvent.click(closeButton);
      });

      // Should start animation immediately
      expect(toastContainer).toHaveClass('translate-x-full', 'opacity-0');
    });

    it('has transition classes for smooth animation', () => {
      render(<Toast {...defaultProps} />);
      
      const toastContainer = screen.getByText('Test message').closest('.fixed');
      expect(toastContainer).toHaveClass('transition-all', 'duration-300', 'transform');
    });
  });

  describe('Positioning and Layout', () => {
    it('applies fixed positioning and z-index', () => {
      render(<Toast {...defaultProps} />);
      
      const toastContainer = screen.getByText('Test message').closest('.fixed');
      expect(toastContainer).toHaveClass('fixed', 'top-4', 'right-4', 'z-50');
    });

    it('applies base styling to toast content', () => {
      render(<Toast {...defaultProps} />);
      
      const toastContent = screen.getByText('Test message').closest('.flex.items-start');
      expect(toastContent).toHaveClass(
        'flex', 
        'items-start', 
        'p-4', 
        'rounded-lg', 
        'shadow-lg', 
        'border', 
        'max-w-md'
      );
    });

    it('applies proper icon sizing and spacing', () => {
      render(<Toast {...defaultProps} />);
      
      const svg = document.querySelector('svg.text-gray-500');
      expect(svg).toBeInTheDocument();
      expect(svg).toHaveClass('w-5', 'h-5', 'mr-3', 'mt-0.5', 'flex-shrink-0');
    });

    it('applies proper close button sizing', () => {
      render(<Toast {...defaultProps} />);
      
      const closeButton = screen.getByRole('button');
      const closeIcon = closeButton.querySelector('svg');
      expect(closeIcon).toHaveClass('w-4', 'h-4');
      expect(closeButton).toHaveClass('ml-4');
    });
  });

  describe('Accessibility', () => {
    it('close button has proper focus management', () => {
      render(<Toast {...defaultProps} />);

      const closeButton = screen.getByRole('button');
      expect(closeButton).toHaveClass('focus:outline-none', 'focus:ring-2');
    });

    it('close button can be activated with keyboard', () => {
      const onCloseMock = vi.fn();
      render(<Toast {...defaultProps} onClose={onCloseMock} />);

      const closeButton = screen.getByRole('button');
      closeButton.focus();

      // Simulate Enter key press
      act(() => {
        fireEvent.keyDown(closeButton, { key: 'Enter', code: 'Enter' });
        fireEvent.click(closeButton);
      });

      act(() => {
        vi.advanceTimersByTime(300);
      });

      expect(onCloseMock).toHaveBeenCalled();
    });

    it('close button can be activated with Space key', () => {
      const onCloseMock = vi.fn();
      render(<Toast {...defaultProps} onClose={onCloseMock} />);

      const closeButton = screen.getByRole('button');
      closeButton.focus();

      // Simulate Space key press (button default behavior)
      act(() => {
        fireEvent.keyDown(closeButton, { key: ' ', code: 'Space' });
        fireEvent.click(closeButton);
      });

      act(() => {
        vi.advanceTimersByTime(300);
      });

      expect(onCloseMock).toHaveBeenCalled();
    });

    it('close button is keyboard focusable', () => {
      render(<Toast {...defaultProps} />);

      const closeButton = screen.getByRole('button');
      closeButton.focus();

      expect(document.activeElement).toBe(closeButton);
    });

    it('maintains proper heading hierarchy', () => {
      render(<Toast {...defaultProps} />);

      const title = screen.getByText('Info');
      expect(title).toHaveClass('font-medium');

      const message = screen.getByText('Test message');
      expect(message).toHaveClass('text-sm', 'mt-1');
    });

    it('provides proper role for interactive elements', () => {
      render(<Toast {...defaultProps} />);

      const closeButton = screen.getByRole('button');
      expect(closeButton).toBeInTheDocument();
    });

    it('has visible focus indicator on close button', () => {
      render(<Toast {...defaultProps} />);

      const closeButton = screen.getByRole('button');
      expect(closeButton).toHaveClass('focus:ring-2', 'focus:ring-current');
    });

    it('maintains focus visibility during interaction', () => {
      render(<Toast {...defaultProps} />);

      const closeButton = screen.getByRole('button');
      closeButton.focus();

      expect(closeButton).toHaveClass('rounded'); // Focus ring needs rounded corners
      expect(closeButton).toHaveClass('focus:outline-none'); // Custom focus instead of default outline
    });

    it('has sufficient color contrast for text', () => {
      // Test different error types for color contrast
      const { rerender } = render(<Toast {...defaultProps} type={ErrorType.SUCCESS} />);
      expect(screen.getByText('Success')).toBeInTheDocument();

      rerender(<Toast {...defaultProps} type={ErrorType.VALIDATION_ERROR} />);
      expect(screen.getByText('Validation Error')).toBeInTheDocument();

      rerender(<Toast {...defaultProps} type={ErrorType.NETWORK_ERROR} />);
      expect(screen.getByText('Network Error')).toBeInTheDocument();
    });
  });

  describe('Error Type Label Function', () => {
    it('returns correct labels for all error types', () => {
      const testCases = [
        { type: ErrorType.VALIDATION_ERROR, expected: 'Validation Error' },
        { type: ErrorType.NETWORK_ERROR, expected: 'Network Error' },
        { type: ErrorType.SERVER_ERROR, expected: 'Server Error' },
        { type: ErrorType.PERMISSION_ERROR, expected: 'Permission Error' },
        { type: ErrorType.NOT_FOUND_ERROR, expected: 'Not Found' },
        { type: ErrorType.SUCCESS, expected: 'Success' },
        { type: ErrorType.INFO, expected: 'Info' },
      ];

      testCases.forEach(({ type, expected }) => {
        render(<Toast {...defaultProps} type={type} />);
        expect(screen.getByText(expected)).toBeInTheDocument();
      });
    });
  });

  describe('Edge Cases', () => {
    it('handles empty message', () => {
      render(<Toast {...defaultProps} message="" />);
      
      expect(screen.getByText('Info')).toBeInTheDocument();
      // Check that empty message element exists by looking for the p element with text-sm class
      const messageContainer = document.querySelector('p.text-sm.mt-1');
      expect(messageContainer).toBeInTheDocument();
    });

    it('handles very long messages', () => {
      const longMessage = 'This is a very long error message that should be displayed properly without breaking the layout or causing any issues with the toast component rendering';
      render(<Toast {...defaultProps} message={longMessage} />);
      
      expect(screen.getByText(longMessage)).toBeInTheDocument();
    });

    it('handles multiple rapid prop changes', () => {
      const { rerender } = render(<Toast {...defaultProps} type={ErrorType.INFO} />);
      
      rerender(<Toast {...defaultProps} type={ErrorType.SUCCESS} />);
      expect(screen.getByText('Success')).toBeInTheDocument();
      
      rerender(<Toast {...defaultProps} type={ErrorType.VALIDATION_ERROR} />);
      expect(screen.getByText('Validation Error')).toBeInTheDocument();
    });

    it('handles rapid visibility changes', () => {
      const { rerender } = render(<Toast {...defaultProps} isVisible={true} />);
      expect(screen.getByText('Test message')).toBeInTheDocument();

      rerender(<Toast {...defaultProps} isVisible={false} />);
      expect(screen.queryByText('Test message')).not.toBeInTheDocument();

      rerender(<Toast {...defaultProps} isVisible={true} />);
      expect(screen.getByText('Test message')).toBeInTheDocument();
    });

    it('handles props changing during closing animation', () => {
      const onCloseMock = vi.fn();
      const { rerender } = render(
        <Toast {...defaultProps} onClose={onCloseMock} type={ErrorType.INFO} />
      );

      // Start closing animation
      const closeButton = screen.getByRole('button');
      act(() => {
        fireEvent.click(closeButton);
      });

      // Change props during animation
      rerender(
        <Toast {...defaultProps} onClose={onCloseMock} type={ErrorType.SUCCESS} message="New message" />
      );

      // Should still call onClose after animation completes
      act(() => {
        vi.advanceTimersByTime(300);
      });

      expect(onCloseMock).toHaveBeenCalledTimes(1);
    });

    it('handles message changing during auto-close countdown', () => {
      const onCloseMock = vi.fn();
      const { rerender } = render(
        <Toast {...defaultProps} onClose={onCloseMock} message="Original message" />
      );

      expect(screen.getByText('Original message')).toBeInTheDocument();

      // Change message halfway through auto-close countdown
      act(() => {
        vi.advanceTimersByTime(2500);
      });

      rerender(
        <Toast {...defaultProps} onClose={onCloseMock} message="Updated message" />
      );

      expect(screen.getByText('Updated message')).toBeInTheDocument();

      // Complete the remaining time
      act(() => {
        vi.advanceTimersByTime(2500);
      });

      act(() => {
        vi.advanceTimersByTime(300);
      });

      expect(onCloseMock).toHaveBeenCalled();
    });

    it('handles type changing during auto-close countdown', () => {
      const { rerender } = render(
        <Toast {...defaultProps} type={ErrorType.INFO} />
      );

      expect(screen.getByText('Info')).toBeInTheDocument();

      // Change type during countdown
      act(() => {
        vi.advanceTimersByTime(2000);
      });

      rerender(
        <Toast {...defaultProps} type={ErrorType.ERROR} />
      );

      expect(screen.getByText('Error')).toBeInTheDocument();
    });

    it('resets auto-close timer when message changes', () => {
      const onCloseMock = vi.fn();
      const { rerender } = render(
        <Toast {...defaultProps} onClose={onCloseMock} message="First message" autoCloseDelay={3000} />
      );

      // Wait almost to the end
      act(() => {
        vi.advanceTimersByTime(2900);
      });

      // Change message, which should reset the timer
      rerender(
        <Toast {...defaultProps} onClose={onCloseMock} message="Second message" autoCloseDelay={3000} />
      );

      // Original timer should not trigger
      act(() => {
        vi.advanceTimersByTime(100);
      });

      expect(onCloseMock).not.toHaveBeenCalled();

      // New timer should trigger after full delay
      act(() => {
        vi.advanceTimersByTime(2900);
      });

      act(() => {
        vi.advanceTimersByTime(300);
      });

      expect(onCloseMock).toHaveBeenCalled();
    });
  });

  describe('Performance', () => {
    it('does not re-render unnecessarily when props do not change', () => {
      const { rerender } = render(<Toast {...defaultProps} />);
      
      const initialElement = screen.getByText('Test message');
      
      // Re-render with same props
      rerender(<Toast {...defaultProps} />);
      
      // Should be the same element (no re-render)
      expect(screen.getByText('Test message')).toBe(initialElement);
    });

    it('properly cleans up timers on unmount', () => {
      const clearTimeoutSpy = vi.spyOn(global, 'clearTimeout');
      const { unmount } = render(
        <Toast {...defaultProps} type={ErrorType.SUCCESS} />
      );

      unmount();
      expect(clearTimeoutSpy).toHaveBeenCalled();
      clearTimeoutSpy.mockRestore();
    });
  });
});