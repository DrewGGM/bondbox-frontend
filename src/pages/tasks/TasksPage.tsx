import React, { useState, useMemo } from 'react';
import { Header } from '@/components/layout/Header';
import {
  TaskFilterTabs,
  TaskList,
  TaskSummaryCard,
  FamilyProductivity,
  FamilyAchievements,
  TaskFormModal,
  Task,
  TaskStatus,
  FamilyMember,
} from '@/components/features/tasks';
import { Plus } from 'lucide-react';
import { useTasks } from '@/hooks/useTasks';
import { useGroupStore } from '@/store/groupStore';
import { ErrorMessage } from '@/components/common/ErrorMessage';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';

export const TasksPage: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<TaskStatus>('all');
  const [sortBy, setSortBy] = useState('priority');
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | undefined>();

  const selectedGroup = useGroupStore((state) => state.selectedGroup);

  // Guard: No group selected
  if (!selectedGroup) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
            <p className="text-yellow-800 font-medium">
              No hay un grupo seleccionado
            </p>
            <p className="text-yellow-600 text-sm mt-2">
              Por favor selecciona un grupo desde el Dashboard para ver las tareas
            </p>
          </div>
        </main>
      </div>
    );
  }

  const groupId = selectedGroup.id;

  // Use tasks hook
  const {
    tasks: tasksData,
    rewards,
    groupMembers,
    loading,
    error,
    createTask,
    updateTaskStatus,
    completeTask,
    clearError,
  } = useTasks(groupId);

  // Transform backend tasks to frontend Task format
  const allTasks: Task[] = tasksData.map(task => ({
    id: String(task.id),
    title: task.title,
    description: '',
    dueDate: task.deadline,
    assignee: task.assigned_to || undefined,
    priority: task.priority === 'alta' ? 'high' : task.priority === 'media' ? 'medium' : 'low',
    status: task.status === 'pendiente' ? 'pending' : task.status === 'en progreso' ? 'in_progress' : 'completed',
    completed: task.status === 'completada',
  }));

  // Family members from group members with task statistics
  const familyMembers: FamilyMember[] = useMemo(() => {
    return groupMembers.map((member) => {
      const nameParts = member.full_name.split(' ');
      const firstName = nameParts[0];
      const initials = nameParts.map(n => n[0]).join('').substring(0, 2).toUpperCase();

      // Calculate tasks for this member
      const memberTasks = allTasks.filter(task => task.assignee === member.id);
      const completedTasks = memberTasks.filter(task => task.completed);

      return {
        id: member.id,
        name: firstName,
        initials,
        tasksCompleted: completedTasks.length,
        totalTasks: memberTasks.length,
      };
    });
  }, [groupMembers, allTasks]);

  // Check if task is overdue (frontend calculation)
  const isTaskOverdue = (task: Task): boolean => {
    if (!task.dueDate || task.completed) return false;
    const dueDate = new Date(task.dueDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return dueDate < today;
  };

  // Calculate counts including overdue (frontend calculation)
  const taskCounts = useMemo(() => {
    const overdueTasks = allTasks.filter((t) => isTaskOverdue(t));
    return {
      all: allTasks.length,
      pending: allTasks.filter((t) => t.status === 'pending' && !isTaskOverdue(t)).length,
      in_progress: allTasks.filter((t) => t.status === 'in_progress').length,
      completed: allTasks.filter((t) => t.status === 'completed').length,
      overdue: overdueTasks.length,
    };
  }, [allTasks]);

  // Filter tasks
  const filteredTasks = useMemo(() => {
    if (activeFilter === 'all') return allTasks;
    if (activeFilter === 'overdue') {
      return allTasks.filter((task) => isTaskOverdue(task));
    }
    return allTasks.filter((task) => task.status === activeFilter);
  }, [allTasks, activeFilter]);

  // Sort tasks
  const sortedTasks = useMemo(() => {
    const tasks = [...filteredTasks];

    switch (sortBy) {
      case 'priority':
        const priorityOrder = { high: 0, medium: 1, low: 2 };
        return tasks.sort(
          (a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]
        );

      case 'dueDate':
        return tasks.sort((a, b) => {
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        });

      case 'status':
        const statusOrder = { pending: 0, in_progress: 1, completed: 2 };
        return tasks.sort((a, b) => {
          // Overdue tasks first
          const aOverdue = isTaskOverdue(a);
          const bOverdue = isTaskOverdue(b);
          if (aOverdue && !bOverdue) return -1;
          if (!aOverdue && bOverdue) return 1;
          return statusOrder[a.status] - statusOrder[b.status];
        });

      default:
        return tasks;
    }
  }, [filteredTasks, sortBy]);

  // Calculate summary stats
  const summaryStats = useMemo(() => {
    return {
      total: allTasks.length,
      completedToday: allTasks.filter((t) => t.completed).length,
      pending: taskCounts.pending,
      overdue: taskCounts.overdue,
    };
  }, [allTasks, taskCounts]);

  // Achievements data from rewards API
  const achievementsData = useMemo(() => {
    // Calculate total points from rewards
    const totalPoints = rewards.reduce((sum, reward) => sum + reward.points, 0);

    // Find top performer
    const topPerformer = familyMembers.length > 0
      ? familyMembers.reduce((prev, current) => {
          const prevRate = prev.totalTasks > 0 ? prev.tasksCompleted / prev.totalTasks : 0;
          const currentRate =
            current.totalTasks > 0 ? current.tasksCompleted / current.totalTasks : 0;
          return currentRate > prevRate ? current : prev;
        })
      : { name: '-', initials: '--', tasksCompleted: 0, totalTasks: 0 };

    return {
      totalPoints,
      topPerformer: {
        name: topPerformer.name,
        initials: topPerformer.initials,
        tasksCompleted: topPerformer.tasksCompleted,
        totalTasks: topPerformer.totalTasks,
      },
    };
  }, [familyMembers, rewards]);

  const handleToggleComplete = async (taskId: string) => {
    try {
      // Complete the task
      await completeTask(taskId, { groupId });
      // Optionally assign reward after completion
      // await assignReward({ points: 100, badge: 'Completador de tareas' });
    } catch (err) {
      console.error('Error completing task:', err);
    }
  };

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setModalOpen(true);
  };

  const handleNewTask = () => {
    setSelectedTask(undefined);
    setModalOpen(true);
  };

  const handleTaskSubmit = async (taskData: any) => {
    try {
      if (selectedTask) {
        // Update existing task status
        if (taskData.status) {
          const backendStatus =
            taskData.status === 'pending' ? 'pendiente' :
            taskData.status === 'in_progress' ? 'en progreso' : 'completada';
          await updateTaskStatus(selectedTask.id, {
            status: backendStatus as any,
            groupId
          });
        }
      } else {
        // Create new task
        const backendPriority =
          taskData.priority === 'high' ? 'alta' :
          taskData.priority === 'medium' ? 'media' : 'baja';

        // Convert datetime-local format to ISO 8601
        const deadlineISO = taskData.dueDate
          ? new Date(taskData.dueDate).toISOString()
          : new Date().toISOString();

        const startDateISO = taskData.startDate
          ? new Date(taskData.startDate).toISOString()
          : undefined;

        await createTask({
          groupId,
          title: taskData.title || '',
          description: taskData.description || undefined,
          priority: backendPriority as any,
          notes: taskData.notes || undefined,
          startDate: startDateISO,
          deadline: deadlineISO,
          assignedTo: taskData.assignee || undefined,
        });
      }
      setModalOpen(false);
      setSelectedTask(undefined);
    } catch (err) {
      console.error('Error submitting task:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        {/* Error Display */}
        {error && (
          <div className="mb-6">
            <ErrorMessage message={error} onDismiss={clearError} />
          </div>
        )}

        {/* Page Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-3xl">☰</span>
              <h1 className="text-3xl font-bold text-gray-900">Gestión de Tareas</h1>
            </div>
          </div>
          <button
            onClick={handleNewTask}
            className="flex items-center gap-2 px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium shadow-sm"
          >
            <Plus className="w-5 h-5" />
            Nueva Tarea
          </button>
        </div>

        {/* Filter Tabs */}
        <TaskFilterTabs
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
          counts={taskCounts}
        />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Tasks List - Left Side (2 columns on large screens) */}
          <div className="lg:col-span-2">
            {loading ? (
              <div className="flex justify-center py-12">
                <LoadingSpinner />
              </div>
            ) : (
              <TaskList
                tasks={sortedTasks}
                title="Tareas"
                onToggleComplete={handleToggleComplete}
                onTaskClick={handleTaskClick}
                sortBy={sortBy}
                onSortChange={setSortBy}
              />
            )}
          </div>

          {/* Sidebar - Right Side (1 column on large screens) */}
          <div className="space-y-6">
            <TaskSummaryCard stats={summaryStats} />
            <FamilyProductivity members={familyMembers} />
            <FamilyAchievements data={achievementsData} />
          </div>
        </div>
      </main>

      {/* Task Form Modal */}
      <TaskFormModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setSelectedTask(undefined);
        }}
        onSubmit={handleTaskSubmit}
        task={selectedTask}
        groupMembers={groupMembers}
      />
    </div>
  );
};
