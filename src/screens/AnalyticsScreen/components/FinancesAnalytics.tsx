import { Colors } from '@/src/constants/Colors';
import React from 'react';
import { Text, View } from 'react-native';

export const FinancesAnalytics = () => {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ color: Colors.textSecondary, fontSize: 16 }}>
        Тут будуть графіки доходів та витрат 💰
      </Text>
    </View>
  );
};