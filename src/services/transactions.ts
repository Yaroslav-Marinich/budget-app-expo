import { addDoc, collection, onSnapshot, query, serverTimestamp, where } from "firebase/firestore";
import { db } from "../firebase/config";
import { updateWalletBalance } from "./wallets";

export interface TransactionData {
  userId: string;
  amount: number;
  type: 'income' | 'expense';
  categoryId: string;
  categoryName: string;
  walletId: string; 
}

export const addTransaction = async (data: any) => {
  try {
    const docRef = await addDoc(collection(db, "transactions"), {
      ...data,
      date: serverTimestamp(),
      monthYear: new Date().toISOString().slice(0, 7),
    });
    
    const balanceChange = data.type === 'expense' ? -data.amount : data.amount;
    await updateWalletBalance(data.walletId, balanceChange);

    return true;
  } catch (error) {
    return false;
  }
};

export const subscribeToMonthlyTransactions = (
  userId: string,
  monthYear: string,
  onUpdate: (transactions: any[]) => void
) => {
  const q = query(
    collection(db, "transactions"),
    where("userId", "==", userId),
    where("monthYear", "==", monthYear)
  );

  const unsubscribe = onSnapshot(q, (snapshot) => {
    const transactions = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    onUpdate(transactions);
  });

  return unsubscribe;
};