import { Ionicons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
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

const ResumeUploadScreen = () => {
  const router = useRouter();
  const [resumeFile, setResumeFile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{resume?: string}>({});

  // Your n8n webhook URL
  const WEBHOOK_URL = "http://172.29.39.118:5678/webhook-test/01358e77-0252-46c7-80f9-200524927bdc";
  
  // Test connection to webhook
  const testWebhookConnection = async () => {
    try {
      console.log('Testing webhook connection to:', WEBHOOK_URL);
      
      // Create a simple test payload
      const testFormData = new FormData();
      testFormData.append('test_connection', 'true');
      testFormData.append('message', 'Connection test from React Native app');
      
      const response = await fetch(WEBHOOK_URL, {
        method: 'POST', // Use POST as your webhook expects
        body: testFormData,
      });
      
      console.log('Webhook test response status:', response.status);
      console.log('Webhook test response headers:', response.headers);
      
      // Consider both 200 and 404 as successful connection (404 means n8n is running but webhook might not be active)
      const isConnected = response.status === 200 || response.status === 201 || response.status === 202;
      
      if (isConnected) {
        const responseText = await response.text();
        console.log('Webhook test response body:', responseText);
      }
      
      return isConnected;
    } catch (error) {
      console.log('Webhook connection test failed:', error);
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
    const newErrors: {resume?: string} = {};
    
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
        
        Alert.alert(
          'Upload Failed',
          `Server returned error ${response.status}. Please check your n8n webhook and try again.\n\nError: ${errorText}`,
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
• n8n is running on 172.29.39.118:5678
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
          <Ionicons name="document-text" size={60} color="#06b6d4" />
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
                <Ionicons name="cloud-upload-outline" size={32} color="#06b6d4" />
                <Text style={styles.uploadText}>Tap to upload your resume</Text>
                <Text style={styles.uploadSubtext}>PDF, DOC, DOCX (Max 10MB)</Text>
              </TouchableOpacity>
            ) : (
              <View style={styles.fileCard}>
                <View style={styles.fileInfo}>
                  <Ionicons name="document-attach" size={24} color="#06b6d4" />
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
                  <Ionicons name="close-circle" size={24} color="#ef4444" />
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
              <>
                <Text style={styles.submitButtonText}>Send Resume</Text>
                <Ionicons name="arrow-forward" size={20} color="#ffffff" />
              </>
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
                  ? 'Successfully connected to n8n webhook at 172.29.39.118:5678!' 
                  : 'Failed to connect to n8n webhook. Please check if n8n is running on 172.29.39.118:5678 and the webhook is active.',
                [{ text: 'OK' }]
              );
            }}
          >
            <Ionicons name="wifi" size={16} color="#64748b" />
            <Text style={styles.testButtonText}>Test Webhook Connection</Text>
          </TouchableOpacity>

          {/* Info Card */}
          <View style={styles.infoCard}>
            <Ionicons name="information-circle" size={20} color="#06b6d4" />
            <Text style={styles.infoText}>
              Your resume will be used to provide personalized assistance in the chat.
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
  uploadButton: {
    borderWidth: 2,
    borderColor: 'rgba(6, 182, 212, 0.3)',
    borderStyle: 'dashed',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    backgroundColor: 'rgba(6, 182, 212, 0.05)',
  },
  uploadText: {
    fontSize: 16,
    color: '#e2e8f0',
    marginTop: 12,
    fontWeight: '500',
  },
  uploadSubtext: {
    fontSize: 13,
    color: '#64748b',
    marginTop: 4,
  },
  fileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(6, 182, 212, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(6, 182, 212, 0.3)',
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
    color: '#e2e8f0',
    fontWeight: '500',
  },
  fileSize: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
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
  testButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#64748b',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    marginTop: 12,
  },
  testButtonText: {
    fontSize: 14,
    color: '#64748b',
    marginLeft: 8,
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

export default ResumeUploadScreen;