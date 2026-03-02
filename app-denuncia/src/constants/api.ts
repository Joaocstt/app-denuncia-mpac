export const API_CONFIG = {
    BASE_URL: process.env.EXPO_PUBLIC_API_URL || '',
    TIMEOUT: 10000,
    HEADERS: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-API-Token': process.env.EXPO_PUBLIC_API_TOKEN || '',
    },
};

export const ENDPOINTS = {
    DENUNCIAS: '/denuncias',
    TRANSCRIBE: '/denuncias/transcribe',
    MY_REPORTS: '/denuncias/minhas',
    MAP_REPORTS: '/denuncias/mapa',
};
