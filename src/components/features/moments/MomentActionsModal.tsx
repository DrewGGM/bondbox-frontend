import React, { useState } from 'react';
import { X, Tag,  Users, Trash2 } from 'lucide-react';
import type { Moment, Album } from '@/types/moments.types';
import type { UsersGroupInformation } from '@/types/groups.types';

interface MomentActionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  moment: Moment;
  albums: Album[];
  groupMembers: UsersGroupInformation[];
  onAddTag: (momentId: number, tagName: string) => Promise<void>;
  onTagPerson: (momentId: number, personIds: string[]) => Promise<void>;
  onAddToAlbum: (momentId: number, albumId: number) => Promise<void>;
  onDelete: (momentId: number) => Promise<void>;
}

export const MomentActionsModal: React.FC<MomentActionsModalProps> = ({
  isOpen,
  onClose,
  moment,
  groupMembers,
  onAddTag,
  onTagPerson,
  onDelete,
}) => {
  const [newTag, setNewTag] = useState('');
  const [selectedPeople, setSelectedPeople] = useState<string[]>(
    moment.personas_etiquetadas || []
  );
  const [isAddingTag, setIsAddingTag] = useState(false);
  const [isUpdatingPeople, setIsUpdatingPeople] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  if (!isOpen) return null;

  const handleAddTag = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTag.trim()) return;

    setIsAddingTag(true);
    try {
      await onAddTag(moment.id, newTag.trim());
      setNewTag('');
    } catch (error) {
      console.error('Error adding tag:', error);
    } finally {
      setIsAddingTag(false);
    }
  };

  const handleTogglePerson = (personId: string) => {
    setSelectedPeople((prev) =>
      prev.includes(personId)
        ? prev.filter((id) => id !== personId)
        : [...prev, personId]
    );
  };

  const handleUpdatePeople = async () => {
    setIsUpdatingPeople(true);
    try {
      await onTagPerson(moment.id, selectedPeople);
      onClose();
    } catch (error) {
      console.error('Error updating tagged people:', error);
    } finally {
      setIsUpdatingPeople(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await onDelete(moment.id);
      onClose();
    } catch (error) {
      console.error('Error deleting moment:', error);
      alert('Error al eliminar el momento. Por favor intenta de nuevo.');
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  // Get existing tags for this moment from the moment's etiquetas array
  const momentTags = moment.etiquetas || [];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Editar Momento</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Add Tags Section */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Tag className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-medium text-gray-900">Etiquetas</h3>
            </div>

            {/* Existing tags */}
            {momentTags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {momentTags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {/* Add new tag form */}
            <form onSubmit={handleAddTag} className="flex gap-2">
              <input
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="Agregar etiqueta..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
              />
              <button
                type="submit"
                disabled={!newTag.trim() || isAddingTag}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isAddingTag ? 'Agregando...' : 'Agregar'}
              </button>
            </form>
          </div>

          {/* Add to Album Section */}
          {/* <div>
            <div className="flex items-center gap-2 mb-3">
              <FolderPlus className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-medium text-gray-900">Agregar a Álbum</h3>
            </div>

            {albums.length > 0 ? (
              <div className="flex gap-2">
                <select
                  value={selectedAlbumId?.toString() || ''}
                  onChange={(e) => {
                    const value = e.target.value;
                    setSelectedAlbumId(value ? Number(value) : null);
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                >
                  <option value="">Seleccionar álbum...</option>
                  {albums.map((album, index) => (
                    <option key={`album-${index}`} value={album.id!}>
                      {album.titulo || `Álbum ${album.id}`}
                    </option>
                  ))}
                </select>
                <button
                  onClick={handleAddToAlbum}
                  disabled={!selectedAlbumId || isAddingToAlbum}
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isAddingToAlbum ? 'Agregando...' : 'Agregar'}
                </button>
              </div>
            ) : (
              <p className="text-sm text-gray-500 italic">
                No hay álbumes disponibles. Crea uno primero.
              </p>
            )}
          </div> */}

          {/* Tag People Section */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Users className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-medium text-gray-900">
                Etiquetar Personas
              </h3>
            </div>

            <div className="space-y-2 max-h-48 overflow-y-auto">
              {groupMembers.map((member) => (
                <label
                  key={member.id}
                  className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={selectedPeople.includes(member.id)}
                    onChange={() => handleTogglePerson(member.id)}
                    className="w-4 h-4 text-primary rounded border-gray-300 focus:ring-primary"
                  />
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center text-white text-sm font-semibold">
                    {member.full_name.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-gray-700">{member.full_name}</span>
                </label>
              ))}
            </div>

            <button
              onClick={handleUpdatePeople}
              disabled={isUpdatingPeople}
              className="mt-4 w-full px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isUpdatingPeople ? 'Actualizando...' : 'Actualizar Personas Etiquetadas'}
            </button>
          </div>

          {/* Moment Preview */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-3">Vista Previa</h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-gray-700 mb-3">{moment.descripcion}</p>
              {moment.multimedia && moment.multimedia.length > 0 && (
                <div className="grid grid-cols-2 gap-2">
                  {moment.multimedia.slice(0, 4).map((media, idx) => (
                    <img
                      key={idx}
                      src={media.url}
                      alt={`Preview ${idx + 1}`}
                      className="w-full h-24 object-cover rounded"
                      onError={(e) => {
                        console.error('Image failed to load:', media.url);
                        e.currentTarget.src = 'https://via.placeholder.com/150?text=Error';
                      }}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex justify-between gap-3">
          {/* Delete Button */}
          {!showDeleteConfirm ? (
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              <span>Eliminar</span>
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-700">¿Estás seguro?</span>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="px-3 py-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors text-sm"
              >
                {isDeleting ? 'Eliminando...' : 'Sí, eliminar'}
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                disabled={isDeleting}
                className="px-3 py-1.5 text-gray-600 hover:bg-gray-200 rounded-lg transition-colors text-sm"
              >
                Cancelar
              </button>
            </div>
          )}

          {/* Close Button */}
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
