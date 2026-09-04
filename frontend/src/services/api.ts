import axios from 'axios';
import toast from 'react-hot-toast';

export const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || 'An error occurred';
    toast.error(message);
    return Promise.reject(error);
  }
);

// Auth endpoints
export const authApi = {
  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data),
  register: (data: { name: string; email: string; address: string; password: string }) =>
    api.post('/auth/register', data),
};

// Users endpoints
export const usersApi = {
  getAll: (params?: { name?: string; email?: string; address?: string; role?: string }) =>
    api.get('/users', { params }),
  getOne: (id: string) => api.get(`/users/${id}`),
  create: (data: any) => api.post('/users', data),
  update: (id: string, data: any) => api.put(`/users/${id}`, data),
  delete: (id: string) => api.delete(`/users/${id}`),
  updatePassword: (id: string, data: { currentPassword: string; newPassword: string }) =>
    api.put(`/users/${id}/password`, data),
  getStatistics: () => api.get('/users/statistics'),
};

// Stores endpoints
export const storesApi = {
  getAll: (params?: { name?: string; email?: string; address?: string }) =>
    api.get('/stores', { params }),
  getOne: (id: string) => api.get(`/stores/${id}`),
  create: (data: any) => api.post('/stores', data),
  update: (id: string, data: any) => api.put(`/stores/${id}`, data),
  delete: (id: string) => api.delete(`/stores/${id}`),
  getStatistics: () => api.get('/stores/statistics'),
};

// Ratings endpoints
export const ratingsApi = {
  create: (data: { rating: number; storeId: string }) => api.post('/ratings', data),
  update: (id: string, rating: number) => api.put(`/ratings/${id}`, { rating }),
  delete: (id: string) => api.delete(`/ratings/${id}`),
  getByStore: (storeId: string) => api.get(`/ratings/store/${storeId}`),
  getByUser: () => api.get('/ratings/user'),
  getStatistics: (storeId: string) => api.get(`/ratings/store/${storeId}/statistics`),
};