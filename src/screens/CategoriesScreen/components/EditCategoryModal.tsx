import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useRef, useState } from "react";
import { Modal, Pressable, ScrollView, Switch, Text, TextInput, TouchableOpacity, View } from "react-native";

import { Colors } from "@/src/constants/Colors";
import { useLoader } from "@/src/context/LoaderContext";
import { appAlert } from "@/src/services/alert";
import { addCategory, Category, updateCategory } from "@/src/services/categories";
import { styles } from "./EditCategoryModal.styles";

// Список іконок для категорій
const CATEGORY_ICONS = [
  'cart', 'car', 'restaurant', 'cafe', 'medkit', 
  'airplane', 'home', 'game-controller', 'gift', 'cash',
  'bus', 'book', 'basketball', 'briefcase', 'build',
  'paw', 'shirt', 'train', 'musical-notes', 'school'
];

// Палітра кольорів
const CATEGORY_COLORS = Colors.categoryColors;

interface Props {
  visible: boolean;
  category: Category | null;
  onClose: () => void;
  type: 'expense' | 'income';
  existingCategories: Category[];
}

export const EditCategoryModal = ({ visible, category, onClose, type, existingCategories }: Props) => {
  const isEdit = !!category;
  const touchY = useRef(0);
  const { showLoader, hideLoader } = useLoader();

  const [name, setName] = useState("");
  const [icon, setIcon] = useState("cart");
  const [color, setColor] = useState(CATEGORY_COLORS[0]);

  const [isCryptoCategory, setIsCryptoCategory] = useState(false);

  useEffect(() => {
    if (category) {
      setName(category.name);
      setIcon(category.icon);
      setColor(category.color);
      setIsCryptoCategory(category.isCrypto || false);
    } else {
      setName("");
      setIcon("cart");
      setIsCryptoCategory(false);
      const usedColors = existingCategories.filter(c => c.type === type).map(c => c.color);
      const availableColor = CATEGORY_COLORS.find(c => !usedColors.includes(c)) || CATEGORY_COLORS[0];
      setColor(availableColor);
    }
  }, [category, visible, existingCategories, type]);

  const handleSave = async () => {
    if (!name.trim()) return;

    const data = {
      name: name.trim(),
      icon,
      color,
      type,
      isCrypto: isCryptoCategory
    };

    showLoader();
    try {
      if (isEdit && category) {
        const updated = await updateCategory(category.id, data);
        if (!updated) {
          appAlert(
            'Помилка',
            'Неможливо редагувати категорію без інтернету. Спробуйте пізніше.',
            [{ text: 'OK', onPress: onClose }]
          );
          return;
        }
      } else {
        const createdId = await addCategory({ ...data, order: Date.now() });
        if (!createdId) {
          appAlert(
            'Помилка',
            'Неможливо створити категорію без інтернету. Спробуйте пізніше.',
            [{ text: 'OK', onPress: onClose }]
          );
          return;
        }
      }
      onClose();
    } catch (error) {
      console.error(error);
      appAlert('Помилка', 'Не вдалося зберегти категорію.');
    } finally {
      hideLoader();
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <Pressable style={styles.modalOverlay} onPress={onClose}>
        <Pressable 
          style={styles.modalContent} 
          onPress={e => e.stopPropagation()}
          onTouchStart={e => touchY.current = e.nativeEvent.pageY}
          onTouchEnd={e => {
            if (e.nativeEvent.pageY - touchY.current > 50) onClose();
          }}
        >
          <View style={styles.dragIndicator} />
          
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              {isEdit ? "Редагувати категорію" : "Нова категорія"}
            </Text>
            <TouchableOpacity onPress={onClose} style={{ padding: 5 }}>
              <Ionicons name="close" size={26} color={Colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {!isEdit && (
              <View style={styles.switchRow}>
                <Text style={styles.switchLabel}>Це криптовалютна категорія</Text>
                <Switch 
                  value={isCryptoCategory} 
                  onValueChange={setIsCryptoCategory}
                  trackColor={{ false: Colors.outline, true: Colors.primary }}
                />
              </View>
            )}
            {/* Назва */}
            <Text style={styles.inputLabel}>Назва категорії</Text>
            <TextInput 
              style={styles.input} 
              value={name} 
              onChangeText={setName} 
              placeholder="Наприклад: Продукти"
              placeholderTextColor={Colors.textSecondary} 
            />

            {/* Колір */}
            <Text style={styles.inputLabel}>Колір</Text>
            <View style={styles.colorsGrid}>
              {CATEGORY_COLORS.map(c => (
                <TouchableOpacity 
                  key={c} 
                  onPress={() => setColor(c)}
                  style={[
                    styles.colorBox, 
                    { backgroundColor: c },
                    color === c && styles.colorBoxActive
                  ]}
                >
                  {color === c && <Ionicons name="checkmark" size={20} color={Colors.white} />}
                </TouchableOpacity>
              ))}
            </View>

            {/* Іконка */}
            <Text style={styles.inputLabel}>Іконка</Text>
            <View style={styles.iconsContainer}>
              {CATEGORY_ICONS.map(i => (
                <TouchableOpacity 
                  key={i} 
                  onPress={() => setIcon(i)}
                  style={[styles.iconBox, icon === i && styles.iconBoxActive]}
                >
                  <Ionicons 
                    name={i as any} 
                    size={22} 
                    color={icon === i ? Colors.primary : Colors.textSecondary} 
                  />
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
              <Text style={styles.saveBtnText}>
                {isEdit ? "Зберегти зміни" : "Створити категорію"}
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </Pressable>
      </Pressable>
    </Modal>
  );
};