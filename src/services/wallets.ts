import { addDoc, collection, doc, getDocs, increment, onSnapshot, query, updateDoc, where, writeBatch } from "firebase/firestore";
import { auth, db } from "../config/firebase";

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

export type CreateWalletInput = Omit<Wallet, "id" | "userId" | "balance" | "order">;
export type UpdateWalletInput = Partial<Omit<Wallet, "id" | "userId">>;

export const subscribeToWallets = (onUpdate: (wallets: Wallet[]) => void) => {
  const user = auth.currentUser;
  if (!user) {
    
    onUpdate([]);
    return () => {};
  }

  const q = query(collection(db, "wallets"), where("userId", "==", user.uid));

  return onSnapshot(q, (snapshot) => {
    const wallets = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Wallet[];
    onUpdate(wallets);
  });
};

export const updateWalletBalance = async (walletId: string, amount: number) => {
  const user = auth.currentUser;
  if (!user) {
    // console.error("Користувач не авторизований");
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

  const walletRef = doc(db, "wallets", walletId);
  await updateDoc(walletRef, updates);
  return true;
};

export const updateWalletsOrder = async (orderedWallets: Wallet[]) => {
  const user = auth.currentUser;
  if (!user) {
    // console.error("Користувач не авторизований");
    return false;
  }

  const batch = writeBatch(db);
  orderedWallets.forEach((wallet, index) => {
    const ref = doc(db, "wallets", wallet.id);
    batch.update(ref, { order: index });
  });
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

    await addDoc(collection(db, "wallets"), {
      ...walletData,
      userId: user.uid,
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
    const user = auth.currentUser;
    if (!user) {
      // console.error("Користувач не авторизований");
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