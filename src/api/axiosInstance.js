import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://localhost:7274',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur de requête :
// Avant chaque appel API, on récupère le token dans le localStorage
// et on l'ajoute automatiquement dans le header Authorization
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosInstance;