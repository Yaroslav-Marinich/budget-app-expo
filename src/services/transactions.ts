import AsyncStorage from '@react-native-async-storage/async-storage';
import { collection, onSnapshot, query, where } from "firebase/firestore";

import { auth, db } from "../config/firebase";
import { startSync } from './syncEngine';
import {
  addToSyncQueue,
  getSyncQueue,
  removeTaskFromQueue,
  subscribeToSyncQueueChanges,
  updateTaskInQueue,
} from './syncManager';

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

export interface DeleteTransactionInput {
  transactionId: string;
  walletId: string;
  amount: number;
  type: 'income' | 'expense';
  monthYear?: string;
}

export interface UpdateTransactionInput {
  transactionId: string;
  oldWalletId: string;
  oldAmount: number;
  oldType: 'income' | 'expense';
  walletId: string;
  amount: number;
  type: 'income' | 'expense';
  categoryId: string;
  categoryName: string;
  comment?: string;
  monthYear?: string;
  date?: string;
}

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
      date: data.date ?? new Date().toISOString(),
      monthYear: new Date().toISOString().slice(0, 7),
    });

    startSync();

    return true;
  } catch (error) {
    console.error("Помилка додавання транзакції:", error);
    return false;
  }
};

export const deleteTransaction = async (data: DeleteTransactionInput) => {
  try {
    const user = auth.currentUser;
    if (!user) {
      return false;
    }

    // If transaction exists only in local queue, remove create task instead of syncing delete.
    if (data.transactionId.startsWith('task_')) {
      await removeTaskFromQueue(data.transactionId);
      return true;
    }

    await addToSyncQueue('TRANSACTION_DELETE', {
      userId: user.uid,
      transactionId: data.transactionId,
      walletId: data.walletId,
      amount: data.amount,
      type: data.type,
      monthYear: data.monthYear,
      date: new Date().toISOString(),
    });

    startSync();
    return true;
  } catch (error) {
    console.error('Помилка видалення транзакції:', error);
    return false;
  }
};

export const updateTransaction = async (data: UpdateTransactionInput) => {
  try {
    const user = auth.currentUser;
    if (!user) {
      return false;
    }

    const normalizedMonthYear = data.monthYear ?? new Date().toISOString().slice(0, 7);
    const normalizedDate = data.date ?? new Date().toISOString();
    const cleanComment = data.comment?.trim() || undefined;

    if (data.transactionId.startsWith('task_')) {
      await updateTaskInQueue(data.transactionId, {
        payload: {
          userId: user.uid,
          amount: data.amount,
          type: data.type,
          categoryId: data.categoryId,
          categoryName: data.categoryName,
          walletId: data.walletId,
          comment: cleanComment,
          monthYear: normalizedMonthYear,
          date: normalizedDate,
        },
      });

      startSync();
      return true;
    }

    await addToSyncQueue('TRANSACTION_UPDATE', {
      userId: user.uid,
      transactionId: data.transactionId,
      oldWalletId: data.oldWalletId,
      oldAmount: data.oldAmount,
      oldType: data.oldType,
      walletId: data.walletId,
      amount: data.amount,
      type: data.type,
      categoryId: data.categoryId,
      categoryName: data.categoryName,
      comment: cleanComment,
      monthYear: normalizedMonthYear,
      date: normalizedDate,
    });

    startSync();
    return true;
  } catch (error) {
    console.error('Помилка редагування транзакції:', error);
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
    return () => { };
  }

  const cacheKey = `@cached_transactions_${monthYear}`;
  let baseTransactions: any[] = [];

  const emitMergedTransactions = async () => {
    const queue = await getSyncQueue();
    const pendingDeleteIds = new Set(
      queue
        .filter(
          (task) =>
            task.type === 'TRANSACTION_DELETE' &&
            task.status !== 'FAILED' &&
            (!task.payload?.monthYear || task.payload?.monthYear === monthYear),
        )
        .map((task) => task.payload?.transactionId)
        .filter(Boolean),
    );
    const pendingUpdates = queue
      .filter(
        (task) =>
          task.type === 'TRANSACTION_UPDATE' &&
          task.status !== 'FAILED' &&
          (!task.payload?.monthYear || task.payload?.monthYear === monthYear),
      )
      .map((task) => task.payload)
      .filter((payload) => payload?.transactionId);
    const pendingUpdateById = new Map(
      pendingUpdates.map((payload) => [payload.transactionId, payload]),
    );

    const pendingTransactions = queue
      .filter((task) => task.type === 'TRANSACTION' && task.status !== 'FAILED' && task.payload?.monthYear === monthYear)
      .map((task) => ({
        id: task.id,
        ...task.payload,
        isPending: true,
      }))
      .filter((transaction) => !pendingDeleteIds.has(transaction.id))
      .filter((pendingTx) => {
        return !baseTransactions.some(
          (baseTx) => baseTx.date === pendingTx.date && baseTx.amount === pendingTx.amount
        );
      });

    const visibleBaseTransactions = baseTransactions
      .filter((transaction) => !pendingDeleteIds.has(transaction.id))
      .map((transaction) => {
        const pendingUpdate = pendingUpdateById.get(transaction.id);
        if (!pendingUpdate) {
          return transaction;
        }

        return {
          ...transaction,
          ...pendingUpdate,
          id: transaction.id,
          isPending: true,
        };
      });

    const merged = [...visibleBaseTransactions, ...pendingTransactions];
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