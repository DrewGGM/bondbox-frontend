import React, { useState, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { useUser } from '@/hooks/useUser';
import { useMoments } from '@/hooks/useMoments';
import { useGroupStore } from '@/store/groupStore';
import { ErrorMessage } from '@/components/common/ErrorMessage';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import {
  TagsSidebar,
  MomentInput,
  MomentsFeed,
  MomentActionsModal,
  CreateTagModal,
} from '@/components/features/moments';
// import type { UIAlbum } from '@/components/features/moments/AlbumsSidebar';
import type { Moment, Album } from '@/types/moments.types';
import { albumsService } from '@/api/services/albumsService';

export const MomentsPage: React.FC = () => {
  const [selectedAlbumId] = useState<string>('all');
  const [selectedTagId, setSelectedTagId] = useState<string | null>(null);
  const [selectedMoment, setSelectedMoment] = useState<Moment | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreateTagModalOpen, setIsCreateTagModalOpen] = useState(false);
  const [backendAlbums, setBackendAlbums] = useState<Album[]>([]);
  const [albumMomentIds] = useState<number[]>([]);
  const { userInfo, refreshUserInfo } = useUser();
  const selectedGroup = useGroupStore((state) => state.selectedGroup);

  // Derive groupId early so hooks can be used consistently
  const groupId = selectedGroup?.id ?? '';

  // Use moments hook unconditionally (hooks must be called in the same order)
  const {
    moments,
    groupMembers,
    loading,
    error,
    createMoment,
    updateMoment,
    deleteMoment,
    createEtiqueta,
    searchByEtiqueta,
    loadMoments,
    clearError,
  } = useMoments(groupId);

  // Enrich moments with author information from group members
  const enrichedMoments = React.useMemo(() => {
    return moments.map(moment => {
      const author = groupMembers.find(member => member.id === moment.user_id);
      return {
        ...moment,
        autor: author ? {
          id: author.id,
          nombre: author.full_name,
        } : undefined,
      };
    });
  }, [moments, groupMembers]);

  // Derive unique tag names from moments
  const uniqueTagNames = React.useMemo(() => {
    const tagSet = new Set<string>();
    moments.forEach(moment => {
      if (moment.etiquetas && moment.etiquetas.length > 0) {
        moment.etiquetas.forEach(tag => tagSet.add(tag));
      }
    });
    return Array.from(tagSet);
  }, [moments]);

  // Normalize backend albums to ensure they have valid IDs
  const normalizedAlbums = React.useMemo(() => {
    const normalized = backendAlbums
      .filter(album => album.id || album.album_id)
      .map(album => ({
        ...album,
        id: album.id || album.album_id,
        titulo: album.titulo || album.album_titulo,
      }));
    console.log('Normalized albums:', normalized);
    return normalized;
  }, [backendAlbums]);

  // Filter moments based on selected album
  const filteredMoments = React.useMemo(() => {
    if (selectedAlbumId === 'all' || albumMomentIds.length === 0) {
      return enrichedMoments;
    }
    return enrichedMoments.filter(moment => albumMomentIds.includes(moment.id));
  }, [enrichedMoments, selectedAlbumId, albumMomentIds]);


  useEffect(() => {
    refreshUserInfo();
  }, []);

  const loadAlbums = async () => {
    if (!groupId) return [];
    try {
      const albums = await albumsService.list(groupId);
      setBackendAlbums(albums);
      return albums;
    } catch (error) {
      console.error('Error loading albums:', error);
      return [];
    }
  };

  // Load albums when group changes
  useEffect(() => {
    if (groupId) {
      loadAlbums();
    }
  }, [groupId]);

  // Guard: No group selected
  if (!selectedGroup) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
            <p className="text-yellow-800 font-medium">
              No hay un grupo seleccionado
            </p>
            <p className="text-yellow-600 text-sm mt-2">
              Por favor selecciona un grupo desde el Dashboard para ver los momentos
            </p>
          </div>
        </main>
      </div>
    );
  }


  // Transform backend albums to UI albums
  // const albums: UIAlbum[] = [
  //   {
  //     id: 'all',
  //     name: 'Todos los Momentos',
  //     icon: '📸',
  //     isDefault: true,
  //   },
  //   ...backendAlbums
  //     .filter(album => album.id || album.album_id) // Only include albums with valid IDs
  //     .map((album) => ({
  //       id: (album.id || album.album_id)!,
  //       name: album.titulo || album.album_titulo || `Álbum ${album.id || album.album_id}`,
  //     })),
  // ];

  // const handleAlbumSelect = async (albumId: string) => {
  //   setSelectedAlbumId(albumId);
  //   if (albumId === 'all') {
  //     setAlbumMomentIds([]);
  //   } else {
  //     const albums = await loadAlbums();
  //     const album = albums.find(a => String(a.id || a.album_id) === albumId);
  //     if (album && album.momentos && album.momentos.length > 0) {
  //       const momentIds = album.momentos
  //         .map(m => (m as any).id_momento || m.id)
  //         .filter((id): id is number => id !== undefined);
  //       setAlbumMomentIds(momentIds);
  //     } else {
  //       setAlbumMomentIds([]);
  //     }
  //   }
  // };

  const handleTagSelect = async (tagName: string | null) => {
    setSelectedTagId(tagName);
    if (tagName) {
      // Filter moments by tag
      await searchByEtiqueta(tagName);
    } else {
      // Show all moments
      await loadMoments();
    }
  };

  const handleCreateGlobalTag = async () => {
    // Open modal to select moment and create tag
    setIsCreateTagModalOpen(true);
  };

  const handleCreateTagWithMoment = async (momentId: number, tagName: string) => {
    try {
      await createEtiqueta({
        id_momento: String(momentId),
        nombre_etiqueta: tagName,
        group_id: groupId,
      });
      // Reload moments and etiquetas to show the new tag
      await loadMoments();
    } catch (error) {
      console.error('Error creating tag:', error);
      throw error;
    }
  };

  const handleShareMoment = async (title: string, description: string, imageUrls: string[]) => {
    if (!title.trim() && !description.trim() && imageUrls.length === 0) return;

    try {
      // Step 1: Create the moment
      const newMoment = await createMoment({
        titulo: title.trim() || `Momento de ${userInfo?.full_name || 'Usuario'}`,
        descripcion: description,
        group_id: groupId,
      });

      // Step 2: Add multimedia if there are images
      if (imageUrls.length > 0 && newMoment) {
        const { momentService } = await import('@/api/services/momentsService');
        for (const url of imageUrls) {
          await momentService.addMultimedia({
            url,
            tipo: 'foto',
            momento_id: newMoment.id,
            group_id: groupId,
          });
        }
      }

      // Step 3: Reload moments to show the new one with multimedia
      await loadMoments();
    } catch (err) {
      // Error manejado en el hook
      console.error('Error al crear momento:', err);
    }
  };

  const handleLike = async (momentId: number, isLiked: boolean) => {
    // Implementar funcionalidad de like cuando el backend la proporcione
    console.log('Like clicked:', momentId, isLiked);
  };

  const handleEditMoment = (moment: Moment) => {
    setSelectedMoment(moment);
    setIsModalOpen(true);
  };

  const handleAddTag = async (momentId: number, tagName: string) => {
    try {
      await createEtiqueta({
        id_momento: String(momentId),
        nombre_etiqueta: tagName,
        group_id: groupId,
      });
      // Reload moments and etiquetas
      await loadMoments();
    } catch (error) {
      console.error('Error adding tag:', error);
      throw error;
    }
  };

  const handleTagPerson = async (momentId: number, personIds: string[]) => {
    try {
      await updateMoment(momentId, {
        personas_etiquetadas: personIds,
      });
      // Reload moments
      await loadMoments();
    } catch (error) {
      console.error('Error tagging people:', error);
      throw error;
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedMoment(null);
  };

  // const handleCreateAlbum = async (name: string, description?: string) => {
  //   try {
  //     await albumsService.create({
  //       titulo: name,
  //       descripcion: description,
  //       group_id: groupId,
  //     });
  //     await loadAlbums();
  //   } catch (error) {
  //     console.error('Error creating album:', error);
  //     throw error;
  //   }
  // };

  const handleAddToAlbum = async (momentId: number, albumId: number) => {
    try {
      console.log('Adding to album - momentId:', momentId, 'albumId:', albumId);
      await albumsService.addMoment({
        id_album: albumId,
        id_momento: momentId,
        group_id: groupId,
      });
      // Reload albums to update moment count
      await loadAlbums();
      // Reload moments to reflect album association
      await loadMoments();
      console.log('Successfully added to album');
    } catch (error) {
      console.error('Error adding to album:', error);
      throw error;
    }
  };

  const handleDeleteMoment = async (momentId: number) => {
    try {
      await deleteMoment(momentId);
    } catch (error) {
      console.error('Error deleting moment:', error);
      throw error;
    }
  };

  // Quick actions handlers (for inline actions on cards)
  const handleQuickAddTag = async (momentId: number, tagName: string) => {
    try {
      await createEtiqueta({
        id_momento: String(momentId),
        nombre_etiqueta: tagName,
        group_id: groupId,
      });
      // Reload moments to show updated tags
      await loadMoments();
    } catch (error) {
      console.error('Error adding tag:', error);
      throw error;
    }
  };

  const handleQuickAddToAlbum = async (momentId: number, albumId: number) => {
    try {
      await albumsService.addMoment({
        id_album: albumId,
        id_momento: momentId,
        group_id: groupId,
      });
      // Reload albums to update moment count (this will refresh the filter automatically)
      await loadAlbums();
      // Reload moments to reflect album association
      await loadMoments();
    } catch (error) {
      console.error('Error adding to album:', error);
      throw error;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        {/* Error Display */}
        {error && (
          <div className="mb-6">
            <ErrorMessage message={error} onDismiss={clearError} />
          </div>
        )}

        <div className="flex flex-col md:flex-row gap-6">
          {/* Tags Sidebar */}
          <div className="w-full md:w-64 flex-shrink-0 space-y-4">
            {/* <AlbumsSidebar
              albums={albums}
              selectedAlbumId={selectedAlbumId}
              onSelectAlbum={handleAlbumSelect}
              onCreateAlbum={handleCreateAlbum}
            /> */}
            <TagsSidebar
              tags={uniqueTagNames}
              selectedTagId={selectedTagId}
              onSelectTag={handleTagSelect}
              onCreateTag={handleCreateGlobalTag}
            />
          </div>

          {/* Main Content */}
          <div className="flex-1 max-w-2xl mx-auto md:mx-0">
            <MomentInput
              onShare={handleShareMoment}
              userName={userInfo?.full_name || 'Usuario'}
            />

            {loading ? (
              <div className="flex justify-center py-12">
                <LoadingSpinner />
              </div>
            ) : (
              <MomentsFeed
                moments={filteredMoments}
                onLike={handleLike}
                onEdit={handleEditMoment}
                onQuickAddTag={handleQuickAddTag}
                onQuickAddToAlbum={handleQuickAddToAlbum}
                albums={normalizedAlbums}
              />
            )}
          </div>
        </div>
      </main>

      {/* Moment Actions Modal */}
      {selectedMoment && (
        <MomentActionsModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          moment={selectedMoment}
          albums={normalizedAlbums}
          groupMembers={groupMembers}
          onAddTag={handleAddTag}
          onTagPerson={handleTagPerson}
          onAddToAlbum={handleAddToAlbum}
          onDelete={handleDeleteMoment}
        />
      )}

      {/* Create Tag Modal */}
      <CreateTagModal
        isOpen={isCreateTagModalOpen}
        onClose={() => setIsCreateTagModalOpen(false)}
        moments={enrichedMoments}
        onCreateTag={handleCreateTagWithMoment}
      />
    </div>
  );
};