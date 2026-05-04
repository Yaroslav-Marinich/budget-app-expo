import { Colors } from "@/src/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import React from 'react';
import { Text, View } from 'react-native';
import { styles } from './WalletCard.styles';

interface WalletCardProps {
  title: string;
  balance: number;
  currency: string;
}

export const WalletCard: React.FC<WalletCardProps> = ({ title, balance, currency }) => {
  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Ionicons 
          name={currency === 'UAH' ? "card-outline" : "cash-outline"} 
          size={24} 
          color={Colors.accent} 
        />
        <Text style={styles.walletTitle}>{title}</Text>
      </View>
      <Text style={styles.walletAmount}>
        {balance.toLocaleString()}
        <Text style={styles.currency}> {currency}</Text>
      </Text>
    </View>
  );
};