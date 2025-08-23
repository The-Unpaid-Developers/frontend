import axios from 'axios';

const API_BASE_URL = 'https://your-api-url.com/api'; // Replace with your actual API base URL

export const saveSolutionReview = async (data: any) => {
  console.log("Saving solution review:", data);
  const response = await axios.post(`${API_BASE_URL}/solution-review`, data);
  return response.data;
};

export const getSolutionReview = async (id: string) => {
  const response = await axios.get(`${API_BASE_URL}/solution-review/${id}`);
  return response.data;
};
