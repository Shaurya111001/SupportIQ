import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  SafeAreaView,
} from 'react-native';
import { TrendingUp, MessageCircle, Clock, Target } from 'lucide-react-native';
import { apiService } from '@/services/api';

interface AnalyticsData {
  total_conversations: number;
  total_messages: number;
  avg_response_time: number;
  top_intents: Array<{ intent: string; count: number }>;
  daily_volume: Array<{ date: string; count: number }>;
}

export default function AnalyticsScreen() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchAnalytics = async () => {
    try {
      const response = await apiService.getAnalytics();
      setAnalytics(response.data);
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchAnalytics();
    setRefreshing(false);
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centered}>
          <Text style={styles.loadingText}>Loading analytics...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Analytics</Text>
          <Text style={styles.headerSubtitle}>AI-powered insights</Text>
        </View>

        <View style={styles.metricsGrid}>
          <View style={[styles.metricCard, styles.primaryCard]}>
            <MessageCircle size={24} color="#3B82F6" />
            <Text style={styles.metricValue}>
              {analytics?.total_conversations || 0}
            </Text>
            <Text style={styles.metricLabel}>Total Conversations</Text>
          </View>

          <View style={styles.metricCard}>
            <TrendingUp size={24} color="#10B981" />
            <Text style={styles.metricValue}>
              {analytics?.total_messages || 0}
            </Text>
            <Text style={styles.metricLabel}>Messages Processed</Text>
          </View>

          <View style={styles.metricCard}>
            <Clock size={24} color="#F59E0B" />
            <Text style={styles.metricValue}>
              {analytics?.avg_response_time || 0}m
            </Text>
            <Text style={styles.metricLabel}>Avg Response Time</Text>
          </View>

          <View style={styles.metricCard}>
            <Target size={24} color="#8B5CF6" />
            <Text style={styles.metricValue}>
              {analytics?.top_intents?.length || 0}
            </Text>
            <Text style={styles.metricLabel}>Intent Categories</Text>
          </View>
        </View>

        {analytics?.top_intents && analytics.top_intents.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Top Customer Intents</Text>
            <View style={styles.intentsList}>
              {analytics.top_intents.map((intent, index) => (
                <View key={intent.intent} style={styles.intentItem}>
                  <View style={styles.intentRank}>
                    <Text style={styles.rankText}>{index + 1}</Text>
                  </View>
                  <View style={styles.intentDetails}>
                    <Text style={styles.intentName}>{intent.intent}</Text>
                    <Text style={styles.intentCount}>{intent.count} messages</Text>
                  </View>
                  <View style={styles.intentProgress}>
                    <View
                      style={[
                        styles.progressBar,
                        {
                          width: `${
                            (intent.count /
                              Math.max(...analytics.top_intents.map(i => i.count))) *
                            100
                          }%`,
                        },
                      ]}
                    />
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>AI Processing Status</Text>
          <View style={styles.statusCard}>
            <View style={styles.statusItem}>
              <View style={[styles.statusDot, { backgroundColor: '#10B981' }]} />
              <Text style={styles.statusText}>
                Conversation Summarization: Active
              </Text>
            </View>
            <View style={styles.statusItem}>
              <View style={[styles.statusDot, { backgroundColor: '#3B82F6' }]} />
              <Text style={styles.statusText}>Intent Classification: Active</Text>
            </View>
            <View style={styles.statusItem}>
              <View style={[styles.statusDot, { backgroundColor: '#F59E0B' }]} />
              <Text style={styles.statusText}>
                Sensitive Data Masking: Enabled
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent', // ✅ let global gradient show
  },
  scrollContainer: {
    paddingBottom: 20,
  },
  header: {
    padding: 20,
    paddingTop: 60,
    backgroundColor: 'transparent', // ✅ remove solid block
    borderBottomWidth: 0,           // ✅ no harsh border
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#111827',
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 16,
    gap: 12,
  },
  metricCard: {
    backgroundColor: '#FFFFFF', // ✅ floating white card
    padding: 20,
    borderRadius: 16,
    width: '48%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  primaryCard: {
    backgroundColor: '#FFF1E0', // ✅ warm peach highlight
  },
  metricValue: {
    fontSize: 26,
    fontWeight: '700',
    color: '#FF7A45', // ✅ Alan warm orange accent
    marginTop: 8,
  },
  metricLabel: {
    fontSize: 13,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 4,
  },
  section: {
    margin: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 16,
  },
  intentsList: {
    gap: 12,
  },
  intentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  intentRank: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FF7A45', // ✅ warm accent instead of blue
    alignItems: 'center',
    justifyContent: 'center',
  },
  rankText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  intentDetails: {
    flex: 1,
  },
  intentName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
    textTransform: 'capitalize',
  },
  intentCount: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  intentProgress: {
    width: 60,
    height: 4,
    backgroundColor: '#FFE1C5', // ✅ peach track
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#FF7A45', // ✅ orange fill
  },
  statusCard: {
    gap: 12,
  },
  statusItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 14,
    color: '#4B5563',
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
