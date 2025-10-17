import React from 'react';
import type { LowStockCardData } from '@/types/ai.types';
import { formatCurrency, formatDate } from '@/utils/formatters';

interface LowStockCardProps {
  data: LowStockCardData;
}

export const LowStockCard: React.FC<LowStockCardProps> = ({ data }) => {
  if (!data.productos_bajo_stock || data.productos_bajo_stock.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Stock Bajo</h3>
        <div className="text-center py-4">
          <div className="text-gray-500 mb-2">No hay productos con stock bajo</div>
          <div className="text-sm text-gray-400">Todos tus productos tienen suficiente stock</div>
        </div>
      </div>
    );
  }

  const getStockStatus = (quantity: number) => {
    if (quantity === 0) return { status: 'out', color: 'text-red-600 bg-red-100', text: 'Sin stock' };
    if (quantity === 1) return { status: 'critical', color: 'text-red-600 bg-red-100', text: 'Crítico' };
    return { status: 'low', color: 'text-orange-600 bg-orange-100', text: 'Bajo' };
  };

  const getExpiryStatus = (expiryDate: string) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return { status: 'expired', color: 'text-red-600 bg-red-100', text: 'Vencido' };
    if (diffDays <= 7) return { status: 'expiring', color: 'text-orange-600 bg-orange-100', text: 'Por vencer' };
    return { status: 'good', color: 'text-green-600 bg-green-100', text: 'Vigente' };
  };

  return (
    <div className="bg-white rounded-lg border border-orange-200 p-4 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
            <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Productos con Stock Bajo</h3>
        </div>
        <span className="text-sm text-orange-600 font-medium">{data.total} productos</span>
      </div>
      
      <div className="space-y-3">
        {data.productos_bajo_stock.map((product) => {
          const stockStatus = getStockStatus(product.quantity);
          const expiryStatus = getExpiryStatus(product.expiryDate);
          const price = typeof product.price === 'string' ? parseFloat(product.price) : product.price;
          
          return (
            <div key={product.id} className="p-3 bg-orange-50 rounded-lg border border-orange-200">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{product.name}</h4>
                  <div className="text-sm text-gray-600">{product.category}</div>
                </div>
                <div className="flex space-x-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${stockStatus.color}`}>
                    {stockStatus.text}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${expiryStatus.color}`}>
                    {expiryStatus.text}
                  </span>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-2 text-sm">
                <div>
                  <span className="text-gray-600">Stock:</span>
                  <span className="font-medium ml-1 text-orange-600">{product.quantity}</span>
                </div>
                <div>
                  <span className="text-gray-600">Precio:</span>
                  <span className="font-medium ml-1">{formatCurrency(price)}</span>
                </div>
                <div>
                  <span className="text-gray-600">Vence:</span>
                  <span className="font-medium ml-1">{formatDate(product.expiryDate)}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
