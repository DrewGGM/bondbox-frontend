import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Header } from '@/components/layout/Header';
import { ArrowLeft, Plus, Filter, Edit2, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useInventory } from '@/hooks/useInventory';
import { useGroupStore } from '@/store/groupStore';
import { AddShoppingListItemModal } from '@/components/features/inventory/AddShoppingListItemModal';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { ErrorMessage } from '@/components/common/ErrorMessage';
import type {
  AddItemToShoppingListRequest,
  Product,
  ShoppingListItem,
} from '@/types/inventory.types';
import { shoppingListService } from '@/api/services/inventoryService';

type FilterState = 'todos' | 'Pendiente' | 'Completo';

interface ShoppingListItemWithState extends ShoppingListItem {
  state: string;
  listName: string;
}

export const ShoppingListPage: React.FC = () => {
  const navigate = useNavigate();
  const [addItemModalOpen, setAddItemModalOpen] = useState(false);
  const [filterState, setFilterState] = useState<FilterState>('todos');
  const [allItems, setAllItems] = useState<ShoppingListItemWithState[]>([]);
  const [loadingItems, setLoadingItems] = useState(false);
  const [editingItem, setEditingItem] =
    useState<ShoppingListItemWithState | null>(null);
  const [editState, setEditState] = useState<string>('Pendiente');
  const selectedGroup = useGroupStore((state) => state.selectedGroup);

  if (!selectedGroup || !selectedGroup.id) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
            <p className="text-yellow-800 text-lg font-medium">
              No hay un grupo seleccionado
            </p>
          </div>
        </main>
      </div>
    );
  }

  const groupId = selectedGroup.id;
  const { products, loading, error, clearError } = useInventory(groupId);

  // Load items from API based on filter
  const loadAllItems = useCallback(async () => {
    setLoadingItems(true);
    try {
      let items: ShoppingListItem[] = [];

      if (filterState === 'todos') {
        // Load all items
        items = await shoppingListService.getAllItems(groupId);
      } else if (filterState === 'Completo') {
        items = await shoppingListService.getItemsByStatus(
          groupId,
          'completados'
        );
      } else if (filterState === 'Pendiente') {
        items = await shoppingListService.getItemsByStatus(
          groupId,
          'pendientes'
        );
      }

      // Map items to include state, list name, and product name
      const itemsWithState: ShoppingListItemWithState[] = items.map(
        (item: any) => {
          let itemState = 'Pendiente';
          if (
            filterState === 'Completo' ||
            item.state === 'Completo' ||
            item.state === 'Completado' ||
            item.is_completed
          ) {
            itemState = 'Completo';
          }

          // Get product name: use product_name if available, otherwise find by productId
          let productName = item.product_name || '';
          if (!productName && (item.productId || item.product_id)) {
            const productId = item.productId || item.product_id;
            // Try to find product by matching id (handle both string and number)
            const product = products.find(
              (p) => p.id === String(productId) || p.id === productId
            );
            if (product) {
              productName = product.name;
            }
          }

          return {
            ...item,
            state: itemState,
            listName: item.list_name || item.shopping_list_name || 'Sin lista',
            product_name:
              productName || item.product_name || 'Producto sin nombre',
          };
        }
      );

      setAllItems(itemsWithState);
    } catch (err: any) {
      setAllItems([]);
    } finally {
      setLoadingItems(false);
    }
  }, [groupId, filterState, products]);

  useEffect(() => {
    if (groupId) {
      loadAllItems();
    }
  }, [groupId, filterState, loadAllItems]);

  const handleAddItem = async (data: AddItemToShoppingListRequest) => {
    try {
      await shoppingListService.addItem(data);
      await loadAllItems();
    } catch (err: any) {
      throw err;
    }
  };

  const handleEditItem = async () => {
    if (!editingItem) return;

    try {
      await shoppingListService.updateItem(editingItem.id, {
        state: editState,
      });
      setEditingItem(null);
      await loadAllItems();
    } catch (err: any) {
      alert(
        `Error al actualizar el item: ${err.response?.data?.message || err.message || 'Error desconocido'}`
      );
    }
  };

  const handleDeleteItem = async (itemId: string) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar este item?')) {
      return;
    }

    try {
      await shoppingListService.deleteItem(itemId);
      await loadAllItems();
    } catch (err: any) {
      throw err;
    }
  };

  const openEditModal = (item: ShoppingListItemWithState) => {
    setEditingItem(item);
    // Convert 'Completado' to 'Completo' for consistency
    setEditState(item.state === 'Completado' ? 'Completo' : item.state);
  };

  // Filter items based on selected filter
  const filteredItems = useMemo(() => {
    if (filterState === 'todos') {
      return allItems;
    }
    return allItems.filter((item) => item.state === filterState);
  }, [allItems, filterState]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        {/* Header with back button */}
        <div className="mb-6">
          <button
            onClick={() => navigate('/inventario')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Volver a Inventario</span>
          </button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Lista de Compras
              </h1>
              <p className="text-gray-600">
                Gestiona los productos que necesitas comprar
              </p>
            </div>
            <button
              onClick={() => setAddItemModalOpen(true)}
              className="flex items-center gap-2 px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium"
            >
              <Plus className="w-5 h-5" />
              Agregar Item
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-6">
            <ErrorMessage message={error} onDismiss={clearError} />
          </div>
        )}

        {/* Filter Section */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 mb-6">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-gray-700">
              <Filter className="w-5 h-5" />
              <span className="font-medium">Filtrar por estado:</span>
            </div>
            <div className="flex gap-2">
              {(['todos', 'Pendiente', 'Completo'] as FilterState[]).map(
                (state) => (
                  <button
                    key={state}
                    onClick={() => setFilterState(state)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      filterState === state
                        ? 'bg-orange-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {state === 'todos' ? 'Todos' : state}
                  </button>
                )
              )}
            </div>
            <div className="ml-auto text-sm text-gray-500">
              {filteredItems.length}{' '}
              {filteredItems.length === 1 ? 'item' : 'items'}
            </div>
          </div>
        </div>

        {/* Shopping List Items */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Items de Compra
          </h2>
          {loadingItems || loading.shoppingLists ? (
            <LoadingSpinner
              size="lg"
              text="Cargando items de compra..."
              className="py-8"
            />
          ) : filteredItems.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-4xl mb-4">🛒</div>
              <p className="text-gray-600 text-lg">
                {filterState === 'todos'
                  ? 'No hay items de compra'
                  : `No hay items con estado "${filterState}"`}
              </p>
              <p className="text-gray-500 text-sm mt-2">
                {filterState === 'todos'
                  ? 'Agrega items para comenzar'
                  : 'Intenta con otro filtro o agrega más items'}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredItems.map((item) => (
                <div
                  key={item.id}
                  className={`flex items-center gap-4 p-4 rounded-lg border transition-all ${
                    item.state === 'Completo' || item.state === 'Completado'
                      ? 'bg-green-50 border-green-200'
                      : 'bg-gray-50 border-gray-200 hover:shadow-md'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={
                      item.state === 'Completo' || item.state === 'Completado'
                    }
                    readOnly
                    className="w-5 h-5"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-gray-900">
                        {item.quantity}x {item.product_name}
                      </span>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          item.state === 'Completo' ||
                          item.state === 'Completado'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {item.state === 'Completado' ? 'Completo' : item.state}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => openEditModal(item)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Editar estado"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteItem(item.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Eliminar"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Add Item Modal */}
      <AddShoppingListItemModal
        isOpen={addItemModalOpen}
        onClose={() => setAddItemModalOpen(false)}
        onSubmit={handleAddItem}
        products={products as Product[]}
        groupId={groupId}
      />

      {/* Edit Item Modal */}
      {editingItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">
                Editar Estado del Item
              </h2>
              <button
                onClick={() => setEditingItem(null)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <span className="text-2xl">×</span>
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <p className="text-sm text-gray-600 mb-2">
                  <span className="font-medium">Producto:</span>{' '}
                  {editingItem.quantity}x {editingItem.product_name}
                </p>
              </div>

              <div>
                <label
                  htmlFor="editState"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Estado
                </label>
                <select
                  id="editState"
                  value={editState === 'Completado' ? 'Completo' : editState}
                  onChange={(e) => setEditState(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="Pendiente">Pendiente</option>
                  <option value="Completo">Completo</option>
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleEditItem}
                  className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
                >
                  Guardar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
