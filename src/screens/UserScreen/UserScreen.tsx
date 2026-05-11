import { Ionicons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import React, { useState } from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { auth } from "@/src/config/firebase";
import { Colors } from "@/src/constants/Colors";
import { useLoader } from "@/src/context/LoaderContext";
import { styles } from "@/src/screens/UserScreen/user.styles";
import { appAlert } from "@/src/services/alert";

// 🟢 Імпортуємо функції для прив'язки та конфліктів
import { linkWithGoogle, logoutUser, resolveAuthConflict } from "@/src/services/auth";

export const UserScreen = () => {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { showLoader, hideLoader } = useLoader();

  // Додаємо локальний стан, щоб екран миттєво оновився після успішної прив'язки
  const [user, setUser] = useState(auth.currentUser);
  const isAnonymous = user?.isAnonymous || false;

  const renderMenuItem = (icon: string, color: string, title: string, onPress: () => void) => (
    <TouchableOpacity style={styles.menuItem} onPress={onPress}>
      <View style={[styles.menuIcon, { backgroundColor: `${color}15` }]}>
        <Ionicons name={icon as any} size={20} color={color} />
      </View>
      <Text style={styles.menuText}>{title}</Text>
      <Ionicons name="chevron-forward" size={18} color={Colors.textSecondary} />
    </TouchableOpacity>
  );

  // 🟢 Логіка прив'язки Google
  const handleLinkGoogle = async () => {
    showLoader();
    try {
      const result = await linkWithGoogle();

      if (result.success) {
        // Успішна прив'язка без конфліктів
        setUser(auth.currentUser); // Оновлюємо стан, щоб зникла кнопка і з'явилося ім'я
        appAlert("Успіх", "Ваш прогрес успішно збережено в хмарі!");
      } 
      else if (result.conflict) {
        // Конфлікт: такий Google акаунт вже існує
        appAlert(
          "Акаунт вже існує",
          "Цей Google акаунт вже містить збережені дані. Які дані ви хочете залишити?",
          [
            { 
              text: "Залишити ті, що на телефоні (старі зникнуть)", 
              onPress: () => handleResolveConflict(result.credential, 'keep_local') 
            },
            { 
              text: "Завантажити з хмари (поточні зникнуть)", 
              onPress: () => handleResolveConflict(result.credential, 'keep_cloud') 
            },
            { text: "Скасувати", style: "cancel" }
          ]
        );
      } 
      else {
        appAlert("Помилка", "Не вдалося прив'язати акаунт. Спробуйте ще раз.");
      }
    } catch (error) {
      console.error(error);
      appAlert("Помилка", "Сталася непередбачена помилка.");
    } finally {
      hideLoader();
    }
  };

  // 🟢 Логіка вирішення конфлікту
  const handleResolveConflict = async (credential: any, choice: 'keep_cloud' | 'keep_local') => {
    showLoader();
    try {
      const success = await resolveAuthConflict(credential, choice);
      if (success) {
        setUser(auth.currentUser);
        appAlert("Успіх", "Дані успішно синхронізовано!");
      } else {
        appAlert("Помилка", "Не вдалося синхронізувати дані.");
      }
    } catch (error) {
      console.error(error);
      appAlert("Помилка", "Сталася непередбачена помилка при синхроніазції.");
    } finally {
      hideLoader();
    }
  };

  const handleLogout = () => {
    if (isAnonymous) {
      appAlert(
        "Втрата даних!",
        "Ви використовуєте гостьовий акаунт. Якщо ви вийдете, всі ваші локальні дані будуть назавжди видалені. Ви впевнені?",
        [
          { text: "Скасувати", style: "cancel" },
          { text: "Вийти та видалити", style: "destructive", onPress: performSignOut },
        ]
      );
    } else {
      appAlert(
        "Вихід",
        "Ви впевнені, що хочете вийти з акаунту?",
        [
          { text: "Скасувати", style: "cancel" },
          { text: "Вийти", style: "destructive", onPress: performSignOut },
        ]
      );
    }
  };

  const performSignOut = async () => {
    showLoader();
    try {
      await logoutUser();
    } catch (error) {
      console.error("Помилка при виході:", error);
      appAlert("Помилка", "Не вдалося вийти з акаунту. Спробуйте ще раз.");
    } finally {
      hideLoader();
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Stack.Screen options={{ title: "Налаштування", headerShown: false }} />

      <ScrollView>
        <View style={styles.header}>
          {user?.photoURL ? (
            <Image source={{ uri: user.photoURL }} style={styles.avatarImage} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Ionicons name="person" size={40} color={Colors.textSecondary} />
            </View>
          )}
          
          <Text style={styles.userName}>
            {isAnonymous ? "Гостьовий акаунт" : (user?.displayName || "Користувач")}
          </Text>
          <Text style={styles.userEmail}>
            {isAnonymous ? "Дані зберігаються локально" : (user?.email || "Без email")}
          </Text>
        </View>

        {/* 🟢 Кнопка прив'язки (видима ТІЛЬКИ для анонімів) */}
        {isAnonymous && (
          <TouchableOpacity style={styles.syncBtn} onPress={handleLinkGoogle}>
            <Ionicons name="logo-google" size={20} color={Colors.text} />
            <Text style={styles.syncBtnText}>Зберегти прогрес (Google)</Text>
          </TouchableOpacity>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Управління фінансами</Text>
          <View style={styles.menuBlock}>
            {renderMenuItem("card", Colors.primary, "Мої рахунки", () => { router.push("/wallets"); })}
            {renderMenuItem("grid", Colors.accent, "Категорії витрат", () => { router.push("/categories"); })}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Налаштування</Text>
          <View style={styles.menuBlock}>
            {renderMenuItem("notifications", Colors.warning, "Сповіщення", () => { router.push("/notifications"); })}
            {renderMenuItem("color-palette", "#AF52DE", "Тема застосунку", () => {})}
            {renderMenuItem("shield-checkmark", Colors.success, "Безпека", () => {})}
          </View>
        </View>

        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Text style={styles.logoutText}>Вийти з акаунту</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};