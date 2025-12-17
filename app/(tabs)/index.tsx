import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
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
import { COLORS, SPACING } from '../../constants/theme';
import { addMessageToHistory, getChatHistory, Message } from '../services/storage';

// ====== CONFIG ======
const WEBHOOK_URL =
  "http://10.132.149.118:5678/webhook-test/08a00654-89b7-48d0-96b1-02eebede74ea";
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
            text: "Protocol Initialized. Awaiting Input.",
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

      if (!response.ok) {
        throw new Error(`Server Error ${response.status}`);
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
        text: `Error: ${error.message}`,
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
    if (!data) return "Received.";
    if (typeof data === "string") return data;
    if (data.output)
      return typeof data.output === "string"
        ? data.output
        : JSON.stringify(data.output, null, 2);
    if (data.message) return data.message;
    if (data.text) return data.text;
    return JSON.stringify(data, null, 2);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background[0]} />
      <LinearGradient colors={COLORS.background as any} style={styles.background}>

        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={COLORS.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>SECURE COMMS</Text>
          <View style={{ width: 40 }} />
        </View>

        <KeyboardAvoidingView
          style={styles.keyboardAvoidingView}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
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
                <View style={[
                  styles.bubble,
                  msg.role === 'user' ? styles.userBubble : styles.botBubble
                ]}>
                  <Text style={[
                    styles.msgText,
                    msg.role === 'user' ? styles.userText : styles.botText
                  ]}>{msg.text}</Text>
                </View>
                <Text style={styles.time}>{msg.time}</Text>
              </View>
            ))}
            {isTyping && (
              <View style={[styles.msg, styles.botMsg]}>
                <View style={[styles.bubble, styles.botBubble]}>
                  <ActivityIndicator size="small" color={COLORS.primary} />
                </View>
              </View>
            )}
          </ScrollView>

          <View style={styles.composerContainer}>
            <TextInput
              style={styles.input}
              value={input}
              onChangeText={setInput}
              placeholder="Enter command..."
              placeholderTextColor={COLORS.text.muted}
              multiline
            />
            <TouchableOpacity
              style={[styles.sendButton, !input.trim() && styles.sendButtonDisabled]}
              onPress={sendMessage}
              disabled={isTyping || !input.trim()}
            >
              <Ionicons name="send" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background[0],
  },
  background: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: Platform.OS === 'android' ? 50 : 60,
    paddingBottom: 16,
    paddingHorizontal: SPACING.m,
    backgroundColor: 'rgba(15, 23, 42, 0.9)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.primary,
    letterSpacing: 2,
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
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
    marginBottom: 16,
    maxWidth: "85%",
  },
  userMsg: {
    alignSelf: "flex-end",
    alignItems: 'flex-end',
  },
  botMsg: {
    alignSelf: "flex-start",
    alignItems: 'flex-start',
  },
  bubble: {
    padding: 12,
    borderRadius: 20,
    maxWidth: '100%',
  },
  userBubble: {
    backgroundColor: 'rgba(56, 189, 248, 0.2)',
    borderBottomRightRadius: 4,
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.3)',
  },
  botBubble: {
    backgroundColor: 'rgba(30, 41, 59, 0.7)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
    borderBottomLeftRadius: 4,
  },
  msgText: {
    fontSize: 16,
    lineHeight: 24,
  },
  userText: {
    color: COLORS.primary,
  },
  botText: {
    color: COLORS.text.primary,
  },
  time: {
    fontSize: 11,
    color: COLORS.text.muted,
    marginTop: 4,
    marginHorizontal: 4,
  },
  composerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.m,
    paddingBottom: Platform.OS === 'ios' ? 30 : SPACING.m,
    backgroundColor: 'rgba(15, 23, 42, 0.9)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.05)',
  },
  input: {
    flex: 1,
    minHeight: 44,
    maxHeight: 100,
    backgroundColor: 'rgba(30, 41, 59, 0.5)',
    borderRadius: 22,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 16,
    color: COLORS.text.primary,
    marginRight: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 4,
  },
  sendButtonDisabled: {
    backgroundColor: COLORS.text.muted,
    opacity: 0.5,
    shadowOpacity: 0,
  }
});

export default ChatScreen;