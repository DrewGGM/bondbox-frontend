import React from 'react';

interface QuickSuggestionsProps {
  onSuggestionClick: (suggestion: string) => void;
}

const suggestions = [
  'Crea una tarea rápida',
  'Registra un gasto',
  '¿Qué hay en la despensa?',
  'Muéstrame el balance del mes',
  'Próximos eventos del calendario',
  'Tareas pendientes de hoy',
];

export const QuickSuggestions: React.FC<QuickSuggestionsProps> = ({ onSuggestionClick }) => {
  return (
    <div className="p-2 md:p-4 bg-gray-50 border-t border-gray-200 flex gap-2 overflow-x-auto scrollbar-hide">
      {suggestions.map((suggestion, index) => (
        <button
          key={index}
          onClick={() => onSuggestionClick(suggestion)}
          className="px-3 py-1.5 md:px-4 md:py-2 bg-white border border-gray-300 rounded-full text-xs md:text-sm text-gray-700 whitespace-nowrap hover:bg-primary hover:text-white hover:border-primary transition-all flex-shrink-0"
        >
          {suggestion}
        </button>
      ))}
    </div>
  );
};