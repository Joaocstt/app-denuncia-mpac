import React from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { theme } from '../theme/theme';

export const SkeletonNewsCard: React.FC = () => {
    const animatedValue = new Animated.Value(0);

    React.useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(animatedValue, {
                    toValue: 1,
                    duration: 1000,
                    useNativeDriver: true,
                }),
                Animated.timing(animatedValue, {
                    toValue: 0,
                    duration: 1000,
                    useNativeDriver: true,
                }),
            ])
        ).start();
    }, []);

    const opacity = animatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: [0.3, 0.7],
    });

    return (
        <View style={styles.card}>
            <Animated.View style={[styles.image, { opacity }]} />
            <View style={styles.content}>
                <Animated.View style={[styles.line, { width: '40%', opacity }]} />
                <Animated.View style={[styles.line, { width: '90%', opacity, marginTop: 12 }]} />
                <Animated.View style={[styles.line, { width: '80%', opacity }]} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: theme.colors.white,
        marginHorizontal: theme.spacing.xl,
        marginBottom: theme.spacing.lg,
        borderRadius: theme.borderRadius.lg,
        overflow: 'hidden',
        elevation: 2,
    },
    image: {
        width: '100%',
        height: 180,
        backgroundColor: '#E1E9EE',
    },
    content: {
        padding: theme.spacing.lg,
    },
    line: {
        height: 12,
        backgroundColor: '#E1E9EE',
        borderRadius: 4,
        marginBottom: 8,
    },
});
