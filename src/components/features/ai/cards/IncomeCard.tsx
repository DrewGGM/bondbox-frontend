import React from 'react';
import { formatCurrency } from '@/utils/formatters';
import type { IncomeCardData } from '@/types/ai.types';

interface IncomeCardProps {
  data: IncomeCardData;
}

export const IncomeCard: React.FC<IncomeCardProps> = ({ data }) => {
  return (
    <div className="bg-white border-2 border-green-500 rounded-lg p-4 mt-2">
      <div className="font-semibold text-gray-800 mb-3">💵 {data.title}</div>
      <div className="space-y-2 text-sm">
        <div className="text-2xl font-bold text-green-600">
          +{formatCurrency(data.amount)}
        </div>
        <div className="text-gray-600">Origen: {data.source}</div>
        <div className="text-gray-600">Categoría: {data.category}</div>
      </div>
    </div>
  );
};