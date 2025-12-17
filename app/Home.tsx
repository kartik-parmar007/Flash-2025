import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { COLORS, COMMON_STYLES, SPACING } from '../constants/theme';

export default function Home() {
    const router = useRouter();

    const navigateToResume = () => {
        router.push('/Resume');
    };

    const navigateToResumeLocation = () => {
        router.push('/ResumeLocation');
    };

    const navigateToHistory = () => {
        router.push('/history');
    };

    const navigateToImageDetector = () => {
        router.push('/ImageDetector');
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor={COLORS.background[0]} />
            <LinearGradient
                colors={COLORS.background as any}
                style={styles.background}
            >
                {/* Header */}
                <View style={styles.header}>
                    <View>
                        <Text style={styles.agenticTitle}>AGENTIC AI</Text>
                        <Text style={styles.subtitle}>Autonomous Protocol Active</Text>
                    </View>
                    <View style={styles.avatarContainer}>
                        <View style={styles.onlineDot} />
                        <Ionicons name="hardware-chip-outline" size={24} color={COLORS.primary} />
                    </View>
                </View>

                <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                    {/* Hero Section / Greeting */}
                    <View style={styles.heroSection}>
                        <Text style={styles.welcomeText}>System Ready</Text>
                        <Text style={styles.instructionText}>Select a module to begin operation.</Text>
                    </View>

                    {/* Features Grid at Bottom */}
                    <View style={styles.featuresContainer}>
                        <Text style={styles.sectionTitle}>MODULES</Text>
                        <View style={styles.grid}>
                            <TouchableOpacity style={styles.card} onPress={navigateToResume} activeOpacity={0.7}>
                                <LinearGradient
                                    colors={COLORS.gradients.card as any}
                                    style={styles.cardGradient}
                                >
                                    <View style={[styles.iconContainer, { backgroundColor: 'rgba(56, 189, 248, 0.1)' }]}>
                                        <Ionicons name="document-text" size={28} color={COLORS.primary} />
                                    </View>
                                    <Text style={styles.cardTitle}>Resume AI</Text>
                                    <Text style={styles.cardDescription}>Optimization Engine</Text>
                                </LinearGradient>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.card} onPress={navigateToResumeLocation} activeOpacity={0.7}>
                                <LinearGradient
                                    colors={COLORS.gradients.card as any}
                                    style={styles.cardGradient}
                                >
                                    <View style={[styles.iconContainer, { backgroundColor: 'rgba(251, 191, 36, 0.1)' }]}>
                                        <Ionicons name="location" size={28} color={COLORS.warning} />
                                    </View>
                                    <Text style={styles.cardTitle}>GeoFind</Text>
                                    <Text style={styles.cardDescription}>Location Services</Text>
                                </LinearGradient>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.card} onPress={navigateToImageDetector} activeOpacity={0.7}>
                                <LinearGradient
                                    colors={COLORS.gradients.card as any}
                                    style={styles.cardGradient}
                                >
                                    <View style={[styles.iconContainer, { backgroundColor: 'rgba(244, 63, 94, 0.1)' }]}>
                                        <Ionicons name="scan" size={28} color={COLORS.error} />
                                    </View>
                                    <Text style={styles.cardTitle}>Vision AI</Text>
                                    <Text style={styles.cardDescription}>Image Analysis</Text>
                                </LinearGradient>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.card} onPress={navigateToHistory} activeOpacity={0.7}>
                                <LinearGradient
                                    colors={COLORS.gradients.card as any}
                                    style={styles.cardGradient}
                                >
                                    <View style={[styles.iconContainer, { backgroundColor: 'rgba(129, 140, 248, 0.1)' }]}>
                                        <Ionicons name="time" size={28} color={COLORS.secondary} />
                                    </View>
                                    <Text style={styles.cardTitle}>Logs</Text>
                                    <Text style={styles.cardDescription}>Activity History</Text>
                                </LinearGradient>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Footer Info */}
                    <View style={styles.footerContainer}>
                        <View style={styles.infoCard}>
                            <Ionicons name="shield-checkmark-outline" size={20} color={COLORS.primary} />
                            <Text style={styles.infoText}>Secured by KAIRAV Protocol v2.5</Text>
                        </View>
                    </View>

                </ScrollView>
            </LinearGradient>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background[0],
    },
    background: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: SPACING.l,
        paddingTop: 60,
        paddingBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255, 255, 255, 0.05)',
        backgroundColor: 'rgba(15, 23, 42, 0.8)',
    },
    agenticTitle: {
        fontSize: 24,
        fontWeight: '800',
        color: COLORS.primary,
        letterSpacing: 2,
    },
    subtitle: {
        fontSize: 12,
        color: COLORS.text.secondary,
        letterSpacing: 1,
        marginTop: 4,
        textTransform: 'uppercase',
    },
    avatarContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: 'rgba(30, 41, 59, 0.8)',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(56, 189, 248, 0.3)',
    },
    onlineDot: {
        position: 'absolute',
        top: 2,
        right: 2,
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: COLORS.success,
        borderWidth: 1,
        borderColor: '#0f172a',
    },
    scrollContent: {
        flexGrow: 1,
        padding: SPACING.m,
        justifyContent: 'space-between',
    },
    heroSection: {
        marginTop: 40,
        paddingHorizontal: SPACING.s,
    },
    welcomeText: {
        fontSize: 32,
        fontWeight: '300',
        color: COLORS.text.primary,
        marginBottom: 8,
    },
    instructionText: {
        fontSize: 16,
        color: COLORS.text.secondary,
    },
    featuresContainer: {
        marginTop: 60,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: '700',
        color: COLORS.text.muted,
        marginBottom: 16,
        marginLeft: 4,
        letterSpacing: 1.5,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        gap: 12,
    },
    card: {
        width: '48%', // Slightly less than 50% for gap
        marginBottom: 12,
        borderRadius: 16,
        overflow: 'hidden',
        ...COMMON_STYLES.shadow,
    },
    cardGradient: {
        padding: 20,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.05)',
        height: 160,
        justifyContent: 'center',
    },
    iconContainer: {
        width: 50,
        height: 50,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.05)',
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: COLORS.text.primary,
        marginBottom: 4,
    },
    cardDescription: {
        fontSize: 12,
        color: COLORS.text.secondary,
    },
    footerContainer: {
        marginTop: 40,
        marginBottom: 20,
        alignItems: 'center',
    },
    infoCard: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
        paddingHorizontal: 16,
        backgroundColor: 'rgba(56, 189, 248, 0.05)',
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'rgba(56, 189, 248, 0.1)',
    },
    infoText: {
        fontSize: 12,
        color: COLORS.primary,
        marginLeft: 8,
        fontWeight: '500',
    },
});
