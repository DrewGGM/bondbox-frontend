import React from 'react';
import type { InventoryCardData } from '@/types/ai.types';

interface InventoryCardProps {
  data: InventoryCardData;
}

export const InventoryCard: React.FC<InventoryCardProps> = ({ data }) => {
  return (
    <div className="bg-white border-2 border-light rounded-lg p-4 mt-2">
      <div className="font-semibold text-gray-800 mb-3">📦 Inventario Actualizado</div>
      <div className="space-y-2 text-sm text-gray-600">
        <div>Artículo: {data.item}</div>
        <div>Cantidad: {data.quantity} Unidades</div>
        <div>Ubicación: {data.location}</div>
        <div>Caducidad: {data.expiryDate}</div>
      </div>
    </div>
  );
};