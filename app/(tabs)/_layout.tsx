import { Tabs } from 'expo-router';
import { MessageSquare, ChartBar as BarChart3, User } from 'lucide-react-native';

export default function TabLayout() {
  return (
 <Tabs
      screenOptions={{
        tabBarStyle: {
          backgroundColor: 'transparent', // ✅ gradient shows through
          borderTopWidth: 0,              // remove line
          elevation: 0,                   // no shadow (Android)
          shadowOpacity: 0,               // no shadow (iOS)
          position: 'absolute',           // floats over gradient
        },
        tabBarActiveTintColor: '#FF7A45', // warm peach/orange accent
        tabBarInactiveTintColor: '#9CA3AF',
        headerTransparent: true,            // ✅ headers float
        headerTitleStyle: {
          fontWeight: '700',
          fontFamily: 'FilsonProLight',
          fontSize: 18,
          color: '#111827',                 // dark readable text
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Inbox',
          headerShown: false,
          tabBarIcon: ({ size, color }) => (
            <MessageSquare size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="analytics"
        options={{
          title: 'Analytics',
          headerShown: false,
          tabBarIcon: ({ size, color }) => (
            <BarChart3 size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          headerShown: false,
          tabBarIcon: ({ size, color }) => (
            <User size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}