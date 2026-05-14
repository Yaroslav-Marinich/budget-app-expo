import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { collection, getDocs, query, where } from 'firebase/firestore';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { FlatList, SectionList, Text, TouchableOpacity, View } from 'react-native';
import Swipeable from "react-native-gesture-handler/Swipeable";
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { MonthPickerModal } from '@/src/components/ui/MonthPickerModal/MonthPickerModal';
import { TransactionModal } from '@/src/components/ui/TransactionModal/TransactionModal';
import { auth, db } from '@/src/config/firebase';
import { CURRENCIES } from '@/src/constants/Currencies';
import { useLoader } from '@/src/context/LoaderContext';
import { appAlert } from '@/src/services/alert';
import { Category, subscribeToCategories } from '@/src/services/categories';
import { deleteTransaction, subscribeToMonthlyTransactions, TransactionData } from '@/src/services/transactions';
import { subscribeToWallets, Wallet } from '@/src/services/wallets';
import { formatMoney } from '@/src/utils/formatMoney';

import { useTheme } from '@/src/context/ThemeContext';
import { getStyles } from './TransactionsScreen.styles';

type UITransaction = TransactionData & { id: string };

export const TransactionsScreen = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { showLoader, hideLoader } = useLoader();
  const swipeableRefs = useRef<Map<string, Swipeable>>(new Map());
  const walletsListRef = useRef<FlatList>(null);
  const { colors } = useTheme();
  const styles = getStyles(colors);

  const {
    initialWalletId,
    initialDate,
    categoryId: lockedCategoryIdParam,
    categoryName: lockedCategoryNameParam,
    lockFilters,
  } = useLocalSearchParams<{
    initialWalletId?: string;
    initialDate?: string;
    categoryId?: string;
    categoryName?: string;
    lockFilters?: string;
  }>();

  const normalizedInitialWalletId = typeof initialWalletId === 'string' ? initialWalletId : null;
  const normalizedInitialDate = typeof initialDate === 'string' ? initialDate : null;
  const lockedCategoryId = typeof lockedCategoryIdParam === 'string' ? lockedCategoryIdParam : null;
  const lockedCategoryName = typeof lockedCategoryNameParam === 'string' ? lockedCategoryNameParam : 'Категорія';
  const isLockedFiltersMode = lockFilters === '1' && Boolean(lockedCategoryId);

  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [transactions, setTransactions] = useState<UITransaction[]>([]);

  const [selectedWalletId, setSelectedWalletId] = useState<string | null>(normalizedInitialWalletId);
  const [currentDate, setCurrentDate] = useState(normalizedInitialDate ? new Date(normalizedInitialDate) : new Date());

  const [isMonthPickerVisible, setMonthPickerVisible] = useState(false);
  const [activeMonths, setActiveMonths] = useState<string[]>([]);
  const [openedRowId, setOpenedRowId] = useState<string | null>(null);

  const [isTransactionModalVisible, setTransactionModalVisible] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<UITransaction | null>(null);

  const monthYearStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`;

  const getFormattedDate = (date: Date) => {
    const monthName = date.toLocaleString("uk-UA", { month: "long" }).replace(/^./, (char) => char.toUpperCase());
    return `${monthName} ${date.getFullYear()}`;
  };

  useEffect(() => {
    const unsubWallets = subscribeToWallets((data) => {
      setWallets(data.sort((a, b) => {
        if (a.isArchived && !b.isArchived) return 1;
        if (!a.isArchived && b.isArchived) return -1;
        return (a.order ?? Number.MAX_SAFE_INTEGER) - (b.order ?? Number.MAX_SAFE_INTEGER);
      }));
    });
    const unsubCategories = subscribeToCategories(setCategories);
    return () => { unsubWallets(); unsubCategories(); };
  }, []);

  useEffect(() => {
    if (wallets.length > 0 && selectedWalletId && !isLockedFiltersMode) {
      const index = wallets.findIndex(w => w.id === selectedWalletId);
      if (index >= 0) {
        setTimeout(() => {
          walletsListRef.current?.scrollToIndex({
            index,
            animated: true,
            viewPosition: 0.5
          });
        }, 200);
      }
    }
  }, [wallets, selectedWalletId, isLockedFiltersMode]);

  useEffect(() => {
    const unsub = subscribeToMonthlyTransactions(monthYearStr, (data) => setTransactions(data as UITransaction[]));
    return () => unsub();
  }, [monthYearStr]);

  useEffect(() => {
    const fetchActiveMonths = async () => {
      const user = auth.currentUser;
      if (!user) return;
      try {
        let qParams = [where("userId", "==", user.uid)];
        if (selectedWalletId) qParams.push(where("walletId", "==", selectedWalletId));

        const q = query(collection(db, "transactions"), ...qParams);
        const snap = await getDocs(q);

        const months = new Set<string>();
        snap.forEach(doc => { if (doc.data().monthYear) months.add(doc.data().monthYear); });
        setActiveMonths(Array.from(months));
      } catch (error) {
        console.error("Помилка завантаження активних місяців:", error);
      }
    };
    fetchActiveMonths();
  }, [selectedWalletId]);

  const changeMonth = (offset: number) => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + offset, 1));
  };

  const selectedWalletCurrencySymbol = useMemo(() => {
    const wallet = wallets.find(w => w.id === selectedWalletId);
    return CURRENCIES.find(c => c.code === wallet?.currency)?.symbol || wallet?.currency || '₴';
  }, [wallets, selectedWalletId]);

  const selectedWallet = useMemo(() => {
    return wallets.find((wallet) => wallet.id === selectedWalletId);
  }, [wallets, selectedWalletId]);

  const selectedWalletTitle = selectedWallet?.title || 'Рахунок';
  const cryptoColor = colors.warningAccent;

  const lockedCategoryTotal = useMemo(() => {
    if (!isLockedFiltersMode || !lockedCategoryId) return 0;

    return transactions
      .filter(t => t.walletId === selectedWalletId && t.categoryId === lockedCategoryId)
      .reduce((sum, t) => sum + t.amount, 0);
  }, [transactions, selectedWalletId, isLockedFiltersMode, lockedCategoryId]);

  const groupedTransactions = useMemo(() => {
    const filtered = transactions.filter((transaction) => {
      if (transaction.walletId !== selectedWalletId) return false;
      if (isLockedFiltersMode && lockedCategoryId && transaction.categoryId !== lockedCategoryId) return false;
      return true;
    });

    filtered.sort((a, b) => new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime());

    const groups: { [key: string]: UITransaction[] } = {};

    filtered.forEach(t => {
      const dateObj = t.date ? new Date(t.date) : new Date();
      const dayStr = `${dateObj.getDate()} ${dateObj.toLocaleString('uk-UA', { month: 'long' })}`;

      if (!groups[dayStr]) groups[dayStr] = [];
      groups[dayStr].push(t);
    });

    return Object.keys(groups).map(dateTitle => ({
      title: dateTitle,
      data: groups[dateTitle]
    }));
  }, [transactions, selectedWalletId, isLockedFiltersMode, lockedCategoryId]);

  const onSwipeableWillOpen = (id: string) => {
    if (openedRowId && openedRowId !== id) swipeableRefs.current.get(openedRowId)?.close();
    setOpenedRowId(id);
  };

  const confirmDelete = (item: UITransaction) => {
    if (item.isPending) return;
    appAlert(
      "Видалення",
      `Видалити цю операцію на суму ${formatMoney(item.amount)}?`,
      [
        { text: "Скасувати", style: "cancel", onPress: () => swipeableRefs.current.get(item.id)?.close() },
        {
          text: "Видалити",
          style: "destructive",
          onPress: async () => {
            showLoader();
            await deleteTransaction({
              transactionId: item.id,
              walletId: item.walletId,
              amount: item.amount,
              type: item.type,
              monthYear: item.monthYear
            });
            hideLoader();
          }
        }
      ]
    );
  };

  const handleEdit = (item: UITransaction) => {
    if (item.isPending) return;
    swipeableRefs.current.get(item.id)?.close();
    setEditingTransaction(item);
    setTransactionModalVisible(true);
  };

  const renderRightActions = (item: UITransaction) => (
    <TouchableOpacity
      style={styles.deleteAction}
      onPress={() => confirmDelete(item)}
      activeOpacity={0.8}
    >
      <Ionicons name="trash-outline" size={24} color={colors.white} />
    </TouchableOpacity>
  );

  const renderTransaction = ({ item }: { item: UITransaction }) => {
    const category = categories.find(c => c.id === item.categoryId);
    const isIncome = item.type === 'income';

    return (
      <View style={styles.itemContainer}>
        <Swipeable
          ref={(ref) => {
            if (ref) swipeableRefs.current.set(item.id, ref);
            else swipeableRefs.current.delete(item.id);
          }}
          renderRightActions={() => renderRightActions(item)}
          enabled={!item.isPending}
          onSwipeableWillOpen={() => onSwipeableWillOpen(item.id)}
          overshootRight={false}
          friction={1.5}
          rightThreshold={40}
        >
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => handleEdit(item)}
            style={styles.transactionCard}
          >
            <View style={[styles.iconBox, { backgroundColor: `${category?.color || colors.primary}15` }]}>
              <Ionicons name={(category?.icon as any) || 'help'} size={24} color={category?.color || colors.primary} />
            </View>

            <View style={styles.transactionInfo}>
              <Text style={styles.categoryName}>{category?.name || 'Невідома категорія'}</Text>
              {item.comment ? (
                <Text style={styles.commentText} numberOfLines={1}>{item.comment}</Text>
              ) : null}
            </View>

            <View style={styles.amountBox}>
              <Text style={[styles.amountText, isIncome ? styles.incomeText : styles.expenseText]}>
                {isIncome ? '+' : '-'}{formatMoney(item.amount)} {selectedWalletCurrencySymbol}
              </Text>
              {item.isPending && <Ionicons name="time-outline" size={14} color={colors.warning} style={{ marginTop: 2 }} />}
            </View>
          </TouchableOpacity>
        </Swipeable>
      </View>
    );
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top + 10 }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={28} color={colors.textSecondary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Операції</Text>
      </View>

      {isLockedFiltersMode ? (
        <View style={[styles.lockedWalletCard, selectedWallet?.isCrypto && { borderColor: cryptoColor }]}>
          <View style={styles.lockedWalletHeader}>
            <View style={styles.lockedIconBox}>
              <Ionicons name={(selectedWallet?.icon as any) || 'wallet-outline'} size={24} color={selectedWallet?.isCrypto ? cryptoColor : colors.accent} />
            </View>
            <View style={styles.lockedWalletInfo}>
              <Text style={styles.lockedWalletTitle}>{selectedWalletTitle}</Text>
              <Text style={styles.lockedWalletCurrency}>Валюта: {selectedWallet?.currency || '...'} ({selectedWalletCurrencySymbol})</Text>
            </View>
            <View style={styles.lockIconContainer}>
              <Ionicons name="lock-closed" size={18} color={colors.textSecondary} />
            </View>
          </View>

          <View style={styles.lockedDetailsRow}>
            {/* Рядок з датою */}
            <View style={styles.lockedPeriodContainer}>
              <Ionicons name="calendar-outline" size={20} color={colors.textSecondary} />
              <Text style={styles.lockedPeriodText}>
                {getFormattedDate(currentDate)}
              </Text>
            </View>

            {/* Рядок з сумою на всю ширину */}
            <View style={styles.lockedTotalContainer}>
              <Text style={styles.lockedTotalLabel} numberOfLines={1}>
                Разом ({lockedCategoryName}):
              </Text>
              <Text
                style={styles.lockedTotalAmount}
                numberOfLines={1}
                adjustsFontSizeToFit
                minimumFontScale={0.6}
              >
                {formatMoney(lockedCategoryTotal)} {selectedWalletCurrencySymbol}
              </Text>
            </View>
          </View>
        </View>
      ) : (
        <>
          <View style={styles.walletsSelector}>
            <FlatList
              ref={walletsListRef}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 20, gap: 10 }}
              data={wallets}
              keyExtractor={(item) => item.id}
              onScrollToIndexFailed={(info) => {
                const wait = new Promise(resolve => setTimeout(resolve, 500));
                wait.then(() => {
                  walletsListRef.current?.scrollToIndex({ index: info.index, animated: true });
                });
              }}
              renderItem={({ item: wallet, index }) => {
                const isSelected = selectedWalletId === wallet.id;
                const walletCurrencySymbol = CURRENCIES.find(c => c.code === wallet.currency)?.symbol || wallet.currency;

                const activeColor = wallet.isCrypto ? cryptoColor : colors.primary;

                return (
                  <TouchableOpacity
                    onPress={() => {
                      setSelectedWalletId(wallet.id);
                      walletsListRef.current?.scrollToIndex({ index, animated: true, viewPosition: 0.5 });
                    }}
                    style={[
                      styles.walletPill,
                      isSelected && { backgroundColor: activeColor },
                      wallet.isArchived && !isSelected && { opacity: 0.6 },
                    ]}
                  >
                    <Ionicons name={wallet.icon as any} size={16} color={isSelected ? colors.white : colors.textSecondary} />
                    <Text style={[styles.walletPillText, isSelected && { color: colors.white, fontWeight: 'bold' }]}>
                      {wallet.title} {walletCurrencySymbol} {wallet.isArchived ? '(Архів)' : ''}
                    </Text>
                  </TouchableOpacity>
                );
              }}
            />
          </View>

          <View style={styles.dateSelector}>
            <TouchableOpacity onPress={() => changeMonth(-1)} style={styles.dateArrow}>
              <Ionicons name="chevron-back" size={24} color={colors.textSecondary} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setMonthPickerVisible(true)} style={styles.dateCenter}>
              <Text style={styles.dateText}>{getFormattedDate(currentDate)}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => changeMonth(1)} style={styles.dateArrow}>
              <Ionicons name="chevron-forward" size={24} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>
        </>
      )}

      <SectionList
        sections={groupedTransactions}
        keyExtractor={(item) => item.id}
        renderItem={renderTransaction}
        renderSectionHeader={({ section: { title } }) => (
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionHeaderText}>{title}</Text>
          </View>
        )}
        contentContainerStyle={styles.listContent}
        stickySectionHeadersEnabled={false}
        ListEmptyComponent={
          <View style={styles.emptyBox}>
            <Ionicons name="receipt-outline" size={64} color={colors.outline} />
            <Text style={styles.emptyText}>
              {isLockedFiltersMode ? 'Немає операцій у цій категорії за обраний період' : 'У цьому місяці немає операцій'}
            </Text>
          </View>
        }
      />

      {!isLockedFiltersMode && (
        <MonthPickerModal
          visible={isMonthPickerVisible}
          onClose={() => setMonthPickerVisible(false)}
          currentDate={currentDate}
          onSelect={setCurrentDate}
          activeMonths={activeMonths}
        />
      )}

      <TransactionModal
        visible={isTransactionModalVisible}
        onClose={() => {
          setTransactionModalVisible(false);
          setEditingTransaction(null);
        }}
        type={editingTransaction?.type || 'expense'}
        categoryId={editingTransaction?.categoryId}
        categoryName={editingTransaction?.categoryName}
        walletId={editingTransaction?.walletId || selectedWalletId}
        editingTransaction={editingTransaction}
      />
    </View>
  );
};