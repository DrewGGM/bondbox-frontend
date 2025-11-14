import React from 'react';
import { Minus, Plus, Trash2, Edit } from 'lucide-react';
import type { ProductWithStatus } from '@/types/inventory.types';

interface ProductItemProps {
  product: ProductWithStatus;
  onIncrement: (productId: string) => void;
  onDecrement: (productId: string) => void;
  onProductClick?: (product: ProductWithStatus) => void;
  onProductDelete?: (productId: string) => void;
}

export const ProductItem: React.FC<ProductItemProps> = ({
  product,
  onIncrement,
  onDecrement,
  onProductClick,
  onProductDelete,
}) => {
  const getExpirationColor = () => {
    switch (product.expiration_status) {
      case 'expired':
        return 'text-red-600';
      case 'expiring_soon':
        return 'text-orange-600';
      default:
        return 'text-green-600';
    }
  };

  const getExpirationText = () => {
    if (product.expiration_status === 'expired') {
      if (product.days_until_expiration === -1) {
        return 'Venció ayer';
      }
      return `Venció hace ${Math.abs(product.days_until_expiration)} días`;
    }
    if (product.expiration_status === 'expiring_soon') {
      return `Vence en ${product.days_until_expiration} días`;
    }
    if (product.days_until_expiration > 30) {
      const months = Math.floor(product.days_until_expiration / 30);
      return `Vence en ${months} ${months === 1 ? 'mes' : 'meses'}`;
    }
    return `Vence en ${product.days_until_expiration} días`;
  };

  const getProductIcon = () => {
    // Simple icon mapping based on product name
    const name = product.name.toLowerCase();
    if (name.includes('leche') || name.includes('milk')) return '🥛';
    if (name.includes('huevo') || name.includes('egg')) return '🥚';
    if (name.includes('queso') || name.includes('cheese')) return '🧀';
    if (name.includes('pasta') || name.includes('spaghetti')) return '🍝';
    if (name.includes('pan') || name.includes('bread')) return '🍞';
    if (name.includes('arroz') || name.includes('rice')) return '🍚';
    if (name.includes('pollo') || name.includes('chicken')) return '🍗';
    if (name.includes('pescado') || name.includes('fish')) return '🐟';
    if (name.includes('verdura') || name.includes('vegetable')) return '🥬';
    if (name.includes('fruta') || name.includes('fruit')) return '🍎';
    return '📦';
  };

  const handleDecrement = () => {
    if (product.quantity > 0) {
      onDecrement(product.id);
    }
  };

  const handleIncrement = () => {
    onIncrement(product.id);
  };

  return (
    <div
      className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex items-center gap-4 cursor-pointer hover:shadow-md transition-shadow"
      onClick={() => onProductClick?.(product)}
    >
      <div className="text-3xl flex-shrink-0">{getProductIcon()}</div>

      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-gray-900 mb-1 truncate">
          {product.name}
        </h3>
        <p className={`text-sm font-medium ${getExpirationColor()}`}>
          {getExpirationText()}
        </p>
      </div>

      <div className="flex items-center gap-3 flex-shrink-0">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onProductClick?.(product);
          }}
          className="w-8 h-8 rounded-full bg-blue-100 hover:bg-blue-200 flex items-center justify-center transition-colors"
          title="Editar producto"
        >
          <Edit className="w-4 h-4 text-blue-600" />
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            handleDecrement();
          }}
          className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
          disabled={product.quantity === 0}
        >
          <Minus className="w-4 h-4 text-gray-600" />
        </button>

        <span className="text-lg font-semibold text-orange-600 min-w-[2rem] text-center">
          {product.quantity}
        </span>

        <button
          onClick={(e) => {
            e.stopPropagation();
            handleIncrement();
          }}
          className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
        >
          <Plus className="w-4 h-4 text-gray-600" />
        </button>

        {onProductDelete && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (
                window.confirm(
                  `¿Estás seguro de que deseas eliminar "${product.name}"?`
                )
              ) {
                onProductDelete(product.id);
              }
            }}
            className="w-8 h-8 rounded-full bg-red-100 hover:bg-red-200 flex items-center justify-center transition-colors"
            title="Eliminar producto"
          >
            <Trash2 className="w-4 h-4 text-red-600" />
          </button>
        )}
      </div>
    </div>
  );
};
