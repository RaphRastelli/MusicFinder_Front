import axiosInstance from './axiosInstance.js';

// POST car on envoie un body avec plusieurs critères
// (une requête GET ne peut pas avoir de body en HTTP)
export const searchMusicians = (searchParams) =>
  axiosInstance.post('/api/search', searchParams);