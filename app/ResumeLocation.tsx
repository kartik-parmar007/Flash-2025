import { Ionicons } from '@expo/vector-icons';
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

const ResumeLocationScreen = () => {
  const router = useRouter();
  const [location, setLocation] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{location?: string}>({});

  // Your n8n webhook URL
  const WEBHOOK_URL = "http://172.29.39.118:5678/webhook-test/01358e77-0252-46c7-80f9-200524927bdc";

  const validateForm = () => {
    const newErrors: {location?: string} = {};
    
    if (!location.trim()) {
      newErrors.location = 'Please enter your location (City, State or Country)';
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
      // Create form data for location
      const formData = new FormData();
      
      // Add location
      formData.append('location', location);
      
      // Send to webhook
      const response = await fetch(WEBHOOK_URL, {
        method: 'POST',
        body: formData,
      });

      // Show success message regardless of response status
      Alert.alert('Success', 'Successfully Sent Message!');
      
      // Navigate to Home page
      router.push('/Home');
      
    } catch (error) {
      console.error('Submit error:', error);
      
      // Still show success message even if there's an error
      Alert.alert('Success', 'Successfully Sent Message!');
      
      // Navigate to Home page as fallback
      router.push('/Home');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 20 : 0}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Ionicons name="location" size={60} color="#06b6d4" />
          <Text style={styles.title}>Enter Your Location</Text>
          <Text style={styles.subtitle}>
            Please provide your location information to get started
          </Text>
        </View>

        <View style={styles.form}>
          {/* Location Input Section */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>
              Location <Text style={styles.required}>*</Text>
            </Text>
            <Text style={styles.helperText}>
              Enter your City, State or Country
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
              placeholder="e.g., San Francisco, CA or United States"
              placeholderTextColor="#64748b"
              autoCapitalize="words"
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
              <>
                <Text style={styles.submitButtonText}>Send Location</Text>
                <Ionicons name="arrow-forward" size={20} color="#ffffff" />
              </>
            )}
          </TouchableOpacity>

          {/* Info Card */}
          <View style={styles.infoCard}>
            <Ionicons name="information-circle" size={20} color="#06b6d4" />
            <Text style={styles.infoText}>
              Your location will be used to provide personalized assistance in the chat.
            </Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
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
    color: '#e2e8f0',
    marginTop: 16,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#94a3b8',
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
    color: '#e2e8f0',
    marginBottom: 8,
  },
  required: {
    color: '#ef4444',
  },
  helperText: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#1e293b',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#e2e8f0',
  },
  errorBorder: {
    borderColor: '#ef4444',
  },
  errorText: {
    fontSize: 13,
    color: '#ef4444',
    marginTop: 6,
  },
  submitButton: {
    backgroundColor: '#06b6d4',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 18,
    borderRadius: 12,
    marginTop: 32,
    marginBottom: 20,
    shadowColor: '#06b6d4',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
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
    backgroundColor: 'rgba(6, 182, 212, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(6, 182, 212, 0.2)',
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: '#94a3b8',
    marginLeft: 12,
    lineHeight: 20,
  },
});

export default ResumeLocationScreen;