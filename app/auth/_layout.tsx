import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,   // ✅ we’ll design custom headers in screens
        contentStyle: { backgroundColor: 'transparent' }, // ✅ gradient shines through
      }}
    >
      <Stack.Screen name="login" />
      <Stack.Screen name="signup" />
      <Stack.Screen name="connect-whatsapp" />
    </Stack>
  );
}