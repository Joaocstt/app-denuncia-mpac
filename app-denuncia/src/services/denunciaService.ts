import apiClient from '../api/apiClient';
import { ENDPOINTS } from '../constants/api';
import type { Denuncia, CreateDenunciaDTO } from '../types/denuncia';

class DenunciaService {
    /**
     * Busca todas as denúncias (Geral/Minhas).
     */
    async getMyDenuncias(deviceId?: string): Promise<Denuncia[]> {
        const url = deviceId ? `${ENDPOINTS.MY_REPORTS}?device_id=${deviceId}` : ENDPOINTS.MY_REPORTS;
        const response = await apiClient.get<Denuncia[]>(url);
        return response.data;
    }

    /**
     * Busca denúncias filtradas para o mapa.
     */
    async getMapDenuncias(): Promise<Denuncia[]> {
        const response = await apiClient.get<Denuncia[]>(ENDPOINTS.MAP_REPORTS);
        return response.data;
    }

    /**
     * Envia uma nova denúncia para o servidor.
     * Suporta multipart/form-data para mídias.
     */
    async createDenuncia(data: CreateDenunciaDTO): Promise<Denuncia> {
        const formData = new FormData();

        // Adiciona campos simples
        Object.entries(data).forEach(([key, value]) => {
            if (key !== 'media' && value !== undefined && value !== null) {
                if (typeof value === 'object') {
                    formData.append(key, JSON.stringify(value));
                } else {
                    formData.append(key, String(value));
                }
            }
        });

        // Adiciona mídias se existirem
        if (data.media && Array.isArray(data.media)) {
            data.media.forEach((file) => {
                formData.append('media', file);
            });
        }

        const response = await apiClient.post<Denuncia>(ENDPOINTS.DENUNCIAS, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        return response.data;
    }

    /**
     * Simula a transcrição de um áudio.
     */
    async transcribeAudio(audioFile: any): Promise<{ text: string; status: string }> {
        const formData = new FormData();
        formData.append('audio', audioFile);

        const response = await apiClient.post(ENDPOINTS.TRANSCRIBE, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        return response.data;
    }
}

export default new DenunciaService();
