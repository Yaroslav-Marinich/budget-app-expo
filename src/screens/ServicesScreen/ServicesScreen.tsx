import { Ionicons } from "@expo/vector-icons";
import { Href, useRouter } from "expo-router";
import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useTheme } from "@/src/context/ThemeContext";
import { getStyles } from "@/src/screens/ServicesScreen/service.styles";

export const ServicesScreen = () => {
  const insets = useSafeAreaInsets();
  const router = useRouter();
    const { colors } = useTheme();
    const styles = getStyles(colors);

  return (
    <View style={[styles.container, { paddingTop: insets.top + 10 }]}>
      <Text style={styles.screenTitle}>Сервіси</Text>

      <ScrollView showsVerticalScrollIndicator={false}>
        <TouchableOpacity
          style={styles.serviceCard}
          activeOpacity={0.8}
          onPress={() => router.push("/meters" as Href)}
        >
          <View style={styles.iconBox}>
            <Ionicons name="speedometer-outline" size={28} color={colors.primary} />
          </View>

          <View style={styles.infoBox}>
            <Text style={styles.serviceTitle}>Лічильники</Text>
            <Text style={styles.serviceDescription}>
              Облік електроенергії, води, газу та інших побутових послуг
            </Text>
          </View>

          <Ionicons name="chevron-forward" size={24} color={colors.textSecondary} />
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};