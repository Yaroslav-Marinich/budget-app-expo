import { Colors } from "@/src/constants/Colors";
import { useLoader } from "@/src/context/LoaderContext";
import { archiveWallet, permanentDeleteWallet, subscribeToWallets, updateWalletsOrder, Wallet } from "@/src/services/wallets";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useRef, useState } from "react";
import { Alert, Text, TouchableOpacity, View } from "react-native";
import DraggableFlatList, { RenderItemParams, ScaleDecorator } from "react-native-draggable-flatlist";
import Swipeable from "react-native-gesture-handler/Swipeable";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { styles } from "./WalletsScreen.styles";
import { EditWalletModal } from "./components/EditWalletModal";

export const WalletsScreen = () => {
  const insets = useSafeAreaInsets();
  const swipeableRefs = useRef<Map<string, Swipeable>>(new Map());

  const { showLoader, hideLoader } = useLoader();
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [openedRowId, setOpenedRowId] = useState<string | null>(null);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedWallet, setSelectedWallet] = useState<Wallet | null>(null);

  const handleDragEnd = async ({ data }: { data: Wallet[] }) => {
  const isOrderChanged = data.some((wallet, index) => wallet.id !== wallets[index]?.id);
    if (!isOrderChanged) return;

    setWallets(data); 
    showLoader(); 
    try {
      await updateWalletsOrder(data); 
    } catch (error) {
      console.error("Помилка сортування", error);
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

const confirmArchive = (wallet: Wallet) => {
    Alert.alert(
      "Архівування рахунку",
      `Рахунок "${wallet.title}" буде перенесено в архів. Ви не зможете додавати нові операції на нього, але історія та статистика збережуться.`,
      [
        { text: "Скасувати", style: "cancel" },
        { 
          text: "В архів", 
          style: "destructive",
          onPress: async () => {
            showLoader();
            await archiveWallet(wallet.id);
            hideLoader();
          }
        }
      ]
    );
  };

  const confirmPermanentDelete = async (wallet: Wallet) => {
    Alert.alert(
      "Остаточне видалення",
      `Ви видаляєте рахунок "${wallet.title}" з архіву. Це призведе до видалення ВСІХ пов'язаних транзакцій без можливості відновлення. Продовжити?`,
      [
        { text: "Скасувати", style: "cancel" },
        { 
          text: "Видалити назавжди", 
          style: "destructive",
          onPress: async () => {
            showLoader();
            try {
              const count = await permanentDeleteWallet(wallet.id);
              console.log(`Видалено рахунок та ${count} транзакцій`);
            } catch (e) {
              console.error(e);
            } finally {
              hideLoader();
            }
          }
        }
      ]
    );
  };

    const openEdit = (wallet: Wallet) => {
    setSelectedWallet(wallet);
    setEditModalVisible(true);
    };
    
    const openCreate = () => {
    setSelectedWallet(null);
    setEditModalVisible(true);
  };
    
      useEffect(() => {
    const unsubscribe = subscribeToWallets("manual-test-id", (data) => {
      setWallets(data.sort((a, b) => (a.order || 0) - (b.order || 0)));
    });
    return () => unsubscribe();
      }, []);
  
  // Функція малювання кнопки-кошика (ховається під карткою)
const renderRightActions = (item: Wallet) => (
    <TouchableOpacity 
      style={styles.deleteAction} 
      onPress={() => confirmArchive(item)}
      activeOpacity={0.8}
    >
      <Ionicons name="trash-outline" size={24} color="white" />
    </TouchableOpacity>
  );

  const renderItem = ({ item, drag, isActive }: RenderItemParams<Wallet>) => {
    const isPrimary = item.id === wallets[0]?.id;
    const isArchived = item.isArchived;
    
    return (
      <ScaleDecorator>
        {/* Обгортка для відступів */}
        <View style={styles.itemContainer}>

          {isPrimary && !isArchived && (
            <View style={styles.primaryBadge}>
              <Text style={styles.primaryBadgeText}>Основний</Text>
            </View>
          )}

          {isArchived && (
            <View style={styles.archivedBadge}>
              <Text style={styles.archivedBadgeText}>Архів</Text>
            </View>
          )}

          {/* Додаємо Swipeable компонент */}
          <Swipeable 
            ref={(ref) => {
              if (ref) swipeableRefs.current.set(item.id, ref);
              else swipeableRefs.current.delete(item.id);
            }}
            renderRightActions={() => isArchived ? null : renderRightActions(item)}
            enabled={!isArchived}
            onSwipeableWillOpen={() => onSwipeableWillOpen(item.id)}
            overshootRight={false}
            friction={1.5}
            rightThreshold={40} 
          >
            <View style={[
              styles.walletRow, 
              isPrimary && !isArchived && styles.primaryBorder,
              isArchived && styles.archivedRow,
              isActive && { borderColor: Colors.primary, backgroundColor: Colors.outline }
            ]}>

              <View style={styles.iconBox}>
                <Ionicons name={item.icon as any} size={22} color={isArchived ? Colors.textSecondary : Colors.accent} />
              </View>
              
              <View style={styles.infoBox}>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.balance}>{item.balance.toLocaleString()} {item.currency}</Text>
              </View>

              <View style={styles.actions}>
                {!isArchived ? (
                  <>
                    <TouchableOpacity style={styles.actionBtn} onPress={() => {
                        swipeableRefs.current.get(item.id)?.close();
                        openEdit(item);
                      }}>
                      <Ionicons name="pencil" size={20} color={Colors.textSecondary} />
                    </TouchableOpacity>
                    <TouchableOpacity onLongPress={drag} delayLongPress={200} style={styles.actionBtn}>
                      <Ionicons name="menu" size={24} color={Colors.textSecondary} />
                    </TouchableOpacity>
                  </>
                ) : (
                  <TouchableOpacity 
                    style={styles.actionBtn} 
                    onPress={() => confirmPermanentDelete(item)}
                  >
                    <Ionicons name="trash" size={22} color={Colors.error} />
                  </TouchableOpacity>
                )}
              </View>

            </View>
          </Swipeable>
        </View>
      </ScaleDecorator>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top + 10 }]}>
      {/* Кастомний заголовок замість системного */}
      <View style={styles.headerRow}>
        <Text style={styles.screenTitle}>Рахунки</Text>
        <TouchableOpacity onPress={() => {/* Навігація назад за потреби */}}>
           <Ionicons name="close-circle-outline" size={32} color={Colors.textSecondary} />
        </TouchableOpacity>
      </View>

      <DraggableFlatList
        data={wallets}
        onDragEnd={handleDragEnd}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={[styles.listContent, { paddingBottom: 100 }]}
      />

      {/* FAB Кнопка */}
      <TouchableOpacity style={[styles.fab, { bottom: insets.bottom + 20 }]} onPress={openCreate}>
        <Ionicons name="add" size={32} color="white" />
      </TouchableOpacity>

      <EditWalletModal 
        visible={editModalVisible} 
        wallet={selectedWallet} 
        onClose={() => setEditModalVisible(false)} 
      />
    </View>
  );
};