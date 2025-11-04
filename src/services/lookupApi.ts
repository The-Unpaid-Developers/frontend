import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/v1';

export interface BusinessCapability {
  l1: string;
  l2: string;
  l3: string;
}

export interface TechComponent {
  productName: string;
  productVersion: string;
}

export const getBusinessCapabilitiesAPI = async (): Promise<BusinessCapability[]> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/lookups/business-capabilities`);
    return response.data;
  } catch (error) {
    console.error('Error fetching business capabilities:', error);
    throw error;
  }
};

export const getTechComponentsAPI = async (): Promise<TechComponent[]> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/lookups/tech-components`);
    return response.data;
  } catch (error) {
    console.error('Error fetching tech components:', error);
    throw error;
  }
};