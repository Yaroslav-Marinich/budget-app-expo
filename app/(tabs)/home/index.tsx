import { Ionicons } from "@expo/vector-icons";
import { Stack } from "expo-router";
import React, { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { TransactionModal } from "@/src/components/ui/TransactionModal/TransactionModal";
import { Colors } from "@/src/constants/Colors";
import { styles } from "./home.styles";

// Тимчасові дані категорій
const MOCK_CATEGORIES = {
  expense: [
    { id: 'e1', name: 'Продукти', icon: 'cart', color: '#E57373', sum: 8450 },
    { id: 'e2', name: 'Авто', icon: 'car', color: '#81C784', sum: 2100 },
    { id: 'e3', name: 'Розваги', icon: 'game-controller', color: '#BA68C8', sum: 1500 },
  ],
  income: [
    { id: 'i1', name: 'Зарплата', icon: 'cash', color: '#4CAF50', sum: 45000 },
    { id: 'i2', name: 'Бонус', icon: 'gift', color: '#FFB74D', sum: 5000 },
  ]
};

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  
  // Стейт для перемикача
  const [activeTab, setActiveTab] = useState<'expense' | 'income'>('expense');
  
  // Стейт для модалки
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<any>(null);

  // Тимчасові рахунки
  const [wallets] = useState([
    { id: '1', title: 'Основна картка', balance: 45200, currency: 'UAH' },
    { id: '2', title: 'Готівка', balance: 850, currency: 'USD' },
  ]);

  const handleCategoryPress = (category: any) => {
    setSelectedCategory(category);
    setModalVisible(true);
  };

  const handleSaveTransaction = (amount: string, type: 'income' | 'expense') => {
    console.log(`Додано ${amount} до категорії ${selectedCategory?.name} (${type})`);
    // Тут буде логіка Firebase
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Stack.Screen options={{ headerShown: false }} />
      
      <ScrollView showsVerticalScrollIndicator={false}>
        
        {/* Рахунки (зверху) */}
        <Text style={styles.sectionTitle}>Рахунки</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.walletList} contentContainerStyle={{ paddingRight: 20 }}>
          {wallets.map(w => (
            <View key={w.id} style={styles.walletCard}>
               <View style={styles.cardHeader}>
                 <Ionicons name={w.currency === 'UAH' ? "card-outline" : "cash-outline"} size={24} color={Colors.accent} />
                 <Text style={styles.walletTitle}>{w.title}</Text>
               </View>
               <Text style={styles.walletAmount}>{w.balance.toLocaleString()} <Text style={styles.currency}>{w.currency}</Text></Text>
            </View>
          ))}
        </ScrollView>

        {/* Вибір місяця та року */}
        <View style={styles.dateSelector}>
          <TouchableOpacity><Ionicons name="chevron-back" size={24} color={Colors.textSecondary} /></TouchableOpacity>
          <TouchableOpacity>
            {/* Тимчасово фіксована дата, пізніше зробимо календар */}
            <Text style={styles.dateText}>Травень 2026</Text>
          </TouchableOpacity>
          <TouchableOpacity><Ionicons name="chevron-forward" size={24} color={Colors.textSecondary} /></TouchableOpacity>
        </View>

        {/* Перемикач Витрати / Доходи із загальними сумами */}
        <View style={styles.toggleContainer}>
          <TouchableOpacity 
            style={[styles.toggleBtn, activeTab === 'expense' && styles.toggleBtnActiveExpense]}
            onPress={() => setActiveTab('expense')}
          >
            <Text style={[styles.toggleLabel, activeTab === 'expense' && { color: Colors.error }]}>Витрати</Text>
            <Text style={styles.toggleAmount}>12 050 ₴</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.toggleBtn, activeTab === 'income' && styles.toggleBtnActiveIncome]}
            onPress={() => setActiveTab('income')}
          >
            <Text style={[styles.toggleLabel, activeTab === 'income' && { color: Colors.primary }]}>Доходи</Text>
            <Text style={styles.toggleAmount}>50 000 ₴</Text>
          </TouchableOpacity>
        </View>

        {/* Список категорій */}
<View style={styles.categoriesContainer}>
          {MOCK_CATEGORIES[activeTab].map(category => (
            <TouchableOpacity 
              key={category.id} 
              style={styles.categoryCard} 
              onPress={() => handleCategoryPress(category)}
            >
              <View style={[styles.iconContainer, { backgroundColor: `${category.color}15` }]}>
                <Ionicons name={category.icon as any} size={22} color={category.color} />
              </View>
              
              <View style={styles.textContainer}>
                <Text style={styles.categoryName} numberOfLines={1}>{category.name}</Text>
                <Text style={styles.categoryAmount} numberOfLines={1}>
                  {category.sum.toLocaleString()} ₴
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

      </ScrollView>

      {/* Модалка тепер знає, яку категорію обрали */}
      <TransactionModal 
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        type={activeTab}
        // Можна передати назву категорії в модалку, щоб відобразити її в заголовку
        categoryName={selectedCategory?.name} 
        onSave={handleSaveTransaction}
      />
      
    </View>
  );
}