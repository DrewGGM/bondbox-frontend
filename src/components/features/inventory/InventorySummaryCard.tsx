import React from 'react';
import { AlertTriangle, Clock } from 'lucide-react';

interface InventorySummaryCardProps {
  type: 'low_stock' | 'expiring_soon';
  count: number;
}

export const InventorySummaryCard: React.FC<InventorySummaryCardProps> = ({
  type,
  count,
}) => {
  const isLowStock = type === 'low_stock';

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <div
        className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${
          isLowStock ? 'bg-yellow-100' : 'bg-pink-100'
        }`}
      >
        {isLowStock ? (
          <AlertTriangle className="w-6 h-6 text-yellow-600" />
        ) : (
          <Clock className="w-6 h-6 text-pink-600" />
        )}
      </div>

      <div className="text-3xl font-bold text-gray-900 mb-2">{count}</div>

      <div className="text-sm text-gray-600">
        {isLowStock ? 'Bajos de Stock' : 'Vencen Pronto'}
      </div>
    </div>
  );
};
