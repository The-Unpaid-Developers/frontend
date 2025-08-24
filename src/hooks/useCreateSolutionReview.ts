import { useState } from "react";
// import { saveBusinessCapabilities, saveDataAsset, saveEnterpriseTools, saveIntegrationFlow, saveSolutionOverview, saveSystemComponent, saveTechnologyComponent, saveProcessCompliance } from "../services/solutionReviewApi";
import { saveSolutionReview } from "../services/solutionReviewApi";
import type {
  CreateSolutionReviewData,
  BusinessCapability,
  DataAsset,
  EnterpriseTool,
  IntegrationFlow,
  SolutionOverview,
  SystemComponent,
  TechnologyComponent,
  ProcessCompliance,
} from "../types/createSolutionReview";

export const useCreateSolutionReview = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [businessCapabilities, setBusinessCapabilities] = useState<BusinessCapability[] | null>(null);
  const [dataAsset, setDataAsset] = useState<DataAsset[] | null>(null);
  const [enterpriseTools, setEnterpriseTools] = useState<EnterpriseTool[] | null>(null);
  const [integrationFlow, setIntegrationFlow] = useState<IntegrationFlow[] | null>(null);
  const [solutionOverview, setSolutionOverview] = useState<SolutionOverview | null>(null);
  const [systemComponent, setSystemComponent] = useState<SystemComponent[] | null>(null);
  const [technologyComponent, setTechnologyComponent] = useState<TechnologyComponent[] | null>(null);
  const [processCompliance, setProcessCompliance] = useState<ProcessCompliance[] | null>(null);

  // const saveSection = async (section: string) => {
  //   try {
  //     switch (section) {
  //       case "businessCapabilities":
  //         if (businessCapabilities) {
  //           await saveBusinessCapabilities(businessCapabilities);
  //         }
  //         break;
  //       case "dataAsset":
  //         if (dataAsset) {
  //           await saveDataAsset(dataAsset);
  //         }
  //         break;
  //       case "enterpriseTools":
  //         if (enterpriseTools) {
  //           await saveEnterpriseTools(enterpriseTools);
  //         }
  //         break;
  //       case "integrationFlow":
  //         if (integrationFlow) {
  //           await saveIntegrationFlow(integrationFlow);
  //         }
  //         break;
  //       case "solutionOverview":
  //         if (solutionOverview) {
  //           await saveSolutionOverview(solutionOverview);
  //         }
  //         break;
  //       case "systemComponent":
  //         if (systemComponent) {
  //           await saveSystemComponent(systemComponent);
  //         }
  //         break;
  //       case "technologyComponent":
  //         if (technologyComponent) {
  //           await saveTechnologyComponent(technologyComponent);
  //         }
  //         break;
  //       case "processCompliance":
  //         if (processCompliance) {
  //           await saveProcessCompliance(processCompliance);
  //         }
  //         break;
  //       default:
  //         throw new Error("Unknown section");
  //     }
  //   } catch (error) {
  //     console.error("Error saving section:", error);
  //     throw error;
  //   }
  // };
  const saveSection = async (
    section: keyof CreateSolutionReviewData,
    latestValue?: any   // Allow overriding with fresh value
  ) => {
    console.log("Saving section:", section);
    console.log(businessCapabilities, dataAsset, enterpriseTools, integrationFlow, solutionOverview, systemComponent, technologyComponent, processCompliance);
    try {
      const payload: Partial<CreateSolutionReviewData> = {
        solutionOverview: null,
        businessCapabilities: null,
        dataAsset: null,
        enterpriseTools: null,
        integrationFlow: null,
        systemComponent: null,
        technologyComponent: null,
        processCompliance: null,
      };

      // use latestValue if provided, else fallback to state
      switch (section) {
        case "businessCapabilities":
          payload.businessCapabilities = latestValue ?? businessCapabilities;
          console.log("Business Capabilities:", payload.businessCapabilities);
          console.log(businessCapabilities);
          break;
        case "dataAsset":
          payload.dataAsset = latestValue ?? dataAsset;
          break;
        case "enterpriseTools":
          payload.enterpriseTools = latestValue ?? enterpriseTools;
          break;
        case "integrationFlow":
          payload.integrationFlow = latestValue ?? integrationFlow;
          break;
        case "solutionOverview":
          payload.solutionOverview = latestValue ?? solutionOverview;
          break;
        case "systemComponent":
          payload.systemComponent = latestValue ?? systemComponent;
          break;
        case "technologyComponent":
          payload.technologyComponent = latestValue ?? technologyComponent;
          break;
        case "processCompliance":
          payload.processCompliance = latestValue ?? processCompliance;
          break;
        default:
          throw new Error("Unknown section");
      }

      console.log("Payload being sent:", payload);

      const res = await saveSolutionReview(payload as any);
      return res;
    } catch (error) {
      console.error("Error saving section:", error);
      throw error;
    }
  };

  const handleSaveAndNext = async (
    section: keyof CreateSolutionReviewData,
    latestValue?: any
  ) => {
    await saveSection(section, latestValue); // pass latest state here
    setCurrentStep((prev) => prev + 1);
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
    processCompliance,
    setProcessCompliance,
    saveSection,
    handleSaveAndNext,
  };
};
