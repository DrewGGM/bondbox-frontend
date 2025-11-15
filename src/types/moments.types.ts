// Moment entity (matches backend)
export interface Moment {
  id: number;
  titulo: string;
  descripcion: string;
  fecha_creacion: string;
  user_id: string;
  group_id: string;
  autor?: {
    id: string;
    nombre: string;
    avatar?: string;
  };
  multimedia?: Array<{
    url: string;
    tipo: 'foto' | 'video';
  }>;
  etiquetas?: string[];
  comentarios?: any[];
  personas_etiquetadas?: string[];
  likes_count?: number;
  comentarios_count?: number;
  is_liked_by_user?: boolean;
}

// Request types
export interface CreateMomentRequest {
  titulo: string;
  descripcion: string;
  group_id: string;
}

export interface UpdateMomentRequest {
  titulo?: string;
  descripcion?: string;
  personas_etiquetadas?: string[];
}

export interface AddMultimediaRequest {
  url: string;
  tipo: 'foto' | 'video';
  usuario?: string;
  momento_id: number;
  group_id: string;
}

// Response types
export interface MomentsResponse {
  momentos: Moment[];
  count: number;
}

export interface MomentResponse {
  momento: Moment;
}

  // Etiqueta entity (matches backend)
export interface Etiqueta {
  id: string;
  id_momento: string;
  nombre_etiqueta: string;
  group_id: string;
  created_at?: string;
  updated_at?: string;
}

// Request types para etiquetas
export interface CreateEtiquetaRequest {
  id_momento: string;
  nombre_etiqueta: string;
  group_id: string;
}

// Response types para etiquetas
export interface EtiquetasResponse {
  etiquetas: Etiqueta[];
  count: number;
}

export interface EtiquetasBusquedaResponse {
  momentos: Moment[];
  count: number;
}

// Additional types from FamilyBinnacleService
export interface Momento {
  id?: number;
  titulo: string;
  descripcion?: string;
  fecha_creacion?: string;
  user_id?: string;
  group_id: string;
  multimedia?: Multimedia[];
  etiquetas?: string[];
  comentarios?: Comentario[];
  likes?: number;
}

export interface Album {
  id?: number;
  album_id?: number;
  album_titulo?: string;
  titulo?: string;
  album_descripcion?: string;
  descripcion?: string;
  fecha_creacion?: string;
  group_id: string;
  momentos?: Momento[];
}

export interface Multimedia {
  id?: number;
  url: string;
  url_archivo?: string;
  tipo: 'foto' | 'video';
  usuario?: string;
  momento_id?: number;
  id_momento?: number;
}

export interface Comentario {
  id: number;
  contenido?: string;
  content?: string;
  fecha?: string;
  created_at?: string;
}

export interface AlbumMomento {
  id_album: number;
  id_momento: number;
  group_id: string;
}