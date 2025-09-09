import React, { createContext, useContext, useState } from 'react';
import type { UpdateSolutionReviewData } from '../types/solutionReview';

interface CreateSolutionReviewContextType {
  currentStep: number;
  setCurrentStep: (step: number) => void;
  reviewData: UpdateSolutionReviewData;
  updateReviewData: (section: keyof UpdateSolutionReviewData, data: any) => void;
}

const CreateSolutionReviewContext = createContext<CreateSolutionReviewContextType | undefined>(undefined);

export const CreateSolutionReviewProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [reviewData, setReviewData] = useState<UpdateSolutionReviewData>({
    businessCapabilities: {},
    dataAsset: {},
    enterpriseTools: {},
    integrationFlow: {},
    solutionOverview: {},
    systemComponent: {},
    technologyComponent: {},
  });

  const updateReviewData = (section: keyof UpdateSolutionReviewData, data: any) => {
    setReviewData((prevData) => ({
      ...prevData,
      [section]: data,
    }));
  };

  return (
    <CreateSolutionReviewContext.Provider value={{ currentStep, setCurrentStep, reviewData, updateReviewData }}>
      {children}
    </CreateSolutionReviewContext.Provider>
  );
};

export const useCreateSolutionReview = () => {
  const context = useContext(CreateSolutionReviewContext);
  if (!context) {
    throw new Error('useCreateSolutionReview must be used within a CreateSolutionReviewProvider');
  }
  return context;
};