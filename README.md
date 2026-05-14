# 📱 Budget App (Expo + Firebase)

Додаток для обліку фінансів з підтримкою офлайн-режиму, темної теми та синхронізації з Firebase.

---

## 🛠 Розробка (Development)

Використовуйте цей режим для написання коду та тестування змін у реальному часі.

### Запуск локального сервера
```bash
npx expo start --dev-client
```

### Білд для створення прев'ю для розсилки користувачам
```bash
eas build -p android --profile preview
```

### Білд для створення версії розробника
```bash
eas build -p android --profile development
```

### Білд для development local (android/app/build/outputs/apk/debug/app-debug.apk)
```bash
# 1. Видаляємо стару папку, щоб уникнути змішування налаштувань
rm -rf android

# 2. Генеруємо нативну папку спеціально для DEV профілю
EAS_BUILD_PROFILE=development npx expo prebuild -p android --clean

# 3. Заходимо в папку android і збираємо відлагоджувальний (Debug) білд
cd android
./gradlew assembleDebug

# 4. Повертаємося в корінь проєкту після збірки
cd ..
```

### Білд для production local (android/app/build/outputs/apk/release/app-release.apk)
```bash
# 1. Знову видаляємо папку android, бо нам потрібні інші налаштування
rm -rf android

# 2. Генеруємо нативну папку для PROD (змінна може бути production або порожня)
EAS_BUILD_PROFILE=production npx expo prebuild -p android --clean

# 3. Заходимо в папку android і збираємо релізний (Release) білд
cd android
./gradlew assembleRelease --no-configuration-cache

# 4. Повертаємося в корінь проєкту після збірки
cd ..
```

### Очищення в разі помилок
```bash
./gradlew clean
```

### Оновлення додатку через ОТА
```bash
eas update --branch production --platform android --message "Оновлено віджет на головному екрані"
```

### Оновлення додатку при нативних змінах
Онови версії в app.config.js
```bash
android: {
  versionCode: 2, // ЗБІЛЬШИТИ НА 1 (було 1) - це для Play Market / Android
  version: "1.0.1", // Візуальна версія (була 1.0.0)
```
далі перезбірка 

### Що робити, якщо збірка "впала" (Troubleshooting)
Повне очищення кешу C++:
```bash
cd android
rm -rf app/.cxx
rm -rf .gradle
./gradlew clean
```
Якщо завис процес
```bash
taskkill -F -IM java.exe
taskkill -F -IM node.exe
```
Примусове оновлення нативних модулів:
```bash
./gradlew :app:preReleaseBuild --no-configuration-cache
```