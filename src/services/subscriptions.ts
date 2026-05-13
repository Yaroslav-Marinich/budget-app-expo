import { db } from '@/src/config/firebase';
import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, query, updateDoc, where } from 'firebase/firestore';

export interface Subscription {
    id?: string;
    userId: string;
    name: string;
    amount: number;
    currency: string;
    walletId: string;
    categoryId: string;
    billingCycle: 'monthly' | 'yearly' | 'days';
    customDays?: number | null;
    nextPaymentDate: string;
    predefinedLogo?: string;
    customLogoUrl?: string;
    isActive: boolean;
}

// Посилання на колекцію в БД
const getSubscriptionsRef = () => collection(db, 'subscriptions');

// 1. Отримати всі підписки користувача
export const getSubscriptions = async (userId: string): Promise<Subscription[]> => {
    try {
        const q = query(getSubscriptionsRef(), where('userId', '==', userId));
        const snapshot = await getDocs(q);

        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        })) as Subscription[];
    } catch (error) {
        console.error('Помилка отримання підписок:', error);
        return [];
    }
};

// 2. Додати нову підписку
export const addSubscription = async (subscriptionData: Omit<Subscription, 'id'>) => {
    try {
        const docRef = await addDoc(getSubscriptionsRef(), subscriptionData);
        return docRef.id;
    } catch (error) {
        console.error('Помилка створення підписки:', error);
        throw error;
    }
};

// 3. Оновити підписку (наприклад, коли гроші списало і треба перенести дату на місяць вперед)
export const updateSubscription = async (subscriptionId: string, data: Partial<Subscription>) => {
    try {
        const docRef = doc(db, 'subscriptions', subscriptionId);
        await updateDoc(docRef, data);
    } catch (error) {
        console.error('Помилка оновлення підписки:', error);
        throw error;
    }
};

// 4. Видалити підписку
export const deleteSubscription = async (subscriptionId: string) => {
    try {
        const docRef = doc(db, 'subscriptions', subscriptionId);
        await deleteDoc(docRef);
    } catch (error) {
        console.error('Помилка видалення підписки:', error);
        throw error;
    }
};

// 5. Отримати підписку за ID
export const getSubscriptionById = async (subscriptionId: string): Promise<Subscription | null> => {
    try {
        const docRef = doc(db, 'subscriptions', subscriptionId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            return { id: docSnap.id, ...docSnap.data() } as Subscription;
        }
        return null;
    } catch (error) {
        console.error('Помилка отримання підписки:', error);
        return null;
    }
};