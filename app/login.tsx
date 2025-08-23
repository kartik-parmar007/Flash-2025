import { router } from 'expo-router';
import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Animated,
} from 'react-native';
import { Feather } from '@expo/vector-icons';

const LoginScreen = () => {
  const [password, setPassword] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(true);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const textInputRef = useRef<TextInput>(null);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  const handleLogin = () => {
    if (password === '1234') {
      router.replace('/history');
    } else {
      alert('Incorrect password');
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDarkMode ? '#0f172a' : '#f1f5f9',
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
    },
    title: {
      fontSize: 32,
      fontWeight: 'bold',
      color: isDarkMode ? '#e5e7eb' : '#1e293b',
      marginBottom: 40,
    },
    pinContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '80%',
      marginBottom: 30,
    },
    pinBox: {
      width: 60,
      height: 60,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : '#cbd5e1',
      backgroundColor: isDarkMode ? '#0a101d' : '#fff',
      justifyContent: 'center',
      alignItems: 'center',
    },
    pinText: {
      fontSize: 24,
      fontWeight: 'bold',
      color: isDarkMode ? '#e5e7eb' : '#1e293b',
    },
    hiddenInput: {
      position: 'absolute',
      width: 1,
      height: 1,
      opacity: 0,
    },
    button: {
      width: '100%',
      padding: 12,
      borderRadius: 12,
      backgroundColor: '#06b6d4',
      justifyContent: 'center',
      alignItems: 'center',
    },
    buttonText: {
      color: '#00212a',
      fontWeight: '700',
      fontSize: 18,
    },
    themeSwitcher: {
      position: 'absolute',
      top: 60,
      right: 20,
    },
  });

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <TouchableOpacity
        style={styles.themeSwitcher}
        onPress={() => setIsDarkMode(!isDarkMode)}
      >
        <Feather
          name={isDarkMode ? 'sun' : 'moon'}
          size={24}
          color={isDarkMode ? '#e5e7eb' : '#1e293b'}
        />
      </TouchableOpacity>
      <Animated.Text style={[styles.title, { opacity: fadeAnim }]}>
        Welcome
      </Animated.Text>
      <Animated.View style={{ opacity: fadeAnim }}>
        <TouchableOpacity onPress={() => textInputRef.current?.focus()}>
          <View style={styles.pinContainer}>
            {[...Array(4)].map((_, index) => (
              <View key={index} style={styles.pinBox}>
                <Text style={styles.pinText}>{password[index] || ''}</Text>
              </View>
            ))}
          </View>
        </TouchableOpacity>
        <TextInput
          ref={textInputRef}
          style={styles.hiddenInput}
          value={password}
          onChangeText={setPassword}
          maxLength={4}
          keyboardType="numeric"
          secureTextEntry
        />
      </Animated.View>
      <Animated.View style={[{ width: '100%' }, { opacity: fadeAnim }]}>
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
      </Animated.View>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;
