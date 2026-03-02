import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const DEVICE_ID_KEY = '@device_id';

export const useDeviceId = () => {
    const [deviceId, setDeviceId] = useState<string | null>(null);

    useEffect(() => {
        const loadDeviceId = async () => {
            try {
                let id = await AsyncStorage.getItem(DEVICE_ID_KEY);

                if (!id) {
                    // Generates a simple UUID-like string
                    id = 'device_' + Math.random().toString(36).substring(2, 15) + '_' + Date.now().toString(36);
                    await AsyncStorage.setItem(DEVICE_ID_KEY, id);
                }

                setDeviceId(id);
            } catch (error) {
                console.error('Error loading device ID:', error);
            }
        };

        loadDeviceId();
    }, []);

    return deviceId;
};
