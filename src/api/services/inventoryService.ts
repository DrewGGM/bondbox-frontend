import type {
  Product,
  CreateProductRequest,
  UpdateProductRequest,
  ShoppingList,
  CreateShoppingListRequest,
  UpdateShoppingListRequest,
  AddItemToShoppingListRequest,
  ShoppingListItem,
  InventorySummary,
} from '@/types/inventory.types';
import axios from 'axios';
import { STORAGE_KEYS } from '@/config/storageKeys';
import { ENDPOINTS } from '@/api/endpoints';
import credentialManager from '@/utils/credentialManager';

// Create a separate HTTP instance for inventory
// Inventory endpoints don't use /api/v1 prefix in the API Gateway
const BASE_URL =
  import.meta.env.VITE_API_GATEWAY_URL ||
  (window as any).ENV?.VITE_API_GATEWAY_URL;

const inventoryApi = axios.create({
  baseURL: BASE_URL, // Direct base URL without /api/v1 prefix
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token interceptor
inventoryApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
inventoryApi.interceptors.response.use(
  (response) => response,
  (error) => {
    return Promise.reject(error);
  }
);

// Product Services
export const productService = {
  // Create product
  create: async (data: CreateProductRequest): Promise<Product> => {
    // Map category_id to category enum value
    // The API expects: LACTEOS, GRANOS, CARNES, FRUTAS_Y_VERDURAS, SNACKS
    // Based on the mock categories in InventoryPage:
    // id: '1' = Lácteos -> LACTEOS
    // id: '2' = Carnes -> CARNES
    // id: '3' = Frutas y Verduras -> FRUTAS_Y_VERDURAS
    // id: '4' = Granos -> GRANOS
    // id: '5' = Snacks -> SNACKS
    // Map category_id to category enum value (first letter uppercase, rest lowercase)
    // Support both string and number category_id
    const categoryIdStr = String(data.category_id || '').trim();
    const categoryMap: Record<string, string> = {
      '1': 'Lacteos', // Lácteos -> Lacteos (sin tilde, primera mayúscula)
      '2': 'Carnes', // Carnes -> Carnes
      '3': 'Frutas y Verduras', // Frutas y Verduras -> Frutas y Verduras (con espacio)
      '4': 'Granos', // Granos -> Granos
      '5': 'Snacks', // Snacks -> Snacks
      '6': 'Snacks', // Otros -> Snacks (fallback)
    };

    // Get category enum value from category_id - ensure it's exactly as defined
    let category = categoryMap[categoryIdStr];
    if (!category) {
      // If category_id doesn't match, default to Lacteos
      category = 'Lacteos';
    }

    // CRITICAL: Ensure category is exactly as defined - no transformations
    // Must be one of: 'Lacteos', 'Carnes', 'Frutas y Verduras', 'Granos', 'Snacks'
    if (
      category !== 'Lacteos' &&
      category !== 'Carnes' &&
      category !== 'Frutas y Verduras' &&
      category !== 'Granos' &&
      category !== 'Snacks'
    ) {
      // Force to Lacteos if invalid
      category = 'Lacteos';
    }

    // Validate category is valid (first letter uppercase, rest lowercase)
    const validCategories = [
      'Lacteos',
      'Granos',
      'Carnes',
      'Frutas y Verduras',
      'Snacks',
    ];
    if (!validCategories.includes(category)) {
      throw new Error(
        `Categoría inválida: ${category}. Debe ser una de: ${validCategories.join(', ')}`
      );
    }

    // Validate group_id is present
    if (
      !data.group_id ||
      (typeof data.group_id === 'string' && data.group_id.trim() === '')
    ) {
      throw new Error(
        'ID de grupo requerido. Por favor, selecciona un grupo primero.'
      );
    }

    // Transform to API expected format (snake_case)
    // API expects: name, quantity, expiration_date, category, group_id, price
    // Ensure group_id is a valid string
    const groupIdValue = String(data.group_id || '').trim();

    if (!groupIdValue) {
      throw new Error(
        'ID de grupo requerido. Por favor, selecciona un grupo primero.'
      );
    }

    // Format date to YYYY-MM-DD if needed
    let formattedDate = data.expiration_date;
    if (formattedDate) {
      // If date is in DD/MM/YYYY or MM/DD/YYYY format, convert to YYYY-MM-DD
      if (formattedDate.includes('/')) {
        const parts = formattedDate.split('/');
        if (parts.length === 3) {
          // Assume DD/MM/YYYY format
          formattedDate = `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
        }
      }
      // Ensure date is in YYYY-MM-DD format
      const dateObj = new Date(formattedDate);
      if (!isNaN(dateObj.getTime())) {
        formattedDate = dateObj.toISOString().split('T')[0];
      }
    }

    // API expects: expirationDate (camelCase), groupId (camelCase), category, price
    // Based on Postman collection: expirationDate and groupId both in camelCase
    // Ensure category is exactly as mapped (Lacteos, Carnes, etc.) - DO NOT MODIFY
    // CRITICAL: Use the mapped category value directly - no transformations allowed
    const finalCategory: string = category; // Must be exactly: 'Lacteos', 'Carnes', 'Frutas y Verduras', 'Granos', or 'Snacks'

    // Verify finalCategory is correct before creating requestData
    if (
      finalCategory !== 'Lacteos' &&
      finalCategory !== 'Carnes' &&
      finalCategory !== 'Frutas y Verduras' &&
      finalCategory !== 'Granos' &&
      finalCategory !== 'Snacks'
    ) {
      throw new Error(
        `Invalid category value: ${finalCategory}. Expected one of: Lacteos, Carnes, Frutas y Verduras, Granos, Snacks`
      );
    }

    const requestData: any = {
      name: data.name,
      quantity: data.quantity,
      expiryDate: formattedDate,
      category: finalCategory, // Must be exactly: 'Lacteos', 'Carnes', 'Frutas y Verduras', 'Granos', or 'Snacks'
      groupId: groupIdValue,
      price: data.price || 0,
    };

    const response = await inventoryApi.post(
      ENDPOINTS.INVENTORY.PRODUCTS,
      requestData
    );
    return response.data;
  },

  // Get product by ID
  getById: async (id: string): Promise<Product> => {
    const response = await inventoryApi.get(
      `${ENDPOINTS.INVENTORY.PRODUCTS}/${id}`
    );
    return response.data;
  },

  // Update product
  // PUT /inventario/productos/{id}
  update: async (id: string, data: UpdateProductRequest): Promise<Product> => {
    // Get group_id - required for update
    const groupIdValue = data.group_id ? String(data.group_id).trim() : '';

    if (!groupIdValue) {
      throw new Error(
        'ID de grupo requerido. Por favor, selecciona un grupo primero.'
      );
    }

    // Map category_id to category enum value (same as create)
    const categoryIdStr = data.category_id
      ? String(data.category_id).trim()
      : '';
    const categoryMap: Record<string, string> = {
      '1': 'Lacteos',
      '2': 'Carnes',
      '3': 'Frutas y Verduras',
      '4': 'Granos',
      '5': 'Snacks',
      '6': 'Snacks',
    };
    const category = categoryIdStr
      ? categoryMap[categoryIdStr] || 'Lacteos'
      : undefined;

    // Format date to YYYY-MM-DD if needed
    let formattedDate = data.expiration_date;
    if (formattedDate) {
      if (formattedDate.includes('/')) {
        const parts = formattedDate.split('/');
        if (parts.length === 3) {
          formattedDate = `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
        }
      }
      const dateObj = new Date(formattedDate);
      if (!isNaN(dateObj.getTime())) {
        formattedDate = dateObj.toISOString().split('T')[0];
      }
    }

    // Transform to API expected format (camelCase, same as create)
    // Must include groupId in request body
    const requestData: any = {
      groupId: groupIdValue, // Always include groupId
    };
    if (data.name) requestData.name = data.name;
    if (data.quantity !== undefined && data.quantity !== null) {
      requestData.quantity = data.quantity;
    }
    if (formattedDate) requestData.expiryDate = formattedDate;
    if (category) requestData.category = category;
    if (data.price !== undefined && data.price !== null) {
      requestData.price = data.price;
    }

    // Ensure at least one field is being updated
    if (Object.keys(requestData).length === 0) {
      throw new Error('Al menos un campo debe ser actualizado');
    }

    // Try PUT first, if it fails with 404, try PATCH
    try {
      const response = await inventoryApi.put(
        `${ENDPOINTS.INVENTORY.PRODUCTS}/${id}`,
        requestData
      );
      return response.data;
    } catch (error: any) {
      // If PUT returns 404, try PATCH
      if (error.response?.status === 404) {
        try {
          const response = await inventoryApi.patch(
            `${ENDPOINTS.INVENTORY.PRODUCTS}/${id}`,
            requestData
          );
          return response.data;
        } catch (patchError: any) {
          throw patchError;
        }
      }
      throw error;
    }
  },

  // Delete product
  // DELETE /inventario/productos/{id}
  // Body: { "groupId": "{{group_id}}" }
  delete: async (id: string, groupId: string): Promise<void> => {
    if (!groupId || groupId.trim() === '') {
      throw new Error(
        'ID de grupo requerido. Por favor, selecciona un grupo primero.'
      );
    }

    const url = `${ENDPOINTS.INVENTORY.PRODUCTS}/${id}`;
    const requestData = {
      groupId: groupId.trim(),
    };

    try {
      await inventoryApi.delete(url, { data: requestData });
    } catch (error: any) {
      throw error;
    }
  },

  // List products for a group
  // GET /inventario/productos/todos/grupo/{groupId}
  list: async (groupId: string): Promise<Product[]> => {
    const url = `/inventario/productos/todos/grupo/${groupId}`;
    const response = await inventoryApi.get(url);
    const products = response.data.products || response.data || [];

    // Transform API response (camelCase) to Product type (snake_case)
    // API returns: expiryDate, category (string), etc.
    // Product expects: expiration_date, category_id (string), etc.
    return products.map((product: any) => {
      // Map category string back to category_id
      let categoryId = product.category_id || '';
      if (!categoryId && product.category) {
        const categoryMap: Record<string, string> = {
          Lacteos: '1',
          Lácteos: '1',
          Carnes: '2',
          'Frutas y Verduras': '3',
          Granos: '4',
          Snacks: '5',
        };
        categoryId = categoryMap[product.category] || '';
      }

      return {
        id: product.id,
        name: product.name,
        quantity: product.quantity,
        expiration_date: product.expiration_date || product.expiryDate || '',
        category_id: categoryId,
        category: product.category ? { name: product.category } : undefined,
        group_id: product.group_id || product.groupId || '',
        user_id: product.user_id || product.userId || '',
        price: product.price,
        created_at: product.created_at || product.createdAt || '',
        updated_at: product.updated_at || product.updatedAt || '',
      };
    });
  },

  // Update product quantity
  updateQuantity: async (id: string, quantity: number): Promise<Product> => {
    const response = await inventoryApi.patch(
      `${ENDPOINTS.INVENTORY.PRODUCTS}/${id}/quantity`,
      {
        quantity,
      }
    );
    return response.data;
  },

  // Increment product quantity
  incrementQuantity: async (
    id: string,
    increment: number,
    groupId?: string
  ): Promise<Product> => {
    if (increment <= 0) {
      throw new Error('El incremento debe ser mayor que cero');
    }

    const payload: Record<string, any> = {
      incremento: increment,
    };

    if (groupId) {
      payload.idGroup = groupId;
    }

    const response = await inventoryApi.patch(
      `${ENDPOINTS.INVENTORY.PRODUCTS}/${id}/incrementar`,
      payload
    );
    return response.data;
  },

  // Decrement product quantity
  decrementQuantity: async (
    id: string,
    decrement: number,
    groupId?: string
  ): Promise<Product> => {
    if (decrement <= 0) {
      throw new Error('El decremento debe ser mayor que cero');
    }

    // Obtener el ID del usuario del token
    const userId = credentialManager.getUserId();
    if (!userId) {
      throw new Error(
        'No se pudo obtener el ID del usuario. Por favor, inicia sesión nuevamente.'
      );
    }

    // Imprimir el ID del usuario en consola
    console.log('ID del usuario actual:', userId);

    const payload: Record<string, any> = {
      decremento: decrement,
      user_id: userId,
    };

    if (groupId) {
      payload.idGroup = groupId;
    }

    const response = await inventoryApi.patch(
      `${ENDPOINTS.INVENTORY.PRODUCTS}/${id}/restar`,
      payload
    );
    return response.data;
  },

  // Get inventory summary
  getSummary: async (groupId: string): Promise<InventorySummary> => {
    const response = await inventoryApi.get(
      `${ENDPOINTS.INVENTORY.PRODUCTS}/summary?groupId=${groupId}`
    );
    return response.data;
  },
};

// Shopping List Services
export const shoppingListService = {
  // Create shopping list
  create: async (data: CreateShoppingListRequest): Promise<ShoppingList> => {
    const response = await inventoryApi.post(
      ENDPOINTS.INVENTORY.SHOPPING_LIST,
      data
    );
    return response.data;
  },

  // Get shopping list by ID
  getById: async (id: string): Promise<ShoppingList> => {
    const response = await inventoryApi.get(
      `${ENDPOINTS.INVENTORY.SHOPPING_LIST}/${id}`
    );
    return response.data;
  },

  // Update shopping list
  update: async (
    id: string,
    data: UpdateShoppingListRequest
  ): Promise<ShoppingList> => {
    const response = await inventoryApi.put(
      `${ENDPOINTS.INVENTORY.SHOPPING_LIST}/${id}`,
      data
    );
    return response.data;
  },

  // Delete shopping list
  delete: async (id: string): Promise<void> => {
    await inventoryApi.delete(`${ENDPOINTS.INVENTORY.SHOPPING_LIST}/${id}`);
  },

  // List shopping lists for a group
  list: async (groupId: string): Promise<ShoppingList[]> => {
    const url = `${ENDPOINTS.INVENTORY.SHOPPING_LIST}?groupId=${groupId}`;
    const response = await inventoryApi.get(url);
    return response.data.shopping_lists || response.data || [];
  },

  // Get all shopping list items for a group
  // GET /shopping-list/items/grupo/{groupId}
  getAllItems: async (groupId: string): Promise<ShoppingListItem[]> => {
    const url = `${ENDPOINTS.INVENTORY.SHOPPING_LIST}/items/grupo/${groupId}`;
    const response = await inventoryApi.get(url);
    return response.data.items || response.data || [];
  },

  // Get shopping list items by status
  // GET /shopping-list/items/grupo/{groupId}/completados
  // GET /shopping-list/items/grupo/{groupId}/pendientes
  getItemsByStatus: async (
    groupId: string,
    status: 'completados' | 'pendientes'
  ): Promise<ShoppingListItem[]> => {
    const url = `${ENDPOINTS.INVENTORY.SHOPPING_LIST}/items/grupo/${groupId}/${status}`;
    const response = await inventoryApi.get(url);
    return response.data.items || response.data || [];
  },

  // Add item to shopping list
  // POST /shopping-list/items
  addItem: async (
    data: AddItemToShoppingListRequest
  ): Promise<ShoppingListItem> => {
    const response = await inventoryApi.post(
      `${ENDPOINTS.INVENTORY.SHOPPING_LIST}/items`,
      data
    );
    return response.data;
  },

  // Update shopping list item
  // PUT /shopping-list/items/{itemId}
  // Try PUT first, fallback to PATCH if 404
  updateItem: async (
    itemId: string,
    data: { state: string }
  ): Promise<ShoppingListItem> => {
    const url = `${ENDPOINTS.INVENTORY.SHOPPING_LIST}/items/${itemId}`;

    try {
      const response = await inventoryApi.put(url, data);
      return response.data;
    } catch (error: any) {
      // If PUT fails with 404, try PATCH
      if (
        error.response?.status === 404 ||
        error.message?.includes('Cannot PUT')
      ) {
        try {
          const response = await inventoryApi.patch(url, data);
          return response.data;
        } catch (patchError: any) {
          throw patchError;
        }
      }
      throw error;
    }
  },

  // Delete shopping list item
  // DELETE /shopping-list/items/{itemId}
  deleteItem: async (itemId: string): Promise<void> => {
    await inventoryApi.delete(
      `${ENDPOINTS.INVENTORY.SHOPPING_LIST}/items/${itemId}`
    );
  },

  // Generate shopping list from low stock products
  generateFromLowStock: async (groupId: string): Promise<ShoppingList> => {
    const response = await inventoryApi.post(
      `${ENDPOINTS.INVENTORY.SHOPPING_LIST}/generate?groupId=${groupId}`
    );
    return response.data;
  },
};

export default {
  productService,
  shoppingListService,
};
