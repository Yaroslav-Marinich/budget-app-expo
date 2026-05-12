import { Colors } from '@/src/constants/Colors';
import { CustomAlertProvider } from '@/src/context/AlertContext';
import { DataProvider, useGlobalData } from '@/src/context/DataContext';
import { LoaderProvider } from '@/src/context/LoaderContext';
import { SyncQueueProvider } from '@/src/context/SyncQueueContext';
import { useSyncPendingCount } from '@/src/hooks/useSyncPendingCount';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { LogBox, StyleSheet, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { InitialLoadingScreen } from '@/src/components/ui/InitialLoadingScreen/InitialLoadingScreen';
import { SyncQueueBanner } from '@/src/components/ui/SyncQueueBanner/SyncQueueBanner';
import { auth } from '@/src/config/firebase';
import { initializeUserData } from '@/src/services/setup';
import { startSync } from '@/src/services/syncEngine';
import NetInfo from '@react-native-community/netinfo';
import { onAuthStateChanged, User } from 'firebase/auth';

LogBox.ignoreLogs(['InteractionManager has been deprecated']);

const GlobalSyncBanner = () => {
  const insets = useSafeAreaInsets();
  const actualSyncPendingCount = useSyncPendingCount();
  const [displayCount, setDisplayCount] = useState(0);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;

    if (actualSyncPendingCount > 0) {
      if (displayCount === 0) {
        timeout = setTimeout(() => {
          setDisplayCount(actualSyncPendingCount);
        }, 800); 
      } else {
        setDisplayCount(actualSyncPendingCount);
      }
    } else {
      setDisplayCount(0);
    }

    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [actualSyncPendingCount, displayCount]);

  if (displayCount === 0) {
    return null;
  }

  return (
    <SyncQueueBanner
      syncPendingCount={displayCount}
      style={[styles.globalSyncBanner, { top: insets.top + 8 }]}
    />
  );
};

const AppContent = () => {
  const router = useRouter();
  const segments = useSegments();
  const [user, setUser] = useState<User | null | undefined>(undefined);
  
  const { isDataReady } = useGlobalData(); 

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser); 
      
      if (currentUser) {
        console.log('👤 Активний користувач:', currentUser.uid, currentUser.isAnonymous ? '(Анонім)' : '(Google)');
        await initializeUserData(); 
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const unsubscribeNet = NetInfo.addEventListener(state => {
      if (state.isConnected && user) {
        console.log("🌐 Мережа відновлена! Запускаємо фонову синхронізацію...");
        startSync();
      }
    });

    return () => unsubscribeNet();
  }, [user]);

  useEffect(() => {
    if (user === undefined) return; 

    const inAuthGroup = segments[0] === 'login';

    if (user === null && !inAuthGroup) {
      router.replace('/login' as any);
    } else if (user && inAuthGroup) {
      router.replace('/(tabs)/home' as any);
    }
  }, [router, user, segments]);

  if (user === undefined || (user !== null && !isDataReady)) {
    return <InitialLoadingScreen />;
  }

  return (
    <View style={styles.rootContainer}>
      {user && <GlobalSyncBanner />} 
      <Stack
        screenOptions={{
          headerShown: false, 
          contentStyle: { backgroundColor: Colors.background },
        }}
      >
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="login/index" /> 
      </Stack>
    </View>
  );
};

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: Colors.background }}>
      <StatusBar style="light" />
      <LoaderProvider>
        <CustomAlertProvider>
          <SyncQueueProvider>
            <DataProvider> 
              <AppContent />
            </DataProvider>
          </SyncQueueProvider>
        </CustomAlertProvider>
      </LoaderProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  rootContainer: { flex: 1 },
  globalSyncBanner: {
    position: 'absolute',
    right: 0,
    width: '50%',
    marginHorizontal: 0,
    zIndex: 1000,
  },
});