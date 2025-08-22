import axios from 'axios';
import type { BusinessCapabilities, DataAsset, EnterpriseTools, IntegrationFlow, SolutionOverview, SystemComponent, TechnologyComponent } from '../types/createSolutionReview';
// import type { 
//   CreateSolutionReviewData,
//   StepSaveResponse,
//   CreateSolutionReviewResponse 
// } from '../types';

// Define the individual step types locally to avoid import issues
// interface BusinessCapabilities {
//   capabilities: string[];
//   businessProcesses: string[];
//   keyRequirements: string[];
//   successCriteria: string[];
//   domain: string;
//   maturityLevel: string;
//   strategicImportance: string;
// }

// interface DataAsset {
//   dataSources: string[];
//   dataTypes: string[];
//   dataVolume: string;
//   dataFrequency: string;
//   dataQualityRequirements: string[];
//   classification: string;
//   sensitivityLevel: string;
//   format: string;
// }

// interface EnterpriseTools {
//   existingTools: string[];
//   requiredTools: string[];
//   integrationPoints: string[];
//   licenses: string[];
//   category: string;
//   vendor: string;
//   purpose: string;
//   userBase: string;
//   licenseType: string;
// }

// interface IntegrationFlow {
//   sourceSystem: string;
//   targetSystem: string;
//   dataFlow: string;
//   frequency: string;
//   protocol: string;
//   securityRequirements: string[];
//   dataFormat: string;
//   description: string;
// }

// interface SystemComponent {
//   componentName: string;
//   componentType: string;
//   description: string;
//   dependencies: string[];
//   scalabilityRequirements: string;
//   vendor: string;
//   version: string;
//   platform: string;
//   status: string;
// }

// interface TechnologyComponent {
//   technology: string;
//   version: string;
//   purpose: string;
//   configuration: string;
//   supportRequirements: string[];
//   category: string;
//   vendor: string;
//   license: string;
//   supportLevel: string;
// }

// interface SolutionOverview {
//   title: string;
//   description: string;
//   category: string;
//   businessPriority: 'High' | 'Medium' | 'Low';
//   projectTimeline: string;
//   stakeholders: string[];
//   businessValue: string;
//   estimatedCost: number;
//   estimatedDuration: string;
//   risksAndChallenges: string[];
// }

// type StepKey = 
//   | 'solutionOverview'
//   | 'businessCapabilities' 
//   | 'dataAsset'
//   | 'enterpriseTools'
//   | 'integrationFlow'
//   | 'systemComponent'
//   | 'technologyComponent';

const API_BASE_URL = 'https://your-api-url.com/api'; // Replace with your actual API base URL

export const saveBusinessCapabilities = async (data: BusinessCapabilities) => {
  const response = await axios.post(`${API_BASE_URL}/business-capabilities`, data);
  return response.data;
};

export const saveDataAsset = async (data: DataAsset) => {
  const response = await axios.post(`${API_BASE_URL}/data-asset`, data);
  return response.data;
};

export const saveEnterpriseTools = async (data: EnterpriseTools) => {
  const response = await axios.post(`${API_BASE_URL}/enterprise-tools`, data);
  return response.data;
};

export const saveIntegrationFlow = async (data: IntegrationFlow) => {
  const response = await axios.post(`${API_BASE_URL}/integration-flow`, data);
  return response.data;
};

export const saveSolutionOverview = async (data: SolutionOverview) => {
  const response = await axios.post(`${API_BASE_URL}/solution-overview`, data);
  return response.data;
};

export const saveSystemComponent = async (data: SystemComponent) => {
  const response = await axios.post(`${API_BASE_URL}/system-component`, data);
  return response.data;
};

export const saveTechnologyComponent = async (data: TechnologyComponent) => {
  const response = await axios.post(`${API_BASE_URL}/technology-component`, data);
  return response.data;
};

export const saveProcessCompliance = async (data: any) => {
  const response = await axios.post(`${API_BASE_URL}/process-compliance`, data);
  return response.data;
};
