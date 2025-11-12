// src/services/api.ts
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Toggle this to true to use mock data (no backend needed)
// Set to false to use the real backend at http://localhost:8080/api
const USE_MOCK_API = false;

// When in mock mode, persist mock users to localStorage so registration survives reloads
const MOCK_USERS_KEY = 'mockUsers_storage_v1';

function loadMockUsers(): any[] {
  try {
    const raw = localStorage.getItem(MOCK_USERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

function saveMockUsers(users: any[]) {
  try {
    localStorage.setItem(MOCK_USERS_KEY, JSON.stringify(users));
  } catch (e) {
    // ignore
  }
}

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
    USE_MOCK_API ? mockSignup(data) : api.post('/auth/signup', data),
  login: (data: { username: string; password: string }) =>
    USE_MOCK_API ? mockLogin(data) : api.post('/auth/login', data),
};

// Mock user storage (persisted)
const mockUsers: any[] = USE_MOCK_API ? loadMockUsers() : [];

function mockSignup(data: { username: string; email: string; password: string; role?: string }) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const userExists = mockUsers.some(u => u.username === data.username || u.email === data.email);
      if (userExists) {
        reject({ response: { data: { message: 'Username or email already exists' } } });
      } else {
  // assign id and createdAt
  const user = { id: (Date.now() + Math.random()).toString(), ...data, createdAt: new Date().toISOString() };
  mockUsers.push(user);
  saveMockUsers(mockUsers);
  resolve({ data: { message: 'User registered successfully', user } });
      }
    }, 800);
  });
}

function mockLogin(data: { username: string; password: string }) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
        const user = mockUsers.find(u => u.username === data.username && u.password === data.password);
        if (user) {
          // create a simple mock JWT payload (not secure) containing role if present
          const payload = {
            sub: user.id,
            username: user.username,
            email: user.email,
            role: user.role || 'MEMBER',
            iat: Math.floor(Date.now() / 1000),
            exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24
          };
          const token = btoa(JSON.stringify({ alg: 'none', typ: 'JWT' })) + '.' + btoa(JSON.stringify(payload)) + '.signature';
          localStorage.setItem('token', token);
          resolve({ data: { token, user: { username: user.username, email: user.email, role: user.role } } });
      } else {
        reject({ response: { data: { message: 'Invalid credentials' } } });
      }
    }, 800);
  });
}

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

// User API (admin)
export const userAPI = {
  getAll: () => api.get('/users'),
  getById: (id: string) => api.get(`/users/${id}`),
  delete: (id: string) => api.delete(`/users/${id}`),
  // future: create/update users
};

export default api;