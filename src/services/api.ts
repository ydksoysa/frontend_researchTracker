// src/services/api.ts
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  signup: (data: { username: string; email: string; password: string; role?: string }) =>
    api.post('/auth/signup', data),
  login: (data: { username: string; password: string }) =>
    api.post('/auth/login', data),
};

// Project API
export const projectAPI = {
  getAll: () => api.get('/projects'),
  getById: (id: string) => api.get(`/projects/${id}`),
  create: (data: any) => api.post('/projects', data),
  update: (id: string, data: any) => api.put(`/projects/${id}`, data),
  delete: (id: string) => api.delete(`/projects/${id}`),
};

// Milestone API
export const milestoneAPI = {
  getAll: () => api.get('/milestones'),
  getByProject: (projectId: string) => api.get(`/milestones/project/${projectId}`),
  getById: (id: string) => api.get(`/milestones/${id}`),
  create: (data: any) => api.post('/milestones', data),
  update: (id: string, data: any) => api.put(`/milestones/${id}`, data),
  delete: (id: string) => api.delete(`/milestones/${id}`),
};

// Document API
export const documentAPI = {
  getAll: () => api.get('/documents'),
  getByProject: (projectId: string) => api.get(`/documents/project/${projectId}`),
  upload: (formData: FormData) => api.post('/documents/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  download: (id: string) => api.get(`/documents/${id}/download`, { responseType: 'blob' }),
  delete: (id: string) => api.delete(`/documents/${id}`),
};

export default api;