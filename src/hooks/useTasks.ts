import { useState, useEffect, useCallback } from 'react';
import { taskService, rewardService, notificationService, calendarService } from '@/api/services/taskService';
import { GroupsServiceImp } from '@/api/services/groupService';
import type {
  TaskListItem,
  CreateTaskRequest,
  UpdateTaskStatusRequest,
  CompleteTaskRequest,
  TaskStatus,
  Reward,
  CreateRewardRequest,
  Notification,
  CalendarEvent,
  CreateCalendarEventRequest,
} from '@/types/task.types';
import type { UsersGroupInformation } from '@/types/groups.types';

interface UseTasksState {
  // Tasks
  tasks: TaskListItem[];
  // Rewards
  rewards: Reward[];
  // Notifications
  notifications: Notification[];
  // Calendar
  calendarEvents: CalendarEvent[];
  userEvents: CalendarEvent[];
  // Group Members
  groupMembers: UsersGroupInformation[];
  // Common
  loading: boolean;
  error: string | null;
}

interface UseTasksActions {
  // Task actions
  createTask: (data: CreateTaskRequest) => Promise<void>;
  updateTaskStatus: (taskId: string, data: UpdateTaskStatusRequest) => Promise<void>;
  completeTask: (taskId: string, data: CompleteTaskRequest) => Promise<void>;
  loadTasks: (status?: TaskStatus) => Promise<void>;

  // Reward actions
  assignReward: (data: CreateRewardRequest) => Promise<void>;
  loadRewards: () => Promise<void>;

  // Notification actions
  sendTaskNotification: (taskId: string) => Promise<void>;
  loadNotifications: () => Promise<void>;

  // Calendar actions
  createEvent: (data: CreateCalendarEventRequest) => Promise<void>;
  loadGlobalCalendar: () => Promise<void>;
  loadUserEvents: () => Promise<void>;

  // Group actions
  loadGroupMembers: () => Promise<void>;

  // Common actions
  clearError: () => void;
}

