import axios from "axios";
import { API_CONFIG, buildApiUrl } from "../config/api.config";

const API_BASE_URL = buildApiUrl(API_CONFIG.CORE_SERVICE_URL, "/api/v1/solution-review");

export const createSolutionReviewAPI = async (
  data: any,
  systemCode: string
) => {
  const response = await axios.post(
    `${API_BASE_URL}/${systemCode}`,
    data
  );
  return response.data;
};

export const saveSolutionReviewDraftAPI = async (data: any) => {
  const response = await axios.put(`${API_BASE_URL}`, data);
  return response.data;
};

export const getSolutionReviewByIdAPI = async (id: string) => {
  const response = await axios.get(`${API_BASE_URL}/${id}`);
  return response.data;
};

export const getAllSolutionReviewsAPI = async (page: number, size: number) => {
  const response = await axios.get(
    `${API_BASE_URL}/paging?page=${page}&size=${size}`
  );
  return response.data;
};

export const getAllSystemsAPI = async (page: number, size: number) => {
  const response = await axios.get(
    `${API_BASE_URL}/system-view?page=${page}&size=${size}`
  );
  return response.data;
};

export const getSystemSolutionReviewsAPI = async (systemCode: string) => {
  const response = await axios.get(
    `${API_BASE_URL}/system?systemCode=${systemCode}`
  );
  return response.data;
};

export const transitionSolutionReviewStateAPI = async (data: any) => {
  const response = await axios.post(
    `${API_BASE_URL}/lifecycle/transition`,
    data
  );
  return response.data;
};

export const createSRFromExistingAPI = async (systemCode: string) => {
  const response = await axios.post(
    `${API_BASE_URL}/existing/${systemCode}`
  );
  return response.data;
};

export const getSRsByStateAPI = async (
  state: string,
  page: number,
  size: number
) => {
  const response = await axios.get(
    `${API_BASE_URL}/by-state?documentState=${state}&page=${page}&size=${size}`
  );
  return response.data;
};

export const addConcernsToSRAPI = async (data: any) => {
  const response = await axios.put(
    `${API_BASE_URL}/concerns`,
    data
  );
  return response.data;
};

export const searchSRAPI = async (data: any) => {
  const response = await axios.post(
    `${API_BASE_URL}/search`,
    data
  );
  return response.data;
}
