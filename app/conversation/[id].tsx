import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, User, Bot } from 'lucide-react-native';
import { apiService } from '@/services/api';

interface Message {
  id: string;
  content: string;
  sender_type: 'customer' | 'business';
  timestamp: string;
  whatsapp_message_id?: string;
}

interface Conversation {
  id: string;
  contact_name: string;
  contact_phone: string;
  ai_summary?: string;
  ai_intent?: string;
  created_at: string;
}

export default function ConversationDetailScreen() {
  const { id } = useLocalSearchParams();
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchConversationData();
  }, [id]);

  const fetchConversationData = async () => {
    try {
      const [conversationResponse, messagesResponse] = await Promise.all([
        apiService.getConversation(id as string),
        apiService.getMessages(id as string),
      ]);

      setConversation(conversationResponse.data);
      setMessages(messagesResponse.data);
    } catch (error) {
      console.error('Failed to fetch conversation:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderMessage = ({ item }: { item: Message }) => (
    <View
      style={[
        styles.messageContainer,
        item.sender_type === 'customer'
          ? styles.customerMessage
          : styles.businessMessage,
      ]}>
      <View style={styles.messageHeader}>
        <View style={styles.senderIcon}>
          {item.sender_type === 'customer' ? (
            <User size={12} color="#6B7280" />
          ) : (
            <Bot size={12} color="#3B82F6" />
          )}
        </View>
        <Text style={styles.senderText}>
          {item.sender_type === 'customer' ? 'Customer' : 'Business'}
        </Text>
        <Text style={styles.timestamp}>
          {new Date(item.timestamp).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </Text>
      </View>
      <Text style={styles.messageContent}>{item.content}</Text>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centered}>
          <Text style={styles.loadingText}>Loading conversation...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}>
          <ArrowLeft size={20} color="#374151" />
        </TouchableOpacity>
        <View style={styles.headerInfo}>
          <Text style={styles.headerTitle}>{conversation?.contact_name}</Text>
          <Text style={styles.headerSubtitle}>
            {conversation?.contact_phone}
          </Text>
        </View>
      </View>

      {conversation?.ai_summary && (
        <View style={styles.aiSummaryCard}>
          <Text style={styles.aiSummaryTitle}>AI Summary</Text>
          <Text style={styles.aiSummaryText}>{conversation.ai_summary}</Text>
          {conversation.ai_intent && (
            <View style={styles.intentTag}>
              <Text style={styles.intentText}>{conversation.ai_intent}</Text>
            </View>
          )}
        </View>
      )}

      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderMessage}
        contentContainerStyle={styles.messagesList}
        showsVerticalScrollIndicator={false}
        inverted
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    paddingTop: 60,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    gap: 12,
  },
  backButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
  },
  headerInfo: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  aiSummaryCard: {
    backgroundColor: '#EBF4FF',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#3B82F6',
  },
  aiSummaryTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#3B82F6',
    marginBottom: 8,
  },
  aiSummaryText: {
    fontSize: 14,
    color: '#1F2937',
    lineHeight: 20,
    marginBottom: 8,
  },
  intentTag: {
    backgroundColor: '#DBEAFE',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  intentText: {
    fontSize: 11,
    color: '#3B82F6',
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  messagesList: {
    padding: 16,
    gap: 12,
  },
  messageContainer: {
    padding: 12,
    borderRadius: 12,
    maxWidth: '85%',
  },
  customerMessage: {
    backgroundColor: '#FFFFFF',
    alignSelf: 'flex-start',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  businessMessage: {
    backgroundColor: '#EBF4FF',
    alignSelf: 'flex-end',
  },
  messageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 6,
  },
  senderIcon: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  senderText: {
    fontSize: 11,
    fontWeight: '500',
    color: '#6B7280',
    flex: 1,
  },
  timestamp: {
    fontSize: 10,
    color: '#9CA3AF',
  },
  messageContent: {
    fontSize: 14,
    color: '#111827',
    lineHeight: 20,
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