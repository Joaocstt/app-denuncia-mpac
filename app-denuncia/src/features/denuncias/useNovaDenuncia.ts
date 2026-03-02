import { useState, useEffect, useCallback } from 'react';
import { Alert } from 'react-native';
import * as Location from 'expo-location';
import * as ImagePicker from 'expo-image-picker';
import { Audio } from 'expo-av';
import NetInfo from '@react-native-community/netinfo';
import denunciaService from '../../services/denunciaService';
import syncManager from '../../services/SyncManager';
import { useDeviceId } from '../../hooks/useDeviceId';
import type { CreateDenunciaDTO } from '../../types/denuncia';

export const useNovaDenuncia = (onSuccess: () => void) => {
    const [useLocation, setUseLocation] = useState(true);
    const [locationLoaded, setLocationLoaded] = useState(false);
    const [loadingLocation, setLoadingLocation] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const deviceId = useDeviceId();
    const [coordinates, setCoordinates] = useState<Location.LocationObjectCoords | null>(null);

    const [addressStreet, setAddressStreet] = useState('');
    const [addressNumber, setAddressNumber] = useState('');
    const [addressNeighborhood, setAddressNeighborhood] = useState('');
    const [addressCity, setAddressCity] = useState('');
    const [addressState] = useState('AC');

    const [category, setCategory] = useState('Infraestrutura');
    const [description, setDescription] = useState('');
    const [media, setMedia] = useState<string[]>([]);
    const [recording, setRecording] = useState<Audio.Recording | null>(null);
    const [isTranscribing, setIsTranscribing] = useState(false);

    // Permissões e GPS
    useEffect(() => {
        if (useLocation) {
            (async () => {
                setLoadingLocation(true);
                const { status } = await Location.requestForegroundPermissionsAsync();
                if (status !== 'granted') {
                    Alert.alert('Permissão negada', 'Não podemos acessar sua localização automaticamente.');
                    setUseLocation(false);
                    setLoadingLocation(false);
                    return;
                }

                try {
                    const location = await Location.getCurrentPositionAsync({});
                    setCoordinates(location.coords as any);
                    setLocationLoaded(true);
                } catch (error) {
                    Alert.alert('Erro', 'Não foi possível obter a localização atual.');
                    setUseLocation(false);
                } finally {
                    setLoadingLocation(false);
                }
            })();
        } else {
            setCoordinates(null);
            setLocationLoaded(false);
        }
    }, [useLocation]);

    const handleTakePhoto = async () => {
        const result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 0.8,
        });
        if (!result.canceled) {
            setMedia(prev => [...prev, result.assets[0].uri]);
        }
    };

    const handlePickMedia = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            quality: 0.8,
        });
        if (!result.canceled) {
            setMedia(prev => [...prev, result.assets[0].uri]);
        }
    };

    const startRecording = async () => {
        try {
            const permission = await Audio.requestPermissionsAsync();
            if (permission.status === 'granted') {
                await Audio.setAudioModeAsync({
                    allowsRecordingIOS: true,
                    playsInSilentModeIOS: true,
                });

                const { recording } = await Audio.Recording.createAsync(
                    Audio.RecordingOptionsPresets.HIGH_QUALITY
                );
                setRecording(recording);
            }
        } catch (err) {
            console.error('Failed to start recording', err);
        }
    };

    const stopRecordingAndTranscribe = async () => {
        if (!recording) return;

        try {
            setIsTranscribing(true);
            await recording.stopAndUnloadAsync();
            const uri = recording.getURI();
            setRecording(null);

            if (uri) {
                const file = {
                    uri,
                    name: 'audio.m4a',
                    type: 'audio/m4a',
                } as any;

                const response = await denunciaService.transcribeAudio(file);
                if (response.text) {
                    setDescription(prev => prev ? `${prev} ${response.text}` : response.text);
                }
            }
        } catch (err) {
            Alert.alert('Erro', 'Não foi possível transcrever o áudio.');
        } finally {
            setIsTranscribing(false);
        }
    };

    const handleSubmit = async () => {
        if (!description.trim() || description.length < 10) {
            Alert.alert('Campo Obrigatório', 'A descrição deve ter pelo menos 10 caracteres.');
            return;
        }

        if (useLocation && !coordinates) {
            Alert.alert('Aguarde', 'Obtendo localização GPS...');
            return;
        }

        setIsSubmitting(true);

        try {
            let lat = coordinates?.latitude || null;
            let lng = coordinates?.longitude || null;
            const addressType = useLocation ? 'gps' : 'manual';
            const fullAddress = !useLocation ? `${addressStreet}, ${addressNumber} - ${addressNeighborhood}, ${addressCity}/${addressState}` : '';

            // Tenta geocodificar se for manual
            if (!useLocation && !lat) {
                try {
                    const geocode = await Location.geocodeAsync(fullAddress);
                    if (geocode.length > 0) {
                        lat = geocode[0]!.latitude;
                        lng = geocode[0]!.longitude;
                    }
                } catch (e) { console.log('Geocode skip'); }
            }

            const reportData: CreateDenunciaDTO = {
                description,
                category,
                addressType,
                manualAddress: fullAddress,
                addressStreet: !useLocation ? addressStreet : '' as any,
                addressNumber: !useLocation ? addressNumber : '' as any,
                addressNeighborhood: !useLocation ? addressNeighborhood : '' as any,
                addressCity: !useLocation ? addressCity : '' as any,
                addressState,
                location: lat && lng ? { latitude: lat, longitude: lng } : undefined as any,
                device_id: deviceId || undefined,
            };

            const netInfo = await NetInfo.fetch();

            if (!netInfo.isConnected) {
                const enqueued = await syncManager.enqueueReport(reportData, media);
                if (enqueued) {
                    Alert.alert('Modo Offline', 'Sua denúncia foi salva e será enviada assim que houver internet.');
                    onSuccess();
                }
                return;
            }

            // Preparar arquivos para multipart
            const mediaFiles = media.map(uri => {
                const name = uri.split('/').pop() || 'file.jpg';
                const match = /\.(\w+)$/.exec(name);
                const type = match ? `image/${match[1]}` : `image/jpeg`;
                return { uri, name, type } as any;
            });

            await denunciaService.createDenuncia({ ...reportData, media: mediaFiles });

            Alert.alert('Sucesso', 'Sua denúncia foi enviada com sucesso!');
            onSuccess();
        } catch (error) {
            Alert.alert('Erro', 'Houve um problema ao enviar sua denúncia.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return {
        form: {
            useLocation, setUseLocation,
            description, setDescription,
            category, setCategory,
            media, setMedia,
            addressStreet, setAddressStreet,
            addressNumber, setAddressNumber,
            addressNeighborhood, setAddressNeighborhood,
            addressCity, setAddressCity,
        },
        status: {
            loadingLocation,
            locationLoaded,
            isSubmitting,
            isTranscribing,
            isRecording: !!recording
        },
        actions: {
            handleTakePhoto,
            handlePickMedia,
            startRecording,
            stopRecordingAndTranscribe,
            handleSubmit
        }
    };
};
