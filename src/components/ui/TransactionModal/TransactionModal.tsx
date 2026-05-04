import { Colors } from "@/src/constants/Colors";
import React, { useEffect, useRef, useState } from "react";
import { Modal, Pressable, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Calculator } from "../Calculator/Calculator"; // Перевірте, чи правильний шлях
import { styles } from "./TransactionModal.styles";

interface TransactionModalProps {
  visible: boolean;
  onClose: () => void;
  type: 'income' | 'expense';
  onSave: (amount: string, type: 'income' | 'expense') => void;
  categoryName?: string;
}

export const TransactionModal: React.FC<TransactionModalProps> = ({ 
  visible, 
  onClose, 
  type, 
  onSave,
  categoryName
}) => {
  const insets = useSafeAreaInsets();
  const touchY = useRef(0);
  const [amount, setAmount] = useState("0");

  // Очищаємо суму при кожному відкритті/закритті
  useEffect(() => {
    if (visible) setAmount("0");
  }, [visible]);

  const handleSave = () => {
    if (amount !== "0") {
      onSave(amount, type);
    }
    onClose();
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
            Додати {type === 'income' ? 'дохід' : 'витрату'} в {categoryName}
          </Text>
          
          <Calculator amount={amount} setAmount={setAmount} />

          <View style={styles.modalActionsRow}>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Text style={{color: '#fff', fontWeight: 'bold'}}>Скасувати</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              onPress={handleSave}
              style={[styles.saveBtn, {backgroundColor: type === 'income' ? Colors.primary : Colors.error}]}
            >
              <Text style={{color: '#fff', fontWeight: 'bold'}}>Зберегти</Text>
            </TouchableOpacity>
          </View>

        </Pressable>
      </Pressable>
    </Modal>
  );
};