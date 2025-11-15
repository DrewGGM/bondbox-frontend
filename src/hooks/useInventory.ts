import { useState, useEffect, useCallback, useRef } from 'react';
import {
  productService,
  shoppingListService,
} from '@/api/services/inventoryService';
import type {
  Product,
  CreateProductRequest,
  UpdateProductRequest,
  ShoppingList,
  CreateShoppingListRequest,
  UpdateShoppingListRequest,
  ProductWithStatus,
} from '@/types/inventory.types';

interface UseInventoryReturn {
  products: ProductWithStatus[];
  shoppingLists: ShoppingList[];
  loading: {
    products: boolean;
    shoppingLists: boolean;
  };
  error: string | null;
  createProduct: (data: CreateProductRequest) => Promise<void>;
  updateProduct: (id: string, data: UpdateProductRequest) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  updateProductQuantity: (id: string, quantity: number) => Promise<void>;
  incrementProductQuantity: (id: string, increment?: number) => Promise<void>;
  decrementProductQuantity: (id: string, decrement?: number) => Promise<void>;
  loadProducts: () => Promise<void>;
  createShoppingList: (data: CreateShoppingListRequest) => Promise<void>;
  updateShoppingList: (
    id: string,
    data: UpdateShoppingListRequest
  ) => Promise<void>;
  deleteShoppingList: (id: string) => Promise<void>;
  loadShoppingLists: () => Promise<void>;
  generateShoppingListFromLowStock: () => Promise<void>;
  clearError: () => void;
}

