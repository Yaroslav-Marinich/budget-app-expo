import { auth } from '@/src/config/firebase';
import { DarkTheme, LightTheme } from '@/src/constants/Colors';
import { getThemeSettings, saveThemeSettings, ThemeSettings } from '@/src/services/setup';
import React, { createContext, useContext, useEffect, useState } from 'react';

interface ThemeContextType {
  isDarkMode: boolean;
  customBackground: string | null;
  colors: typeof DarkTheme;
  updateTheme: (settings: Partial<ThemeSettings>) => Promise<void>;
}

const ThemeContext = createContext<ThemeContextType>({
  isDarkMode: true,
  customBackground: null,
  colors: DarkTheme,
  updateTheme: async () => {},
});

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [customBackground, setCustomBackground] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const settings = await getThemeSettings(user.uid);
        if (settings) {
          setIsDarkMode(settings.isDarkMode);
          setCustomBackground(settings.customBackground);
        }
      } else {
        setIsDarkMode(true);
        setCustomBackground(null);
      }
    });
    return () => unsubscribe();
  }, []);

  const updateTheme = async (newSettings: Partial<ThemeSettings>) => {
    const updatedDarkMode = newSettings.isDarkMode !== undefined ? newSettings.isDarkMode : isDarkMode;
    const updatedBg = newSettings.customBackground !== undefined ? newSettings.customBackground : customBackground;
    
    setIsDarkMode(updatedDarkMode);
    setCustomBackground(updatedBg);

    if (auth.currentUser) {
      await saveThemeSettings(auth.currentUser.uid, {
        isDarkMode: updatedDarkMode,
        customBackground: updatedBg
      });
    }
  };

  const baseColors = isDarkMode ? DarkTheme : LightTheme;
  const colors = {
    ...baseColors,
    ...(customBackground ? { background: customBackground } : {})
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode, customBackground, colors, updateTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);