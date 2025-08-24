import { useState } from "react";
// import { saveBusinessCapabilities, saveDataAsset, saveEnterpriseTools, saveIntegrationFlow, saveSolutionOverview, saveSystemComponent, saveTechnologyComponent, saveProcessCompliance } from "../services/solutionReviewApi";
import { saveSolutionReview } from "../services/solutionReviewApi";
import type { CreateSolutionReviewData, BusinessCapability, DataAsset, EnterpriseTool, IntegrationFlow, SolutionOverview, SystemComponent, TechnologyComponent, ProcessCompliance } from "../types/createSolutionReview";

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

  // const saveSection = async (section: keyof CreateSolutionReviewData) => {
  //   console.log("Saving section:", section);
  //   console.log(businessCapabilities, dataAsset, enterpriseTools, integrationFlow, solutionOverview, systemComponent, technologyComponent, processCompliance);
  //   try {
  //     const payload: Partial<CreateSolutionReviewData> = {
  //       solutionOverview: null,
  //       businessCapabilities: null,
  //       dataAsset: null,
  //       enterpriseTools: null,
  //       integrationFlow: null,
  //       systemComponent: null,
  //       technologyComponent: null,
  //       processCompliance: null,
  //     };
  //     // assign the current in-memory value for the requested section
  //     switch (section) {
  //       case "businessCapabilities":
  //         payload.businessCapabilities = businessCapabilities;
  //         console.log("Business Capabilities:", payload.businessCapabilities);
  //         console.log(businessCapabilities);
  //         break;
  //       case "dataAsset":
  //         payload.dataAsset = dataAsset;
  //         break;
  //       case "enterpriseTools":
  //         payload.enterpriseTools = enterpriseTools;
  //         break;
  //       case "integrationFlow":
  //         payload.integrationFlow = integrationFlow;
  //         break;
  //         break;
  //       case "solutionOverview":
  //         payload.solutionOverview = solutionOverview;
  //         break;
  //       case "systemComponent":
  //         payload.systemComponent = systemComponent;
  //         break;
  //       case "technologyComponent":
  //         payload.technologyComponent = technologyComponent;
  //         break;
  //       case "processCompliance":
  //         payload.processCompliance = processCompliance;
  //         break;
  //       default:
  //         throw new Error("Unknown section");
  //     }
  //     const res = await saveSolutionReview(payload as any);
  //     return res;
  //   } catch (error) {
  //     console.error("Error saving section:", error);
  //     throw error;
  //   }
  const saveSection = async <K extends keyof CreateSolutionReviewData>(
    section: K,
    value: CreateSolutionReviewData[K]
  ) => {
    // Update local state synchronously (enqueue) using the passed value
    switch (section) {
      case "businessCapabilities":
        setBusinessCapabilities(value as BusinessCapability[] | null);
        break;
      case "dataAsset":
        setDataAsset(value as DataAsset[] | null);
        break;
      case "enterpriseTools":
        setEnterpriseTools(value as EnterpriseTool[] | null);
        break;
      case "integrationFlow":
        setIntegrationFlow(value as IntegrationFlow[] | null);
        break;
      case "solutionOverview":
        setSolutionOverview(value as SolutionOverview | null);
        break;
      case "systemComponent":
        setSystemComponent(value as SystemComponent[] | null);
        break;
      case "technologyComponent":
        setTechnologyComponent(value as TechnologyComponent[] | null);
        break;
      case "processCompliance":
        setProcessCompliance(value as ProcessCompliance[] | null);
        break;
      default:
        throw new Error("Unknown section");
    }

    const nullPayload: Partial<CreateSolutionReviewData> = {
      solutionOverview: null,
      businessCapabilities: null,
      dataAsset: null,
      enterpriseTools: null,
      integrationFlow: null,
      systemComponent: null,
      technologyComponent: null,
      processCompliance: null
    };

    const payload = {
      ...nullPayload,
      [section]: value
    };

    // Use the passed value (not the possibly stale state)
    return await saveSolutionReview(payload as any);
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
  };
};