import React from 'react';
import type { TransactionListCardData } from '@/types/ai.types';
import { formatCurrency } from '@/utils/formatters';

interface TransactionListCardProps {
  data: TransactionListCardData;
}

export const TransactionListCard: React.FC<TransactionListCardProps> = ({ data }) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Últimas Transacciones</h3>
        <span className="text-sm text-gray-500">{data.count} transacciones</span>
      </div>
      
      <div className="space-y-3">
        {data.transactions.map((transaction) => {
          const isExpense = transaction.type === 'EXPENSE';
          const amountColor = isExpense ? 'text-red-600' : 'text-green-600';
          const amountPrefix = isExpense ? '-' : '+';
          
          return (
            <div key={transaction.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: transaction.category.color }}
                />
                <div>
                  <div className="font-medium text-gray-900">{transaction.description}</div>
                  <div className="text-sm text-gray-600">
                    {transaction.category.name} • {new Date(transaction.transaction_date).toLocaleDateString('es-CO')}
                  </div>
                </div>
              </div>
              <div className={`font-bold ${amountColor}`}>
                {amountPrefix}{formatCurrency(transaction.amount)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
