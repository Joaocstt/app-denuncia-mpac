import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';
import { API_CONFIG } from '../constants/api';

const apiClient: AxiosInstance = axios.create({
    baseURL: API_CONFIG.BASE_URL,
    timeout: API_CONFIG.TIMEOUT,
    headers: API_CONFIG.HEADERS,
});

// Request Interceptor
apiClient.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        // Aqui poderíamos adicionar lógica de Auth dinâmica (Bearer Token) no futuro
        return config;
    },
    (error: AxiosError) => {
        return Promise.reject(error);
    }
);

// Response Interceptor
apiClient.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
        const message = error.response?.data || error.message;
        console.error('[API Error]:', message);

        // Tratamento de erro centralizado
        if (error.response?.status === 401) {
            console.warn('Unauthorized access - potential invalid token');
        }

        return Promise.reject(error);
    }
);

export default apiClient;
