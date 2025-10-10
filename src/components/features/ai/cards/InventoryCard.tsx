import React from 'react';
import type { InventoryCardData } from '@/types/ai.types';

interface InventoryCardProps {
  data: InventoryCardData;
}

export const InventoryCard: React.FC<InventoryCardProps> = ({ data }) => {
  return (
    <div className="bg-white border-2 border-light rounded-lg p-3 md:p-4 mt-2">
      <div className="font-semibold text-sm md:text-base text-gray-800 mb-2 md:mb-3">📦 Inventario Actualizado</div>
      <div className="space-y-1 md:space-y-2 text-xs md:text-sm text-gray-600">
        <div className="break-words">Artículo: {data.item}</div>
        <div>Cantidad: {data.quantity} Unidades</div>
        <div className="break-words">Ubicación: {data.location}</div>
        <div>Caducidad: {data.expiryDate}</div>
      </div>
    </div>
  );
};