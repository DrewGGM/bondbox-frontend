import React from 'react';
import { TaskCard, Task } from './TaskCard';
import { ChevronDown } from 'lucide-react';

interface TaskListProps {
  tasks: Task[];
  title?: string;
  onToggleComplete?: (taskId: string) => void;
  onTaskClick?: (task: Task) => void;
  sortBy?: string;
  onSortChange?: (sort: string) => void;
}

export const TaskList: React.FC<TaskListProps> = ({
  tasks,
  title = 'Tareas de Hoy',
  onToggleComplete,
  onTaskClick,
  sortBy = 'priority',
  onSortChange,
}) => {
  return (
    <div className="bg-gray-50 rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-900">{title}</h2>

        {onSortChange && (
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value)}
              className="appearance-none bg-white border border-gray-200 rounded-lg px-4 py-2 pr-10 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-500 cursor-pointer"
            >
              <option value="priority">Ordenar por prioridad</option>
              <option value="dueDate">Ordenar por fecha</option>
              <option value="status">Ordenar por estado</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
          </div>
        )}
      </div>

      <div className="space-y-3">
        {tasks.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No hay tareas para mostrar</p>
          </div>
        ) : (
          tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onToggleComplete={onToggleComplete}
              onClick={onTaskClick}
            />
          ))
        )}
      </div>
    </div>
  );
};
