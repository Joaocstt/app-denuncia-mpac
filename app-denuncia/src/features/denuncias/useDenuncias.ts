import { useState, useEffect, useCallback } from 'react';
import denunciaService from '../../services/denunciaService';
import { useDeviceId } from '../../hooks/useDeviceId';
import type { Denuncia, DenunciaStatus } from '../../types/denuncia';

export const useDenuncias = () => {
    const [denuncias, setDenuncias] = useState<Denuncia[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const deviceId = useDeviceId();

    const fetchDenuncias = useCallback(async () => {
        if (!deviceId) return;

        try {
            setLoading(true);
            const data = await denunciaService.getMyDenuncias(deviceId);
            setDenuncias(data);
            setError(null);
        } catch (err) {
            setError('Falha ao carregar denúncias. Verifique sua conexão.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [deviceId]);

    useEffect(() => {
        fetchDenuncias();

        // Polling de 30 segundos
        const interval = setInterval(fetchDenuncias, 30000);
        return () => clearInterval(interval);
    }, [fetchDenuncias, deviceId]);

    const filterByStatus = (status: DenunciaStatus | 'Todos') => {
        if (status === 'Todos') return denuncias;

        return denuncias.filter(d => {
            const s = (d.status || '').toLowerCase();
            const target = status.toLowerCase();

            if (target === 'aprovada') return s.includes('aprovad');
            if (target === 'rejeitada') return s.includes('rejeitad');
            if (target === 'resolvida') return s.includes('resolvid') || s.includes('concluí');
            if (target === 'em análise' || target === 'pendente') {
                return s.includes('análise') || s.includes('pendente');
            }
            return s === target;
        });
    };

    return {
        denuncias,
        loading,
        error,
        refreshing: loading, // Alias for Pull-to-refresh
        refresh: fetchDenuncias,
        filterByStatus
    };
};
