import React from 'react';
import type { CategoryListCardData } from '@/types/ai.types';

interface CategoryListCardProps {
  data: CategoryListCardData;
}

export const CategoryListCard: React.FC<CategoryListCardProps> = ({ data }) => {
  const expenseCategories = data.categories.filter(cat => cat.type === 'EXPENSE');
  const incomeCategories = data.categories.filter(cat => cat.type === 'INCOME');
  
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Categorías Disponibles</h3>
        <span className="text-sm text-gray-500">{data.count} categorías</span>
      </div>
      
      <div className="space-y-4">
        {/* Categorías de Gastos */}
        {expenseCategories.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">Gastos</h4>
            <div className="grid grid-cols-2 gap-2">
              {expenseCategories.map((category) => (
                <div key={category.id} className="flex items-center gap-2 p-2 bg-red-50 rounded-lg">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: category.color }}
                  />
                  <span className="text-sm font-medium text-gray-900">{category.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Categorías de Ingresos */}
        {incomeCategories.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">Ingresos</h4>
            <div className="grid grid-cols-2 gap-2">
              {incomeCategories.map((category) => (
                <div key={category.id} className="flex items-center gap-2 p-2 bg-green-50 rounded-lg">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: category.color }}
                  />
                  <span className="text-sm font-medium text-gray-900">{category.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
