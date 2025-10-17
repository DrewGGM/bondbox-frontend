import React from 'react';
import { formatCurrency } from '@/utils/formatters';

interface BudgetExceededData {
  verificar_limites_gasto: {
    success: boolean;
    budget_status: Array<{
      id: string;
      category_id: string;
      category: {
        id: string;
        name: string;
        type: string;
        color: string;
      };
      limit_amount: number;
      period: string;
      is_active: boolean;
      alert_threshold: number;
    }>;
    total: number;
  };
  obtener_gastos_por_categoria: {
    success: boolean;
    categorias: Array<{
      category_id: string;
      category_name: string;
      total: number;
      currency: string;
      transaction_count: number;
      percentage: number;
      average: number;
    }>;
    total: number;
  };
}

interface BudgetExceededCardProps {
  data: BudgetExceededData;
}

export const BudgetExceededCard: React.FC<BudgetExceededCardProps> = ({ data }) => {
  const { verificar_limites_gasto, obtener_gastos_por_categoria } = data;
  
  // Combinar la información de límites con los gastos actuales
  const budgetWithExpenses = verificar_limites_gasto.budget_status.map(budget => {
    const expense = obtener_gastos_por_categoria.categorias.find(
      cat => cat.category_id === budget.category_id
    );
    
    const currentAmount = expense?.total || 0;
    const percentage = budget.limit_amount > 0 ? (currentAmount / budget.limit_amount) * 100 : 0;
    
    let status: 'OK' | 'WARNING' | 'EXCEEDED' = 'OK';
    if (percentage >= 100) {
      status = 'EXCEEDED';
    } else if (percentage >= budget.alert_threshold) {
      status = 'WARNING';
    }
    
    return {
      ...budget,
      current_amount: currentAmount,
      percentage,
      status,
      transaction_count: expense?.transaction_count || 0
    };
  });
  
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Estado de Presupuestos</h3>
        <span className="text-sm text-gray-500">{budgetWithExpenses.length} límite{budgetWithExpenses.length !== 1 ? 's' : ''}</span>
      </div>
      
      <div className="space-y-3">
        {budgetWithExpenses.map((budget) => {
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
            <div key={budget.id} className="p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: budget.category.color }}
                  />
                  <span className="font-medium text-gray-900">{budget.category.name}</span>
                </div>
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
                      budget.percentage >= budget.alert_threshold ? 'bg-yellow-500' : 'bg-green-500'
                    }`}
                    style={{ width: `${Math.min(budget.percentage, 100)}%` }}
                  />
                </div>
                
                <div className="text-right text-sm text-gray-500">
                  {budget.percentage.toFixed(1)}% del límite
                </div>
                
                <div className="text-xs text-gray-500">
                  {budget.transaction_count} transacciones este mes
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
