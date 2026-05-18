import * as admin from "firebase-admin";
import { onMessagePublished } from "firebase-functions/v2/pubsub";

// Ініціалізуємо Firebase Admin SDK
admin.initializeApp();

/**
 * Функція слухає Pub/Sub топік "budget-alerts" (Functions v2).
 */
export const lockFirestoreOnBudgetAlert = onMessagePublished(
    "budget-alerts",
    async (event) => {
        try {
            const data = event.data.message.json;

            if (!data) {
                console.log("Порожнє повідомлення від Pub/Sub.");
                return;
            }

            console.log(`Поточні витрати: ${data.costAmount} ${data.currencyCode}. Бюджет: ${data.budgetAmount}`);

            if (data.costAmount >= data.budgetAmount) {
                console.log("🚨 КРИТИЧНО: Бюджет перевищено! Запускаю блокування Firestore...");

                const lockedRules = `
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
        `;

                // 1. Створюємо об'єкт файлу правил через спеціальний метод SDK
                const rulesFile = admin.securityRules().createRulesFileFromSource(
                    "firestore.rules",
                    lockedRules
                );

                // 2. Генеруємо з цього файлу новий Ruleset (набір правил)
                const ruleset = await admin.securityRules().createRuleset(rulesFile);

                // 3. Застосовуємо заблоковані правила до Firestore
                await admin.securityRules().releaseFirestoreRuleset(ruleset.name);

                console.log("✅ Firestore успішно заблоковано. Запити зупинено.");
            } else {
                console.log("🟢 Бюджет у нормі. Блокування не потрібне.");
            }
        } catch (error) {
            console.error("❌ Помилка під час блокування Firestore:", error);
        }
    }
);