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
  StatusBar,
  SafeAreaView,
} from 'react-native';
import { getChatHistory, ChatSession, deleteChatSession } from './services/storage';

const HistoryScreen = () => {
  const [history, setHistory] = useState<ChatSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadHistory = useCallback(async () => {
    try {
      setIsLoading(true);
      const chatHistory = await getChatHistory();
      setHistory(chatHistory);
    } catch (error) {
      console.error('Error loading chat history:', error);
    } finally {
      setIsLoading(false);
    }
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
              await loadHistory();
            } catch (error) {
              Alert.alert('Error', 'Failed to delete chat session');
            }
          },
        },
      ]
    );
  }, [loadHistory]);

  const formatDate = (timestamp: string) => {
    const date = new Date(parseInt(timestamp));
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) {
      return `Today, ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } else if (days === 1) {
      return `Yesterday, ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } else if (days < 7) {
      return `${days} days ago`;
    } else {
      return date.toLocaleDateString([], { 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  };

  const renderChatItem = ({ item, index }: { item: ChatSession; index: number }) => {
    const sessionDate = formatDate(item.id);
    const animatedValue = new Animated.Value(0);
    
    const handlePressIn = () => {
      Animated.spring(animatedValue, {
        toValue: 1,
        useNativeDriver: true,
      }).start();
    };

    const handlePressOut = () => {
      Animated.spring(animatedValue, {
        toValue: 0,
        useNativeDriver: true,
      }).start();
    };

    const scale = animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [1, 0.98],
    });

    return (
      <Animated.View style={[styles.sessionItemWrapper, { transform: [{ scale }] }]}>
        <TouchableOpacity
          style={styles.sessionItemContainer}
          onPress={() => router.push(`/(tabs)?sessionId=${item.id}`)}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          activeOpacity={1}
        >
          <View style={styles.sessionContent}>
            <View style={styles.sessionIcon}>
              <Text style={styles.sessionIconText}>💬</Text>
            </View>
            <View style={styles.sessionInfo}>
              <Text style={styles.sessionTitle}>Chat Session</Text>
              <Text style={styles.sessionDate}>{sessionDate}</Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => handleDeleteChat(item.id, sessionDate)}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Text style={styles.deleteButtonText}>🗑️</Text>
          </TouchableOpacity>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyIcon}>💭</Text>
      <Text style={styles.emptyTitle}>No Chat History</Text>
      <Text style={styles.emptySubtitle}>Start a new conversation to begin</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#0f172a" />
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Chat History</Text>
          <Text style={styles.headerSubtitle}>
            {history.length} {history.length === 1 ? 'conversation' : 'conversations'}
          </Text>
        </View>

        <FlatList
          data={history}
          keyExtractor={(item) => item.id}
          renderItem={renderChatItem}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={history.length === 0 ? styles.emptyListContainer : styles.listContainer}
          ListEmptyComponent={renderEmptyState}
        />

        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={styles.newChatButton} 
            onPress={handleNewChat}
            activeOpacity={0.8}
          >
            <Text style={styles.newChatIcon}>✨</Text>
            <Text style={styles.newChatButtonText}>New Chat</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#1e293b',
  },
  headerTitle: {
    marginTop: 20,
    color: '#d8e0e8ff',
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 4,
  },
  headerSubtitle: {
    color: '#a2a9b3ff',
    fontSize: 14,
    fontWeight: '500',
  },
  listContainer: {
    paddingTop: 8,
  },
  emptyListContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  sessionItemWrapper: {
    marginHorizontal: 16,
    marginVertical: 4,
  },
  sessionItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sessionContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  sessionIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#334155',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  sessionIconText: {
    fontSize: 18,
  },
  sessionInfo: {
    flex: 1,
  },
  sessionTitle: {
    color: '#f1f5f9',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  sessionDate: {
    color: '#94a3b8',
    fontSize: 14,
    fontWeight: '400',
  },
  deleteButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#dc262620',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
  },
  deleteButtonText: {
    fontSize: 16,
  },
  buttonContainer: {
    padding: 20,
    paddingTop: 12,
  },
  newChatButton: {
    backgroundColor: '#06b6d4',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 18,
    borderRadius: 16,
    shadowColor: '#06b6d4',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  newChatIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  newChatButtonText: {
    color: '#0f172a',
    fontWeight: '700',
    fontSize: 16,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
    opacity: 0.6,
  },
  emptyTitle: {
    color: '#f1f5f9',
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtitle: {
    color: '#94a3b8',
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
});

export default HistoryScreen;