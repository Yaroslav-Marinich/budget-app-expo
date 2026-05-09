import NetInfo from '@react-native-community/netinfo';
import { addDoc, collection, deleteDoc, doc, increment, updateDoc } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';

import { db, storage } from '../config/firebase';
import { sanitizeFirestoreData, sanitizeFirestoreUpdate } from '../utils/sanitizeFirestoreData';
import { deleteLocalFile } from './fileManager';
import {
  getSyncQueue,
  remapQueuedMeterReferences,
  remapQueuedWalletReferences,
  removeTaskFromQueue,
  SyncTask,
  updateTaskInQueue,
} from './syncManager';

let isSyncing = false;
const MAX_RETRIES = 10; // 👈 Максимальна кількість спроб

export const startSync = async () => {
  if (isSyncing) return;
  
  const state = await NetInfo.fetch();
  if (!state.isConnected) return;

  const queue = await getSyncQueue();
  // Відфільтровуємо завдання, які вже остаточно "зламалися"
  const pendingTasks = queue
    .filter(t => t.status !== 'FAILED')
    .sort((left, right) => left.createdAt - right.createdAt);
  
  if (pendingTasks.length === 0) return;

  isSyncing = true;
  console.log(`🚀 Синхронізація: ${pendingTasks.length} завдань...`);

  for (const task of pendingTasks) {
    // Якщо ліміт спроб вичерпано
    if (task.retryCount >= MAX_RETRIES) {
      console.log(`⚠️ Завдання ${task.id} перевищило ліміт спроб і переведено в FAILED.`);
      await updateTaskInQueue(task.id, { status: 'FAILED', error: 'Max retries reached' });
      continue;
    }

    try {
      await updateTaskInQueue(task.id, { status: 'SYNCING' });
      
      await processTask(task);
      
      // ✅ Все пройшло успішно!
      await removeTaskFromQueue(task.id);
      console.log(`✅ Завдання ${task.id} виконано`);
      
    } catch (error: any) {
      console.error(`❌ Помилка завдання ${task.id}:`, error);
      // Збільшуємо лічильник спроб при помилці
      await updateTaskInQueue(task.id, { 
        status: 'PENDING', 
        retryCount: task.retryCount + 1,
        error: error.message 
      });
    }
  }

  isSyncing = false;
};

