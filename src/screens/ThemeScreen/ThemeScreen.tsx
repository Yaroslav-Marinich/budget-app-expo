import { Ionicons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useTheme } from "@/src/context/ThemeContext";
import { getStyles } from "./theme.styles";

const APPEARANCE_OPTIONS = [
  { id: 'dark', isDarkMode: true, label: "Темна", icon: 'moon-outline' },
  { id: 'light', isDarkMode: false, label: "Світла", icon: 'sunny-outline' },
];

const BACKGROUND_OPTIONS = [
  { id: 'default', color: null, label: "За замовчуванням" },
  { id: 'pink', color: "#FFE4E1", label: "Ніжно-рожевий" },
  { id: 'blue', color: "#E0F7FA", label: "Світло-блакитний" },
  { id: 'darkGreen', color: "#0B1D14", label: "Глибокий зелений" },
];

export const ThemeScreen = () => {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  
  const { isDarkMode, customBackground, colors, updateTheme } = useTheme();
  
  const styles = getStyles(colors);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Stack.Screen options={{ headerShown: false }} />
      
      {/* Хедер */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={{ padding: 5 }}>
          <Ionicons name="arrow-back" size={28} color={colors.textSecondary} />
        </TouchableOpacity>
        <Text style={styles.title}>Тема застосунку</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        
        {/* Зовнішній вигляд */}
        <Text style={styles.sectionTitle}>Зовнішній вигляд</Text>
        <View style={styles.cardVertical}>
          {APPEARANCE_OPTIONS.map((option, index) => {
            const isLast = index === APPEARANCE_OPTIONS.length - 1;
            const isSelected = isDarkMode === option.isDarkMode;
            
            return (
              <TouchableOpacity
                key={option.id}
                style={[styles.colorRow, isLast && styles.colorRowLast]}
                onPress={() => updateTheme({ isDarkMode: option.isDarkMode })}
                activeOpacity={0.7}
              >
                {/* Іконка теми */}
                <View style={[styles.colorCircle, { backgroundColor: `${colors.accent}15`, justifyContent: 'center', alignItems: 'center' }]}>
                    <Ionicons name={option.icon as any} size={18} color={colors.accent} />
                </View>
                
                <Text style={[styles.colorLabel, isSelected && { fontWeight: 'bold' }]}>
                  {option.label}
                </Text>
                
                {/* Галочка навпроти вибраного */}
                {isSelected && (
                  <Ionicons 
                    name="checkmark" 
                    size={22} 
                    color={colors.primary} 
                    style={{ marginLeft: 'auto' }} 
                  />
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Секція кастомного фону */}
        {/* <Text style={styles.sectionTitle}>Колір фону</Text> */}
        {/* <View style={styles.cardVertical}>
          {BACKGROUND_OPTIONS.map((option, index) => {
            const isLast = index === BACKGROUND_OPTIONS.length - 1;
            const isSelected = customBackground === option.color;
            
            return (
              <TouchableOpacity
                key={option.id}
                style={[styles.colorRow, isLast && styles.colorRowLast]}
                onPress={() => updateTheme({ customBackground: option.color })}
                activeOpacity={0.7}
              >
                <View style={[
                  styles.colorCircle, 
                  { backgroundColor: option.color || (isDarkMode ? '#000' : '#FFF') },
                  isSelected && { borderColor: colors.primary, borderWidth: 3 }
                ]} />
                
                <Text style={[styles.colorLabel, isSelected && { fontWeight: 'bold' }]}>
                  {option.label}
                </Text>
                
                {isSelected && (
                  <Ionicons 
                    name="checkmark" 
                    size={22} 
                    color={colors.primary} 
                    style={{ marginLeft: 'auto' }} 
                  />
                )}
              </TouchableOpacity>
            );
          })}
        </View> */}

      </ScrollView>
    </View>
  );
};