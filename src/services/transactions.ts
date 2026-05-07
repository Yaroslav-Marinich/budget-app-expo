import { addDoc, collection, onSnapshot, query, serverTimestamp, where } from "firebase/firestore";
import { auth, db } from "../config/firebase";
import { updateWalletBalance } from "./wallets";

export interface TransactionData {
  userId: string;
  amount: number;
  type: 'income' | 'expense';
  categoryId: string;
  categoryName: string;
  walletId: string; 
}

export type CreateTransactionInput = Omit<TransactionData, 'userId'>;

export const addTransaction = async (data: CreateTransactionInput) => {
  try {
    const user = auth.currentUser;
    if (!user) {
      // console.error("Користувач не авторизований");
      return false;
    }

    await addDoc(collection(db, "transactions"), {
      ...data,
      userId: user.uid, 
      date: serverTimestamp(),
      monthYear: new Date().toISOString().slice(0, 7),
    });
    
    const balanceChange = data.type === 'expense' ? -data.amount : data.amount;
    await updateWalletBalance(data.walletId, balanceChange);

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

  const q = query(
    collection(db, "transactions"),
    where("userId", "==", user.uid), 
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