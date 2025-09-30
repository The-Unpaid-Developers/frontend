import React from 'react';

interface NavigationButtonsProps {
  currentStep: number;
  totalSteps: number;
  nextStep: () => void;
  prevStep: () => void;
  /**
   * Optional callback to perform save before advancing.
   * If provided it will be called instead of nextStep().
   * Should return a Promise when async.
   */
  onSubmit?: () => void | Promise<void>;
  isSaving?: boolean;
}

export const NavigationButtons: React.FC<NavigationButtonsProps> = ({
  currentStep,
  totalSteps,
  nextStep,
  prevStep,
  onSubmit,
  isSaving = false,
}) => {
  const isFirst = currentStep === 0;
  const isLast = currentStep === totalSteps - 1;
  
  return (
    <div className="flex justify-between mt-4">
      <button
        onClick={prevStep}
        disabled={isFirst}
        className={`px-4 py-2 text-white bg-blue-600 rounded-md ${
          currentStep === 0 ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        Previous
      </button>
      {isLast ? (
        <button
          onClick={onSubmit}
          className={`px-4 py-2 text-white bg-blue-600 rounded-md`}
        >
          Review & Submit
        </button>
      ) : (
        <button
        onClick={nextStep}
        className={`px-4 py-2 text-white bg-blue-600 rounded-md`}
      >
        Next
      </button>
      )}
    </div>
  );
};