import axios from "axios";
import { API_CONFIG, buildApiUrl } from "../config/api.config";

const API_BASE_URL = buildApiUrl(
  API_CONFIG.PROXY_SERVICE_URL,
  "/api/v1/queries"
);

export const getAllQueriesAPI = async () => {
  const response = await axios.get(`${API_BASE_URL}`);
  return response.data;
};

export const getSpecificQueryAPI = async (queryName: string) => {
  const response = await axios.get(`${API_BASE_URL}/${queryName}`);
  return response.data;
};

export const executeQueryAPI = async (queryName: string, payload: any) => {
  const response = await axios.post(
    `${API_BASE_URL}/${queryName}/execute`,
    payload
  );
  return response.data;
};

export const createQueryAPI = async (queryData: any) => {
  const response = await axios.post(`${API_BASE_URL}`, queryData);
  return response.data;
};

export const updateQueryAPI = async (queryName: string, queryData: any) => {
  const response = await axios.put(`${API_BASE_URL}/${queryName}`, queryData);
  return response.data;
};

export const deleteQueryAPI = async (queryName: string) => {
  const response = await axios.delete(`${API_BASE_URL}/${queryName}`);
  return response.data;
};
