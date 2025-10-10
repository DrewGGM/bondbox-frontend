import React from 'react';
import { formatCurrency } from '@/utils/formatters';
import type { ExpenseCardData } from '@/types/ai.types';

interface ExpenseCardProps {
  data: ExpenseCardData;
}

export const ExpenseCard: React.FC<ExpenseCardProps> = ({ data }) => {
  return (
    <div className="bg-white border-2 border-primary-dark rounded-lg p-3 md:p-4 mt-2">
      <div className="font-semibold text-sm md:text-base text-gray-800 mb-2 md:mb-3 break-words">🛒 {data.title}</div>
      <div className="space-y-1 md:space-y-2 text-xs md:text-sm">
        <div className="text-xl md:text-2xl font-bold text-primary-dark break-words">
          -{formatCurrency(data.amount)}
        </div>
        <div className="text-gray-600 break-words">Categoría: {data.category}</div>
        <div className="text-gray-600 break-words">Pago: {data.paymentMethod}</div>
      </div>
    </div>
  );
};