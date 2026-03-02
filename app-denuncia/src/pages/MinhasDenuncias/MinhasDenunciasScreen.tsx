import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { theme } from '../../theme/theme';
import { Header } from '../../components/Header';
import { DenunciaCard } from '../../components/DenunciaCard';
import { useDenuncias } from '../../features/denuncias/useDenuncias';
import type { DenunciasStackParamList } from '../../types/navigation';
import type { DenunciaStatus } from '../../types/denuncia';

type NavigationProp = NativeStackNavigationProp<DenunciasStackParamList, 'MinhasDenuncias'>;

interface Props {
    navigation: NavigationProp;
}

const STATUS_OPTIONS: (DenunciaStatus | 'Todos')[] = ['Todos', 'em análise', 'aprovada', 'rejeitada', 'resolvida'];

export default function MinhasDenunciasScreen({ navigation }: Props) {
    const [selectedStatus, setSelectedStatus] = useState<DenunciaStatus | 'Todos'>('Todos');
    const { loading, error, refresh, filterByStatus } = useDenuncias();

    const filteredDenuncias = filterByStatus(selectedStatus);

    return (
        <View style={styles.container}>
            <Header title="Minhas Denúncias" />

            <View style={styles.filterContainer}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
                    {STATUS_OPTIONS.map(status => (
                        <TouchableOpacity
                            key={status}
                            style={[styles.filterButton, selectedStatus === status && styles.filterButtonActive]}
                            onPress={() => setSelectedStatus(status)}
                        >
                            <Text style={[styles.filterText, selectedStatus === status && styles.filterTextActive]}>
                                {status === 'em análise' ? 'Em Análise' : status.charAt(0).toUpperCase() + status.slice(1)}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            {loading && !filteredDenuncias.length ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={theme.colors.primary} />
                </View>
            ) : (
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    {error && (
                        <View style={styles.errorContainer}>
                            <Text style={styles.errorText}>{error}</Text>
                            <TouchableOpacity onPress={refresh} style={styles.retryButton}>
                                <Text style={styles.retryText}>Tentar Novamente</Text>
                            </TouchableOpacity>
                        </View>
                    )}

                    {filteredDenuncias.length === 0 && !loading ? (
                        <Text style={styles.emptyText}>Nenhuma denúncia encontrada para este filtro.</Text>
                    ) : (
                        filteredDenuncias.map((item) => (
                            <DenunciaCard
                                key={item.id}
                                title={item.category || "Sem Categoria"}
                                description={item.description}
                                date={(item.createdAt || item.created_at) ? new Date(item.createdAt || item.created_at!).toLocaleDateString('pt-BR') : "Data indefinida"}
                                status={item.status}
                                onPress={() => navigation.navigate('DenunciaDetalhes', { denuncia: item })}
                            />
                        ))
                    )}
                </ScrollView>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    scrollContent: {
        padding: theme.spacing.lg,
        paddingBottom: 100,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyText: {
        fontFamily: 'Inter_400Regular',
        fontSize: 16,
        color: theme.colors.textLight,
        textAlign: 'center',
        marginTop: theme.spacing.xl,
    },
    filterContainer: {
        backgroundColor: theme.colors.background,
        paddingVertical: theme.spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border,
    },
    filterScroll: {
        paddingHorizontal: theme.spacing.lg,
        alignItems: 'center',
    },
    filterButton: {
        backgroundColor: theme.colors.white,
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        marginRight: 10,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 1.41,
        borderWidth: 1,
        borderColor: theme.colors.border,
    },
    filterButtonActive: {
        backgroundColor: theme.colors.primary,
        borderColor: theme.colors.primary,
    },
    filterText: {
        fontFamily: 'Inter_500Medium',
        fontSize: 13,
        color: theme.colors.text,
    },
    filterTextActive: {
        color: theme.colors.white,
    },
    errorContainer: {
        padding: theme.spacing.md,
        backgroundColor: '#fee2e2',
        borderRadius: theme.borderRadius.sm,
        marginBottom: theme.spacing.md,
        alignItems: 'center'
    },
    errorText: {
        color: theme.colors.error,
        fontFamily: 'Inter_500Medium',
        textAlign: 'center'
    },
    retryButton: {
        marginTop: 8,
        padding: 8,
    },
    retryText: {
        color: theme.colors.primary,
        fontFamily: 'Inter_700Bold',
        textDecorationLine: 'underline'
    }
});
