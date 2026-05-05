import { Colors } from '@/src/constants/Colors';
import { LoaderProvider } from '@/src/context/LoaderContext';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';

export default function RootLayout() {
  return (
    <View style={{ flex: 1, backgroundColor: Colors.background }}>
      <StatusBar style="light" />
      <LoaderProvider>
      <Stack
        screenOptions={{
          headerShown: false, // Прибираємо всі системні заголовки
          contentStyle: { backgroundColor: Colors.background },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack>
        </LoaderProvider>
    </View>
  );
}