export const useInventory = (groupId: string): UseInventoryReturn => {
  const [products, setProducts] = useState<ProductWithStatus[]>([]);
  const [shoppingLists, setShoppingLists] = useState<ShoppingList[]>([]);
  const [loading, setLoading] = useState({
    products: false,
    shoppingLists: false,
  });
  const [error, setError] = useState<string | null>(null);

  const calculateProductStatus = (product: Product): ProductWithStatus => {
    const expirationDate = new Date(product.expiration_date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    expirationDate.setHours(0, 0, 0, 0);

    const diffTime = expirationDate.getTime() - today.getTime();
    const daysUntilExpiration = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    let expiration_status: 'expired' | 'expiring_soon' | 'good';
    if (daysUntilExpiration < 0) {
      expiration_status = 'expired';
    } else if (daysUntilExpiration <= 7) {
      expiration_status = 'expiring_soon';
    } else {
      expiration_status = 'good';
    }

    return {
      ...product,
      expiration_status,
      days_until_expiration: daysUntilExpiration,
    };
  };

  const loadProducts = useCallback(async () => {
    if (!groupId) return;

    setLoading((prev) => ({ ...prev, products: true }));
    setError(null);

    try {
      const productsData = await productService.list(groupId);
      const productsWithStatus = productsData.map(calculateProductStatus);
      setProducts(productsWithStatus);
    } catch (err: any) {
      // Si el error es "Cannot GET" o 404, el servicio no está disponible
      const errorMessage = err.response?.data?.message || err.message || '';

      if (errorMessage.includes('Cannot GET') || err.response?.status === 404) {
        // En desarrollo, usar array vacío en lugar de mostrar error
        setProducts([]);
        // No establecer error para que la UI funcione visualmente
      } else {
        const finalErrorMessage =
          err.response?.data?.message ||
          err.message ||
          'Error al cargar productos';
        setError(finalErrorMessage);
      }
    } finally {
      setLoading((prev) => ({ ...prev, products: false }));
    }
  }, [groupId]);

  const loadShoppingLists = useCallback(async () => {
    if (!groupId) return;

    setLoading((prev) => ({ ...prev, shoppingLists: true }));
    setError(null);

    try {
      const lists = await shoppingListService.list(groupId);
      setShoppingLists(lists);
    } catch (err: any) {
      // Log del error para debugging
      console.error(
        'Error al cargar shopping lists:',
        err.response?.status,
        err.response?.data || err.message
      );

      // Si el error es "Cannot GET" o 404, el servicio no está disponible
      const errorMessage = err.response?.data?.message || err.message || '';

      if (errorMessage.includes('Cannot GET') || err.response?.status === 404) {
        // En desarrollo, usar array vacío en lugar de mostrar error
        setShoppingLists([]);
        // No establecer error para que la UI funcione visualmente
      } else {
        const finalErrorMessage =
          err.response?.data?.message ||
          err.message ||
          'Error al cargar listas de compras';
        setError(finalErrorMessage);
      }
    } finally {
      setLoading((prev) => ({ ...prev, shoppingLists: false }));
    }
  }, [groupId]);

  const createProduct = useCallback(
    async (data: CreateProductRequest) => {
      setError(null);
      try {
        await productService.create(data);
        await loadProducts();
      } catch (err: any) {
        // Extract error message - check multiple possible locations
        const errorMessage =
          err.response?.data?.message ||
          err.response?.data?.error ||
          err.message ||
          '';

        let finalErrorMessage = 'Error al crear producto';

        // Show the actual error message from the API if available
        if (err.response?.data?.message) {
          finalErrorMessage = err.response.data.message;
        } else if (err.response?.data?.error) {
          finalErrorMessage = err.response.data.error;
        } else if (errorMessage.includes('Cannot POST')) {
          finalErrorMessage =
            'El endpoint no acepta POST. Verifica que el microservicio tenga configurado el método POST para este endpoint.';
        } else if (err.response?.status === 400) {
          finalErrorMessage =
            'Datos inválidos. Verifica que todos los campos estén correctos.';
        } else if (err.response?.status === 401) {
          finalErrorMessage =
            'No autorizado. Por favor, inicia sesión nuevamente.';
        } else if (err.response?.status === 404) {
          finalErrorMessage =
            'Endpoint no encontrado. Verifica la configuración del servicio.';
        } else if (err.response?.status === 405) {
          finalErrorMessage =
            'Método no permitido. El endpoint no acepta POST.';
        } else if (err.response?.status === 500) {
          finalErrorMessage =
            'Error del servidor. Por favor, intenta más tarde.';
        } else if (!err.response) {
          finalErrorMessage =
            'Error de conexión. Verifica que el API Gateway esté corriendo.';
        } else {
          finalErrorMessage =
            errorMessage || 'Error desconocido al crear producto';
        }

        setError(finalErrorMessage);
        throw err;
      }
    },
    [loadProducts]
  );

  const updateProduct = useCallback(
    async (id: string, data: UpdateProductRequest) => {
      setError(null);
      try {
        await productService.update(id, data);
        await loadProducts();
      } catch (err: any) {
        setError(err.message || 'Error al actualizar producto');
        throw err;
      }
    },
    [loadProducts]
  );

  const deleteProduct = useCallback(
    async (id: string) => {
      setError(null);
      try {
        await productService.delete(id, groupId);
        await loadProducts();
      } catch (err: any) {
        setError(err.message || 'Error al eliminar producto');
        throw err;
      }
    },
    [groupId, loadProducts]
  );

  const updateProductQuantity = useCallback(
    async (id: string, quantity: number) => {
      setError(null);
      try {
        await productService.updateQuantity(id, quantity);
        await loadProducts();
      } catch (err: any) {
        setError(err.message || 'Error al actualizar cantidad');
        throw err;
      }
    },
    [loadProducts]
  );

  const incrementProductQuantity = useCallback(
    async (id: string, increment = 1) => {
      setError(null);
      try {
        await productService.incrementQuantity(id, increment, groupId);
        await loadProducts();
      } catch (err: any) {
        setError(err.message || 'Error al incrementar cantidad');
        throw err;
      }
    },
    [groupId, loadProducts]
  );

  const decrementProductQuantity = useCallback(
    async (id: string, decrement = 1) => {
      setError(null);
      try {
        await productService.decrementQuantity(id, decrement, groupId);
        await loadProducts();
      } catch (err: any) {
        setError(err.message || 'Error al decrementar cantidad');
        throw err;
      }
    },
    [groupId, loadProducts]
  );

  const createShoppingList = useCallback(
    async (data: CreateShoppingListRequest) => {
      setError(null);
      try {
        await shoppingListService.create(data);
        await loadShoppingLists();
      } catch (err: any) {
        setError(err.message || 'Error al crear lista de compras');
        throw err;
      }
    },
    [loadShoppingLists]
  );

  const updateShoppingList = useCallback(
    async (id: string, data: UpdateShoppingListRequest) => {
      setError(null);
      try {
        await shoppingListService.update(id, data);
        await loadShoppingLists();
      } catch (err: any) {
        setError(err.message || 'Error al actualizar lista de compras');
        throw err;
      }
    },
    [loadShoppingLists]
  );

  const deleteShoppingList = useCallback(
    async (id: string) => {
      setError(null);
      try {
        await shoppingListService.delete(id);
        await loadShoppingLists();
      } catch (err: any) {
        setError(err.message || 'Error al eliminar lista de compras');
        throw err;
      }
    },
    [loadShoppingLists]
  );

  const generateShoppingListFromLowStock = useCallback(async () => {
    setError(null);
    try {
      await shoppingListService.generateFromLowStock(groupId);
      await loadShoppingLists();
    } catch (err: any) {
      setError(err.message || 'Error al generar lista de compras');
      throw err;
    }
  }, [groupId, loadShoppingLists]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Usar ref para evitar múltiples ejecuciones simultáneas
  const loadingRef = useRef({
    products: false,
    shoppingLists: false,
  });
  const lastGroupIdRef = useRef<string | null>(null);

  useEffect(() => {
    // Solo ejecutar si el groupId cambió o es la primera vez
    if (!groupId || groupId === lastGroupIdRef.current) {
      return;
    }

    // Marcar que estamos cargando para este groupId
    lastGroupIdRef.current = groupId;
    loadingRef.current = {
      products: false,
      shoppingLists: false,
    };

    // Cargar datos solo una vez por groupId
    loadProducts();
    loadShoppingLists();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [groupId]); // Solo dependemos de groupId, las funciones ya están memoizadas

  return {
    products,
    shoppingLists,
    loading,
    error,
    createProduct,
    updateProduct,
    deleteProduct,
    updateProductQuantity,
    incrementProductQuantity,
    decrementProductQuantity,
    loadProducts,
    createShoppingList,
    updateShoppingList,
    deleteShoppingList,
    loadShoppingLists,
    generateShoppingListFromLowStock,
    clearError,
  };
};
