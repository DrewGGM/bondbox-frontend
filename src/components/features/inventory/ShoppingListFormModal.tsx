import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import type { ShoppingList, CreateShoppingListRequest, UpdateShoppingListRequest } from '@/types/inventory.types';

interface ShoppingListFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateShoppingListRequest | UpdateShoppingListRequest) => Promise<void>;
  shoppingList?: ShoppingList;
  groupId: string;
}

interface ShoppingListItem {
  product_name: string;
  quantity: number;
}

export const ShoppingListFormModal: React.FC<ShoppingListFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  shoppingList,
  groupId,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    items: [] as ShoppingListItem[],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (shoppingList) {
      setFormData({
        name: shoppingList.name,
        items: shoppingList.items.map((item) => ({
          product_name: item.product_name,
          quantity: item.quantity,
        })),
      });
    } else {
      setFormData({
        name: '',
        items: [],
      });
    }
    setError(null);
  }, [shoppingList, isOpen]);

  const handleAddItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { product_name: '', quantity: 1 }],
    });
  };

  const handleRemoveItem = (index: number) => {
    setFormData({
      ...formData,
      items: formData.items.filter((_, i) => i !== index),
    });
  };

  const handleItemChange = (index: number, field: 'product_name' | 'quantity', value: string | number) => {
    const newItems = [...formData.items];
    newItems[index] = {
      ...newItems[index],
      [field]: field === 'quantity' ? Number(value) : value,
    };
    setFormData({ ...formData, items: newItems });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (!formData.name.trim()) {
        throw new Error('El nombre de la lista es requerido');
      }

      const submitData = shoppingList
        ? ({ name: formData.name } as UpdateShoppingListRequest)
        : ({
            name: formData.name,
            group_id: groupId,
            items: formData.items.filter((item) => item.product_name.trim() !== ''),
          } as CreateShoppingListRequest);

      await onSubmit(submitData);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Error al guardar la lista de compras');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">
            {shoppingList ? 'Editar Lista de Compras' : 'Nueva Lista de Compras'}
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
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Nombre de la Lista
            </label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Ej: Compras del Supermercado"
              required
            />
          </div>

          {!shoppingList && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="block text-sm font-medium text-gray-700">
                  Productos
                </label>
                <button
                  type="button"
                  onClick={handleAddItem}
                  className="flex items-center gap-2 px-3 py-1.5 text-sm bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Agregar Producto
                </button>
              </div>

              <div className="space-y-3">
                {formData.items.map((item, index) => (
                  <div key={index} className="flex gap-2 items-center">
                    <input
                      type="text"
                      value={item.product_name}
                      onChange={(e) => handleItemChange(index, 'product_name', e.target.value)}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="Nombre del producto"
                    />
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                      className="w-20 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      min="1"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveItem(index)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                ))}

                {formData.items.length === 0 && (
                  <p className="text-sm text-gray-500 text-center py-4">
                    No hay productos agregados. Haz clic en "Agregar Producto" para comenzar.
                  </p>
                )}
              </div>
            </div>
          )}

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
              {loading ? 'Guardando...' : shoppingList ? 'Actualizar' : 'Crear'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

