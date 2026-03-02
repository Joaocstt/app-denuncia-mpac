import React, { useEffect } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    Easing
} from 'react-native-reanimated';
import { theme } from '../../theme/theme';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../types/navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'Splash'>;

export default function SplashScreen({ navigation }: Props) {
    const opacity = useSharedValue(0);
    const scale = useSharedValue(0.8);

    useEffect(() => {
        opacity.value = withTiming(1, { duration: 800 });
        scale.value = withTiming(1, { duration: 800, easing: Easing.out(Easing.back(1.5)) });

        const timer = setTimeout(() => {
            navigation.replace('MainTabs');
        }, 2500);

        return () => clearTimeout(timer);
    }, []);

    const animatedStyle = useAnimatedStyle(() => {
        return {
            opacity: opacity.value,
            transform: [{ scale: scale.value }],
            alignItems: 'center',
        };
    });

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={[theme.colors.secondary, '#501110', '#1A0504']}
                style={styles.background}
            />
            <Animated.View style={animatedStyle}>
                <View style={styles.logoPlaceholder}>
                    <Text style={styles.logoText}>M</Text>
                </View>
                <Text style={styles.title}>Ministério Público do Estado do Acre</Text>
            </Animated.View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    background: { ...StyleSheet.absoluteFillObject },
    logoPlaceholder: {
        width: 120,
        height: 120,
        borderRadius: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: theme.spacing.lg,
        borderWidth: 2,
        borderColor: 'rgba(255, 255, 255, 0.3)',
    },
    logoText: { fontFamily: 'Inter_700Bold', fontSize: 64, color: theme.colors.white },
    title: { fontFamily: 'Inter_600SemiBold', fontSize: 16, color: 'rgba(255, 255, 255, 0.8)', textAlign: 'center', paddingHorizontal: 40 },
});
