import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/v1'; // Replace with your actual API base URL

export const createSolutionReview = async (data: any, systemCode: string) => {
  const response = await axios.post(`${API_BASE_URL}/solution-review/${systemCode}`, data);
  return response.data;
};

export const saveSolutionReviewDraft = async (data: any) => {
  const response = await axios.put(`${API_BASE_URL}/solution-review`, data);
  return response.data;
};

export const getSolutionReviewById = async (id: string) => {
  const response = await axios.get(`${API_BASE_URL}/solution-review/${id}`);
  return response.data;
};

export const getAllSolutionReviews = async (page: number, size: number) => {
  const response = await axios.get(`${API_BASE_URL}/solution-review/paging?page=${page}&size=${size}`);
  return response.data;
};

export const getAllSystems = async (page: number, size: number) => {
  const response = await axios.get(`${API_BASE_URL}/solution-review/system-view?page=${page}&size=${size}`);
  // const response = await axios.get(`${API_BASE_URL}/solution-review/paging?page=${page}&size=${size}`);
  return response.data;
};

export const getSystemSolutionReviews = async (systemCode: string) => {
  const response = await axios.get(`${API_BASE_URL}/solution-review/system?systemCode=${systemCode}`);
  return response.data;
};

export const updateSolutionReviewState = async (data: any) => {
  const response = await axios.post(`${API_BASE_URL}/lifecycle/transition`, data);
  return response.data;
};

export const createSRFromExistingAPI = async (systemCode: string) => {
  const response = await axios.post(`${API_BASE_URL}/solution-review/existing/${systemCode}`);
  return response.data;
}