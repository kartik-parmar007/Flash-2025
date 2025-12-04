import { Ionicons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { COLORS, COMMON_STYLES } from '../constants/theme';

const ImageDetectorScreen = () => {
    const router = useRouter();
    const [selectedFile, setSelectedFile] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState<{ file?: string }>({});
    const [detectionResult, setDetectionResult] = useState<string | null>(null);

    const WEBHOOK_URL = "http://10.193.176.118:5678/webhook-test/08a00654-89b7-48d0-96b1-02eebede74ea";

    const pickMedia = async () => {
        try {
            const result = await DocumentPicker.getDocumentAsync({
                type: ['image/*', 'video/*'],
                copyToCacheDirectory: true,
            });

            if (!result.canceled && result.assets[0]) {
                setSelectedFile(result.assets[0]);
                setErrors(prev => ({ ...prev, file: undefined }));
                setDetectionResult(null);
            }
        } catch (error) {
            Alert.alert('Error', 'Failed to pick media');
        }
    };

    const validateForm = () => {
        const newErrors: { file?: string } = {};

        if (!selectedFile) {
            newErrors.file = 'Please upload an image or video';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validateForm()) {
            return;
        }

        setIsLoading(true);
        setDetectionResult(null);

        try {
            const formData = new FormData();

            if (selectedFile) {
                const isVideo = selectedFile.mimeType?.startsWith('video/');
                formData.append('file', {
                    uri: selectedFile.uri,
                    type: selectedFile.mimeType || (isVideo ? 'video/mp4' : 'image/jpeg'),
                    name: selectedFile.name,
                } as any);
            }

            console.log('Sending media to webhook:', WEBHOOK_URL);

            const response = await fetch(WEBHOOK_URL, {
                method: 'POST',
                headers: {
                    // Content-Type is set automatically
                },
                body: formData,
            });

            console.log('Response status:', response.status);

            if (response.ok) {
                const responseText = await response.text();
                console.log('Success response:', responseText);
                setDetectionResult(responseText);

                Alert.alert(
                    'Success!',
                    'Media analyzed successfully!',
                    [{ text: 'OK' }]
                );
            } else {
                const errorText = await response.text();
                console.error('HTTP Error:', response.status, errorText);
                Alert.alert('Analysis Failed', `Server returned error ${response.status}`);
            }

        } catch (error: any) {
            console.error('Network/Upload error:', error);
            Alert.alert('Connection Error', `Upload failed: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    const removeFile = () => {
        setSelectedFile(null);
        setErrors(prev => ({ ...prev, file: undefined }));
        setDetectionResult(null);
    };

    return (
        <LinearGradient colors={COLORS.background} style={styles.container}>
            <KeyboardAvoidingView
                style={styles.keyboardAvoidingView}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 20 : 0}
            >
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    <View style={styles.header}>
                        <Ionicons name="images" size={60} color={COLORS.primary} />
                        <Text style={styles.title}>AI Image Detector</Text>
                        <Text style={styles.subtitle}>
                            Upload an image or video to detect objects or content
                        </Text>
                    </View>

                    <View style={styles.form}>
                        <View style={styles.formGroup}>
                            <Text style={styles.label}>
                                Media <Text style={styles.required}>*</Text>
                            </Text>

                            {!selectedFile ? (
                                <TouchableOpacity
                                    style={[styles.uploadButton, errors.file && styles.errorBorder]}
                                    onPress={pickMedia}
                                >
                                    <Ionicons name="cloud-upload-outline" size={32} color={COLORS.primary} />
                                    <Text style={styles.uploadText}>Tap to upload image or video</Text>
                                    <Text style={styles.uploadSubtext}>JPG, PNG, MP4 (Max 10MB)</Text>
                                </TouchableOpacity>
                            ) : (
                                <View style={styles.fileCard}>
                                    <View style={styles.fileInfo}>
                                        <Ionicons
                                            name={selectedFile.mimeType?.startsWith('video/') ? "videocam" : "image"}
                                            size={24}
                                            color={COLORS.primary}
                                        />
                                        <View style={styles.fileDetails}>
                                            <Text style={styles.fileName} numberOfLines={1}>
                                                {selectedFile.name}
                                            </Text>
                                            <Text style={styles.fileSize}>
                                                {selectedFile.size ? `${(selectedFile.size / 1024).toFixed(2)} KB` : 'File selected'}
                                            </Text>
                                        </View>
                                    </View>
                                    <TouchableOpacity onPress={removeFile}>
                                        <Ionicons name="close-circle" size={24} color={COLORS.error} />
                                    </TouchableOpacity>
                                </View>
                            )}

                            {errors.file && (
                                <Text style={styles.errorText}>{errors.file}</Text>
                            )}
                        </View>

                        <TouchableOpacity
                            style={[styles.submitButton, isLoading && styles.disabledButton]}
                            onPress={handleSubmit}
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <ActivityIndicator size="small" color="#ffffff" />
                            ) : (
                                <LinearGradient
                                    colors={[COLORS.primary, '#818cf8']}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 0 }}
                                    style={styles.gradientButton}
                                >
                                    <Text style={styles.submitButtonText}>Analyze Media</Text>
                                    <Ionicons name="scan" size={20} color="#ffffff" />
                                </LinearGradient>
                            )}
                        </TouchableOpacity>

                        {detectionResult && (
                            <View style={styles.resultCard}>
                                <Text style={styles.resultTitle}>Detection Result:</Text>
                                <Text style={styles.resultText}>{detectionResult}</Text>
                            </View>
                        )}

                        <View style={styles.infoCard}>
                            <Ionicons name="information-circle" size={20} color={COLORS.primary} />
                            <Text style={styles.infoText}>
                                The media will be sent to our AI server for analysis.
                            </Text>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    keyboardAvoidingView: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        padding: 20,
        paddingTop: Platform.OS === 'android' ? 60 : 40,
    },
    header: {
        alignItems: 'center',
        marginBottom: 40,
    },
    title: {
        fontSize: 28,
        fontWeight: '700',
        color: COLORS.text.primary,
        marginTop: 16,
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: COLORS.text.secondary,
        textAlign: 'center',
        paddingHorizontal: 20,
        lineHeight: 22,
    },
    form: {
        flex: 1,
    },
    formGroup: {
        marginBottom: 24,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        color: COLORS.text.primary,
        marginBottom: 8,
    },
    required: {
        color: COLORS.error,
    },
    uploadButton: {
        borderWidth: 2,
        borderColor: 'rgba(99, 102, 241, 0.3)',
        borderStyle: 'dashed',
        borderRadius: 12,
        padding: 24,
        alignItems: 'center',
        backgroundColor: 'rgba(99, 102, 241, 0.05)',
    },
    uploadText: {
        fontSize: 16,
        color: COLORS.text.primary,
        marginTop: 12,
        fontWeight: '500',
    },
    uploadSubtext: {
        fontSize: 13,
        color: COLORS.text.muted,
        marginTop: 4,
    },
    fileCard: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
        borderWidth: 1,
        borderColor: 'rgba(99, 102, 241, 0.3)',
        borderRadius: 12,
        padding: 16,
    },
    fileInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    fileDetails: {
        marginLeft: 12,
        flex: 1,
    },
    fileName: {
        fontSize: 14,
        color: COLORS.text.primary,
        fontWeight: '500',
    },
    fileSize: {
        fontSize: 12,
        color: COLORS.text.muted,
        marginTop: 2,
    },
    errorBorder: {
        borderColor: COLORS.error,
    },
    errorText: {
        fontSize: 13,
        color: COLORS.error,
        marginTop: 6,
    },
    submitButton: {
        borderRadius: 12,
        marginTop: 32,
        marginBottom: 20,
        overflow: 'hidden',
        ...COMMON_STYLES.shadow,
    },
    gradientButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 18,
    },
    disabledButton: {
        opacity: 0.6,
    },
    submitButtonText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#ffffff',
        marginRight: 8,
    },
    resultCard: {
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
        borderWidth: 1,
        borderColor: 'rgba(99, 102, 241, 0.3)',
        borderRadius: 12,
        padding: 16,
        marginTop: 20,
    },
    resultTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: COLORS.text.primary,
        marginBottom: 8,
    },
    resultText: {
        fontSize: 14,
        color: COLORS.text.primary,
        lineHeight: 20,
    },
    infoCard: {
        flexDirection: 'row',
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
        borderWidth: 1,
        borderColor: 'rgba(99, 102, 241, 0.2)',
        borderRadius: 12,
        padding: 16,
        marginTop: 20,
    },
    infoText: {
        flex: 1,
        fontSize: 14,
        color: COLORS.text.muted,
        marginLeft: 12,
        lineHeight: 20,
    },
});

export default ImageDetectorScreen;
