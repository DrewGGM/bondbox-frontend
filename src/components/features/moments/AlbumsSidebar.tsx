import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';

// UI Album type for sidebar (different from backend Album)
export interface UIAlbum {
  id: string | number;
  name: string;
  icon?: string;
  isDefault?: boolean;
}

interface AlbumsSidebarProps {
  albums: UIAlbum[];
  selectedAlbumId: string;
  onSelectAlbum: (albumId: string) => void;
  onCreateAlbum?: (name: string, description?: string) => Promise<void>;
}

export const AlbumsSidebar: React.FC<AlbumsSidebarProps> = ({
  albums,
  selectedAlbumId,
  onSelectAlbum,
  onCreateAlbum,
}) => {
  const [isCreating, setIsCreating] = useState(false);
  const [newAlbumName, setNewAlbumName] = useState('');
  const [newAlbumDesc, setNewAlbumDesc] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAlbumName.trim() || !onCreateAlbum) return;

    setIsSubmitting(true);
    try {
      await onCreateAlbum(newAlbumName, newAlbumDesc || undefined);
      setNewAlbumName('');
      setNewAlbumDesc('');
      setIsCreating(false);
    } catch (error) {
      console.error('Error creating album:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden sticky top-6">
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Álbumes</h2>
        {onCreateAlbum && !isCreating && (
          <button
            onClick={() => setIsCreating(true)}
            className="p-1.5 text-primary hover:bg-primary/10 rounded-lg transition-colors"
          >
            <Plus className="w-5 h-5" />
          </button>
        )}
      </div>

      {isCreating && (
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <form onSubmit={handleCreate} className="space-y-2">
            <input
              type="text"
              value={newAlbumName}
              onChange={(e) => setNewAlbumName(e.target.value)}
              placeholder="Nombre del álbum"
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
              autoFocus
            />
            <input
              type="text"
              value={newAlbumDesc}
              onChange={(e) => setNewAlbumDesc(e.target.value)}
              placeholder="Descripción (opcional)"
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
            />
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={!newAlbumName.trim() || isSubmitting}
                className="flex-1 px-3 py-1.5 text-sm bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isSubmitting ? 'Creando...' : 'Crear'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsCreating(false);
                  setNewAlbumName('');
                  setNewAlbumDesc('');
                }}
                className="px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-200 rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="p-2">
        {albums.map((album) => (
          <button
            key={album.id}
            onClick={() => onSelectAlbum(String(album.id))}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-left ${
              selectedAlbumId === String(album.id)
                ? 'bg-primary text-white font-medium'
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            <span className="text-sm">{album.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
