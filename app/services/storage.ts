import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Message {
  text: string;
  role: 'user' | 'bot';
  time: string;
}

export interface ChatSession {
  id: string;
  messages: Message[];
}

const CHAT_HISTORY_KEY = 'chat_history';

export const getChatHistory = async (): Promise<ChatSession[]> => {
  try {
    const jsonValue = await AsyncStorage.getItem(CHAT_HISTORY_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (e) {
    console.error('Failed to load chat history.', e);
    return [];
  }
};

export const saveChatHistory = async (history: ChatSession[]) => {
  try {
    const jsonValue = JSON.stringify(history);
    await AsyncStorage.setItem(CHAT_HISTORY_KEY, jsonValue);
  } catch (e) {
    console.error('Failed to save chat history.', e);
  }
};

export const addMessageToHistory = async (sessionId: string, message: Message) => {
  const history = await getChatHistory();
  const session = history.find((s) => s.id === sessionId);
  if (session) {
    session.messages.push(message);
  } else {
    history.push({ id: sessionId, messages: [message] });
  }
  await saveChatHistory(history);
};

export const deleteChatSession = async (sessionId: string) => {
  const history = await getChatHistory();
  const updatedHistory = history.filter((session) => session.id !== sessionId);
  await saveChatHistory(updatedHistory);
};
