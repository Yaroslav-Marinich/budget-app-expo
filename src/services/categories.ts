import NetInfo from '@react-native-community/netinfo';
import { addDoc, collection, deleteDoc, doc, getDocs, onSnapshot, query, updateDoc, where, writeBatch } from "firebase/firestore";

import { auth, db } from "../config/firebase";
import { Colors } from "../constants/Colors";
import { sanitizeFirestoreData, sanitizeFirestoreUpdate } from '../utils/sanitizeFirestoreData';

export const DEFAULT_CATEGORIES: Omit<Category, "id" | "userId">[] = [
  // Витрати
  { name: 'Продукти', icon: 'cart', color: Colors.categoryColors[0], type: 'expense', order: 1 },
  { name: 'Розваги', icon: 'game-controller', color: Colors.categoryColors[2], type: 'expense', order: 2 },
  { name: 'Кафе', icon: 'cafe', color: Colors.categoryColors[4], type: 'expense', order: 3 },
  { name: 'Комуналка', icon: 'home', color: Colors.categoryColors[3], type: 'expense', order: 4 },
  // Доходи
  { name: 'Зарплата', icon: 'cash', color: Colors.categoryColors[1], type: 'income', order: 1 },
  { name: 'Кешбек', icon: 'gift', color: Colors.categoryColors[5], type: 'income', order: 2 },
];

export interface Category {
  id: string;
  userId: string;
  name: string;
  icon: string;
  color: string;
  type: 'expense' | 'income';
  order?: number;
  isArchived?: boolean;
  isCrypto?: boolean;
}

const isNetworkAvailable = async () => {
  const netState = await NetInfo.fetch();
  return !!netState.isConnected && netState.isInternetReachable !== false;
};

// Функція створення нової категорії
export const addCategory = async (data: Omit<Category, "id" | "userId">) => {
  try {
    const user = auth.currentUser;
    if (!user) {
      // console.error("Користувач не авторизований");
      return null;
    }

    const isOnline = await isNetworkAvailable();
    if (!isOnline) {
      return null;
    }

    const docRef = await addDoc(collection(db, "categories"), sanitizeFirestoreData({
      ...data,
      userId: user.uid,
    }));
    return docRef.id;
  } catch (error) {
    console.error("Помилка додавання категорії:", error);
    return null;
  }
};

// Підписка на всі категорії користувача у реальному часі
export const subscribeToCategories = (callback: (categories: Category[]) => void) => {
  const user = auth.currentUser;
  if (!user) {
    callback([]);
    return () => {};
  }

  const q = query(
    collection(db, "categories"),
    where("userId", "==", user.uid)
  );

  return onSnapshot(q, (snapshot) => {
    const categoriesData: Category[] = [];
    snapshot.forEach((doc) => {
      categoriesData.push({ id: doc.id, ...doc.data() } as Category);
    });
    callback(categoriesData.sort((a, b) => (a.order || 0) - (b.order || 0)));
  });
};

// Оновлення порядку категорій
export const updateCategoriesOrder = async (categories: Category[]) => {
  const user = auth.currentUser;
  if (!user) {
    // console.error("Користувач не авторизований");
    return false;
  }

  if (!(await isNetworkAvailable())) {
    return false;
  }

  const batch = writeBatch(db);
  categories.forEach((cat, index) => {
    const catRef = doc(db, "categories", cat.id);
    batch.update(catRef, { order: index });
  });
  await batch.commit();
  return true;
};

// Видалення з перенесенням транзакцій
export const deleteAndReassignCategory = async (
  deletedCategoryId: string, 
  newCategory: Category
) => {
  const user = auth.currentUser;
  if (!user) {
    // console.error("Користувач не авторизований");
    return null;
  }

  if (!(await isNetworkAvailable())) {
    return null;
  }

  const batch = writeBatch(db);

  const q = query(
    collection(db, "transactions"),
    where("userId", "==", user.uid),
    where("categoryId", "==", deletedCategoryId)
  );
  const snapshot = await getDocs(q);

  snapshot.forEach((txDoc) => {
    batch.update(txDoc.ref, {
      categoryId: newCategory.id,
      categoryName: newCategory.name
    });
  });

  const catRef = doc(db, "categories", deletedCategoryId);
  batch.delete(catRef);

  await batch.commit();
  return snapshot.size;
};

// Перевірка, чи є транзакції у категорії
export const checkCategoryHasTransactions = async (categoryId: string) => {
  const user = auth.currentUser;
  if (!user) {
    // console.error("Користувач не авторизований");
    return false;
  }

  const q = query(
    collection(db, "transactions"),
    where("userId", "==", user.uid),
    where("categoryId", "==", categoryId)
  );
  const snapshot = await getDocs(q);
  return !snapshot.empty; // Поверне true, якщо є хоча б одна транзакція
};

// Просте видалення категорії (коли операцій немає)
export const deleteCategory = async (categoryId: string) => {
  try {
    const user = auth.currentUser;
    if (!user) {
      // console.error("Користувач не авторизований");
      return false;
    }

    if (!(await isNetworkAvailable())) {
      return false;
    }

    await deleteDoc(doc(db, "categories", categoryId));
    return true;
  } catch (error) {
    console.error("Помилка простого видалення категорії:", error);
    return false;
  }
};

export const updateCategory = async (categoryId: string, data: Partial<Omit<Category, "id" | "userId">>) => {
  try {
    const user = auth.currentUser;
    if (!user) {
      // console.error("Користувач не авторизований");
      return false;
    }

    if (!(await isNetworkAvailable())) {
      return false;
    }

    const catRef = doc(db, "categories", categoryId);
    await updateDoc(catRef, sanitizeFirestoreUpdate(data));
    return true;
  } catch (error) {
    console.error("Помилка оновлення категорії:", error);
    return false;
  }
};