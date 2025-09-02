// hooks/useUpdateSolutionReview.ts
import { useState } from "react";
import { 
  saveSolutionReviewDraft,
  // getSolutionReviewById
} from "../services/solutionReviewApi";
import type { 
  UpdateSolutionReviewData, 
  BusinessCapability, 
  DataAsset, 
  EnterpriseTool, 
  IntegrationFlow, 
  SolutionOverview, 
  SystemComponent, 
  TechnologyComponent, 
  ProcessCompliance 
} from "../types/solutionReview";
import { mockApiService } from "../services/mockApiUpdated";

export const useUpdateSolutionReview = (reviewId: string) => {
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [businessCapabilities, setBusinessCapabilities] = useState<BusinessCapability[] | null>(null);
  const [dataAssets, setDataAsset] = useState<DataAsset[] | null>(null);
  const [enterpriseTools, setEnterpriseTools] = useState<EnterpriseTool[] | null>(null);
  const [integrationFlows, setIntegrationFlow] = useState<IntegrationFlow[] | null>(null);
  const [solutionOverview, setSolutionOverview] = useState<SolutionOverview | null>(null);
  const [systemComponents, setSystemComponent] = useState<SystemComponent[] | null>(null);
  const [technologyComponents, setTechnologyComponent] = useState<TechnologyComponent[] | null>(null);
  const [processCompliances, setProcessCompliance] = useState<ProcessCompliance[] | null>(null);

  // Load existing review data
  const loadReviewData = async () => {
    // if (!reviewId) return;
    console.log('in hook');
    
    setIsLoading(true);
    try {
      // TODO: Replace with actual API call when backend is ready
      // const reviewData = await getSolutionReviewById(reviewId);
      
      // For now, use mock data
      const reviewData = await mockApiService.getSolutionReviewById('1'); // Import or define mock data
      console.log('review data ', reviewData);
      if (reviewData) {
        setSolutionOverview(reviewData.solutionOverview);
        setBusinessCapabilities(reviewData.businessCapabilities);
        setDataAsset(reviewData.dataAssets);
        setSystemComponent(reviewData.systemComponents);
        setTechnologyComponent(reviewData.technologyComponents);
        setIntegrationFlow(reviewData.integrationFlows);
        setEnterpriseTools(reviewData.enterpriseTools);
        setProcessCompliance(reviewData.processCompliances);
      }
    } catch (error) {``
      console.error("Error loading review data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveSection = async <K extends keyof UpdateSolutionReviewData>(
    section: K,
    value: UpdateSolutionReviewData[K],
    systemCode: string
  ) => {
    // Update local state
    switch (section) {
      case "businessCapabilities":
        setBusinessCapabilities(value as BusinessCapability[] | null);
        break;
      case "dataAssets":
        setDataAsset(value as DataAsset[] | null);
        break;
      case "enterpriseTools":
        setEnterpriseTools(value as EnterpriseTool[] | null);
        break;
      case "integrationFlows":
        setIntegrationFlow(value as IntegrationFlow[] | null);
        break;
      case "solutionOverview":
        setSolutionOverview(value as SolutionOverview | null);
        break;
      case "systemComponents":
        setSystemComponent(value as SystemComponent[] | null);
        break;
      case "technologyComponents":
        setTechnologyComponent(value as TechnologyComponent[] | null);
        break;
      case "processCompliances":
        setProcessCompliance(value as ProcessCompliance[] | null);
        break;
      default:
        throw new Error("Unknown section");
    }

    // For draft saving (partial updates)
    const nullPayload: Partial<UpdateSolutionReviewData> = {
      solutionOverview: null,
      businessCapabilities: null,
      dataAssets: null,
      enterpriseTools: null,
      integrationFlows: null,
      systemComponents: null,
      technologyComponents: null,
      processCompliances: null
    };

    const payload = {
      ...nullPayload,
      [section]: value
    };

    return await saveSolutionReviewDraft(payload as any, systemCode);
  };

  // Final submission - update the entire review
  const updateReview = async (data: UpdateSolutionReviewData) => {
    setIsLoading(true);
    try {
      // TODO: Replace with actual API call when backend is ready
      // For now, use mock function
      console.log("Updating review:", reviewId, data);
      
      // This would be the actual API call format:
      // const response = await updateSolutionReviewApi({
      //   id: reviewId,
      //   ...data
      // });
      
      // Mock response
      return { success: true };
    } catch (error) {
      console.error("Error updating review:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    currentStep,
    setCurrentStep,
    businessCapabilities,
    setBusinessCapabilities,
    dataAssets,
    setDataAsset,
    enterpriseTools,
    setEnterpriseTools,
    integrationFlows,
    setIntegrationFlow,
    solutionOverview,
    setSolutionOverview,
    systemComponents,
    setSystemComponent,
    technologyComponents,
    setTechnologyComponent,
    processCompliances,
    setProcessCompliance,
    saveSection,
    updateReview,
    loadReviewData,
    isLoading
  };
};