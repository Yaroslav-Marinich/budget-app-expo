import { auth, db } from "@/src/config/firebase";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { collection, deleteDoc, doc, getDocs, onSnapshot, query, updateDoc, where, writeBatch } from "firebase/firestore";

import { startSync } from './syncEngine';
import { addToSyncQueue, getSyncQueue, subscribeToSyncQueueChanges } from './syncManager';

const METERS_CACHE_KEY = '@cached_meters';
const READINGS_CACHE_KEY = '@cached_readings';

// Централізований список іконок та їх кольорів
export const METER_ICONS = [
  { name: 'flash', label: 'Світло', color: '#FFB74D' },
  { name: 'water', label: 'Вода', color: '#64B5F6' },
  { name: 'flame', label: 'Газ', color: '#E57373' },
  { name: 'thermometer', label: 'Тепло', color: '#FF8A65' },
  { name: 'wifi', label: 'Інтернет', color: '#4DB6AC' },
  { name: 'trash', label: 'Сміття', color: '#A1887F' },
];

// ==========================================
// 1. ІНТЕРФЕЙС ТА ЛОГІКА САМОГО ЛІЧИЛЬНИКА
// ==========================================

export interface Meter {
  id: string;
  userId: string;
  name: string;
  icon: string;
  calcType: 'readings' | 'consumed'; 
  order?: number;
  isPending?: boolean; 
}

export interface MeterReading {
  id?: string;
  meterId: string;
  userId: string;
  date: string; 
  prevValue?: number;
  currentValue?: number;
  consumedValue: number;
  comment?: string;
  photoUrl?: string;
}

export const addMeter = async (data: Omit<Meter, "id" | "userId">) => {
  try {
    const user = auth.currentUser;
    if (!user) return null;

    const meterData = {
      ...data,
      userId: user.uid,
      createdAt: new Date().toISOString()
    };

    const taskId = await addToSyncQueue('METER_CREATE', meterData);
    
    startSync();
    
    return taskId; 
  } catch (error) {
    console.error("Помилка додавання лічильника:", error);
    return null;
  }
};

const getMergedMeters = async (baseMeters: Meter[]): Promise<Meter[]> => {
  const queue = await getSyncQueue();
  const pendingMeters = queue
    .filter(t => t.type === 'METER_CREATE' && t.status !== 'DONE')
    .map(t => ({ ...t.payload, id: t.id, isPending: true } as Meter));

  return [...baseMeters, ...pendingMeters];
};

export const subscribeToMeters = (callback: (meters: Meter[]) => void) => {
  const user = auth.currentUser;
  if (!user) {
    callback([]);
    return () => {};
  }

  let baseMeters: Meter[] = [];

  const emitMergedMeters = async () => {
    const merged = await getMergedMeters(baseMeters);
    callback(merged);
  };

  const loadInitialData = async () => {
    try {
      const cachedData = await AsyncStorage.getItem(METERS_CACHE_KEY);
      baseMeters = cachedData ? JSON.parse(cachedData) : [];
      await emitMergedMeters();
    } catch (e) {
      console.error("Помилка читання кешу лічильників", e);
    }
  };

  loadInitialData();

  const q = query(collection(db, "meters"), where("userId", "==", user.uid));
  const unsubscribeQueue = subscribeToSyncQueueChanges(() => {
    emitMergedMeters();
  });
  
  const unsubscribeSnapshot = onSnapshot(q, async (snapshot) => {
    let currentMeters = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Meter[];

    if (currentMeters.length === 0 && snapshot.metadata.fromCache) {
      const cachedData = await AsyncStorage.getItem(METERS_CACHE_KEY);
      if (cachedData) {
        currentMeters = JSON.parse(cachedData);
      }
    } else {
      await AsyncStorage.setItem(METERS_CACHE_KEY, JSON.stringify(currentMeters));
    }

    baseMeters = currentMeters;
    await emitMergedMeters();
  });

  return () => {
    unsubscribeQueue();
    unsubscribeSnapshot();
  };
};

export const updateMeter = async (meterId: string, data: Partial<Omit<Meter, "id" | "userId">>) => {
  try {
    const user = auth.currentUser;
    if (!user) return false;

    if (meterId.startsWith('task_')) {
      console.log("Оновлення офлайн-лічильників поки що не підтримується");
      return false;
    }

    const docRef = doc(db, "meters", meterId);
    await updateDoc(docRef, data);
    return true;
  } catch (error) {
    console.error("Помилка оновлення лічильника:", error);
    return false;
  }
};

