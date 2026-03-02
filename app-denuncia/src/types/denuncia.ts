export interface Location {
    latitude: number;
    longitude: number;
    latitudeDelta?: number;
    longitudeDelta?: number;
}

export type DenunciaStatus = 'em análise' | 'aprovada' | 'rejeitada' | 'resolvida';

export interface Denuncia {
    id: string | number;
    description: string;
    category: string;
    status: DenunciaStatus;
    device_id?: string;
    latitude: string | number | null;
    longitude: string | number | null;
    mediaUrls: string[];
    addressType?: 'gps' | 'manual';
    manualAddress?: string;
    addressStreet?: string;
    addressNumber?: string;
    addressNeighborhood?: string;
    addressCity?: string;
    addressState?: string;
    createdAt?: string;
    created_at?: string; // Compatibility with backend
    updatedAt?: string;
    updated_at?: string;
}

export interface CreateDenunciaDTO {
    description: string;
    category: string;
    device_id?: string;
    location?: string | Location; // JSON string or object
    media?: any[]; // Files to be uploaded
    addressType?: string;
    manualAddress?: string;
    addressStreet?: string;
    addressNumber?: string;
    addressNeighborhood?: string;
    addressCity?: string;
    addressState?: string;
}
