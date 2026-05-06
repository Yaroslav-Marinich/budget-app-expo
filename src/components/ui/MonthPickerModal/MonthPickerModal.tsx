import { Colors } from "@/src/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useRef, useState } from "react";
import { Modal, Pressable, Text, TouchableOpacity, View } from "react-native";
import { styles } from "./MonthPickerModal.styles";

interface MonthPickerModalProps {
  visible: boolean;
  onClose: () => void;
  currentDate: Date;
  onSelect: (date: Date) => void;
}

const MONTHS = [
  "Січень", "Лютий", "Березень", 
  "Квітень", "Травень", "Червень", 
  "Липень", "Серпень", "Вересень", 
  "Жовтень", "Листопад", "Грудень"
];

export const MonthPickerModal: React.FC<MonthPickerModalProps> = ({ 
  visible, 
  onClose, 
  currentDate, 
  onSelect 
}) => {
  const touchY = useRef(0);
  const [viewYear, setViewYear] = useState(currentDate.getFullYear());

  useEffect(() => {
    if (visible) {
      setViewYear(currentDate.getFullYear());
    }
  }, [visible, currentDate]);

  const handleMonthPress = (monthIndex: number) => {
    const newDate = new Date(viewYear, monthIndex, 1);
    onSelect(newDate);
    onClose();
  };

  const changeYear = (delta: number) => {
    setViewYear(prev => prev + delta);
  };

  const handleGoToCurrentMonth = () => {
    const now = new Date();
    onSelect(now);
    onClose();
  };

  return (
    <Modal visible={visible} animationType="fade" transparent onRequestClose={onClose}>
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable 
          style={styles.modalContent} 
          onPress={e => e.stopPropagation()}
          onTouchStart={e => touchY.current = e.nativeEvent.pageY}
          onTouchEnd={e => {
            if (e.nativeEvent.pageY - touchY.current > 50) onClose();
          }}
        >
          <View style={styles.dragIndicator} />

          {/* ХЕДЕР: ПЕРЕМИКАЧ РОКУ */}
          <View style={styles.yearSelector}>
            <TouchableOpacity onPress={() => changeYear(-1)} style={styles.arrowBtn}>
              <Ionicons name="chevron-back" size={28} color={Colors.textSecondary} />
            </TouchableOpacity>
            
            <Text style={styles.yearText}>{viewYear}</Text>
            
            <TouchableOpacity onPress={() => changeYear(1)} style={styles.arrowBtn}>
              <Ionicons name="chevron-forward" size={28} color={Colors.textSecondary} />
            </TouchableOpacity>
          </View>

          {/* СІТКА МІСЯЦІВ */}
          <View style={styles.monthsGrid}>
            {MONTHS.map((monthName, index) => {
              const isActive = 
                currentDate.getMonth() === index && 
                currentDate.getFullYear() === viewYear;

              return (
                <TouchableOpacity
                  key={index}
                  style={[styles.monthBtn, isActive && styles.monthBtnActive]}
                  onPress={() => handleMonthPress(index)}
                >
                  <Text style={[styles.monthText, isActive && styles.monthTextActive]}>
                    {monthName}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <TouchableOpacity style={styles.currentMonthBtn} onPress={handleGoToCurrentMonth}>
            <Ionicons name="calendar-outline" size={20} color={Colors.primary} style={{ marginRight: 8 }} />
            <Text style={styles.currentMonthText}>На поточний місяць</Text>
          </TouchableOpacity>

        </Pressable>
      </Pressable>
    </Modal>
  );
};

