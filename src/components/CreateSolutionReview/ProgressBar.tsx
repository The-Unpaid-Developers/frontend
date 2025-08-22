// import React from 'react';

// interface ProgressBarProps {
//   currentStep: number;
//   totalSteps: number;
// }

// export const ProgressBar: React.FC<ProgressBarProps> = ({ currentStep, totalSteps }) => {
//   const progressPercentage = ((currentStep + 1) / totalSteps) * 100;

//   return (
//     <div className="w-full bg-gray-200 rounded-full h-4">
//       <div
//         className="bg-blue-600 h-4 rounded-full"
//         style={{ width: `${progressPercentage}%` }}
//       />
//     </div>
//   );
// };

// ...existing code...
import React from 'react';

interface Step {
  key: string;
  label: string;
}

interface ProgressBarProps {
  currentStep: number;
  steps: Step[];
  onStepClick?: (index: number) => void;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ currentStep, steps, onStepClick }) => {
  const total = steps.length;
  return (
    <nav aria-label="Create solution review steps" className="w-full">
      <ol className="flex items-start justify-between space-x-2 sm:space-x-4">
        {steps.map((step, idx) => {
          const isActive = idx === currentStep;
          const isComplete = idx < currentStep;
          return (
            <li key={step.key} className="flex-1 min-w-0">
              <div className="flex items-center">
                {/* connector (hidden for first item) */}
                <div className={`hidden sm:block flex-1 ${idx === 0 ? '' : ''}`} />
                <div className="flex items-center flex-col sm:flex-row sm:items-center w-full">
                  <button
                    type="button"
                    onClick={() => onStepClick?.(idx)}
                    aria-current={isActive ? 'step' : undefined}
                    className={`flex items-center justify-center w-8 h-8 rounded-full border-2 flex-shrink-0 transition-colors
                      ${isComplete ? 'bg-primary-600 border-primary-600 text-white' : isActive ? 'bg-white border-primary-600 text-primary-600 shadow' : 'bg-white border-gray-300 text-gray-600'}
                    `}
                    title={`${idx + 1}. ${step.label}`}
                  >
                    <span className="text-sm font-medium">{idx + 1}</span>
                  </button>

                  <div className="ml-3 text-left">
                    <div
                      className={`text-xs sm:text-sm font-medium ${isActive ? 'text-gray-900' : isComplete ? 'text-gray-700' : 'text-gray-500'}`}
                    >
                      {step.label}
                    </div>
                    <div className="hidden sm:block text-xs text-gray-400">
                      Step {idx + 1} of {total}
                    </div>
                  </div>
                </div>
              </div>

              {/* horizontal connector line between items (mobile-friendly) */}
              {idx < total && (
                <div
                  aria-hidden
                  className={`mt-2 sm:mt-3 h-2 w-full relative`}
                >
                  <div className="absolute inset-0 flex items-center" aria-hidden>
                    <div className="w-full h-0.5 bg-gray-200" />
                    <div
                      className="absolute left-0 top-0 h-0.5 bg-primary-600"
                      style={{ width: `${((currentStep) / Math.max(1, total - 1)) * 100}%` }}
                    />
                  </div>
                </div>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default ProgressBar;
// ...existing code...