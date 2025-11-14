// Product Types
export interface Product {
  id: string;
  name: string;
  quantity: number;
  expiration_date: string;
  category_id: string;
  category?: ProductCategory;
  group_id: string;
  user_id: string;
  price?: number;
  created_at: string;
  updated_at: string;
}

export interface CreateProductRequest {
  name: string;
  quantity: number;
  expiration_date: string;
  category_id: string;
  group_id: string;
  price: number;
}

// Category enum values that the API expects
export type ProductCategoryEnum =
  | 'LACTEOS'
  | 'GRANOS'
  | 'CARNES'
  | 'FRUTAS_Y_VERDURAS'
  | 'SNACKS';

export interface UpdateProductRequest {
  name?: string;
  quantity?: number;
  expiration_date?: string;
  category_id?: string;
  price?: number;
  group_id?: string;
}

// Product Category Types (visual only for now)
export interface ProductCategory {
  id: string;
  name: string;
  icon?: string;
  color?: string;
  group_id: string;
  created_at: string;
}

// Shopping List Types
export interface ShoppingListItem {
  id: string;
  shopping_list_id: string;
  product_name: string;
  quantity: number;
  is_completed: boolean;
  created_at: string;
}

export interface ShoppingList {
  id: string;
  name: string;
  group_id: string;
  user_id: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
  items: ShoppingListItem[];
  created_at: string;
  updated_at: string;
}

export interface CreateShoppingListRequest {
  name: string;
  group_id: string;
  items?: {
    product_name: string;
    quantity: number;
  }[];
}

export interface UpdateShoppingListRequest {
  name?: string;
  status?: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
}

export interface AddItemToShoppingListRequest {
  groupId: string;
  productId: number;
  quantity: number;
  state: string; // "Pendiente" | "En Progreso" | "Completado"
}

// Inventory Summary Types
export interface InventorySummary {
  low_stock_count: number;
  expiring_soon_count: number;
  total_products: number;
  expired_count: number;
}

// Product Status
export type ProductExpirationStatus = 'expired' | 'expiring_soon' | 'good';

export interface ProductWithStatus extends Product {
  expiration_status: ProductExpirationStatus;
  days_until_expiration: number;
}
