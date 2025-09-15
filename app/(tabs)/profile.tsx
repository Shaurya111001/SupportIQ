import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { Settings, MessageSquare, LogOut, User } from 'lucide-react-native';
import { useAuth } from '@/context/AuthContext';

export default function ProfileScreen() {
  const { user, logout, whatsappConnected, disconnectWhatsapp } = useAuth();

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: () => {
            logout();
            router.replace('/auth/login');
          },
        },
      ]
    );
  };

  const handleDisconnectWhatsApp = () => {
    Alert.alert(
      'Disconnect WhatsApp',
      'Are you sure you want to disconnect WhatsApp? You will stop receiving messages.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Disconnect',
          style: 'destructive',
          onPress: disconnectWhatsapp,
        },
      ]
    );
  };

  const handleConnectWhatsApp = () => {
    router.push('/auth/connect-whatsapp');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
      </View>

      <View style={styles.userInfo}>
        <View style={styles.avatar}>
          <User size={32} color="#3B82F6" />
        </View>
        <Text style={styles.userName}>{user?.business_name || 'Business'}</Text>
        <Text style={styles.userEmail}>{user?.email}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>WhatsApp Business</Text>
        <View style={styles.whatsappCard}>
          <View style={styles.whatsappStatus}>
            <MessageSquare size={20} color="#25D366" />
            <Text style={styles.whatsappText}>
              {whatsappConnected ? 'Connected' : 'Not Connected'}
            </Text>
          </View>
          <TouchableOpacity
            style={[
              styles.whatsappButton,
              whatsappConnected ? styles.disconnectButton : styles.connectButton,
            ]}
            onPress={
              whatsappConnected ? handleDisconnectWhatsApp : handleConnectWhatsApp
            }>
            <Text
              style={[
                styles.buttonText,
                whatsappConnected ? styles.disconnectText : styles.connectText,
              ]}>
              {whatsappConnected ? 'Disconnect' : 'Connect'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.menuSection}>
        <TouchableOpacity style={styles.menuItem}>
          <Settings size={20} color="#6B7280" />
          <Text style={styles.menuText}>Settings</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
          <LogOut size={20} color="#EF4444" />
          <Text style={[styles.menuText, { color: '#EF4444' }]}>Logout</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>SupportIQ v1.0.0</Text>
        <Text style={styles.footerSubtext}>AI-Powered Customer Support</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent', // ✅ show global gradient
  },
  header: {
    padding: 20,
    paddingTop: 60,
    backgroundColor: 'transparent', // ✅ no solid bar
    borderBottomWidth: 0,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#111827',
    letterSpacing: -0.5,
  },
  userInfo: {
    backgroundColor: '#FFFFFF', // ✅ floating card
    padding: 24,
    alignItems: 'center',
    marginTop: 20,
    marginHorizontal: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  avatar: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: '#FFF1E0', // ✅ peach tint
    alignItems: 'center',
    justifyContent: 'center',
  },
  userName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginTop: 12,
  },
  userEmail: {
    fontSize: 14,
    color: '#6B7280',
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
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  whatsappCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 14,
    backgroundColor: '#FFF8F1', // ✅ soft warm background
    borderRadius: 12,
  },
  whatsappStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  whatsappText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
  },
  whatsappButton: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
  },
  connectButton: {
    backgroundColor: '#25D366', // ✅ keep WhatsApp green
  },
  disconnectButton: {
    backgroundColor: '#FFF1F0',
    borderWidth: 1,
    borderColor: '#FF7A45', // ✅ Alan orange instead of red
  },
  buttonText: {
    fontSize: 12,
    fontWeight: '600',
  },
  connectText: {
    color: '#FFFFFF',
  },
  disconnectText: {
    color: '#FF7A45', // ✅ warm orange
  },
  menuSection: {
    margin: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  menuText: {
    fontSize: 16,
    color: '#374151',
  },
  footer: {
    alignItems: 'center',
    marginTop: 'auto',
    padding: 20,
  },
  footerText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  footerSubtext: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 4,
  },
});
