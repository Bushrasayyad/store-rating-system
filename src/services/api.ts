import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth endpoints
export const authApi = {
  register: (data: any) => api.post('/auth/register', data),
  login: (data: any) => api.post('/auth/login', data),
};

// Users endpoints
export const usersApi = {
  getAll: () => api.get('/users'),
  getOne: (id: string) => api.get(`/users/${id}`),
  update: (id: string, data: any) => api.put(`/users/${id}`, data),
  delete: (id: string) => api.delete(`/users/${id}`),
  updatePassword: (id: string, data: any) => api.put(`/users/${id}/password`, data),
};

// Stores endpoints
export const storesApi = {
  getAll: () => api.get('/stores'),
  getOne: (id: string) => api.get(`/stores/${id}`),
  create: (data: any) => api.post('/stores', data),
  update: (id: string, data: any) => api.put(`/stores/${id}`, data),
  delete: (id: string) => api.delete(`/stores/${id}`),
};

// Ratings endpoints
export const ratingsApi = {
  create: (data: any) => api.post('/ratings', data),
  update: (id: string, rating: number) => api.put(`/ratings/${id}`, { rating }),
  delete: (id: string) => api.delete(`/ratings/${id}`),
  getByStore: (storeId: string) => api.get(`/ratings/store/${storeId}`),
  getByUser: () => api.get('/ratings/user'),
  getStatistics: (storeId: string) => api.get(`/ratings/store/${storeId}/statistics`),
};