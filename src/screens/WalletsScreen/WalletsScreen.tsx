import { useLoader } from "@/src/context/LoaderContext";
import { useTheme } from "@/src/context/ThemeContext";
import { appAlert } from "@/src/services/alert";
import { archiveWallet, permanentDeleteWallet, subscribeToWallets, updateWallet, updateWalletsOrder, Wallet } from "@/src/services/wallets";
import { formatMoney } from "@/src/utils/formatMoney";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { Switch, Text, TouchableOpacity, View } from "react-native";
import DraggableFlatList, { RenderItemParams, ScaleDecorator } from "react-native-draggable-flatlist";
import Swipeable from "react-native-gesture-handler/Swipeable";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { getStyles } from "./WalletsScreen.styles";
import { EditWalletModal } from "./components/EditWalletModal";

export const WalletsScreen = () => {
  const insets = useSafeAreaInsets();
  const swipeableRefs = useRef<Map<string, Swipeable>>(new Map());
  const router = useRouter();
    const { colors } = useTheme();
    const styles = getStyles(colors);

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
    if (wallet.isPending) return;
    appAlert(
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
    if (wallet.isPending) return;
    appAlert(
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
    const unsubscribe = subscribeToWallets((data) => {
      const sortedWallets = data.sort((a, b) => {
        if (a.isArchived && !b.isArchived) return 1;
        if (!a.isArchived && b.isArchived) return -1;
        
        return (a.order ?? Number.MAX_SAFE_INTEGER) - (b.order ?? Number.MAX_SAFE_INTEGER);
      });
      
      setWallets([...sortedWallets]); 
    });
    return () => unsubscribe();
  }, []);

  const toggleExcludeFromTotal = async (wallet: Wallet, newValue: boolean) => {
    if (wallet.isPending || wallet.isArchived) return; // Додатковий захист
    setWallets(prev => prev.map(w => w.id === wallet.id ? { ...w, excludeFromTotal: newValue } : w));
    try {
      await updateWallet(wallet.id, { excludeFromTotal: newValue });
    } catch (e) {
      console.error("Помилка оновлення налаштувань рахунку", e);
      setWallets(prev => prev.map(w => w.id === wallet.id ? { ...w, excludeFromTotal: !newValue } : w));
    }
  };
  
  const renderRightActions = (item: Wallet) => (
    <TouchableOpacity 
      style={styles.deleteAction} 
      onPress={() => confirmArchive(item)}
      activeOpacity={0.8}
    >
      <Ionicons name="trash-outline" size={24} color={colors.white} />
    </TouchableOpacity>
  );

  const renderItem = ({ item, drag, isActive }: RenderItemParams<Wallet>) => {
    const isPrimary = item.id === wallets[0]?.id;
    const isArchived = item.isArchived;
    const isPending = item.isPending;
    
    return (
      <ScaleDecorator>
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

          {isPending && (
            <View style={styles.pendingBadge}>
              <Ionicons name="time-outline" size={12} color={colors.background} />
              <Text style={styles.pendingBadgeText}>Черга</Text>
            </View>
          )}

          <Swipeable 
            ref={(ref) => {
              if (ref) swipeableRefs.current.set(item.id, ref);
              else swipeableRefs.current.delete(item.id);
            }}
            renderRightActions={() => isArchived ? null : renderRightActions(item)}
            enabled={!isArchived && !isPending}
            onSwipeableWillOpen={() => onSwipeableWillOpen(item.id)}
            overshootRight={false}
            friction={1.5}
            rightThreshold={40} 
          >
            <View style={[
              styles.walletCard,
              isPrimary && !isArchived && styles.primaryBorder,
              isArchived && styles.archivedRow,
              isPending && styles.pendingRow,
              isActive && { borderColor: colors.primary, backgroundColor: colors.outline }
            ]}>

              {/* ВЕРХНЯ ЧАСТИНА */}
              <View style={styles.walletTopRow}>
                <View style={styles.iconBox}>
                  <Ionicons name={item.icon as any} size={22} color={isArchived ? colors.textSecondary : colors.accent} />
                </View>
                
                <View style={styles.infoBox}>
                  <Text style={styles.title}>{item.title}</Text>
                  <Text style={styles.balance}>{formatMoney(item.balance)} {item.currency}</Text>
                </View>

                <View style={styles.actions}>
                  {!isArchived ? (
                    <>
                      <TouchableOpacity style={styles.actionBtn} onPress={() => {
                          if (isPending) return;
                          swipeableRefs.current.get(item.id)?.close();
                          openEdit(item);
                        }} disabled={isPending}>
                        <Ionicons name="pencil" size={20} color={colors.textSecondary} />
                      </TouchableOpacity>
                      <TouchableOpacity onLongPress={drag} delayLongPress={200} style={styles.actionBtn} disabled={isPending}>
                        <Ionicons name="menu" size={24} color={colors.textSecondary} />
                      </TouchableOpacity>
                    </>
                  ) : (
                    <TouchableOpacity 
                      style={styles.actionBtn} 
                      onPress={() => confirmPermanentDelete(item)}
                    >
                      <Ionicons name="trash" size={22} color={colors.error} />
                    </TouchableOpacity>
                  )}
                </View>
              </View>

              {/* НИЖНЯ ЧАСТИНА (ПЕРЕМИКАЧ) */}
              {/* <View style={styles.excludeContainer}>
                <Text style={styles.excludeText}>Враховувати у загальному балансі</Text>
                <Switch
                  value={!item.excludeFromTotal}
                  onValueChange={(val) => toggleExcludeFromTotal(item, !val)}
                  trackColor={{ false: colors.error, true: colors.primary }}
                  thumbColor={colors.outline}
                  disabled={isPending || isArchived} 
                />
              </View> */}
              {!item.isCrypto && (
  <View style={styles.excludeContainer}>
    <Text style={styles.excludeText}>Враховувати у загальному балансі</Text>
    <Switch
      value={!item.excludeFromTotal}
      onValueChange={(val) => toggleExcludeFromTotal(item, !val)}
      trackColor={{ false: colors.error, true: colors.primary }}
      thumbColor={colors.outline}
      disabled={isPending} 
    />
  </View>
)}

{/* 👈 ОПЦІОНАЛЬНО: Можна додати інфо-плашку для крипти, щоб юзер розумів, чому там немає світчера */}
{item.isCrypto && (
  <View style={[styles.excludeContainer, { borderTopWidth: 0, marginTop: 4 }]}>
    <Text style={[styles.excludeText, { fontStyle: 'italic', color: colors.warningAccent }]}>
      Криптовалюта (тільки індивідуальна аналітика)
    </Text>
  </View>
)}

            </View>
          </Swipeable>
        </View>
      </ScaleDecorator>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top + 10 }]}>
      <View style={styles.headerRow}>
        <Text style={styles.screenTitle}>Рахунки</Text>
        <TouchableOpacity onPress={() => router.back()} style={{ padding: 5 }}>
           <Ionicons name="close-circle-outline" size={32} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>

      <DraggableFlatList
        data={wallets}
        onDragEnd={handleDragEnd}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={[styles.listContent, { paddingBottom: insets.bottom + 140 }]}
      />

      <TouchableOpacity style={[styles.fab, { bottom: insets.bottom + 20 }]} onPress={openCreate}>
                      <Ionicons name="add" size={32} color={colors.white} />
      </TouchableOpacity>

      <EditWalletModal 
        visible={editModalVisible} 
        wallet={selectedWallet} 
        onClose={() => setEditModalVisible(false)} 
      />
    </View>
  );
};