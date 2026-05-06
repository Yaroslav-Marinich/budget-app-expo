import { Ionicons } from "@expo/vector-icons";
import { Stack } from "expo-router";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Dimensions, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { CategoryModal } from "@/src/components/ui/CategoryModal/CategoryModal";
import { MonthPickerModal } from "@/src/components/ui/MonthPickerModal/MonthPickerModal";
import { TransactionModal } from "@/src/components/ui/TransactionModal/TransactionModal";
import { Colors } from "@/src/constants/Colors";
import { Category, seedDefaultCategories, subscribeToCategories } from "@/src/services/categories";
import { addTransaction, subscribeToMonthlyTransactions } from "@/src/services/transactions";
import { subscribeToWallets, Wallet } from "@/src/services/wallets";
import { FlatList } from "react-native-gesture-handler";
import { styles } from "../../../src/styles/home.styles";

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const walletsListRef = useRef<FlatList>(null);

  const { width: SCREEN_WIDTH } = Dimensions.get('window');
  const CARD_WIDTH = SCREEN_WIDTH * 0.75; 
  const CARD_SPACING = 15; 
  
  const [activeTab, setActiveTab] = useState<'expense' | 'income'>('expense');
  
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [selectedWalletId, setSelectedWalletId] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isMonthPickerVisible, setMonthPickerVisible] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isCategoryModalVisible, setCategoryModalVisible] = useState(false);

  const handleWalletPress = (walletId: string, index: number) => {
    setSelectedWalletId(walletId);
    
    walletsListRef.current?.scrollToIndex({
      index,
      animated: true,
      viewPosition: 0.5, 
    });
  };

  // --- МАГІЯ ПІДРАХУНКІВ ---
  const totalExpense = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, curr) => acc + curr.amount, 0);
    
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((acc, curr) => acc + curr.amount, 0);

