import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, ActivityIndicator, Text, Modal, TouchableOpacity, ScrollView as RNScrollView } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import MapView, { Marker, Callout, PROVIDER_GOOGLE } from 'react-native-maps';
import { theme } from '../../theme/theme';
import { Header } from '../../components/Header';
import { MaterialIcons } from '@expo/vector-icons';
import denunciaService from '../../services/denunciaService';
import { useDeviceId } from '../../hooks/useDeviceId';
import type { Denuncia } from '../../types/denuncia';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { MapaStackParamList } from '../../types/navigation';

type NavigationProp = NativeStackNavigationProp<MapaStackParamList, 'Mapa'>;

interface Props {
    navigation: NavigationProp;
}

const INITIAL_REGION = {
    latitude: -9.975382,
    longitude: -67.810531,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
};

const getStatusColor = (status?: string) => {
    const s = (status || '').toLowerCase();
    if (s.includes('aprovad')) return '#4CAF50';
    if (s.includes('rejeitad')) return '#F44336';
    if (s.includes('pendente') || s.includes('análise')) return '#FF9800';
    if (s.includes('resolvid') || s.includes('concluí')) return '#2196F3';
    return '#607D8B';
};

export default function MapaScreen({ navigation }: Props) {
    const [denuncias, setDenuncias] = useState<Denuncia[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedDenuncia, setSelectedDenuncia] = useState<Denuncia | null>(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState('Todas');
    const deviceId = useDeviceId();
    const isOwner = selectedDenuncia?.device_id === deviceId;

    const categories = ['Todas', ...new Set(denuncias.map(d => d.category))];
    const filteredDenuncias = selectedCategory === 'Todas'
        ? denuncias
        : denuncias.filter(d => d.category === selectedCategory);

    const fetchMarkers = useCallback(async () => {
        try {
            const data = await denunciaService.getMapDenuncias();
            setDenuncias(data);
        } catch (error) {
            console.error("Erro ao buscar marcadores: ", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useFocusEffect(
        useCallback(() => {
            fetchMarkers();
        }, [fetchMarkers])
    );

    const handleMarkerPress = (denuncia: Denuncia) => {
        setSelectedDenuncia(denuncia);
        setModalVisible(true);
    };

    return (
        <View style={styles.container}>
            <Header title="Mapa de Ocorrências" />

            {/* Filtros de Categoria */}
            <View style={styles.filterContainer}>
                <RNScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
                    {categories.map(category => (
                        <TouchableOpacity
                            key={category}
                            style={[
                                styles.filterPill,
                                selectedCategory === category && styles.filterPillActive
                            ]}
                            onPress={() => setSelectedCategory(category)}
                        >
                            <Text style={[
                                styles.filterText,
                                selectedCategory === category && styles.filterTextActive
                            ]}>
                                {category}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </RNScrollView>
            </View>

            <View style={styles.mapContainer}>
                {loading ? (
                    <View style={styles.loadingWrapper}>
                        <ActivityIndicator size="large" color={theme.colors.primary} />
                    </View>
                ) : (
                    <MapView
                        provider={PROVIDER_GOOGLE}
                        style={styles.map}
                        initialRegion={INITIAL_REGION}
                    >
                        {filteredDenuncias.map((item) => (
                            <Marker
                                key={item.id}
                                coordinate={{
                                    latitude: Number(item.latitude),
                                    longitude: Number(item.longitude),
                                }}
                                pinColor={theme.colors.primary}
                                onPress={() => handleMarkerPress(item)}
                            >
                                <Callout tooltip>
                                    <View />
                                </Callout>
                            </Marker>
                        ))}
                    </MapView>
                )}
            </View>

            {/* Modal de Detalhes */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <View>
                                <Text style={styles.modalTitle}>{selectedDenuncia?.category || 'Detalhes'}</Text>
                                {isOwner && (
                                    <View style={styles.ownerBadge}>
                                        <Text style={styles.ownerBadgeText}>Minha Ocorrência</Text>
                                    </View>
                                )}
                            </View>
                            <TouchableOpacity onPress={() => setModalVisible(false)}>
                                <MaterialIcons name="close" size={24} color={theme.colors.textLight} />
                            </TouchableOpacity>
                        </View>

                        <RNScrollView style={styles.modalBody}>
                            <Text style={styles.modalDescription}>{selectedDenuncia?.description}</Text>

                            <View style={styles.modalInfoRow}>
                                <MaterialIcons name="location-on" size={16} color={theme.colors.primary} />
                                <Text style={styles.modalInfoText}>
                                    {selectedDenuncia?.manualAddress || 'Localização via GPS'}
                                </Text>
                            </View>

                            <View style={styles.modalInfoRow}>
                                <MaterialIcons name="event" size={16} color={theme.colors.textLight} />
                                <Text style={styles.modalInfoText}>
                                    {selectedDenuncia?.created_at ? new Date(selectedDenuncia.created_at).toLocaleDateString('pt-BR') : 'Data não disponível'}
                                </Text>
                            </View>

                            {isOwner && (
                                <View style={[styles.modalInfoRow, { marginTop: 8 }]}>
                                    <View style={[styles.statusIndicator, { backgroundColor: getStatusColor(selectedDenuncia?.status) }]} />
                                    <Text style={[styles.modalInfoText, { fontFamily: 'Inter_700Bold', color: getStatusColor(selectedDenuncia?.status) }]}>
                                        Status: {selectedDenuncia?.status?.toUpperCase()}
                                    </Text>
                                </View>
                            )}
                        </RNScrollView>

                        <TouchableOpacity
                            style={styles.fullDetailsButton}
                            onPress={() => {
                                setModalVisible(false);
                                if (selectedDenuncia) {
                                    navigation.navigate('DenunciaDetalhes', { denuncia: selectedDenuncia });
                                }
                            }}
                        >
                            <Text style={styles.fullDetailsButtonText}>Ver Detalhes Completos</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    mapContainer: {
        flex: 1,
    },
    filterContainer: {
        backgroundColor: theme.colors.white,
        paddingVertical: theme.spacing.sm,
        borderBottomWidth: 1,
        borderBottomColor: '#EEE',
    },
    filterScroll: {
        paddingHorizontal: theme.spacing.md,
    },
    filterPill: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: '#F0F2F5',
        marginRight: 8,
        borderWidth: 1,
        borderColor: 'transparent',
    },
    filterPillActive: {
        backgroundColor: 'rgba(156, 43, 39, 0.1)',
        borderColor: theme.colors.primary,
    },
    filterText: {
        fontFamily: 'Inter_600SemiBold',
        fontSize: 12,
        color: theme.colors.textLight,
    },
    filterTextActive: {
        color: theme.colors.primary,
    },
    map: {
        ...StyleSheet.absoluteFillObject,
    },
    loadingWrapper: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.7)',
        zIndex: 1,
    },
    callout: {
        width: 200,
        padding: 5,
    },
    calloutTitle: {
        fontFamily: 'Inter_700Bold',
        fontSize: 14,
        color: theme.colors.primary,
        marginBottom: 2,
    },
    calloutDesc: {
        fontFamily: 'Inter_400Regular',
        fontSize: 12,
        color: theme.colors.text,
        marginBottom: 4,
    },
    calloutLink: {
        fontFamily: 'Inter_600SemiBold',
        fontSize: 11,
        color: theme.colors.primary,
        textDecorationLine: 'underline',
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: {
        backgroundColor: theme.colors.white,
        borderTopLeftRadius: theme.borderRadius.lg,
        borderTopRightRadius: theme.borderRadius.lg,
        padding: theme.spacing.lg,
        maxHeight: '50%',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: theme.spacing.md,
    },
    modalTitle: {
        fontFamily: 'Inter_700Bold',
        fontSize: 18,
        color: theme.colors.primary,
    },
    modalBody: {
        marginBottom: theme.spacing.lg,
    },
    modalDescription: {
        fontFamily: 'Inter_400Regular',
        fontSize: 14,
        color: theme.colors.text,
        lineHeight: 20,
        marginBottom: theme.spacing.md,
    },
    modalInfoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    modalInfoText: {
        fontFamily: 'Inter_400Regular',
        fontSize: 12,
        color: theme.colors.textLight,
        marginLeft: 8,
    },
    fullDetailsButton: {
        backgroundColor: theme.colors.primary,
        borderRadius: theme.borderRadius.md,
        padding: theme.spacing.md,
        alignItems: 'center',
    },
    fullDetailsButtonText: {
        fontFamily: 'Inter_700Bold',
        fontSize: 14,
        color: theme.colors.white,
    },
    ownerBadge: {
        backgroundColor: '#E8F5E9',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 4,
        marginTop: 4,
        alignSelf: 'flex-start',
    },
    ownerBadgeText: {
        fontFamily: 'Inter_600SemiBold',
        fontSize: 10,
        color: '#2E7D32',
        textTransform: 'uppercase',
    },
    statusIndicator: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginRight: 6,
    }
});
