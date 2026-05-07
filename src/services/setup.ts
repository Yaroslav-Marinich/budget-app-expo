import { collection, doc, getDoc, writeBatch } from "firebase/firestore";
import { auth, db } from "../config/firebase";
import { DEFAULT_CATEGORIES } from "./categories";

export const initializeUserData = async () => {
  try {
    const user = auth.currentUser;
    if (!user) return;

    // Перевіряємо, чи вже створювали дані для цього юзера
    const settingsRef = doc(db, "userSettings", user.uid);
    const settingsSnap = await getDoc(settingsRef);

    if (settingsSnap.exists() && settingsSnap.data().isInitialDataCreated) {
      return; // Дані вже є, виходимо
    }

    const batch = writeBatch(db);

    // 1. Додаємо всі дефолтні категорії
    DEFAULT_CATEGORIES.forEach((cat) => {
      const newCatRef = doc(collection(db, "categories"));
      batch.set(newCatRef, { ...cat, userId: user.uid });
    });

    // 2. Додаємо стартовий рахунок "Готівка"
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

    // 3. Ставимо мітку, що ініціалізація пройдена
    batch.set(settingsRef, { isInitialDataCreated: true }, { merge: true });

    // Відправляємо все в базу одним запитом
    await batch.commit();
    console.log("✅ Ініціалізація нового користувача успішна!");
  } catch (error) {
    console.error("❌ Помилка ініціалізації даних:", error);
  }
};