export const deleteMeter = async (meterId: string) => {
  try {
    const user = auth.currentUser;
    if (!user) return false;

    if (meterId.startsWith('task_')) {
      console.log("Видалення офлайн-лічильників потребує окремої логіки черги");
      return false;
    }

    const batch = writeBatch(db);

    const readingsQuery = query(
      collection(db, "meter_readings"), 
      where("userId", "==", user.uid),
      where("meterId", "==", meterId)
    );
    const readingsSnapshot = await getDocs(readingsQuery);

    readingsSnapshot.forEach((docSnap) => {
      batch.delete(docSnap.ref);
    });

    const meterRef = doc(db, "meters", meterId);
    batch.delete(meterRef);

    await batch.commit();
    return true;
  } catch (error) {
    console.error("Помилка каскадного видалення лічильника:", error);
    return false;
  }
};

// ==========================================
// 2. ІНТЕРФЕЙС ТА ЛОГІКА ПОКАЗНИКІВ (ІСТОРІЯ)
// ==========================================


export const addMeterReading = async (reading: Omit<MeterReading, "id" | "userId">) => {
  try {
    const user = auth.currentUser;
    if (!user) return false;

    await addToSyncQueue('METER_READING', { ...reading, userId: user.uid });
    startSync();
    return true;
  } catch (error) {
    console.error("Помилка збереження показника:", error);
    return false;
  }
};

export const getPreviousMeterReading = async (meterId: string, targetDate: string) => {
  try {
    const user = auth.currentUser;
    if (!user) return null;

    const q = query(
      collection(db, "meter_readings"),
      where("userId", "==", user.uid),
      where("meterId", "==", meterId)
    );
    const snapshot = await getDocs(q);

    const firestoreReadings = snapshot.docs.map(d => d.data() as MeterReading);
    const queue = await getSyncQueue();
    const queuedReadings = queue
      .filter((task) => task.type === 'METER_READING' && task.status !== 'FAILED' && task.payload?.meterId === meterId)
      .map((task) => task.payload as MeterReading);

    const pastReadings = [...firestoreReadings, ...queuedReadings].filter(r => r.date < targetDate);
    
    if (pastReadings.length === 0) return null;
    
    pastReadings.sort((a, b) => b.date.localeCompare(a.date));
    return pastReadings[0];
  } catch (error) {
    console.error("Помилка отримання попереднього показника:", error);
    return null;
  }
};

export const saveMeterReadings = async (readings: Omit<MeterReading, "id" | "userId">[]) => {
  try {
    const user = auth.currentUser;
    if (!user) return false;

    const batch = writeBatch(db);
    
    readings.forEach((reading) => {
      const docRef = doc(collection(db, "meter_readings"));
      batch.set(docRef, {
        ...reading,
        userId: user.uid,
      });
    });

    await batch.commit();
    return true;
  } catch (error) {
    console.error("Помилка збереження показників:", error);
    return false;
  }
};

export const subscribeToMeterReadings = (callback: (readings: MeterReading[]) => void) => {
  const user = auth.currentUser;
  if (!user) {
    callback([]);
    return () => {};
  }

  const loadInitialData = async () => {
    try {
      const cachedData = await AsyncStorage.getItem(READINGS_CACHE_KEY);
      if (cachedData) {
        callback(JSON.parse(cachedData));
      }
    } catch (e) {
      console.error("Помилка читання кешу показників", e);
    }
  };

  loadInitialData();

  const q = query(collection(db, "meter_readings"), where("userId", "==", user.uid));
  return onSnapshot(q, async (snapshot) => {
    const readings = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as MeterReading[];
    
    await AsyncStorage.setItem(READINGS_CACHE_KEY, JSON.stringify(readings));
    callback(readings);
  });
};

export const getMeterColor = (iconName: string) => {
  const found = METER_ICONS.find(i => i.name === iconName);
  return found ? found.color : '#0a7ea4'; 
};

export const subscribeToReadingsByDate = (
  date: string, 
  callback: (readings: MeterReading[]) => void
) => {
  const user = auth.currentUser;
  if (!user) {
    callback([]);
    return () => {};
  }

  const q = query(
    collection(db, "meter_readings"), 
    where("userId", "==", user.uid),
    where("date", "==", date)
  );
  return onSnapshot(q, (snapshot) => {
    const readings = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as MeterReading[];
    callback(readings);
  });
};

export const deleteMeterReading = async (readingId: string) => {
  try {
    const user = auth.currentUser;
    if (!user) return false;

    if (readingId.startsWith('task_')) return false;

    await deleteDoc(doc(db, "meter_readings", readingId));
    return true;
  } catch (error) {
    console.error("Помилка видалення показника:", error);
    return false;
  }
};

export const updateMeterReading = async (readingId: string, data: Partial<Omit<MeterReading, "id" | "userId">>) => {
  try {
    const user = auth.currentUser;
    if (!user) return false;

    if (readingId.startsWith('task_')) return false;

    const docRef = doc(db, "meter_readings", readingId);
    await updateDoc(docRef, data);
    return true;
  } catch (error) {
    console.error("Помилка оновлення показника:", error);
    return false;
  }
};