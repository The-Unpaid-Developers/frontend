import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { NavigationButtons } from '../NavigationButtons';

describe('NavigationButtons', () => {
  const defaultProps = {
    currentStep: 1,
    totalSteps: 3,
    nextStep: vi.fn(),
    prevStep: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render Previous and Next buttons by default', () => {
      render(<NavigationButtons {...defaultProps} />);
      
      expect(screen.getByRole('button', { name: 'Previous' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Next' })).toBeInTheDocument();
    });

    it('should render Previous and Review & Submit buttons on last step', () => {
      render(<NavigationButtons {...defaultProps} currentStep={2} totalSteps={3} />);
      
      expect(screen.getByRole('button', { name: 'Previous' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Review & Submit' })).toBeInTheDocument();
      expect(screen.queryByRole('button', { name: 'Next' })).not.toBeInTheDocument();
    });

    it('should have correct container styling', () => {
      const { container } = render(<NavigationButtons {...defaultProps} />);
      const buttonContainer = container.firstChild as HTMLElement;
      
      expect(buttonContainer).toHaveClass('flex', 'justify-between', 'mt-4');
    });
  });

  describe('Previous Button', () => {
    it('should call prevStep when Previous button is clicked', () => {
      const mockPrevStep = vi.fn();
      render(<NavigationButtons {...defaultProps} prevStep={mockPrevStep} />);
      
      fireEvent.click(screen.getByRole('button', { name: 'Previous' }));
      expect(mockPrevStep).toHaveBeenCalledTimes(1);
    });

    it('should be disabled on first step', () => {
      render(<NavigationButtons {...defaultProps} currentStep={0} />);
      
      const prevButton = screen.getByRole('button', { name: 'Previous' });
      expect(prevButton).toBeDisabled();
      expect(prevButton).toHaveClass('opacity-50', 'cursor-not-allowed');
    });

    it('should be enabled on non-first steps', () => {
      render(<NavigationButtons {...defaultProps} currentStep={1} />);
      
      const prevButton = screen.getByRole('button', { name: 'Previous' });
      expect(prevButton).toBeEnabled();
      expect(prevButton).not.toHaveClass('opacity-50', 'cursor-not-allowed');
    });

    it('should not call prevStep when disabled and clicked', () => {
      const mockPrevStep = vi.fn();
      render(<NavigationButtons {...defaultProps} currentStep={0} prevStep={mockPrevStep} />);
      
      fireEvent.click(screen.getByRole('button', { name: 'Previous' }));
      expect(mockPrevStep).not.toHaveBeenCalled();
    });

    it('should have correct styling', () => {
      render(<NavigationButtons {...defaultProps} />);
      
      const prevButton = screen.getByRole('button', { name: 'Previous' });
      expect(prevButton).toHaveClass('px-4', 'py-2', 'text-white', 'bg-blue-600', 'rounded-md');
    });
  });

  describe('Next Button', () => {
    it('should call nextStep when Next button is clicked', () => {
      const mockNextStep = vi.fn();
      render(<NavigationButtons {...defaultProps} nextStep={mockNextStep} />);
      
      fireEvent.click(screen.getByRole('button', { name: 'Next' }));
      expect(mockNextStep).toHaveBeenCalledTimes(1);
    });

    it('should be present on non-last steps', () => {
      render(<NavigationButtons {...defaultProps} currentStep={0} totalSteps={3} />);
      
      expect(screen.getByRole('button', { name: 'Next' })).toBeInTheDocument();
    });

    it('should not be present on last step', () => {
      render(<NavigationButtons {...defaultProps} currentStep={2} totalSteps={3} />);
      
      expect(screen.queryByRole('button', { name: 'Next' })).not.toBeInTheDocument();
    });

    it('should have correct styling', () => {
      render(<NavigationButtons {...defaultProps} />);
      
      const nextButton = screen.getByRole('button', { name: 'Next' });
      expect(nextButton).toHaveClass('px-4', 'py-2', 'text-white', 'bg-blue-600', 'rounded-md');
    });
  });

  describe('Submit Button', () => {
    it('should call onSubmit when Review & Submit button is clicked', () => {
      const mockOnSubmit = vi.fn();
      render(<NavigationButtons {...defaultProps} currentStep={2} totalSteps={3} onSubmit={mockOnSubmit} />);
      
      fireEvent.click(screen.getByRole('button', { name: 'Review & Submit' }));
      expect(mockOnSubmit).toHaveBeenCalledTimes(1);
    });

    it('should handle async onSubmit function', async () => {
      const mockOnSubmit = vi.fn().mockResolvedValue(undefined);
      render(<NavigationButtons {...defaultProps} currentStep={2} totalSteps={3} onSubmit={mockOnSubmit} />);
      
      fireEvent.click(screen.getByRole('button', { name: 'Review & Submit' }));
      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledTimes(1);
      });
    });

    it('should be present only on last step', () => {
      render(<NavigationButtons {...defaultProps} currentStep={2} totalSteps={3} />);
      
      expect(screen.getByRole('button', { name: 'Review & Submit' })).toBeInTheDocument();
    });

    it('should have correct styling', () => {
      render(<NavigationButtons {...defaultProps} currentStep={2} totalSteps={3} />);
      
      const submitButton = screen.getByRole('button', { name: 'Review & Submit' });
      expect(submitButton).toHaveClass('px-4', 'py-2', 'text-white', 'bg-blue-600', 'rounded-md');
    });

    it('should work without onSubmit callback', () => {
      render(<NavigationButtons {...defaultProps} currentStep={2} totalSteps={3} />);
      
      const submitButton = screen.getByRole('button', { name: 'Review & Submit' });
      expect(() => fireEvent.click(submitButton)).not.toThrow();
    });
  });

  describe('Step Logic', () => {
    it('should correctly identify first step', () => {
      render(<NavigationButtons {...defaultProps} currentStep={0} totalSteps={5} />);
      
      const prevButton = screen.getByRole('button', { name: 'Previous' });
      expect(prevButton).toBeDisabled();
    });

    it('should correctly identify middle steps', () => {
      render(<NavigationButtons {...defaultProps} currentStep={2} totalSteps={5} />);
      
      const prevButton = screen.getByRole('button', { name: 'Previous' });
      const nextButton = screen.getByRole('button', { name: 'Next' });
      
      expect(prevButton).toBeEnabled();
      expect(nextButton).toBeInTheDocument();
      expect(screen.queryByRole('button', { name: 'Review & Submit' })).not.toBeInTheDocument();
    });

    it('should correctly identify last step', () => {
      render(<NavigationButtons {...defaultProps} currentStep={4} totalSteps={5} />);
      
      const prevButton = screen.getByRole('button', { name: 'Previous' });
      const submitButton = screen.getByRole('button', { name: 'Review & Submit' });
      
      expect(prevButton).toBeEnabled();
      expect(submitButton).toBeInTheDocument();
      expect(screen.queryByRole('button', { name: 'Next' })).not.toBeInTheDocument();
    });

    it('should handle single step scenario', () => {
      render(<NavigationButtons {...defaultProps} currentStep={0} totalSteps={1} />);
      
      const prevButton = screen.getByRole('button', { name: 'Previous' });
      const submitButton = screen.getByRole('button', { name: 'Review & Submit' });
      
      expect(prevButton).toBeDisabled();
      expect(submitButton).toBeInTheDocument();
      expect(screen.queryByRole('button', { name: 'Next' })).not.toBeInTheDocument();
    });
  });

  describe('isSaving prop', () => {
    it('should accept isSaving prop without breaking', () => {
      expect(() => {
        render(<NavigationButtons {...defaultProps} isSaving={true} />);
      }).not.toThrow();
    });

    it('should accept isSaving prop as false', () => {
      expect(() => {
        render(<NavigationButtons {...defaultProps} isSaving={false} />);
      }).not.toThrow();
    });

    it('should use default value of false when isSaving is not provided', () => {
      expect(() => {
        render(<NavigationButtons {...defaultProps} />);
      }).not.toThrow();
    });
  });

  describe('Edge Cases', () => {
    it('should handle zero-based indexing correctly', () => {
      render(<NavigationButtons {...defaultProps} currentStep={0} totalSteps={2} />);
      
      const prevButton = screen.getByRole('button', { name: 'Previous' });
      const nextButton = screen.getByRole('button', { name: 'Next' });
      
      expect(prevButton).toBeDisabled();
      expect(nextButton).toBeInTheDocument();
    });

    it('should handle large step numbers', () => {
      render(<NavigationButtons {...defaultProps} currentStep={99} totalSteps={100} />);
      
      const prevButton = screen.getByRole('button', { name: 'Previous' });
      const submitButton = screen.getByRole('button', { name: 'Review & Submit' });
      
      expect(prevButton).toBeEnabled();
      expect(submitButton).toBeInTheDocument();
    });

    it('should handle missing callback functions gracefully', () => {
      const { nextStep, prevStep, ...propsWithoutCallbacks } = defaultProps;
      
      expect(() => {
        render(<NavigationButtons {...propsWithoutCallbacks} nextStep={undefined as any} prevStep={undefined as any} />);
      }).not.toThrow();
    });
  });
});