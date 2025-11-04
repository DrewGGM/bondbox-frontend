import React, { useState, useEffect } from 'react';
import { X, DollarSign, Tag, Calendar, Bell } from 'lucide-react';
import type { BudgetLimit, Category, CreateBudgetLimitRequest, UpdateBudgetLimitRequest } from '@/types/finance.types';

interface BudgetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateBudgetLimitRequest | UpdateBudgetLimitRequest) => Promise<void>;
  budget?: BudgetLimit;
  categories: Category[];
  groupId: string;
}

export const BudgetModal: React.FC<BudgetModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  budget,
  categories,
  groupId,
}) => {
  const [formData, setFormData] = useState({
    category_id: budget?.category_id || '',
    limit_amount: budget?.limit_amount.toString() || '',
    period: budget?.period || 'MONTHLY' as 'MONTHLY' | 'WEEKLY' | 'YEARLY',
    alert_threshold: budget?.alert_threshold?.toString() || '80',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (budget) {
      setFormData({
        category_id: budget.category_id,
        limit_amount: budget.limit_amount.toString(),
        period: budget.period,
        alert_threshold: budget.alert_threshold?.toString() || '80',
      });
    }
  }, [budget]);

  const expenseCategories = categories.filter(cat => cat.type === 'EXPENSE');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const limitAmount = parseFloat(formData.limit_amount);
    const alertThreshold = parseFloat(formData.alert_threshold);

    if (isNaN(limitAmount) || limitAmount <= 0) {
      setError('El límite debe ser un número positivo');
      return;
    }

    if (isNaN(alertThreshold) || alertThreshold < 0 || alertThreshold > 100) {
      setError('El umbral de alerta debe estar entre 0 y 100');
      return;
    }

    if (!formData.category_id) {
      setError('Debes seleccionar una categoría');
      return;
    }

    setIsSubmitting(true);

    try {
      if (budget) {
        const updateData: UpdateBudgetLimitRequest = {
          limit_amount: limitAmount,
          alert_threshold: alertThreshold,
        };
        await onSubmit(updateData);
      } else {
        const createData: CreateBudgetLimitRequest = {
          category_id: formData.category_id,
          limit_amount: limitAmount,
          period: formData.period,
          group_id: groupId,
          alert_threshold: alertThreshold,
        };
        await onSubmit(createData);
      }
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al guardar el presupuesto');
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
            {budget ? 'Editar Presupuesto' : 'Nuevo Presupuesto'}
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

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Categoría de Gasto
            </label>
            <div className="relative">
              <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <select
                value={formData.category_id}
                onChange={(e) => setFormData(prev => ({ ...prev, category_id: e.target.value }))}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none appearance-none bg-white"
                required
                disabled={!!budget}
              >
                <option value="">Selecciona una categoría</option>
                {expenseCategories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            {!!budget && (
              <p className="mt-2 text-xs text-gray-500">
                No puedes cambiar la categoría de un presupuesto existente
              </p>
            )}
          </div>

          {/* Period (only on create) */}
          {!budget && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Periodo
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <select
                  value={formData.period}
                  onChange={(e) => setFormData(prev => ({ ...prev, period: e.target.value as 'MONTHLY' | 'WEEKLY' | 'YEARLY' }))}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none appearance-none bg-white"
                  required
                >
                  <option value="WEEKLY">Semanal</option>
                  <option value="MONTHLY">Mensual</option>
                  <option value="YEARLY">Anual</option>
                </select>
              </div>
            </div>
          )}

          {/* Limit Amount */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Límite de Gasto
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="number"
                step="0.01"
                value={formData.limit_amount}
                onChange={(e) => setFormData(prev => ({ ...prev, limit_amount: e.target.value }))}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                placeholder="0.00"
                required
              />
            </div>
          </div>

          {/* Alert Threshold */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Umbral de Alerta (%)
            </label>
            <div className="relative">
              <Bell className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="number"
                min="0"
                max="100"
                value={formData.alert_threshold}
                onChange={(e) => setFormData(prev => ({ ...prev, alert_threshold: e.target.value }))}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                placeholder="80"
              />
            </div>
            <p className="mt-2 text-xs text-gray-500">
              Recibirás una alerta cuando gastes más del {formData.alert_threshold}% del límite
            </p>
          </div>

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
              {isSubmitting ? 'Guardando...' : budget ? 'Actualizar' : 'Crear'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
