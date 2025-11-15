import React from 'react';
import { Clock, User } from 'lucide-react';

export interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  priority: 'high' | 'medium' | 'low';
  status: 'pending' | 'in_progress' | 'completed';
  completed: boolean;
  assignee?: string; // Optional: Name of person assigned (can be empty)
  createdBy?: string; // User who created the task
}

interface TaskCardProps {
  task: Task;
  onToggleComplete?: (taskId: string) => void;
  onClick?: (task: Task) => void;
}

const priorityColors = {
  high: 'bg-red-100 text-red-700 border-red-200',
  medium: 'bg-orange-100 text-orange-700 border-orange-200',
  low: 'bg-green-100 text-green-700 border-green-200',
};

const priorityLabels = {
  high: 'Alta',
  medium: 'Media',
  low: 'Baja',
};

export const TaskCard: React.FC<TaskCardProps> = ({ task, onToggleComplete, onClick }) => {
  const isOverdue = () => {
    if (!task.dueDate) return false;
    const dueDate = new Date(task.dueDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return dueDate < today && !task.completed;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const dateOnly = new Date(date);
    dateOnly.setHours(0, 0, 0, 0);

    const diffTime = dateOnly.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Hoy';
    if (diffDays === 1) return 'Mañana';
    if (diffDays === -1) return 'Ayer';
    if (diffDays < 0) return 'Vencida';

    return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
  };

  return (
    <div
      className={`bg-white rounded-lg border p-4 hover:shadow-md transition-shadow cursor-pointer ${
        task.completed ? 'opacity-60' : ''
      }`}
      onClick={() => onClick?.(task)}
    >
      <div className="flex items-start gap-3">
        {/* Checkbox */}
        <div className="flex-shrink-0 pt-1">
          <input
            type="checkbox"
            checked={task.completed}
            onClick={(e) => e.stopPropagation()}
            onChange={(e) => {
              e.stopPropagation();
              onToggleComplete?.(task.id);
            }}
            className="w-5 h-5 text-orange-500 rounded border-gray-300 focus:ring-orange-500 cursor-pointer"
          />
        </div>

        {/* Task Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3
              className={`font-semibold text-gray-900 ${
                task.completed ? 'line-through text-gray-500' : ''
              }`}
            >
              {task.title}
            </h3>
            {task.priority && (
              <span
                className={`px-2 py-0.5 text-xs font-medium rounded-full border flex-shrink-0 ${
                  priorityColors[task.priority]
                }`}
              >
                {priorityLabels[task.priority]}
              </span>
            )}
          </div>

          {task.description && (
            <p className="text-sm text-gray-600 mb-3">{task.description}</p>
          )}

          {/* Task Meta */}
          <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500">
            {/* Assignee (optional) */}
            {task.assignee && (
              <div className="flex items-center gap-1">
                <User className="w-4 h-4" />
                <span>{task.assignee}</span>
              </div>
            )}

            {/* Due Date */}
            {task.dueDate && (
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span className={isOverdue() ? 'text-red-600 font-medium' : ''}>
                  {formatDate(task.dueDate)}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
