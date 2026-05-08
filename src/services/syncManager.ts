import AsyncStorage from '@react-native-async-storage/async-storage';

const SYNC_QUEUE_KEY = '@sync_queue';

export type SyncTaskType = 'TRANSACTION' | 'METER_READING' | 'METER_CREATE' | 'WALLET_CREATE';
export type SyncStatus = 'PENDING' | 'SYNCING' | 'FAILED' | 'DONE';

export interface SyncTask {
  id: string;
  type: SyncTaskType;
  payload: any;
  localPhotoUri?: string | null;
  firebasePhotoUrl?: string; // 👈 Зберігатимемо URL, якщо фото вже в хмарі, але БД впала
  createdAt: number;
  status: SyncStatus; // 👈 Статус завдання
  retryCount: number; // 👈 Кількість спроб
  error?: string;
}

type QueueListener = () => void;
const queueListeners = new Set<QueueListener>();

const notifyQueueListeners = () => {
  queueListeners.forEach((listener) => {
    try {
      listener();
    } catch (error) {
      console.error('❌ Queue listener error:', error);
    }
  });
};

export const subscribeToSyncQueueChanges = (listener: QueueListener) => {
  queueListeners.add(listener);
  return () => {
    queueListeners.delete(listener);
  };
};

export const addToSyncQueue = async (type: SyncTaskType, payload: any, localPhotoUri?: string | null) => {
  try {
    const queue = await getSyncQueue();
    const newTask: SyncTask = {
      id: `task_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      type,
      payload,
      localPhotoUri,
      createdAt: Date.now(),
      status: 'PENDING',
      retryCount: 0,
    };

    queue.push(newTask);
    await AsyncStorage.setItem(SYNC_QUEUE_KEY, JSON.stringify(queue));
    notifyQueueListeners();
    console.log(`📦 Завдання додано в чергу. Всього: ${queue.length}`);
    return newTask.id;
  } catch (error) {
    console.error("❌ Помилка додавання в чергу:", error);
    return null;
  }
};

export const getSyncQueue = async (): Promise<SyncTask[]> => {
  try {
    const data = await AsyncStorage.getItem(SYNC_QUEUE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

// 👈 НОВА ФУНКЦІЯ: дозволяє оновлювати стан завдання (наприклад, збільшити retryCount)
export const updateTaskInQueue = async (taskId: string, updates: Partial<SyncTask>) => {
  const queue = await getSyncQueue();
  const index = queue.findIndex(t => t.id === taskId);
  if (index !== -1) {
    queue[index] = { ...queue[index], ...updates };
    await AsyncStorage.setItem(SYNC_QUEUE_KEY, JSON.stringify(queue));
    notifyQueueListeners();
  }
};

export const removeTaskFromQueue = async (taskId: string) => {
  const queue = await getSyncQueue();
  const newQueue = queue.filter(task => task.id !== taskId);
  await AsyncStorage.setItem(SYNC_QUEUE_KEY, JSON.stringify(newQueue));
  notifyQueueListeners();
};

export const remapQueuedMeterReferences = async (localMeterId: string, firebaseMeterId: string) => {
  const queue = await getSyncQueue();
  let changed = false;

  const updatedQueue = queue.map((task) => {
    if (
      task.type === 'METER_READING' &&
      task.payload?.meterId === localMeterId
    ) {
      changed = true;
      return {
        ...task,
        payload: {
          ...task.payload,
          meterId: firebaseMeterId,
        },
      };
    }

    return task;
  });

  if (!changed) {
    return;
  }

  await AsyncStorage.setItem(SYNC_QUEUE_KEY, JSON.stringify(updatedQueue));
  notifyQueueListeners();
};

export const remapQueuedWalletReferences = async (localWalletId: string, firebaseWalletId: string) => {
  const queue = await getSyncQueue();
  let changed = false;

  const updatedQueue = queue.map((task) => {
    if (
      task.type === 'TRANSACTION' &&
      task.payload?.walletId === localWalletId
    ) {
      changed = true;
      return {
        ...task,
        payload: {
          ...task.payload,
          walletId: firebaseWalletId,
        },
      };
    }

    return task;
  });

  if (!changed) {
    return;
  }

  await AsyncStorage.setItem(SYNC_QUEUE_KEY, JSON.stringify(updatedQueue));
  notifyQueueListeners();
};