import axiosInstance from './axiosInstance.js';

export const login = (email, password) => {
  return axiosInstance.post('/api/auth/login', { email, password });
};

export const register = (username, email, password) => {
  return axiosInstance.post('/api/auth/register', { username, email, password });
};