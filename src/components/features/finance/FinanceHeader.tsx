import React from 'react';
import { Plus, Download, DollarSign } from 'lucide-react';

interface FinanceHeaderProps {
  onNewIncome: () => void;
  onNewExpense: () => void;
  onExport: () => void;
}

export const FinanceHeader: React.FC<FinanceHeaderProps> = ({
  onNewIncome,
  onNewExpense,
  onExport,
}) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
          <DollarSign className="w-5 h-5 text-primary" />
        </div>
        <h1 className="text-2xl md:text-3xl font-semibold text-gray-900">
          Gestión de Finanzas
        </h1>
      </div>

      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
        <button
          onClick={onNewIncome}
          className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white font-medium rounded-lg transition-colors text-sm"
        >
          <Plus className="w-4 h-4" />
          Nuevo Ingreso
        </button>
        
        <button
          onClick={onNewExpense}
          className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-dark text-white font-medium rounded-lg transition-colors text-sm"
        >
          <Plus className="w-4 h-4" />
          Nuevo Gasto
        </button>
        
        <button
          onClick={onExport}
          className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-gray-50 text-gray-700 font-medium rounded-lg border border-gray-300 transition-colors text-sm"
        >
          <Download className="w-4 h-4" />
          Exportar
        </button>
      </div>
    </div>
  );
};
