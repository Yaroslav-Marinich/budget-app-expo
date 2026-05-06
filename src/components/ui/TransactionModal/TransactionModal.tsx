import { Colors } from "@/src/constants/Colors";
import { useLoader } from "@/src/context/LoaderContext";
import { addTransaction } from "@/src/services/transactions";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useRef, useState } from "react";
import { Alert, Modal, Pressable, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Calculator } from "../Calculator/Calculator";
import { styles } from "./TransactionModal.styles";

interface TransactionModalProps {
  visible: boolean;
  onClose: () => void;
  type: 'income' | 'expense';
  categoryId?: string; 
  categoryName?: string; 
  walletId: string | null;
}

export const TransactionModal: React.FC<TransactionModalProps> = ({ 
  visible, 
  onClose, 
  type, 
  categoryId,
  categoryName,
  walletId
}) => {
  const insets = useSafeAreaInsets();
  const touchY = useRef(0);
  
  const { showLoader, hideLoader } = useLoader();
  const [amount, setAmount] = useState("0");
  const [comment, setComment] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [step, setStep] = useState<'amount' | 'comment'>('amount'); 

  useEffect(() => {
    if (visible) {
      setAmount("0");
      setComment("");
      setStep('amount');
      setIsSaving(false);
    }
  }, [visible]);

  const handleNext = () => {
    if (amount === "0" || !categoryId || !categoryName || !walletId) {
      if (!walletId) Alert.alert("Помилка", "Будь ласка, оберіть рахунок");
      return;
    }
    setStep('comment'); 
  };

  const handleSave = async () => {
    showLoader();
    setIsSaving(true);
    const numericAmount = parseFloat(amount);

    const success = await addTransaction({
      userId: "manual-test-id",
      amount: numericAmount,
      type: type,
      categoryId: categoryId as string,
      categoryName: categoryName as string,
      walletId: walletId as string,
      comment: comment.trim() || undefined, 
    });

    if (success) {
      onClose();
    } else {
      Alert.alert("Помилка", "Не вдалося зберегти транзакцію. Спробуйте ще раз.");
      setIsSaving(false);
    }
    hideLoader();
  };

  return (
    <Modal 
      animationType="slide" 
      transparent 
      visible={visible}
      onRequestClose={onClose}
    >
      <Pressable style={styles.modalOverlay} onPress={onClose}>
        <Pressable 
          style={[styles.modalContent, { paddingBottom: insets.bottom + 20 }]} 
          onPress={(e) => e.stopPropagation()}
          onTouchStart={(e) => touchY.current = e.nativeEvent.pageY}
          onTouchEnd={(e) => {
            if (e.nativeEvent.pageY - touchY.current > 50) onClose();
          }}
        >
          <View style={styles.dragIndicator} />

          <View style={styles.headerRow}>
            <View style={styles.headerSpacer} />
            <Text style={[styles.modalTitle, { color: type === 'income' ? Colors.accent : Colors.error }]}>
              {type === 'income' ? 'Дохід' : 'Витрата'} в {categoryName}
            </Text>
            <TouchableOpacity onPress={onClose} style={styles.headerCloseBtn}>
              <Ionicons name="close" size={28} color={Colors.textSecondary} />
            </TouchableOpacity>
          </View>

          {/* --- КРОК 1: КАЛЬКУЛЯТОР --- */}
          {step === 'amount' && (
            <>
              <Calculator amount={amount} setAmount={setAmount} />
              <View style={styles.modalActionsRow}>
                <TouchableOpacity onPress={onClose} style={styles.closeBtn} disabled={isSaving}>
                  <Text style={{color: '#fff', fontWeight: 'bold'}}>Скасувати</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  onPress={handleNext}
                  style={[styles.saveBtn, { backgroundColor: Colors.primary }]}
                >
                  <Text style={{color: '#fff', fontWeight: 'bold'}}>Далі</Text>
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
                placeholderTextColor={Colors.textSecondary}
                value={comment}
                onChangeText={setComment}
                multiline
                autoFocus 
              />
              
              <View style={[styles.modalActionsRow, { marginTop: 30 }]}>
                <TouchableOpacity onPress={() => setStep('amount')} style={styles.closeBtn} disabled={isSaving}>
                  <Text style={{color: '#fff', fontWeight: 'bold'}}>Назад</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  onPress={handleSave}
                  disabled={isSaving} 
                  style={[
                    styles.saveBtn, 
                    { backgroundColor: Colors.primary },
                    isSaving && { opacity: 0.7 }
                  ]}
                >
                  <Text style={{color: '#fff', fontWeight: 'bold'}}>
                    {isSaving ? 'Збереження...' : 'Зберегти'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

        </Pressable>
      </Pressable>
    </Modal>
  );
};