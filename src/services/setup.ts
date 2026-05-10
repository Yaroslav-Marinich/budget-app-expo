import { collection, doc, getDoc, writeBatch } from "firebase/firestore";
import { auth, db } from "../config/firebase";
import { DEFAULT_CATEGORIES } from "./categories";

export const initializeUserData = async () => {
  try {
    const user = auth.currentUser;
    if (!user) return;

    const settingsRef = doc(db, "userSettings", user.uid);
    const settingsSnap = await getDoc(settingsRef);

    if (settingsSnap.exists() && settingsSnap.data().isInitialDataCreated) {
      return; 
    }

    const batch = writeBatch(db);

    DEFAULT_CATEGORIES.forEach((cat) => {
      const newCatRef = doc(collection(db, "categories"));
      batch.set(newCatRef, { ...cat, userId: user.uid });
    });

    const walletRef = doc(collection(db, "wallets"));
    batch.set(walletRef, {
      userId: user.uid,
      title: "Готівка",
      icon: "cash-outline",
      currency: "UAH",
      balance: 0,
      order: 0,
      isArchived: false,
    });

    batch.set(settingsRef, { isInitialDataCreated: true }, { merge: true });

    await batch.commit();
    console.log("✅ Ініціалізація нового користувача успішна!");
  } catch (error) {
    console.error("❌ Помилка ініціалізації даних:", error);
  }
};