import React from 'react';
import { ProductItem } from './ProductItem';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import type { ProductWithStatus } from '@/types/inventory.types';

interface ProductListProps {
  products: ProductWithStatus[];
  onIncrement: (productId: string) => void;
  onDecrement: (productId: string) => void;
  onProductClick?: (product: ProductWithStatus) => void;
  onProductDelete?: (productId: string) => void;
  loading?: boolean;
}

export const ProductList: React.FC<ProductListProps> = ({
  products,
  onIncrement,
  onDecrement,
  onProductClick,
  onProductDelete,
  loading = false,
}) => {
  if (loading) {
    return (
      <div className="py-8">
        <LoadingSpinner size="lg" text="Cargando productos..." />
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="bg-white rounded-xl p-8 text-center shadow-sm border border-gray-100">
        <div className="text-4xl mb-4">📦</div>
        <p className="text-gray-600 text-lg">
          No hay productos en el inventario
        </p>
        <p className="text-gray-500 text-sm mt-2">
          Agrega tu primer producto para comenzar
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {products.map((product) => (
        <ProductItem
          key={product.id}
          product={product}
          onIncrement={onIncrement}
          onDecrement={onDecrement}
          onProductClick={onProductClick}
          onProductDelete={onProductDelete}
        />
      ))}
    </div>
  );
};
