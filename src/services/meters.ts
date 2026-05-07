import { auth, db } from "@/src/config/firebase";
import { addDoc, collection, deleteDoc, doc, getDocs, onSnapshot, query, updateDoc, where, writeBatch } from "firebase/firestore";

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
}

export const addMeter = async (data: Omit<Meter, "id" | "userId">) => {
  try {
    const user = auth.currentUser;
    if (!user) {
      // console.error("Користувач не авторизований");
      return null;
    }

    const docRef = await addDoc(collection(db, "meters"), {
      ...data,
      userId: user.uid,
    });
    return docRef.id;
  } catch (error) {
    console.error("Помилка додавання лічильника:", error);
    return null;
  }
};

export const subscribeToMeters = (callback: (meters: Meter[]) => void) => {
  const user = auth.currentUser;
  if (!user) {
    callback([]);
    return () => {};
  }

  const q = query(collection(db, "meters"), where("userId", "==", user.uid));
  return onSnapshot(q, (snapshot) => {
    const meters = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Meter[];
    callback(meters);
  });
};

export const updateMeter = async (meterId: string, data: Partial<Omit<Meter, "id" | "userId">>) => {
  try {
    const user = auth.currentUser;
    if (!user) {
      // console.error("Користувач не авторизований");
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

// export const deleteMeter = async (meterId: string) => {
//   try {
//     const docRef = doc(db, "meters", meterId);
//     await deleteDoc(docRef);
//     return true;
//   } catch (error) {
//     console.error("Помилка видалення лічильника:", error);
//     return false;
//   }
// };

export const deleteMeter = async (meterId: string) => {
  try {
    const user = auth.currentUser;
    if (!user) {
      // console.error("Користувач не авторизований");
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

    console.log(`Видалено лічильник та ${readingsSnapshot.size} записів історії`);
    return true;
  } catch (error) {
    console.error("Помилка каскадного видалення лічильника:", error);
    return false;
  }
};

// ==========================================
// 2. ІНТЕРФЕЙС ТА ЛОГІКА ПОКАЗНИКІВ (ІСТОРІЯ)
// ==========================================
export interface MeterReading {
  id?: string;
  meterId: string;
  userId: string;
  date: string; 
  prevValue?: number;
  currentValue?: number;
  consumedValue: number;
  comment?: string;
}

// Додавання ОДНОГО показника
export const addMeterReading = async (reading: Omit<MeterReading, "id" | "userId">) => {
  try {
    const user = auth.currentUser;
    if (!user) {
      // console.error("Користувач не авторизований");
      return false;
    }

    await addDoc(collection(db, "meter_readings"), {
      ...reading,
      userId: user.uid,
    });
    return true;
  } catch (error) {
    console.error("Помилка збереження показника:", error);
    return false;
  }
};

// Отримання попереднього показника ВІДНОСНО вказаної дати
export const getPreviousMeterReading = async (meterId: string, targetDate: string) => {
  try {
    const user = auth.currentUser;
    if (!user) {
      // console.error("Користувач не авторизований");
      return null;
    }

    const q = query(
      collection(db, "meter_readings"),
      where("userId", "==", user.uid),
      where("meterId", "==", meterId)
    );
    const snapshot = await getDocs(q);
    
    if (snapshot.empty) return null;

    const readings = snapshot.docs.map(d => d.data() as MeterReading);
    const pastReadings = readings.filter(r => r.date < targetDate);
    
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
    if (!user) {
      // console.error("Користувач не авторизований");
      return false;
    }

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

// Отримання всіх показників (історії)
export const subscribeToMeterReadings = (callback: (readings: MeterReading[]) => void) => {
  const user = auth.currentUser;
  if (!user) {
    callback([]);
    return () => {};
  }

  const q = query(collection(db, "meter_readings"), where("userId", "==", user.uid));
  return onSnapshot(q, (snapshot) => {
    const readings = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as MeterReading[];
    callback(readings);
  });
};

// Функція для швидкого отримання кольору за назвою іконки
export const getMeterColor = (iconName: string) => {
  const found = METER_ICONS.find(i => i.name === iconName);
  return found ? found.color : '#0a7ea4'; 
};

// Отримання показників за конкретний місяць
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

// Видалення конкретного показника (якщо користувач помилився)
export const deleteMeterReading = async (readingId: string) => {
  try {
    const user = auth.currentUser;
    if (!user) {
      // console.error("Користувач не авторизований");
      return false;
    }

    await deleteDoc(doc(db, "meter_readings", readingId));
    return true;
  } catch (error) {
    console.error("Помилка видалення показника:", error);
    return false;
  }
};

// Оновлення існуючого показника
export const updateMeterReading = async (readingId: string, data: Partial<Omit<MeterReading, "id" | "userId">>) => {
  try {
    const user = auth.currentUser;
    if (!user) {
      // console.error("Користувач не авторизований");
      return false;
    }

    const docRef = doc(db, "meter_readings", readingId);
    await updateDoc(docRef, data);
    return true;
  } catch (error) {
    console.error("Помилка оновлення показника:", error);
    return false;
  }
};