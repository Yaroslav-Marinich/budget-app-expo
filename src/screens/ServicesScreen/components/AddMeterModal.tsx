import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useRef, useState } from "react";
import { Modal, Pressable, Text, TextInput, TouchableOpacity, View } from "react-native";

import { Colors } from "@/src/constants/Colors";
import { useLoader } from "@/src/context/LoaderContext";
import { addMeter, Meter, METER_ICONS, updateMeter } from "@/src/services/meters"; // ДОДАЛИ updateMeter та Meter
import { styles } from "./AddMeterModal.styles";

interface AddMeterModalProps {
  visible: boolean;
  onClose: () => void;
  meterToEdit?: Meter | null; 
}

export const AddMeterModal: React.FC<AddMeterModalProps> = ({ visible, onClose, meterToEdit }) => {
  const { showLoader, hideLoader } = useLoader();
  const isEdit = !!meterToEdit;
  const touchY = useRef(0);
  
  const [name, setName] = useState("");
  const [icon, setIcon] = useState(METER_ICONS[0].name);
  const [calcType, setCalcType] = useState<'readings' | 'consumed'>('readings');

  useEffect(() => {
    if (visible) {
      if (isEdit && meterToEdit) {
        setName(meterToEdit.name);
        setIcon(meterToEdit.icon);
        setCalcType(meterToEdit.calcType);
      } else {
        setName("");
        setIcon(METER_ICONS[0].name);
        setCalcType('readings');
      }
    }
  }, [visible, meterToEdit]);

  const handleSave = async () => {
    if (!name.trim()) return;

    showLoader();
    try {
      if (isEdit && meterToEdit) {
        await updateMeter(meterToEdit.id, {
          name: name.trim(),
          icon,
          calcType
        });
      } else {
        await addMeter({
          name: name.trim(),
          icon,
          calcType,
          order: Date.now()
        });
      }
      onClose();
    } catch (error) {
      console.error(error);
    } finally {
      hideLoader();
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
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
          
          <View style={styles.headerRow}>
            {/* ДИНАМІЧНИЙ ЗАГОЛОВОК */}
            <Text style={styles.modalTitle}>{isEdit ? "Редагувати лічильник" : "Новий лічильник"}</Text>
            <TouchableOpacity onPress={onClose} style={{ padding: 5 }}>
              <Ionicons name="close" size={28} color={Colors.textSecondary} />
            </TouchableOpacity>
          </View>
          
          <Text style={styles.label}>Назва (напр. Вода кухня)</Text>
          <TextInput 
            style={styles.input} 
            value={name} 
            onChangeText={setName} 
            placeholder="Введіть назву..." 
            placeholderTextColor={Colors.textSecondary}
          />

          <Text style={styles.label}>Тип послуги</Text>
          <View style={styles.iconsGrid}>
            {METER_ICONS.map(item => {
              const isActive = icon === item.name;
              return (
                <TouchableOpacity 
                  key={item.name} 
                  onPress={() => setIcon(item.name)}
                  style={[styles.iconBox, isActive && { borderColor: item.color, backgroundColor: `${item.color}15` }]}
                >
                  <Ionicons name={item.name as any} size={28} color={isActive ? item.color : Colors.textSecondary} />
                </TouchableOpacity>
              );
            })}
          </View>

          <Text style={styles.label}>Спосіб збору даних</Text>
          <View style={styles.toggleContainer}>
            <TouchableOpacity 
              style={[styles.toggleBtn, calcType === 'readings' && styles.toggleBtnActive]}
              onPress={() => setCalcType('readings')}
            >
              <Text style={[styles.toggleText, calcType === 'readings' && styles.toggleTextActive]}>За показами</Text>
              <Text style={styles.toggleSubtext}>Попередній / Теперішній</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.toggleBtn, calcType === 'consumed' && styles.toggleBtnActive]}
              onPress={() => setCalcType('consumed')}
            >
              <Text style={[styles.toggleText, calcType === 'consumed' && styles.toggleTextActive]}>За об&apos;ємом</Text>
              <Text style={styles.toggleSubtext}>Тільки кількість</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
             {/* ДИНАМІЧНА КНОПКА */}
            <Text style={styles.saveBtnText}>{isEdit ? "Зберегти зміни" : "Створити лічильник"}</Text>
          </TouchableOpacity>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

