import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { COLORS, COMMON_STYLES, SPACING } from '../constants/theme';

const ResumeLocationScreen = () => {
  const router = useRouter();
  const [location, setLocation] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ location?: string }>({});

  const WEBHOOK_URL = "http://10.132.149.118:5678/webhook-test/08a00654-89b7-48d0-96b1-02eebede74ea";

  const validateForm = () => {
    const newErrors: { location?: string } = {};

    if (!location.trim()) {
      newErrors.location = 'Please Get address';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append('email', location);

      const response = await fetch(WEBHOOK_URL, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        Alert.alert('Success', 'Email sent successfully!');
      } else {
        const errorText = await response.text();
        console.error('HTTP Error:', response.status, errorText);
        Alert.alert(
          'Submission Failed',
          `Server returned error ${response.status}. Please check your n8n webhook and try again.\n\nError: ${errorText}`,
          [{ text: 'OK' }]
        );
      }

      router.push('/Home');

    } catch (error: any) {
      console.error('Submit error:', error);
      Alert.alert(
        'Connection Error',
        `Failed to send email. Please check your network connection and try again.\n\nError: ${error.message}`,
        [{ text: 'OK' }]
      );
      router.push('/Home');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={COLORS.background as any} style={styles.background}>
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
              <Ionicons name="mail" size={60} color={COLORS.warning} />
              <Text style={styles.title}>Get Email</Text>
              <Text style={styles.subtitle}>
                Please provide specific topic or Location Name
              </Text>
            </View>

            <View style={styles.form}>
              <View style={styles.formGroup}>
                <Text style={styles.label}>
                  Email Address <Text style={styles.required}>*</Text>
                </Text>
                <Text style={styles.helperText}>
                  Get address
                </Text>
                <TextInput
                  style={[styles.input, errors.location && styles.errorBorder]}
                  value={location}
                  onChangeText={(text) => {
                    setLocation(text);
                    if (text.trim()) {
                      setErrors(prev => ({ ...prev, location: undefined }));
                    }
                  }}
                  placeholder="Enter specific details/Location"
                  placeholderTextColor={COLORS.text.muted}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
                {errors.location && (
                  <Text style={styles.errorText}>{errors.location}</Text>
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
                  <View style={styles.gradientButton}>
                    <Text style={styles.submitButtonText}>Send Email</Text>
                    <Ionicons name="arrow-forward" size={20} color="#ffffff" />
                  </View>
                )}
              </TouchableOpacity>

              <View style={styles.infoCard}>
                <Ionicons name="information-circle" size={20} color={COLORS.warning} />
                <Text style={styles.infoText}>
                  Your email will be used to provide personalized assistance in the chat.
                </Text>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background[0],
  },
  background: {
    flex: 1,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: SPACING.l,
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
    letterSpacing: 1.5,
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
    letterSpacing: 0.5,
  },
  required: {
    color: COLORS.error,
  },
  helperText: {
    fontSize: 14,
    color: COLORS.text.muted,
    marginBottom: 8,
  },
  input: {
    backgroundColor: 'rgba(30, 41, 59, 0.5)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: COLORS.text.primary,
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
    backgroundColor: COLORS.warning,
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
  infoCard: {
    flexDirection: 'row',
    backgroundColor: 'rgba(251, 191, 36, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(251, 191, 36, 0.2)',
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: COLORS.text.primary,
    marginLeft: 12,
    lineHeight: 20,
  },
});

export default ResumeLocationScreen;