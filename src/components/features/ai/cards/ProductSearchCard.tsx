import React from 'react';
import type { ProductSearchCardData } from '@/types/ai.types';
import { formatCurrency, formatDate } from '@/utils/formatters';

interface ProductSearchCardProps {
  data: ProductSearchCardData;
}

export const ProductSearchCard: React.FC<ProductSearchCardProps> = ({ data }) => {
  if (!data.productos_encontrados || data.productos_encontrados.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Búsqueda de Productos</h3>
        <div className="text-center py-4">
          <div className="text-gray-500 mb-2">No se encontraron productos</div>
          <div className="text-sm text-gray-400">Búsqueda: "{data.busqueda}"</div>
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

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Resultados de Búsqueda</h3>
        <div className="text-right">
          <div className="text-sm text-gray-500">Búsqueda: "{data.busqueda}"</div>
          <div className="text-sm text-gray-500">{data.total} producto(s) encontrado(s)</div>
        </div>
      </div>
      
      <div className="space-y-3">
        {data.productos_encontrados.map((product) => {
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
