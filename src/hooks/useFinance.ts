import { useState, useEffect, useCallback } from 'react';
import { 
  transactionService, 
  categoryService, 
  budgetService, 
  reportService,
  financeUtils 
} from '@/api/services/financeService';
import type {
  Transaction,
  Category,
  BudgetLimit,
  BudgetStatus,
  Report,
  TransactionFilters,
  SummaryCard,
  ExpenseCategory,
} from '@/types/finance.types';

interface UseFinanceState {
  // Data
  transactions: Transaction[];
  categories: Category[];
  budgetLimits: BudgetLimit[];
  budgetStatuses: BudgetStatus[];
  currentReport: Report | null;
  summaryCards: SummaryCard[];
  expenseCategories: ExpenseCategory[];
  
  // Loading states
  loading: {
    transactions: boolean;
    categories: boolean;
    budgets: boolean;
    report: boolean;
  };
  
  // Error states
  error: string | null;
  
  // Pagination
  pagination: {
    count: number;
    limit: number;
    offset: number;
  };
}

interface UseFinanceActions {
  // Transaction actions
  createTransaction: (data: any) => Promise<void>;
  updateTransaction: (id: string, data: any) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
  loadTransactions: (filters?: TransactionFilters) => Promise<void>;

  // Category actions
  createCategory: (data: any) => Promise<void>;
  updateCategory: (id: string, data: any) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  loadCategories: () => Promise<void>;

  // Budget actions
  createBudgetLimit: (data: any) => Promise<void>;
  updateBudgetLimit: (id: string, data: any) => Promise<void>;
  deleteBudgetLimit: (id: string) => Promise<void>;
  loadBudgetLimits: () => Promise<void>;
  loadBudgetStatuses: () => Promise<void>;

  // Report actions
  loadCurrentReport: () => Promise<void>;
  loadMonthlyReport: (year?: number, month?: number) => Promise<void>;
  loadWeeklyReport: () => Promise<Report>;
  loadYearlyReport: (year?: number) => Promise<Report>;

  // Utility actions
  refreshData: () => Promise<void>;
  clearError: () => void;
}

