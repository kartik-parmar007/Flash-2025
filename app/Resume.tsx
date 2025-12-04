import { Ionicons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
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
  TouchableOpacity,
  View
} from 'react-native';
import { COLORS, COMMON_STYLES, SPACING } from '../constants/theme';

const ResumeUploadScreen = () => {
  const router = useRouter();
  const [resumeFile, setResumeFile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ resume?: string }>({});

  // Your n8n webhook URL (accessible from React Native)
  // Test URL: requires clicking "Execute Workflow" in n8n before each call
  // Production URL: requires activating workflow in n8n (recommended)
  const WEBHOOK_URL = "http://10.193.176.118:5678/webhook-test/08a00654-89b7-48d0-96b1-02eebede74ea";
  // const WEBHOOK_URL = "http://10.173.159.118:5678/webhook/01358e77-0252-46c7-80f9-200524927bdc"; // Production (activate workflow first)

  // Test connection to webhook
  const testWebhookConnection = async () => {
    try {
      console.log('Testing webhook connection to:', WEBHOOK_URL);

      // Create a simple test payload
      const testFormData = new FormData();
      testFormData.append('test_connection', 'true');
      testFormData.append('message', 'Connection test from Resume screen');
      testFormData.append('timestamp', new Date().toISOString());

      const response = await fetch(WEBHOOK_URL, {
        method: 'POST',
        body: testFormData,
      });

      console.log('Webhook test response status:', response.status);
      console.log('Webhook test response headers:', Object.fromEntries(response.headers.entries()));

      // Consider 200, 201, 202 as successful connection
      const isConnected = response.status === 200 || response.status === 201 || response.status === 202;

      if (isConnected) {
        const responseText = await response.text();
        console.log('Webhook test response body:', responseText);
      } else {
        const errorText = await response.text();
        console.log('Webhook test error response:', response.status, errorText);
      }

      return isConnected;
    } catch (error: any) {
      console.log('Webhook connection test failed:', error);
      console.log('Error details:', {
        message: error.message,
        name: error.name,
        stack: error.stack
      });
      return false;
    }
  };

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets[0]) {
        setResumeFile(result.assets[0]);
        setErrors(prev => ({ ...prev, resume: undefined }));
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick document');
    }
  };

  const validateForm = () => {
    const newErrors: { resume?: string } = {};

    if (!resumeFile) {
      newErrors.resume = 'Please upload your resume';
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
      // Create form data for file upload
      const formData = new FormData();

      // Add resume file
      if (resumeFile) {
        formData.append('resume', {
          uri: resumeFile.uri,
          type: resumeFile.mimeType || 'application/pdf',
          name: resumeFile.name,
        } as any);
      }

      console.log('Sending resume to webhook:', WEBHOOK_URL);
      console.log('Resume file details:', {
        name: resumeFile?.name,
        size: resumeFile?.size,
        type: resumeFile?.mimeType
      });

      // Send to webhook
      const response = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: {
          // Don't set Content-Type - let the browser set it with boundary for FormData
        },
        body: formData,
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);

      // Check if request was successful
      if (response.ok) {
        const responseText = await response.text();
        console.log('Success response:', responseText);

        Alert.alert(
          'Success!',
          'Resume uploaded successfully to n8n webhook!',
          [
            {
              text: 'OK',
              onPress: () => router.push('/Home')
            }
          ]
        );
      } else {
        // Handle HTTP error responses
        const errorText = await response.text();
        console.error('HTTP Error:', response.status, errorText);

        let errorMessage = errorText;
        if (response.status === 404) {
          errorMessage = 'Webhook not found. Please make sure you have clicked "Execute Workflow" in n8n, or switch to production mode.';
        }

        Alert.alert(
          'Upload Failed',
          `Server returned error ${response.status}. Please check your n8n webhook and try again.\n\nError: ${errorMessage}`,
          [
            { text: 'Retry', onPress: () => setIsLoading(false) },
            { text: 'Go Back', onPress: () => router.push('/Home') }
          ]
        );
      }

    } catch (error: any) {
      console.error('Network/Upload error:', error);

      // Provide specific error messages based on error type
      let errorMessage = 'Unknown error occurred';

      if (error.message?.includes('Network request failed')) {
        errorMessage = `Cannot connect to n8n webhook.

Please check:
• n8n is running on localhost:5678
• Webhook URL is correct
• Network connectivity
• Firewall settings

URL: ${WEBHOOK_URL}`;
      } else if (error.message?.includes('timeout')) {
        errorMessage = 'Request timed out. Please check your connection and try again.';
      } else {
        errorMessage = `Upload failed: ${error.message}`;
      }

      Alert.alert(
        'Connection Error',
        errorMessage,
        [
          { text: 'Retry', onPress: () => setIsLoading(false) },
          { text: 'Go Back', onPress: () => router.push('/Home') }
        ]
      );
    } finally {
      setIsLoading(false);
    }
  };

  const removeResume = () => {
    setResumeFile(null);
    setErrors(prev => ({ ...prev, resume: undefined }));
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
            <Ionicons name="document-text" size={60} color={COLORS.secondary} />
            <Text style={styles.title}>Upload Your Resume</Text>
            <Text style={styles.subtitle}>
              Please upload your resume to get started
            </Text>
          </View>

          <View style={styles.form}>
            {/* Resume Upload Section */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>
                Resume <Text style={styles.required}>*</Text>
              </Text>

              {!resumeFile ? (
                <TouchableOpacity
                  style={[styles.uploadButton, errors.resume && styles.errorBorder]}
                  onPress={pickDocument}
                >
                  <Ionicons name="cloud-upload-outline" size={32} color={COLORS.secondary} />
                  <Text style={styles.uploadText}>Tap to upload your resume</Text>
                  <Text style={styles.uploadSubtext}>PDF, DOC, DOCX (Max 10MB)</Text>
                </TouchableOpacity>
              ) : (
                <View style={styles.fileCard}>
                  <View style={styles.fileInfo}>
                    <Ionicons name="document-attach" size={24} color={COLORS.secondary} />
                    <View style={styles.fileDetails}>
                      <Text style={styles.fileName} numberOfLines={1}>
                        {resumeFile.name}
                      </Text>
                      <Text style={styles.fileSize}>
                        {resumeFile.size ? `${(resumeFile.size / 1024).toFixed(2)} KB` : 'File selected'}
                      </Text>
                    </View>
                  </View>
                  <TouchableOpacity onPress={removeResume}>
                    <Ionicons name="close-circle" size={24} color={COLORS.error} />
                  </TouchableOpacity>
                </View>
              )}

              {errors.resume && (
                <Text style={styles.errorText}>{errors.resume}</Text>
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
                  colors={[COLORS.secondary, COLORS.primary]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.gradientButton}
                >
                  <Text style={styles.submitButtonText}>Send Resume</Text>
                  <Ionicons name="arrow-forward" size={20} color="#ffffff" />
                </LinearGradient>
              )}
            </TouchableOpacity>

            {/* Test Connection Button */}
            <TouchableOpacity
              style={styles.testButton}
              onPress={async () => {
                const isConnected = await testWebhookConnection();
                Alert.alert(
                  'Connection Test',
                  isConnected
                    ? 'Successfully connected to n8n webhook at localhost:5678!'
                    : 'Failed to connect to n8n webhook.\n\nPossible issues:\n• n8n is not running on localhost:5678\n• Webhook URL might be incorrect\n• React Native app cannot reach localhost (try using your computer\'s IP address instead)\n• Network connectivity issues\n\nCheck console logs for detailed error information.',
                  [{ text: 'OK' }]
                );
              }}
            >
              <Ionicons name="wifi" size={16} color={COLORS.text.muted} />
              <Text style={styles.testButtonText}>Test Webhook Connection</Text>
            </TouchableOpacity>

            {/* Info Card */}
            <View style={styles.infoCard}>
              <Ionicons name="information-circle" size={20} color={COLORS.secondary} />
              <Text style={styles.infoText}>
                Your resume will be used to provide personalized assistance in the chat.
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
  uploadButton: {
    borderWidth: 2,
    borderColor: 'rgba(0, 210, 255, 0.3)',
    borderStyle: 'dashed',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    backgroundColor: 'rgba(0, 210, 255, 0.05)',
  },
  uploadText: {
    fontSize: 16,
    color: COLORS.text.primary,
    marginTop: 12,
    fontWeight: '500',
  },
  uploadSubtext: {
    fontSize: 13,
    color: COLORS.text.muted,
    marginTop: 4,
  },
  fileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(0, 210, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(0, 210, 255, 0.3)',
    borderRadius: 12,
    padding: 16,
  },
  fileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  fileDetails: {
    marginLeft: 12,
    flex: 1,
  },
  fileName: {
    fontSize: 14,
    color: COLORS.text.primary,
    fontWeight: '500',
  },
  fileSize: {
    fontSize: 12,
    color: COLORS.text.muted,
    marginTop: 2,
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
  testButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: COLORS.text.muted,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    marginTop: 12,
  },
  testButtonText: {
    fontSize: 14,
    color: COLORS.text.muted,
    marginLeft: 8,
  },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0, 210, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(0, 210, 255, 0.2)',
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

export default ResumeUploadScreen;