import React from 'react';
import type { BudgetStatus } from '@/types/finance.types';
import { financeUtils } from '@/api/services/financeService';

interface BudgetCardProps {
  budgetStatuses: BudgetStatus[];
  onEdit?: () => void;
}

export const BudgetCard: React.FC<BudgetCardProps> = ({ budgetStatuses, onEdit }) => {
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
        <button
          onClick={onEdit}
          className="text-sm text-primary hover:text-primary-dark transition-colors"
        >
          Editar
        </button>
      </div>

      <div className="space-y-4">
        {budgetStatuses.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <div className="text-4xl mb-2">💳</div>
            <p>No hay presupuestos configurados</p>
          </div>
        ) : (
          budgetStatuses.map((budgetStatus) => {
            const percentage = budgetStatus.percentage_used;
            
            return (
              <div key={budgetStatus.budget.id} className="space-y-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">
                      {financeUtils.getCategoryIcon(budgetStatus.budget.category.name)}
                    </span>
                    <span className="text-sm md:text-base text-gray-900">
                      {budgetStatus.budget.category.name}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm md:text-base font-semibold text-gray-900">
                      ${budgetStatus.current_spent.toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-500">
                      de ${budgetStatus.budget.limit_amount.toLocaleString()}
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
