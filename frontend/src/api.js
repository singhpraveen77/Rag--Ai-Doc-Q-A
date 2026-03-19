import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000';

export const uploadPDF = (formData) => {
  return axios.post(`${API_BASE_URL}/upload`, formData);
};

export const askQuestion = (question) => {
  return axios.post(`${API_BASE_URL}/ask`, { question });
};