import { Colors } from '@/src/constants/Colors';
import { LoaderProvider } from '@/src/context/LoaderContext';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: Colors.background }}>
      <StatusBar style="light" />
      <LoaderProvider>
        <Stack
          screenOptions={{
            headerShown: false, 
            contentStyle: { backgroundColor: Colors.background },
          }}
        >
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack>
      </LoaderProvider>
    </GestureHandlerRootView>
  );
}