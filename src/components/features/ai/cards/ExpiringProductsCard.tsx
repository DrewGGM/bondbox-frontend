import React from 'react';
import type { ExpiringProductsCardData } from '@/types/ai.types';
import { formatCurrency, formatDate } from '@/utils/formatters';

interface ExpiringProductsCardProps {
  data: ExpiringProductsCardData;
}

export const ExpiringProductsCard: React.FC<ExpiringProductsCardProps> = ({ data }) => {
  if (!data.productos_vencidos || data.productos_vencidos.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Productos por Vencer</h3>
        <div className="text-center py-4">
          <div className="text-gray-500 mb-2">No hay productos próximos a vencer</div>
          <div className="text-sm text-gray-400">Todos tus productos están vigentes</div>
        </div>
      </div>
    );
  }

  const getExpiryStatus = (expiryDate: string) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return { status: 'expired', color: 'text-red-600 bg-red-100', text: 'Vencido', days: Math.abs(diffDays) };
    if (diffDays <= 7) return { status: 'expiring', color: 'text-orange-600 bg-orange-100', text: 'Por vencer', days: diffDays };
    return { status: 'good', color: 'text-green-600 bg-green-100', text: 'Vigente', days: diffDays };
  };

  return (
    <div className="bg-white rounded-lg border border-red-200 p-4 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
            <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Productos por Vencer</h3>
        </div>
        <span className="text-sm text-red-600 font-medium">{data.total} productos</span>
      </div>
      
      <div className="space-y-3">
        {data.productos_vencidos.map((product) => {
          const expiryStatus = getExpiryStatus(product.expiryDate);
          const price = typeof product.price === 'string' ? parseFloat(product.price) : product.price;
          
          return (
            <div key={product.id} className="p-3 bg-red-50 rounded-lg border border-red-200">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{product.name}</h4>
                  <div className="text-sm text-gray-600">{product.category}</div>
                </div>
                <div className="text-right">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${expiryStatus.color}`}>
                    {expiryStatus.text}
                  </span>
                  <div className="text-xs text-gray-500 mt-1">
                    {expiryStatus.days === 0 ? 'Hoy' : 
                     expiryStatus.days < 0 ? `Hace ${expiryStatus.days} días` :
                     `En ${expiryStatus.days} días`}
                  </div>
                </div>
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
