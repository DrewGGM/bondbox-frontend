import React, { useState } from 'react';
import type { Transaction } from '@/types/finance.types';
import { TransactionItem } from './TransactionItem';

interface TransactionsListProps {
  transactions: Transaction[];
  onTransactionClick?: (transaction: Transaction) => void;
  onTransactionDelete?: (transaction: Transaction) => void;
  loading?: boolean;
}

export const TransactionsList: React.FC<TransactionsListProps> = ({
  transactions,
  onTransactionClick,
  onTransactionDelete,
  loading = false
}) => {
  const [viewMode, setViewMode] = useState<'list' | 'chart'>('list');

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 md:p-6">
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-lg md:text-xl font-semibold text-gray-900">
          Transacciones Recientes
        </h2>
        
        <div className="flex bg-gray-100 p-1 rounded-lg">
          <button
            onClick={() => setViewMode('list')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              viewMode === 'list'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Lista
          </button>
          <button
            onClick={() => setViewMode('chart')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              viewMode === 'chart'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Gráfico
          </button>
        </div>
      </div>

      {viewMode === 'list' ? (
        <div className="max-h-96 overflow-y-auto transactions-scroll">
          {loading ? (
            <div className="text-center py-8 text-gray-500">
              <div className="text-4xl mb-2">⏳</div>
              <p>Cargando transacciones...</p>
            </div>
          ) : transactions.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <div className="text-4xl mb-2">📊</div>
              <p>No hay transacciones para mostrar</p>
            </div>
          ) : (
            <div className="space-y-0">
              {transactions.map((transaction) => (
                <TransactionItem
                  key={transaction.id}
                  transaction={transaction}
                  onClick={() => onTransactionClick?.(transaction)}
                  onDelete={() => onTransactionDelete?.(transaction)}
                />
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          <div className="text-4xl mb-2">📈</div>
          <p>Vista de gráfico próximamente</p>
        </div>
      )}
    </div>
  );
};
