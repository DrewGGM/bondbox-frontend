import React from 'react';
import { Plus, Tag } from 'lucide-react';

interface TagsSidebarProps {
  tags: string[];
  selectedTagId: string | null;
  onSelectTag: (tagId: string | null) => void;
  onCreateTag?: () => void;
}

export const TagsSidebar: React.FC<TagsSidebarProps> = ({
  tags,
  selectedTagId,
  onSelectTag,
  onCreateTag,
}) => {

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Etiquetas</h2>
        {onCreateTag && (
          <button
            onClick={onCreateTag}
            className="p-1.5 text-primary hover:bg-primary/10 rounded-lg transition-colors"
            title="Crear nueva etiqueta"
          >
            <Plus className="w-5 h-5" />
          </button>
        )}
      </div>

      <div className="p-2">
        <button
          onClick={() => onSelectTag(null)}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-left ${
            selectedTagId === null
              ? 'bg-primary text-white font-medium'
              : 'text-gray-700 hover:bg-gray-50'
          }`}
        >
          <Tag className="w-4 h-4" />
          <span className="text-sm">Todas las etiquetas</span>
        </button>

        {tags.map((tag) => (
          <button
            key={tag}
            onClick={() => onSelectTag(tag)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-left ${
              selectedTagId === tag
                ? 'bg-primary text-white font-medium'
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            <span className={selectedTagId === tag ? 'text-white' : 'text-primary'}>#</span>
            <span className="text-sm">{tag}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
