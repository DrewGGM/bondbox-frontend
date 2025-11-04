import React, { useState, useEffect } from 'react';
import { X, DollarSign, FileText, Calendar, Tag } from 'lucide-react';
import type { Transaction, Category, CreateTransactionRequest, UpdateTransactionRequest } from '@/types/finance.types';

interface TransactionFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateTransactionRequest | UpdateTransactionRequest) => Promise<void>;
  transaction?: Transaction;
  type?: 'INCOME' | 'EXPENSE';
  categories: Category[];
  groupId: string;
}

export const TransactionFormModal: React.FC<TransactionFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  transaction,
  type: initialType,
  categories,
  groupId,
}) => {
  const [formData, setFormData] = useState({
    amount: transaction?.amount.toString() || '',
    description: transaction?.description || '',
    type: transaction?.type || initialType || 'EXPENSE',
    category_id: transaction?.category_id || '',
    transaction_date: transaction?.transaction_date ? transaction.transaction_date.split('T')[0] : new Date().toISOString().split('T')[0],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (transaction) {
      setFormData({
        amount: transaction.amount.toString(),
        description: transaction.description,
        type: transaction.type,
        category_id: transaction.category_id,
        transaction_date: transaction.transaction_date.split('T')[0],
      });
    } else if (initialType) {
      setFormData(prev => ({ ...prev, type: initialType }));
    }
  }, [transaction, initialType]);

  const filteredCategories = categories.filter(cat => cat.type === formData.type);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const amount = parseFloat(formData.amount);
    if (isNaN(amount) || amount <= 0) {
      setError('El monto debe ser un número positivo');
      return;
    }

    if (!formData.category_id) {
      setError('Debes seleccionar una categoría');
      return;
    }

    if (!formData.description.trim()) {
      setError('Debes ingresar una descripción');
      return;
    }

    setIsSubmitting(true);

    try {
      if (transaction) {
        const updateData: UpdateTransactionRequest = {
          amount,
          description: formData.description,
          category_id: formData.category_id,
        };
        await onSubmit(updateData);
      } else {
        const createData: CreateTransactionRequest = {
          amount,
          description: formData.description,
          type: formData.type as 'INCOME' | 'EXPENSE',
          category_id: formData.category_id,
          group_id: groupId,
        };
        await onSubmit(createData);
      }
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al guardar la transacción');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {transaction ? 'Editar Transacción' : `Nuevo ${formData.type === 'INCOME' ? 'Ingreso' : 'Gasto'}`}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            disabled={isSubmitting}
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
              {error}
            </div>
          )}

          {/* Type Toggle (only on create) */}
          {!transaction && (
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, type: 'EXPENSE', category_id: '' }))}
                className={`flex-1 py-2.5 px-4 rounded-lg font-medium transition-all ${
                  formData.type === 'EXPENSE'
                    ? 'bg-red-500 text-white shadow-md'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Gasto
              </button>
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, type: 'INCOME', category_id: '' }))}
                className={`flex-1 py-2.5 px-4 rounded-lg font-medium transition-all ${
                  formData.type === 'INCOME'
                    ? 'bg-green-500 text-white shadow-md'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Ingreso
              </button>
            </div>
          )}

          {/* Amount */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Monto
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="number"
                step="0.01"
                value={formData.amount}
                onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                placeholder="0.00"
                required
              />
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Categoría
            </label>
            <div className="relative">
              <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <select
                value={formData.category_id}
                onChange={(e) => setFormData(prev => ({ ...prev, category_id: e.target.value }))}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none appearance-none bg-white"
                required
              >
                <option value="">Selecciona una categoría</option>
                {filteredCategories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            {filteredCategories.length === 0 && (
              <p className="mt-2 text-sm text-orange-600">
                No hay categorías de {formData.type === 'INCOME' ? 'ingreso' : 'gasto'}. Crea una primero.
              </p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descripción
            </label>
            <div className="relative">
              <FileText className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none resize-none"
                placeholder="Describe la transacción..."
                rows={3}
                required
              />
            </div>
          </div>

          {/* Date (only on create) */}
          {!transaction && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fecha
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="date"
                  value={formData.transaction_date}
                  onChange={(e) => setFormData(prev => ({ ...prev, transaction_date: e.target.value }))}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                  required
                />
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
              disabled={isSubmitting}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2.5 bg-primary text-white rounded-lg hover:bg-primary-dark font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Guardando...' : transaction ? 'Actualizar' : 'Crear'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
