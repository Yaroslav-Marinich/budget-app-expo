import { Colors } from '@/src/constants/Colors';
import React, { createContext, useContext, useState } from 'react';
import { ActivityIndicator, Modal, View } from 'react-native';
import { styles } from './LoaderContext.styles';

// Описуємо, які функції будуть доступні
interface LoaderContextType {
  showLoader: () => void;
  hideLoader: () => void;
}

const LoaderContext = createContext<LoaderContextType | undefined>(undefined);

export const LoaderProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <LoaderContext.Provider value={{ 
      showLoader: () => setIsLoading(true), 
      hideLoader: () => setIsLoading(false) 
    }}>
      {children}

      {/* Сам візуальний лоадер */}
      <Modal transparent visible={isLoading} animationType="fade">
        <View style={styles.overlay}>
          <View style={styles.loaderBox}>
            <ActivityIndicator size="large" color={Colors.primary} />
          </View>
        </View>
      </Modal>
    </LoaderContext.Provider>
  );
};

// Хук для зручного використання в компонентах
export const useLoader = () => {
  const context = useContext(LoaderContext);
  if (!context) {
    throw new Error("useLoader must be used within a LoaderProvider");
  }
  return context;
};