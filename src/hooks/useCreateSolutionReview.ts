import { useState } from "react";
import { saveBusinessCapabilities, saveDataAsset, saveEnterpriseTools, saveIntegrationFlow, saveSolutionOverview, saveSystemComponent, saveTechnologyComponent } from "../services/solutionReviewApi";
import type { BusinessCapabilities, DataAsset, EnterpriseTools, IntegrationFlow, SolutionOverview, SystemComponent, TechnologyComponent } from "../types/createSolutionReview";

export const useCreateSolutionReview = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [businessCapabilities, setBusinessCapabilities] = useState<BusinessCapabilities | null>(null);
  const [dataAsset, setDataAsset] = useState<DataAsset | null>(null);
  const [enterpriseTools, setEnterpriseTools] = useState<EnterpriseTools | null>(null);
  const [integrationFlow, setIntegrationFlow] = useState<IntegrationFlow | null>(null);
  const [solutionOverview, setSolutionOverview] = useState<SolutionOverview | null>(null);
  const [systemComponent, setSystemComponent] = useState<SystemComponent | null>(null);
  const [technologyComponent, setTechnologyComponent] = useState<TechnologyComponent | null>(null);

  const saveSection = async (section: string) => {
    try {
      switch (section) {
        case "businessCapabilities":
          if (businessCapabilities) {
            await saveBusinessCapabilities(businessCapabilities);
          }
          break;
        case "dataAsset":
          if (dataAsset) {
            await saveDataAsset(dataAsset);
          }
          break;
        case "enterpriseTools":
          if (enterpriseTools) {
            await saveEnterpriseTools(enterpriseTools);
          }
          break;
        case "integrationFlow":
          if (integrationFlow) {
            await saveIntegrationFlow(integrationFlow);
          }
          break;
        case "solutionOverview":
          if (solutionOverview) {
            await saveSolutionOverview(solutionOverview);
          }
          break;
        case "systemComponent":
          if (systemComponent) {
            await saveSystemComponent(systemComponent);
          }
          break;
        case "technologyComponent":
          if (technologyComponent) {
            await saveTechnologyComponent(technologyComponent);
          }
          break;
        default:
          throw new Error("Unknown section");
      }
    } catch (error) {
      console.error("Error saving section:", error);
      throw error;
    }
  };

  return {
    currentStep,
    setCurrentStep,
    businessCapabilities,
    setBusinessCapabilities,
    dataAsset,
    setDataAsset,
    enterpriseTools,
    setEnterpriseTools,
    integrationFlow,
    setIntegrationFlow,
    solutionOverview,
    setSolutionOverview,
    systemComponent,
    setSystemComponent,
    technologyComponent,
    setTechnologyComponent,
    saveSection,
  };
};