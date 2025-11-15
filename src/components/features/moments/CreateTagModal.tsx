import React, { useState } from 'react';
import { X, Tag } from 'lucide-react';
import type { Moment } from '@/types/moments.types';

interface CreateTagModalProps {
  isOpen: boolean;
  onClose: () => void;
  moments: Moment[];
  onCreateTag: (momentId: number, tagName: string) => Promise<void>;
}

export const CreateTagModal: React.FC<CreateTagModalProps> = ({
  isOpen,
  onClose,
  moments,
  onCreateTag,
}) => {
  const [tagName, setTagName] = useState('');
  const [selectedMomentId, setSelectedMomentId] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tagName.trim() || !selectedMomentId) return;

    setIsSubmitting(true);
    try {
      await onCreateTag(selectedMomentId, tagName.trim());
      setTagName('');
      setSelectedMomentId(null);
      onClose();
    } catch (error) {
      console.error('Error creating tag:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setTagName('');
    setSelectedMomentId(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Tag className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-semibold text-gray-900">Crear Etiqueta</h2>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Tag Name Input */}
          <div>
            <label htmlFor="tagName" className="block text-sm font-medium text-gray-700 mb-2">
              Nombre de la etiqueta
            </label>
            <input
              id="tagName"
              type="text"
              value={tagName}
              onChange={(e) => setTagName(e.target.value)}
              placeholder="Ej: Vacaciones, Familia, Cumpleaños..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
              autoFocus
            />
          </div>

          {/* Moment Selection */}
          <div>
            <label htmlFor="moment" className="block text-sm font-medium text-gray-700 mb-2">
              Selecciona un momento
            </label>
            <div className="max-h-64 overflow-y-auto border border-gray-300 rounded-lg">
              {moments.length === 0 ? (
                <div className="p-4 text-center text-sm text-gray-500">
                  No hay momentos disponibles
                </div>
              ) : (
                moments.map((moment) => (
                  <button
                    key={moment.id}
                    type="button"
                    onClick={() => setSelectedMomentId(moment.id)}
                    className={`w-full text-left p-3 border-b border-gray-100 last:border-b-0 transition-colors ${
                      selectedMomentId === moment.id
                        ? 'bg-primary/10 border-l-4 border-l-primary'
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
                        {(moment.autor?.nombre || 'U').charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {moment.titulo}
                        </p>
                        {moment.descripcion && (
                          <p className="text-xs text-gray-500 truncate mt-0.5">
                            {moment.descripcion}
                          </p>
                        )}
                        <p className="text-xs text-gray-400 mt-0.5">
                          {moment.autor?.nombre || 'Usuario'}
                        </p>
                      </div>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={!tagName.trim() || !selectedMomentId || isSubmitting}
              className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? 'Creando...' : 'Crear Etiqueta'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
