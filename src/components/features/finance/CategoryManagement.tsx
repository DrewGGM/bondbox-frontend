import React from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import type { Category } from '@/types/finance.types';

interface CategoryManagementProps {
  categories: Category[];
  onNew: () => void;
  onEdit: (category: Category) => void;
  onDelete: (category: Category) => void;
}

export const CategoryManagement: React.FC<CategoryManagementProps> = ({
  categories,
  onNew,
  onEdit,
  onDelete,
}) => {
  // Filter out undefined/null categories and validate data
  const validCategories = (categories || []).filter(cat => cat && cat.id && cat.name && cat.type);
  const expenseCategories = validCategories.filter(cat => cat.type === 'EXPENSE');
  const incomeCategories = validCategories.filter(cat => cat.type === 'INCOME');

  const handleDelete = (e: React.MouseEvent, category: Category) => {
    e.stopPropagation();
    onDelete(category);
  };

  const handleEdit = (e: React.MouseEvent, category: Category) => {
    e.stopPropagation();
    onEdit(category);
  };

  const CategoryItem: React.FC<{ category: Category }> = ({ category }) => (
    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group">
      <div className="flex items-center gap-2 flex-1">
        <div
          className="w-4 h-4 rounded-full flex-shrink-0"
          style={{ backgroundColor: category.color || '#6B7280' }}
        />
        <span className="text-sm text-gray-900">{category.name}</span>
      </div>
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={(e) => handleEdit(e, category)}
          className="p-1.5 text-gray-400 hover:text-primary hover:bg-white rounded transition-colors"
          title="Editar categoría"
        >
          <Pencil className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={(e) => handleDelete(e, category)}
          className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-white rounded transition-colors"
          title="Eliminar categoría"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 md:p-6">
      <div className="flex justify-between items-center mb-5">
        <h3 className="text-base md:text-lg font-semibold text-gray-900">
          Categorías
        </h3>
        <button
          onClick={onNew}
          className="flex items-center gap-1 text-sm text-primary hover:text-primary-dark transition-colors"
        >
          <Plus className="w-4 h-4" />
          Nueva
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">
            Gastos ({expenseCategories.length})
          </h4>
          <div className="space-y-2">
            {expenseCategories.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-4">
                No hay categorías de gastos
              </p>
            ) : (
              expenseCategories.map((category) => (
                <CategoryItem key={category.id} category={category} />
              ))
            )}
          </div>
        </div>

        <div className="border-t border-gray-200 pt-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">
            Ingresos ({incomeCategories.length})
          </h4>
          <div className="space-y-2">
            {incomeCategories.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-4">
                No hay categorías de ingresos
              </p>
            ) : (
              incomeCategories.map((category) => (
                <CategoryItem key={category.id} category={category} />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
