import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase/config";

export const addTransaction = async (userId: string, data: {
  amount: number,
  currency: string,
  category: string,
  type: 'expense' | 'income',
  familyId?: string
}) => {
  await addDoc(collection(db, "transactions"), {
    ...data,
    userId,
    date: serverTimestamp(),
    monthYear: new Date().toISOString().slice(0, 7), // Для легкої фільтрації аналітики (напр. "2024-05")
  });
};