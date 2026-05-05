import { addDoc, collection, doc, getDocs, increment, onSnapshot, query, updateDoc, where, writeBatch } from "firebase/firestore";
import { db } from "../firebase/config";

export interface Wallet {
  id: string;
  userId: string;
  title: string;
  icon: string;
  currency: string;
  balance: number;
  order?: number;
  isArchived?: boolean;
}

export const subscribeToWallets = (userId: string, onUpdate: (wallets: Wallet[]) => void) => {
  const q = query(collection(db, "wallets"), where("userId", "==", userId));

  return onSnapshot(q, (snapshot) => {
    const wallets = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Wallet[];
    onUpdate(wallets);
  });
};

export const updateWalletBalance = async (walletId: string, amount: number) => {
  const walletRef = doc(db, "wallets", walletId);
  try {
    await updateDoc(walletRef, {
      balance: increment(amount)
    });
  } catch (error) {
    console.error("Помилка оновлення балансу рахунку:", error);
  }
};

export const updateWallet = async (walletId: string, updates: any) => {
  const walletRef = doc(db, "wallets", walletId);
  await updateDoc(walletRef, updates);
};

export const updateWalletsOrder = async (orderedWallets: any[]) => {
  const batch = writeBatch(db);
  orderedWallets.forEach((wallet, index) => {
    const ref = doc(db, "wallets", wallet.id);
    batch.update(ref, { order: index });
  });
  await batch.commit();
};

export const createWallet = async (walletData: any) => {
  try {
    await addDoc(collection(db, "wallets"), {
      ...walletData,
      balance: 0,
      order: 99, 
    });
    return true;
  } catch (error) {
    console.error("Помилка створення рахунку:", error);
    return false;
  }
};

export const archiveWallet = async (walletId: string) => {
  try {
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
  const batch = writeBatch(db);

  const q = query(collection(db, "transactions"), where("walletId", "==", walletId));
  const snapshot = await getDocs(q);
  
  snapshot.forEach((transactionDoc) => {
    batch.delete(transactionDoc.ref);
  });

  batch.delete(doc(db, "wallets", walletId));

  await batch.commit();
  return snapshot.size;
};