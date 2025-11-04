// API Response Types
export interface ApiResponse<T> {
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  count: number;
  [key: string]: T[] | number;
}

// Category Types
export interface Category {
  id: string;
  name: string;
  type: 'INCOME' | 'EXPENSE';
  color: string;
  group_id: string;
  created_at: string;
}

export interface CreateCategoryRequest {
  name: string;
  type: 'INCOME' | 'EXPENSE';
  color: string;
  group_id: string;
}

// Transaction Types
export interface Transaction {
  id: string;
  amount: number;
  description: string;
  type: 'INCOME' | 'EXPENSE';
  transaction_date: string;
  category_id: string;
  category: Category;
  group_id: string;
  user_id: string;
  created_at: string;
}

export interface CreateTransactionRequest {
  amount: number;
  description: string;
  type: 'INCOME' | 'EXPENSE';
  category_id: string;
  group_id: string;
}

export interface UpdateTransactionRequest {
  amount?: number;
  description?: string;
  category_id?: string;
}

export interface TransactionFilters {
  category_id?: string;
  type?: 'INCOME' | 'EXPENSE';
  limit?: number;
  offset?: number;
  start_date?: string;
  end_date?: string;
}

// Budget Types
export interface BudgetLimit {
  id: string;
  group_id: string;
  category_id: string;
  category: Category;
  limit_amount: number;
  period: 'MONTHLY' | 'WEEKLY' | 'YEARLY';
  is_active: boolean;
  alert_threshold: number;
  created_at: string;
}

export interface CreateBudgetLimitRequest {
  category_id: string;
  limit_amount: number;
  period: 'MONTHLY' | 'WEEKLY' | 'YEARLY';
  group_id: string;
  alert_threshold?: number;
}

export interface UpdateBudgetLimitRequest {
  limit_amount?: number;
  alert_threshold?: number;
  is_active?: boolean;
}

export interface BudgetStatus {
  budget: BudgetLimit;
  current_spent: number;
  remaining: number;
  percentage_used: number;
  is_over_budget: boolean;
  needs_alert: boolean;
  period_start_date: string;
  period_end_date: string;
}

// Report Types
export interface ReportSummary {
  total_income: { value: number; currency: string };
  total_expenses: { value: number; currency: string };
  net_balance: { value: number; currency: string };
  transaction_count: number;
  average_income: { value: number; currency: string };
  average_expense: { value: number; currency: string };
}

export interface CategorySummary {
  category: Category;
  total: { value: number; currency: string };
  transaction_count: number;
  percentage: number;
  average: { value: number; currency: string };
}

export interface DailyBreakdown {
  date: string;
  total_income: { value: number; currency: string };
  total_expenses: { value: number; currency: string };
  net_balance: { value: number; currency: string };
}

export interface Report {
  id: string;
  group_id: string;
  type: 'MONTHLY' | 'WEEKLY' | 'YEARLY';
  start_date: string;
  end_date: string;
  generated_at: string;
  summary: ReportSummary;
  income_by_category: CategorySummary[] | null;
  expense_by_category: CategorySummary[] | null;
  top_transactions: Transaction[] | null;
  budget_statuses: BudgetStatus[] | null;
  daily_breakdown: DailyBreakdown[] | null;
  comparison_previous: ReportSummary;
}

// Frontend UI Types
export interface SummaryCard {
  title: string;
  value: number;
  type: 'income' | 'expense' | 'balance' | 'savings';
  change: number;
  changeType: 'positive' | 'negative' | 'neutral';
  icon: string;
}

export interface ExpenseCategory {
  name: string;
  amount: number;
  percentage: number;
  color: string;
  icon: string;
}

export interface FilterOptions {
  period: string;
  startDate?: string;
  endDate?: string;
  category: string;
  member?: string;
}

// Health Check
export interface HealthCheck {
  service: string;
  status: string;
  timestamp: string;
}
