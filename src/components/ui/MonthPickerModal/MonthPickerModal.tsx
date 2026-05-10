import { Colors } from "@/src/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { DefaultModal } from "../DefaultModal/DefaultModal";
import { styles } from "./MonthPickerModal.styles";

interface MonthPickerModalProps {
  visible: boolean;
  onClose: () => void;
  currentDate: Date;
  onSelect: (date: Date) => void;
  activeMonths?: string[]; 
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
  onSelect,
  activeMonths = [] 
}) => {
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
    <DefaultModal
      visible={visible}
      onClose={onClose}
      animationType="fade"
      overlayStyle={styles.overlay}
      contentStyle={styles.modalContent}
    >

          <View style={styles.yearSelector}>
            <TouchableOpacity onPress={() => changeYear(-1)} style={styles.arrowBtn}>
              <Ionicons name="chevron-back" size={28} color={Colors.textSecondary} />
            </TouchableOpacity>
            
            <Text style={styles.yearText}>{viewYear}</Text>
            
            <TouchableOpacity onPress={() => changeYear(1)} style={styles.arrowBtn}>
              <Ionicons name="chevron-forward" size={28} color={Colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <View style={styles.monthsGrid}>
            {MONTHS.map((monthName, index) => {
              const isActive = 
                currentDate.getMonth() === index && 
                currentDate.getFullYear() === viewYear;
                
              const monthStr = `${viewYear}-${String(index + 1).padStart(2, '0')}`;
              const hasData = activeMonths.includes(monthStr);

              return (
                <TouchableOpacity
                  key={index}
                  style={[styles.monthBtn, isActive && styles.monthBtnActive]}
                  onPress={() => handleMonthPress(index)}
                >
                  <Text style={[styles.monthText, isActive && styles.monthTextActive]}>
                    {monthName}
                  </Text>
                  
                  {hasData && (
                    <View style={{ 
                      position: 'absolute', 
                      bottom: 6, 
                      width: 6, 
                      height: 6, 
                      borderRadius: 3, 
                      backgroundColor: isActive ? Colors.primary : Colors.textSecondary 
                    }} />
                  )}
                </TouchableOpacity>
              );
            })}
          </View>

          <TouchableOpacity style={styles.currentMonthBtn} onPress={handleGoToCurrentMonth}>
            <Ionicons name="calendar-outline" size={20} color={Colors.primary} style={{ marginRight: 8 }} />
            <Text style={styles.currentMonthText}>На поточний місяць</Text>
          </TouchableOpacity>

    </DefaultModal>
  );
};