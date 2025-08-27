// API Configuration
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
  TIMEOUT: 30000,
  DEFAULT_HEADERS: {
    'Content-Type': 'application/json',
  },
} as const;

// Routes
export const ROUTES = {
  HOME: '/',
  DASHBOARD: '/dashboard',
  
  // Material Management
  MATERIALS: '/materials',
  MATERIALS_CREATE: '/materials/create',
  MATERIALS_EDIT: '/materials/:id/edit',
  MATERIALS_DETAIL: '/materials/:id',
  
  // Budget Management
  BUDGET: '/budget',
  BUDGET_PROJECTS: '/budget/projects',
  BUDGET_PROJECTS_CREATE: '/budget/projects/create',
  BUDGET_PROJECTS_EDIT: '/budget/projects/:id/edit',
  BUDGET_PROJECTS_DETAIL: '/budget/projects/:id',
  BUDGET_MATERIALS: '/budget/materials',
  
  // Material Output
  OUTPUT: '/output',
  OUTPUT_REQUESTS: '/output/requests',
  OUTPUT_REQUESTS_CREATE: '/output/requests/create',
  OUTPUT_REQUESTS_EDIT: '/output/requests/:id/edit',
  OUTPUT_REQUESTS_DETAIL: '/output/requests/:id',
  OUTPUT_HISTORY: '/output/history',
  
  // Reports
  REPORTS: '/reports',
  REPORTS_BUDGET: '/reports/budget',
  REPORTS_OUTPUT: '/reports/output',
  
  // Settings
  SETTINGS: '/settings',
  CATEGORIES: '/settings/categories',
} as const;

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
  LIMITS: [10, 20, 50, 100] as const,
} as const;

// Date formats
export const DATE_FORMATS = {
  DISPLAY: 'DD/MM/YYYY',
  DISPLAY_WITH_TIME: 'DD/MM/YYYY HH:mm',
  API: 'YYYY-MM-DD',
  API_WITH_TIME: 'YYYY-MM-DDTHH:mm:ss.SSSZ',
} as const;

// Status colors for UI
export const STATUS_COLORS = {
  // Budget Status
  DRAFT: 'bg-gray-100 text-gray-800',
  PENDING_APPROVAL: 'bg-yellow-100 text-yellow-800',
  APPROVED: 'bg-green-100 text-green-800',
  REJECTED: 'bg-red-100 text-red-800',
  COMPLETED: 'bg-blue-100 text-blue-800',
  
  // Project Status
  PLANNING: 'bg-purple-100 text-purple-800',
  IN_PROGRESS: 'bg-blue-100 text-blue-800',
  ON_HOLD: 'bg-orange-100 text-orange-800',
  CANCELLED: 'bg-red-100 text-red-800',
  
  // Output Status
  PENDING: 'bg-yellow-100 text-yellow-800',
  DELIVERED: 'bg-green-100 text-green-800',
  
  // Request Status
  SUBMITTED: 'bg-blue-100 text-blue-800',
  PARTIALLY_DELIVERED: 'bg-orange-100 text-orange-800',
} as const;

// Messages
export const MESSAGES = {
  SUCCESS: {
    CREATE: 'Tạo mới thành công',
    UPDATE: 'Cập nhật thành công', 
    DELETE: 'Xóa thành công',
    SAVE: 'Lưu thành công',
  },
  ERROR: {
    NETWORK: 'Lỗi kết nối mạng',
    SERVER: 'Lỗi server',
    VALIDATION: 'Dữ liệu không hợp lệ',
    NOT_FOUND: 'Không tìm thấy dữ liệu',
    UNAUTHORIZED: 'Không có quyền truy cập',
    FORBIDDEN: 'Truy cập bị từ chối',
  },
  CONFIRM: {
    DELETE: 'Bạn có chắc chắn muốn xóa?',
    CANCEL: 'Bạn có chắc chắn muốn hủy?',
    SAVE: 'Bạn có muốn lưu thay đổi?',
  }
} as const;

// Validation rules
export const VALIDATION = {
  MATERIAL_CODE: {
    MIN_LENGTH: 3,
    MAX_LENGTH: 20,
    PATTERN: /^[A-Z0-9-_]+$/,
  },
  MATERIAL_NAME: {
    MIN_LENGTH: 3,
    MAX_LENGTH: 100,
  },
  PROJECT_CODE: {
    MIN_LENGTH: 3,
    MAX_LENGTH: 30,
    PATTERN: /^[A-Z0-9-_]+$/,
  },
  QUANTITY: {
    MIN: 0,
    MAX: 999999999,
  },
  PRICE: {
    MIN: 0,
    MAX: 999999999999,
  }
} as const;