export const useFinance = (groupId: string): UseFinanceState & UseFinanceActions => {
  const [state, setState] = useState<UseFinanceState>({
    transactions: [],
    categories: [],
    budgetLimits: [],
    budgetStatuses: [],
    currentReport: null,
    summaryCards: [],
    expenseCategories: [],
    loading: {
      transactions: false,
      categories: false,
      budgets: false,
      report: false,
    },
    error: null,
    pagination: {
      count: 0,
      limit: 20,
      offset: 0,
    },
  });

  // Helper function to update loading state
  const setLoading = useCallback((key: keyof UseFinanceState['loading'], value: boolean) => {
    setState(prev => ({
      ...prev,
      loading: { ...prev.loading, [key]: value },
    }));
  }, []);

  // Helper function to set error
  const setError = useCallback((error: string | null) => {
    setState(prev => ({ ...prev, error }));
  }, []);

  // Load transactions
  const loadTransactions = useCallback(async (filters?: TransactionFilters) => {
    if (!groupId) return;
    
    setLoading('transactions', true);
    setError(null);
    
    try {
      const response = await transactionService.list(groupId, {
        ...filters,
        limit: state.pagination.limit,
        offset: state.pagination.offset,
      });
      
      setState(prev => ({
        ...prev,
        transactions: (response.transactions as Transaction[]) || [],
        pagination: {
          ...prev.pagination,
          count: response.count || 0,
        },
      }));
    } catch (error: any) {
      setError(error.response?.data?.message || 'Error al cargar transacciones');
    } finally {
      setLoading('transactions', false);
    }
  }, [groupId, state.pagination.limit, state.pagination.offset, setLoading, setError]);

  // Load categories
  const loadCategories = useCallback(async () => {
    if (!groupId) return;
    
    setLoading('categories', true);
    setError(null);
    
    try {
      const response = await categoryService.list(groupId);
      setState(prev => ({ ...prev, categories: response.categories || [] }));
    } catch (error: any) {
      setError(error.response?.data?.message || 'Error al cargar categorías');
    } finally {
      setLoading('categories', false);
    }
  }, [groupId, setLoading, setError]);

  // Load budget limits
  const loadBudgetLimits = useCallback(async () => {
    if (!groupId) return;
    
    setLoading('budgets', true);
    setError(null);
    
    try {
      const response = await budgetService.list(groupId);
      setState(prev => ({ ...prev, budgetLimits: response.budget_limits || [] }));
    } catch (error: any) {
      setError(error.response?.data?.message || 'Error al cargar presupuestos');
    } finally {
      setLoading('budgets', false);
    }
  }, [groupId, setLoading, setError]);

  // Load budget statuses
  const loadBudgetStatuses = useCallback(async () => {
    if (!groupId) return;
    
    setLoading('budgets', true);
    setError(null);
    
    try {
      const response = await budgetService.getStatus(groupId);
      setState(prev => ({ ...prev, budgetStatuses: response.budget_statuses || [] }));
    } catch (error: any) {
      setError(error.response?.data?.message || 'Error al cargar estados de presupuesto');
    } finally {
      setLoading('budgets', false);
    }
  }, [groupId, setLoading, setError]);

  // Load current report
  const loadCurrentReport = useCallback(async () => {
    if (!groupId) return;
    
    setLoading('report', true);
    setError(null);
    
    try {
      const report = await reportService.getMonthly(groupId);
      setState(prev => ({ ...prev, currentReport: report }));
      
      // Generate summary cards from report
      const summaryCards: SummaryCard[] = [
        {
          title: 'Ingresos totales',
          value: report.summary.total_income.value,
          type: 'income',
          change: 0, // TODO: Calculate from comparison_previous
          changeType: 'positive',
          icon: '⭐',
        },
        {
          title: 'Gastos totales',
          value: report.summary.total_expenses.value,
          type: 'expense',
          change: 0, // TODO: Calculate from comparison_previous
          changeType: 'negative',
          icon: '📉',
        },
        {
          title: 'Balance',
          value: report.summary.net_balance.value,
          type: 'balance',
          change: 0,
          changeType: report.summary.net_balance.value >= 0 ? 'positive' : 'negative',
          icon: '💰',
        },
        {
          title: 'Ahorros del mes',
          value: Math.max(0, report.summary.net_balance.value),
          type: 'savings',
          change: 0,
          changeType: 'neutral',
          icon: '🏦',
        },
      ];
      
      // Generate expense categories from report
      const expenseCategories: ExpenseCategory[] = (report.expense_by_category || []).map(item => ({
        name: item.category.name,
        amount: item.total.value,
        percentage: item.percentage,
        color: item.category.color,
        icon: financeUtils.getCategoryIcon(item.category.name),
      }));
      
      setState(prev => ({
        ...prev,
        summaryCards,
        expenseCategories,
      }));
    } catch (error: any) {
      setError(error.response?.data?.message || 'Error al cargar reporte');
    } finally {
      setLoading('report', false);
    }
  }, [groupId, setLoading, setError]);

  // Load monthly report
  const loadMonthlyReport = useCallback(async (year?: number, month?: number) => {
    if (!groupId) return;

    setLoading('report', true);
    setError(null);

    try {
      const report = await reportService.getMonthly(groupId, year, month);
      setState(prev => ({ ...prev, currentReport: report }));
    } catch (error: any) {
      setError(error.response?.data?.message || 'Error al cargar reporte mensual');
    } finally {
      setLoading('report', false);
    }
  }, [groupId, setLoading, setError]);

  // Load weekly report
  const loadWeeklyReport = useCallback(async (): Promise<Report> => {
    if (!groupId) throw new Error('No group selected');

    try {
      const report = await reportService.getWeekly(groupId);
      return report;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error al cargar reporte semanal');
    }
  }, [groupId]);

  // Load yearly report
  const loadYearlyReport = useCallback(async (year?: number): Promise<Report> => {
    if (!groupId) throw new Error('No group selected');

    try {
      const report = await reportService.getYearly(groupId, year);
      return report;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error al cargar reporte anual');
    }
  }, [groupId]);

  // Create transaction
  const createTransaction = useCallback(async (data: any) => {
    if (!groupId) return;
    
    setError(null);
    
    try {
      await transactionService.create({ ...data, group_id: groupId });
      await loadTransactions(); // Refresh transactions
      await loadCurrentReport(); // Refresh report
    } catch (error: any) {
      setError(error.response?.data?.message || 'Error al crear transacción');
    }
  }, [groupId, loadTransactions, loadCurrentReport, setError]);

  // Update transaction
  const updateTransaction = useCallback(async (id: string, data: any) => {
    if (!groupId) return;
    
    setError(null);
    
    try {
      await transactionService.update(id, data, groupId);
      await loadTransactions(); // Refresh transactions
      await loadCurrentReport(); // Refresh report
    } catch (error: any) {
      setError(error.response?.data?.message || 'Error al actualizar transacción');
    }
  }, [groupId, loadTransactions, loadCurrentReport, setError]);

  // Delete transaction
  const deleteTransaction = useCallback(async (id: string) => {
    if (!groupId) return;
    
    setError(null);
    
    try {
      await transactionService.delete(id, groupId);
      await loadTransactions(); // Refresh transactions
      await loadCurrentReport(); // Refresh report
    } catch (error: any) {
      setError(error.response?.data?.message || 'Error al eliminar transacción');
    }
  }, [groupId, loadTransactions, loadCurrentReport, setError]);

  // Create category
  const createCategory = useCallback(async (data: any) => {
    if (!groupId) return;

    setError(null);

    try {
      await categoryService.create({ ...data, group_id: groupId });
      await loadCategories();
    } catch (error: any) {
      setError(error.response?.data?.message || 'Error al crear categoría');
      throw error;
    }
  }, [groupId, loadCategories, setError]);

  // Update category
  const updateCategory = useCallback(async (id: string, data: any) => {
    if (!groupId) return;

    setError(null);

    try {
      await categoryService.update(id, data, groupId);
      await loadCategories();
    } catch (error: any) {
      setError(error.response?.data?.message || 'Error al actualizar categoría');
      throw error;
    }
  }, [groupId, loadCategories, setError]);

  // Delete category
  const deleteCategory = useCallback(async (id: string) => {
    if (!groupId) return;

    setError(null);

    try {
      await categoryService.delete(id, groupId);
      await loadCategories();
    } catch (error: any) {
      setError(error.response?.data?.message || 'Error al eliminar categoría');
      throw error;
    }
  }, [groupId, loadCategories, setError]);

  // Create budget limit
  const createBudgetLimit = useCallback(async (data: any) => {
    if (!groupId) return;
    
    setError(null);
    
    try {
      await budgetService.create({ ...data, group_id: groupId });
      await loadBudgetLimits(); // Refresh budget limits
      await loadBudgetStatuses(); // Refresh budget statuses
    } catch (error: any) {
      setError(error.response?.data?.message || 'Error al crear límite de presupuesto');
    }
  }, [groupId, loadBudgetLimits, loadBudgetStatuses, setError]);

  // Update budget limit
  const updateBudgetLimit = useCallback(async (id: string, data: any) => {
    if (!groupId) return;
    
    setError(null);
    
    try {
      await budgetService.update(id, data, groupId);
      await loadBudgetLimits(); // Refresh budget limits
      await loadBudgetStatuses(); // Refresh budget statuses
    } catch (error: any) {
      setError(error.response?.data?.message || 'Error al actualizar límite de presupuesto');
    }
  }, [groupId, loadBudgetLimits, loadBudgetStatuses, setError]);

  // Delete budget limit
  const deleteBudgetLimit = useCallback(async (id: string) => {
    if (!groupId) return;
    
    setError(null);
    
    try {
      await budgetService.delete(id, groupId);
      await loadBudgetLimits(); // Refresh budget limits
      await loadBudgetStatuses(); // Refresh budget statuses
    } catch (error: any) {
      setError(error.response?.data?.message || 'Error al eliminar límite de presupuesto');
    }
  }, [groupId, loadBudgetLimits, loadBudgetStatuses, setError]);

  // Refresh all data
  const refreshData = useCallback(async () => {
    await Promise.all([
      loadTransactions(),
      loadCategories(),
      loadBudgetLimits(),
      loadBudgetStatuses(),
      loadCurrentReport(),
    ]);
  }, [loadTransactions, loadCategories, loadBudgetLimits, loadBudgetStatuses, loadCurrentReport]);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, [setError]);

  // Load initial data
  useEffect(() => {
    if (groupId) {
      refreshData();
    }
  }, [groupId, refreshData]);

  return {
    ...state,
    createTransaction,
    updateTransaction,
    deleteTransaction,
    loadTransactions,
    createCategory,
    updateCategory,
    deleteCategory,
    loadCategories,
    createBudgetLimit,
    updateBudgetLimit,
    deleteBudgetLimit,
    loadBudgetLimits,
    loadBudgetStatuses,
    loadCurrentReport,
    loadMonthlyReport,
    loadWeeklyReport,
    loadYearlyReport,
    refreshData,
    clearError,
  };
};
