import { Colors } from '@/src/constants/Colors';
import { CustomAlertProvider } from '@/src/context/AlertContext';
import { LoaderProvider } from '@/src/context/LoaderContext';
import { SyncQueueProvider } from '@/src/context/SyncQueueContext';
import { useSyncPendingCount } from '@/src/hooks/useSyncPendingCount';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { InitialLoadingScreen } from '@/src/components/ui/InitialLoadingScreen/InitialLoadingScreen';
import { SyncQueueBanner } from '@/src/components/ui/SyncQueueBanner/SyncQueueBanner';
import { auth } from '@/src/config/firebase';
import { initializeUserData } from '@/src/services/setup';
import { startSync } from '@/src/services/syncEngine';
import NetInfo from '@react-native-community/netinfo';
import { onAuthStateChanged, signInAnonymously } from 'firebase/auth';

const GlobalSyncBanner = () => {
  const insets = useSafeAreaInsets();
  const syncPendingCount = useSyncPendingCount();

  return (
    <SyncQueueBanner
      syncPendingCount={syncPendingCount}
      style={[styles.globalSyncBanner, { top: insets.top + 8 }]}
    />
  );
};

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
          <SyncQueueProvider>
            <View style={styles.rootContainer}>
              <GlobalSyncBanner />
              <Stack
                screenOptions={{
                  headerShown: false, 
                  contentStyle: { backgroundColor: Colors.background },
                }}
              >
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              </Stack>
            </View>
          </SyncQueueProvider>
        </CustomAlertProvider>
      </LoaderProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
  },
  globalSyncBanner: {
    position: 'absolute',
    right: 0,
    width: '50%',
    marginHorizontal: 0,
    zIndex: 1000,
  },
});