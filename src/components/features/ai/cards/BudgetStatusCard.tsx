import React from 'react';
import type { BudgetStatusCardData } from '@/types/ai.types';
import { formatCurrency } from '@/utils/formatters';

interface BudgetStatusCardProps {
  data: BudgetStatusCardData;
}

export const BudgetStatusCard: React.FC<BudgetStatusCardProps> = ({ data }) => {
  if (data.budget_status.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Límites de Presupuesto</h3>
        <div className="text-center py-4">
          <div className="text-gray-500 mb-2">No tienes límites configurados</div>
          <div className="text-sm text-gray-400">Configura presupuestos para controlar tus gastos</div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Estado de Presupuestos</h3>
        <span className="text-sm text-gray-500">{data.total} límites</span>
      </div>
      
      <div className="space-y-3">
        {data.budget_status.map((budget, index) => {
          const getStatusColor = (status: string) => {
            switch (status) {
              case 'OK': return 'text-green-600 bg-green-100';
              case 'WARNING': return 'text-yellow-600 bg-yellow-100';
              case 'EXCEEDED': return 'text-red-600 bg-red-100';
              default: return 'text-gray-600 bg-gray-100';
            }
          };
          
          const getStatusText = (status: string) => {
            switch (status) {
              case 'OK': return 'Dentro del límite';
              case 'WARNING': return 'Cerca del límite';
              case 'EXCEEDED': return 'Límite excedido';
              default: return 'Sin estado';
            }
          };
          
          // Normalizar posibles estructuras de respuesta
          const hasNestedBudget = (budget as any).budget;
          const limitAmount = hasNestedBudget ? (budget as any).budget?.limit_amount ?? 0 : (budget as any).limit_amount ?? 0;
          const currentAmount = hasNestedBudget ? (budget as any).current_spent ?? 0 : (budget as any).current_amount ?? 0;
          const alertThreshold = hasNestedBudget ? (budget as any).budget?.alert_threshold ?? 80 : (budget as any).alert_threshold ?? 80;
          let percentage: number = hasNestedBudget ? (budget as any).percentage_used ?? 0 : (budget as any).percentage ?? 0;
          if ((percentage === undefined || percentage === null) && limitAmount > 0) {
            percentage = (currentAmount / limitAmount) * 100;
          }
          let status: string | undefined = (budget as any).status;
          if (!status) {
            if (hasNestedBudget) {
              const isOver = (budget as any).is_over_budget === true;
              const needsAlert = (budget as any).needs_alert === true;
              status = isOver ? 'EXCEEDED' : (needsAlert ? 'WARNING' : 'OK');
            } else {
              status = percentage >= 100 ? 'EXCEEDED' : (percentage >= alertThreshold ? 'WARNING' : 'OK');
            }
          }
          const categoryName = hasNestedBudget
            ? ((budget as any).budget?.category?.name ?? (budget as any).category_name ?? 'Presupuesto')
            : ((budget as any).category_name ?? (budget as any).category?.name ?? 'Presupuesto');
          
          return (
            <div key={index} className="p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-gray-900">{categoryName}</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(status!)}`}>
                  {getStatusText(status!)}
                </span>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Gastado:</span>
                  <span className="font-medium">{formatCurrency(currentAmount)}</span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Límite:</span>
                  <span className="font-medium">{formatCurrency(limitAmount)}</span>
                </div>
                
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${
                      percentage >= 100 ? 'bg-red-500' :
                      percentage >= alertThreshold ? 'bg-yellow-500' : 'bg-green-500'
                    }`}
                    style={{ width: `${Math.min(percentage, 100)}%` }}
                  />
                </div>
                
                <div className="text-right text-sm text-gray-500">
                  {Number.isFinite(percentage) ? `${percentage.toFixed(1)}% del límite` : '0.0% del límite'}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
