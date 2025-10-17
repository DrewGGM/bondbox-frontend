import React from 'react';
import type { ProductCardData } from '@/types/ai.types';
import { formatCurrency, formatDate } from '@/utils/formatters';

interface ProductCardProps {
  data: ProductCardData;
}

export const ProductCard: React.FC<ProductCardProps> = ({ data }) => {
  const getExpiryStatus = (expiryDate: string) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return { status: 'expired', color: 'text-red-600 bg-red-100', text: 'Vencido' };
    if (diffDays <= 7) return { status: 'expiring', color: 'text-orange-600 bg-orange-100', text: 'Por vencer' };
    return { status: 'good', color: 'text-green-600 bg-green-100', text: 'Vigente' };
  };

  const expiryStatus = getExpiryStatus(data.expiryDate);
  const price = typeof data.price === 'string' ? parseFloat(data.price) : data.price;

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">{data.name}</h3>
          <div className="flex items-center space-x-2 mb-2">
            <span className="text-sm text-gray-600">Categoría:</span>
            <span className="text-sm font-medium text-gray-900">{data.category}</span>
          </div>
        </div>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${expiryStatus.color}`}>
          {expiryStatus.text}
        </span>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-3">
        <div>
          <div className="text-sm text-gray-600">Cantidad</div>
          <div className="text-lg font-semibold text-gray-900">{data.quantity} unidades</div>
        </div>
        <div>
          <div className="text-sm text-gray-600">Precio</div>
          <div className="text-lg font-semibold text-gray-900">{formatCurrency(price)}</div>
        </div>
      </div>
      
      <div className="border-t pt-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Vence:</span>
          <span className="text-sm font-medium text-gray-900">{formatDate(data.expiryDate)}</span>
        </div>
        {data.idInventory && (
          <div className="flex items-center justify-between mt-1">
            <span className="text-sm text-gray-600">Inventario ID:</span>
            <span className="text-sm font-medium text-gray-900">{data.idInventory}</span>
          </div>
        )}
      </div>
    </div>
  );
};
