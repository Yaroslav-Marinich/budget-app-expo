import { Colors } from '@/src/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, Dimensions, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { PieChart } from "react-native-gifted-charts";

import { MonthPickerModal } from '@/src/components/ui/MonthPickerModal/MonthPickerModal';
import { auth, db } from '@/src/config/firebase';
import { CURRENCIES } from '@/src/constants/Currencies';
import { subscribeToMonthlyTransactions, TransactionData } from '@/src/services/transactions';
import { subscribeToWallets, Wallet } from '@/src/services/wallets';
import { formatMoney } from '@/src/utils/formatMoney';
import { useFocusEffect } from 'expo-router';
import { collection, getDocs, query, where } from 'firebase/firestore';

const screenWidth = Dimensions.get('window').width;

const CATEGORY_COLORS = Colors.analyticsColors;
const CARD_BG_COLOR = Colors.surfaceMuted;

export const FinancesAnalytics = () => {
  const walletsScrollViewRef = useRef<ScrollView>(null);

  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState<TransactionData[]>([]);
  const [wallets, setWallets] = useState<Wallet[]>([]);
  
  const [exchangeRates, setExchangeRates] = useState<Record<string, number>>({});
  
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedWalletId, setSelectedWalletId] = useState<string | null>(null);
  const [globalCurrency, setGlobalCurrency] = useState<string>('UAH');

  const [isMonthPickerVisible, setMonthPickerVisible] = useState(false);
  const [activeMonths, setActiveMonths] = useState<string[]>([]);

  const monthYearStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`;
  const displayMonthStr = `${currentDate.toLocaleString('uk-UA', { month: 'long' }).replace(/^./, str => str.toUpperCase())} ${currentDate.getFullYear()}`;

  useFocusEffect(
    useCallback(() => {
      setSelectedWalletId(null);
      
      walletsScrollViewRef.current?.scrollTo({ x: 0, animated: true });
      
      setCurrentDate(new Date());
    }, [])
  );

  useEffect(() => {
    fetch('https://open.er-api.com/v6/latest/USD')
      .then(res => res.json())
      .then(data => { if (data && data.rates) setExchangeRates(data.rates); })
      .catch(err => console.error('Помилка завантаження курсів валют:', err));
  }, []);

  // ПІДПИСКА НА РАХУНКИ (включаючи архівні)
  useEffect(() => {
    const unsubscribe = subscribeToWallets((data) => {
      const sortedWallets = data.sort((a, b) => {
        if (a.isArchived && !b.isArchived) return 1;
        if (!a.isArchived && b.isArchived) return -1;
        return (a.order ?? Number.MAX_SAFE_INTEGER) - (b.order ?? Number.MAX_SAFE_INTEGER);
      });
      setWallets([...sortedWallets]);
    });
    return () => unsubscribe();
  }, []);

  // ОТРИМАННЯ АКТИВНИХ МІСЯЦІВ ТА АВТО-ПЕРЕМИКАННЯ АРХІВУ
  useEffect(() => {
    const fetchActiveMonths = async () => {
      const user = auth.currentUser;
      if (!user) return;
      
      try {
        let qParams = [where("userId", "==", user.uid)];
        if (selectedWalletId) {
          qParams.push(where("walletId", "==", selectedWalletId));
        }
        
        const q = query(collection(db, "transactions"), ...qParams);
        const snap = await getDocs(q);
        
        const months = new Set<string>();
        snap.forEach(doc => {
          if (doc.data().monthYear) months.add(doc.data().monthYear);
        });
        
        const monthsArr = Array.from(months);
        setActiveMonths(monthsArr);

        const wallet = wallets.find(w => w.id === selectedWalletId);
        if (wallet?.isArchived && monthsArr.length > 0) {
           const latestMonthStr = monthsArr.sort().reverse()[0];
           const [y, m] = latestMonthStr.split('-');
           setCurrentDate(new Date(parseInt(y), parseInt(m) - 1, 1));
        }
      } catch (error) {
        console.error("Помилка завантаження активних місяців:", error);
      }
    };
    
    fetchActiveMonths();
  }, [selectedWalletId, wallets]);

  useEffect(() => {
    setLoading(true);
    const unsubscribe = subscribeToMonthlyTransactions(monthYearStr, (data) => {
      setTransactions(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [monthYearStr]);

  const changeMonth = (offset: number) => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(newDate.getMonth() + offset);
      return newDate;
    });
  };

  const uniqueCurrencies = useMemo(() => {
    const includedWallets = wallets.filter(w => !w.excludeFromTotal);
    const curs = includedWallets.map(w => w.currency);
    return Array.from(new Set(curs));
  }, [wallets]);

  useEffect(() => {
    if (uniqueCurrencies.length > 0 && !uniqueCurrencies.includes(globalCurrency)) {
      setGlobalCurrency(uniqueCurrencies[0]);
    }
  }, [uniqueCurrencies]);

  const activeCurrency = selectedWalletId
    ? wallets.find(w => w.id === selectedWalletId)?.currency || 'UAH'
    : globalCurrency;

  const currencySymbol = CURRENCIES.find(c => c.code === activeCurrency)?.symbol || '₴';

  const convertAmount = (amount: number, fromCurrency: string, toCurrency: string) => {
    if (fromCurrency === toCurrency) return amount;
    if (!exchangeRates[fromCurrency] || !exchangeRates[toCurrency]) return amount;
    const amountInUSD = amount / exchangeRates[fromCurrency];
    return amountInUSD * exchangeRates[toCurrency];
  };

  const { totalIncome, totalExpense, chartData, legendData } = useMemo(() => {
    let inc = 0;
    let exp = 0;
    const expenseGroups: Record<string, number> = {};

    const filteredTransactions = transactions.filter(t => {
      if (selectedWalletId) {
        return t.walletId === selectedWalletId;
      }
      const wallet = wallets.find(w => w.id === t.walletId);
      if (!wallet) return false;
      if (wallet.excludeFromTotal) return false;
      return true; 
    });

    filteredTransactions.forEach(t => {
      const wallet = wallets.find(w => w.id === t.walletId);
      const tCurrency = wallet ? wallet.currency : 'UAH';
      const convertedAmount = convertAmount(t.amount, tCurrency, activeCurrency);

      if (t.type === 'income') {
        inc += convertedAmount;
      } else if (t.type === 'expense') {
        exp += convertedAmount;
        expenseGroups[t.categoryName] = (expenseGroups[t.categoryName] || 0) + convertedAmount;
      }
    });

    const sortedCategories = Object.keys(expenseGroups).sort((a, b) => expenseGroups[b] - expenseGroups[a]);
    
    const chartElements: any[] = [];
    const legendElements: any[] = [];

    sortedCategories.forEach((catName, index) => {
      const amount = expenseGroups[catName];
      const percentage = exp > 0 ? ((amount / exp) * 100).toFixed(1) : '0';
      const color = CATEGORY_COLORS[index % CATEGORY_COLORS.length];

      chartElements.push({ value: amount, color: color });
      legendElements.push({ name: catName, amount, percentage, color });
    });

    return { 
      totalIncome: inc,
      totalExpense: exp,
      chartData: chartElements,
      legendData: legendElements
    };
  }, [transactions, selectedWalletId, activeCurrency, exchangeRates, wallets]);

  return (
    <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 40, paddingTop: 10 }}>
      
      {/* Селектор рахунків */}
      <View style={{ height: 50, marginBottom: 5 }}>
        <ScrollView ref={walletsScrollViewRef} horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20, gap: 10 }}>
          <TouchableOpacity
            onPress={() => setSelectedWalletId(null)}
            style={{
              paddingHorizontal: 16,
              paddingVertical: 10,
              borderRadius: 20,
              backgroundColor: selectedWalletId === null ? Colors.primary : Colors.surfaceSoft,
              flexDirection: 'row',
              alignItems: 'center',
            }}
          >
            <Text style={{ color: selectedWalletId === null ? Colors.white : Colors.text, fontWeight: selectedWalletId === null ? 'bold' : 'normal' }}>
              Всі рахунки
            </Text>
          </TouchableOpacity>

          {wallets.map(wallet => {
            const isSelected = selectedWalletId === wallet.id;
            const walletCurrencySymbol = CURRENCIES.find(c => c.code === wallet.currency)?.symbol || wallet.currency;

            return (
              <TouchableOpacity
                key={wallet.id}
                onPress={() => setSelectedWalletId(wallet.id)}
                style={{
                  paddingHorizontal: 16,
                  paddingVertical: 10,
                  borderRadius: 20,
                  backgroundColor: isSelected ? Colors.primary : Colors.surfaceSoft,
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 8,
                  opacity: wallet.isArchived && !isSelected ? 0.6 : 1, 
                  borderWidth: wallet.isArchived ? 1 : 0,
                  borderColor: wallet.isArchived && !isSelected ? Colors.textSecondary : 'transparent',
                  borderStyle: wallet.isArchived ? 'dashed' : 'solid',
                }}
              >
                <Ionicons name={wallet.icon as any} size={16} color={isSelected ? Colors.white : Colors.textSecondary} />
                <Text style={{ color: isSelected ? Colors.white : Colors.text, fontWeight: isSelected ? 'bold' : 'normal' }}>
                  {wallet.title} {walletCurrencySymbol} {wallet.isArchived ? '(Архів)' : ''}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Глобальна валюта */}
      {selectedWalletId === null && uniqueCurrencies.length > 1 && (
        <View style={{ paddingHorizontal: 20, marginBottom: 15,marginTop: 10, flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          <Text style={{ color: Colors.textSecondary, fontSize: 13 }}>Звести у валюті:</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
            {uniqueCurrencies.map(code => {
              const sym = CURRENCIES.find(c => c.code === code)?.symbol || code;
              const isActive = globalCurrency === code;
              return (
                <TouchableOpacity
                  key={code}
                  onPress={() => setGlobalCurrency(code)}
                  style={{
                    paddingHorizontal: 12,
                    paddingVertical: 6,
                    borderRadius: 12,
                    backgroundColor: isActive ? Colors.surfacePressed : Colors.surfaceMuted,
                    borderWidth: 1,
                    borderColor: isActive ? Colors.textSecondary : 'transparent'
                  }}
                >
                  <Text style={{ color: isActive ? Colors.text : Colors.textSecondary, fontWeight: isActive ? 'bold' : 'normal' }}>
                    {sym} {code}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      )}

      {/* Селектор місяця */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, marginBottom: 20, marginTop: selectedWalletId === null && uniqueCurrencies.length > 1 ? 5 : 15 }}>
        <TouchableOpacity onPress={() => changeMonth(-1)} style={{ padding: 10, backgroundColor: Colors.surfaceSoft, borderRadius: 12 }}>
          <Ionicons name="chevron-back" size={24} color={Colors.text} />
        </TouchableOpacity>
        
        <TouchableOpacity onPress={() => setMonthPickerVisible(true)} style={{ paddingHorizontal: 10, paddingVertical: 5 }}>
          <Text style={{ color: Colors.text, fontSize: 18, fontWeight: 'bold' }}>
            {displayMonthStr}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => changeMonth(1)} style={{ padding: 10, backgroundColor: Colors.surfaceSoft, borderRadius: 12 }}>
          <Ionicons name="chevron-forward" size={24} color={Colors.text} />
        </TouchableOpacity>
      </View>

      {/* Картки Балансу */}
 <View style={{ flexDirection: 'row', paddingHorizontal: 20, gap: 15, marginBottom: 30 }}>
        
        {/* Картка ДОХОДИ (Зелена) */}
        <View style={{ flex: 1, backgroundColor: 'rgba(46, 125, 50, 0.1)', padding: 15, borderRadius: 16, borderLeftWidth: 4, borderColor: Colors.accent }}>
          <Text style={{ color: Colors.textSecondary, fontSize: 13, marginBottom: 5 }}>Доходи</Text>
          <Text style={{ color: Colors.accent, fontSize: 20, fontWeight: 'bold' }}>
            + {formatMoney(totalIncome)} {currencySymbol}
          </Text>
        </View>

        {/* Картка ВИТРАТИ (Червона) */}
        <View style={{ flex: 1, backgroundColor: Colors.errorSoft, padding: 15, borderRadius: 16, borderLeftWidth: 4, borderColor: Colors.errorBright }}>
          <Text style={{ color: Colors.textSecondary, fontSize: 13, marginBottom: 5 }}>Витрати</Text>
          <Text style={{ color: Colors.errorBright, fontSize: 20, fontWeight: 'bold' }}>
            - {formatMoney(totalExpense)} {currencySymbol}
          </Text>
        </View>

      </View>

      {/* Кільцева діаграма */}
      <View style={{ marginHorizontal: 20, backgroundColor: CARD_BG_COLOR, borderRadius: 20, padding: 20, alignItems: 'center' }}>
        <Text style={{ color: Colors.text, fontSize: 18, fontWeight: 'bold', marginBottom: 20, alignSelf: 'flex-start' }}>
          Структура витрат
        </Text>

        {loading ? (
          <View style={{ height: 200, justifyContent: 'center' }}><ActivityIndicator color={Colors.primary} /></View>
        ) : chartData.length > 0 ? (
          <View style={{ alignItems: 'center', justifyContent: 'center', marginVertical: 10, position: 'relative' }}>
            <PieChart
              data={chartData}
              donut
              radius={screenWidth * 0.3} 
              innerRadius={screenWidth * 0.22} 
              innerCircleColor={Colors.background} 
              innerCircleBorderWidth={1} 
              innerCircleBorderColor={Colors.outlineSoft}
              centerLabelComponent={() => {
                return (
                  <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ fontSize: 13, color: Colors.textSecondary, marginBottom: 4 }}>Всього</Text>
                    <Text style={{ fontSize: 22, color: Colors.text, fontWeight: 'bold' }} numberOfLines={1} adjustsFontSizeToFit>
                      {formatMoney(totalExpense)} {currencySymbol}
                    </Text>
                  </View>
                );
              }}
            />
          </View>
        ) : (
          <View style={{ height: 150, justifyContent: 'center' }}>
            <Text style={{ color: Colors.textSecondary, textAlign: 'center' }}>
              Немає витрат для відображення.
            </Text>
          </View>
        )}
      </View>

      {/* Легенда */}
      {legendData.length > 0 && !loading && (
        <View style={{ marginHorizontal: 20, marginTop: 20, backgroundColor: Colors.surfaceMuted, borderRadius: 20, padding: 20 }}>
          <Text style={{ color: Colors.text, fontSize: 16, fontWeight: 'bold', marginBottom: 15 }}>
            Топ категорій
          </Text>
          
          {legendData.map((item, index) => (
            <View key={index} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
              <View style={{ width: 14, height: 14, borderRadius: 7, backgroundColor: item.color, marginRight: 12 }} />
              <Text style={{ flex: 1, color: Colors.text, fontSize: 16 }}>{item.name}</Text>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={{ color: Colors.text, fontSize: 16, fontWeight: 'bold' }}>{formatMoney(item.amount)} {currencySymbol}</Text>
                <Text style={{ color: Colors.textSecondary, fontSize: 12 }}>{item.percentage}%</Text>
              </View>
            </View>
          ))}
        </View>
      )}

      {/* МОДАЛКА */}
      <MonthPickerModal
        visible={isMonthPickerVisible}
        onClose={() => setMonthPickerVisible(false)}
        currentDate={currentDate}
        onSelect={setCurrentDate}
        activeMonths={activeMonths}
      />
    </ScrollView>
  );
};