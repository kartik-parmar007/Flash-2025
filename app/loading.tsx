import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { ActivityIndicator, Dimensions, StyleSheet, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming
} from 'react-native-reanimated';
import { COLORS } from '../constants/theme';

const { width } = Dimensions.get('window');

export default function LoadingScreen() {
  const router = useRouter();
  const opacity = useSharedValue(0);

  useEffect(() => {
    // Start animations
    opacity.value = withTiming(1, { duration: 1000 });

    // Navigate after delay
    const timer = setTimeout(() => {
      router.replace('/login');
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
    };
  });

  return (
    <LinearGradient
      colors={['#0f172a', '#1e293b', '#334155'] as const}
      style={styles.container}
    >
      <Animated.View style={[styles.content, animatedStyle]}>
        <Text style={styles.brandText}>KAIRAV</Text>
        <Text style={styles.subText}>PROTOCOL v2.0</Text>

        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      </Animated.View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    padding: 20,
  },
  brandText: {
    fontSize: 42,
    color: COLORS.primary,
    fontWeight: '800',
    marginBottom: 8,
    letterSpacing: 4,
  },
  subText: {
    fontSize: 14,
    color: COLORS.text.secondary,
    fontWeight: '600',
    marginBottom: 60,
    letterSpacing: 4,
  },
  loadingContainer: {
    marginTop: 20,
  },
});
