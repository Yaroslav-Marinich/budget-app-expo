import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, onSnapshot, query, updateDoc, where, writeBatch } from "firebase/firestore";
import { db } from "../firebase/config";

const DEFAULT_CATEGORIES: Omit<Category, "id" | "userId">[] = [
  // Витрати
  { name: 'Продукти', icon: 'cart', color: '#E57373', type: 'expense', order: 1 },
  { name: 'Розваги', icon: 'game-controller', color: '#BA68C8', type: 'expense', order: 2 },
  { name: 'Кафе', icon: 'cafe', color: '#FFB74D', type: 'expense', order: 3 },
  { name: 'Комуналка', icon: 'home', color: '#4CAF50', type: 'expense', order: 4 },
  // Доходи
  { name: 'Зарплата', icon: 'cash', color: '#81C784', type: 'income', order: 1 },
  { name: 'Кешбек', icon: 'gift', color: '#64B5F6', type: 'income', order: 2 },
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
}

export const seedDefaultCategories = async (userId: string) => {
  try {
    const settingsRef = doc(db, "userSettings", userId);
    const settingsSnap = await getDoc(settingsRef);

    if (settingsSnap.exists() && settingsSnap.data().isInitialCategoriesCreated) {
      return;
    }

    const batch = writeBatch(db);
    
    DEFAULT_CATEGORIES.forEach((cat) => {
      const newCatRef = doc(collection(db, "categories"));
      batch.set(newCatRef, { ...cat, userId });
    });

    batch.set(settingsRef, { isInitialCategoriesCreated: true }, { merge: true });

    await batch.commit();
    console.log("Дефолтні категорії успішно створені");
  } catch (error) {
    console.error("Помилка при створенні дефолтних категорій:", error);
  }
};

// Функція створення нової категорії
export const addCategory = async (data: Omit<Category, "id">) => {
  try {
    const docRef = await addDoc(collection(db, "categories"), data);
    return docRef.id;
  } catch (error) {
    console.error("Помилка додавання категорії:", error);
    return null;
  }
};

// Підписка на всі категорії користувача у реальному часі
export const subscribeToCategories = (userId: string, callback: (categories: Category[]) => void) => {
  const q = query(
    collection(db, "categories"),
    where("userId", "==", userId)
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
  const batch = writeBatch(db);
  categories.forEach((cat, index) => {
    const catRef = doc(db, "categories", cat.id);
    batch.update(catRef, { order: index });
  });
  await batch.commit();
};

// Видалення з перенесенням транзакцій
export const deleteAndReassignCategory = async (
  deletedCategoryId: string, 
  newCategory: Category
) => {
  const batch = writeBatch(db);

  const q = query(collection(db, "transactions"), where("categoryId", "==", deletedCategoryId));
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
  const q = query(collection(db, "transactions"), where("categoryId", "==", categoryId));
  const snapshot = await getDocs(q);
  return !snapshot.empty; // Поверне true, якщо є хоча б одна транзакція
};

// Просте видалення категорії (коли операцій немає)
export const deleteCategory = async (categoryId: string) => {
  try {
    await deleteDoc(doc(db, "categories", categoryId));
    return true;
  } catch (error) {
    console.error("Помилка простого видалення категорії:", error);
    return false;
  }
};

export const updateCategory = async (categoryId: string, data: Partial<Category>) => {
  try {
    const catRef = doc(db, "categories", categoryId);
    await updateDoc(catRef, data);
    return true;
  } catch (error) {
    console.error("Помилка оновлення категорії:", error);
    return false;
  }
};