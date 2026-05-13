import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { Switch, Text, TextInput, TouchableOpacity, View } from "react-native";

import { CurrencyPickerModal } from "@/src/components/ui/CurrencyPickerModal/CurrencyPickerModal";
import { DefaultModal } from "@/src/components/ui/DefaultModal/DefaultModal";
import { WALLET_ICONS } from "@/src/constants/Icons";
import { useLoader } from "@/src/context/LoaderContext";
import { useTheme } from "@/src/context/ThemeContext";
import { createWallet, updateWallet } from "@/src/services/wallets";
import { getStyles } from "./EditWalletModal.styles";


export const EditWalletModal = ({ visible, wallet, onClose }: any) => {
  const isEdit = !!wallet;
  const { colors } = useTheme();
  const styles = getStyles(colors);

  const { showLoader, hideLoader } = useLoader();
  const [title, setTitle] = useState(wallet?.title || "");
  const [icon, setIcon] = useState(wallet?.icon || "card-outline");
  const [currency, setCurrency] = useState(wallet?.currency || "UAH");
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
    <DefaultModal visible={visible} onClose={onClose} overlayStyle={styles.modalOverlay} contentStyle={styles.modalContent}>
      <View style={styles.modalHeader}>
        <Text style={styles.modalTitle}>
          {isEdit ? "Редагувати рахунок" : "Новий рахунок"}
        </Text>
        <TouchableOpacity onPress={onClose} style={{ padding: 5 }}>
          <Ionicons name="close" size={26} color={colors.textSecondary} />
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
            trackColor={{ false: colors.outline, true: colors.primary }}
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
            <Ionicons name={i.iconName as any} size={20} color={icon === i.iconName ? colors.primary : colors.textSecondary} />
          </TouchableOpacity>
        ))}
      </View>

      {/* Назва */}
      <Text style={styles.inputLabel}>Назва рахунку</Text>
      <TextInput
        style={styles.input}
        value={title}
        onChangeText={setTitle}
        placeholderTextColor={colors.textSecondary}
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

      <CurrencyPickerModal
        visible={showCurrencyPicker}
        onClose={() => setShowCurrencyPicker(false)}
        onSelect={(code) => setCurrency(code)}
        currencyType={isCrypto ? "crypto" : "fiat"}
      />
    </DefaultModal>
  );
};