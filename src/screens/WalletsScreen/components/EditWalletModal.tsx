import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useRef, useState } from "react";
import { FlatList, Modal, Pressable, Switch, Text, TextInput, TouchableOpacity, View } from "react-native";

import { Colors } from "@/src/constants/Colors";
import { CURRENCIES } from "@/src/constants/Currencies";
import { WALLET_ICONS } from "@/src/constants/Icons";
import { useLoader } from "@/src/context/LoaderContext";
import { createWallet, updateWallet } from "@/src/services/wallets";

import { styles } from "./EditWalletModal.styles";

export const EditWalletModal = ({ visible, wallet, onClose }: any) => {
  const isEdit = !!wallet;
  const touchY = useRef(0);

  const { showLoader, hideLoader } = useLoader();
  const [title, setTitle] = useState(wallet?.title || "");
  const [icon, setIcon] = useState(wallet?.icon || "card-outline");
  const [currency, setCurrency] = useState(wallet?.currency || "UAH");
  const [search, setSearch] = useState("");
  const [showCurrencyPicker, setShowCurrencyPicker] = useState(false);
  
  const [isCrypto, setIsCrypto] = useState(wallet?.isCrypto || false);

  useEffect(() => {
    if (wallet) {
      setTitle(wallet.title);
      setIcon(wallet.icon);
      setCurrency(wallet.currency);
      setIsCrypto(wallet.isCrypto || false);
    } else {
      setTitle("");
      setIcon("card-outline");
      setCurrency("UAH");
      setIsCrypto(false);
    }
  }, [wallet, visible]);

  const filteredCurrencies = CURRENCIES.filter(c => 
    c.type === (isCrypto ? 'crypto' : 'fiat') &&
    (c.name.toLowerCase().includes(search.toLowerCase()) || 
    c.country.toLowerCase().includes(search.toLowerCase()) ||
    c.code.toLowerCase().includes(search.toLowerCase()))
  );

  const handleCryptoToggle = (val: boolean) => {
    setIsCrypto(val);
    setCurrency(val ? 'USDT' : 'UAH');
  };

const handleSave = async () => {
    if (!title.trim()) return;

    const data: any = { 
      title, 
      icon, 
      currency, 
      isCrypto 
    };

    if (isCrypto) {
      data.excludeFromTotal = true;
    }

    showLoader(); 
    try {
      if (isEdit) {
        await updateWallet(wallet.id, data);
      } else {
        await createWallet(data);
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
      <Pressable style={styles.modalOverlay} onPress={onClose}>
        <Pressable style={styles.modalContent} onPress={e => e.stopPropagation()}
          onTouchStart={e => touchY.current = e.nativeEvent.pageY}
          onTouchEnd={e => {
            if (e.nativeEvent.pageY - touchY.current > 50) onClose();
          }}>
          <View style={styles.dragIndicator} />
          
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              {isEdit ? "Редагувати рахунок" : "Новий рахунок"}
            </Text>
            <TouchableOpacity onPress={onClose} style={{ padding: 5 }}>
              <Ionicons name="close" size={26} color={Colors.textSecondary} />
            </TouchableOpacity>
          </View>

          {!isEdit && (
            <View style={styles.switchRow}>
              <View>
                <Text style={styles.switchLabel}>Криптовалютний рахунок</Text>
                <Text style={styles.switchSubLabel}>Власні категорії, ігнорується в аналітиці</Text>
              </View>
              <Switch 
                value={isCrypto} 
                onValueChange={handleCryptoToggle}
                trackColor={{ false: Colors.outline, true: Colors.primary }}
              />
            </View>
          )}

          <Text style={styles.inputLabel}>Іконка</Text>
          <View style={styles.iconsContainer}>
            {WALLET_ICONS.map(i => (
              <TouchableOpacity 
                key={i.id} 
                onPress={() => setIcon(i.iconName)}
                style={[styles.iconBox, icon === i.iconName && styles.iconBoxActive]}
              >
                <Ionicons name={i.iconName as any} size={20} color={icon === i.iconName ? Colors.primary : Colors.textSecondary} />
              </TouchableOpacity>
            ))}
          </View>

          {/* Назва */}
          <Text style={styles.inputLabel}>Назва рахунку</Text>
          <TextInput 
            style={styles.input} 
            value={title} 
            onChangeText={setTitle} 
            placeholderTextColor={Colors.textSecondary} 
          />

          {/* Валюта */}
          <Text style={styles.inputLabel}>Валюта</Text>
          <TouchableOpacity style={styles.input} onPress={() => setShowCurrencyPicker(true)}>
            <Text style={styles.currencyText}>{currency}</Text>
          </TouchableOpacity>

          {/* Кнопка збереження */}
          <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
            <Text style={styles.saveBtnText}>
              {isEdit ? "Зберегти зміни" : "Створити рахунок"}
            </Text>
          </TouchableOpacity>

          {/* Вкладена сторінка для пошуку валюти */}
          {showCurrencyPicker && (
            <View style={styles.currencyPickerContainer}>
              <View style={styles.searchHeader}>
                <TextInput 
                  style={[styles.input, styles.searchInput]} 
                  placeholder="Пошук валюти або країни..." 
                  value={search} 
                  onChangeText={setSearch}
                  autoFocus
                />
                <TouchableOpacity onPress={() => setShowCurrencyPicker(false)} style={styles.closeBtn}>
                  <Text style={styles.closeBtnText}>Закрити</Text>
                </TouchableOpacity>
              </View>
              
              <FlatList 
                data={filteredCurrencies}
                keyExtractor={item => item.code}
                renderItem={({item}) => (
                  <TouchableOpacity 
                    style={styles.currencyItem} 
                    onPress={() => { setCurrency(item.code); setShowCurrencyPicker(false); }}
                  >
                    <View>
                      <Text style={styles.currencyCode}>{item.code} - {item.symbol}</Text>
                      <Text style={styles.currencyName}>{item.name} ({item.country})</Text>
                    </View>
                  </TouchableOpacity>
                )}
              />
            </View>
          )}
        </Pressable>
      </Pressable>
    </Modal>
  );
};