import React from 'react';
import type { Transaction } from '@/types/finance.types';
import { financeUtils } from '@/api/services/financeService';

interface TransactionItemProps {
  transaction: Transaction;
  onClick?: () => void;
}

export const TransactionItem: React.FC<TransactionItemProps> = ({ transaction, onClick }) => {
  const getCategoryIcon = (categoryName: string) => {
    return financeUtils.getCategoryIcon(categoryName);
  };

  const getCategoryBg = (categoryName: string) => {
    const backgrounds: Record<string, string> = {
      'alimentacion': 'bg-orange-100',
      'supermercado': 'bg-orange-100',
      'transporte': 'bg-purple-100',
      'gasolina': 'bg-purple-100',
      'hogar': 'bg-blue-100',
      'casa': 'bg-blue-100',
      'entretenimiento': 'bg-pink-100',
      'salud': 'bg-teal-100',
      'medicina': 'bg-teal-100',
      'educacion': 'bg-yellow-100',
      'salario': 'bg-green-100',
      'ingreso': 'bg-green-100',
      'otros': 'bg-gray-100',
      'imprevistos': 'bg-red-100',
    };
    return backgrounds[categoryName.toLowerCase()] || 'bg-gray-100';
  };

  const getCategoryColor = (categoryName: string) => {
    const colors: Record<string, string> = {
      'alimentacion': 'text-orange-600',
      'supermercado': 'text-orange-600',
      'transporte': 'text-purple-600',
      'gasolina': 'text-purple-600',
      'hogar': 'text-blue-600',
      'casa': 'text-blue-600',
      'entretenimiento': 'text-pink-600',
      'salud': 'text-teal-600',
      'medicina': 'text-teal-600',
      'educacion': 'text-yellow-600',
      'salario': 'text-green-600',
      'ingreso': 'text-green-600',
      'otros': 'text-gray-600',
      'imprevistos': 'text-red-600',
    };
    return colors[categoryName.toLowerCase()] || 'text-gray-600';
  };

  const formatAmount = (amount: number, type: 'INCOME' | 'EXPENSE') => {
    const sign = type === 'EXPENSE' ? '-' : '+';
    return `${sign}$${Math.abs(amount).toLocaleString()}`;
  };

  const formatDate = (dateString: string) => {
    return financeUtils.getRelativeDate(dateString);
  };

  return (
    <div
      className="flex items-center p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer"
      onClick={onClick}
    >
      <div className={`w-11 h-11 ${getCategoryBg(transaction.category.name)} rounded-lg flex items-center justify-center mr-4 text-lg flex-shrink-0`}>
        {getCategoryIcon(transaction.category.name)}
      </div>

      <div className="flex-1 min-w-0">
        <div className="text-sm md:text-base font-medium text-gray-900 mb-1">
          {transaction.description}
        </div>
        <div className="flex items-center gap-2 text-xs md:text-sm text-gray-500">
          <span>Usuario</span>
          <span>•</span>
          <span>{formatDate(transaction.transaction_date)}</span>
          <span className={`px-2 py-1 rounded text-xs font-medium ${getCategoryBg(transaction.category.name)} ${getCategoryColor(transaction.category.name)}`}>
            {transaction.category.name}
          </span>
        </div>
      </div>

      <div className={`text-base md:text-lg font-semibold ${
        transaction.type === 'EXPENSE' ? 'text-red-500' : 'text-green-500'
      }`}>
        {formatAmount(transaction.amount, transaction.type)}
      </div>
    </div>
  );
};
