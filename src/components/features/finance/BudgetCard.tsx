import React from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import type { BudgetStatus } from '@/types/finance.types';
import { financeUtils } from '@/api/services/financeService';

interface BudgetCardProps {
  budgetStatuses: BudgetStatus[];
  onEdit?: (budget: BudgetStatus) => void;
  onNew?: () => void;
  onDelete?: (budget: BudgetStatus) => void;
}

export const BudgetCard: React.FC<BudgetCardProps> = ({ budgetStatuses, onEdit, onNew, onDelete }) => {
  const getProgressColor = (percentage: number) => {
    if (percentage >= 90) return 'bg-red-500';
    if (percentage >= 75) return 'bg-orange-500';
    return 'bg-green-500';
  };

  const getProgressBg = (percentage: number) => {
    if (percentage >= 90) return 'bg-red-100';
    if (percentage >= 75) return 'bg-orange-100';
    return 'bg-green-100';
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 md:p-6">
      <div className="flex justify-between items-center mb-5">
        <h3 className="text-base md:text-lg font-semibold text-gray-900">
          Presupuesto del Mes
        </h3>
        {onNew && (
          <button
            onClick={onNew}
            className="flex items-center gap-1 text-sm text-primary hover:text-primary-dark transition-colors"
          >
            <Plus className="w-4 h-4" />
            Nuevo
          </button>
        )}
      </div>

      <div className="space-y-4">
        {budgetStatuses.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <div className="text-4xl mb-2">💳</div>
            <p>No hay presupuestos configurados</p>
          </div>
        ) : (
          budgetStatuses
            .filter(budgetStatus => budgetStatus && budgetStatus.budget && budgetStatus.budget.category)
            .map((budgetStatus) => {
              const percentage = budgetStatus.percentage_used;
              const categoryName = budgetStatus.budget.category?.name || 'Sin categoría';

              return (
                <div key={budgetStatus.budget.id} className="space-y-2 group">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2 flex-1">
                      <span className="text-lg">
                        {financeUtils.getCategoryIcon(categoryName)}
                      </span>
                      <span className="text-sm md:text-base text-gray-900">
                        {categoryName}
                      </span>
                    </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="text-sm md:text-base font-semibold text-gray-900">
                        ${budgetStatus.current_spent.toLocaleString()}
                      </div>
                      <div className="text-xs text-gray-500">
                        de ${budgetStatus.budget.limit_amount.toLocaleString()}
                      </div>
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      {onEdit && (
                        <button
                          onClick={() => onEdit(budgetStatus)}
                          className="p-1.5 text-gray-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                          title="Editar presupuesto"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                      )}
                      {onDelete && (
                        <button
                          onClick={() => onDelete(budgetStatus)}
                          className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          title="Eliminar presupuesto"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className={`h-2 ${getProgressBg(percentage)} rounded-full overflow-hidden`}>
                  <div
                    className={`h-full ${getProgressColor(percentage)} transition-all duration-300`}
                    style={{ width: `${Math.min(percentage, 100)}%` }}
                  />
                </div>
                
                {budgetStatus.needs_alert && (
                  <div className="text-xs text-orange-600 font-medium">
                    ⚠️ Cerca del límite ({percentage.toFixed(1)}%)
                  </div>
                )}
                
                {budgetStatus.is_over_budget && (
                  <div className="text-xs text-red-600 font-medium">
                    🚨 Presupuesto excedido
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
