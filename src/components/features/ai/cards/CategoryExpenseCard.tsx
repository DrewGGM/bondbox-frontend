import React from 'react';
import { formatCurrency } from '@/utils/formatters';

interface CategoryExpenseData {
  category_id: string;
  category_name: string;
  total: number;
  currency: string;
  transaction_count: number;
  percentage: number;
  average: number;
}

interface CategoryExpenseCardProps {
  data: CategoryExpenseData[];
}

export const CategoryExpenseCard: React.FC<CategoryExpenseCardProps> = ({ data }) => {
  const totalAmount = data.reduce((sum, category) => sum + category.total, 0);
  
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Gastos por Categoría</h3>
        <span className="text-sm text-gray-500">{data.length} categorías</span>
      </div>
      
      <div className="space-y-3">
        {data.map((category, index) => {
          const isTopCategory = index === 0;
          const barWidth = (category.total / totalAmount) * 100;
          
          return (
            <div key={category.category_id} className="p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  {isTopCategory && (
                    <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded-full font-medium">
                      Mayor gasto
                    </span>
                  )}
                  <span className="font-medium text-gray-900">{category.category_name}</span>
                </div>
                <div className="text-right">
                  <div className="font-bold text-red-600">
                    {formatCurrency(category.total)}
                  </div>
                  <div className="text-xs text-gray-500">
                    {category.percentage.toFixed(1)}%
                  </div>
                </div>
              </div>
              
              {/* Barra de progreso */}
              <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                <div 
                  className={`h-2 rounded-full ${
                    isTopCategory ? 'bg-red-500' : 'bg-orange-400'
                  }`}
                  style={{ width: `${barWidth}%` }}
                />
              </div>
              
              <div className="flex justify-between text-sm text-gray-600">
                <span>{category.transaction_count} transacciones</span>
                <span>Promedio: {formatCurrency(category.average)}</span>
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-gray-700">Total gastado:</span>
          <span className="text-lg font-bold text-red-600">
            {formatCurrency(totalAmount)}
          </span>
        </div>
      </div>
    </div>
  );
};
