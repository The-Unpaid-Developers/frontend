import { describe, it, expect, vi, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import useStepNavigation from '../useStepNavigation';

describe('useStepNavigation', () => {
  const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

  afterEach(() => {
    consoleSpy.mockClear();
  });

  it('initializes with currentStep as 0', () => {
    const { result } = renderHook(() => useStepNavigation(5));
    expect(result.current.currentStep).toBe(0);
  });

  it('provides navigation functions', () => {
    const { result } = renderHook(() => useStepNavigation(5));
    
    expect(typeof result.current.nextStep).toBe('function');
    expect(typeof result.current.prevStep).toBe('function');
    expect(typeof result.current.goToStep).toBe('function');
  });

  describe('nextStep', () => {
    it('increments currentStep when not at the last step', () => {
      const { result } = renderHook(() => useStepNavigation(5));
      
      act(() => {
        result.current.nextStep();
      });
      
      expect(result.current.currentStep).toBe(1);
    });

    it('does not increment past totalSteps - 1', () => {
      const { result } = renderHook(() => useStepNavigation(3));
      
      // Go to last step
      act(() => {
        result.current.goToStep(2);
      });
      
      // Try to go past last step
      act(() => {
        result.current.nextStep();
      });
      
      expect(result.current.currentStep).toBe(2);
    });

    it('maintains stable behavior across multiple calls', () => {
      const { result } = renderHook(() => useStepNavigation(5));
      
      act(() => {
        result.current.nextStep();
        result.current.nextStep();
      });
      
      expect(result.current.currentStep).toBe(2);
    });
  });

  describe('prevStep', () => {
    it('decrements currentStep when not at the first step', () => {
      const { result } = renderHook(() => useStepNavigation(5));
      
      // Go to step 2 first
      act(() => {
        result.current.goToStep(2);
      });
      
      act(() => {
        result.current.prevStep();
      });
      
      expect(result.current.currentStep).toBe(1);
    });

    it('does not decrement below 0', () => {
      const { result } = renderHook(() => useStepNavigation(5));
      
      act(() => {
        result.current.prevStep();
      });
      
      expect(result.current.currentStep).toBe(0);
    });
  });

  describe('goToStep', () => {
    it('sets currentStep to valid step number', () => {
      const { result } = renderHook(() => useStepNavigation(5));
      
      act(() => {
        result.current.goToStep(3);
      });
      
      expect(result.current.currentStep).toBe(3);
    });

    it('does not change step for negative numbers', () => {
      const { result } = renderHook(() => useStepNavigation(5));
      
      act(() => {
        result.current.goToStep(-1);
      });
      
      expect(result.current.currentStep).toBe(0);
    });

    it('does not change step for numbers >= totalSteps', () => {
      const { result } = renderHook(() => useStepNavigation(5));
      
      act(() => {
        result.current.goToStep(5);
      });
      
      expect(result.current.currentStep).toBe(0);
    });

    it('handles edge case of step equal to totalSteps - 1', () => {
      const { result } = renderHook(() => useStepNavigation(5));
      
      act(() => {
        result.current.goToStep(4);
      });
      
      expect(result.current.currentStep).toBe(4);
    });
  });

  describe('integration scenarios', () => {
    it('handles navigation sequence correctly', () => {
      const { result } = renderHook(() => useStepNavigation(4));
      
      // Start at 0, go to next (1)
      act(() => {
        result.current.nextStep();
      });
      expect(result.current.currentStep).toBe(1);
      
      // Go to step 3
      act(() => {
        result.current.goToStep(3);
      });
      expect(result.current.currentStep).toBe(3);
      
      // Go back one (2)
      act(() => {
        result.current.prevStep();
      });
      expect(result.current.currentStep).toBe(2);
      
      // Try to go past end
      act(() => {
        result.current.nextStep();
        result.current.nextStep();
        result.current.nextStep();
      });
      expect(result.current.currentStep).toBe(3); // Should stay at last step
    });

    it('works with single step scenario', () => {
      const { result } = renderHook(() => useStepNavigation(1));
      
      expect(result.current.currentStep).toBe(0);
      
      act(() => {
        result.current.nextStep();
      });
      expect(result.current.currentStep).toBe(0); // Can't go past 0 when totalSteps is 1
      
      act(() => {
        result.current.prevStep();
      });
      expect(result.current.currentStep).toBe(0); // Can't go below 0
    });
  });
});