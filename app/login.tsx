import { router } from 'expo-router';
import React, { useState, useRef, useEffect } from 'react';
import {
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  View,
  Vibration,
  Dimensions,
} from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import LottieView from 'lottie-react-native';

const { width, height } = Dimensions.get('window');
const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

const LoginScreen = () => {
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const textInputRef = useRef<TextInput>(null);

  // Animations
  const pinShake = useSharedValue(0);
  const buttonScale = useSharedValue(1);

  const pinAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: pinShake.value }],
  }));

  const buttonAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
  }));

  const handlePinInput = (text: string) => {
    const numericText = text.replace(/[^0-9]/g, '');
    setPassword(numericText);

    if (numericText.length === 4) {
      setTimeout(() => {
        if (numericText === '1234') {
          handleLogin();
        } else {
          Vibration.vibrate(200);
          pinShake.value = withSequence(
            withTiming(-10, { duration: 50 }),
            withTiming(10, { duration: 50 }),
            withTiming(-10, { duration: 50 }),
            withTiming(0, { duration: 50 })
          );
          setTimeout(() => setPassword(''), 400);
        }
      }, 200);
    }
  };

  const handleLogin = () => {
    if (password === '1234') {
      setIsLoading(true);
      setTimeout(() => {
        setShowSuccess(true);
        setTimeout(() => router.replace('/history'), 1500);
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
              <Animated.Text style={styles.subtitle}>Enter 4-digit PIN</Animated.Text>

              {/* PIN Boxes */}
              <TouchableOpacity onPress={() => textInputRef.current?.focus()} activeOpacity={1}>
                <Animated.View style={[styles.pinContainer, pinAnimatedStyle]}>
                  {[...Array(4)].map((_, i) => (
                    <View
                      key={i}
                      style={[styles.pinBox, password[i] && styles.filledPinBox]}
                    >
                      {password[i] ? <View style={styles.pinDot} /> : null}
                    </View>
                  ))}
                </Animated.View>
              </TouchableOpacity>

              {/* Hidden Input */}
              <TextInput
                ref={textInputRef}
                style={styles.hiddenInput}
                value={password}
                onChangeText={handlePinInput}
                maxLength={4}
                keyboardType="numeric"
                secureTextEntry
              />

              {/* Button */}
              <AnimatedTouchable
                style={[styles.button, buttonAnimatedStyle]}
                onPress={handleLogin}
                disabled={password.length !== 4 || isLoading}
              >
                <Feather name="arrow-right" size={22} color="#fff" />
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
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10,
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
  },
  pinContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  pinBox: {
    width: 55,
    height: 55,
    marginHorizontal: 6,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
  },
  filledPinBox: {
    borderColor: '#6366f1',
  },
  pinDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#6366f1',
  },
  hiddenInput: {
    position: 'absolute',
    opacity: 0,
  },
  button: {
    marginTop: 10,
    padding: 15,
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#6366f1',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#6366f1',
    shadowOpacity: 0.4,
    shadowRadius: 15,
    elevation: 8,
  },
  successContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default LoginScreen;
