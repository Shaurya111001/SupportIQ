import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { MessageSquare, CircleCheck as CheckCircle, ArrowRight } from 'lucide-react-native';
import { useAuth } from '@/context/AuthContext';

export default function ConnectWhatsAppScreen() {
  const [connecting, setConnecting] = useState(false);
  const { connectWhatsApp, user } = useAuth();

  const handleConnectWhatsApp = async () => {
    setConnecting(true);
    try {
      const result = await connectWhatsApp();
      if (result.success) {
        Alert.alert(
          'Success!',
          'WhatsApp Business account connected successfully. You can now receive and manage customer messages.',
          [
            {
              text: 'Continue',
              onPress: () => router.replace('/(tabs)'),
            },
          ]
        );
      } else {
        Alert.alert('Connection Failed', result.error);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to connect WhatsApp. Please try again.');
    } finally {
      setConnecting(false);
    }
  };

  const handleSkipForNow = () => {
    Alert.alert(
      'Skip WhatsApp Connection?',
      'You can connect your WhatsApp Business account later from the Profile section.',
      [
        { text: 'Connect Now', style: 'cancel' },
        {
          text: 'Skip',
          onPress: () => router.replace('/(tabs)'),
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.logo}>
            <MessageSquare size={48} color="#25D366" />
          </View>
          <Text style={styles.title}>Connect WhatsApp Business</Text>
          <Text style={styles.subtitle}>
            Connect your WhatsApp Business account to start receiving and managing customer messages with AI assistance.
          </Text>
        </View>

        <View style={styles.features}>
          <View style={styles.feature}>
            <CheckCircle size={20} color="#10B981" />
            <Text style={styles.featureText}>Auto-receive customer messages</Text>
          </View>
          <View style={styles.feature}>
            <CheckCircle size={20} color="#10B981" />
            <Text style={styles.featureText}>AI-powered conversation analysis</Text>
          </View>
          <View style={styles.feature}>
            <CheckCircle size={20} color="#10B981" />
            <Text style={styles.featureText}>Intent classification and tagging</Text>
          </View>
          <View style={styles.feature}>
            <CheckCircle size={20} color="#10B981" />
            <Text style={styles.featureText}>Real-time message synchronization</Text>
          </View>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.connectButton, connecting && styles.buttonDisabled]}
            onPress={handleConnectWhatsApp}
            disabled={connecting}>
            <MessageSquare size={20} color="#FFFFFF" />
            <Text style={styles.connectButtonText}>
              {connecting ? 'Connecting...' : 'Connect WhatsApp Business'}
            </Text>
            <ArrowRight size={16} color="#FFFFFF" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.skipButton}
            onPress={handleSkipForNow}>
            <Text style={styles.skipButtonText}>Skip for now</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.info}>
          <Text style={styles.infoText}>
            🔒 Your WhatsApp credentials are securely encrypted and never shared with third parties.
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent', // ✅ let gradient shine
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#E8FFF1', // ✅ softer green tint
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 28,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 12,
    textAlign: 'center',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
    marginHorizontal: 12,
  },
  features: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 16,
    marginBottom: 32,
    gap: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  featureText: {
    fontSize: 14,
    color: '#374151',
    flex: 1,
  },
  actions: {
    gap: 14,
    marginBottom: 28,
  },
  connectButton: {
    backgroundColor: '#25D366', // ✅ WhatsApp brand green
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  buttonDisabled: {
    backgroundColor: '#9CA3AF',
  },
  connectButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  skipButton: {
    alignItems: 'center',
    padding: 12,
  },
  skipButtonText: {
    color: '#6B7280',
    fontSize: 14,
    fontWeight: '500',
  },
  info: {
    backgroundColor: '#FFF1E0', // ✅ Alan peach instead of blue
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  infoText: {
    fontSize: 12,
    color: '#A24A17', // ✅ warm amber text
    textAlign: 'center',
    lineHeight: 18,
  },
});
