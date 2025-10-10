export type MessageType = 'user' | 'bot';

export type CardType = 'task' | 'expense' | 'income' | 'inventory' | 'transaction' | 'category' | 'financial_summary' | 'transaction_list' | 'category_list' | 'budget_status' | 'category_expense' | 'budget_limits' | 'budget_exceeded' | 'email_notification';

export interface Message {
  id: string;
  type: MessageType;
  content: string;
  timestamp: Date;
  card?: MessageCard;
  data?: any; // Para datos adicionales del agente de IA
  client_response?: string; // Respuesta del agente MCP
  mcp_data?: any; // Datos estructurados del agente MCP
}

export interface MessageCard {
  type: CardType;
  data: TaskCardData | ExpenseCardData | IncomeCardData | InventoryCardData | TransactionCardData | CategoryCardData | FinancialSummaryCardData | TransactionListCardData | CategoryListCardData | BudgetStatusCardData | CategoryExpenseCardData | BudgetLimitsCardData | BudgetExceededCardData | EmailNotificationCardData;
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

// Tipos para respuestas del agente MCP
export interface MCPResponse {
  client_response: string;
  data?: any;
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
