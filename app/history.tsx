import { router, useFocusEffect } from 'expo-router';
import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Animated,
  PanGestureHandler,
  State,
} from 'react-native';
import { getChatHistory, ChatSession, deleteChatSession } from './services/storage';

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

  const handleDeleteChat = useCallback((sessionId: string, sessionDate: string) => {
    Alert.alert(
      'Delete Chat',
      `Are you sure you want to delete the chat from ${sessionDate}?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteChatSession(sessionId);
              await loadHistory(); // Reload the history after deletion
            } catch (error) {
              Alert.alert('Error', 'Failed to delete chat session');
            }
          },
        },
      ]
    );
  }, [loadHistory]);

  const renderChatItem = ({ item }: { item: ChatSession }) => {
    const sessionDate = new Date(parseInt(item.id)).toLocaleString();
    
    return (
      <View style={styles.sessionItemContainer}>
        <TouchableOpacity
          style={styles.sessionItem}
          onPress={() => router.push(`/(tabs)?sessionId=${item.id}`)}
        >
          <Text style={styles.sessionText}>Chat on {sessionDate}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleDeleteChat(item.id, sessionDate)}
        >
          <Text style={styles.deleteButtonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={history}
        keyExtractor={(item) => item.id}
        renderItem={renderChatItem}
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
  sessionItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#1e293b',
  },
  sessionItem: {
    flex: 1,
    padding: 15,
  },
  sessionText: {
    color: '#e5e7eb',
    fontSize: 16,
  },
  deleteButton: {
    backgroundColor: '#dc2626',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 8,
    marginRight: 10,
  },
  deleteButtonText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 14,
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