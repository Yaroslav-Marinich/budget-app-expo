import AsyncStorage from '@react-native-async-storage/async-storage';
import { collection, onSnapshot, query, where } from "firebase/firestore";

import { auth, db } from "../config/firebase";
import { startSync } from './syncEngine';
import { addToSyncQueue, getSyncQueue, subscribeToSyncQueueChanges } from './syncManager';

export interface TransactionData {
  userId: string;
  amount: number;
  type: 'income' | 'expense';
  categoryId: string;
  categoryName: string;
  walletId: string;
  comment?: string;
  monthYear?: string;
  date?: string;
  isPending?: boolean;
}

export type CreateTransactionInput = Omit<TransactionData, 'userId'>;

export const addTransaction = async (data: CreateTransactionInput) => {
  try {
    const user = auth.currentUser;
    if (!user) {
      // console.error("Користувач не авторизований");
      return false;
    }

    const cleanData = Object.fromEntries(
      Object.entries(data).filter(([_, v]) => v !== undefined)
    );

    await addToSyncQueue('TRANSACTION', {
      ...cleanData,
      userId: user.uid,
      date: new Date().toISOString(),
      monthYear: new Date().toISOString().slice(0, 7),
    });

    startSync();

    return true;
  } catch (error) {
    console.error("Помилка додавання транзакції:", error);
    return false;
  }
};

export const subscribeToMonthlyTransactions = (
  monthYear: string,
  onUpdate: (transactions: any[]) => void
) => {
  const user = auth.currentUser;
  
  if (!user) {
    console.warn("Користувач ще не авторизований, очікуємо...");
    onUpdate([]); 
    return () => {}; 
  }

  const cacheKey = `@cached_transactions_${monthYear}`;
  let baseTransactions: any[] = [];

  const emitMergedTransactions = async () => {
    const queue = await getSyncQueue();
    const pendingTransactions = queue
      .filter((task) => task.type === 'TRANSACTION' && task.status !== 'FAILED' && task.payload?.monthYear === monthYear)
      .map((task) => ({
        id: task.id,
        ...task.payload,
        isPending: true,
      }));

    const merged = [...baseTransactions, ...pendingTransactions];
    onUpdate(merged);
  };

  const loadInitialData = async () => {
    try {
      const cachedData = await AsyncStorage.getItem(cacheKey);
      baseTransactions = cachedData ? JSON.parse(cachedData) : [];
      await emitMergedTransactions();
    } catch (error) {
      console.error('Помилка читання кешу транзакцій:', error);
    }
  };

  loadInitialData();

  const q = query(
    collection(db, "transactions"),
    where("userId", "==", user.uid),
    where("monthYear", "==", monthYear)
  );

  const unsubscribeQueue = subscribeToSyncQueueChanges(() => {
    emitMergedTransactions();
  });

  const unsubscribeSnapshot = onSnapshot(q, async (snapshot) => {
    const transactions = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    baseTransactions = transactions;
    await AsyncStorage.setItem(cacheKey, JSON.stringify(transactions));
    await emitMergedTransactions();
  });

  return () => {
    unsubscribeQueue();
    unsubscribeSnapshot();
  };
};