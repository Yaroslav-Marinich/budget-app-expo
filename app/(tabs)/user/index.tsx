import { Ionicons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Colors } from "@/src/constants/Colors";
import { styles } from "../../../src/styles/user.styles";

export default function UserScreen() {
    const insets = useSafeAreaInsets();
    const router = useRouter();

  const renderMenuItem = (icon: string, color: string, title: string, onPress: () => void) => (
    <TouchableOpacity style={styles.menuItem} onPress={onPress}>
      <View style={[styles.menuIcon, { backgroundColor: `${color}15` }]}>
        <Ionicons name={icon as any} size={20} color={color} />
      </View>
      <Text style={styles.menuText}>{title}</Text>
      <Ionicons name="chevron-forward" size={18} color={Colors.textSecondary} />
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Stack.Screen options={{ title: "Налаштування", headerShown: false }} />
      
      <ScrollView>
        {/* Хедер користувача */}
        <View style={styles.header}>
          <View style={styles.avatarPlaceholder}>
            <Ionicons name="person" size={40} color={Colors.textSecondary} />
          </View>
          <Text style={styles.userName}>Тестовий Користувач</Text>
          <Text style={styles.userEmail}>test.user@example.com</Text>
        </View>

        {/* Секція: Фінанси */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Управління фінансами</Text>
          <View style={styles.menuBlock}>
            
            {/* ОНОВЛЕНИЙ КЛІК ДЛЯ РАХУНКІВ */}
            {renderMenuItem("card", Colors.primary, "Мої рахунки", () => {
              router.push("/wallets");
            })}
            
            {renderMenuItem("grid", Colors.accent, "Категорії витрат", () => {
              router.push("/categories");
            })}
          </View>
        </View>

        {/* Секція: Застосунок */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Налаштування</Text>
          <View style={styles.menuBlock}>
            {renderMenuItem("notifications", "#FF9500", "Сповіщення", () => {})}
            {renderMenuItem("color-palette", "#AF52DE", "Тема застосунку", () => {})}
            {renderMenuItem("shield-checkmark", "#34C759", "Безпека", () => {})}
          </View>
        </View>

        <TouchableOpacity style={styles.logoutBtn}>
          <Text style={styles.logoutText}>Вийти з акаунту</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}