import { Colors } from "@/src/constants/Colors";
import { useLoader } from "@/src/context/LoaderContext";
import { addTransaction } from "@/src/services/transactions";
import React, { useEffect, useRef, useState } from "react";
import { Alert, Modal, Pressable, Text, TouchableOpacity, View } from "react-native";
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
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (visible) {
      setAmount("0");
      setIsSaving(false);
    }
  }, [visible]);

  const handleSave = async () => {
    if (amount === "0" || !categoryId || !categoryName || !walletId) {
      if (!walletId) Alert.alert("Помилка", "Будь ласка, оберіть рахунок");
      return;
    }

    showLoader();
    setIsSaving(true);
    const numericAmount = parseFloat(amount);

    const success = await addTransaction({
      userId: "manual-test-id",
      amount: numericAmount,
      type: type,
      categoryId: categoryId,
      categoryName: categoryName,
      walletId: walletId,
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

          <Text style={[styles.modalTitle, { color: type === 'income' ? Colors.accent : Colors.error }]}>
            {type === 'income' ? 'Дохід' : 'Витрата'} в {categoryName}
          </Text>
          
          <Calculator amount={amount} setAmount={setAmount} />

          <View style={styles.modalActionsRow}>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn} disabled={isSaving}>
              <Text style={{color: '#fff', fontWeight: 'bold'}}>Скасувати</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              onPress={handleSave}
              disabled={isSaving} 
              style={[
                styles.saveBtn, 
                { backgroundColor: type === 'income' ? Colors.primary : Colors.error },
                isSaving && { opacity: 0.7 }
              ]}
            >
              <Text style={{color: '#fff', fontWeight: 'bold'}}>
                {isSaving ? 'Збереження...' : 'Зберегти'}
              </Text>
            </TouchableOpacity>
          </View>

        </Pressable>
      </Pressable>
    </Modal>
  );
};