import React from 'react';
import type { ShoppingListCardData } from '@/types/ai.types';

interface ShoppingListCardProps {
  data: ShoppingListCardData;
}

export const ShoppingListCard: React.FC<ShoppingListCardProps> = ({ data }) => {
  if (!data.items || data.items.length === 0) {
    const emptyMessage = data.estado === 'completados' 
      ? 'No tienes items completados en tu lista de compras'
      : 'No tienes items pendientes en tu lista de compras';
    
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Lista de Compras</h3>
        <div className="text-center py-4">
          <div className="text-gray-500 mb-2">{emptyMessage}</div>
          <div className="text-sm text-gray-400">
            {data.estado === 'completados' ? 'Marca items como completados para verlos aquí' : 'Agrega productos a tu lista de compras'}
          </div>
        </div>
      </div>
    );
  }

  const getStatusIcon = (state: string) => {
    return state === 'Completo' ? (
      <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
        <svg className="w-3 h-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </div>
    ) : (
      <div className="w-5 h-5 bg-gray-100 rounded-full flex items-center justify-center">
        <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
      </div>
    );
  };

  const getStatusColor = (state: string) => {
    return state === 'Completo' 
      ? 'text-green-600 bg-green-100' 
      : 'text-yellow-600 bg-yellow-100';
  };

  const getStatusText = (state: string) => {
    return state === 'Completo' ? 'Completado' : 'Pendiente';
  };

  const getTitle = () => {
    switch (data.estado) {
      case 'pendientes': return 'Lista de Compras - Pendientes';
      case 'completados': return 'Lista de Compras - Completados';
      default: return 'Lista de Compras';
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">{getTitle()}</h3>
        <span className="text-sm text-gray-500">{data.total} items</span>
      </div>
      
      <div className="space-y-3">
        {data.items.map((item) => (
          <div key={item.id} className="p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              {getStatusIcon(item.state)}
              
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-gray-900">
                    {item.productId ? `Producto ID ${item.productId}` : 'Item de compra'}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.state)}`}>
                    {getStatusText(item.state)}
                  </span>
                </div>
                
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <span>Cantidad: <span className="font-medium">{item.quantity}</span></span>
                  <span>ID: <span className="font-medium">{item.id}</span></span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
