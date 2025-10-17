import React from 'react';
import type { TransactionCardData } from '@/types/ai.types';
import { formatCurrency } from '@/utils/formatters';

interface TransactionCardProps {
  data: TransactionCardData;
}

export const TransactionCard: React.FC<TransactionCardProps> = ({ data }) => {
  const isExpense = data.type === 'EXPENSE';
  const amountColor = isExpense ? 'text-red-600' : 'text-green-600';
  const amountPrefix = isExpense ? '-' : '+';
  
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div 
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: data.category.color }}
          />
          <span className="font-medium text-gray-900">
            {data.category_used || data.category.name}
          </span>
        </div>
        <span className={`font-bold text-lg ${amountColor}`}>
          {amountPrefix}{formatCurrency(data.amount)}
        </span>
      </div>
      
      <div className="space-y-2">
        <div>
          <span className="text-sm text-gray-600">Descripción:</span>
          <p className="text-gray-900 font-medium">{data.description}</p>
        </div>
        
        <div className="flex justify-between text-sm text-gray-500">
          <span>Tipo: {isExpense ? 'Gasto' : 'Ingreso'}</span>
          <span>{new Date(data.transaction_date).toLocaleDateString('es-CO')}</span>
        </div>
      </div>
    </div>
  );
};
