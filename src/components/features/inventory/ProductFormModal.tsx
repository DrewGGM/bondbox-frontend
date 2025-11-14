import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useGroupStore } from '@/store/groupStore';
import type {
  Product,
  CreateProductRequest,
  UpdateProductRequest,
  ProductCategory,
} from '@/types/inventory.types';

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (
    data: CreateProductRequest | UpdateProductRequest
  ) => Promise<void>;
  product?: Product;
  categories: ProductCategory[];
  groupId: string;
}

export const ProductFormModal: React.FC<ProductFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  product,
  categories,
  groupId: propGroupId,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    quantity: 1,
    expiration_date: '',
    category_id: '',
    price: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (product) {
      // Format expiration_date - handle multiple formats and field names
      let formattedDate = '';
      // Check both expiration_date and expiryDate (camelCase from API)
      const expirationDate =
        product.expiration_date || (product as any).expiryDate || '';

      if (expirationDate) {
        try {
          // Handle ISO string format (2024-02-15T00:00:00.000Z or 2024-02-15T00:00:00)
          if (expirationDate.includes('T')) {
            formattedDate = expirationDate.split('T')[0];
          }
          // Handle YYYY-MM-DD format
          else if (expirationDate.match(/^\d{4}-\d{2}-\d{2}$/)) {
            formattedDate = expirationDate;
          }
          // Handle DD/MM/YYYY format
          else if (expirationDate.includes('/')) {
            const parts = expirationDate.split('/');
            if (parts.length === 3) {
              // Assume DD/MM/YYYY format
              formattedDate = `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
            }
          }
          // Try to parse as date
          else {
            const dateObj = new Date(expirationDate);
            if (!isNaN(dateObj.getTime())) {
              formattedDate = dateObj.toISOString().split('T')[0];
            }
          }
        } catch (error) {
          // If all else fails, try to extract YYYY-MM-DD from the string
          const dateMatch = expirationDate.match(/(\d{4}-\d{2}-\d{2})/);
          if (dateMatch) {
            formattedDate = dateMatch[1];
          }
        }
      }

      // Get price - check multiple possible locations
      let productPrice = 0;
      if (product.price !== undefined && product.price !== null) {
        productPrice = Number(product.price);
      } else if (
        (product as any).price !== undefined &&
        (product as any).price !== null
      ) {
        productPrice = Number((product as any).price);
      }

      // Get category_id - handle both direct category_id and category object/string
      let categoryId = '';

      // First, try direct category_id (should be '1', '2', '3', '4', or '5')
      if (product.category_id) {
        categoryId = String(product.category_id).trim();
      }
      // If category_id is not available, try to map from category object
      else if (
        product.category &&
        typeof product.category === 'object' &&
        product.category.name
      ) {
        // Map category name back to category_id
        const categoryName = product.category.name;
        const categoryMap: Record<string, string> = {
          Lácteos: '1',
          Lacteos: '1',
          Carnes: '2',
          'Frutas y Verduras': '3',
          Granos: '4',
          Snacks: '5',
        };
        categoryId = categoryMap[categoryName] || '';
      }
      // Also check if category comes as a string directly
      else if ((product as any).category) {
        const categoryName = String((product as any).category).trim();
        const categoryMap: Record<string, string> = {
          Lácteos: '1',
          Lacteos: '1',
          Carnes: '2',
          'Frutas y Verduras': '3',
          Granos: '4',
          Snacks: '5',
        };
        categoryId = categoryMap[categoryName] || '';
      }

      // If still no categoryId found, default to empty (don't default to '1')
      // This will show an error if category is required

      // Get quantity - ensure it's a number
      let quantity = 1;
      if (product.quantity !== undefined && product.quantity !== null) {
        quantity = Number(product.quantity);
      }

      // Get name - ensure it's a string
      const name = product.name || '';

      setFormData({
        name: name,
        quantity: quantity,
        expiration_date: formattedDate,
        category_id: categoryId,
        price: productPrice,
      });
    } else {
      setFormData({
        name: '',
        quantity: 1,
        expiration_date: '',
        category_id: categories.length > 0 ? categories[0].id : '',
        price: 0,
      });
    }
    setError(null);
  }, [product, categories, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // Campos no son obligatorios - solo enviar los que tienen valor
      if (product) {
        // Get groupId - MUST get from store at submit time (same as create)
        const storeState = useGroupStore.getState();
        const storeGroupId = storeState.selectedGroup?.id;
        const finalGroupId = storeGroupId || propGroupId || '';

        if (!finalGroupId) {
          throw new Error(
            'ID de grupo requerido. Por favor, selecciona un grupo primero desde el dashboard.'
          );
        }

        const updateData: UpdateProductRequest = {
          group_id: finalGroupId, // Always include group_id
        };

        if (formData.name.trim()) {
          updateData.name = formData.name.trim();
        }
        if (formData.quantity !== undefined && formData.quantity !== null) {
          updateData.quantity = Number(formData.quantity);
        }
        if (formData.expiration_date) {
          updateData.expiration_date = formData.expiration_date;
        }
        if (formData.category_id) {
          updateData.category_id = formData.category_id;
        }
        if (
          formData.price !== undefined &&
          formData.price !== null &&
          formData.price > 0
        ) {
          updateData.price = Number(formData.price);
        }

        await onSubmit(updateData);
      } else {
        // Para crear, algunos campos sí son requeridos
        if (!formData.name.trim()) {
          throw new Error('El nombre del producto es requerido');
        }
        if (!formData.expiration_date) {
          throw new Error('La fecha de vencimiento es requerida');
        }
        if (!formData.category_id) {
          throw new Error('La categoría es requerida');
        }

        // Get groupId - MUST get from store at submit time
        const storeState = useGroupStore.getState();
        const storeGroupId = storeState.selectedGroup?.id;
        const finalGroupId = storeGroupId || propGroupId || '';

        if (!finalGroupId) {
          throw new Error(
            'ID de grupo requerido. Por favor, selecciona un grupo primero desde el dashboard.'
          );
        }

        const createData: CreateProductRequest = {
          name: formData.name.trim(),
          quantity: Number(formData.quantity) || 1,
          expiration_date: formData.expiration_date,
          category_id: formData.category_id,
          group_id: finalGroupId,
          price: Number(formData.price) || 0,
        };

        await onSubmit(createData);
      }
      onClose();
    } catch (err: any) {
      setError(err.message || 'Error al guardar el producto');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">
            {product ? 'Editar Producto' : 'Añadir Producto'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Nombre del Producto
            </label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Ej: Leche Descremada"
            />
          </div>

          <div>
            <label
              htmlFor="quantity"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Cantidad
            </label>
            <input
              type="number"
              id="quantity"
              value={formData.quantity}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  quantity: parseInt(e.target.value) || 0,
                })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              min="0"
            />
          </div>

          <div>
            <label
              htmlFor="expiration_date"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Fecha de Vencimiento
            </label>
            <input
              type="date"
              id="expiration_date"
              value={formData.expiration_date}
              onChange={(e) =>
                setFormData({ ...formData, expiration_date: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          <div>
            <label
              htmlFor="category_id"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Categoría
            </label>
            <select
              id="category_id"
              value={formData.category_id}
              onChange={(e) =>
                setFormData({ ...formData, category_id: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              {categories.length === 0 ? (
                <option value="">No hay categorías disponibles</option>
              ) : (
                categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))
              )}
            </select>
          </div>

          <div>
            <label
              htmlFor="price"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Precio
            </label>
            <input
              type="number"
              id="price"
              value={formData.price}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  price: parseFloat(e.target.value) || 0,
                })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              min="0"
              step="0.01"
              placeholder="0.00"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Guardando...' : product ? 'Actualizar' : 'Añadir'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
