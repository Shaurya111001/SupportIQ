import { Stack } from 'expo-router';

export default function ConversationLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: 'transparent' }, // ✅ ensure gradient shows
      }}
    >
      <Stack.Screen name="[id]" />
    </Stack>
  );
}