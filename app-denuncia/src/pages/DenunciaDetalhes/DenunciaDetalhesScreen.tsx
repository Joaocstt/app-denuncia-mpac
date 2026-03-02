import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Dimensions } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { theme } from '../../theme/theme';
import { Header } from '../../components/Header';
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import { useDeviceId } from '../../hooks/useDeviceId';
import type { RootStackParamList, InicioStackParamList, DenunciasStackParamList, MapaStackParamList } from '../../types/navigation';

type Props = NativeStackScreenProps<
    InicioStackParamList & DenunciasStackParamList & MapaStackParamList,
    'DenunciaDetalhes'
>;

const { width } = Dimensions.get('window');

const STATUS_STEPS = [
    { label: 'Enviada', icon: 'send' as const, color: '#607D8B' },
    { label: 'Análise', icon: 'search' as const, color: '#FF9800' },
    { label: 'Processo', icon: 'gavel' as const, color: '#2196F3' },
    { label: 'Concluída', icon: 'check-circle' as const, color: '#4CAF50' }
] as const;

export default function DenunciaDetalhesScreen({ route, navigation }: Props) {
    const { denuncia } = route.params;
    const deviceId = useDeviceId();
    const isOwner = denuncia.device_id === deviceId;

    const getStatusIndex = (status: string) => {
        const s = status?.toLowerCase() || '';
        if (s.includes('concluí')) return 3;
        if (s.includes('aprovad')) return 2;
        if (s.includes('análise') || s.includes('pendente')) return 1;
        return 0;
    };

    const currentIndex = getStatusIndex(denuncia.status);

    const formatDate = (dateString?: string) => {
        if (!dateString) return 'Data não disponível';
        return new Date(dateString).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: 'long',
            year: 'numeric'
        });
    };

    return (
        <View style={styles.container}>
            <Header title="DETALHES DA DENÚNCIA" />

            <ScrollView contentContainerStyle={styles.content}>
                {/* Status Bar */}
                <View style={styles.statusSection}>
                    <Text style={styles.sectionTitle}>Status do Processo</Text>
                    <View style={styles.statusBarContainer}>
                        {STATUS_STEPS.map((step, index) => {
                            const isPast = index <= currentIndex;
                            const isCurrent = index === currentIndex;

                            return (
                                <View key={step.label} style={styles.stepWrapper}>
                                    <View style={[
                                        styles.stepCircle,
                                        isPast ? { backgroundColor: step.color } : styles.stepCircleInactive
                                    ]}>
                                        <MaterialIcons
                                            name={step.icon}
                                            size={20}
                                            color={isPast ? theme.colors.white : theme.colors.textLight}
                                        />
                                    </View>
                                    <Text style={[
                                        styles.stepLabel,
                                        isCurrent && { color: step.color, fontWeight: '700' }
                                    ]}>
                                        {step.label}
                                    </Text>
                                    {index < STATUS_STEPS.length - 1 && (
                                        <View style={[
                                            styles.stepLine,
                                            index < currentIndex ? { backgroundColor: step.color } : styles.stepLineInactive
                                        ]} />
                                    )}
                                </View>
                            );
                        })}
                    </View>
                </View>

                {/* Main Content */}
                <View style={styles.infoCard}>
                    <View style={styles.categoryBadge}>
                        <Text style={styles.categoryText}>{denuncia.category || 'Geral'}</Text>
                    </View>

                    <Text style={styles.dateText}>{formatDate(denuncia.createdAt || denuncia.created_at)}</Text>

                    <Text style={styles.descriptionTitle}>Descrição:</Text>
                    <Text style={styles.descriptionText}>{denuncia.description}</Text>

                    {denuncia.manualAddress && (
                        <View style={styles.addressBox}>
                            <MaterialIcons name="location-on" size={18} color={theme.colors.primary} />
                            <Text style={styles.addressText}>{denuncia.manualAddress}</Text>
                        </View>
                    )}
                </View>

                {/* Media Gallery */}
                {denuncia.mediaUrls && denuncia.mediaUrls.length > 0 && (
                    <View style={styles.mediaSection}>
                        <Text style={styles.sectionTitle}>Evidências Anexadas</Text>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.mediaScroll}>
                            {denuncia.mediaUrls.map((uri, index) => (
                                <View key={index} style={styles.mediaFrame}>
                                    <Image source={{ uri }} style={styles.mediaImage} resizeMode="cover" />
                                </View>
                            ))}
                        </ScrollView>
                    </View>
                )}

                {/* MPAC Response */}
                <View style={styles.responseSection}>
                    <View style={styles.responseHeader}>
                        <FontAwesome5 name="university" size={16} color={theme.colors.primary} />
                        <Text style={styles.responseTitle}>Resposta do MPAC</Text>
                    </View>
                    <View style={styles.responseCard}>
                        <Text style={styles.responsePlaceholder}>
                            {isOwner
                                ? "Sua denúncia está em fase de triagem. Assim que um promotor analisar os dados, a resposta oficial aparecerá aqui."
                                : "Esta denúncia está em fase de análise pelo Ministério Público. Você pode acompanhar o progresso geral através do mapa."
                            }
                        </Text>
                    </View>
                </View>

                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <Text style={styles.backButtonText}>Voltar para Lista</Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F8F9FA' },
    content: { padding: theme.spacing.lg, paddingBottom: 40 },
    statusSection: { marginBottom: theme.spacing.xl },
    sectionTitle: { fontFamily: 'Inter_700Bold', fontSize: 14, color: theme.colors.textLight, textTransform: 'uppercase', letterSpacing: 1, marginBottom: theme.spacing.lg },
    statusBarContainer: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 10 },
    stepWrapper: { alignItems: 'center', flex: 1 },
    stepCircle: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', zIndex: 2, elevation: 3 },
    stepCircleInactive: { backgroundColor: '#E0E0E0' },
    stepLabel: { fontFamily: 'Inter_500Medium', fontSize: 10, marginTop: 8, color: theme.colors.textLight },
    stepLine: { position: 'absolute', top: 20, left: '50%', width: width / 4, height: 3, zIndex: 1 },
    stepLineInactive: { backgroundColor: '#E0E0E0' },
    infoCard: { backgroundColor: theme.colors.white, borderRadius: theme.borderRadius.lg, padding: theme.spacing.xl, elevation: 4, marginBottom: theme.spacing.xl },
    categoryBadge: { alignSelf: 'flex-start', backgroundColor: 'rgba(156, 43, 39, 0.1)', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 20, marginBottom: theme.spacing.md },
    categoryText: { fontFamily: 'Inter_700Bold', fontSize: 12, color: theme.colors.primary },
    dateText: { fontFamily: 'Inter_400Regular', fontSize: 13, color: theme.colors.textLight, marginBottom: theme.spacing.lg },
    descriptionTitle: { fontFamily: 'Inter_700Bold', fontSize: 16, color: theme.colors.text, marginBottom: 8 },
    descriptionText: { fontFamily: 'Inter_400Regular', fontSize: 15, color: '#444', lineHeight: 22, marginBottom: theme.spacing.lg },
    addressBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F0F2F5', padding: 12, borderRadius: theme.borderRadius.md },
    addressText: { fontFamily: 'Inter_500Medium', fontSize: 13, color: theme.colors.text, flex: 1, marginLeft: 8 },
    mediaSection: { marginBottom: theme.spacing.xl },
    mediaScroll: { marginTop: theme.spacing.sm },
    mediaFrame: { width: 150, height: 150, borderRadius: theme.borderRadius.md, overflow: 'hidden', marginRight: theme.spacing.md, backgroundColor: '#E1E9EE' },
    mediaImage: { width: '100%', height: '100%' },
    responseSection: { marginBottom: theme.spacing.xl },
    responseHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: theme.spacing.md },
    responseTitle: { fontFamily: 'Inter_700Bold', fontSize: 16, color: theme.colors.primary, marginLeft: 10 },
    responseCard: { backgroundColor: '#FFF4F4', borderRadius: theme.borderRadius.lg, padding: theme.spacing.xl, borderLeftWidth: 5, borderLeftColor: theme.colors.primary },
    responsePlaceholder: { fontFamily: 'Inter_400Regular', fontSize: 14, color: theme.colors.textLight, fontStyle: 'italic', lineHeight: 20 },
    backButton: { backgroundColor: 'transparent', borderWidth: 2, borderColor: theme.colors.primary, borderRadius: theme.borderRadius.md, padding: theme.spacing.lg, alignItems: 'center', marginTop: theme.spacing.sm },
    backButtonText: { fontFamily: 'Inter_700Bold', fontSize: 14, color: theme.colors.primary }
});
