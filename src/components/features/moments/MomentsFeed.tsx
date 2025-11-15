import React from 'react';
import { MomentCard } from './MomentCard';
import type { Moment, Album } from '@/types/moments.types';

interface MomentsFeedProps {
  moments: Moment[];
  onLike?: (momentId: number, isLiked: boolean) => void;
  onEdit?: (moment: Moment) => void;
  onQuickAddTag?: (momentId: number, tagName: string) => Promise<void>;
  onQuickAddToAlbum?: (momentId: number, albumId: number) => Promise<void>;
  albums?: Album[];
}

export const MomentsFeed: React.FC<MomentsFeedProps> = ({
  moments,
  onLike,
  onEdit,
  onQuickAddTag,
  onQuickAddToAlbum,
  albums,
}) => {
  if (moments.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
        <p className="text-gray-500">No hay momentos para mostrar</p>
        <p className="text-sm text-gray-400 mt-1">
          Comienza compartiendo tus recuerdos familiares
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {moments.map((moment) => (
        <MomentCard
          key={moment.id}
          moment={moment}
          onLike={onLike}
          onEdit={onEdit}
          onQuickAddTag={onQuickAddTag}
          onQuickAddToAlbum={onQuickAddToAlbum}
          albums={albums}
        />
      ))}
    </div>
  );
};
