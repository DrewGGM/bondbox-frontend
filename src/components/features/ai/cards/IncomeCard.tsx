import React from 'react';
import { formatCurrency } from '@/utils/formatters';
import type { IncomeCardData } from '@/types/ai.types';

interface IncomeCardProps {
  data: IncomeCardData;
}

export const IncomeCard: React.FC<IncomeCardProps> = ({ data }) => {
  return (
    <div className="bg-white border-2 border-green-500 rounded-lg p-3 md:p-4 mt-2">
      <div className="font-semibold text-sm md:text-base text-gray-800 mb-2 md:mb-3 break-words">💵 {data.title}</div>
      <div className="space-y-1 md:space-y-2 text-xs md:text-sm">
        <div className="text-xl md:text-2xl font-bold text-green-600 break-words">
          +{formatCurrency(data.amount)}
        </div>
        <div className="text-gray-600 break-words">Origen: {data.source}</div>
        <div className="text-gray-600 break-words">Categoría: {data.category}</div>
      </div>
    </div>
  );
};