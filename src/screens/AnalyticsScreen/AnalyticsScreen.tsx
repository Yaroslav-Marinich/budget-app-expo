import { useNetInfo } from "@react-native-community/netinfo";
import React from "react";
import { Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Colors } from "@/src/constants/Colors";
import { styles } from "@/src/screens/ServicesScreen/service.styles";

export const AnalyticsScreen = () => {
  const insets = useSafeAreaInsets();
  const netInfo = useNetInfo();
  const isOnline = !!netInfo.isConnected && netInfo.isInternetReachable !== false;

  return (
    <View style={[styles.container, { paddingTop: insets.top + 10, justifyContent: "center", alignItems: "center" }]}>
      <Text style={styles.screenTitle}>Аналітика</Text>
      {!isOnline && (
        <Text style={{ color: Colors.textSecondary, marginTop: 10, textAlign: "center", paddingHorizontal: 20 }}>
          Ця вкладка не працює без інтернету.
        </Text>
      )}
    </View>
  );
};