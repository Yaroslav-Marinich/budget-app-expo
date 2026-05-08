import { useNetInfo } from "@react-native-community/netinfo";
import React, { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Colors } from "@/src/constants/Colors";
import { styles } from "./AnalyticsScreen.styles";
import { FinancesAnalytics } from "./components/FinancesAnalytics";
import { MetersAnalytics } from "./components/MetersAnalytics";

type TabType = 'finances' | 'meters';

export const AnalyticsScreen = () => {
  const insets = useSafeAreaInsets();
  const netInfo = useNetInfo();
  const isOnline = !!netInfo.isConnected && netInfo.isInternetReachable !== false;

  const [activeTab, setActiveTab] = useState<TabType>('finances');

  return (
    <View style={[styles.container, { paddingTop: insets.top + 10 }]}>
      {/* Заголовок */}
      <View style={styles.header}>
        <Text style={styles.title}>Аналітика</Text>
      </View>

      {!isOnline ? (
        // 📴 Стан без інтернету
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <Text style={{ color: Colors.textSecondary, marginTop: 10, textAlign: "center", paddingHorizontal: 20 }}>
            Ця вкладка не працює без інтернету.
          </Text>
        </View>
      ) : (
        // 🌐 Стан з інтернетом (Вкладки + Контент)
        <>
          <View style={styles.tabsContainer}>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'finances' && styles.activeTab]}
              onPress={() => setActiveTab('finances')}
              activeOpacity={0.8}
            >
              <Text style={[styles.tabText, activeTab === 'finances' && styles.activeTabText]}>
                Фінанси
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.tab, activeTab === 'meters' && styles.activeTab]}
              onPress={() => setActiveTab('meters')}
              activeOpacity={0.8}
            >
              <Text style={[styles.tabText, activeTab === 'meters' && styles.activeTabText]}>
                Лічильники
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.contentContainer}>
            {activeTab === 'finances' ? <FinancesAnalytics /> : <MetersAnalytics />}
          </View>
        </>
      )}
    </View>
  );
};