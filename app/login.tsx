import { Feather, Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import LottieView from 'lottie-react-native';
import React, { useEffect, useRef, useState } from 'react';
import {
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  Vibration,
  View,
} from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');
const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

const LoginScreen = () => {
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [lockoutTimer, setLockoutTimer] = useState(30);

  const textInputRef = useRef<TextInput>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Animations
  const pinShake = useSharedValue(0);
  const buttonScale = useSharedValue(1);

  const pinAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: pinShake.value }],
  }));

  const buttonAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
  }));

  // Start lockout timer
  const startLockoutTimer = () => {
    setIsLocked(true);
    setLockoutTimer(30);

    timerRef.current = setInterval(() => {
      setLockoutTimer((prev) => {
        if (prev <= 1) {
          setIsLocked(false);
          setFailedAttempts(0);
          if (timerRef.current) {
            clearInterval(timerRef.current);
          }
          return 30;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const handlePinInput = (text: string) => {
    if (isLocked) return;

    const numericText = text.replace(/[^0-9]/g, '');
    setPassword(numericText);

    if (numericText.length === 4) {
      setTimeout(() => {
        if (numericText === '1234') {
          handleLogin();
        } else {
          // Wrong PIN
          Vibration.vibrate(200);
          pinShake.value = withSequence(
            withTiming(-10, { duration: 50 }),
            withTiming(10, { duration: 50 }),
            withTiming(-10, { duration: 50 }),
            withTiming(0, { duration: 50 })
          );

          const newFailedAttempts = failedAttempts + 1;
          setFailedAttempts(newFailedAttempts);

          if (newFailedAttempts >= 3) {
            // Lock after 3 failed attempts
            startLockoutTimer();
          }

          setTimeout(() => setPassword(''), 400);
        }
      }, 200);
    }
  };

  const handleLogin = () => {
    if (password === '1234' && !isLocked) {
      setIsLoading(true);
      setFailedAttempts(0); // Reset failed attempts on successful login
      setTimeout(() => {
        setShowSuccess(true);
        setTimeout(() => router.replace('/Home'), 1500);
      }, 1000);
    }
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <LinearGradient
          colors={['#4f46e5', '#6366f1', '#818cf8']}
          style={styles.gradient}
        >
          {!showSuccess ? (
            <View style={styles.card}>
              <Ionicons name="lock-closed" size={48} color="#6366f1" style={{ marginBottom: 10 }} />
              <Animated.Text style={styles.title}>Welcome Back</Animated.Text>
              <Animated.Text style={styles.subtitle}>
                {isLocked ? `Account locked. Try again in ${lockoutTimer}s` : 'Enter 4-digit PIN'}
              </Animated.Text>

              {/* Failed attempts indicator */}
              {failedAttempts > 0 && !isLocked && (
                <Text style={styles.attemptsText}>
                  {failedAttempts}/3 failed attempts
                </Text>
              )}

              {/* PIN Boxes */}
              <TouchableOpacity
                onPress={() => !isLocked && textInputRef.current?.focus()}
                activeOpacity={1}
                disabled={isLocked}
              >
                <Animated.View style={[
                  styles.pinContainer,
                  pinAnimatedStyle,
                  isLocked && styles.lockedContainer
                ]}>
                  {[...Array(4)].map((_, i) => (
                    <View
                      key={i}
                      style={[
                        styles.pinBox,
                        password[i] && styles.filledPinBox,
                        isLocked && styles.lockedPinBox
                      ]}
                    >
                      {password[i] ? <View style={[styles.pinDot, isLocked && styles.lockedPinDot]} /> : null}
                    </View>
                  ))}
                </Animated.View>
              </TouchableOpacity>

              {/* Lockout Icon */}
              {isLocked && (
                <View style={styles.lockoutIconContainer}>
                  <Ionicons name="time-outline" size={24} color="#ef4444" />
                </View>
              )}

              {/* Hidden Input */}
              <TextInput
                ref={textInputRef}
                style={styles.hiddenInput}
                value={password}
                onChangeText={handlePinInput}
                maxLength={4}
                keyboardType="numeric"
                secureTextEntry
                editable={!isLocked}
              />

              {/* Button */}
              <AnimatedTouchable
                style={[
                  styles.buttonContainer,
                  buttonAnimatedStyle,
                  (isLocked || password.length !== 4 || isLoading) && styles.disabledButton
                ]}
                onPress={handleLogin}
                onPressIn={() => {
                  buttonScale.value = withTiming(0.95, { duration: 100 });
                }}
                onPressOut={() => {
                  buttonScale.value = withTiming(1, { duration: 100 });
                }}
                disabled={password.length !== 4 || isLoading || isLocked}
              >
                <LinearGradient
                  colors={isLocked ? ['#ccc', '#999'] : ['#6366f1', '#4f46e5']}
                  style={styles.buttonGradient}
                >
                  <Feather
                    name="arrow-right"
                    size={24}
                    color="#fff"
                  />
                </LinearGradient>
              </AnimatedTouchable>
            </View>
          ) : (
            <View style={styles.successContainer}>
              <LottieView
                source={{ uri: 'https://assets10.lottiefiles.com/packages/lf20_jbrw3hcz.json' }}
                autoPlay
                loop={false}
                style={{ width: 150, height: 150 }}
              />
            </View>
          )}
        </LinearGradient>
      </KeyboardAvoidingView>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    width: '85%',
    backgroundColor: '#fff',
    borderRadius: 25,
    padding: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 25,
    elevation: 15,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.8)',
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    marginBottom: 8,
    color: '#111',
  },
  subtitle: {
    fontSize: 14,
    color: '#444',
    marginBottom: 25,
    textAlign: 'center',
  },
  attemptsText: {
    fontSize: 12,
    color: '#ef4444',
    marginBottom: 15,
    fontWeight: '600',
  },
  pinContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  lockedContainer: {
    opacity: 0.5,
  },
  pinBox: {
    width: 55,
    height: 55,
    marginHorizontal: 6,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#e0e0e0',
    backgroundColor: '#f9fafb',
    justifyContent: 'center',
    alignItems: 'center',
  },
  filledPinBox: {
    borderColor: '#6366f1',
  },
  lockedPinBox: {
    borderColor: '#ef4444',
  },
  pinDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#6366f1',
  },
  lockedPinDot: {
    backgroundColor: '#ef4444',
  },
  lockoutIconContainer: {
    marginBottom: 20,
    padding: 10,
    borderRadius: 50,
    backgroundColor: '#fef2f2',
  },
  hiddenInput: {
    position: 'absolute',
    opacity: 0,
  },
  buttonContainer: {
    marginTop: 20,
    borderRadius: 35,
    shadowColor: '#6366f1',
    shadowOpacity: 0.4,
    shadowRadius: 15,
    elevation: 8,
  },
  buttonGradient: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
  },
  disabledButton: {
    opacity: 0.7,
    shadowOpacity: 0.1,
  },
  successContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default LoginScreen;