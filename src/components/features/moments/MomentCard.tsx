import React, { useState } from 'react';
import { Heart, MessageCircle, MoreHorizontal, Tag } from 'lucide-react';
import type { Moment, Album } from '@/types/moments.types';

interface MomentCardProps {
  moment: Moment;
  onLike?: (momentId: number, isLiked: boolean) => void;
  onEdit?: (moment: Moment) => void;
  onQuickAddTag?: (momentId: number, tagName: string) => Promise<void>;
  onQuickAddToAlbum?: (momentId: number, albumId: number) => Promise<void>;
  albums?: Album[];
}

export const MomentCard: React.FC<MomentCardProps> = ({
  moment,
  onLike,
  onEdit,
  onQuickAddTag,
}) => {
  const [showTagInput, setShowTagInput] = useState(false);
  const [newTag, setNewTag] = useState('');
  const [isAddingTag, setIsAddingTag] = useState(false);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };
    return date.toLocaleDateString('es-ES', options);
  };

  const handleLikeClick = () => {
    if (onLike) {
      onLike(moment.id, moment.is_liked_by_user || false);
    }
  };

  const handleQuickAddTag = async () => {
    if (!newTag.trim() || !onQuickAddTag) return;

    setIsAddingTag(true);
    try {
      await onQuickAddTag(moment.id, newTag.trim());
      setNewTag('');
      setShowTagInput(false);
    } catch (error) {
      console.error('Error adding tag:', error);
    } finally {
      setIsAddingTag(false);
    }
  };

  const authorName = moment.autor?.nombre || 'Usuario';

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="p-4 flex items-center gap-3">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center text-white font-semibold flex-shrink-0">
          {authorName.charAt(0).toUpperCase()}
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900">{authorName}</h3>
          <p className="text-sm text-gray-500">{formatDate(moment.fecha_creacion)}</p>
        </div>
        {onEdit && (
          <button
            onClick={() => onEdit(moment)}
            className="text-gray-400 hover:text-gray-600 transition-colors p-2"
          >
            <MoreHorizontal className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Content */}
      {moment.descripcion && (
        <div className="px-4 pb-3">
          <p className="text-gray-700 leading-relaxed">{moment.descripcion}</p>
        </div>
      )}

      {/* Images */}
      {moment.multimedia && moment.multimedia.length > 0 && (
        <div
          className={`grid gap-1 ${
            moment.multimedia.length === 1
              ? 'grid-cols-1'
              : moment.multimedia.length === 2
                ? 'grid-cols-2'
                : 'grid-cols-2'
          }`}
        >
          {moment.multimedia.map((media, index) => (
            <div
              key={index}
              className={`relative ${moment.multimedia!.length === 1 ? 'aspect-[16/10]' : 'aspect-square'} overflow-hidden`}
            >
              <img
                src={media.url}
                alt={`Momento ${index + 1}`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  console.error('Failed to load image:', media.url);
                  e.currentTarget.src = 'https://via.placeholder.com/400x300?text=Imagen+no+disponible';
                }}
              />
            </div>
          ))}
        </div>
      )}

      {/* Tags */}
      {moment.etiquetas && moment.etiquetas.length > 0 && (
        <div className="px-4 pt-3 pb-2">
          <div className="flex flex-wrap gap-2">
            {moment.etiquetas.map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center px-2.5 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Tagged People */}
      {moment.personas_etiquetadas && moment.personas_etiquetadas.length > 0 && (
        <div className="px-4 pb-2">
          <p className="text-sm text-gray-600">
            <span className="font-medium">Con:</span>{' '}
            {moment.personas_etiquetadas.join(', ')}
          </p>
        </div>
      )}

      {/* Engagement (Likes & Comments) */}
      <div className="px-4 py-3 border-t border-gray-100">
        <div className="flex items-center gap-4">
          <button
            onClick={handleLikeClick}
            className={`flex items-center gap-1.5 transition-colors ${
              moment.is_liked_by_user
                ? 'text-red-500'
                : 'text-gray-600 hover:text-red-500'
            }`}
          >
            <Heart
              className={`w-5 h-5 ${moment.is_liked_by_user ? 'fill-current' : ''}`}
            />
            <span className="text-sm font-medium">{moment.likes_count || 0}</span>
          </button>
          <button className="flex items-center gap-1.5 text-gray-600 hover:text-primary transition-colors">
            <MessageCircle className="w-5 h-5" />
            <span className="text-sm font-medium">{moment.comentarios_count || 0}</span>
          </button>

          {/* Quick Actions */}
          {onQuickAddTag && (
            <button
              onClick={() => setShowTagInput(!showTagInput)}
              className="flex items-center gap-1.5 text-gray-600 hover:text-primary transition-colors ml-auto"
              title="Agregar etiqueta"
            >
              <Tag className="w-5 h-5" />
            </button>
          )}
          {/* {onQuickAddToAlbum && albums.length > 0 && (
            <button
              onClick={() => setShowAlbumSelect(!showAlbumSelect)}
              className="flex items-center gap-1.5 text-gray-600 hover:text-primary transition-colors"
              title="Agregar a álbum"
            >
              <FolderPlus className="w-5 h-5" />
            </button>
          )} */}
        </div>

        {/* Quick Tag Input */}
        {showTagInput && onQuickAddTag && (
          <div className="mt-3 flex gap-2">
            <input
              type="text"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleQuickAddTag();
                }
              }}
              placeholder="Nombre de etiqueta..."
              className="flex-1 px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
              autoFocus
            />
            <button
              onClick={handleQuickAddTag}
              disabled={!newTag.trim() || isAddingTag}
              className="px-3 py-1.5 text-sm bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isAddingTag ? '...' : 'Agregar'}
            </button>
            <button
              onClick={() => {
                setShowTagInput(false);
                setNewTag('');
              }}
              className="px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Cancelar
            </button>
          </div>
        )}

        {/* Quick Album Select */}
        {/* {showAlbumSelect && onQuickAddToAlbum && (
          <div className="mt-3 flex gap-2">
            <select
              value={selectedAlbumId?.toString() || ''}
              onChange={(e) => {
                const value = e.target.value;
                setSelectedAlbumId(value ? Number(value) : null);
              }}
              className="flex-1 px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
              autoFocus
            >
              <option value="">Seleccionar álbum...</option>
              {albums.map((album, index) => (
                <option key={`album-${index}`} value={album.id!}>
                  {album.titulo || `Álbum ${album.id}`}
                </option>
              ))}
            </select>
            <button
              onClick={handleQuickAddToAlbum}
              disabled={!selectedAlbumId || isAddingToAlbum}
              className="px-3 py-1.5 text-sm bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isAddingToAlbum ? '...' : 'Agregar'}
            </button>
            <button
              onClick={() => {
                setShowAlbumSelect(false);
                setSelectedAlbumId(null);
              }}
              className="px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Cancelar
            </button>
          </div>
        )} */}
      </div>
    </div>
  );
};
