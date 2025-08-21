import React from 'react';

interface NavigationButtonsProps {
  currentStep: number;
  totalSteps: number;
  // onNext: () => void;
  // onPrevious: () => void;
  nextStep: () => void;
  prevStep: () => void;
  /**
   * Optional callback to perform save before advancing.
   * If provided it will be called instead of nextStep().
   * Should return a Promise when async.
   */
  // onNext?: () => void | Promise<void>;
  isSaving?: boolean;
}

export const NavigationButtons: React.FC<NavigationButtonsProps> = ({
  currentStep,
  totalSteps = 7,
  // onNext,
  // onPrevious,
  nextStep,
  prevStep,
  // onNext,
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
      <button
        onClick={nextStep}
        disabled={currentStep === totalSteps - 1}
        className={`px-4 py-2 text-white bg-blue-600 rounded-md ${
          currentStep === totalSteps - 1 ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        Next
      </button>
    </div>
  );
};
// import React from "react";

// type Props = {
//   currentStep: number;
//   totalSteps?: number;
//   nextStep: () => void;
//   prevStep: () => void;
//   /**
//    * Optional callback to perform save before advancing.
//    * If provided it will be called instead of nextStep().
//    * Should return a Promise when async.
//    */
//   onNext?: () => void | Promise<void>;
//   isSaving?: boolean;
// };

// export const NavigationButtons: React.FC<Props> = ({
//   currentStep,
//   totalSteps = 7,
//   nextStep,
//   prevStep,
//   onNext,
//   isSaving = false,
// }) => {
//   const isFirst = currentStep === 0;
//   const isLast = currentStep === totalSteps - 1;

//   const handleNext = async () => {
//     if (onNext) {
//       try {
//         await onNext();
//       } catch {
//         // swallow here — caller should show error UI
//         return;
//       }
//     } else {
//       nextStep();
//     }
//   };

//   return (
//     <div className="flex justify-between items-center mt-6">
//       <button
//         type="button"
//         onClick={prevStep}
//         disabled={isFirst || isSaving}
//         className={`px-4 py-2 rounded-md text-sm font-medium ${
//           isFirst || isSaving
//             ? "bg-gray-100 text-gray-400 cursor-not-allowed"
//             : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
//         }`}
//       >
//         Back
//       </button>

//       <div className="flex items-center space-x-3">
//         {!isLast ? (
//           <button
//             type="button"
//             onClick={handleNext}
//             disabled={isSaving}
//             className={`px-4 py-2 rounded-md text-sm font-medium ${
//               isSaving
//                 ? "bg-primary-200 text-white cursor-not-allowed"
//                 : "bg-primary-600 text-white hover:bg-primary-700"
//             }`}
//           >
//             {isSaving ? "Saving..." : "Next"}
//           </button>
//         ) : (
//           <button
//             type="button"
//             onClick={handleNext}
//             disabled={isSaving}
//             className={`px-4 py-2 rounded-md text-sm font-medium ${
//               isSaving
//                 ? "bg-green-300 text-white cursor-not-allowed"
//                 : "bg-green-600 text-white hover:bg-green-700"
//             }`}
//           >
//             {isSaving ? "Saving..." : "Finish"}
//           </button>
//         )}
//       </div>
//     </div>
//   );
// };

// export default NavigationButtons;