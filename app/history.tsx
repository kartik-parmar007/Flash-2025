import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useFocusEffect } from 'expo-router';
import React, { useCallback, useState } from 'react';
import {
  Alert,
  Animated,
  FlatList,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { COLORS, COMMON_STYLES, SPACING } from '../constants/theme';
import { ChatSession, deleteChatSession, getChatHistory } from './services/storage';

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
          <LinearGradient
            colors={['rgba(255, 255, 255, 0.05)', 'rgba(255, 255, 255, 0.02)']}
            style={styles.sessionGradient}
          >
            <View style={styles.sessionContent}>
              <View style={styles.sessionIcon}>
                <Ionicons name="chatbubble-ellipses" size={20} color={COLORS.primary} />
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
              <Ionicons name="trash-outline" size={18} color={COLORS.error} />
            </TouchableOpacity>
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="chatbubbles-outline" size={64} color={COLORS.text.muted} style={{ opacity: 0.5, marginBottom: 16 }} />
      <Text style={styles.emptyTitle}>No Chat History</Text>
      <Text style={styles.emptySubtitle}>Start a new conversation to begin</Text>
    </View>
  );

  return (
    <LinearGradient colors={COLORS.background} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="light-content" />
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
            onPress={handleNewChat}
            activeOpacity={0.8}
            style={styles.newChatButtonWrapper}
          >
            <LinearGradient
              colors={[COLORS.secondary, COLORS.primary]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.newChatButton}
            >
              <Ionicons name="add" size={24} color="#fff" style={{ marginRight: 8 }} />
              <Text style={styles.newChatButtonText}>New Chat</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    paddingHorizontal: SPACING.l,
    paddingVertical: SPACING.l,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  headerTitle: {
    marginTop: SPACING.m,
    color: COLORS.text.primary,
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 4,
  },
  headerSubtitle: {
    color: COLORS.text.secondary,
    fontSize: 14,
    fontWeight: '500',
  },
  listContainer: {
    paddingTop: SPACING.s,
    paddingBottom: 100,
  },
  emptyListContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  sessionItemWrapper: {
    marginHorizontal: SPACING.m,
    marginVertical: SPACING.xs,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.card.border,
    ...COMMON_STYLES.shadow,
  },
  sessionItemContainer: {
    backgroundColor: 'transparent',
  },
  sessionGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.m,
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
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  sessionInfo: {
    flex: 1,
  },
  sessionTitle: {
    color: COLORS.text.primary,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  sessionDate: {
    color: COLORS.text.secondary,
    fontSize: 13,
    fontWeight: '400',
  },
  deleteButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: SPACING.l,
    left: SPACING.l,
    right: SPACING.l,
  },
  newChatButtonWrapper: {
    borderRadius: 16,
    ...COMMON_STYLES.shadow,
  },
  newChatButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 18,
    borderRadius: 16,
  },
  newChatButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyTitle: {
    color: COLORS.text.primary,
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtitle: {
    color: COLORS.text.secondary,
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
});

export default HistoryScreen;