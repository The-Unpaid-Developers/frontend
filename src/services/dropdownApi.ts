import axios from "axios";
import { API_CONFIG, buildApiUrl } from "../config/api.config";

const API_BASE_URL = buildApiUrl(
  API_CONFIG.CORE_SERVICE_URL,
  "/api/v1/dropdowns"
);

export interface BusinessCapability {
  l1: string;
  l2: string;
  l3: string;
}

export interface TechComponent {
  productName: string;
  productVersion: string;
}

export const getBusinessCapabilitiesAPI = async (): Promise<
  BusinessCapability[]
> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/business-capabilities`);
    return response.data;
  } catch (error) {
    console.error("Error fetching business capabilities:", error);
    throw error;
  }
};

export const getTechComponentsAPI = async (): Promise<TechComponent[]> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/tech-components`);
    return response.data;
  } catch (error) {
    console.error("Error fetching tech components:", error);
    throw error;
  }
};
