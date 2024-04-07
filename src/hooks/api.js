import axios from 'axios';
import { BASE_URL } from './authApi';

const api = axios.create({
  baseURL: BASE_URL,
});

export const createSchedule = async (userToken, formData) => {
  try {
    console.log('userToken', userToken);
    console.log('formData', formData);
    const response = await api.post('/create-schedule/', formData, {
        headers: {
          Authorization: `Bearer ${userToken}`,
          "Content-Type": "application/json",
        },});
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getAllClassroomNames = async (userToken) => {
  try {
    console.log('userToken', userToken);
    const response = await api.get('/classroom/', {
      headers: {
        Authorization: `Bearer ${userToken}`,
      },});
    return response.data;
  } catch (error) {
    throw error;
  }
};

export default api;
