import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  SafeAreaView,
} from 'react-native';
import { router } from 'expo-router';
import { MessageSquare, Tag } from 'lucide-react-native';
import { useAuth } from '@/context/AuthContext';
import { apiService } from '@/services/api';

interface Conversation {
  id: string;
  contact_name: string;
  contact_phone: string;
  last_message: string;
  last_message_time: string;
  unread_count: number;
  ai_summary?: string;
  ai_intent?: string;
  updated_at: string;
}

export default function InboxScreen() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { user } = useAuth();

  const fetchConversations = async () => {
    try {
      const response = await apiService.getConversations();
      setConversations(response.data);
    } catch (error) {
      console.error('Failed to fetch conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchConversations();
    setRefreshing(false);
  };

  // 🔄 Poll every 15s
  useEffect(() => {
    fetchConversations(); // initial load

    const interval = setInterval(() => {
      fetchConversations();
    }, 15000); // poll every 15 seconds

    return () => clearInterval(interval); // cleanup on unmount
  }, []);

  const renderConversation = ({ item }: { item: Conversation }) => (
    <TouchableOpacity
      style={styles.conversationItem}
      onPress={() =>
        router.push({
          pathname: '/conversation/[id]',
          params: { id: item.id },
        })
      }>
      <View style={styles.conversationHeader}>
        <View style={styles.contactInfo}>
          <View style={styles.avatar}>
            <MessageSquare size={20} color="#3B82F6" />
          </View>
          <View style={styles.contactDetails}>
            <Text style={styles.contactName}>{item.contact_name}</Text>
            <Text style={styles.contactPhone}>{item.contact_phone}</Text>
          </View>
        </View>
        <View style={styles.conversationMeta}>
          <Text style={styles.timestamp}>
            {new Date(item.last_message_time).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </Text>
          {item.unread_count > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadText}>{item.unread_count}</Text>
            </View>
          )}
        </View>
      </View>

      <Text style={styles.lastMessage} numberOfLines={2}>
        {item.last_message}
      </Text>

      {item.ai_summary && (
        <View style={styles.aiInsights}>
          <Text style={styles.aiSummary} numberOfLines={1}>
            📝 {item.ai_summary}
          </Text>
          {item.ai_intent && (
            <View style={styles.intentTag}>
              <Tag size={12} color="#10B981" />
              <Text style={styles.intentText}>{item.ai_intent}</Text>
            </View>
          )}
        </View>
      )}
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centered}>
          <Text style={styles.loadingText}>Loading conversations...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Inbox</Text>
        <Text style={styles.headerSubtitle}>
          {conversations.length} conversations
        </Text>
      </View>

      <FlatList
        data={conversations}
        keyExtractor={(item) => item.id}
        renderItem={renderConversation}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent', // ✅ gradient comes through
  },
  header: {
    padding: 24,
    paddingTop: 60,
    backgroundColor: 'transparent', // ✅ no block at top
  },
  headerTitle: {
    fontSize: 30,
    fontWeight: '800',
    fontFamily: 'FilsonProRegular',
    color: '#111827',
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 6,
  },
  listContainer: {
    padding: 20,
    gap: 16, // modern spacing between cards
  },
  conversationItem: {
    backgroundColor: '#FFFFFF', // ✅ card floats over gradient
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  conversationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  contactInfo: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#EEF2FF', // soft Alan blue tone
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  contactDetails: {
    flex: 1,
  },
  contactName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  contactPhone: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 2,
  },
  conversationMeta: {
    alignItems: 'flex-end',
  },
  timestamp: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  unreadBadge: {
    backgroundColor: '#EF4444',
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginTop: 6,
    minWidth: 20,
    alignItems: 'center',
  },
  unreadText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '600',
  },
  lastMessage: {
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 20,
    marginTop: 4,
    marginBottom: 10,
  },
  aiInsights: {
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    paddingTop: 10,
    gap: 6,
  },
  aiSummary: {
    fontSize: 13,
    color: '#4338CA', // indigo for AI feel
    fontStyle: 'italic',
  },
  intentTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    alignSelf: 'flex-start',
  },
  intentText: {
    fontSize: 12,
    color: '#059669',
    fontWeight: '600',
    marginLeft: 6,
    textTransform: 'capitalize',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#6B7280',
  },
});
