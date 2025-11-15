import type {
  Task,
  TaskListItem,
  CreateTaskRequest,
  UpdateTaskStatusRequest,
  CompleteTaskRequest,
  Reward,
  CreateRewardRequest,
  Notification,
  CalendarEvent,
  CreateCalendarEventRequest,
  TaskStatus,
} from '@/types/task.types';
import axios from 'axios';
import { STORAGE_KEYS } from '@/config/storageKeys';

// Create HTTP instance for task service
const BASE_URL =
  import.meta.env.VITE_API_GATEWAY_URL ||
  (window as any).ENV?.VITE_API_GATEWAY_URL;

const taskApi = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token interceptor
taskApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
taskApi.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('Task API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// ==================== TASK SERVICES ====================

export const taskService = {
  /**
   * Create a new task
   * POST /tasks
   */
  create: async (data: CreateTaskRequest): Promise<Task> => {
    const response = await taskApi.post('/tasks', data);
    return response.data;
  },

  /**
   * Get task by ID
   * GET /tasks/{taskId}
   */
  getById: async (taskId: string): Promise<TaskListItem> => {
    const response = await taskApi.get(`/tasks/${taskId}`);
    return response.data;
  },

  /**
   * Get tasks by group
   * GET /tasks?groupId={groupId}&status={status}
   * @param groupId - Mandatory group ID
   * @param status - Optional status filter (e.g., 'pendiente', 'en progreso', 'completada')
   */
  listByGroup: async (
    groupId: string,
    status?: TaskStatus
  ): Promise<TaskListItem[]> => {
    let url = `/tasks?groupId=${groupId}`;
    if (status) {
      url += `&status=${status}`;
    }
    const response = await taskApi.get(url);
    return response.data;
  },

  /**
   * Update task status
   * PATCH /tasks/{taskId}/status
   */
  updateStatus: async (
    taskId: string,
    data: UpdateTaskStatusRequest
  ): Promise<Task> => {
    const response = await taskApi.patch(`/tasks/${taskId}/status`, data);
    return response.data;
  },

  /**
   * Complete task
   * POST /tasks/{taskId}/complete
   */
  complete: async (
    taskId: string,
    data: CompleteTaskRequest
  ): Promise<TaskListItem> => {
    const response = await taskApi.put(`/tasks/${taskId}/complete`, data);
    return response.data;
  },
};

// ==================== REWARD SERVICES ====================

export const rewardService = {
  /**
   * Assign reward to authenticated user
   * POST /rewards
   * The userId is obtained from the JWT token
   */
  assign: async (data: CreateRewardRequest): Promise<Reward> => {
    const response = await taskApi.post('/rewards', data);
    return response.data;
  },

  /**
   * Get all rewards for authenticated user
   * GET /rewards
   * The userId is obtained from the JWT token
   */
  list: async (): Promise<Reward[]> => {
    const response = await taskApi.get('/rewards');
    return response.data;
  },
};

// ==================== NOTIFICATION SERVICES ====================

export const notificationService = {
  /**
   * Send notification for a specific task
   * POST /notifications/task/{taskId}
   */
  sendTaskNotification: async (taskId: string): Promise<void> => {
    await taskApi.post(`/notifications/task/${taskId}`);
  },

  /**
   * Get all notifications for authenticated user
   * GET /notifications
   * The userId is obtained from the JWT token
   */
  list: async (): Promise<Notification[]> => {
    const response = await taskApi.get('/notifications');
    return response.data;
  },
};

// ==================== CALENDAR SERVICES ====================

export const calendarService = {
  /**
   * Get global calendar (all events)
   * GET /calendar
   */
  getGlobalCalendar: async (): Promise<CalendarEvent[]> => {
    const response = await taskApi.get('/calendar');
    return response.data;
  },

  /**
   * Create a new calendar event
   * POST /calendar/events
   * The userId is obtained from the JWT token
   */
  createEvent: async (data: CreateCalendarEventRequest): Promise<CalendarEvent> => {
    const response = await taskApi.post('/calendar/events', data);
    return response.data;
  },

  /**
   * Get all events for authenticated user
   * GET /calendar/events
   * The userId is obtained from the JWT token
   */
  getUserEvents: async (): Promise<CalendarEvent[]> => {
    const response = await taskApi.get('/calendar/events');
    return response.data;
  },

};

// Export all services as a single object for convenience
export const TaskAPI = {
  tasks: taskService,
  rewards: rewardService,
  notifications: notificationService,
  calendar: calendarService,
};

export default TaskAPI;
