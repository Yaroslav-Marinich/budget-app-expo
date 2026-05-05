import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { Alert, FlatList, Modal, Pressable, Text, TouchableOpacity, View } from "react-native";
import DraggableFlatList, { RenderItemParams, ScaleDecorator } from "react-native-draggable-flatlist";
import Swipeable from "react-native-gesture-handler/Swipeable";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Colors } from "@/src/constants/Colors";
import { useLoader } from "@/src/context/LoaderContext";
import { Category, checkCategoryHasTransactions, deleteAndReassignCategory, deleteCategory, subscribeToCategories, updateCategoriesOrder } from "@/src/services/categories";
import { styles } from "./CategoriesScreen.styles";

export const CategoriesScreen = () => {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { showLoader, hideLoader } = useLoader();
  const swipeableRefs = useRef<Map<string, Swipeable>>(new Map());

  const [categories, setCategories] = useState<Category[]>([]);
  const [openedRowId, setOpenedRowId] = useState<string | null>(null);
  
  const [activeTab, setActiveTab] = useState<'expense' | 'income'>('expense');
  const reassignModalTouchY = useRef(0);

  const [reassignModalVisible, setReassignModalVisible] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);

  useEffect(() => {
    const unsubscribe = subscribeToCategories("manual-test-id", (data) => {
      setCategories(data);
    });
    return () => unsubscribe();
  }, []);

  const activeCategories = categories
    .filter(c => c.type === activeTab)
    .sort((a, b) => (a.order || 0) - (b.order || 0));

  const handleDragEnd = async ({ data }: { data: Category[] }) => {
    const isOrderChanged = data.some((cat, index) => cat.id !== activeCategories[index]?.id);
    if (!isOrderChanged) return;
    const updatedData = data.map((c, index) => ({ ...c, order: index }));
    const otherCategories = categories.filter(c => c.type !== activeTab);
  
    setCategories([...otherCategories, ...updatedData]); 

    showLoader(); 
    try {
      await updateCategoriesOrder(updatedData); 
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
        Alert.alert(
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
                await deleteCategory(cat.id);
                hideLoader();
              }
            }
          ]
        );
        return;
      }

      const availableToReassign = categories.filter(c => c.type === cat.type && c.id !== cat.id);

      if (availableToReassign.length === 0) {
        hideLoader();
        Alert.alert(
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
      Alert.alert("Помилка", "Щось пішло не так при перевірці категорії.");
    }
  };

  const confirmReassignAndDelete = async (newCategory: Category) => {
    if (!categoryToDelete) return;
    
    setReassignModalVisible(false);
    showLoader();
    try {
      const count = await deleteAndReassignCategory(categoryToDelete.id, newCategory);
      Alert.alert("Успішно", `Категорію видалено. Перенесено ${count} транзакцій до "${newCategory.name}".`);
    } catch (e) {
      console.error(e);
      Alert.alert("Помилка", "Не вдалося видалити категорію.");
    } finally {
      hideLoader();
    }
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
            isActive && { borderColor: Colors.primary, backgroundColor: Colors.outline }
          ]}>
            <View style={[styles.iconBox, { backgroundColor: `${item.color}15` }]}>
              <Ionicons name={item.icon as any} size={24} color={item.color} />
            </View>
            
            <View style={styles.infoBox}>
              <Text style={styles.title}>{item.name}</Text>
            </View>

            <View style={styles.actions}>
              <TouchableOpacity style={styles.actionBtn} onPress={() => {
                  swipeableRefs.current.get(item.id)?.close();
                  // TODO: Підключити редагування
                }}>
                <Ionicons name="pencil" size={20} color={Colors.textSecondary} />
              </TouchableOpacity>
              <TouchableOpacity onLongPress={drag} delayLongPress={200} style={styles.actionBtn}>
                <Ionicons name="menu" size={24} color={Colors.textSecondary} />
              </TouchableOpacity>
            </View>
          </View>
        </Swipeable>
      </View>
    </ScaleDecorator>
  );

  const availableToReassign = categoryToDelete 
    ? categories.filter(c => c.type === categoryToDelete.type && c.id !== categoryToDelete.id) 
    : [];

  return (
    <View style={[styles.container, { paddingTop: insets.top + 10 }]}>
      <View style={styles.headerRow}>
        <Text style={styles.screenTitle}>Категорії</Text>
        <TouchableOpacity onPress={() => router.back()} style={{ padding: 5 }}>
           <Ionicons name="close-circle-outline" size={32} color={Colors.textSecondary} />
        </TouchableOpacity>
      </View>

      {/* --- ТАБИ (ПЕРЕМИКАЧ) --- */}
      <View style={styles.toggleContainer}>
        <TouchableOpacity 
          style={[styles.toggleBtn, activeTab === 'expense' && styles.toggleBtnActive]} 
          onPress={() => { setActiveTab('expense'); setOpenedRowId(null); }}
        >
          <Text style={[styles.toggleLabel, activeTab === 'expense' && { color: Colors.error }]}>Витрати</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.toggleBtn, activeTab === 'income' && styles.toggleBtnActive]} 
          onPress={() => { setActiveTab('income'); setOpenedRowId(null); }}
        >
          <Text style={[styles.toggleLabel, activeTab === 'income' && { color: Colors.primary }]}>Доходи</Text>
        </TouchableOpacity>
      </View>

      <DraggableFlatList
        data={activeCategories} // ПЕРЕДАЄМО ТІЛЬКИ АКТИВНУ ВКЛАДКУ
        onDragEnd={handleDragEnd}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
      />

      <Modal visible={reassignModalVisible} animationType="slide" transparent onRequestClose={() => setReassignModalVisible(false)}>
        <Pressable style={styles.modalOverlay} onPress={() => setReassignModalVisible(false)}>
          <Pressable
            style={styles.modalContent}
            onPress={e => e.stopPropagation()}
            onTouchStart={e => {
              reassignModalTouchY.current = e.nativeEvent.pageY;
            }}
            onTouchEnd={e => {
              if (e.nativeEvent.pageY - reassignModalTouchY.current > 50) {
                setReassignModalVisible(false);
              }
            }}
          >
            <View style={styles.dragIndicator} />

            <View style={styles.modalHeaderRow}>
              <View style={styles.modalHeaderSpacer} />
              <Text style={styles.modalTitle}>Видалення: {categoryToDelete?.name}</Text>
              <TouchableOpacity onPress={() => setReassignModalVisible(false)} style={styles.modalCloseBtn}>
                <Ionicons name="close" size={28} color={Colors.textSecondary} />
              </TouchableOpacity>
            </View>

            <Text style={styles.modalSubtitle}>Оберіть категорію, куди будуть перенесені всі існуючі операції:</Text>
            
            <FlatList 
              data={availableToReassign}
              keyExtractor={item => item.id}
              renderItem={({item}) => (
                <TouchableOpacity style={styles.reassignItem} onPress={() => confirmReassignAndDelete(item)}>
                  <Ionicons name={item.icon as any} size={24} color={item.color} style={{marginRight: 15}} />
                  <Text style={styles.title}>{item.name}</Text>
                </TouchableOpacity>
              )}
            />

            <TouchableOpacity style={styles.cancelBtn} onPress={() => setReassignModalVisible(false)}>
              <Text style={{color: Colors.error, fontSize: 16, fontWeight: 'bold'}}>Скасувати</Text>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      </Modal>

    </View>
  );
};