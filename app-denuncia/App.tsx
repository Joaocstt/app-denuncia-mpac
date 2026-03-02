import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { useFonts, Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold } from '@expo-google-fonts/inter';
import { theme } from './src/theme/theme';

import AppNavigator from './src/app/AppNavigator';

export default function App() {
    const [fontsLoaded] = useFonts({
        Inter_400Regular,
        Inter_500Medium,
        Inter_600SemiBold,
        Inter_700Bold,
    });

    if (!fontsLoaded) {
        return (
            <View style={{ flex: 1, backgroundColor: '#9C2B27', justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ color: 'white' }}>Carregando as fontes do App...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <NavigationContainer>
                <AppNavigator />
            </NavigationContainer>
            <StatusBar style="light" backgroundColor={theme.colors.primary} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
});
