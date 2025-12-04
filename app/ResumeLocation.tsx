import { Ionicons } from '@expo/vector-icons';
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

  // Your n8n webhook URL (accessible from React Native)
  const WEBHOOK_URL = "http://10.193.176.118:5678/webhook-test/08a00654-89b7-48d0-96b1-02eebede74ea";

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
      // Create form data for email
      const formData = new FormData();

      // Add email
      formData.append('email', location);

      // Send to webhook
      const response = await fetch(WEBHOOK_URL, {
        method: 'POST',
        body: formData,
      });

      // Check if request was successful
      if (response.ok) {
        // Show success message
        Alert.alert('Success', 'Email sent successfully!');
      } else {
        // Show error message
        const errorText = await response.text();
        console.error('HTTP Error:', response.status, errorText);
        Alert.alert(
          'Submission Failed',
          `Server returned error ${response.status}. Please check your n8n webhook and try again.\n\nError: ${errorText}`,
          [{ text: 'OK' }]
        );
      }

      // Navigate to Home page
      router.push('/Home');

    } catch (error: any) {
      console.error('Submit error:', error);

      // Show error message
      Alert.alert(
        'Connection Error',
        `Failed to send email. Please check your network connection and try again.\n\nError: ${error.message}`,
        [{ text: 'OK' }]
      );

      // Navigate to Home page as fallback
      router.push('/Home');
    } finally {
      setIsLoading(false);
    }
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
            <Ionicons name="mail" size={60} color={COLORS.accent} />
            <Text style={styles.title}>Get Email</Text>
            <Text style={styles.subtitle}>
              Please provide specific topic or Location Name
            </Text>
          </View>

          <View style={styles.form}>
            {/* Email Input Section */}
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

            {/* Submit Button */}
            <TouchableOpacity
              style={[styles.submitButton, isLoading && styles.disabledButton]}
              onPress={handleSubmit}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color="#ffffff" />
              ) : (
                <LinearGradient
                  colors={[COLORS.accent, '#fcd34d']} // Amber gradient
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.gradientButton}
                >
                  <Text style={styles.submitButtonText}>Send Email</Text>
                  <Ionicons name="arrow-forward" size={20} color="#ffffff" />
                </LinearGradient>
              )}
            </TouchableOpacity>

            {/* Info Card */}
            <View style={styles.infoCard}>
              <Ionicons name="information-circle" size={20} color={COLORS.accent} />
              <Text style={styles.infoText}>
                Your email will be used to provide personalized assistance in the chat.
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
  helperText: {
    fontSize: 14,
    color: COLORS.text.muted,
    marginBottom: 8,
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
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
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.2)',
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: COLORS.text.muted,
    marginLeft: 12,
    lineHeight: 20,
  },
});

export default ResumeLocationScreen;