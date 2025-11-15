import React from 'react';

export interface EventCategory {
  id: string;
  name: string;
  color: string;
  icon?: string;
}

interface CategoriesProps {
  categories: EventCategory[];
  onCategoryClick?: (category: EventCategory) => void;
}

export const Categories: React.FC<CategoriesProps> = ({
  categories,
  onCategoryClick,
}) => {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-6">
      <h3 className="text-lg font-bold text-gray-900 mb-4">Categorías</h3>

      <div className="space-y-2">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => onCategoryClick?.(category)}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors text-left"
          >
            <div
              className="w-3 h-3 rounded-full flex-shrink-0"
              style={{ backgroundColor: category.color }}
            ></div>
            <span className="text-sm text-gray-700">{category.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
