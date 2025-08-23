import { router, useFocusEffect } from 'expo-router';
import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { getChatHistory, ChatSession } from './services/storage';

const HistoryScreen = () => {
  const [history, setHistory] = useState<ChatSession[]>([]);

  const loadHistory = useCallback(async () => {
    const chatHistory = await getChatHistory();
    setHistory(chatHistory);
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadHistory();
    }, [loadHistory])
  );

  const handleNewChat = () => {
    const newSessionId = Date.now().toString();
    router.push(`/(tabs)?sessionId=${newSessionId}`);
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={history}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.sessionItem}
            onPress={() => router.push(`/(tabs)?sessionId=${item.id}`)}
          >
            <Text style={styles.sessionText}>Chat on {new Date(parseInt(item.id)).toLocaleString()}</Text>
          </TouchableOpacity>
        )}
      />
      <TouchableOpacity style={styles.newChatButton} onPress={handleNewChat}>
        <Text style={styles.newChatButtonText}>+ New Chat</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
    padding: 10,
  },
  sessionItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#1e293b',
  },
  sessionText: {
    color: '#e5e7eb',
    fontSize: 16,
  },
  newChatButton: {
    backgroundColor: '#06b6d4',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    margin: 10,
  },
  newChatButtonText: {
    color: '#00212a',
    fontWeight: '700',
    fontSize: 18,
  },
});

export default HistoryScreen;
