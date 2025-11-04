import React from 'react';
import type { ExpenseCategory } from '@/types/finance.types';

interface ExpenseChartProps {
  categories: ExpenseCategory[];
  totalExpenses: number;
}

export const ExpenseChart: React.FC<ExpenseChartProps> = ({ categories, totalExpenses }) => {
  const calculateStrokeDasharray = (percentage: number, circumference: number) => {
    const strokeLength = (percentage / 100) * circumference;
    return `${strokeLength} ${circumference}`;
  };

  // Filter out invalid categories
  const validCategories = (categories || []).filter(cat => cat && cat.name && cat.percentage !== undefined);

  const circumference = 2 * Math.PI * 70; // radius = 70
  let strokeOffset = 0;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 md:p-6">
      <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-5">
        Distribución de Gastos
      </h3>

      <div className="flex flex-col lg:flex-row items-center gap-6">
        {/* Donut Chart */}
        <div className="relative w-40 h-40 sm:w-48 sm:h-48 flex-shrink-0">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 180 180">
            {/* Background circle */}
            <circle
              cx="90"
              cy="90"
              r="70"
              fill="none"
              stroke="#f3f4f6"
              strokeWidth="20"
            />
            
            {/* Data segments */}
            {validCategories.map((category, index) => {
              const strokeDasharray = calculateStrokeDasharray(category.percentage, circumference);
              const currentOffset = strokeOffset;
              strokeOffset -= (category.percentage / 100) * circumference;

              return (
                <circle
                  key={index}
                  cx="90"
                  cy="90"
                  r="70"
                  fill="none"
                  stroke={category.color}
                  strokeWidth="20"
                  strokeDasharray={strokeDasharray}
                  strokeDashoffset={currentOffset}
                  strokeLinecap="round"
                />
              );
            })}
          </svg>
          
          {/* Center text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-lg sm:text-2xl font-bold text-gray-900">
              ${totalExpenses.toLocaleString()}
            </div>
            <div className="text-xs text-gray-500">
              Total gastos
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="flex-1 min-w-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {validCategories.map((category, index) => (
              <div key={index} className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-sm flex-shrink-0"
                  style={{ backgroundColor: category.color }}
                />
                <span className="text-sm text-gray-700 truncate">
                  {category.name} ({category.percentage}%)
                </span>
              </div>
            ))}
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-4 mt-6 pt-4 border-t border-gray-100">
            <div className="text-center">
              <div className="text-lg font-bold text-primary">
                {validCategories.length}
              </div>
              <div className="text-xs text-gray-500">
                Categorías
              </div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-primary">
                ${Math.round(totalExpenses / 30)}
              </div>
              <div className="text-xs text-gray-500">
                Promedio diario
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
