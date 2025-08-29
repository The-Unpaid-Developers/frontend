import axios from 'axios';

const API_BASE_URL = 'https://your-api-url.com/api'; // Replace with your actual API base URL

export const createSolutionReview = async (data: any, systemCode: string) => {
  const response = await axios.post(`${API_BASE_URL}/solution-review/${systemCode}`, data);
  return response.data;
};

export const saveSolutionReviewDraft = async (data: any, systemCode: string) => {
  const response = await axios.put(`${API_BASE_URL}/solution-review/existing/${systemCode}`, data);
  return response.data;
};

export const getSolutionReview = async (id: string) => {
  const response = await axios.get(`${API_BASE_URL}/solution-review/${id}`);
  return response.data;
};

export const submitSolutionReviewDraft = async (id: string) => {
  const response = await axios.post(`${API_BASE_URL}/solution-review/${id}/submit-draft`);
  return response.data;
};