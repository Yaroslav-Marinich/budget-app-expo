import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from "@react-native-community/netinfo";
import { collection, doc, getDoc, increment, onSnapshot, query, where, writeBatch } from "firebase/firestore";

import { auth, db } from "../config/firebase";
import { startSync } from './syncEngine';
import {
  addToSyncQueue,
  getSyncQueue,
  subscribeToSyncQueueChanges,
  updateTaskInQueue
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
  isTransfer?: boolean;
  linkedTransferId?: string;
  transferWalletId?: string;
}

export type CreateTransactionInput = Omit<TransactionData, 'userId'>;

export interface DeleteTransactionInput {
  transactionId: string;
  walletId: string;
  amount: number;
  type: 'income' | 'expense';
  monthYear?: string;
  isTransfer?: boolean;
  linkedTransferId?: string;
  transferWalletId?: string;
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
      return false;
    }

    const cleanData = Object.fromEntries(
      Object.entries(data).filter(([_, v]) => v !== undefined)
    );

    const payload = {
      userId: user.uid,
      ...cleanData,
      date: cleanData.date || new Date().toISOString(),
      monthYear: cleanData.monthYear || new Date().toISOString().slice(0, 7),
    };

    await addToSyncQueue('TRANSACTION', payload);
    startSync();
    return true;
  } catch (error) {
    console.error("Помилка додавання транзакції:", error);
    return false;
  }
};

export const deleteTransaction = async (input: DeleteTransactionInput) => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error("Користувач не авторизований");

    const netInfo = await NetInfo.fetch();
    const isOnline = netInfo.isConnected && netInfo.isInternetReachable !== false;

    if (!isOnline) {
      throw new Error("Немає підключення до інтернету. Видалення переказу можливе лише онлайн.");
    }

    const batch = writeBatch(db);

    const currentTxRef = doc(db, "transactions", input.transactionId);
    batch.delete(currentTxRef);

    const currentWalletRef = doc(db, "wallets", input.walletId);
    batch.update(currentWalletRef, {
      balance: increment(input.type === 'expense' ? input.amount : -input.amount)
    });

    if (input.isTransfer && input.linkedTransferId && input.transferWalletId) {
      const linkedTxRef = doc(db, "transactions", input.linkedTransferId);

      const linkedTxSnap = await getDoc(linkedTxRef);
      let linkedAmountToReverse = input.amount;

      if (linkedTxSnap.exists()) {
        linkedAmountToReverse = linkedTxSnap.data().amount;
      }

      batch.delete(linkedTxRef);

      const linkedWalletRef = doc(db, "wallets", input.transferWalletId);

      const linkedAmountChange = input.type === 'expense' ? -linkedAmountToReverse : linkedAmountToReverse;

      batch.update(linkedWalletRef, {
        balance: increment(linkedAmountChange)
      });
    }

    await batch.commit();

    if (input.monthYear) {
      const cacheKey = `@cached_transactions_${input.monthYear}`;
      const cachedData = await AsyncStorage.getItem(cacheKey);

      if (cachedData) {
        let transactions: any[] = JSON.parse(cachedData);

        transactions = transactions.filter(t => t.id !== input.transactionId);

        if (input.isTransfer && input.linkedTransferId) {
          transactions = transactions.filter(t => t.id !== input.linkedTransferId);
        }

        await AsyncStorage.setItem(cacheKey, JSON.stringify(transactions));
      }
    }

    return { success: true };
  } catch (error) {
    console.error("❌ Помилка видалення транзакції:", error);
    throw error;
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

export const createTransfer = async (
  sourceWalletId: string,
  destWalletId: string,
  amount: number,
  destAmount: number,
  date: string,
  monthYear: string
) => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error("Користувач не авторизований");

    const batch = writeBatch(db);

    const expenseDocRef = doc(collection(db, "transactions"));
    const incomeDocRef = doc(collection(db, "transactions"));

    // 1. Транзакція Списання (Expense)
    const expenseData: TransactionData = {
      userId: user.uid,
      amount: amount,
      type: 'expense',
      categoryId: 'transfer_system',
      categoryName: 'Переказ',
      walletId: sourceWalletId,
      date: date,
      monthYear: monthYear,
      isTransfer: true,
      linkedTransferId: incomeDocRef.id,
      transferWalletId: destWalletId,
    };

    // 2. Транзакція Зарахування (Income)
    const incomeData: TransactionData = {
      userId: user.uid,
      amount: destAmount,
      type: 'income',
      categoryId: 'transfer_system',
      categoryName: 'Переказ',
      walletId: destWalletId,
      date: date,
      monthYear: monthYear,
      isTransfer: true,
      linkedTransferId: expenseDocRef.id,
      transferWalletId: sourceWalletId,
    };

    batch.set(expenseDocRef, expenseData);
    batch.set(incomeDocRef, incomeData);

    // 3. Оновлення балансів рахунків у Firebase
    const sourceWalletRef = doc(db, "wallets", sourceWalletId);
    const destWalletRef = doc(db, "wallets", destWalletId);

    batch.update(sourceWalletRef, { balance: increment(-amount) });
    batch.update(destWalletRef, { balance: increment(destAmount) });

    // Виконуємо пакетний запис
    await batch.commit();
    return { success: true };
  } catch (error) {
    console.error("Помилка при створенні переказу:", error);
    throw error;
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