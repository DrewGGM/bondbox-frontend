import React, { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { FinanceHeader } from '@/components/features/finance/FinanceHeader';
import { FilterBar } from '@/components/features/finance/FilterBar';
import { SummaryCard } from '@/components/features/finance/SummaryCard';
import { TransactionsList } from '@/components/features/finance/TransactionsList';
import { BudgetCard } from '@/components/features/finance/BudgetCard';
import { ExpenseChart } from '@/components/features/finance/ExpenseChart';
import { useFinance } from '@/hooks/useFinance';
import { ErrorMessage } from '@/components/common/ErrorMessage';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { useGroupStore } from '@/store/groupStore';
import type {
  FilterOptions,
  TransactionFilters,
  Transaction,
} from '@/types/finance.types';

export const FinancePage: React.FC = () => {
  const [filters, setFilters] = useState<FilterOptions>({
    period: 'this-month',
    category: 'all',
    member: 'all',
  });

  // Get groupId from selected group
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
    budgetStatuses,
    summaryCards,
    expenseCategories,
    loading,
    error,
    // createTransaction, // TODO: Implementar modal de creación
    // updateTransaction, // TODO: Implementar modal de edición
    // deleteTransaction, // TODO: Implementar confirmación de eliminación
    loadTransactions,
    // createCategory, // TODO: Implementar gestión de categorías
    // loadCategories, // TODO: Implementar gestión de categorías
    // createBudgetLimit, // TODO: Implementar gestión de presupuestos
    // updateBudgetLimit, // TODO: Implementar gestión de presupuestos
    // deleteBudgetLimit, // TODO: Implementar gestión de presupuestos
    // loadBudgetLimits, // TODO: Implementar gestión de presupuestos
    // loadBudgetStatuses, // TODO: Implementar gestión de presupuestos
    // loadCurrentReport, // TODO: Implementar refresh manual
    // refreshData, // TODO: Implementar refresh manual
    clearError,
  } = useFinance(groupId);

  // Handle filter changes
  const handleFiltersChange = async (newFilters: FilterOptions) => {
    setFilters(newFilters);

    // Convert UI filters to API filters
    const apiFilters: TransactionFilters = {};

    if (newFilters.category !== 'all') {
      // Find category ID by name
      // TODO: Implement category lookup
    }

    if (
      newFilters.period === 'custom' &&
      newFilters.startDate &&
      newFilters.endDate
    ) {
      apiFilters.start_date = newFilters.startDate;
      apiFilters.end_date = newFilters.endDate;
    }

    await loadTransactions(apiFilters);
  };

  const handleNewIncome = () => {
    console.log('Nuevo ingreso');
    // TODO: Implementar modal o navegación para nuevo ingreso
  };

  const handleNewExpense = () => {
    console.log('Nuevo gasto');
    // TODO: Implementar modal o navegación para nuevo gasto
  };

  const handleExport = () => {
    console.log('Exportar datos');
    // TODO: Implementar funcionalidad de exportación
  };

  const handleTransactionClick = (transaction: Transaction) => {
    console.log('Transaction clicked:', transaction);
    // TODO: Implementar modal de detalles o edición
  };

  const handleBudgetEdit = () => {
    console.log('Editar presupuesto');
    // TODO: Implementar modal de edición de presupuesto
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

        <FilterBar filters={filters} onFiltersChange={handleFiltersChange} />

        {/* Error Display */}
        {error && (
          <div className="mb-6">
            <ErrorMessage message={error} onDismiss={clearError} />
          </div>
        )}

        {/* Loading State */}
        {loading.report && (
          <div className="mb-6">
            <LoadingSpinner
              size="lg"
              text="Cargando datos financieros..."
              className="py-8"
            />
          </div>
        )}

        {/* Summary Cards */}
        <div className="finance-summary-grid mb-6 md:mb-8">
          {summaryCards.map((card, index) => (
            <SummaryCard key={index} data={card} />
          ))}
        </div>

        {/* Main Content */}
        <div className="finance-content-grid">
          {/* Transactions List */}
          <div className="lg:col-span-2">
            <TransactionsList
              transactions={transactions}
              onTransactionClick={handleTransactionClick}
              loading={loading.transactions}
            />
          </div>

          {/* Sidebar */}
          <div className="finance-sidebar">
            <BudgetCard
              budgetStatuses={budgetStatuses}
              onEdit={handleBudgetEdit}
            />
            <ExpenseChart
              categories={expenseCategories}
              totalExpenses={expenseCategories.reduce(
                (sum, cat) => sum + cat.amount,
                0
              )}
            />
          </div>
        </div>
      </main>
    </div>
  );
};
