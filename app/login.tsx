import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useRef, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Platform,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from 'react-native-reanimated';
import { COLORS, SPACING } from '../constants/theme';

const LoginScreen = () => {
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isLocked, setIsLocked] = useState(false);
    const textInputRef = useRef<TextInput>(null);

    const buttonScale = useSharedValue(1);

    const buttonAnimatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: buttonScale.value }],
    }));

    const handlePinInput = (text: string) => {
        if (isLocked) return;
        const numericText = text.replace(/[^0-9]/g, '');
        setPassword(numericText);
    };

    const handleLogin = () => {
        if (password === '1234') {
            setIsLoading(true);
            setTimeout(() => {
                router.replace('/Home');
            }, 800);
        } else {
            Alert.alert("Access Denied", "Invalid Protocol Key.");
            setPassword('');
        }
    };

    return (
        <GestureHandlerRootView style={{ flex: 1, backgroundColor: COLORS.background[0] }}>
            <StatusBar barStyle="light-content" backgroundColor={COLORS.background[0]} />
            <LinearGradient colors={COLORS.background as any} style={styles.container}>
                <KeyboardAvoidingView
                    style={{ flex: 1 }}
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                >
                    <View style={styles.contentContainer}>
                        {/* Header / Navigation Section */}
                        <View style={styles.header}>
                            <View style={styles.logoCircle}>
                                <Ionicons name="shield-checkmark" size={40} color={COLORS.primary} />
                            </View>
                            <Text style={styles.appName}>SECURE ACCESS</Text>
                            <Text style={styles.instruction}>Identity Verification Required</Text>
                        </View>

                        {/* Content */}
                        <View style={styles.content}>
                            <TouchableOpacity
                                style={styles.pinDisplayContainer}
                                onPress={() => textInputRef.current?.focus()}
                                activeOpacity={0.9}
                            >
                                {[...Array(4)].map((_, i) => (
                                    <View key={i} style={[
                                        styles.pinDotContainer,
                                        password.length > i && styles.pinDotActiveBorder
                                    ]}>
                                        {password.length > i && (
                                            <View style={styles.pinDot} />
                                        )}
                                    </View>
                                ))}
                            </TouchableOpacity>

                            <TextInput
                                ref={textInputRef}
                                style={styles.hiddenInput}
                                value={password}
                                onChangeText={handlePinInput}
                                maxLength={4}
                                keyboardType="numeric"
                                secureTextEntry
                            />

                            <Animated.View style={[styles.loginButtonContainer, buttonAnimatedStyle]}>
                                <TouchableOpacity
                                    style={[styles.loginButton, (password.length !== 4 || isLoading) && styles.disabledButton]}
                                    onPress={handleLogin}
                                    disabled={password.length !== 4 || isLoading}
                                    activeOpacity={0.8}
                                    onPressIn={() => buttonScale.value = withTiming(0.98, { duration: 100 })}
                                    onPressOut={() => buttonScale.value = withTiming(1, { duration: 100 })}
                                >
                                    {isLoading ? (
                                        <ActivityIndicator color="#fff" />
                                    ) : (
                                        <Text style={styles.loginButtonText}>AUTHENTICATE</Text>
                                    )}
                                </TouchableOpacity>
                            </Animated.View>

                            <View style={styles.footer}>
                                <Text style={styles.footerText}>KAIRAV AGENTIC PROTOCOL</Text>
                            </View>

                        </View>
                    </View>
                </KeyboardAvoidingView>
            </LinearGradient>
        </GestureHandlerRootView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    contentContainer: {
        flex: 1,
        padding: SPACING.l,
        justifyContent: 'center',
    },
    header: {
        alignItems: 'center',
        marginBottom: 60,
    },
    logoCircle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: 'rgba(30, 41, 59, 0.8)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
        borderWidth: 1,
        borderColor: 'rgba(56, 189, 248, 0.3)',
    },
    appName: {
        fontSize: 24,
        fontWeight: '800',
        color: COLORS.primary,
        marginBottom: 8,
        letterSpacing: 2,
    },
    instruction: {
        fontSize: 14,
        color: COLORS.text.secondary,
        textAlign: 'center',
        letterSpacing: 0.5,
    },
    content: {
        alignItems: 'center',
        width: '100%',
    },
    pinDisplayContainer: {
        flexDirection: 'row',
        gap: 20,
        marginBottom: 40,
    },
    pinDotContainer: {
        width: 60,
        height: 60,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
        backgroundColor: 'rgba(15, 23, 42, 0.6)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    pinDotActiveBorder: {
        borderColor: COLORS.primary,
        backgroundColor: 'rgba(56, 189, 248, 0.1)',
    },
    pinDot: {
        width: 16,
        height: 16,
        borderRadius: 8,
        backgroundColor: COLORS.primary,
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.8,
        shadowRadius: 10,
    },
    hiddenInput: {
        position: 'absolute',
        width: 0,
        height: 0,
        opacity: 0,
    },
    loginButtonContainer: {
        width: '100%',
        maxWidth: 320,
        marginBottom: 32,
    },
    loginButton: {
        backgroundColor: COLORS.primary,
        paddingVertical: 18,
        borderRadius: 12,
        alignItems: 'center',
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
        elevation: 6,
    },
    disabledButton: {
        backgroundColor: 'rgba(148, 163, 184, 0.2)',
        shadowOpacity: 0,
        elevation: 0,
    },
    loginButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '700',
        letterSpacing: 1,
    },
    footer: {
        marginTop: 20,
    },
    footerText: {
        color: 'rgba(255, 255, 255, 0.2)',
        fontSize: 10,
        letterSpacing: 2,
    }
});

export default LoginScreen;