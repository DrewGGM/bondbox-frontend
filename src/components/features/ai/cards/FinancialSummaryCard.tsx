import React from 'react';
import type { FinancialSummaryCardData } from '@/types/ai.types';
import { formatCurrency } from '@/utils/formatters';

interface FinancialSummaryCardProps {
  data: FinancialSummaryCardData;
}

export const FinancialSummaryCard: React.FC<FinancialSummaryCardProps> = ({ data }) => {
  const { summary, income_by_category, expense_by_category } = data;
  const isPositiveBalance = summary.net_balance.value >= 0;
  
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Resumen Financiero</h3>
      
      {/* Resumen principal */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">
            {formatCurrency(summary.total_income.value)}
          </div>
          <div className="text-sm text-gray-600">Ingresos</div>
        </div>
        
        <div className="text-center">
          <div className="text-2xl font-bold text-red-600">
            {formatCurrency(summary.total_expenses.value)}
          </div>
          <div className="text-sm text-gray-600">Gastos</div>
        </div>
        
        <div className="text-center">
          <div className={`text-2xl font-bold ${isPositiveBalance ? 'text-green-600' : 'text-red-600'}`}>
            {formatCurrency(summary.net_balance.value)}
          </div>
          <div className="text-sm text-gray-600">Balance</div>
        </div>
      </div>
      
      {/* Ingresos por categoría */}
      {income_by_category.length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Ingresos por Categoría</h4>
          <div className="space-y-2">
            {income_by_category.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: item.category.color }}
                  />
                  <span className="text-sm text-gray-700">{item.category.name}</span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-green-600">
                    {formatCurrency(item.total.value)}
                  </div>
                  <div className="text-xs text-gray-500">{item.percentage.toFixed(1)}%</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Gastos por categoría */}
      {expense_by_category.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">Gastos por Categoría</h4>
          <div className="space-y-2">
            {expense_by_category.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: item.category.color }}
                  />
                  <span className="text-sm text-gray-700">{item.category.name}</span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-red-600">
                    {formatCurrency(item.total.value)}
                  </div>
                  <div className="text-xs text-gray-500">{item.percentage.toFixed(1)}%</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="text-sm text-gray-500 text-center">
          Total de transacciones: {summary.transaction_count}
        </div>
      </div>
    </div>
  );
};
