import { Colors } from "@/src/constants/Colors";
import { useLoader } from "@/src/context/LoaderContext";
import { appAlert } from "@/src/services/alert";
import { addCategory, Category } from "@/src/services/categories";
import { Ionicons } from "@expo/vector-icons";
import React, { useRef, useState } from "react";
import { Modal, Pressable, Text, TextInput, TouchableOpacity, View } from "react-native";
import { styles } from "./CategoryModal.styles";

const CATEGORY_ICONS = [
  'cart', 'car', 'restaurant', 'cafe', 'medkit', 
  'airplane', 'home', 'game-controller', 'gift', 'cash',
  'bus', 'book', 'basketball', 'briefcase', 'build',
  'paw', 'shirt', 'train', 'musical-notes', 'school'
];

const CATEGORY_COLORS = Colors.categoryColors;

interface CategoryModalProps {
  visible: boolean;
  onClose: () => void;
  type: 'expense' | 'income';
  existingCategories: Category[];
  isCryptoWallet?: boolean;
}

export const CategoryModal: React.FC<CategoryModalProps> = ({ visible, onClose, type, existingCategories, isCryptoWallet }) => {
    const touchY = useRef(0);

    const { showLoader, hideLoader } = useLoader();
    const [name, setName] = useState("");
    const [icon, setIcon] = useState(CATEGORY_ICONS[0]);

const handleSave = async () => {
    if (!name.trim()) return;

    showLoader();
    try {
      const usedColors = existingCategories
        .filter(c => c.type === type)
        .map(c => c.color);

      let availableColors = CATEGORY_COLORS.filter(c => !usedColors.includes(c));

      if (availableColors.length === 0) {
        availableColors = CATEGORY_COLORS;
      }

      const randomColor = availableColors[Math.floor(Math.random() * availableColors.length)];

      const createdId = await addCategory({
        name: name.trim(),
        icon,
        color: randomColor,
        type,
        order: Date.now(),
        isCrypto: isCryptoWallet || false
      });

      if (!createdId) {
        appAlert(
          'Помилка',
          'Неможливо створити категорію без інтернету. Спробуйте ще раз, коли зʼявиться зʼєднання.',
          [{ text: 'OK', onPress: onClose }]
        );
        return;
      }

      setName("");
      setIcon(CATEGORY_ICONS[0]);
      onClose();
    } catch (error) {
      console.error(error);
      appAlert('Помилка', 'Не вдалося створити категорію.');
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
            <View style={{ width: 30 }} />
            <Text style={styles.title}>
              Нова ({type === 'expense' ? 'Витрати' : 'Доходи'})
            </Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={28} color={Colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <Text style={styles.label}>Назва категорії</Text>
          <TextInput 
            style={styles.input} 
            value={name} 
            onChangeText={setName} 
            placeholder="Наприклад: Кава" 
            placeholderTextColor={Colors.textSecondary}
          />

          <Text style={styles.label}>Оберіть іконку</Text>
          <View style={styles.iconsGrid}>
            {CATEGORY_ICONS.map(ic => (
              <TouchableOpacity 
                key={ic} 
                onPress={() => setIcon(ic)}
                style={[styles.iconBox, icon === ic && styles.iconBoxActive]}
              >
                <Ionicons name={ic as any} size={26} color={icon === ic ? Colors.primary : Colors.textSecondary} />
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
            <Text style={styles.saveBtnText}>Створити категорію</Text>
          </TouchableOpacity>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

