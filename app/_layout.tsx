import { Colors } from '@/src/constants/Colors';
import { CustomAlertProvider } from '@/src/context/AlertContext';
import { LoaderProvider } from '@/src/context/LoaderContext';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { InitialLoadingScreen } from '@/src/components/ui/InitialLoadingScreen/InitialLoadingScreen';
import { auth } from '@/src/config/firebase';
import { initializeUserData } from '@/src/services/setup';
import { startSync } from '@/src/services/syncEngine';
import NetInfo from '@react-native-community/netinfo';
import { onAuthStateChanged, signInAnonymously } from 'firebase/auth';

export default function RootLayout() {
  const [isReady, setIsReady] = useState(false);

useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        try {
          await signInAnonymously(auth);
          console.log('✅ Увійшли анонімно');
        } catch (error) {
          console.error('❌ Помилка анонімного входу:', error);
        }
      } else {
        console.log('👤 Активний користувач:', user.uid, user.isAnonymous ? '(Анонім)' : '(Google)');
        
        await initializeUserData();
        
        setTimeout(() => {
          setIsReady(true);
        }, 1000);
      }
    });

    return () => unsubscribe();
}, []);
  
  useEffect(() => {
    const unsubscribeNet = NetInfo.addEventListener(state => {
      if (state.isConnected && isReady) {
        console.log("🌐 Мережа відновлена! Запускаємо фонову синхронізацію...");
        startSync();
      }
    });

    return () => unsubscribeNet();
  }, [isReady]);

  if (!isReady) {
    return <InitialLoadingScreen />;
  }

return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: Colors.background }}>
      <StatusBar style="light" />
      <LoaderProvider>
        <CustomAlertProvider>
          <Stack
            screenOptions={{
              headerShown: false, 
              contentStyle: { backgroundColor: Colors.background },
            }}
          >
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          </Stack>
        </CustomAlertProvider>
      </LoaderProvider>
    </GestureHandlerRootView>
  );
}