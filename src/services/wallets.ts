import AsyncStorage from '@react-native-async-storage/async-storage';
import { collection, doc, getDocs, increment, onSnapshot, query, updateDoc, where, writeBatch } from "firebase/firestore";
import { auth, db } from "../config/firebase";
import { sanitizeFirestoreUpdate } from '../utils/sanitizeFirestoreData';

import { startSync } from './syncEngine';
import { addToSyncQueue, getSyncQueue, subscribeToSyncQueueChanges } from './syncManager';

const WALLETS_CACHE_KEY = '@cached_wallets';

export interface Wallet {
  id: string;
  userId: string;
  title: string;
  icon: string;
  currency: string;
  balance: number;
  order?: number;
  isArchived?: boolean;
  isPending?: boolean;
  excludeFromTotal?: boolean;
  isCrypto?: boolean;
}

export type CreateWalletInput = Omit<Wallet, "id" | "userId" | "balance" | "order">;
export type UpdateWalletInput = Partial<Omit<Wallet, "id" | "userId">>;

const getMergedWallets = async (baseWallets: Wallet[]): Promise<Wallet[]> => {
  const queue = await getSyncQueue();

  const pendingWallets = queue
    .filter((task) => task.type === 'WALLET_CREATE' && task.status !== 'FAILED')
    .map((task) => ({ ...task.payload, id: task.id, isPending: true } as Wallet))
  .filter((pendingWallet) => {
      return !baseWallets.some((baseWallet) => (baseWallet as any).createdAt === (pendingWallet as any).createdAt);
    });

  const pendingTransactions = queue.filter((task) => task.type === 'TRANSACTION' && task.status !== 'FAILED');
  const pendingTransactionDeletes = queue.filter(
    (task) => task.type === 'TRANSACTION_DELETE' && task.status !== 'FAILED',
  );
  const pendingTransactionUpdates = queue.filter(
    (task) => task.type === 'TRANSACTION_UPDATE' && task.status !== 'FAILED',
  );

  const deltaByWalletId = pendingTransactions.reduce<Record<string, number>>((accumulator, task) => {
    const walletId = task.payload?.walletId;
    if (!walletId) {
      return accumulator;
    }

    const amount = Number(task.payload?.amount || 0);
    const delta = task.payload?.type === 'expense' ? -amount : amount;
    accumulator[walletId] = (accumulator[walletId] || 0) + delta;
    return accumulator;
  }, {});

  pendingTransactionDeletes.forEach((task) => {
    const walletId = task.payload?.walletId;
    if (!walletId) {
      return;
    }

    const amount = Number(task.payload?.amount || 0);
    const reverseDelta = task.payload?.type === 'expense' ? amount : -amount;
    deltaByWalletId[walletId] = (deltaByWalletId[walletId] || 0) + reverseDelta;
  });

  pendingTransactionUpdates.forEach((task) => {
    const oldWalletId = task.payload?.oldWalletId;
    const newWalletId = task.payload?.walletId;
    if (!oldWalletId || !newWalletId) {
      return;
    }

    const oldAmount = Number(task.payload?.oldAmount || 0);
    const newAmount = Number(task.payload?.amount || 0);
    const oldType = task.payload?.oldType;
    const newType = task.payload?.type;

    const oldEffect = oldType === 'expense' ? -oldAmount : oldAmount;
    const newEffect = newType === 'expense' ? -newAmount : newAmount;

    deltaByWalletId[oldWalletId] = (deltaByWalletId[oldWalletId] || 0) - oldEffect;
    deltaByWalletId[newWalletId] = (deltaByWalletId[newWalletId] || 0) + newEffect;
  });

  const allWallets = [...baseWallets, ...pendingWallets].map((wallet) => ({
    ...wallet,
    balance: Number(wallet.balance || 0) + Number(deltaByWalletId[wallet.id] || 0),
  }));

  return allWallets;
};

