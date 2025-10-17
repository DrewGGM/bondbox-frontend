import type {
  Transaction,
  CreateTransactionRequest,
  UpdateTransactionRequest,
  TransactionFilters,
  Category,
  CreateCategoryRequest,
  BudgetLimit,
  CreateBudgetLimitRequest,
  UpdateBudgetLimitRequest,
  BudgetStatus,
  Report,
  HealthCheck,
  PaginatedResponse,
} from '@/types/finance.types';
import httpInstance from '@/utils/httpInstance';

import credentialManager from '@/utils/credentialManager';

// Create axios instance
const financeApi = httpInstance;

// Request interceptor to add auth token
financeApi.interceptors.request.use((config) => {
  const token =
    credentialManager.token

  if (!token) {
    throw new Error(
      'Authentication token is required. Please check VITE_HARDCODED_JWT_TOKEN environment variable or login.'
    );
  }

  config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Response interceptor for error handling
financeApi.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('Finance API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// Health Check
export const healthCheck = async (): Promise<HealthCheck> => {
  const response = await financeApi.get('/health');
  return response.data;
};

// Transaction Services
export const transactionService = {
  // Create transaction
  create: async (data: CreateTransactionRequest): Promise<Transaction> => {
    const response = await financeApi.post('/transactions', data);
    return response.data;
  },

  // Get transaction by ID
  getById: async (id: string): Promise<Transaction> => {
    const response = await financeApi.get(`/transactions/${id}`);
    return response.data;
  },

  // Update transaction
  update: async (
    id: string,
    data: UpdateTransactionRequest,
    groupId: string
  ): Promise<Transaction> => {
    const response = await financeApi.put(
      `/transactions/${id}?groupId=${groupId}`,
      data
    );
    return response.data;
  },

  // Delete transaction
  delete: async (id: string, groupId: string): Promise<void> => {
    await financeApi.delete(`/transactions/${id}?groupId=${groupId}`);
  },

  // List transactions for a group
  list: async (
    groupId: string,
    filters?: TransactionFilters
  ): Promise<PaginatedResponse<Transaction>> => {
    const params = new URLSearchParams();

    if (filters?.category_id) params.append('category_id', filters.category_id);
    if (filters?.type) params.append('type', filters.type);
    if (filters?.limit) params.append('limit', filters.limit.toString());
    if (filters?.offset) params.append('offset', filters.offset.toString());
    if (filters?.start_date) params.append('start_date', filters.start_date);
    if (filters?.end_date) params.append('end_date', filters.end_date);

    const response = await financeApi.get(
      `/groups/${groupId}/transactions?${params.toString()}`
    );
    return response.data;
  },
};

// Category Services
export const categoryService = {
  // Create category
  create: async (data: CreateCategoryRequest): Promise<Category> => {
    const response = await financeApi.post('/categories', data);
    return response.data;
  },

  // Get category by ID
  getById: async (id: string): Promise<Category> => {
    const response = await financeApi.get(`/categories/${id}`);
    return response.data;
  },

  // Get category by name
  getByName: async (groupId: string, name: string): Promise<Category> => {
    const response = await financeApi.get(
      `/groups/${groupId}/categories/${encodeURIComponent(name)}`
    );
    return response.data;
  },

  // Update category
  update: async (
    id: string,
    data: Partial<CreateCategoryRequest>,
    groupId: string
  ): Promise<Category> => {
    const response = await financeApi.put(
      `/categories/${id}?groupId=${groupId}`,
      data
    );
    return response.data;
  },

  // Delete category
  delete: async (id: string, groupId: string): Promise<void> => {
    await financeApi.delete(`/categories/${id}?groupId=${groupId}`);
  },

  // List categories for a group
  list: async (
    groupId: string
  ): Promise<{ categories: Category[]; count: number }> => {
    const response = await financeApi.get(`/groups/${groupId}/categories`);
    return response.data;
  },
};

// Budget Services
export const budgetService = {
  // Create budget limit
  create: async (data: CreateBudgetLimitRequest): Promise<BudgetLimit> => {
    const response = await financeApi.post('/budget-limits', data);
    return response.data;
  },

  // Update budget limit
  update: async (
    id: string,
    data: UpdateBudgetLimitRequest,
    groupId: string
  ): Promise<BudgetLimit> => {
    const response = await financeApi.put(
      `/budget-limits/${id}?groupId=${groupId}`,
      data
    );
    return response.data;
  },

  // Delete budget limit
  delete: async (id: string, groupId: string): Promise<void> => {
    await financeApi.delete(`/budget-limits/${id}?groupId=${groupId}`);
  },

  // List budget limits for a group
  list: async (
    groupId: string
  ): Promise<{ budget_limits: BudgetLimit[]; count: number }> => {
    const response = await financeApi.get(`/groups/${groupId}/budget-limits`);
    return response.data;
  },

  // Get budget status
  getStatus: async (
    groupId: string
  ): Promise<{ budget_statuses: BudgetStatus[]; count: number }> => {
    const response = await financeApi.get(
      `/groups/${groupId}/budget-limits/status`
    );
    return response.data;
  },
};

// Report Services
export const reportService = {
  // Get monthly report
  getMonthly: async (
    groupId: string,
    year?: number,
    month?: number
  ): Promise<Report> => {
    const params = new URLSearchParams();
    if (year) params.append('year', year.toString());
    if (month) params.append('month', month.toString());

    const response = await financeApi.get(
      `/groups/${groupId}/reports/monthly?${params.toString()}`
    );
    return response.data;
  },

  // Get weekly report
  getWeekly: async (groupId: string): Promise<Report> => {
    const response = await financeApi.get(`/groups/${groupId}/reports/weekly`);
    return response.data;
  },

  // Get yearly report
  getYearly: async (groupId: string, year?: number): Promise<Report> => {
    const params = new URLSearchParams();
    if (year) params.append('year', year.toString());

    const response = await financeApi.get(
      `/groups/${groupId}/reports/yearly?${params.toString()}`
    );
    return response.data;
  },

  // Export report
  export: async (
    groupId: string,
    data: {
      report_type: 'monthly' | 'yearly';
      format: 'pdf' | 'excel';
      year: number;
      month?: number;
    }
  ): Promise<Blob> => {
    const response = await financeApi.post(
      `/groups/${groupId}/reports/export`,
      data,
      {
        responseType: 'blob',
      }
    );
    return response.data;
  },
};

// Utility functions
export const financeUtils = {
  // Format currency
  formatCurrency: (amount: number, currency: string = 'COP'): string => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  },

  // Format date
  formatDate: (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  },

  // Get relative date
  getRelativeDate: (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return 'Hoy';
    if (diffDays === 2) return 'Ayer';
    if (diffDays <= 7) return `${diffDays - 1} días atrás`;

    return date.toLocaleDateString('es-CO', {
      month: 'short',
      day: 'numeric',
    });
  },

  // Get category icon
  getCategoryIcon: (categoryName: string): string => {
    const icons: Record<string, string> = {
      alimentacion: '🛒',
      supermercado: '🛒',
      transporte: '⛽',
      gasolina: '⛽',
      hogar: '🏠',
      casa: '🏠',
      entretenimiento: '🎮',
      salud: '🏥',
      medicina: '🏥',
      educacion: '📚',
      salario: '💰',
      ingreso: '💰',
      otros: '💳',
      imprevistos: '⚠️',
    };

    const lowerName = categoryName.toLowerCase();
    return icons[lowerName] || '💳';
  },

  // Get category color
  getCategoryColor: (category: Category): string => {
    return category.color || '#6B7280';
  },
};

export default {
  healthCheck,
  transactionService,
  categoryService,
  budgetService,
  reportService,
  financeUtils,
};
