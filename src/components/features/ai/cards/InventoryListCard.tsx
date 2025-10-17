import React from 'react';
import type { InventoryListCardData } from '@/types/ai.types';
import { formatCurrency, formatDate } from '@/utils/formatters';

interface InventoryListCardProps {
  data: InventoryListCardData;
}

export const InventoryListCard: React.FC<InventoryListCardProps> = ({ data }) => {
  if (!data.productos || data.productos.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Inventario</h3>
        <div className="text-center py-4">
          <div className="text-gray-500 mb-2">No hay productos en el inventario</div>
          <div className="text-sm text-gray-400">Agrega productos para comenzar</div>
        </div>
      </div>
    );
  }

  const getExpiryStatus = (expiryDate: string) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return { status: 'expired', color: 'text-red-600 bg-red-100', text: 'Vencido' };
    if (diffDays <= 7) return { status: 'expiring', color: 'text-orange-600 bg-orange-100', text: 'Por vencer' };
    return { status: 'good', color: 'text-green-600 bg-green-100', text: 'Vigente' };
  };

  const totalUnits = data.productos.reduce((sum, product) => sum + product.quantity, 0);
  const totalValue = data.productos.reduce((sum, product) => {
    const price = typeof product.price === 'string' ? parseFloat(product.price) : product.price;
    return sum + (price * product.quantity);
  }, 0);

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          {data.categoria ? `Inventario - ${data.categoria}` : 'Inventario'}
        </h3>
        <span className="text-sm text-gray-500">{data.total} productos</span>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-4 p-3 bg-gray-50 rounded-lg">
        <div>
          <div className="text-sm text-gray-600">Total unidades</div>
          <div className="text-lg font-semibold text-gray-900">{totalUnits}</div>
        </div>
        <div>
          <div className="text-sm text-gray-600">Valor total</div>
          <div className="text-lg font-semibold text-gray-900">{formatCurrency(totalValue)}</div>
        </div>
      </div>
      
      <div className="space-y-3">
        {data.productos.map((product) => {
          const expiryStatus = getExpiryStatus(product.expiryDate);
          const price = typeof product.price === 'string' ? parseFloat(product.price) : product.price;
          
          return (
            <div key={product.id} className="p-3 bg-gray-50 rounded-lg">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{product.name}</h4>
                  <div className="text-sm text-gray-600">{product.category}</div>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${expiryStatus.color}`}>
                  {expiryStatus.text}
                </span>
              </div>
              
              <div className="grid grid-cols-3 gap-2 text-sm">
                <div>
                  <span className="text-gray-600">Cantidad:</span>
                  <span className="font-medium ml-1">{product.quantity}</span>
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