const activeCategories = categories
    .filter(cat => cat.type === activeTab && !cat.isArchived)
    .map(cat => {
      const sum = transactions
        .filter(t => t.categoryId === cat.id)
        .reduce((acc, curr) => acc + curr.amount, 0);
      return { ...cat, sum };
    });

  const getFormattedDate = (date: Date) => {
    const monthName = date.toLocaleString('uk-UA', { month: 'long' }).replace(/^./, (c) => c.toUpperCase());
    const monthNum = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${monthNum} ${monthName} ${year}`;
  };

  const handleCategoryPress = (category: any) => {
    setSelectedCategory(category);
    setModalVisible(true);
  };

  const handlePrevMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const handleSaveTransaction = async (amount: string, type: 'income' | 'expense') => {
    if (!selectedCategory) return;

    const numericAmount = parseFloat(amount);

    const success = await addTransaction({
      userId: "manual-test-id", 
      amount: numericAmount,
      type: type,
      categoryId: selectedCategory.id,
      categoryName: selectedCategory.name,
      walletId: selectedWalletId || "1", // Використовуємо обраний рахунок
    });

    if (success) {
      setModalVisible(false);
    } else {
      alert("Помилка збереження. Перевірте консоль.");
    }
  };
  
  // --- ЛОГІКА ВІДОБРАЖЕННЯ РАХУНКІВ ---
  const processedWallets = useMemo(() => {
    const activeWallets = wallets
      .filter(w => !w.isArchived)
      .sort((a, b) => (a.order || 0) - (b.order || 0));
      
    const archivedWithActivity = wallets
      .filter(w => w.isArchived)
      .filter(w => transactions.some(t => t.walletId === w.id))
      .map(w => {
        const monthBalance = transactions
          .filter(t => t.walletId === w.id)
          .reduce((acc, t) => t.type === 'income' ? acc + t.amount : acc - t.amount, 0);
          
        return { ...w, balance: monthBalance };
      });

    return [...activeWallets, ...archivedWithActivity];
  }, [wallets, transactions]);

  const isSelectedWalletArchived = useMemo(() => {
  const selectedWallet = wallets.find(w => w.id === selectedWalletId);
  return selectedWallet?.isArchived || false;
}, [wallets, selectedWalletId]);
  
  // Підписка на транзакції поточного місяця
  useEffect(() => {
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const currentMonthStr = `${year}-${month}`; 

    const unsubscribe = subscribeToMonthlyTransactions("manual-test-id", currentMonthStr, (data) => {
      setTransactions(data);
    });

    return () => unsubscribe();
  }, [currentDate]);
  
  // Підписка на рахунки
  useEffect(() => {
    const unsubscribeWallets = subscribeToWallets("manual-test-id", (data) => {
      setWallets(data);
      if (!selectedWalletId) {
        const firstActive = data.find(w => !w.isArchived);
        if (firstActive) setSelectedWalletId(firstActive.id);
      }
    });

    return () => unsubscribeWallets();
  }, []);

  useEffect(() => {
    seedDefaultCategories("manual-test-id");
    
    const unsubscribeCategories = subscribeToCategories("manual-test-id", (data) => {
      setCategories(data);
    });
    
    return () => unsubscribeCategories();
  }, []);

  useEffect(() => {
    const unsubscribeCategories = subscribeToCategories("manual-test-id", (data) => {
      setCategories(data);
    });
    return () => unsubscribeCategories();
  }, []);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Stack.Screen options={{ headerShown: false }} />
      
      <ScrollView showsVerticalScrollIndicator={false}>
        
        {/* Рахунки (зверху) */}
        <Text style={styles.sectionTitle}>Рахунки</Text>
        <FlatList
          ref={walletsListRef}
          data={processedWallets}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={w => w.id}
          contentContainerStyle={{ paddingHorizontal: 20 }}
          snapToInterval={CARD_WIDTH + CARD_SPACING}
          decelerationRate="fast"
          snapToAlignment="center"
          getItemLayout={(data, index) => ({
            length: CARD_WIDTH + CARD_SPACING,
            offset: (CARD_WIDTH + CARD_SPACING) * index,
            index,
          })}
          renderItem={({ item: w, index }) => (
            <TouchableOpacity 
              activeOpacity={0.9}
              style={[
                styles.walletCard, 
                { 
                  width: CARD_WIDTH, 
                  marginRight: index === processedWallets.length - 1 ? 0 : CARD_SPACING 
                },
                w.isArchived && styles.walletCardArchived,
                selectedWalletId === w.id && { borderColor: Colors.primary, borderWidth: 2 }
              ]}
              onPress={() => handleWalletPress(w.id, index)}
            >
              {/* ПЛАШКА АРХІВУ */}
              {w.isArchived && (
                <View style={styles.archiveBadgeHome}>
                  <Text style={styles.archiveBadgeTextHome}>Архів</Text>
                </View>
              )}

              <View style={styles.cardHeader}>
                <Ionicons 
                  name={w.icon as any} 
                  size={24} 
                  color={w.isArchived ? Colors.textSecondary : Colors.accent} 
                />
                <View>
                  <Text style={styles.walletTitle}>{w.title}</Text>
                </View>
              </View>
              <Text style={styles.walletAmount}>
                {w.balance.toLocaleString()} <Text style={styles.currency}>{w.currency}</Text>
              </Text>
            </TouchableOpacity>
          )}
        />

        {/* Вибір місяця та року */}
        <View style={styles.dateSelector}>
          <TouchableOpacity onPress={handlePrevMonth} style={{ padding: 10 }}>
            <Ionicons name="chevron-back" size={24} color={Colors.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setMonthPickerVisible(true)}>
            <Text style={styles.dateText}>{getFormattedDate(currentDate)}</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={handleNextMonth} style={{ padding: 10 }}>
            <Ionicons name="chevron-forward" size={24} color={Colors.textSecondary} />
          </TouchableOpacity>
        </View>

        <View style={styles.transactionsBoard}>
          {/* Перемикач Витрати / Доходи із загальними сумами */}
          <View style={styles.toggleContainer}>
            <TouchableOpacity 
              style={[styles.toggleBtn, activeTab === 'expense' && styles.toggleBtnActive]} 
              onPress={() => setActiveTab('expense')}
            >
              <Text style={[styles.toggleLabel, activeTab === 'expense' && { color: Colors.error }]}>Витрати</Text>
              <Text style={styles.toggleAmount}>{totalExpense.toLocaleString()} ₴</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.toggleBtn, activeTab === 'income' && styles.toggleBtnActive]} 
              onPress={() => setActiveTab('income')}
            >
              <Text style={[styles.toggleLabel, activeTab === 'income' && { color: Colors.primary }]}>Доходи</Text>
              <Text style={styles.toggleAmount}>{totalIncome.toLocaleString()} ₴</Text>
            </TouchableOpacity>
          </View>

          {/* Візуальний розділювач із замком (якщо архівний рахунок) */}
          <View style={styles.dividerContainer}>
            <View style={styles.dividerLine} />
            {isSelectedWalletArchived && (
              <View style={styles.lockBadge}>
                <Ionicons name="lock-closed" size={24} color={Colors.error} />
              </View>
            )}
          </View>

          {/* Список категорій */}
          <View style={styles.categoriesContainer}>
            {activeCategories.map(category => {
              const isDisabled = isSelectedWalletArchived;

              return (
                <TouchableOpacity
                  key={category.id}
                  style={[styles.categoryCard,
                    isDisabled && styles.categoryCardDisabled]
                  }
                  onPress={() => {
          if (!isDisabled) {
            handleCategoryPress(category);
          }
                  }}
                  onLongPress={() => {
          console.log("Тут буде статистика для категорії:", category.name);
        }}
        delayLongPress={300}
                >
                  <View style={[styles.iconContainer, { backgroundColor: `${category.color}15` }]}>
                    <Ionicons name={category.icon as any} size={22} color={category.color} />
                  </View>
                  <View style={styles.textContainer}>
                    <Text style={styles.categoryName} numberOfLines={1}>{category.name}</Text>
                    <Text style={[styles.categoryAmount, category.sum === 0 && { color: Colors.textSecondary }]} numberOfLines={1}>
                      {category.sum.toLocaleString()} ₴
                    </Text>
                  </View>
                </TouchableOpacity>
              )
            })}

            {/* 3. КНОПКА ДОДАВАННЯ КАТЕГОРІЇ (ЗАВЖДИ ОСТАННЯ) */}
            <TouchableOpacity 
              style={[styles.categoryCard, styles.addCategoryCard]} 
              onPress={() => setCategoryModalVisible(true)}
            >
              <View style={[styles.iconContainer, { backgroundColor: 'rgba(255,255,255,0.05)' }]}>
                <Ionicons name="add" size={24} color={Colors.textSecondary} />
              </View>
              <View style={styles.textContainer}>
                <Text style={[styles.categoryName, { color: Colors.textSecondary }]}>Категорія</Text>
                <Text style={styles.categoryAmount}>Нова</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Модалка */}
      <TransactionModal 
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        type={activeTab}
        categoryName={selectedCategory?.name} 
        categoryId={selectedCategory?.id}
        walletId={selectedWalletId}
      />

      <MonthPickerModal 
        visible={isMonthPickerVisible}
        onClose={() => setMonthPickerVisible(false)}
        currentDate={currentDate}
        onSelect={(newDate) => setCurrentDate(newDate)}
      />

      <CategoryModal 
        visible={isCategoryModalVisible}
        onClose={() => setCategoryModalVisible(false)}
        type={activeTab}
        existingCategories={categories}
      />
    </View>
  );
}