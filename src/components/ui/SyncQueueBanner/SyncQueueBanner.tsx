import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';

import { useTheme } from '@/src/context/ThemeContext';

type SyncQueueBannerProps = {
  syncPendingCount: number;
  style?: StyleProp<ViewStyle>;
};

export const SyncQueueBanner = ({ syncPendingCount, style }: SyncQueueBannerProps) => {
  const { colors } = useTheme();
  const styles = getStyles(colors);
  
  if (syncPendingCount <= 0) {
    return null;
  }

  return (
    <View style={[styles.syncBanner, style]}>
      <Ionicons name="sync-outline" size={16} color={colors.background} />
      <Text style={styles.syncBannerText}>Очікують синхронізації: {syncPendingCount}</Text>
    </View>
  );
};

const getStyles = (colors: any) => StyleSheet.create({
  syncBanner: {
    marginHorizontal: 20,
    marginTop: 10,
    marginBottom: 8,
    backgroundColor: '#FF9500',
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  syncBannerText: {
    color: colors.background,
    fontSize: 13,
    fontWeight: '700',
  },
});
