export type MessageType = 'user' | 'bot';

export type ActionType = 'action';
export type VisualizationType = 'visualization';
export type ActionColor = 'green' | 'red' | 'blue' | 'orange' | 'purple';
export type VisualizationTypeEnum = 'financial' | 'inventory' | 'tasks' | 'shopping_list' | 'generic' | 'error';
export type ChartType = 'table' | 'pie' | 'bar' | 'line' | 'card' | 'list' | 'kanban' | 'checklist' | 'progress_bar' | 'summary';

export interface Action {
  type: ActionType;
  tool: string;
  icon: string;
  color: ActionColor;
  title: string;
  data: Record<string, any>;
  timestamp?: string;
  has_error: boolean;
}

export interface Visualization {
  type: VisualizationType;
  tool: string;
  icon: string;
  visualization_type: VisualizationTypeEnum;
  chart_type?: ChartType;
  data: any;
  has_error: boolean;
}

export interface UIData {
  actions: Action[];
  visualizations: Visualization[];
}

export type CardType = 'task' | 'expense' | 'income' | 'inventory' | 'transaction' | 'category' | 'financial_summary' | 'transaction_list' | 'category_list' | 'budget_status' | 'category_expense' | 'budget_limits' | 'budget_exceeded' | 'email_notification' | 'product' | 'inventory_list' | 'shopping_list' | 'product_search' | 'low_stock' | 'expiring_products' | 'group_members' | 'task_created' | 'task_list' | 'task_updated';

export interface Message {
  id: string;
  type: MessageType;
  content: string;
  timestamp: Date;
  card?: MessageCard;
  data?: any;
  client_response?: string;
  mcp_data?: any;
  images?: string[];
  ui_data?: UIData;
}

export interface MessageCard {
  type: CardType;
  data: TaskCardData | ExpenseCardData | IncomeCardData | InventoryCardData | TransactionCardData | CategoryCardData | FinancialSummaryCardData | TransactionListCardData | CategoryListCardData | BudgetStatusCardData | CategoryExpenseCardData | BudgetLimitsCardData | BudgetExceededCardData | EmailNotificationCardData | ProductCardData | InventoryListCardData | ShoppingListCardData | ProductSearchCardData | LowStockCardData | ExpiringProductsCardData | GroupMembersCardData | TaskCreatedCardData | TaskListCardData | TaskUpdatedCardData;
}

export interface TaskCardData {
  title: string;
  priority: 'ALTA' | 'MEDIA' | 'BAJA';
  assignedTo: string;
  date: string;
}

export interface ExpenseCardData {
  title: string;
  amount: number;
  category: string;
  paymentMethod: string;
}

export interface IncomeCardData {
  title: string;
  amount: number;
  source: string;
  category: string;
}

export interface InventoryCardData {
  item: string;
  quantity: number;
  location: string;
  expiryDate: string;
}

export interface ChatStats {
  tasksPending: number;
  tasksCompleted: number;
  expensesToday: number;
  incomeToday: number;
}

// Nuevos tipos para datos MCP
export interface TransactionCardData {
  id: string;
  amount: number;
  description: string;
  type: 'EXPENSE' | 'INCOME';
  transaction_date: string;
  category: {
    id: string;
    name: string;
    type: 'EXPENSE' | 'INCOME';
    color: string;
  };
  category_used?: string;
}

export interface CategoryCardData {
  id: string;
  name: string;
  type: 'EXPENSE' | 'INCOME';
  color: string;
  created_at: string;
}

export interface FinancialSummaryCardData {
  summary: {
    total_income: { value: number; currency: string };
    total_expenses: { value: number; currency: string };
    net_balance: { value: number; currency: string };
    transaction_count: number;
  };
  income_by_category: Array<{
    category: { name: string; color: string };
    total: { value: number; currency: string };
    percentage: number;
  }>;
  expense_by_category: Array<{
    category: { name: string; color: string };
    total: { value: number; currency: string };
    percentage: number;
  }>;
}

export interface TransactionListCardData {
  count: number;
  transactions: TransactionCardData[];
}

