import { useLocalSearchParams } from 'expo-router';
import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { getChatHistory, addMessageToHistory, Message } from '../services/storage';

// ====== CONFIG ======
// Replace this with your n8n webhook URL
// IMPORTANT: replace 192.168.X.X with your actual computer’s local IP address (find using ipconfig if on Windows)
const WEBHOOK_URL =
  "http://10.59.231.118:5678/webhook/01358e77-0252-46c7-80f9-200524927bdc"; 
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
            text: "👋 Hi! I'm connected to your n8n webhook. Send me a message!",
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
    setInput("");
    setIsTyping(true);

    try {
      const response = await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [REQUEST_BODY_KEY]: input }),
      });

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
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 20 : 0}
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
          <View key={index} style={[styles.msg, styles[msg.role]]}>
            <Text style={styles.msgText}>{msg.text}</Text>
            <Text style={styles.time}>{msg.time}</Text>
          </View>
        ))}
        {isTyping && (
          <View style={[styles.msg, styles.bot]}>
            <ActivityIndicator size="small" color="#9ca3af" />
          </View>
        )}
      </ScrollView>
      <View style={styles.composer}>
        <TextInput
          style={styles.input}
          value={input}
          onChangeText={setInput}
          placeholder="Type your message…"
          placeholderTextColor="#94a3b8"
          multiline
        />
        <TouchableOpacity
          style={styles.sendButton}
          onPress={sendMessage}
          disabled={isTyping}
        >
          <Text style={styles.sendButtonText}>➤</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0f172a", paddingTop: Platform.OS === "android" ? 40 : 20 },
  log: { flex: 1, padding: 18 },
  logContent: { paddingBottom: 10 },
  msg: {
    maxWidth: "80%",
    padding: 12,
    borderRadius: 16,
    marginBottom: 14,
  },
  user: {
    alignSelf: "flex-end",
    backgroundColor: "#06b6d4",
    borderBottomRightRadius: 6,
  },
  bot: {
    alignSelf: "flex-start",
    backgroundColor: "#1e293b",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.06)",
    borderBottomLeftRadius: 6,
  },
  msgText: { color: "#e5e7eb" },
  time: { fontSize: 11, color: "#94a3b8", marginTop: 6, textAlign: "right" },
  composer: {
    flexDirection: "row",
    padding: 14,
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.08)",
    backgroundColor: "#0b1220",
  },
  input: {
    flex: 1,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    backgroundColor: "#0a101d",
    color: "#e5e7eb",
    marginRight: 10,
    maxHeight: 120,
  },
  sendButton: {
    padding: 12,
    borderRadius: 12,
    backgroundColor: "#06b6d4",
    justifyContent: "center",
    alignItems: "center",
  },
  sendButtonText: { color: "#00212a", fontWeight: "700", fontSize: 18 },
});

export default ChatScreen;