import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    FlatList,
    Platform,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { COLORS, SPACING } from '../constants/theme';
import { ChatSession, clearChatHistory, getChatHistory } from './services/storage';

export default function HistoryScreen() {
    const [history, setHistory] = useState<ChatSession[]>([]);
    const router = useRouter();

    useEffect(() => {
        loadHistory();
    }, []);

    const loadHistory = async () => {
        const sessions = await getChatHistory();
        setHistory(sessions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    };

    const handleClearHistory = async () => {
        await clearChatHistory();
        setHistory([]);
    };

    const handleNewChat = () => {
        // Navigate to chat with a new random session ID or handle logic
        router.push({ pathname: '/(tabs)', params: { sessionId: Date.now().toString() } });
    };

    const openSession = (sessionId: string) => {
        router.push({ pathname: '/(tabs)', params: { sessionId } });
    };

    const formatDate = (dateString: string) => {
        const options: Intl.DateTimeFormatOptions = {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const renderItem = ({ item }: { item: ChatSession }) => (
        <TouchableOpacity
            style={styles.card}
            onPress={() => openSession(item.id)}
            activeOpacity={0.7}
        >
            <LinearGradient
                colors={['rgba(30, 41, 59, 0.8)', 'rgba(15, 23, 42, 0.9)']}
                style={styles.cardGradient}
            >
                <View style={styles.cardHeader}>
                    <View style={styles.cardHeaderLeft}>
                        <Ionicons name="chatbubble-ellipses-outline" size={18} color={COLORS.primary} style={{ marginRight: 8 }} />
                        <Text style={styles.date}>{formatDate(item.date)}</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={16} color={COLORS.text.muted} />
                </View>

                <Text style={styles.preview} numberOfLines={2}>
                    {item.messages.length > 0
                        ? item.messages[item.messages.length - 1].text
                        : 'No messages'}
                </Text>

                <View style={styles.cardFooter}>
                    <Text style={styles.msgCount}>{item.messages.length} messages</Text>
                </View>
            </LinearGradient>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor={COLORS.background[0]} />
            <LinearGradient colors={COLORS.background as any} style={styles.container}>

                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color={COLORS.primary} />
                    </TouchableOpacity>
                    <Text style={styles.title}>Operation Logs</Text>
                    <View style={styles.headerActions}>
                        <TouchableOpacity onPress={handleNewChat} style={styles.actionButton}>
                            <Ionicons name="add-circle-outline" size={24} color={COLORS.success} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handleClearHistory} style={styles.actionButton}>
                            <Ionicons name="trash-outline" size={22} color={COLORS.error} />
                        </TouchableOpacity>
                    </View>
                </View>

                <FlatList
                    data={history}
                    keyExtractor={(item) => item.id}
                    renderItem={renderItem}
                    contentContainerStyle={styles.listContent}
                    ListEmptyComponent={
                        <View style={styles.emptyContainer}>
                            <Ionicons name="terminal-outline" size={64} color={COLORS.text.muted} />
                            <Text style={styles.emptyText}>No logs found.</Text>
                        </View>
                    }
                />
            </LinearGradient>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: Platform.OS === 'android' ? 50 : 60,
        paddingHorizontal: SPACING.m,
        paddingBottom: 20,
        backgroundColor: 'rgba(15, 23, 42, 0.9)',
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255, 255, 255, 0.05)',
    },
    backButton: {
        padding: 8,
    },
    title: {
        fontSize: 18,
        fontWeight: '700',
        color: COLORS.text.primary,
        letterSpacing: 1,
    },
    headerActions: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    actionButton: {
        padding: 8,
        marginLeft: 8,
    },
    listContent: {
        padding: SPACING.m,
    },
    card: {
        marginBottom: 12,
        borderRadius: 12,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(56, 189, 248, 0.2)',
    },
    cardGradient: {
        padding: 16,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    cardHeaderLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    date: {
        fontSize: 14,
        color: COLORS.primary,
        fontWeight: '600',
    },
    preview: {
        fontSize: 15,
        color: COLORS.text.secondary,
        marginBottom: 12,
        lineHeight: 22,
    },
    cardFooter: {
        borderTopWidth: 1,
        borderTopColor: 'rgba(255, 255, 255, 0.05)',
        paddingTop: 8,
    },
    msgCount: {
        fontSize: 12,
        color: COLORS.text.muted,
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 100,
    },
    emptyText: {
        marginTop: 16,
        fontSize: 16,
        color: COLORS.text.muted,
    },
});