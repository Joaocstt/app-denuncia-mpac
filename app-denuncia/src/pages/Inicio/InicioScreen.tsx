import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Image, Linking, RefreshControl } from 'react-native';
import { theme } from '../../theme/theme';
import { Header } from '../../components/Header';
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import axios from 'axios';
import { SkeletonNewsCard } from '../../components/SkeletonNewsCard';
import type { InicioStackParamList, MainTabParamList } from '../../types/navigation';
import type { CompositeNavigationProp } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

type NavigationProp = CompositeNavigationProp<
    NativeStackNavigationProp<InicioStackParamList, 'Inicio'>,
    BottomTabNavigationProp<MainTabParamList>
>;

interface Props {
    navigation: NavigationProp;
}

interface NewsItem {
    id: number;
    date: string;
    link: string;
    title: { rendered: string };
    _embedded?: {
        'wp:featuredmedia'?: Array<{ source_url: string }>;
    };
}

const NEWS_API = 'https://nat.mpac.mp.br/wp-json/wp/v2/posts?after=2026-01-01T00:00:00&before=2026-12-31T23:59:59&per_page=20&_embed';

export default function InicioScreen({ navigation }: Props) {
    const [news, setNews] = useState<NewsItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchNews = async () => {
        try {
            const response = await axios.get(NEWS_API);
            setNews(response.data);
        } catch (error) {
            console.error('Error fetching news:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchNews();
    }, []);

    const onRefresh = () => {
        setRefreshing(true);
        fetchNews();
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('pt-BR');
    };

    const renderNewsItem = ({ item }: { item: NewsItem | number }) => {
        if (loading || typeof item === 'number') return <SkeletonNewsCard />;

        const featuredMedia = item._embedded?.['wp:featuredmedia']?.[0]?.source_url;

        return (
            <TouchableOpacity
                style={styles.newsCard}
                onPress={() => Linking.openURL(item.link)}
                activeOpacity={0.9}
            >
                {featuredMedia ? (
                    <Image source={{ uri: featuredMedia }} style={styles.newsImage} />
                ) : (
                    <View style={styles.placeholderImage}>
                        <MaterialIcons name="image-not-supported" size={40} color={theme.colors.border} />
                    </View>
                )}
                <View style={styles.newsInfo}>
                    <Text style={styles.newsDate}>{formatDate(item.date)}</Text>
                    <Text style={styles.newsTitle} numberOfLines={3}>
                        {item.title.rendered
                            .replace(/&#8211;/g, '-')
                            .replace(/&#8220;/g, '"')
                            .replace(/&#8221;/g, '"')
                            .replace(/&quot;/g, '"')
                            .replace(/&#8217;/g, "'")}
                    </Text>
                    <View style={styles.readMoreContainer}>
                        <Text style={styles.readMoreText}>Ler notícia completa</Text>
                        <MaterialIcons name="chevron-right" size={18} color={theme.colors.primary} />
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    const renderHeader = () => (
        <View style={styles.listHeader}>
            <View style={styles.greetingSection}>
                <Text style={styles.welcomeText}>Olá! 👋</Text>
                <Text style={styles.subtitleText}>Como podemos ajudar você hoje?</Text>
            </View>

            <View style={styles.quickActionsContainer}>
                <TouchableOpacity
                    style={styles.mainActionCard}
                    onPress={() => (navigation as any).navigate('DenunciasStack', { screen: 'NovaDenuncia' })}
                    activeOpacity={0.85}
                >
                    <LinearGradient
                        colors={[theme.colors.primary, theme.colors.secondary]}
                        style={styles.gradientCard}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                    >
                        <View style={styles.actionIconCircle}>
                            <MaterialIcons name="add-alert" size={30} color={theme.colors.white} />
                        </View>
                        <View style={styles.actionTextContainer}>
                            <Text style={styles.actionMainTitle}>Fazer uma Denúncia</Text>
                            <Text style={styles.actionMainSubtitle}>Relate irregularidades com rapidez e segurança</Text>
                        </View>
                        <MaterialIcons name="arrow-forward" size={24} color="rgba(255,255,255,0.7)" />
                    </LinearGradient>
                </TouchableOpacity>

                <View style={styles.secondaryActionsRow}>
                    <TouchableOpacity
                        style={styles.secondaryActionCard}
                        onPress={() => (navigation as any).navigate('DenunciasStack', { screen: 'MinhasDenuncias' })}
                        activeOpacity={0.8}
                    >
                        <View style={[styles.secondaryIconFrame, { backgroundColor: '#E8F5E9' }]}>
                            <FontAwesome5 name="list-ul" size={18} color="#2E7D32" />
                        </View>
                        <Text style={styles.secondaryActionTitle}>Minhas Denúncias</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.secondaryActionCard}
                        onPress={() => (navigation as any).navigate('MapaStack')}
                        activeOpacity={0.8}
                    >
                        <View style={[styles.secondaryIconFrame, { backgroundColor: '#E3F2FD' }]}>
                            <MaterialIcons name="map" size={22} color="#1565C0" />
                        </View>
                        <Text style={styles.secondaryActionTitle}>Ver no Mapa</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.newsHeader}>
                <View style={styles.newsHeaderTitleRow}>
                    <MaterialIcons name="article" size={20} color={theme.colors.primary} />
                    <Text style={styles.newsHeaderText}>Portal de Notícias MPAC</Text>
                </View>
                <View style={styles.newsHeaderLine} />
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <Header title="MPAC CIDADÃO" />

            <FlatList
                data={loading ? [1, 2, 3] : news}
                keyExtractor={(item) => typeof item === 'number' ? `skeleton-${item}` : item.id.toString()}
                renderItem={renderNewsItem}
                contentContainerStyle={styles.listContent}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[theme.colors.primary]} />
                }
                ListHeaderComponent={renderHeader}
                ListEmptyComponent={
                    (!loading) ? (
                        <View style={styles.emptyContainer}>
                            <MaterialIcons name="article" size={60} color={theme.colors.border} />
                            <Text style={styles.emptyText}>Nenhuma notícia encontrada no momento.</Text>
                        </View>
                    ) : null
                }
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.background },
    listContent: { paddingBottom: theme.spacing.xl },
    listHeader: { paddingTop: theme.spacing.lg },
    greetingSection: { paddingHorizontal: theme.spacing.xl, marginBottom: theme.spacing.lg },
    welcomeText: { fontFamily: 'Inter_700Bold', fontSize: 26, color: theme.colors.text, marginBottom: 2 },
    subtitleText: { fontFamily: 'Inter_400Regular', fontSize: 15, color: theme.colors.textLight },
    quickActionsContainer: { paddingHorizontal: theme.spacing.xl, marginBottom: theme.spacing.xl },
    mainActionCard: {
        borderRadius: theme.borderRadius.lg,
        overflow: 'hidden',
        elevation: 8,
        shadowColor: theme.colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
        marginBottom: theme.spacing.md,
    },
    gradientCard: { padding: theme.spacing.lg, flexDirection: 'row', alignItems: 'center' },
    actionIconCircle: {
        width: 54,
        height: 54,
        borderRadius: 27,
        backgroundColor: 'rgba(255,255,255,0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: theme.spacing.md,
    },
    actionTextContainer: { flex: 1 },
    actionMainTitle: { fontFamily: 'Inter_700Bold', fontSize: 18, color: theme.colors.white, marginBottom: 2 },
    actionMainSubtitle: { fontFamily: 'Inter_400Regular', fontSize: 12, color: 'rgba(255,255,255,0.85)', lineHeight: 16 },
    secondaryActionsRow: { flexDirection: 'row', gap: theme.spacing.md },
    secondaryActionCard: {
        flex: 1,
        backgroundColor: theme.colors.white,
        borderRadius: theme.borderRadius.md,
        padding: theme.spacing.md,
        flexDirection: 'row',
        alignItems: 'center',
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.01)',
    },
    secondaryIconFrame: {
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: theme.spacing.sm,
    },
    secondaryActionTitle: { fontFamily: 'Inter_600SemiBold', fontSize: 13, color: theme.colors.text, flex: 1 },
    newsHeader: { paddingHorizontal: theme.spacing.xl, marginBottom: theme.spacing.md, marginTop: theme.spacing.sm },
    newsHeaderTitleRow: { flexDirection: 'row', alignItems: 'center', marginBottom: theme.spacing.xs },
    newsHeaderText: {
        fontFamily: 'Inter_700Bold',
        fontSize: 16,
        color: theme.colors.text,
        marginLeft: 8,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    newsHeaderLine: { height: 3, width: 40, backgroundColor: theme.colors.primary, borderRadius: 2 },
    newsCard: {
        backgroundColor: theme.colors.white,
        marginHorizontal: theme.spacing.xl,
        marginBottom: theme.spacing.lg,
        borderRadius: theme.borderRadius.lg,
        overflow: 'hidden',
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.02)',
    },
    newsImage: { width: '100%', height: 180 },
    placeholderImage: {
        width: '100%',
        height: 180,
        backgroundColor: '#f0f0f0',
        justifyContent: 'center',
        alignItems: 'center',
    },
    newsInfo: { padding: theme.spacing.lg },
    newsDate: { fontFamily: 'Inter_500Medium', fontSize: 11, color: theme.colors.primary, marginBottom: 4, textTransform: 'uppercase', letterSpacing: 0.5 },
    newsTitle: { fontFamily: 'Inter_700Bold', fontSize: 16, color: theme.colors.text, lineHeight: 22 },
    readMoreContainer: { flexDirection: 'row', alignItems: 'center', marginTop: theme.spacing.md },
    readMoreText: { fontFamily: 'Inter_600SemiBold', fontSize: 13, color: theme.colors.primary, marginRight: 4 },
    emptyContainer: { padding: theme.spacing.xl * 2, alignItems: 'center' },
    emptyText: { fontFamily: 'Inter_500Medium', color: theme.colors.textLight, marginTop: theme.spacing.md, textAlign: 'center' }
});
