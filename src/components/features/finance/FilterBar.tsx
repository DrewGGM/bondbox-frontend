import React from 'react';
import type { FilterOptions, Category } from '@/types/finance.types';

interface FilterBarProps {
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
  categories: Category[];
}

export const FilterBar: React.FC<FilterBarProps> = ({ filters, onFiltersChange, categories }) => {
  const handleFilterChange = (key: keyof FilterOptions, value: string) => {
    onFiltersChange({
      ...filters,
      [key]: value,
    });
  };

  return (
    <div className="bg-white p-4 md:p-5 rounded-xl shadow-sm border border-gray-100 mb-6">
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-start sm:items-center">
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-700 whitespace-nowrap">
            Período:
          </label>
          <select
            value={filters.period}
            onChange={(e) => handleFilterChange('period', e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="this-month">Este mes</option>
            <option value="last-month">Último mes</option>
            <option value="last-3-months">Últimos 3 meses</option>
            <option value="this-year">Este año</option>
            <option value="custom">Personalizado</option>
          </select>
        </div>

        {filters.period === 'custom' && (
          <div className="flex items-center gap-2">
            <input
              type="date"
              value={filters.startDate || ''}
              onChange={(e) => handleFilterChange('startDate', e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            <span className="text-gray-500">-</span>
            <input
              type="date"
              value={filters.endDate || ''}
              onChange={(e) => handleFilterChange('endDate', e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
        )}

        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-700 whitespace-nowrap">
            Categoría:
          </label>
          <select
            value={filters.category}
            onChange={(e) => handleFilterChange('category', e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="all">Todas</option>
            {(categories || [])
              .filter(category => category && category.id && category.name)
              .map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))
            }
          </select>
        </div>
      </div>
    </div>
  );
};
