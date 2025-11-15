import React, { useState } from 'react';
import { Header } from '@/components/layout/Header';
import {
  ProductList,
  ProductFormModal,
  ShoppingListFormModal,
  ShoppingListHistory,
} from '@/components/features/inventory';
import { useInventory } from '@/hooks/useInventory';
import { ErrorMessage } from '@/components/common/ErrorMessage';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { useGroupStore } from '@/store/groupStore';
import { Plus, ShoppingCart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type {
  Product,
  CreateProductRequest,
  UpdateProductRequest,
  ShoppingList,
  CreateShoppingListRequest,
  UpdateShoppingListRequest,
  ProductWithStatus,
} from '@/types/inventory.types';

export const InventoryPage: React.FC = () => {
  const navigate = useNavigate();
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [shoppingListModalOpen, setShoppingListModalOpen] = useState(false);
  const [shoppingListHistoryOpen, setShoppingListHistoryOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | undefined>();
  const [selectedShoppingList, setSelectedShoppingList] = useState<
    ShoppingList | undefined
  >();

  const selectedGroup = useGroupStore((state) => state.selectedGroup);

  if (!selectedGroup) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
            <p className="text-yellow-800 text-lg font-medium">
              No hay un grupo seleccionado
            </p>
            <p className="text-yellow-600 mt-2">
              Por favor, selecciona un grupo desde el dashboard para ver el
              inventario.
            </p>
          </div>
        </main>
      </div>
    );
  }

  const groupId = selectedGroup.id;

  if (!groupId) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <p className="text-red-800 text-lg font-medium">
              Error: El grupo seleccionado no tiene un ID válido
            </p>
            <p className="text-red-600 mt-2">
              Por favor, selecciona un grupo nuevamente desde el dashboard.
            </p>
          </div>
        </main>
      </div>
    );
  }

  const {
    products,
    shoppingLists,
    loading,
    error,
    createProduct,
    updateProduct,
    deleteProduct,
    incrementProductQuantity,
    decrementProductQuantity,
    createShoppingList,
    updateShoppingList,
    deleteShoppingList,
    clearError,
  } = useInventory(groupId);

  // Mock categories for now (visual only)
  const categories = [
    {
      id: '1',
      name: 'Lácteos',
      icon: '🥛',
      color: '#FEF3C7',
      group_id: groupId,
      created_at: new Date().toISOString(),
    },
    {
      id: '2',
      name: 'Carnes',
      icon: '🍗',
      color: '#FEE2E2',
      group_id: groupId,
      created_at: new Date().toISOString(),
    },
    {
      id: '3',
      name: 'Frutas y Verduras',
      icon: '🥬',
      color: '#D1FAE5',
      group_id: groupId,
      created_at: new Date().toISOString(),
    },
    {
      id: '4',
      name: 'Granos',
      icon: '🌾',
      color: '#E0E7FF',
      group_id: groupId,
      created_at: new Date().toISOString(),
    },
    {
      id: '5',
      name: 'Snacks',
      icon: '🍿',
      color: '#DBEAFE',
      group_id: groupId,
      created_at: new Date().toISOString(),
    },
  ];

  const handleNewProduct = () => {
    setSelectedProduct(undefined);
    setProductModalOpen(true);
  };

  const handleEditProduct = (product: ProductWithStatus) => {
    setSelectedProduct(product);
    setProductModalOpen(true);
  };

  const handleProductSubmit = async (
    data: CreateProductRequest | UpdateProductRequest
  ) => {
    if (selectedProduct) {
      await updateProduct(selectedProduct.id, data as UpdateProductRequest);
    } else {
      // Get fresh groupId from store to ensure it's current
      const currentGroup = useGroupStore.getState().selectedGroup;
      const currentGroupId = currentGroup?.id || groupId || selectedGroup.id;

      const createData: CreateProductRequest = {
        ...(data as CreateProductRequest),
        group_id: (data as CreateProductRequest).group_id || currentGroupId,
      };

      if (!createData.group_id) {
        throw new Error(
          'ID de grupo requerido. Por favor, selecciona un grupo primero.'
        );
      }

      await createProduct(createData);
    }
  };

  const handleIncrementQuantity = async (productId: string) => {
    await incrementProductQuantity(productId, 1);
  };

  const handleDecrementQuantity = async (productId: string) => {
    await decrementProductQuantity(productId, 1);
  };

  const handleDeleteProduct = async (productId: string) => {
    try {
      await deleteProduct(productId);
    } catch (err) {
      // Error is handled by the hook
    }
  };

  const handleNewShoppingList = () => {
    setSelectedShoppingList(undefined);
    setShoppingListModalOpen(true);
  };

  const handleEditShoppingList = (list: ShoppingList) => {
    setSelectedShoppingList(list);
    setShoppingListModalOpen(true);
  };

  const handleShoppingListSubmit = async (
    data: CreateShoppingListRequest | UpdateShoppingListRequest
  ) => {
    if (selectedShoppingList) {
      await updateShoppingList(
        selectedShoppingList.id,
        data as UpdateShoppingListRequest
      );
    } else {
      await createShoppingList(data as CreateShoppingListRequest);
    }
  };

  const handleDeleteShoppingList = async (listId: string) => {
    if (
      window.confirm(
        '¿Estás seguro de que deseas eliminar esta lista de compras?'
      )
    ) {
      await deleteShoppingList(listId);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Inventario</h1>
          <p className="text-gray-600">Gestiona los productos de tu hogar</p>
        </div>

        {error && (
          <div className="mb-6">
            <ErrorMessage message={error} onDismiss={clearError} />
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 mb-6">
          <button
            onClick={handleNewProduct}
            className="flex items-center gap-2 px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium"
          >
            <Plus className="w-5 h-5" />
            Añadir Producto
          </button>
          <button
            onClick={() => navigate('/inventario/shopping-list')}
            className="flex items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
          >
            <ShoppingCart className="w-5 h-5" />
            Lista de Compras
          </button>
        </div>

        {/* Products List */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Productos</h2>
          {loading.products ? (
            <LoadingSpinner
              size="lg"
              text="Cargando productos..."
              className="py-8"
            />
          ) : (
            <ProductList
              products={products}
              onIncrement={handleIncrementQuantity}
              onDecrement={handleDecrementQuantity}
              onProductClick={handleEditProduct}
              onProductDelete={handleDeleteProduct}
              loading={loading.products}
            />
          )}
        </div>
      </main>

      {/* Product Form Modal */}
      <ProductFormModal
        isOpen={productModalOpen}
        onClose={() => {
          setProductModalOpen(false);
          setSelectedProduct(undefined);
        }}
        onSubmit={handleProductSubmit}
        product={selectedProduct}
        categories={categories}
        groupId={groupId}
      />

      {/* Shopping List Form Modal */}
      <ShoppingListFormModal
        isOpen={shoppingListModalOpen}
        onClose={() => {
          setShoppingListModalOpen(false);
          setSelectedShoppingList(undefined);
        }}
        onSubmit={handleShoppingListSubmit}
        shoppingList={selectedShoppingList}
        groupId={groupId}
      />

      {/* Shopping List History Modal */}
      {shoppingListHistoryOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  Listas de Compras
                </h2>
                <button
                  onClick={() => setShoppingListHistoryOpen(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <span className="text-2xl">×</span>
                </button>
              </div>
              <ShoppingListHistory
                shoppingLists={shoppingLists}
                onEdit={handleEditShoppingList}
                onDelete={handleDeleteShoppingList}
                onCreateNew={handleNewShoppingList}
                loading={loading.shoppingLists}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
