import React, { useEffect, useState } from "react";
import { Modal, Pressable, Text, TouchableOpacity, View } from "react-native";
import { styles } from "./MonthPickerModal.styles";

interface MonthPickerProps {
  visible: boolean;
  onClose: () => void;
  currentDate: Date;
  onSelect: (date: Date) => void;
}

const MONTHS = [
  { id: 0, num: "01", name: "Січень" },
  { id: 1, num: "02", name: "Лютий" },
  { id: 2, num: "03", name: "Березень" },
  { id: 3, num: "04", name: "Квітень" },
  { id: 4, num: "05", name: "Травень" },
  { id: 5, num: "06", name: "Червень" },
  { id: 6, num: "07", name: "Липень" },
  { id: 7, num: "08", name: "Серпень" },
  { id: 8, num: "09", name: "Вересень" },
  { id: 9, num: "10", name: "Жовтень" },
  { id: 10, num: "11", name: "Листопад" },
  { id: 11, num: "12", name: "Грудень" }
];

export const MonthPickerModal: React.FC<MonthPickerProps> = ({ visible, onClose, currentDate, onSelect }) => {
  const [tempYear, setTempYear] = useState(currentDate.getFullYear());

  useEffect(() => {
    if (visible) setTempYear(currentDate.getFullYear());
  }, [visible, currentDate]);

  const handleSelectMonth = (monthIndex: number) => {
    onSelect(new Date(tempYear, monthIndex, 1));
    onClose();
  };

  return (
    <Modal animationType="fade" transparent visible={visible} onRequestClose={onClose}>
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={styles.content} onPress={(e) => e.stopPropagation()}>
          
          <View style={styles.header}>
            {/* ... стрілочки року залишаються без змін ... */}
          </View>

          <View style={styles.monthsGrid}>
            {MONTHS.map((month) => {
              const isActive = currentDate.getMonth() === month.id && currentDate.getFullYear() === tempYear;
              
              return (
                <TouchableOpacity 
                  key={month.id} 
                  style={[styles.monthBtn, isActive && styles.monthBtnActive]}
                  onPress={() => handleSelectMonth(month.id)}
                >
                  <Text style={[styles.monthNum, isActive && styles.textActive]}>{month.num}</Text>
                  <Text style={[styles.monthText, isActive && styles.textActive]}>{month.name}</Text>
                </TouchableOpacity>
              );
            })}
          </View>

        </Pressable>
      </Pressable>
    </Modal>
  );
};