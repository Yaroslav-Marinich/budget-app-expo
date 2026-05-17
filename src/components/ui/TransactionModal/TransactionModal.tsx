import { useLoader } from "@/src/context/LoaderContext";
import { useTheme } from "@/src/context/ThemeContext";
import { appAlert } from "@/src/services/alert";
import { addTransaction, updateTransaction } from "@/src/services/transactions";
import { parseAmountInput } from "@/src/utils/formatMoney";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from '@react-native-community/datetimepicker'; // <-- Імпорт пікера дати
import React, { useEffect, useState } from "react";
import { Platform, Text, TextInput, TouchableOpacity, View } from "react-native";
import { Calculator } from "../Calculator/Calculator";
import { DefaultModal } from "../DefaultModal/DefaultModal";
import { getStyles } from "./TransactionModal.styles";

interface TransactionModalProps {
  visible: boolean;
  onClose: () => void;
  type: 'income' | 'expense';
  categoryId?: string;
  categoryName?: string;
  walletId: string | null;
  currencySymbol?: string;
  initialDate?: Date; // <-- Додали новий пропс
  editingTransaction?: {
    id: string;
    amount: number;
    type: 'income' | 'expense';
    categoryId: string;
    categoryName?: string;
    walletId: string;
    comment?: string;
    monthYear?: string;
    date?: string;
  } | null;
}

