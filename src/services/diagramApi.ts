import axios from "axios";
import { API_CONFIG, buildApiUrl } from "../config/api.config";

const API_BASE_URL = buildApiUrl(API_CONFIG.DIAGRAM_SERVICE_URL, "/api/v1/diagram");

export const getSystemFlowAPI = async (systemCode: string) => {
  const response = await axios.get(
    `${API_BASE_URL}/system-dependencies/${systemCode}`
  );
  return response.data;
};

export const getOverallSystemsFlowAPI = async () => {
  const response = await axios.get(
    `${API_BASE_URL}/system-dependencies/all`
  );
  return response.data;
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
};

export const getSystemBusinessCapabilities = async (systemCode: string) => {
  const response = await axios.get(
    `${API_BASE_URL}/business-capabilities/${systemCode}`
  );
  return response.data;
};
