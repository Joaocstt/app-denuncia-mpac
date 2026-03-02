import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { theme } from '../theme/theme';

interface DenunciaCardProps {
    title: string;
    description: string;
    date: string;
    status: string;
    onPress: () => void;
}

export const DenunciaCard: React.FC<DenunciaCardProps> = ({
    title,
    description,
    date,
    status,
    onPress
}) => {

    const getStatusColor = (currentStatus: string) => {
        const s = currentStatus?.toLowerCase() || '';
        if (s.includes('aprovad') || s.includes('concluí') || s.includes('resolvid')) return theme.colors.success;
        if (s.includes('análise') || s.includes('pendente')) return theme.colors.warning;
        if (s.includes('rejeitad')) return theme.colors.error;
        return theme.colors.textLight;
    };

    return (
        <TouchableOpacity activeOpacity={0.8} style={styles.container} onPress={onPress}>
            <View style={styles.header}>
                <Text style={styles.title} numberOfLines={1}>{title}</Text>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(status) }]}>
                    <Text style={styles.statusText}>{status?.toUpperCase() || 'DESCONHECIDO'}</Text>
                </View>
            </View>

            {description ? (
                <Text style={styles.description} numberOfLines={2}>{description}</Text>
            ) : null}

            <View style={styles.footer}>
                <View style={styles.dateContainer}>
                    <Text style={styles.dateLabel}>Registrada em:</Text>
                    <Text style={styles.date}>{date}</Text>
                </View>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: theme.colors.cardBackground,
        borderRadius: theme.borderRadius.md,
        padding: theme.spacing.lg,
        marginBottom: theme.spacing.md,
        borderWidth: 1,
        borderColor: theme.colors.border,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
        elevation: 3,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: theme.spacing.sm,
    },
    title: {
        fontFamily: 'Inter_700Bold',
        fontSize: 16,
        color: theme.colors.text,
        flex: 1,
        marginRight: theme.spacing.sm,
    },
    description: {
        fontFamily: 'Inter_400Regular',
        fontSize: 14,
        color: theme.colors.textLight,
        marginBottom: theme.spacing.md,
        lineHeight: 20,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingTop: theme.spacing.sm,
        borderTopWidth: 1,
        borderTopColor: theme.colors.background,
    },
    dateContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    dateLabel: {
        fontFamily: 'Inter_400Regular',
        fontSize: 12,
        color: theme.colors.textLight,
        marginRight: 4,
    },
    date: {
        fontFamily: 'Inter_600SemiBold',
        fontSize: 12,
        color: theme.colors.text,
    },
    statusBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
    },
    statusText: {
        color: theme.colors.white,
        fontFamily: 'Inter_700Bold',
        fontSize: 10,
    }
});
