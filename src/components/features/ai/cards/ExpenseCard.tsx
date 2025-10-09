import React from 'react';
import { formatCurrency } from '@/utils/formatters';
import type { ExpenseCardData } from '@/types/ai.types';

interface ExpenseCardProps {
  data: ExpenseCardData;
}

export const ExpenseCard: React.FC<ExpenseCardProps> = ({ data }) => {
  return (
    <div className="bg-white border-2 border-primary-dark rounded-lg p-4 mt-2">
      <div className="font-semibold text-gray-800 mb-3">🛒 {data.title}</div>
      <div className="space-y-2 text-sm">
        <div className="text-2xl font-bold text-primary-dark">
          -{formatCurrency(data.amount)}
        </div>
        <div className="text-gray-600">Categoría: {data.category}</div>
        <div className="text-gray-600">Pago: {data.paymentMethod}</div>
      </div>
    </div>
  );
};