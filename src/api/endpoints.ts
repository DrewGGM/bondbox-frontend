export const ENDPOINTS = {
  HEALTH: '/api/v1/health',
  AI: {
    QUERY: '/api/v1/query',
  },
  AUTH: {
    LOGIN: '/api/auth/login',
    REGISTER: '/api/auth/register',
    LOGOUT: '/api/auth/logout',
    PROFILE: '/api/auth/profile',
  },
  FINANCE: {
    TRANSACTIONS: '/api/finance/transactions',
    CATEGORIES: '/api/finance/categories',
    REPORTS: '/api/finance/reports',
    BUDGET_LIMITS: '/api/finance/budget-limits',
  },
  TASKS: {
    LIST: '/api/tasks',
    CREATE: '/api/tasks',
    UPDATE: (id: string) => `/api/tasks/${id}`,
    DELETE: (id: string) => `/api/tasks/${id}`,
  },
  CALENDAR: {
    EVENTS: '/api/calendar/events',
  },
  INVENTORY: {
    PRODUCTS: '/api/inventory/products',
    SHOPPING_LIST: '/api/inventory/shopping-list',
  },
  AI: {
    CHAT: '/api/ai/chat',
    SUGGESTIONS: '/api/ai/suggestions',
  },
  GROUPS: {
    LIST: '/api/groups',
    MEMBERS: (groupId: string) => `/api/groups/${groupId}/members`,
    INVITATIONS: '/api/groups/invitations',
  },
  BITACORA: {
    MOMENTS: '/api/bitacora/moments',
    ALBUMS: '/api/bitacora/albums',
  },
  COMMUNICATION: {
    MESSAGES: '/api/communication/messages',
    NOTIFICATIONS: '/api/communication/notifications',
  },
};
