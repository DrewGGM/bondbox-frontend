import React, { useState } from 'react';
import { Header } from '@/components/layout/Header';
import {
  FinanceHeader,
  FilterBar,
  SummaryCard,
  TransactionsList,
  BudgetCard,
  ExpenseChart,
  TransactionFormModal,
  BudgetModal,
  ConfirmDeleteModal,
  CategoryModal,
  CategoryManagement,
  ReportCard,
  ExportModal,
} from '@/components/features/finance';
import { useFinance } from '@/hooks/useFinance';
import { ErrorMessage } from '@/components/common/ErrorMessage';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { useGroupStore } from '@/store/groupStore';
import { reportService } from '@/api/services/financeService';
import type {
  FilterOptions,
  TransactionFilters,
  Transaction,
  BudgetStatus,
  CreateTransactionRequest,
  UpdateTransactionRequest,
  CreateBudgetLimitRequest,
  UpdateBudgetLimitRequest,
  Category,
  CreateCategoryRequest,
  BudgetLimit,
} from '@/types/finance.types';

export const FinancePage: React.FC = () => {
  const [filters, setFilters] = useState<FilterOptions>({
    period: 'this-month',
    category: 'all',
  });

  // Modal states
  const [transactionModalOpen, setTransactionModalOpen] = useState(false);
  const [budgetModalOpen, setBudgetModalOpen] = useState(false);
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteType, setDeleteType] = useState<'transaction' | 'budget' | 'category'>('transaction');
  const [modalType, setModalType] = useState<'INCOME' | 'EXPENSE' | undefined>();
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | undefined>();
  const [selectedBudget, setSelectedBudget] = useState<BudgetStatus | undefined>();
  const [selectedCategory, setSelectedCategory] = useState<Category | undefined>();
  const [transactionToDelete, setTransactionToDelete] = useState<Transaction | undefined>();
  const [budgetToDelete, setBudgetToDelete] = useState<BudgetLimit | undefined>();
  const [categoryToDelete, setCategoryToDelete] = useState<Category | undefined>();

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
              Por favor, selecciona un grupo desde el dashboard para ver las finanzas.
            </p>
          </div>
        </main>
      </div>
    );
  }

  const groupId = selectedGroup.id;

  const {
    transactions,
    categories,
    budgetStatuses,
    summaryCards,
    expenseCategories,
    loading,
    error,
    createTransaction,
    updateTransaction,
    deleteTransaction,
    loadTransactions,
    createCategory,
    updateCategory,
    deleteCategory,
    createBudgetLimit,
    updateBudgetLimit,
    deleteBudgetLimit,
    loadWeeklyReport,
    loadYearlyReport,
    clearError,
  } = useFinance(groupId);

  const convertPeriodToDates = (period: string): { start_date: string; end_date: string } | null => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();

    switch (period) {
      case 'this-month': {
        const start = new Date(year, month, 1);
        const end = new Date(year, month + 1, 0);
        return {
          start_date: start.toISOString().split('T')[0],
          end_date: end.toISOString().split('T')[0],
        };
      }
      case 'last-month': {
        const start = new Date(year, month - 1, 1);
        const end = new Date(year, month, 0);
        return {
          start_date: start.toISOString().split('T')[0],
          end_date: end.toISOString().split('T')[0],
        };
      }
      case 'last-3-months': {
        const start = new Date(year, month - 3, 1);
        const end = new Date(year, month + 1, 0);
        return {
          start_date: start.toISOString().split('T')[0],
          end_date: end.toISOString().split('T')[0],
        };
      }
      case 'this-year': {
        const start = new Date(year, 0, 1);
        const end = new Date(year, 11, 31);
        return {
          start_date: start.toISOString().split('T')[0],
          end_date: end.toISOString().split('T')[0],
        };
      }
      default:
        return null;
    }
  };

  const handleFiltersChange = async (newFilters: FilterOptions) => {
    setFilters(newFilters);

    const apiFilters: TransactionFilters = {};

    if (newFilters.category !== 'all') {
      apiFilters.category_id = newFilters.category;
    }

    if (newFilters.period === 'custom' && newFilters.startDate && newFilters.endDate) {
      apiFilters.start_date = newFilters.startDate;
      apiFilters.end_date = newFilters.endDate;
    } else {
      const dates = convertPeriodToDates(newFilters.period);
      if (dates) {
        apiFilters.start_date = dates.start_date;
        apiFilters.end_date = dates.end_date;
      }
    }

    await loadTransactions(apiFilters);
  };

  const handleNewIncome = () => {
    setModalType('INCOME');
    setSelectedTransaction(undefined);
    setTransactionModalOpen(true);
  };

  const handleNewExpense = () => {
    setModalType('EXPENSE');
    setSelectedTransaction(undefined);
    setTransactionModalOpen(true);
  };

  const handleExport = () => {
    setExportModalOpen(true);
  };

  const handleExportSubmit = async (data: {
    report_type: 'monthly' | 'yearly';
    format: 'pdf' | 'excel';
    year: number;
    month?: number;
  }) => {
    try {
      const blob = await reportService.export(groupId, data);

      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;

      // Generate filename
      const extension = data.format === 'pdf' ? 'pdf' : 'xlsx';
      const reportType = data.report_type === 'monthly' ? 'mensual' : 'anual';
      const dateStr = data.report_type === 'monthly'
        ? `${data.year}-${String(data.month).padStart(2, '0')}`
        : `${data.year}`;
      link.download = `reporte-${reportType}-${dateStr}.${extension}`;

      // Trigger download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error: any) {
      throw error;
    }
  };

  const handleTransactionClick = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setModalType(undefined);
    setTransactionModalOpen(true);
  };

  const handleTransactionSubmit = async (data: CreateTransactionRequest | UpdateTransactionRequest) => {
    if (selectedTransaction) {
      await updateTransaction(selectedTransaction.id, data as UpdateTransactionRequest);
    } else {
      await createTransaction(data as CreateTransactionRequest);
    }
  };

  const handleTransactionDelete = (transaction: Transaction) => {
    setTransactionToDelete(transaction);
    setDeleteType('transaction');
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (deleteType === 'transaction' && transactionToDelete) {
      await deleteTransaction(transactionToDelete.id);
      setTransactionToDelete(undefined);
    } else if (deleteType === 'budget' && budgetToDelete) {
      await deleteBudgetLimit(budgetToDelete.id);
      setBudgetToDelete(undefined);
    } else if (deleteType === 'category' && categoryToDelete) {
      await deleteCategory(categoryToDelete.id);
      setCategoryToDelete(undefined);
    }
  };

  const handleBudgetEdit = (budget: BudgetStatus) => {
    setSelectedBudget(budget);
    setBudgetModalOpen(true);
  };

  const handleNewBudget = () => {
    setSelectedBudget(undefined);
    setBudgetModalOpen(true);
  };

  const handleBudgetSubmit = async (data: CreateBudgetLimitRequest | UpdateBudgetLimitRequest) => {
    if (selectedBudget) {
      await updateBudgetLimit(selectedBudget.budget.id, data as UpdateBudgetLimitRequest);
    } else {
      await createBudgetLimit(data as CreateBudgetLimitRequest);
    }
  };

  const handleBudgetDelete = (budget: BudgetStatus) => {
    setBudgetToDelete(budget.budget);
    setDeleteType('budget');
    setDeleteModalOpen(true);
  };

  const handleNewCategory = () => {
    setSelectedCategory(undefined);
    setCategoryModalOpen(true);
  };

  const handleCategoryEdit = (category: Category) => {
    setSelectedCategory(category);
    setCategoryModalOpen(true);
  };

  const handleCategoryDelete = (category: Category) => {
    setCategoryToDelete(category);
    setDeleteType('category');
    setDeleteModalOpen(true);
  };

  const handleCategorySubmit = async (data: CreateCategoryRequest | Partial<CreateCategoryRequest>) => {
    if (selectedCategory) {
      await updateCategory(selectedCategory.id, data);
    } else {
      await createCategory(data);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        <FinanceHeader
          onNewIncome={handleNewIncome}
          onNewExpense={handleNewExpense}
          onExport={handleExport}
        />

        <FilterBar
          filters={filters}
          onFiltersChange={handleFiltersChange}
          categories={categories}
        />

        {error && (
          <div className="mb-6">
            <ErrorMessage message={error} onDismiss={clearError} />
          </div>
        )}

        {loading.report && (
          <div className="mb-6">
            <LoadingSpinner
              size="lg"
              text="Cargando datos financieros..."
              className="py-8"
            />
          </div>
        )}

        <div className="finance-summary-grid mb-6 md:mb-8">
          {summaryCards.map((card, index) => (
            <SummaryCard key={index} data={card} />
          ))}
        </div>

        <div className="finance-content-grid">
          <div className="lg:col-span-2">
            <TransactionsList
              transactions={transactions}
              onTransactionClick={handleTransactionClick}
              onTransactionDelete={handleTransactionDelete}
              loading={loading.transactions}
            />
          </div>

          <div className="finance-sidebar">
            <BudgetCard
              budgetStatuses={budgetStatuses}
              onEdit={handleBudgetEdit}
              onNew={handleNewBudget}
              onDelete={handleBudgetDelete}
            />
            <ExpenseChart
              categories={expenseCategories}
              totalExpenses={expenseCategories.reduce(
                (sum, cat) => sum + cat.amount,
                0
              )}
            />
            <ReportCard
              groupId={groupId}
              onLoadWeekly={loadWeeklyReport}
              onLoadYearly={loadYearlyReport}
            />
            <CategoryManagement
              categories={categories}
              onNew={handleNewCategory}
              onEdit={handleCategoryEdit}
              onDelete={handleCategoryDelete}
            />
          </div>
        </div>
      </main>

      <TransactionFormModal
        isOpen={transactionModalOpen}
        onClose={() => setTransactionModalOpen(false)}
        onSubmit={handleTransactionSubmit}
        transaction={selectedTransaction}
        type={modalType}
        categories={categories}
        groupId={groupId}
      />

      <BudgetModal
        isOpen={budgetModalOpen}
        onClose={() => setBudgetModalOpen(false)}
        onSubmit={handleBudgetSubmit}
        budget={selectedBudget?.budget}
        categories={categories}
        groupId={groupId}
      />

      <CategoryModal
        isOpen={categoryModalOpen}
        onClose={() => setCategoryModalOpen(false)}
        onSubmit={handleCategorySubmit}
        category={selectedCategory}
        groupId={groupId}
      />

      <ExportModal
        isOpen={exportModalOpen}
        onClose={() => setExportModalOpen(false)}
        onExport={handleExportSubmit}
      />

      <ConfirmDeleteModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title={
          deleteType === 'transaction'
            ? 'Eliminar Transacción'
            : deleteType === 'budget'
            ? 'Eliminar Presupuesto'
            : 'Eliminar Categoría'
        }
        message={
          deleteType === 'transaction'
            ? '¿Estás seguro de que deseas eliminar esta transacción?'
            : deleteType === 'budget'
            ? '¿Estás seguro de que deseas eliminar este presupuesto?'
            : '⚠️ ADVERTENCIA: Al eliminar esta categoría, también se eliminarán TODAS las transacciones asociadas. Esta acción no se puede deshacer.'
        }
        itemName={
          deleteType === 'transaction'
            ? transactionToDelete?.description
            : deleteType === 'budget'
            ? budgetToDelete?.category.name
            : categoryToDelete?.name
        }
      />
    </div>
  );
};