export const subscribeToWallets = (onUpdate: (wallets: Wallet[]) => void) => {
  const user = auth.currentUser;
  if (!user) {
    onUpdate([]);
    return () => {};
  }

  let baseWallets: Wallet[] = [];

  const emitMergedWallets = async () => {
    const merged = await getMergedWallets(baseWallets);
    onUpdate(merged);
  };

  const loadInitialData = async () => {
    try {
      const cachedData = await AsyncStorage.getItem(WALLETS_CACHE_KEY);
      baseWallets = cachedData ? JSON.parse(cachedData) : [];
      await emitMergedWallets();
    } catch (error) {
      console.error('Помилка читання кешу рахунків:', error);
    }
  };

  loadInitialData();

  const q = query(collection(db, "wallets"), where("userId", "==", user.uid));
  const unsubscribeQueue = subscribeToSyncQueueChanges(() => {
    emitMergedWallets();
  });

  const unsubscribeSnapshot = onSnapshot(q, async (snapshot) => {
    let wallets = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Wallet[];

    if (wallets.length === 0 && snapshot.metadata.fromCache) {
      const cachedData = await AsyncStorage.getItem(WALLETS_CACHE_KEY);
      if (cachedData) {
        wallets = JSON.parse(cachedData);
      }
    } else {
      await AsyncStorage.setItem(WALLETS_CACHE_KEY, JSON.stringify(wallets));
    }

    baseWallets = wallets;
    await emitMergedWallets();
  });

  return () => {
    unsubscribeQueue();
    unsubscribeSnapshot();
  };
};

export const updateWalletBalance = async (walletId: string, amount: number) => {
  const user = auth.currentUser;
  if (!user) {
    // console.error("Користувач не авторизований");
    return false;
  }

  if (walletId.startsWith('task_')) {
    return false;
  }

  const walletRef = doc(db, "wallets", walletId);
  try {
    await updateDoc(walletRef, {
      balance: increment(amount)
    });
    return true;
  } catch (error) {
    console.error("Помилка оновлення балансу рахунку:", error);
    return false;
  }
};

export const updateWallet = async (walletId: string, updates: UpdateWalletInput) => {
  const user = auth.currentUser;
  if (!user) {
    // console.error("Користувач не авторизований");
    return false;
  }

  if (walletId.startsWith('task_')) {
    return false;
  }

  const walletRef = doc(db, "wallets", walletId);
  await updateDoc(walletRef, sanitizeFirestoreUpdate(updates));
  return true;
};

export const updateWalletsOrder = async (orderedWallets: Wallet[]) => {
  const user = auth.currentUser;
  if (!user) {
    // console.error("Користувач не авторизований");
    return false;
  }

  const batch = writeBatch(db);
  let hasUpdates = false;
  orderedWallets.forEach((wallet, index) => {
    if (wallet.id.startsWith('task_')) {
      return;
    }

    const ref = doc(db, "wallets", wallet.id);
    batch.update(ref, { order: index });
    hasUpdates = true;
  });

  if (!hasUpdates) {
    return false;
  }

  await batch.commit();
  return true;
};

export const createWallet = async (walletData: CreateWalletInput) => {
  try {
    const user = auth.currentUser;
    if (!user) {
      // console.error("Користувач не авторизований");
      return false;
    }

    const payload = {
      ...walletData,
      userId: user.uid,
      balance: 0,
      order: Date.now(),
      createdAt: new Date().toISOString(),
    };

    await addToSyncQueue('WALLET_CREATE', payload);
    startSync();
    return true;
  } catch (error) {
    console.error("Помилка створення рахунку:", error);
    return false;
  }
};

export const archiveWallet = async (walletId: string) => {
  try {
    const user = auth.currentUser;
    if (!user) {
      // console.error("Користувач не авторизований");
      return false;
    }

    if (walletId.startsWith('task_')) {
      return false;
    }

    const walletRef = doc(db, "wallets", walletId);
    await updateDoc(walletRef, { 
      isArchived: true,
      order: 999
    });
    return true;
  } catch (error) {
    console.error("Помилка архівування рахунку:", error);
    return false;
  }
};

export const permanentDeleteWallet = async (walletId: string) => {
  const user = auth.currentUser;
  if (!user) {
    // console.error("Користувач не авторизований");
    return null;
  }

  if (walletId.startsWith('task_')) {
    return null;
  }

  const batch = writeBatch(db);

  const q = query(
    collection(db, "transactions"),
    where("userId", "==", user.uid),
    where("walletId", "==", walletId)
  );
  const snapshot = await getDocs(q);
  
  snapshot.forEach((transactionDoc) => {
    batch.delete(transactionDoc.ref);
  });

  batch.delete(doc(db, "wallets", walletId));

  await batch.commit();
  return snapshot.size;
};