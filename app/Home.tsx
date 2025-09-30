// app/Home.js
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function Home() {
  const [historyEntry, setHistoryEntry] = useState('');
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
    <View style={styles.container}>
      <Text style={styles.title}>🏠 Home Page</Text>

      {/* Navigation Section */}
      <View style={styles.navigationSection}>
        <Text style={styles.sectionTitle}>📄 Resume & Location</Text>
        <Text style={styles.sectionDescription}>
          Upload your resume and provide your email for personalized assistance
        </Text>
        
        {/* Resume Upload Button */}
        <TouchableOpacity style={styles.resumeButton} onPress={navigateToResume}>
          <Ionicons name="document-text" size={20} color="#ffffff" />
          <Text style={styles.resumeButtonText}>Upload Resume</Text>
          <Ionicons name="arrow-forward" size={16} color="#ffffff" />
        </TouchableOpacity>
        
        <View style={styles.buttonSpacing} />
        
        {/* Resume Location Button */}
        <TouchableOpacity style={styles.locationButton} onPress={navigateToResumeLocation}>
          <Ionicons name="location" size={20} color="#ffffff" />
          <Text style={styles.locationButtonText}>Get Mail ID</Text>
          <Ionicons name="arrow-forward" size={16} color="#ffffff" />
        </TouchableOpacity>
      </View>

      {/* History Section */}
      <View style={styles.historySection}>
        <Text style={styles.sectionTitle}>🕘 History Section</Text>
        <Text style={styles.sectionDescription}>
          View your chat history and previous conversations
        </Text>
        <TouchableOpacity style={styles.historyButton} onPress={navigateToHistory}>
          <Ionicons name="time" size={20} color="#ffffff" />
          <Text style={styles.historyButtonText}>View History</Text>
          <Ionicons name="arrow-forward" size={16} color="#ffffff" />
        </TouchableOpacity>
        
        <View style={styles.divider} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#0f172a',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#e2e8f0',
    marginBottom: 30,
    textAlign: 'center',
  },
  navigationSection: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 20,
    marginBottom: 30,
    borderWidth: 1,
    borderColor: 'rgba(6, 182, 212, 0.2)',
  },
  historySection: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#e2e8f0',
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 14,
    color: '#94a3b8',
    marginBottom: 16,
    lineHeight: 20,
  },
  resumeButton: {
    backgroundColor: '#06b6d4',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 10,
    shadowColor: '#06b6d4',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  resumeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    marginHorizontal: 8,
  },
  buttonSpacing: {
    height: 12,
  },
  locationButton: {
    backgroundColor: '#f59e0b',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 10,
    shadowColor: '#f59e0b',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  locationButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    marginHorizontal: 8,
  },
  textInput: {
    backgroundColor: '#0f172a',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#e2e8f0',
    marginBottom: 16,
  },
  saveButton: {
    backgroundColor: '#10b981',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
  historyButton: {
    backgroundColor: '#8b5cf6',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 10,
    shadowColor: '#8b5cf6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
    marginBottom: 20,
  },
  historyButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    marginHorizontal: 8,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginBottom: 16,
  },
  subsectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#e2e8f0',
    marginBottom: 12,
  },
});