export interface CategoryListCardData {
  success: boolean;
  categories: CategoryCardData[];
  count: number;
}

export interface BudgetStatusCardData {
  success: boolean;
  budget_status: Array<{
    category_name: string;
    limit_amount: number;
    current_amount: number;
    percentage: number;
    status: 'OK' | 'WARNING' | 'EXCEEDED';
  }>;
  total: number;
}

export interface MCPResponse {
  client_response: string;
  data?: any;
  ui_data?: UIData;
}

export interface CategoryExpenseCardData {
  category_id: string;
  category_name: string;
  total: number;
  currency: string;
  transaction_count: number;
  percentage: number;
  average: number;
}

export interface BudgetLimitsCardData {
  id: string;
  category_id: string;
  category_name: string;
  limit_amount: number;
  period: string;
  is_active: boolean;
  alert_threshold: number;
  category?: {
    id: string;
    name: string;
    type: string;
    color: string;
    group_id: string;
    created_at: string;
  };
  created_at?: string;
}

export interface BudgetExceededCardData {
  verificar_limites_gasto: {
    success: boolean;
    budget_status: Array<{
      id: string;
      category_id: string;
      category: {
        id: string;
        name: string;
        type: string;
        color: string;
      };
      limit_amount: number;
      period: string;
      is_active: boolean;
      alert_threshold: number;
    }>;
    total: number;
  };
  obtener_gastos_por_categoria: {
    success: boolean;
    categorias: Array<{
      category_id: string;
      category_name: string;
      total: number;
      currency: string;
      transaction_count: number;
      percentage: number;
      average: number;
    }>;
    total: number;
  };
}

export interface EmailNotificationCardData {
  success: boolean;
  message: string;
  email_sent_to: string;
  subject?: string;
}

// Tipos para inventario
export interface ProductCardData {
  id: number;
  name: string;
  quantity: number;
  expiryDate: string;
  category: string;
  price: string | number;
  idInventory?: number | null;
}

export interface InventoryListCardData {
  success: boolean;
  productos: ProductCardData[];
  total: number;
  group_id: string;
  categoria?: string;
}

export interface ShoppingListCardData {
  success: boolean;
  items: Array<{
    id: number;
    productId: number | null;
    quantity: number;
    state: 'Pendiente' | 'Completo';
  }>;
  total: number;
  estado: 'pendientes' | 'completados' | 'todos';
  group_id: string;
}

export interface ProductSearchCardData {
  success: boolean;
  productos_encontrados: ProductCardData[];
  total: number;
  busqueda: string;
  group_id: string;
}

export interface LowStockCardData {
  success: boolean;
  productos_bajo_stock: ProductCardData[];
  total: number;
  group_id: string;
}

export interface ExpiringProductsCardData {
  success: boolean;
  productos_vencidos: ProductCardData[];
  total: number;
  group_id: string;
}

// Tipos para grupos y tareas
export interface GroupMember {
  id: string;
  full_name: string;
  email: string;
}

export interface GroupMembersCardData {
  success: boolean;
  miembros: GroupMember[];
  total: number;
  group_id: string;
}

export interface TaskCreatedCardData {
  success: boolean;
  tarea_creada: {
    id: number;
    status: string;
  };
  asignada_a: string;
  user_id: string;
  group_id: string;
}

export interface TaskItem {
  id: number;
  title: string;
  status: 'pendiente' | 'completada' | 'en_progreso';
  priority: 'alta' | 'media' | 'baja';
  deadline: string;
  miembro?: string;
  user_id?: string;
}

export interface TaskListCardData {
  success: boolean;
  tareas_pendientes?: TaskItem[];
  tareas?: TaskItem[];
  total: number;
  group_id: string;
  miembro?: string;
  user_id?: string;
}

export interface TaskUpdatedCardData {
  success: boolean;
  tarea_actualizada: {
    success: boolean;
    message: string;
  };
  nuevo_estado?: string;
  asignada_a?: string;
  user_id?: string;
  task_id: number;
  group_id: string;
}
