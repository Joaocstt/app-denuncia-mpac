import React from 'react';
import { Platform, View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MaterialIcons, Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { theme } from '../theme/theme';

import InicioScreen from '../pages/Inicio/InicioScreen';
import MapaScreen from '../pages/Mapa/MapaScreen';
import NovaDenunciaScreen from '../pages/NovaDenuncia/NovaDenunciaScreen';
import MinhasDenunciasScreen from '../pages/MinhasDenuncias/MinhasDenunciasScreen';
import DenunciasTabScreen from '../pages/DenunciasTab/DenunciasTabScreen';
import DenunciaDetalhesScreen from '../pages/DenunciaDetalhes/DenunciaDetalhesScreen';
import SplashScreen from '../pages/Splash/SplashScreen';

import type {
    RootStackParamList,
    MainTabParamList,
    InicioStackParamList,
    DenunciasStackParamList,
    MapaStackParamList
} from '../types/navigation';

const Tab = createBottomTabNavigator<MainTabParamList>();
const Stack = createNativeStackNavigator<RootStackParamList>();
const InicioStack = createNativeStackNavigator<InicioStackParamList>();
const DenunciasStack = createNativeStackNavigator<DenunciasStackParamList>();
const MapaStack = createNativeStackNavigator<MapaStackParamList>();

function InicioNavigator() {
    return (
        <InicioStack.Navigator screenOptions={{ headerShown: false }}>
            <InicioStack.Screen name="Inicio" component={InicioScreen} />
            <InicioStack.Screen name="DenunciaDetalhes" component={DenunciaDetalhesScreen} />
        </InicioStack.Navigator>
    );
}

function DenunciasNavigator() {
    return (
        <DenunciasStack.Navigator screenOptions={{ headerShown: false }}>
            <DenunciasStack.Screen name="DenunciasTab" component={DenunciasTabScreen} />
            <DenunciasStack.Screen name="NovaDenuncia" component={NovaDenunciaScreen} />
            <DenunciasStack.Screen name="MinhasDenuncias" component={MinhasDenunciasScreen} />
            <DenunciasStack.Screen name="DenunciaDetalhes" component={DenunciaDetalhesScreen} />
        </DenunciasStack.Navigator>
    );
}

function MapaNavigator() {
    return (
        <MapaStack.Navigator screenOptions={{ headerShown: false }}>
            <MapaStack.Screen name="Mapa" component={MapaScreen} />
            <MapaStack.Screen name="DenunciaDetalhes" component={DenunciaDetalhesScreen} />
        </MapaStack.Navigator>
    );
}

function TabNavigator() {
    const insets = useSafeAreaInsets();

    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
                tabBarStyle: {
                    backgroundColor: theme.colors.primary,
                    borderTopWidth: 0,
                    elevation: 10,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: -4 },
                    shadowOpacity: 0.1,
                    shadowRadius: 8,
                    height: Platform.OS === 'ios' ? 88 + insets.bottom : 65 + insets.bottom,
                    paddingBottom: Platform.OS === 'ios' ? insets.bottom + 10 : insets.bottom + 8,
                    paddingTop: 10,
                },
                tabBarActiveTintColor: theme.colors.white,
                tabBarInactiveTintColor: 'rgba(255, 255, 255, 0.5)',
                tabBarLabelStyle: {
                    fontFamily: 'Inter_600SemiBold',
                    fontSize: 11,
                    marginTop: 2,
                },
            }}
        >
            <Tab.Screen
                name="InicioStack"
                component={InicioNavigator}
                options={{
                    tabBarLabel: 'Início',
                    tabBarIcon: ({ color }) => (
                        <MaterialIcons name="home-filled" size={26} color={color} />
                    ),
                }}
            />
            <Tab.Screen
                name="DenunciasStack"
                component={DenunciasNavigator}
                options={{
                    tabBarLabel: '',
                    tabBarIcon: ({ focused }) => (
                        <View style={{
                            width: 65,
                            height: 65,
                            backgroundColor: focused ? theme.colors.secondary : '#B23A35',
                            borderRadius: 33,
                            justifyContent: 'center',
                            alignItems: 'center',
                            marginBottom: Platform.OS === 'ios' ? 40 : 25 + insets.bottom,
                            elevation: 8,
                            shadowColor: '#000',
                            shadowOffset: { width: 0, height: 5 },
                            shadowOpacity: 0.3,
                            shadowRadius: 8,
                            borderWidth: 4,
                            borderColor: theme.colors.primary,
                        }}>
                            <FontAwesome5 name="fire" size={26} color={theme.colors.white} />
                        </View>
                    ),
                }}
            />
            <Tab.Screen
                name="MapaStack"
                component={MapaNavigator}
                options={{
                    tabBarLabel: 'Mapa',
                    tabBarIcon: ({ color }) => (
                        <Ionicons name="map" size={24} color={color} />
                    ),
                }}
            />
        </Tab.Navigator>
    );
}

export default function AppNavigator() {
    return (
        <Stack.Navigator
            initialRouteName="Splash"
            screenOptions={{ headerShown: false, animation: 'fade' }}
        >
            <Stack.Screen name="Splash" component={SplashScreen} />
            <Stack.Screen name="MainTabs" component={TabNavigator} />
        </Stack.Navigator>
    );
}
