import * as ImagePicker from 'expo-image-picker';
import { deleteObject, getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { auth, storage } from '../config/firebase';
import { appAlert } from './alert';

export const takeAndUploadMeterPhoto = async (): Promise<string | null> => {
  try {
    const user = auth.currentUser;
    if (!user) {
      console.error("❌ Користувач не авторизований");
      return null;
    }

    // 1. Запитуємо дозвіл на використання камери
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    if (!permissionResult.granted) {
      appAlert("Увага", "Нам потрібен дозвіл на доступ до камери, щоб сфотографувати лічильник!");
      return null;
    }

    // 2. Відкриваємо камеру
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ['images'],
      allowsEditing: true, // Дозволяє обрізати зайве (наприклад, стіну навколо лічильника)
      aspect: [4, 3],
      quality: 0.3, // 👈 ОСЬ ВІН, НАШ РЯТІВНИК! Стискає якість до 30%, щоб важило копійки
    });

    // Якщо користувач передумав і закрив камеру
    if (result.canceled) {
      return null;
    }

    const imageUri = result.assets[0].uri;

    // 3. React Native специфіка: перетворюємо локальний файл у "Blob", щоб Firebase зміг його з'їсти
    const response = await fetch(imageUri);
    const blob = await response.blob();

    // 4. Створюємо унікальне ім'я файлу (ID юзера + поточний час)
    const fileName = `meter_photos/${user.uid}/photo_${Date.now()}.jpg`;
    
    // Створюємо "посилання" на місце в хмарі, куди покладемо файл
    const storageRef = ref(storage, fileName);

    // 5. Відправляємо файл у Firebase Storage
    console.log("⬆️ Починаємо завантаження фотографії...");
    await uploadBytes(storageRef, blob);
    console.log("✅ Фото успішно завантажено!");

    // 6. Отримуємо публічне веб-посилання на завантажене фото
    const downloadUrl = await getDownloadURL(storageRef);
    
    // Повертаємо посилання, щоб потім додати його до транзакції лічильника
    return downloadUrl;

  } catch (error) {
    console.error("❌ Помилка при створенні/завантаженні фото:", error);
    return null;
  }
};

export const deleteMeterPhoto = async (photoUrl: string): Promise<boolean> => {
  try {
    const photoRef = ref(storage, photoUrl);
    
    await deleteObject(photoRef);
    console.log("🗑️ Старе фото успішно видалено зі сховища!");
    return true;
  } catch (error) {
    console.error("❌ Помилка при видаленні старого фото:", error);
    return false;
  }
};