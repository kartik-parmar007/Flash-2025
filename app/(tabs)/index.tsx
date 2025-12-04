import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { COLORS, COMMON_STYLES, SPACING } from '../../constants/theme';
import { addMessageToHistory, getChatHistory, Message } from '../services/storage';

// ====== CONFIG ======
// Replace this with your n8n webhook URL
// IMPORTANT: replace 192.168.X.X with your actual computer's local IP address (find using ipconfig if on Windows)
const WEBHOOK_URL =
  "http://10.193.176.118:5678/webhook-test/08a00654-89b7-48d0-96b1-02eebede74ea";
const REQUEST_BODY_KEY = "message";

const ChatScreen = () => {
  const { sessionId } = useLocalSearchParams();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    const loadMessages = async () => {
      if (typeof sessionId === 'string') {
        const history = await getChatHistory();
        const session = history.find((s) => s.id === sessionId);
        if (session) {
          setMessages(session.messages);
        } else {
          const initialMessage: Message = {
            text: "👋 Hi! I'm connected to your n8n webhook. All your messages will be sent to n8n!",
            role: "bot",
            time: new Date().toLocaleTimeString(),
          };
          setMessages([initialMessage]);
          await addMessageToHistory(sessionId, initialMessage);
        }
      }
    };
    loadMessages();
  }, [sessionId]);

  const sendMessage = async () => {
    if (!input.trim() || typeof sessionId !== 'string') return;

    const userMessage: Message = {
      text: input,
      role: "user",
      time: new Date().toLocaleTimeString(),
    };
    setMessages((prev) => [...prev, userMessage]);
    await addMessageToHistory(sessionId, userMessage);

    const originalInput = input;
    setInput("");
    setIsTyping(true);

    try {
      const response = await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [REQUEST_BODY_KEY]: originalInput }),
      });

      // Check if request was successful
      if (!response.ok) {
        let errorMessage = `Server returned error ${response.status}`;
        if (response.status === 404) {
          errorMessage = 'Webhook not found. Please make sure you have clicked "Execute Workflow" in n8n, or switch to production mode.';
        }

        throw new Error(errorMessage);
      }

      let replyText;
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const json = await response.json();
        replyText = extractReply(json);
      } else {
        replyText = await response.text();
      }

      const botMessage: Message = {
        text: replyText,
        role: "bot",
        time: new Date().toLocaleTimeString(),
      };
      setMessages((prev) => [...prev, botMessage]);
      await addMessageToHistory(sessionId, botMessage);
    } catch (error: any) {
      const errorMessage: Message = {
        text: `❌ Error: ${error.message}`,
        role: "bot",
        time: new Date().toLocaleTimeString(),
      };
      setMessages((prev) => [...prev, errorMessage]);
      await addMessageToHistory(sessionId, errorMessage);
    } finally {
      setIsTyping(false);
    }
  };

  const extractReply = (data: any): string => {
    if (!data) return "✔️ Received (no content).";
    if (typeof data === "string") return data;
    if (data.output)
      return typeof data.output === "string"
        ? data.output
        : JSON.stringify(data.output, null, 2);
    if (data.message) return data.message;
    if (data.text) return data.text;
    if (data.data)
      return typeof data.data === "string"
        ? data.data
        : JSON.stringify(data.data, null, 2);
    return "Response:"
      + JSON.stringify(data, null, 2);
  };

  return (
    <LinearGradient colors={COLORS.background} style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Custom Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={COLORS.text.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Chat</Text>
        <View style={{ width: 40 }} />
      </View>

      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
      >
        <ScrollView
          ref={scrollViewRef}
          style={styles.log}
          contentContainerStyle={styles.logContent}
          onContentSizeChange={() =>
            scrollViewRef.current?.scrollToEnd({ animated: true })
          }
        >
          {messages.map((msg, index) => (
            <View key={index} style={[
              styles.msg,
              msg.role === 'user' ? styles.userMsg : styles.botMsg
            ]}>
              {msg.role === 'user' ? (
                <LinearGradient
                  colors={[COLORS.secondary, COLORS.primary]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.gradientBubble}
                >
                  <Text style={styles.msgText}>{msg.text}</Text>
                  <Text style={[styles.time, { color: 'rgba(255,255,255,0.7)' }]}>{msg.time}</Text>
                </LinearGradient>
              ) : (
                <View style={styles.glassBubble}>
                  <Text style={styles.msgText}>{msg.text}</Text>
                  <Text style={styles.time}>{msg.time}</Text>
                </View>
              )}
            </View>
          ))}
          {isTyping && (
            <View style={[styles.msg, styles.botMsg]}>
              <View style={styles.glassBubble}>
                <ActivityIndicator size="small" color={COLORS.text.secondary} />
              </View>
            </View>
          )}
        </ScrollView>
        <View style={styles.composer}>
          <TextInput
            style={styles.input}
            value={input}
            onChangeText={setInput}
            placeholder="Type your message…"
            placeholderTextColor={COLORS.text.muted}
            multiline
          />
          <TouchableOpacity
            style={styles.sendButtonWrapper}
            onPress={sendMessage}
            disabled={isTyping}
          >
            <LinearGradient
              colors={[COLORS.secondary, COLORS.primary]}
              style={styles.sendButton}
            >
              <Ionicons name="send" size={20} color="#fff" />
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.m,
    paddingTop: Platform.OS === 'android' ? 40 : 50,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
    backgroundColor: 'rgba(15, 12, 41, 0.5)',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text.primary,
  },
  backButton: {
    padding: 8,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  log: {
    flex: 1,
    padding: SPACING.m,
  },
  logContent: {
    paddingBottom: SPACING.m,
  },
  msg: {
    marginBottom: SPACING.m,
    maxWidth: "80%",
  },
  userMsg: {
    alignSelf: "flex-end",
  },
  botMsg: {
    alignSelf: "flex-start",
  },
  gradientBubble: {
    padding: 12,
    borderRadius: 20,
    borderBottomRightRadius: 4,
    ...COMMON_STYLES.shadow,
  },
  glassBubble: {
    padding: 12,
    borderRadius: 20,
    borderBottomLeftRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  msgText: {
    color: COLORS.text.primary,
    fontSize: 16,
    lineHeight: 22,
  },
  time: {
    fontSize: 11,
    color: COLORS.text.secondary,
    marginTop: 6,
    textAlign: "right"
  },
  composer: {
    flexDirection: "row",
    padding: SPACING.m,
    paddingBottom: Platform.OS === 'ios' ? 30 : SPACING.m,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
    backgroundColor: 'rgba(15, 12, 41, 0.9)',
  },
  input: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    color: COLORS.text.primary,
    marginRight: 10,
    maxHeight: 100,
    fontSize: 16,
  },
  sendButtonWrapper: {
    borderRadius: 24,
    ...COMMON_STYLES.shadow,
  },
  sendButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default ChatScreen;