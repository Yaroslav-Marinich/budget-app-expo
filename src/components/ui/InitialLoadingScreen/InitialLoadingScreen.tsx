import { useTheme } from '@/src/context/ThemeContext';
import React from 'react';
import { ActivityIndicator, Image, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getStyles } from './InitialLoadingScreen.styles';

export const InitialLoadingScreen = () => {
  const insets = useSafeAreaInsets();
    const { colors } = useTheme();
    const styles = getStyles(colors);

  return (
    <View style={styles.container}>
      <View style={styles.centerContent}>
        <Image 
          source={require('../../../assets/images/logo.png')} 
          style={styles.logo}
          resizeMode="contain"
        />
        <ActivityIndicator size="large" color={colors.primary} style={styles.loader} />
        <Text style={styles.subtitle}>Налаштовуємо ваш простір...</Text>
      </View>
          
      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 20) }]}>
        <Text style={styles.footerText}>Development by Yargo</Text>
      </View>
    </View>
  );
};