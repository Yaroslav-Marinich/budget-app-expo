import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { ScrollView, Switch, Text, TextInput, TouchableOpacity, View } from "react-native";

import { DefaultModal } from "@/src/components/ui/DefaultModal/DefaultModal";
import { useLoader } from "@/src/context/LoaderContext";
import { useTheme } from "@/src/context/ThemeContext";
import { appAlert } from "@/src/services/alert";
import { addCategory, Category, updateCategory } from "@/src/services/categories";
import { getStyles } from "./EditCategoryModal.styles";

const CATEGORY_ICONS = [
  'cart', 'car', 'restaurant', 'cafe', 'medkit',
  'airplane', 'home', 'game-controller', 'gift', 'cash',
  'bus', 'book', 'basketball', 'briefcase', 'build',
  'paw', 'shirt', 'train', 'musical-notes', 'school'
];

interface Props {
  visible: boolean;
  category: Category | null;
  onClose: () => void;
  type: 'expense' | 'income';
  existingCategories: Category[];
}

export const EditCategoryModal = ({ visible, category, onClose, type, existingCategories }: Props) => {
  const isEdit = !!category;
  const { showLoader, hideLoader } = useLoader();
  const { colors } = useTheme();
  const styles = getStyles(colors);

  const CATEGORY_COLORS = colors.categoryColors;

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
          appAlert('Помилка', 'Неможливо редагувати категорію без інтернету.');
          return;
        }
      } else {
        const createdId = await addCategory({ ...data, order: Date.now() });
        if (!createdId) {
          appAlert('Помилка', 'Неможливо створити категорію без інтернету.');
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
    <DefaultModal visible={visible} onClose={onClose} contentStyle={styles.modalContent}>
      <View style={styles.modalHeader}>
        <Text style={styles.modalTitle}>
          {isEdit ? "Редагувати категорію" : "Нова категорія"}
        </Text>
        <TouchableOpacity onPress={onClose} style={{ padding: 5 }}>
          <Ionicons name="close" size={26} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>

      <View>
        {!isEdit && (
          <View style={styles.switchRow}>
            <Text style={styles.switchLabel}>Це криптовалютна категорія</Text>
            <Switch
              value={isCryptoCategory}
              onValueChange={setIsCryptoCategory}
              trackColor={{ false: colors.outline, true: colors.primary }}
            />
          </View>
        )}

        {/* Інпут з візуальним прев'ю */}
        <View style={styles.inputRow}>
          <View style={[styles.previewIcon, { backgroundColor: `${color}20` }]}>
            <Ionicons name={icon as any} size={28} color={color} />
          </View>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Назва категорії"
            placeholderTextColor={colors.textSecondary}
          />
        </View>

        {/* Горизонтальний список кольорів */}
        <Text style={styles.sectionLabel}>Оберіть колір</Text>
        <View style={styles.scrollWrapper}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
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
                {color === c && <Ionicons name="checkmark" size={20} color={colors.white} />}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Горизонтальний список іконок */}
        <Text style={styles.sectionLabel}>Оберіть іконку</Text>
        <View style={styles.scrollWrapper}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
            {CATEGORY_ICONS.map(i => (
              <TouchableOpacity
                key={i}
                onPress={() => setIcon(i)}
                style={[
                  styles.iconBox,
                  icon === i && styles.iconBoxActive,
                  icon === i && { borderColor: color }
                ]}
              >
                <Ionicons
                  name={i as any}
                  size={24}
                  color={icon === i ? color : colors.textSecondary}
                />
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
          <Text style={styles.saveBtnText}>
            {isEdit ? "Зберегти зміни" : "Створити категорію"}
          </Text>
        </TouchableOpacity>
      </View>
    </DefaultModal>
  );
};