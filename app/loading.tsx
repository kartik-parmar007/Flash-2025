import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import Animated, {
  Easing,
  FadeIn,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming
} from 'react-native-reanimated';

const { width } = Dimensions.get('window');

export default function LoadingScreen() {
  const router = useRouter();
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.8);

  useEffect(() => {
    // Start animations
    opacity.value = withTiming(1, { duration: 1000 });
    scale.value = withTiming(1, {
      duration: 1000,
      easing: Easing.out(Easing.exp)
    }, () => {
      // Breathing animation
      scale.value = withSequence(
        withTiming(1.05, { duration: 1000 }),
        withTiming(1, { duration: 1000 })
      );
    });

    // Navigate after delay
    const timer = setTimeout(() => {
      router.replace('/login');
    }, 3500);

    return () => clearTimeout(timer);
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [{ scale: scale.value }],
    };
  });

  return (
    <LinearGradient
      colors={['#0f0c29', '#302b63', '#24243e']}
      style={styles.container}
    >
      <Animated.View style={[styles.content, animatedStyle]}>
        <Text style={styles.welcomeText}>Welcome to</Text>
        <Text style={styles.brandText}>KAIRAV</Text>
        <Text style={styles.subText}>Agentic World</Text>

        <Animated.View
          entering={FadeIn.delay(1000).duration(1000)}
          style={styles.loadingIndicator}
        >
          <View style={styles.dot} />
          <View style={[styles.dot, { animationDelay: '0.2s' }]} />
          <View style={[styles.dot, { animationDelay: '0.4s' }]} />
        </Animated.View>
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
  welcomeText: {
    fontSize: 24,
    color: '#ffffff',
    fontWeight: '300',
    letterSpacing: 2,
    marginBottom: 10,
    fontFamily: 'System', // Use default system font or custom if available
  },
  brandText: {
    fontSize: 48,
    color: '#00d2ff',
    fontWeight: 'bold',
    letterSpacing: 4,
    marginBottom: 5,
    textShadowColor: 'rgba(0, 210, 255, 0.8)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 25,
  },
  subText: {
    fontSize: 18,
    color: '#b3b3b3',
    fontWeight: '400',
    letterSpacing: 3,
    marginTop: 5,
  },
  loadingIndicator: {
    flexDirection: 'row',
    marginTop: 50,
    gap: 10,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#00d2ff',
    opacity: 0.8,
  },
});
