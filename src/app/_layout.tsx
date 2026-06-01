import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="crm" options={{ title: 'Client CRM', presentation: 'modal' }} />
      <Stack.Screen name="analyzer" options={{ title: 'Financial Analyzer', presentation: 'modal' }} />
    </Stack>
  );
}
