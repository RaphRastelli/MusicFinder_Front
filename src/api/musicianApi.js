import axiosInstance from './axiosInstance.js';

export const saveInstrumentPrincipal = (instrumentId) =>
  axiosInstance.put('/api/musicians/me/instrument-principal', { instrumentId });

export const saveInstrumentsSecondaires = (instrumentIds) =>
  axiosInstance.put('/api/musicians/me/instruments-secondaires', { instrumentIds });

export const saveNiveau = (ability) =>
  axiosInstance.patch('/api/musicians/me/niveau', { ability });

export const saveProjectTypes = (projectTypeIds) =>
  axiosInstance.put('/api/musicians/me/project-types', { projectTypeIds });

export const saveDisponibilite = (availability) =>
  axiosInstance.patch('/api/musicians/me/disponibilite', { availability });

export const saveLocations = (locationIds) =>
  axiosInstance.put('/api/musicians/me/locations', { locationIds });

export const saveStylePrincipal = (styleId) =>
  axiosInstance.put('/api/musicians/me/style-principal', { styleId });

export const saveStylesSecondaires = (styleIds) =>
  axiosInstance.put('/api/musicians/me/styles-secondaires', { styleIds });

export const saveDescription = (description) =>
  axiosInstance.patch('/api/musicians/me/description', { description });