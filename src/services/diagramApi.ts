import axios from "axios";
import { API_CONFIG, buildApiUrl } from "../config/api.config";

const API_BASE_URL = buildApiUrl(API_CONFIG.DIAGRAM_BASE_URL, "/diagram");

export const getSystemFlowAPI = async (systemCode: string) => {
  const response = await axios.get(
    `${API_BASE_URL}/diagram/system-dependencies/${systemCode}`
  );
  return response.data;
  // return mockSystemFlowData;
};

export const getOverallSystemsFlowAPI = async () => {
  const response = await axios.get(
    `${API_BASE_URL}/system-dependencies/all`
  );
  return response.data;
  //   return mockSystemFlowData;
};

export const getSystemPaths = async (
  producerSystemCode: string,
  consumerSystemCode: string
) => {
  const response = await axios.get(
    `${API_BASE_URL}/system-dependencies/path?start=${producerSystemCode}&end=${consumerSystemCode}`
  );
  return response.data;
};

export const getBusinessCapabilities = async () => {
  const response = await axios.get(
    `${API_BASE_URL}/business-capabilities/all`
  );
  return response.data;
  // return mockBCData;
};

export const getSystemBusinessCapabilities = async (systemCode: string) => {
  const response = await axios.get(
    `${API_BASE_URL}/business-capabilities/${systemCode}`
  );
  return response.data;
};
