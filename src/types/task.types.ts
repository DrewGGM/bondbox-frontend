// Task Types based on Task Service API

// Task Priority enum
export type TaskPriority = 'alta' | 'media' | 'baja';

// Task Status enum
export type TaskStatus = 'pendiente' | 'en progreso' | 'completada';

// Task List Item (simplified response from GET /tasks)
export interface TaskListItem {
  id: number;
  title: string;
  status: TaskStatus;
  priority: TaskPriority;
  deadline: string; // ISO 8601 format
  assigned_to: string | null; // User ID or null
}

// Task interface
export interface Task {
  id: string;
  groupId: string;
  userId: string;
  title: string;
  description?: string;
  priority: TaskPriority;
  notes?: string;
  startDate?: string; // ISO 8601 format
  deadline: string; // ISO 8601 format
  status: TaskStatus;
  createdAt: string;
  updatedAt: string;
}

// Create Task Request
export interface CreateTaskRequest {
  groupId: string;
  title: string;
  description?: string;
  priority: TaskPriority;
  notes?: string;
  startDate?: string; // ISO 8601 format
  deadline: string; // ISO 8601 format
  assignedTo?: string; // User ID to assign the task to
}

// Update Task Request
export interface UpdateTaskRequest {
  title?: string;
  description?: string;
  priority?: TaskPriority;
  notes?: string;
  startDate?: string;
  deadline?: string;
}

// Update Task Status Request
export interface UpdateTaskStatusRequest {
  status: TaskStatus;
  groupId: string;
}

// Complete Task Request
export interface CompleteTaskRequest {
  groupId: string;
}

// Reward interface
export interface Reward {
  points: number;
  badge: string;
  created_at: string; // ISO 8601 format
}

// Create Reward Request
export interface CreateRewardRequest {
  points: number;
  badge?: string;
}

// Notification interface
export interface Notification {
  id: string;
  userId: string;
  taskId?: string;
  message: string;
  read: boolean;
  createdAt: string;
}

// Calendar Event interface
export interface CalendarEvent {
  id: number;
  title: string;
  description: string;
  event_date: string; // ISO 8601 format
  user_id: string;
  created_at: string; // ISO 8601 format
}

// Create Calendar Event Request
export interface CreateCalendarEventRequest {
  title: string;
  description?: string;
  date: string; // ISO 8601 format
  user_id?: string; // Optional: assign event to specific user
}

// API Response wrappers
export interface TaskResponse {
  success: boolean;
  data: Task;
  message?: string;
}

export interface TaskListResponse {
  success: boolean;
  data: Task[];
  message?: string;
}

export interface RewardResponse {
  success: boolean;
  data: Reward;
  message?: string;
}

export interface RewardListResponse {
  success: boolean;
  data: Reward[];
  message?: string;
}

export interface NotificationListResponse {
  success: boolean;
  data: Notification[];
  message?: string;
}

export interface CalendarEventResponse {
  success: boolean;
  data: CalendarEvent;
  message?: string;
}

export interface CalendarEventListResponse {
  success: boolean;
  data: CalendarEvent[];
  message?: string;
}

export interface SyncResponse {
  success: boolean;
  message: string;
}