export const TransactionModal: React.FC<TransactionModalProps> = ({
  visible,
  onClose,
  type,
  categoryId,
  categoryName,
  walletId,
  editingTransaction,
  currencySymbol,
  initialDate,
}) => {
  const isEditMode = Boolean(editingTransaction);
  const { colors } = useTheme();
  const styles = getStyles(colors);

  const { showLoader, hideLoader } = useLoader();
  const [amount, setAmount] = useState("0");
  const [comment, setComment] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [step, setStep] = useState<'amount' | 'comment'>('amount');

  // --- Стан для дати ---
  const [transactionDate, setTransactionDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    if (visible) {
      setAmount(editingTransaction ? String(editingTransaction.amount) : "0");
      setComment(editingTransaction?.comment || "");
      setStep('amount');
      setIsSaving(false);

      // Встановлюємо правильну дату при відкритті модалки
      if (editingTransaction?.date) {
        setTransactionDate(new Date(editingTransaction.date));
      } else if (initialDate) {
        const now = new Date();
        // Якщо initialDate - це поточний місяць, ставимо сьогоднішній день. Інакше - залишаємо як передали.
        if (initialDate.getMonth() === now.getMonth() && initialDate.getFullYear() === now.getFullYear()) {
          setTransactionDate(now);
        } else {
          setTransactionDate(initialDate);
        }
      } else {
        setTransactionDate(new Date());
      }
    }
  }, [visible, editingTransaction, initialDate]);

  const handleNext = () => {
    if (amount === "0" || !categoryId || !categoryName || !walletId) {
      if (!walletId) appAlert("Помилка", "Будь ласка, оберіть рахунок");
      return;
    }
    setStep('comment');
  };

  const handleSave = async () => {
    showLoader();
    setIsSaving(true);
    const numericAmount = parseAmountInput(amount);

    // Форматуємо обрану дату для бази
    const isoDate = transactionDate.toISOString();
    const monthYear = isoDate.slice(0, 7);

    let success = false;

    if (isEditMode && editingTransaction) {
      success = await updateTransaction({
        transactionId: editingTransaction.id,
        oldWalletId: editingTransaction.walletId,
        oldAmount: editingTransaction.amount,
        oldType: editingTransaction.type,
        walletId: (walletId || editingTransaction.walletId) as string,
        amount: numericAmount,
        type: type,
        categoryId: (categoryId || editingTransaction.categoryId) as string,
        categoryName: (categoryName || editingTransaction.categoryName || "") as string,
        comment: comment.trim() || undefined,
        monthYear: monthYear, // Передаємо оновлену дату
        date: isoDate,        // Передаємо оновлену дату
      });
    } else {
      success = await addTransaction({
        amount: numericAmount,
        type: type,
        categoryId: categoryId as string,
        categoryName: categoryName as string,
        walletId: walletId as string,
        comment: comment.trim() || undefined,
        monthYear: monthYear, // Передаємо кастомну дату
        date: isoDate,        // Передаємо кастомну дату
      });
    }

    if (success) {
      onClose();
    } else {
      appAlert(
        "Помилка",
        isEditMode
          ? "Не вдалося оновити транзакцію. Спробуйте ще раз."
          : "Не вдалося зберегти транзакцію. Спробуйте ще раз.",
      );
      setIsSaving(false);
    }
    hideLoader();
  };

  return (
    <DefaultModal visible={visible} onClose={onClose}>

      {/* Хедер Модалки */}
      <View style={styles.headerRow}>
        <View style={styles.headerSpacer} />
        <Text style={[styles.modalTitle, { color: type === 'income' ? colors.accent : colors.error }]}>
          {isEditMode ? 'Редагування' : type === 'income' ? 'Дохід' : 'Витрата'} в {categoryName}
        </Text>
        <TouchableOpacity onPress={onClose} style={styles.headerCloseBtn}>
          <Ionicons name="close" size={28} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>

      {/* --- КНОПКА ВИБОРУ ДАТИ --- */}
      {step === 'amount' && (
        <TouchableOpacity
          style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 15 }}
          onPress={() => setShowDatePicker(true)}
        >
          <Ionicons name="calendar-outline" size={18} color={colors.textSecondary} style={{ marginRight: 8 }} />
          <Text style={{ color: colors.text, fontSize: 16, fontWeight: '500' }}>
            {transactionDate.toLocaleDateString('uk-UA', { day: '2-digit', month: 'long', year: 'numeric' })}
          </Text>
        </TouchableOpacity>
      )}

      {/* --- ПІКЕР ДАТИ --- */}
      {showDatePicker && (
        <DateTimePicker
          value={transactionDate}
          mode="date"
          display="default"
          onChange={(event, selectedDate) => {
            // На Android ховаємо одразу, на iOS поведінка може залежати від версії
            if (Platform.OS === 'android') {
              setShowDatePicker(false);
            } else if (event.type === 'set' || event.type === 'dismissed') {
              setShowDatePicker(false);
            }
            if (selectedDate) {
              setTransactionDate(selectedDate);
            }
          }}
        />
      )}

      {/* --- КРОК 1: КАЛЬКУЛЯТОР --- */}
      {step === 'amount' && (
        <>
          <Calculator amount={amount} setAmount={setAmount} currencySymbol={currencySymbol} />
          <View style={styles.modalActionsRow}>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn} disabled={isSaving}>
              <Text style={{ color: colors.white, fontWeight: 'bold' }}>Скасувати</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleNext}
              style={[styles.saveBtn, { backgroundColor: colors.primary }]}
            >
              <Text style={{ color: colors.white, fontWeight: 'bold' }}>Далі</Text>
            </TouchableOpacity>
          </View>
        </>
      )}

      {/* --- КРОК 2: КОМЕНТАР --- */}
      {step === 'comment' && (
        <View style={styles.commentContainer}>
          <Text style={styles.inputLabel}>Коментар (необов&apos;язково)</Text>
          <TextInput
            style={styles.commentInput}
            placeholder="Наприклад: Обід з колегами..."
            placeholderTextColor={colors.textSecondary}
            value={comment}
            onChangeText={setComment}
            multiline
            autoFocus
          />

          <View style={[styles.modalActionsRow, { marginTop: 30 }]}>
            <TouchableOpacity onPress={() => setStep('amount')} style={styles.closeBtn} disabled={isSaving}>
              <Text style={{ color: colors.white, fontWeight: 'bold' }}>Назад</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleSave}
              disabled={isSaving}
              style={[
                styles.saveBtn,
                { backgroundColor: colors.primary },
                isSaving && { opacity: 0.7 }
              ]}
            >
              <Text style={{ color: colors.white, fontWeight: 'bold' }}>
                {isSaving ? (isEditMode ? 'Оновлення...' : 'Збереження...') : (isEditMode ? 'Оновити' : 'Зберегти')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

    </DefaultModal>
  );
};