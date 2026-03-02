import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { theme } from '../../theme/theme';
import { Header } from '../../components/Header';
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { DenunciasStackParamList } from '../../types/navigation';

type NavigationProp = NativeStackNavigationProp<DenunciasStackParamList, 'DenunciasTab'>;

interface Props {
    navigation: NavigationProp;
}

export default function DenunciasTabScreen({ navigation }: Props) {
    return (
        <View style={styles.container}>
            <Header title="CENTRAL DE DENÚNCIAS" />

            <ScrollView contentContainerStyle={styles.content}>
                <Text style={styles.welcomeText}>Gestão de Denúncias</Text>
                <Text style={styles.subtitleText}>O que você deseja fazer hoje?</Text>

                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        style={styles.actionCard}
                        onPress={() => navigation.navigate('NovaDenuncia')}
                        activeOpacity={0.8}
                    >
                        <View style={[styles.iconContainer, { backgroundColor: theme.colors.primary }]}>
                            <MaterialIcons name="add-alert" size={32} color={theme.colors.white} />
                        </View>
                        <Text style={styles.actionTitle}>Nova Denúncia</Text>
                        <Text style={styles.actionDescription}>Relatar uma nova ocorrência ou problema</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.actionCard}
                        onPress={() => navigation.navigate('MinhasDenuncias')}
                        activeOpacity={0.8}
                    >
                        <View style={[styles.iconContainer, { backgroundColor: theme.colors.primary }]}>
                            <FontAwesome5 name="list-alt" size={28} color={theme.colors.white} />
                        </View>
                        <Text style={styles.actionTitle}>Minhas Denúncias</Text>
                        <Text style={styles.actionDescription}>Acompanhar o status das suas denúncias</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.background },
    content: { padding: theme.spacing.xl, paddingBottom: 40 },
    welcomeText: { fontFamily: 'Inter_700Bold', fontSize: 24, color: theme.colors.text, marginBottom: theme.spacing.xs },
    subtitleText: { fontFamily: 'Inter_400Regular', fontSize: 16, color: theme.colors.textLight, marginBottom: theme.spacing.xl },
    buttonContainer: { gap: theme.spacing.lg },
    actionCard: {
        backgroundColor: theme.colors.white,
        borderRadius: theme.borderRadius.lg,
        padding: theme.spacing.xl,
        alignItems: 'center',
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.02)',
    },
    iconContainer: { width: 64, height: 64, borderRadius: 32, justifyContent: 'center', alignItems: 'center', marginBottom: theme.spacing.md },
    actionTitle: { fontFamily: 'Inter_700Bold', fontSize: 18, color: theme.colors.text, marginBottom: theme.spacing.xs },
    actionDescription: { fontFamily: 'Inter_400Regular', fontSize: 14, color: theme.colors.textLight, textAlign: 'center', paddingHorizontal: theme.spacing.md },
});
