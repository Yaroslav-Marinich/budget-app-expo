import { cacheDirectory, copyAsync, deleteAsync, documentDirectory, getInfoAsync, makeDirectoryAsync } from 'expo-file-system/legacy';

// Кажемо TypeScript: "Візьми documentDirectory. Якщо він раптом null, візьми cacheDirectory"
const rootPath = documentDirectory || cacheDirectory || 'file:///tmp/';
const PHOTOS_DIR = `${rootPath}meter_photos/`;

export const savePhotoLocally = async (temporaryUri: string): Promise<string | null> => {
  try {
    const dirInfo = await getInfoAsync(PHOTOS_DIR);
    if (!dirInfo.exists) {
      console.log("📁 Створюємо папку для локальних фото...");
      await makeDirectoryAsync(PHOTOS_DIR, { intermediates: true });
    }

    const fileName = `photo_${Date.now()}.jpg`;
    const permanentUri = `${PHOTOS_DIR}${fileName}`;

    await copyAsync({
      from: temporaryUri,
      to: permanentUri
    });

    console.log("💾 Фото збережено локально:", permanentUri);
    return permanentUri;
  } catch (error) {
    console.error("❌ Помилка збереження файлу локально:", error);
    return null;
  }
};

export const deleteLocalFile = async (fileUri: string) => {
  try {
    const fileInfo = await getInfoAsync(fileUri);
    if (fileInfo.exists) {
      await deleteAsync(fileUri);
      console.log("🗑️ Локальний файл видалено");
    }
  } catch (error) {
    console.error("❌ Не вдалося видалити локальний файл:", error);
  }
};