import React from "react";
import { Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { styles } from "@/src/screens/ServicesScreen/service.styles";

export const AnalyticsScreen = () => {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top + 10, justifyContent: "center", alignItems: "center" }]}>
      <Text style={styles.screenTitle}>Аналітика</Text>
    </View>
  );
};