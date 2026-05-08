import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';

import { Colors } from '@/src/constants/Colors';

type SyncQueueBannerProps = {
  syncPendingCount: number;
  style?: StyleProp<ViewStyle>;
};

export const SyncQueueBanner = ({ syncPendingCount, style }: SyncQueueBannerProps) => {
  if (syncPendingCount <= 0) {
    return null;
  }

  return (
    <View style={[styles.syncBanner, style]}>
      <Ionicons name="sync-outline" size={16} color={Colors.background} />
      <Text style={styles.syncBannerText}>На синхронізацію: {syncPendingCount} даних</Text>
    </View>
  );
};

const styles = StyleSheet.create({
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
    color: Colors.background,
    fontSize: 13,
    fontWeight: '700',
  },
});
