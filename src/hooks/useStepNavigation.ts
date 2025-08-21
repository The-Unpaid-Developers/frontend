import { useState, useCallback } from 'react';

const useStepNavigation = (totalSteps: number) => {
  const [currentStep, setCurrentStep] = useState(0);

  // const nextStep = () => {
  //   console.log('next out');
  //   console.log("currentStep", currentStep, "totalSteps", totalSteps);
  //   if (currentStep < totalSteps - 1) {
  //     console.log("next");
  //     setCurrentStep((prev) => prev + 1);
  //   }
  // };

  // const prevStep = () => {
  //   console.log('prev out');
  //   if (currentStep > 0) {
  //     console.log("prev");
  //     setCurrentStep((prev) => prev - 1);
  //   }
  // };

  // const goToStep = (step: number) => {
  //   if (step >= 0 && step < totalSteps) {
  //     setCurrentStep(step);
  //   }
  // };

  const nextStep = useCallback(() => {
    console.log('next out');
    console.log("currentStep", currentStep, "totalSteps", totalSteps);
    setCurrentStep((prev) => {
      if (prev < totalSteps - 1) {
        return prev + 1;
      }
      return prev;
    });
  }, [totalSteps]);

  const prevStep = useCallback(() => {
    setCurrentStep((prev) => {
      if (prev > 0) {
        return prev - 1;
      }
      return prev;
    });
  }, []);

  const goToStep = useCallback((step: number) => {
    setCurrentStep((prev) => {
      if (step >= 0 && step < totalSteps) {
        return step;
      }
      return prev;
    });
  }, [totalSteps]);

  return {
    currentStep,
    nextStep,
    prevStep,
    goToStep,
  };
};

export default useStepNavigation;