import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { FlatList, LogBox, Text, TouchableOpacity, View } from "react-native";
import { NestableDraggableFlatList, NestableScrollContainer, RenderItemParams, ScaleDecorator } from "react-native-draggable-flatlist";
import Swipeable from "react-native-gesture-handler/Swipeable";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { DefaultModal } from "@/src/components/ui/DefaultModal/DefaultModal";
import { useLoader } from "@/src/context/LoaderContext";
import { useTheme } from "@/src/context/ThemeContext";
import { appAlert } from "@/src/services/alert";
import { Category, checkCategoryHasTransactions, deleteAndReassignCategory, deleteCategory, subscribeToCategories, updateCategoriesOrder } from "@/src/services/categories";
import { getStyles } from "./CategoriesScreen.styles";
import { EditCategoryModal } from "./components/EditCategoryModal";

LogBox.ignoreLogs([
  'Warning: ref.measureLayout must be called with a ref to a native component'
]);

export const CategoriesScreen = () => {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const swipeableRefs = useRef<Map<string, Swipeable>>(new Map());
  const { colors } = useTheme();
  const styles = getStyles(colors);

  const { showLoader, hideLoader } = useLoader();

  const [categories, setCategories] = useState<Category[]>([]);
  const [openedRowId, setOpenedRowId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'expense' | 'income'>('expense');
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

  const [reassignModalVisible, setReassignModalVisible] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);

  useEffect(() => {
    const unsubscribe = subscribeToCategories((data) => {
      setCategories(data);
    });
    return () => unsubscribe();
  }, []);

  const fiatCategories = categories
    .filter(c => c.type === activeTab && !c.isCrypto)
    .sort((a, b) => (a.order || 0) - (b.order || 0));

  const cryptoCategories = categories
    .filter(c => c.type === activeTab && !!c.isCrypto)
    .sort((a, b) => (a.order || 0) - (b.order || 0));

  const handleDragEnd = async (updatedGroup: Category[], isCrypto: boolean) => {
    const originalGroup = isCrypto ? cryptoCategories : fiatCategories;
    const isOrderChanged = updatedGroup.some((cat, index) => cat.id !== originalGroup[index]?.id);

    if (!isOrderChanged) return;

    const reordered = updatedGroup.map((c, index) => ({ ...c, order: index }));
    const otherTabsAndTypes = categories.filter(c => c.type !== activeTab || (!!c.isCrypto !== isCrypto));

    setCategories([...otherTabsAndTypes, ...reordered]);

    showLoader();
    try {
      await updateCategoriesOrder(reordered);
    } catch (error) {
      console.error(error);
    } finally {
      hideLoader();
    }
  };

  const onSwipeableWillOpen = (id: string) => {
    if (openedRowId && openedRowId !== id) {
      swipeableRefs.current.get(openedRowId)?.close();
    }
    setOpenedRowId(id);
  };

  const handleDeletePress = async (cat: Category) => {
    showLoader();

    try {
      const hasTransactions = await checkCategoryHasTransactions(cat.id);

      if (!hasTransactions) {
        hideLoader();
        appAlert(
          "Видалення категорії",
          `Ви впевнені, що хочете видалити категорію "${cat.name}"?`,
          [
            {
              text: "Скасувати",
              style: "cancel",
              onPress: () => swipeableRefs.current.get(cat.id)?.close()
            },
            {
              text: "Видалити",
              style: "destructive",
              onPress: async () => {
                showLoader();
                const deleted = await deleteCategory(cat.id);
                hideLoader();
                if (!deleted) {
                  appAlert(
                    "Помилка",
                    "Неможливо видалити категорію без інтернету."
                  );
                }
              }
            }
          ]
        );
        return;
      }

      const availableToReassign = categories.filter(c => c.type === cat.type && c.id !== cat.id && !!c.isCrypto === !!cat.isCrypto);

      if (availableToReassign.length === 0) {
        hideLoader();
        appAlert(
          "Помилка",
          "Ця категорія має операції, але немає інших категорій для їх перенесення. Спочатку створіть нову категорію."
        );
        swipeableRefs.current.get(cat.id)?.close();
        return;
      }

      hideLoader();
      setCategoryToDelete(cat);
      setReassignModalVisible(true);

    } catch (error) {
      hideLoader();
      console.error(error);
      appAlert("Помилка", "Щось пішло не так при перевірці категорії.");
    }
  };

  const confirmReassignAndDelete = async (newCategory: Category) => {
    if (!categoryToDelete) return;

    setReassignModalVisible(false);
    showLoader();
    try {
      const count = await deleteAndReassignCategory(categoryToDelete.id, newCategory);
      if (count === null) {
        appAlert("Помилка", "Неможливо видалити категорію без інтернету.");
        return;
      }
      appAlert("Успішно", `Категорію видалено. Перенесено ${count} транзакцій до "${newCategory.name}".`);
    } catch (e) {
      console.error(e);
      appAlert("Помилка", "Не вдалося видалити категорію.");
    } finally {
      hideLoader();
    }
  };

  const openEdit = (cat: Category) => {
    setSelectedCategory(cat);
    setEditModalVisible(true);
  };

  const openCreate = () => {
    setSelectedCategory(null);
    setEditModalVisible(true);
  };

  const renderRightActions = (item: Category) => (
    <TouchableOpacity
      style={styles.deleteAction}
      onPress={() => handleDeletePress(item)}
      activeOpacity={0.8}
    >
      <Ionicons name="trash-outline" size={24} color="white" />
    </TouchableOpacity>
  );

  const renderItem = ({ item, drag, isActive }: RenderItemParams<Category>) => (
    <ScaleDecorator>
      <View style={styles.itemContainer}>
        <Swipeable
          ref={(ref) => {
            if (ref) swipeableRefs.current.set(item.id, ref);
            else swipeableRefs.current.delete(item.id);
          }}
          renderRightActions={() => renderRightActions(item)}
          onSwipeableWillOpen={() => onSwipeableWillOpen(item.id)}
          overshootRight={false}
          friction={1.5}
          rightThreshold={40}
        >
          <View style={[
            styles.categoryRow,
            isActive && { borderColor: colors.primary, backgroundColor: colors.outline }
          ]}>
            {/* Бейдж крипти зверху бордера */}
            {item.isCrypto && (
              <View style={styles.cryptoBadge}>
                <Text style={styles.cryptoBadgeText}>Крипта</Text>
              </View>
            )}

            <View style={[styles.iconBox, { backgroundColor: `${item.color}15` }]}>
              <Ionicons name={item.icon as any} size={24} color={item.color} />
            </View>

            {/* Блок інфо тепер просто виводить назву */}
            <View style={styles.infoBox}>
              <Text style={styles.title}>{item.name}</Text>
            </View>

            <View style={styles.actions}>
              <TouchableOpacity style={styles.actionBtn} onPress={() => openEdit(item)}>
                <Ionicons name="pencil" size={20} color={colors.textSecondary} />
              </TouchableOpacity>
              <TouchableOpacity onLongPress={drag} delayLongPress={200} style={styles.actionBtn}>
                <Ionicons name="menu" size={24} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>
          </View>
        </Swipeable>
      </View>
    </ScaleDecorator>
  );

  // Список категорій для перенесення
  const availableToReassign = categoryToDelete
    ? categories.filter(c => c.type === categoryToDelete.type && c.id !== categoryToDelete.id && !!c.isCrypto === !!categoryToDelete.isCrypto)
    : [];

  return (
    <View style={[styles.container, { paddingTop: insets.top + 10 }]}>
      <View style={styles.headerRow}>
        <Text style={styles.screenTitle}>Категорії</Text>
        <TouchableOpacity onPress={() => router.back()} style={{ padding: 5 }}>
          <Ionicons name="close-circle-outline" size={32} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>

      <View style={styles.toggleContainer}>
        <TouchableOpacity
          style={[styles.toggleBtn, activeTab === 'expense' && styles.toggleBtnActive]}
          onPress={() => { setActiveTab('expense'); setOpenedRowId(null); }}
        >
          <Text style={[styles.toggleLabel, activeTab === 'expense' && { color: colors.error }]}>Витрати</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.toggleBtn, activeTab === 'income' && styles.toggleBtnActive]}
          onPress={() => { setActiveTab('income'); setOpenedRowId(null); }}
        >
          <Text style={[styles.toggleLabel, activeTab === 'income' && { color: colors.primary }]}>Доходи</Text>
        </TouchableOpacity>
      </View>

      {/* NestableScrollContainer для двох списків */}
      <NestableScrollContainer showsVerticalScrollIndicator={false} contentContainerStyle={styles.listContent}>

        {/* --- СЕКЦІЯ: ФІАТ --- */}
        {fiatCategories.length > 0 && (
          <View style={styles.listWrapper} collapsable={false}>
            <View style={styles.sectionHeader}>
              <Ionicons name="cash-outline" size={16} color={colors.textSecondary} />
              <Text style={styles.sectionTitle}>Фіатні категорії</Text>
              <View style={styles.sectionBadge}><Text style={styles.sectionBadgeText}>{fiatCategories.length}</Text></View>
            </View>
            <NestableDraggableFlatList
              data={fiatCategories}
              onDragEnd={({ data }) => handleDragEnd(data, false)}
              keyExtractor={(item) => item.id}
              renderItem={renderItem}
            />
          </View>
        )}

        {/* --- СЕКЦІЯ: КРИПТА --- */}
        {cryptoCategories.length > 0 && (
          <View style={styles.listWrapper} collapsable={false}>
            <View style={styles.sectionHeader}>
              <Ionicons name="logo-bitcoin" size={16} color="#F7931A" />
              <Text style={[styles.sectionTitle, { color: '#F7931A' }]}>Крипто категорії</Text>
              <View style={styles.sectionBadge}><Text style={styles.sectionBadgeText}>{cryptoCategories.length}</Text></View>
            </View>
            <NestableDraggableFlatList
              data={cryptoCategories}
              onDragEnd={({ data }) => handleDragEnd(data, true)}
              keyExtractor={(item) => item.id}
              renderItem={renderItem}
            />
          </View>
        )}
      </NestableScrollContainer>

      {/* Модалка Reassign */}
      <DefaultModal
        visible={reassignModalVisible}
        onClose={() => setReassignModalVisible(false)}
        overlayStyle={styles.modalOverlay}
        contentStyle={styles.modalContent}
      >
        <View style={styles.modalHeaderRow}>
          <View style={styles.modalHeaderSpacer} />
          <Text style={styles.modalTitle}>Видалення: {categoryToDelete?.name}</Text>
          <TouchableOpacity onPress={() => setReassignModalVisible(false)} style={styles.modalCloseBtn}>
            <Ionicons name="close" size={28} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>

        <Text style={styles.modalSubtitle}>Оберіть категорію, куди будуть перенесені всі існуючі операції:</Text>

        <FlatList
          data={availableToReassign}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.reassignItem} onPress={() => confirmReassignAndDelete(item)}>
              <Ionicons name={item.icon as any} size={24} color={item.color} style={{ marginRight: 15 }} />
              <Text style={styles.title}>{item.name}</Text>
            </TouchableOpacity>
          )}
        />

        <TouchableOpacity style={styles.cancelBtn} onPress={() => setReassignModalVisible(false)}>
          <Text style={{ color: colors.error, fontSize: 16, fontWeight: 'bold' }}>Скасувати</Text>
        </TouchableOpacity>
      </DefaultModal>

      {/* FAB Кнопка */}
      <TouchableOpacity style={[styles.fab, { bottom: insets.bottom + 20 }]} onPress={openCreate}>
        <Ionicons name="add" size={32} color="white" />
      </TouchableOpacity>

      {/* Модалка створення/редагування */}
      <EditCategoryModal
        visible={editModalVisible}
        category={selectedCategory}
        onClose={() => setEditModalVisible(false)}
        type={activeTab}
        existingCategories={categories}
      />
    </View>
  );
};