import React from 'react';
import { formatCurrency } from '@/utils/formatters';
import type { ChatStats } from '@/types/ai.types';

interface ChatSidebarProps {
  stats: ChatStats;
}

export const ChatSidebar: React.FC<ChatSidebarProps> = ({ stats }) => {
  return (
    <aside className="w-80 flex flex-col gap-6">
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h3 className="text-base font-semibold text-gray-800 mb-4">
          Resumen Familiar de Hoy
        </h3>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-gray-50 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-primary">{stats.tasksPending}</div>
            <div className="text-xs text-gray-600">Tareas Pendientes</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-primary">{stats.tasksCompleted}</div>
            <div className="text-xs text-gray-600">Completadas</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-primary-dark">
              {formatCurrency(stats.expensesToday).replace('COP', '').trim()}
            </div>
            <div className="text-xs text-gray-600">Gastos del Día</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(stats.incomeToday).replace('COP', '').trim()}
            </div>
            <div className="text-xs text-gray-600">Ingresos del Día</div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h3 className="text-base font-semibold text-gray-800 mb-4">
          Inventario por Caducar
        </h3>
        <div className="space-y-3 text-sm text-gray-600">
          <div className="flex justify-between">
            <span>Leche (2)</span>
            <strong className="text-yellow-600">En 15 días</strong>
          </div>
          <div className="flex justify-between">
            <span>Huevos (6)</span>
            <strong className="text-orange-600">En 8 días</strong>
          </div>
        </div>
      </div>
    </aside>
  );
};