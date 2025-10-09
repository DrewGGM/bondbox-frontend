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
          
          return (
            <div key={index} className="p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-gray-900">{budget.category_name}</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(budget.status)}`}>
                  {getStatusText(budget.status)}
                </span>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Gastado:</span>
                  <span className="font-medium">{formatCurrency(budget.current_amount)}</span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Límite:</span>
                  <span className="font-medium">{formatCurrency(budget.limit_amount)}</span>
                </div>
                
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${
                      budget.percentage >= 100 ? 'bg-red-500' :
                      budget.percentage >= 80 ? 'bg-yellow-500' : 'bg-green-500'
                    }`}
                    style={{ width: `${Math.min(budget.percentage, 100)}%` }}
                  />
                </div>
                
                <div className="text-right text-sm text-gray-500">
                  {budget.percentage.toFixed(1)}% del límite
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
