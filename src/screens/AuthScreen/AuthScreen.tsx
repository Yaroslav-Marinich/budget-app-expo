import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { ActivityIndicator, Image, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useTheme } from "@/src/context/ThemeContext";
import { appAlert } from "@/src/services/alert";
import { loginAnonymously, loginWithGoogle } from "@/src/services/auth";
import { getStyles } from "./auth.styles";

export const AuthScreen = () => {
  const insets = useSafeAreaInsets();
    const { colors } = useTheme();
  const styles = getStyles(colors);
  
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    const result = await loginWithGoogle();
    setIsLoading(false);

    if (!result.success) {
      appAlert("Помилка", "Не вдалося увійти через Google. Спробуйте ще раз.");
    }
  };

  const handleAnonymousLogin = () => {
    appAlert(
      "Увага",
      "При анонімному вході ваші дані зберігаються лише на цьому пристрої. Якщо ви видалите додаток, дані будуть втрачені. Ви завжди зможете прив'язати Google акаунт у налаштуваннях пізніше.",
      [
        { text: "Скасувати", style: "cancel" },
        {
          text: "Продовжити",
          style: "default",
          onPress: async () => {
            setIsLoading(true);
            const user = await loginAnonymously();
            setIsLoading(false);
            
            if (!user) {
              appAlert("Помилка", "Не вдалося створити анонімний акаунт.");
            }
          },
        },
      ]
    );
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      
      <View style={styles.logoContainer}>
                <Image 
                  source={require('../../assets/images/logo.png')} 
                  style={styles.logo}
                  resizeMode="contain"
                />
        {/* <Text style={styles.title}>Budget Tracker</Text> */}
        <Text style={styles.subtitle}>
          Керуйте своїми фінансами, фіксуйте показники, плануйте витрати та донатьте на РусоРіз
        </Text>
      </View>

      <View style={styles.buttonsContainer}>
        {isLoading ? (
          <ActivityIndicator size="large" color={colors.primary} style={{ marginVertical: 20 }} />
        ) : (
          <>
            <TouchableOpacity 
              style={styles.googleBtn} 
              onPress={handleGoogleLogin}
              activeOpacity={0.8}
            >
              <Ionicons name="logo-google" size={24} color="#DB4437" />
              <Text style={styles.googleBtnText}>Увійти через Google</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.anonymousBtn} 
              onPress={handleAnonymousLogin}
              activeOpacity={0.8}
            >
              <Ionicons name="person-outline" size={22} color={colors.text} />
              <Text style={styles.anonymousBtnText}>Продовжити як гість</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
      
    </View>
  );
};