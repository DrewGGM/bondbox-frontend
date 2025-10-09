import React from 'react';
import type { CategoryCardData } from '@/types/ai.types';

interface CategoryCardProps {
  data: CategoryCardData;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({ data }) => {
  const isExpense = data.type === 'EXPENSE';
  const borderColor = isExpense ? 'border-red-200' : 'border-green-200';
  
  return (
    <div className={`bg-white rounded-lg border ${borderColor} p-4 shadow-sm`}>
      <div className="flex items-center gap-3">
        <div 
          className="w-4 h-4 rounded-full"
          style={{ backgroundColor: data.color }}
        />
        <div>
          <h3 className="font-semibold text-gray-900">{data.name}</h3>
          <div className="flex items-center gap-2 mt-1">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              isExpense 
                ? 'bg-red-100 text-red-800' 
                : 'bg-green-100 text-green-800'
            }`}>
              {isExpense ? 'Gasto' : 'Ingreso'}
            </span>
            <span className="text-xs text-gray-500">
              Creada: {new Date(data.created_at).toLocaleDateString('es-CO')}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
