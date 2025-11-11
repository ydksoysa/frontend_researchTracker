// src/constants/index.ts

export const APP_NAME = 'Research Project Tracker';
export const APP_VERSION = '1.0.0';

// API Configuration
export const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080/api';
export const API_TIMEOUT = 30000; // 30 seconds

// Authentication
export const TOKEN_KEY = 'token';
export const TOKEN_EXPIRY_BUFFER = 300; // 5 minutes in seconds

// Pagination
export const DEFAULT_PAGE_SIZE = 10;
export const PAGE_SIZE_OPTIONS = [5, 10, 20, 50];

// File Upload
export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
export const ALLOWED_FILE_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'image/jpeg',
  'image/png',
  'image/gif',
  'text/plain'
];

// Project Status
export const PROJECT_STATUS = {
  PLANNING: 'PLANNING',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED'
} as const;

export const PROJECT_STATUS_LABELS = {
  [PROJECT_STATUS.PLANNING]: 'Planning',
  [PROJECT_STATUS.IN_PROGRESS]: 'In Progress',
  [PROJECT_STATUS.COMPLETED]: 'Completed',
  [PROJECT_STATUS.CANCELLED]: 'Cancelled'
};

export const PROJECT_STATUS_COLORS = {
  [PROJECT_STATUS.PLANNING]: 'info',
  [PROJECT_STATUS.IN_PROGRESS]: 'primary',
  [PROJECT_STATUS.COMPLETED]: 'success',
  [PROJECT_STATUS.CANCELLED]: 'danger'
};

// Milestone Status
export const MILESTONE_STATUS = {
  PENDING: 'PENDING',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED'
} as const;

export const MILESTONE_STATUS_LABELS = {
  [MILESTONE_STATUS.PENDING]: 'Pending',
  [MILESTONE_STATUS.IN_PROGRESS]: 'In Progress',
  [MILESTONE_STATUS.COMPLETED]: 'Completed'
};

export const MILESTONE_STATUS_COLORS = {
  [MILESTONE_STATUS.PENDING]: 'warning',
  [MILESTONE_STATUS.IN_PROGRESS]: 'primary',
  [MILESTONE_STATUS.COMPLETED]: 'success'
};

// User Roles
export const USER_ROLES = {
  ADMIN: 'ADMIN',
  USER: 'USER',
  ROLE_ADMIN: 'ROLE_ADMIN',
  ROLE_USER: 'ROLE_USER'
} as const;

// Route Paths
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  PROJECTS: '/projects',
  PROJECT_DETAILS: '/projects/:id',
  MILESTONES: '/milestones',
  DOCUMENTS: '/documents',
  ADMIN: '/admin'
};

// Date Formats
export const DATE_FORMAT = 'YYYY-MM-DD';
export const DISPLAY_DATE_FORMAT = 'MMM DD, YYYY';
export const DATETIME_FORMAT = 'YYYY-MM-DD HH:mm:ss';

// Messages
export const MESSAGES = {
  // Success Messages
  LOGIN_SUCCESS: 'Login successful!',
  REGISTER_SUCCESS: 'Registration successful! Please login.',
  PROJECT_CREATED: 'Project created successfully!',
  PROJECT_UPDATED: 'Project updated successfully!',
  PROJECT_DELETED: 'Project deleted successfully!',
  MILESTONE_CREATED: 'Milestone created successfully!',
  MILESTONE_UPDATED: 'Milestone updated successfully!',
  MILESTONE_DELETED: 'Milestone deleted successfully!',
  DOCUMENT_UPLOADED: 'Document uploaded successfully!',
  DOCUMENT_DELETED: 'Document deleted successfully!',
  
  // Error Messages
  LOGIN_FAILED: 'Login failed. Please check your credentials.',
  REGISTER_FAILED: 'Registration failed. Please try again.',
  NETWORK_ERROR: 'Network error. Please check your connection.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  SESSION_EXPIRED: 'Your session has expired. Please login again.',
  SOMETHING_WENT_WRONG: 'Something went wrong. Please try again.',
  
  // Validation Messages
  REQUIRED_FIELD: 'This field is required.',
  INVALID_EMAIL: 'Please enter a valid email address.',
  PASSWORD_MIN_LENGTH: 'Password must be at least 6 characters.',
  PASSWORDS_NOT_MATCH: 'Passwords do not match.',
  INVALID_DATE: 'Please enter a valid date.',
  FILE_TOO_LARGE: 'File size exceeds the maximum limit.',
  INVALID_FILE_TYPE: 'Invalid file type.',
  
  // Confirmation Messages
  CONFIRM_DELETE: 'Are you sure you want to delete this item?',
  CONFIRM_LOGOUT: 'Are you sure you want to logout?'
};

// Local Storage Keys
export const STORAGE_KEYS = {
  TOKEN: 'token',
  USER: 'user',
  THEME: 'theme',
  LANGUAGE: 'language'
};

// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500
};

// Regex Patterns
export const REGEX_PATTERNS = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PASSWORD: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{6,}$/,
  PHONE: /^[0-9]{10}$/,
  URL: /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/
};