export const useTasks = (groupId?: string): UseTasksState & UseTasksActions => {
  const groupService = new GroupsServiceImp();

  const [state, setState] = useState<UseTasksState>({
    tasks: [],
    rewards: [],
    notifications: [],
    calendarEvents: [],
    userEvents: [],
    groupMembers: [],
    loading: false,
    error: null,
  });

  const setLoading = (loading: boolean) => {
    setState(prev => ({ ...prev, loading }));
  };

  const setError = (error: string | null) => {
    setState(prev => ({ ...prev, error }));
  };

  // ==================== TASK ACTIONS ====================

  // Load tasks
  const loadTasks = useCallback(async (status?: TaskStatus) => {
    if (!groupId) return;

    setLoading(true);
    setError(null);

    try {
      const response = await taskService.listByGroup(groupId, status);
      setState(prev => ({
        ...prev,
        tasks: response || []
      }));
    } catch (error: any) {
      setError(error.response?.data?.message || 'Error al cargar tareas');
    } finally {
      setLoading(false);
    }
  }, [groupId]);

  // Create task
  const createTask = useCallback(async (data: CreateTaskRequest) => {
    if (!groupId) return;

    setError(null);

    try {
      await taskService.create(data);
      await loadTasks(); // Reload list after creating
    } catch (error: any) {
      setError(error.response?.data?.message || 'Error al crear tarea');
      throw error;
    }
  }, [groupId, loadTasks]);

  // Update task status
  const updateTaskStatus = useCallback(async (taskId: string, data: UpdateTaskStatusRequest) => {
    if (!groupId) return;

    setError(null);

    try {
      await taskService.updateStatus(taskId, data);
      await loadTasks(); // Reload list after updating
    } catch (error: any) {
      setError(error.response?.data?.message || 'Error al actualizar estado de tarea');
      throw error;
    }
  }, [groupId, loadTasks]);

  // Complete task
  const completeTask = useCallback(async (taskId: string, data: CompleteTaskRequest) => {
    if (!groupId) return;

    setError(null);

    try {
      await taskService.complete(taskId, data);
      await loadTasks(); // Reload list after completing
    } catch (error: any) {
      setError(error.response?.data?.message || 'Error al completar tarea');
      throw error;
    }
  }, [groupId, loadTasks]);

  // ==================== REWARD ACTIONS ====================

  // Load rewards
  const loadRewards = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await rewardService.list();
      setState(prev => ({
        ...prev,
        rewards: response || []
      }));
    } catch (error: any) {
      setError(error.response?.data?.message || 'Error al cargar recompensas');
    } finally {
      setLoading(false);
    }
  }, []);

  // Assign reward
  const assignReward = useCallback(async (data: CreateRewardRequest) => {
    setError(null);

    try {
      await rewardService.assign(data);
      await loadRewards(); // Reload list after assigning
    } catch (error: any) {
      setError(error.response?.data?.message || 'Error al asignar recompensa');
      throw error;
    }
  }, [loadRewards]);

  // ==================== NOTIFICATION ACTIONS ====================

  // Load notifications
  const loadNotifications = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await notificationService.list();
      setState(prev => ({
        ...prev,
        notifications: response || []
      }));
    } catch (error: any) {
      setError(error.response?.data?.message || 'Error al cargar notificaciones');
    } finally {
      setLoading(false);
    }
  }, []);

  // Send task notification
  const sendTaskNotification = useCallback(async (taskId: string) => {
    setError(null);

    try {
      await notificationService.sendTaskNotification(taskId);
      await loadNotifications(); // Reload list after sending
    } catch (error: any) {
      setError(error.response?.data?.message || 'Error al enviar notificación');
      throw error;
    }
  }, [loadNotifications]);

  // ==================== CALENDAR ACTIONS ====================

  // Load global calendar
  const loadGlobalCalendar = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await calendarService.getGlobalCalendar();
      setState(prev => ({
        ...prev,
        calendarEvents: response || []
      }));
    } catch (error: any) {
      setError(error.response?.data?.message || 'Error al cargar calendario global');
    } finally {
      setLoading(false);
    }
  }, []);

  // Load user events
  const loadUserEvents = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await calendarService.getUserEvents();
      setState(prev => ({
        ...prev,
        userEvents: response || []
      }));
    } catch (error: any) {
      setError(error.response?.data?.message || 'Error al cargar eventos del usuario');
    } finally {
      setLoading(false);
    }
  }, []);

  // Create event
  const createEvent = useCallback(async (data: CreateCalendarEventRequest) => {
    setError(null);

    try {
      await calendarService.createEvent(data);
      await loadUserEvents(); // Reload user events after creating
    } catch (error: any) {
      setError(error.response?.data?.message || 'Error al crear evento');
      throw error;
    }
  }, [loadUserEvents]);

  // Send event reminder


  // ==================== GROUP ACTIONS ====================

  // Load group members
  const loadGroupMembers = useCallback(async () => {
    if (!groupId) return;

    setLoading(true);
    setError(null);

    try {
      const response = await groupService.getUsersGroup(groupId);
      setState(prev => ({
        ...prev,
        groupMembers: response || []
      }));
    } catch (error: any) {
      setError(error.response?.data?.message || 'Error al cargar miembros del grupo');
    } finally {
      setLoading(false);
    }
  }, [groupId]);

  // ==================== EFFECTS ====================

  // Load initial data on mount
  useEffect(() => {
    if (groupId) {
      loadTasks();
      loadGroupMembers();
    }
    loadRewards();
    loadUserEvents();
  }, [groupId, loadTasks, loadRewards, loadUserEvents, loadGroupMembers]);

  return {
    ...state,
    createTask,
    updateTaskStatus,
    completeTask,
    loadTasks,
    assignReward,
    loadRewards,
    sendTaskNotification,
    loadNotifications,
    createEvent,
    loadGlobalCalendar,
    loadUserEvents,
    loadGroupMembers,
    clearError: () => setError(null),
  };
};