const processTask = async (task: SyncTask) => {
  if (task.type === 'METER_CREATE') {
    const meterDoc = await addDoc(collection(db, 'meters'), sanitizeFirestoreData(task.payload));
    await remapQueuedMeterReferences(task.id, meterDoc.id);
    return;
  }

  if (task.type === 'WALLET_CREATE') {
    const walletDoc = await addDoc(collection(db, 'wallets'), sanitizeFirestoreData(task.payload));
    await remapQueuedWalletReferences(task.id, walletDoc.id);
    return;
  }

  if (task.type === 'TRANSACTION_DELETE') {
    const transactionId = task.payload?.transactionId;
    const walletId = task.payload?.walletId;
    const transactionType = task.payload?.type;
    const amount = Number(task.payload?.amount || 0);

    if (!transactionId) {
      throw new Error('Missing transaction id for deletion');
    }

    if (!walletId || walletId.startsWith('task_')) {
      throw new Error('Transaction delete wallet reference is not resolved');
    }

    await deleteDoc(doc(db, 'transactions', transactionId));

    const balanceChange = transactionType === 'expense' ? amount : -amount;
    await updateDoc(doc(db, 'wallets', walletId), {
      balance: increment(balanceChange),
    });

    return;
  }

  if (task.type === 'TRANSACTION_UPDATE') {
    const transactionId = task.payload?.transactionId;
    const oldWalletId = task.payload?.oldWalletId;
    const oldAmount = Number(task.payload?.oldAmount || 0);
    const oldType = task.payload?.oldType;

    const newWalletId = task.payload?.walletId;
    const newAmount = Number(task.payload?.amount || 0);
    const newType = task.payload?.type;

    if (!transactionId) {
      throw new Error('Missing transaction id for update');
    }

    if (!oldWalletId || oldWalletId.startsWith('task_')) {
      throw new Error('Old wallet reference is not resolved for transaction update');
    }

    if (!newWalletId || newWalletId.startsWith('task_')) {
      throw new Error('New wallet reference is not resolved for transaction update');
    }

    await updateDoc(doc(db, 'transactions', transactionId), sanitizeFirestoreUpdate({
      amount: newAmount,
      type: newType,
      categoryId: task.payload?.categoryId,
      categoryName: task.payload?.categoryName,
      comment: task.payload?.comment,
      walletId: newWalletId,
      monthYear: task.payload?.monthYear,
      date: task.payload?.date,
      syncedAt: new Date().toISOString(),
    }));

    const oldEffect = oldType === 'expense' ? -oldAmount : oldAmount;
    const newEffect = newType === 'expense' ? -newAmount : newAmount;

    if (oldWalletId === newWalletId) {
      const delta = newEffect - oldEffect;
      if (delta !== 0) {
        await updateDoc(doc(db, 'wallets', newWalletId), {
          balance: increment(delta),
        });
      }
    } else {
      await updateDoc(doc(db, 'wallets', oldWalletId), {
        balance: increment(-oldEffect),
      });
      await updateDoc(doc(db, 'wallets', newWalletId), {
        balance: increment(newEffect),
      });
    }

    return;
  }

  let resolvedPayload = task.payload;
  if (task.type === 'METER_READING' && typeof task.payload?.meterId === 'string' && task.payload.meterId.startsWith('task_')) {
    const latestQueue = await getSyncQueue();
    const latestTask = latestQueue.find((queueTask) => queueTask.id === task.id);
    const latestMeterId = latestTask?.payload?.meterId;

    if (!latestMeterId || (typeof latestMeterId === 'string' && latestMeterId.startsWith('task_'))) {
      throw new Error('Waiting for parent meter sync');
    }

    resolvedPayload = {
      ...task.payload,
      meterId: latestMeterId,
    };
  }

  if (task.type === 'TRANSACTION' && typeof resolvedPayload?.walletId === 'string' && resolvedPayload.walletId.startsWith('task_')) {
    const latestQueue = await getSyncQueue();
    const latestTask = latestQueue.find((queueTask) => queueTask.id === task.id);
    const latestWalletId = latestTask?.payload?.walletId;

    if (!latestWalletId || (typeof latestWalletId === 'string' && latestWalletId.startsWith('task_'))) {
      throw new Error('Waiting for parent wallet sync');
    }

    resolvedPayload = {
      ...resolvedPayload,
      walletId: latestWalletId,
    };
  }

  // Якщо фото вже було завантажене в попередній невдалій спробі, використовуємо його
  let finalPhotoUrl = task.firebasePhotoUrl || resolvedPayload.photoUrl || null;

  // 1. ЗАВАНТАЖЕННЯ ФОТО (якщо воно є і ще не в хмарі)
  if (task.localPhotoUri && !task.firebasePhotoUrl) {
    console.log(`📸 Завантаження локального фото...`);
    
    const response = await fetch(task.localPhotoUri);
    const blob = await response.blob();
    
    const storageRef = ref(storage, `meter_photos/${resolvedPayload.userId}/photo_${Date.now()}.jpg`);
    await uploadBytes(storageRef, blob);
    finalPhotoUrl = await getDownloadURL(storageRef);
    
    // 💡 Крутий трюк: фото завантажилось! Одразу зберігаємо URL в чергу.
    // Якщо наступний крок (Firestore) впаде, ми не будемо завантажувати фото ще раз!
    await updateTaskInQueue(task.id, { firebasePhotoUrl: finalPhotoUrl });
  }

  // 2. ЗАПИС У FIRESTORE
  const dataToSave = { 
    ...resolvedPayload,
    ...(finalPhotoUrl ? { photoUrl: finalPhotoUrl } : {}),
    syncedAt: new Date().toISOString() 
  };
  const sanitizedDataToSave = sanitizeFirestoreData(dataToSave);

if (task.type === 'METER_READING') {
  await addDoc(collection(db, 'meter_readings'), sanitizedDataToSave);
} else if (task.type === 'TRANSACTION') {
  await addDoc(collection(db, 'transactions'), sanitizedDataToSave);

  const balanceChange = sanitizedDataToSave.type === 'expense'
    ? -Number(sanitizedDataToSave.amount || 0)
    : Number(sanitizedDataToSave.amount || 0);

  if (!sanitizedDataToSave.walletId || sanitizedDataToSave.walletId.startsWith('task_')) {
    throw new Error('Transaction wallet reference is not resolved');
  }

  await updateDoc(doc(db, 'wallets', sanitizedDataToSave.walletId), {
    balance: increment(balanceChange),
  });
}

  // 3. ВИДАЛЕННЯ ЛОКАЛЬНОГО ФОТО (ТІЛЬКИ ТЕПЕР!)
  // Якщо ми дійшли сюди, значить Firestore прийняв дані. Можна сміливо видаляти кеш.
  if (task.localPhotoUri) {
    await deleteLocalFile(task.localPhotoUri);
  }
};