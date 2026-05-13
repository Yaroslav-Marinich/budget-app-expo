import { collection, deleteField, doc, getDoc, setDoc, updateDoc, writeBatch } from "firebase/firestore";
import { auth, db } from "../config/firebase";
import { DEFAULT_CATEGORIES } from "./categories";
export interface MeterNotificationSettings {
  enabled: boolean;
  dayOption: 'first' | 'second_last' | 'last';
  time: string;
}

export interface SubNotificationSettings {
  enabled: boolean;
  offsetDays: number;
  time: string;
}

export interface ThemeSettings {
  isDarkMode: boolean;
  customBackground: string | null;
}

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

/**
 * Зберігає налаштування сповіщень у Firestore
 */
export const saveNotificationSettings = async (userId: string, settings: MeterNotificationSettings) => {
  const settingsRef = doc(db, "userSettings", userId);
  try {
    await setDoc(settingsRef, {
      notifications: {
        meters: settings
      }
    }, { merge: true });
    console.log("✅ Налаштування сповіщень збережено в БД");
  } catch (error) {
    console.error("❌ Помилка при збереженні налаштувань:", error);
    throw error;
  }
};

/**
 * Отримує налаштування сповіщень з Firestore
 */
export const getNotificationSettings = async (userId: string): Promise<MeterNotificationSettings | null> => {
  const settingsRef = doc(db, "userSettings", userId);
  try {
    const snap = await getDoc(settingsRef);
    if (snap.exists() && snap.data().notifications?.meters) {
      return snap.data().notifications.meters;
    }
    return null;
  } catch (error) {
    console.error("❌ Помилка при отриманні налаштувань:", error);
    return null;
  }
};

/**
 * Повністю видаляє налаштування сповіщень про лічильники з БД
 */
export const deleteMeterSettingsFromDB = async (userId: string) => {
  const settingsRef = doc(db, "userSettings", userId);
  try {
    await updateDoc(settingsRef, {
      "notifications.meters": deleteField()
    });
    console.log("✅ Дані про лічильники видалено з БД");
  } catch (error) {
    console.error("❌ Помилка видалення з БД:", error);
  }
};

// Кольорові теми
export const saveThemeSettings = async (userId: string, settings: ThemeSettings) => {
  const settingsRef = doc(db, "userSettings", userId);
  try {
    await setDoc(settingsRef, { theme: settings }, { merge: true });
    console.log("✅ Налаштування теми збережено");
  } catch (error) {
    console.error("❌ Помилка збереження теми:", error);
  }
};

export const getThemeSettings = async (userId: string): Promise<ThemeSettings | null> => {
  const settingsRef = doc(db, "userSettings", userId);
  try {
    const snap = await getDoc(settingsRef);
    if (snap.exists() && snap.data().theme) {
      return snap.data().theme;
    }
    return null;
  } catch (error) {
    return null;
  }
};

/**
 * Зберігає налаштування сповіщень для ПІДПИСОК
 */
export const saveSubNotificationSettings = async (userId: string, settings: SubNotificationSettings) => {
  const settingsRef = doc(db, "userSettings", userId);
  try {
    await setDoc(settingsRef, {
      notifications: {
        subscriptions: settings
      }
    }, { merge: true });
    console.log("✅ Налаштування сповіщень підписок збережено в БД");
  } catch (error) {
    console.error("❌ Помилка при збереженні налаштувань підписок:", error);
    throw error;
  }
};

/**
 * Отримує налаштування сповіщень ПІДПИСОК
 */
export const getSubNotificationSettings = async (userId: string): Promise<SubNotificationSettings | null> => {
  const settingsRef = doc(db, "userSettings", userId);
  try {
    const snap = await getDoc(settingsRef);
    if (snap.exists() && snap.data().notifications?.subscriptions) {
      return snap.data().notifications.subscriptions;
    }
    return null;
  } catch (error) {
    console.error("❌ Помилка при отриманні налаштувань підписок:", error);
    return null;
  }
};

/**
 * Повністю видаляє налаштування сповіщень про підписки з БД
 */
export const deleteSubSettingsFromDB = async (userId: string) => {
  const settingsRef = doc(db, "userSettings", userId);
  try {
    await updateDoc(settingsRef, {
      "notifications.subscriptions": deleteField()
    });
    console.log("✅ Дані про сповіщення підписок видалено з БД");
  } catch (error) {
    console.error("❌ Помилка видалення сповіщень підписок з БД:", error);
  }
};