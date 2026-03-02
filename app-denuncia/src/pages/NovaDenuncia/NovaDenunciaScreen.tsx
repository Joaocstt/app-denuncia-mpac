import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, Switch, TouchableOpacity, ActivityIndicator, Image } from 'react-native';
import { theme } from '../../theme/theme';
import { Header } from '../../components/Header';
import { MaterialIcons } from '@expo/vector-icons';
import { useNovaDenuncia } from '../../features/denuncias/useNovaDenuncia';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { DenunciasStackParamList } from '../../types/navigation';

type NavigationProp = NativeStackNavigationProp<DenunciasStackParamList, 'NovaDenuncia'>;

interface Props {
    navigation: NavigationProp;
}

const CATEGORY_OPTIONS = [
    'Infraestrutura',
    'Iluminação',
    'Limpeza Urbana',
    'Segurança',
    'Transporte',
    'Outro',
];

export default function NovaDenunciaScreen({ navigation }: Props) {
    const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);

    const { form, status, actions } = useNovaDenuncia(() => {
        navigation.navigate('DenunciasTab');
    });

    return (
        <View style={styles.container}>
            <Header title="Nova Denúncia" />

            <ScrollView contentContainerStyle={styles.content}>
                {/* Section 1: Location */}
                <View style={styles.cardSection}>
                    <View style={styles.sectionHeader}>
                        <MaterialIcons name="share-location" size={20} color={theme.colors.primary} />
                        <Text style={styles.sectionTitle}>Localização da Ocorrência</Text>
                    </View>

                    <View style={styles.locationToggle}>
                        <Text style={styles.locationLabel}>Usar Localização Atual (GPS)</Text>
                        <View style={styles.toggleWrapper}>
                            {status.loadingLocation && <ActivityIndicator color={theme.colors.primary} style={{ marginRight: 10 }} />}
                            <Switch
                                value={form.useLocation}
                                onValueChange={form.setUseLocation}
                                trackColor={{ false: theme.colors.border, true: theme.colors.secondary }}
                                thumbColor={theme.colors.white}
                            />
                        </View>
                    </View>

                    {!form.useLocation && (
                        <View style={styles.manualAddress}>
                            <TextInput
                                style={styles.input}
                                placeholder="Rua/Avenida"
                                value={form.addressStreet}
                                onChangeText={form.setAddressStreet}
                            />
                            <View style={styles.row}>
                                <TextInput
                                    style={[styles.input, { flex: 1, marginRight: 8 }]}
                                    placeholder="Nº"
                                    value={form.addressNumber}
                                    onChangeText={form.setAddressNumber}
                                    keyboardType="numeric"
                                />
                                <TextInput
                                    style={[styles.input, { flex: 2 }]}
                                    placeholder="Bairro"
                                    value={form.addressNeighborhood}
                                    onChangeText={form.setAddressNeighborhood}
                                />
                            </View>
                            <TextInput
                                style={styles.input}
                                placeholder="Cidade"
                                value={form.addressCity}
                                onChangeText={form.setAddressCity}
                            />
                        </View>
                    )}
                </View>

                {/* Section 2: Details */}
                <View style={[styles.cardSection, { zIndex: 10 }]}>
                    <View style={styles.sectionHeader}>
                        <MaterialIcons name="description" size={20} color={theme.colors.primary} />
                        <Text style={styles.sectionTitle}>Detalhes da Denúncia</Text>
                    </View>

                    <View style={styles.fieldGroup}>
                        <Text style={styles.fieldLabel}>Categoria</Text>
                        <TouchableOpacity
                            style={styles.select}
                            onPress={() => setIsCategoryMenuOpen(!isCategoryMenuOpen)}
                        >
                            <Text style={styles.selectText}>{form.category}</Text>
                            <MaterialIcons name="keyboard-arrow-down" size={24} color={theme.colors.textLight} />
                        </TouchableOpacity>

                        {isCategoryMenuOpen && (
                            <View style={styles.dropdown}>
                                {CATEGORY_OPTIONS.map(opt => (
                                    <TouchableOpacity
                                        key={opt}
                                        style={styles.dropdownOption}
                                        onPress={() => { form.setCategory(opt); setIsCategoryMenuOpen(false); }}
                                    >
                                        <Text style={styles.dropdownText}>{opt}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        )}
                    </View>

                    <View style={styles.descriptionGroup}>
                        <Text style={styles.fieldLabel}>Descrição</Text>
                        <TextInput
                            style={styles.textArea}
                            placeholder="Descreva o problema detalhadamente..."
                            multiline
                            numberOfLines={5}
                            value={form.description}
                            onChangeText={form.setDescription}
                        />
                        <TouchableOpacity
                            style={[styles.micButton, status.isRecording && styles.micButtonActive]}
                            onPress={status.isRecording ? actions.stopRecordingAndTranscribe : actions.startRecording}
                            disabled={status.isTranscribing}
                        >
                            {status.isTranscribing ? (
                                <ActivityIndicator size="small" color={theme.colors.white} />
                            ) : (
                                <MaterialIcons name={status.isRecording ? "stop" : "mic"} size={24} color={theme.colors.white} />
                            )}
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Section 3: Media */}
                <View style={styles.cardSection}>
                    <View style={styles.sectionHeader}>
                        <MaterialIcons name="perm-media" size={20} color={theme.colors.primary} />
                        <Text style={styles.sectionTitle}>Anexos e Mídias</Text>
                    </View>

                    <View style={styles.mediaActions}>
                        <TouchableOpacity style={styles.mediaButton} onPress={actions.handleTakePhoto}>
                            <MaterialIcons name="photo-camera" size={24} color={theme.colors.primary} />
                            <Text style={styles.mediaButtonText}>Câmera</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.mediaButton} onPress={actions.handlePickMedia}>
                            <MaterialIcons name="photo-library" size={24} color={theme.colors.primary} />
                            <Text style={styles.mediaButtonText}>Galeria</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.previewContainer}>
                        {form.media.map((uri, idx) => (
                            <View key={idx} style={styles.preview}>
                                <Image source={{ uri }} style={styles.previewImage} />
                                <TouchableOpacity
                                    style={styles.removeMedia}
                                    onPress={() => form.setMedia(form.media.filter((_, i) => i !== idx))}
                                >
                                    <MaterialIcons name="close" size={12} color={theme.colors.white} />
                                </TouchableOpacity>
                            </View>
                        ))}
                    </View>
                </View>

                <TouchableOpacity
                    style={[styles.submitButton, status.isSubmitting && { opacity: 0.7 }]}
                    onPress={actions.handleSubmit}
                    disabled={status.isSubmitting}
                >
                    {status.isSubmitting ? (
                        <ActivityIndicator color={theme.colors.white} />
                    ) : (
                        <>
                            <MaterialIcons name="send" size={20} color={theme.colors.white} />
                            <Text style={styles.submitText}>Enviar Denúncia</Text>
                        </>
                    )}
                </TouchableOpacity>

            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.background },
    content: { padding: theme.spacing.lg, paddingBottom: 120 },
    cardSection: {
        backgroundColor: theme.colors.white,
        borderRadius: theme.borderRadius.md,
        padding: theme.spacing.lg,
        marginBottom: theme.spacing.lg,
        borderWidth: 1,
        borderColor: theme.colors.border,
        elevation: 2,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingBottom: theme.spacing.sm,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.background,
        marginBottom: theme.spacing.md,
    },
    sectionTitle: {
        fontFamily: 'Inter_700Bold',
        fontSize: 16,
        color: theme.colors.text,
        marginLeft: 8,
    },
    locationToggle: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    locationLabel: { fontFamily: 'Inter_500Medium', fontSize: 14 },
    toggleWrapper: { flexDirection: 'row', alignItems: 'center' },
    manualAddress: { marginTop: 16 },
    input: {
        backgroundColor: theme.colors.background,
        borderRadius: theme.borderRadius.sm,
        padding: 12,
        marginBottom: 12,
        fontFamily: 'Inter_400Regular',
    },
    row: { flexDirection: 'row' },
    fieldGroup: { marginBottom: 16 },
    fieldLabel: { fontFamily: 'Inter_600SemiBold', marginBottom: 6, fontSize: 14 },
    select: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 12,
        backgroundColor: theme.colors.background,
        borderRadius: theme.borderRadius.sm,
        borderWidth: 1,
        borderColor: theme.colors.border,
    },
    selectText: { fontFamily: 'Inter_500Medium' },
    dropdown: {
        backgroundColor: theme.colors.white,
        borderWidth: 1,
        borderColor: theme.colors.border,
        marginTop: 4,
        borderRadius: 8,
        elevation: 5,
    },
    dropdownOption: { padding: 12, borderBottomWidth: 1, borderBottomColor: theme.colors.border },
    dropdownText: { fontFamily: 'Inter_400Regular' },
    descriptionGroup: { position: 'relative' },
    textArea: {
        backgroundColor: theme.colors.background,
        borderRadius: theme.borderRadius.sm,
        padding: 12,
        minHeight: 120,
        textAlignVertical: 'top',
    },
    micButton: {
        position: 'absolute',
        bottom: 12,
        right: 12,
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: theme.colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
    },
    micButtonActive: { backgroundColor: theme.colors.error },
    mediaActions: { flexDirection: 'row', gap: 12 },
    mediaButton: {
        flex: 1,
        height: 80,
        borderWidth: 1,
        borderColor: theme.colors.border,
        borderStyle: 'dashed',
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    mediaButtonText: { fontFamily: 'Inter_600SemiBold', fontSize: 12, color: theme.colors.primary, marginTop: 4 },
    previewContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 16 },
    preview: { position: 'relative' },
    previewImage: { width: 80, height: 80, borderRadius: 8 },
    removeMedia: {
        position: 'absolute',
        top: -4,
        right: -4,
        backgroundColor: theme.colors.primary,
        borderRadius: 10,
        padding: 2,
    },
    submitButton: {
        backgroundColor: theme.colors.primary,
        borderRadius: theme.borderRadius.md,
        padding: 16,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        height: 60,
    },
    submitText: { color: theme.colors.white, fontFamily: 'Inter_700Bold', fontSize: 16, marginLeft: 8 },
});
