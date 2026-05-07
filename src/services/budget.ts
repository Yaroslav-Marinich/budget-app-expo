import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../config/firebase";

export const addTransaction = async (data: {
  amount: number,
  currency: string,
  category: string,
  type: 'expense' | 'income',
  familyId?: string
}) => {
  const user = auth.currentUser;
  if (!user) {
    // console.error("Користувач не авторизований");
    return false;
  }

  await addDoc(collection(db, "transactions"), {
    ...data,
    userId: user.uid,
    date: serverTimestamp(),
    monthYear: new Date().toISOString().slice(0, 7), // Для легкої фільтрації аналітики (напр. "2024-05")
  });

  return true;
};