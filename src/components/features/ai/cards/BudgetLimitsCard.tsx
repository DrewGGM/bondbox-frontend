import React from 'react';
import { formatCurrency } from '@/utils/formatters';

interface BudgetLimitData {
  id: string;
  category_id: string;
  category_name: string;
  limit_amount: number;
  period: string;
  is_active: boolean;
  alert_threshold: number;
  category?: {
    id: string;
    name: string;
    type: string;
    color: string;
    group_id: string;
    created_at: string;
  };
  created_at?: string;
}

interface BudgetLimitsCardProps {
  data: BudgetLimitData[];
}

export const BudgetLimitsCard: React.FC<BudgetLimitsCardProps> = ({ data }) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Límites de Presupuesto</h3>
        <span className="text-sm text-gray-500">{data.length} límite{data.length !== 1 ? 's' : ''}</span>
      </div>
      
      <div className="space-y-3">
        {data.map((limit) => {
          const alertAmount = (limit.limit_amount * limit.alert_threshold) / 100;
          const periodText = limit.period === 'MONTHLY' ? 'mensual' : limit.period.toLowerCase();
          
          return (
            <div key={limit.id} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  {limit.category?.color && (
                    <div 
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: limit.category.color }}
                    />
                  )}
                  <div>
                    <h4 className="font-semibold text-gray-900">{limit.category_name}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        limit.is_active 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {limit.is_active ? 'Activo' : 'Inactivo'}
                      </span>
                      <span className="text-xs text-gray-500">
                        Período: {periodText}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-3">
                <div>
                  <div className="text-sm text-gray-600">Límite total</div>
                  <div className="font-bold text-lg text-gray-900">
                    {formatCurrency(limit.limit_amount)}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Alerta al {limit.alert_threshold}%</div>
                  <div className="font-bold text-lg text-orange-600">
                    {formatCurrency(alertAmount)}
                  </div>
                </div>
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="h-2 rounded-full bg-blue-500"
                  style={{ width: `${limit.alert_threshold}%` }}
                />
              </div>
              
              <div className="text-xs text-gray-500 mt-2">
                Se activará una alerta cuando gastes {formatCurrency(alertAmount)} o más
              </div>
            </div>
          );
        })}
      </div>
      
      {data.length === 0 && (
        <div className="text-center py-8">
          <div className="text-gray-500 mb-2">No tienes límites configurados</div>
          <div className="text-sm text-gray-400">Configura límites para controlar tus gastos</div>
        </div>
      )}
    </div>
  );
};
