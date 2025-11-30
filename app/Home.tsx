import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
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

  return (
    <LinearGradient colors={COLORS.background} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Welcome Home</Text>
        <Text style={styles.subtitle}>What would you like to do today?</Text>

        {/* Navigation Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Services</Text>

          <TouchableOpacity style={styles.card} onPress={navigateToResume}>
            <LinearGradient
              colors={['rgba(6, 182, 212, 0.2)', 'rgba(6, 182, 212, 0.05)']}
              style={styles.cardGradient}
            >
              <View style={[styles.iconContainer, { backgroundColor: 'rgba(6, 182, 212, 0.2)' }]}>
                <Ionicons name="document-text" size={24} color="#06b6d4" />
              </View>
              <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>Upload Resume</Text>
                <Text style={styles.cardDescription}>Get personalized assistance based on your resume</Text>
              </View>
              <Ionicons name="chevron-forward" size={24} color={COLORS.text.secondary} />
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity style={styles.card} onPress={navigateToResumeLocation}>
            <LinearGradient
              colors={['rgba(245, 158, 11, 0.2)', 'rgba(245, 158, 11, 0.05)']}
              style={styles.cardGradient}
            >
              <View style={[styles.iconContainer, { backgroundColor: 'rgba(245, 158, 11, 0.2)' }]}>
                <Ionicons name="location" size={24} color="#f59e0b" />
              </View>
              <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>Get Mail ID</Text>
                <Text style={styles.cardDescription}>Find email IDs based on location and role</Text>
              </View>
              <Ionicons name="chevron-forward" size={24} color={COLORS.text.secondary} />
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* History Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>

          <TouchableOpacity style={styles.card} onPress={navigateToHistory}>
            <LinearGradient
              colors={['rgba(139, 92, 246, 0.2)', 'rgba(139, 92, 246, 0.05)']}
              style={styles.cardGradient}
            >
              <View style={[styles.iconContainer, { backgroundColor: 'rgba(139, 92, 246, 0.2)' }]}>
                <Ionicons name="time" size={24} color="#8b5cf6" />
              </View>
              <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>View History</Text>
                <Text style={styles.cardDescription}>Access your past conversations and chats</Text>
              </View>
              <Ionicons name="chevron-forward" size={24} color={COLORS.text.secondary} />
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: SPACING.l,
    paddingTop: 60,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.text.primary,
    marginBottom: SPACING.s,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.text.secondary,
    marginBottom: SPACING.xl,
  },
  section: {
    marginBottom: SPACING.xl,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text.primary,
    marginBottom: SPACING.m,
    marginLeft: SPACING.xs,
  },
  card: {
    marginBottom: SPACING.m,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.card.border,
    ...COMMON_STYLES.shadow,
  },
  cardGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.m,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.m,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text.primary,
    marginBottom: 4,
  },
  cardDescription: {
    fontSize: 13,
    color: COLORS.text.secondary,
    lineHeight: 18,
  },
});
