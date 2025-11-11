import axios from "axios";
import { API_CONFIG, buildApiUrl } from "../config/api.config";

const API_BASE_URL = buildApiUrl(API_CONFIG.PROXY_SERVICE_URL, "/api/v1");

export const createSolutionReviewAPI = async (
  data: any,
  systemCode: string
) => {
  const response = await axios.post(
    `${API_BASE_URL}/solution-review/${systemCode}`,
    data
  );
  return response.data;
};

export const saveSolutionReviewDraftAPI = async (data: any) => {
  const response = await axios.put(`${API_BASE_URL}/solution-review`, data);
  return response.data;
};

export const getSolutionReviewByIdAPI = async (id: string) => {
  const response = await axios.get(`${API_BASE_URL}/solution-review/${id}`);
  return response.data;
};

export const getAllSolutionReviewsAPI = async (page: number, size: number) => {
  const response = await axios.get(
    `${API_BASE_URL}/solution-review/paging?page=${page}&size=${size}`
  );
  return response.data;
};

export const getAllSystemsAPI = async (page: number, size: number) => {
  const response = await axios.get(
    `${API_BASE_URL}/solution-review/system-view?page=${page}&size=${size}`
  );
  return response.data;
};

export const getSystemSolutionReviewsAPI = async (systemCode: string) => {
  const response = await axios.get(
    `${API_BASE_URL}/solution-review/system?systemCode=${systemCode}`
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
    `${API_BASE_URL}/solution-review/existing/${systemCode}`
  );
  return response.data;
};

export const getSRsByStateAPI = async (
  state: string,
  page: number,
  size: number
) => {
  const response = await axios.get(
    `${API_BASE_URL}/solution-review/by-state?documentState=${state}&page=${page}&size=${size}`
  );
  return response.data;
};

export const addConcernsToSRAPI = async (data: any) => {
  const response = await axios.put(
    `${API_BASE_URL}/solution-review/concerns`,
    data
  );
  return response.data;
};

export const searchSRAPI = async (data: any) => {
  const response = await axios.post(
    `${API_BASE_URL}/solution-review/search`,
    data
  );
  return response.data;
}
