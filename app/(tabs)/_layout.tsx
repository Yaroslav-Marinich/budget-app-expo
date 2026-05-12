import { Ionicons } from '@expo/vector-icons';
import { useNetInfo } from '@react-native-community/netinfo';
import { Tabs } from 'expo-router';
import { Pressable } from 'react-native';

import { useTheme } from '@/src/context/ThemeContext';

export default function TabLayout() {
  const netInfo = useNetInfo();
  const isOnline = !!netInfo.isConnected && netInfo.isInternetReachable !== false;

  const { colors } = useTheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false, 
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: {
          backgroundColor: colors.surface, 
          borderTopColor: colors.outline,
          height: 60,
          paddingBottom: 10,
        },
      }}
    >
      <Tabs.Screen
        name="home/index" 
        options={{
          title: 'Головна',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="analytics/index" 
        options={{
          title: 'Аналітика',
          tabBarButton: ({ style, ref: _ignoredRef, ...restProps }) => (
            <Pressable
              {...restProps}
              disabled={!isOnline}
              style={[style, !isOnline && { opacity: 0.55 }]}
            />
          ),
          tabBarIcon: ({ color, size }) => (
            <Ionicons
              name={isOnline ? 'stats-chart-outline' : 'cloud-offline-outline'}
              size={size}
              color={isOnline ? color : colors.error}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="services/index"
        options={{
          title: "Сервіси",
          tabBarIcon: ({ color, size }) => <Ionicons name="apps-outline" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="user/index"
        options={{
          title: 'Налаштування',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'person' : 'person-outline'} size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}