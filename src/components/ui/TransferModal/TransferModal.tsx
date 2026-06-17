import { CURRENCIES } from "@/src/constants/Currencies";
import { useGlobalData } from "@/src/context/DataContext";
import { useLoader } from "@/src/context/LoaderContext";
import { useTheme } from "@/src/context/ThemeContext";
import { appAlert } from "@/src/services/alert";
import { createTransfer } from "@/src/services/transactions";
import { formatMoney } from "@/src/utils/formatMoney";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { DefaultModal } from "../DefaultModal/DefaultModal";
import { getStyles } from "./TransferModal.styles";

interface TransferModalProps {
    visible: boolean;
    onClose: () => void;
    defaultSourceWalletId: string | null;
}

type ViewState = "main" | "selectSource" | "selectDest";

export const TransferModal: React.FC<TransferModalProps> = ({ visible, onClose, defaultSourceWalletId }) => {
    const { colors } = useTheme();
    const { wallets } = useGlobalData();
    const styles = getStyles(colors);
    const { showLoader, hideLoader } = useLoader();

    const [viewState, setViewState] = useState<ViewState>("main");

    const [sourceWalletId, setSourceWalletId] = useState<string | null>(null);
    const [destWalletId, setDestWalletId] = useState<string | null>(null);
    const [amount, setAmount] = useState("");
    const [destAmount, setDestAmount] = useState("");

    useEffect(() => {
        if (visible) {
            setSourceWalletId(defaultSourceWalletId);
            setDestWalletId(null);
            setAmount("");
            setDestAmount("");
            setViewState("main");
        }
    }, [visible, defaultSourceWalletId]);

    const sourceWallet = wallets.find((w) => w.id === sourceWalletId);
    const destWallet = wallets.find((w) => w.id === destWalletId);

    const isDifferentCurrency = sourceWallet && destWallet && sourceWallet.currency !== destWallet.currency;

    const getCurrencySymbol = (code?: string) => {
        if (!code) return "";
        const currency = CURRENCIES.find((c: any) => c.code === code);
        return currency?.symbol ?? code;
    };

    const sourceCurrencySymbol = getCurrencySymbol(sourceWallet?.currency);
    const destCurrencySymbol = getCurrencySymbol(destWallet?.currency);

    const availableWallets = wallets.filter((w) => !w.isArchived);

    const isSaveDisabled = !sourceWalletId || !destWalletId || !amount || (isDifferentCurrency && !destAmount);

    const handleSave = async () => {
        if (!sourceWalletId || !destWalletId || !amount) return;

        const parsedAmount = parseFloat(amount.replace(",", "."));
        if (isNaN(parsedAmount) || parsedAmount <= 0) {
            appAlert("Помилка", "Введіть коректну суму.");
            return;
        }

        let finalDestAmount = parsedAmount;

        if (isDifferentCurrency) {
            finalDestAmount = parseFloat(destAmount.replace(",", "."));
            if (isNaN(finalDestAmount) || finalDestAmount <= 0) {
                appAlert("Помилка", "Введіть коректну суму зарахування.");
                return;
            }
        }

        showLoader();
        try {
            const date = new Date().toISOString();
            const monthYear = date.slice(0, 7);

            await createTransfer(
                sourceWalletId,
                destWalletId,
                parsedAmount,
                finalDestAmount,
                date,
                monthYear
            );

            onClose();
        } catch (error) {
            console.error("Помилка переказу:", error);
            appAlert("Помилка", "Не вдалося виконати переказ. Перевірте підключення до інтернету.");
        } finally {
            hideLoader();
        }
    };

    // Компонент відображення списку рахунків для вибору
    const renderWalletList = (type: "source" | "dest") => {
        const filteredWallets = type === "dest"
            ? availableWallets.filter(w => w.id !== sourceWalletId)
            : availableWallets;

        return (
            <ScrollView showsVerticalScrollIndicator={false}>
                {filteredWallets.map(wallet => (
                    <TouchableOpacity
                        key={wallet.id}
                        style={styles.walletListItem}
                        onPress={() => {
                            if (type === "source") {
                                setSourceWalletId(wallet.id);
                                if (destWalletId === wallet.id) setDestWalletId(null);
                            } else {
                                setDestWalletId(wallet.id);
                            }
                            setViewState("main");
                        }}
                    >
                        <View style={styles.walletCardLeft}>
                            <View style={styles.iconContainer}>
                                <Ionicons name={wallet.icon as any} size={24} color={colors.primary} />
                            </View>
                            <Text style={styles.walletName}>{wallet.title}</Text>
                        </View>
                        <Text style={styles.walletBalance}>
                            {formatMoney(wallet.balance)} {getCurrencySymbol(wallet.currency)}
                        </Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        );
    };

    return (
        <DefaultModal visible={visible} onClose={onClose}>
            <View style={styles.modalContent}>

                {/* Динамічний Хедер */}
                <View style={styles.headerRow}>
                    {viewState !== "main" ? (
                        <TouchableOpacity onPress={() => setViewState("main")} style={styles.backBtn}>
                            <Ionicons name="arrow-back" size={28} color={colors.textSecondary} />
                        </TouchableOpacity>
                    ) : (
                        <View style={{ width: 30 }} />
                    )}

                    <Text style={styles.title}>
                        {viewState === "main" ? "Переказ коштів" : "Оберіть рахунок"}
                    </Text>

                    <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                        <Ionicons name="close" size={28} color={colors.textSecondary} />
                    </TouchableOpacity>
                </View>

                {/* ЕКРАН 2: Вибір рахунку списання */}
                {viewState === "selectSource" && renderWalletList("source")}

                {/* ЕКРАН 3: Вибір рахунку зарахування */}
                {viewState === "selectDest" && renderWalletList("dest")}

                {/* ЕКРАН 1: Головна форма переказу */}
                {viewState === "main" && (
                    <ScrollView showsVerticalScrollIndicator={false}>

                        {/* З РАХУНКУ */}
                        <Text style={styles.label}>З рахунку</Text>
                        <TouchableOpacity style={styles.selectedWalletCard} onPress={() => setViewState("selectSource")}>
                            {sourceWallet ? (
                                <>
                                    <View style={styles.walletCardLeft}>
                                        <View style={styles.iconContainer}>
                                            <Ionicons name={sourceWallet.icon as any} size={24} color={colors.primary} />
                                        </View>
                                        <Text style={styles.walletName}>{sourceWallet.title}</Text>
                                    </View>
                                    <Text style={styles.walletBalance}>
                                        {formatMoney(sourceWallet.balance)} {sourceCurrencySymbol}
                                    </Text>
                                </>
                            ) : (
                                <Text style={styles.emptyWalletText}>Оберіть рахунок...</Text>
                            )}
                        </TouchableOpacity>

                        {/* ІНПУТ СПИСАННЯ (Тільки якщо валюти різні) */}
                        {isDifferentCurrency && (
                            <>
                                <Text style={styles.label}>Сума списання</Text>
                                <View style={styles.inputContainer}>
                                    <TextInput
                                        style={styles.input}
                                        value={amount}
                                        onChangeText={setAmount}
                                        keyboardType="numeric"
                                        placeholder="0"
                                        placeholderTextColor={colors.textSecondary}
                                    />
                                    <Text style={styles.currencySymbol}>{sourceCurrencySymbol}</Text>
                                </View>
                            </>
                        )}

                        {/* НА РАХУНОК */}
                        <Text style={styles.label}>На рахунок</Text>
                        <TouchableOpacity style={styles.selectedWalletCard} onPress={() => setViewState("selectDest")}>
                            {destWallet ? (
                                <>
                                    <View style={styles.walletCardLeft}>
                                        <View style={styles.iconContainer}>
                                            <Ionicons name={destWallet.icon as any} size={24} color={colors.primary} />
                                        </View>
                                        <Text style={styles.walletName}>{destWallet.title}</Text>
                                    </View>
                                    <Text style={styles.walletBalance}>
                                        {formatMoney(destWallet.balance)} {destCurrencySymbol}
                                    </Text>
                                </>
                            ) : (
                                <Text style={styles.emptyWalletText}>Оберіть рахунок...</Text>
                            )}
                        </TouchableOpacity>

                        {/* НИЖНІЙ ІНПУТ (Для однакових валют - це сума переказу, для різних - сума зарахування) */}
                        <Text style={styles.label}>
                            {isDifferentCurrency ? "Сума зарахування (після обміну)" : "Сума переказу"}
                        </Text>
                        <View style={styles.inputContainer}>
                            <TextInput
                                style={styles.input}
                                value={isDifferentCurrency ? destAmount : amount}
                                onChangeText={isDifferentCurrency ? setDestAmount : setAmount}
                                keyboardType="numeric"
                                placeholder="0"
                                placeholderTextColor={colors.textSecondary}
                            />
                            <Text style={styles.currencySymbol}>
                                {destWallet ? destCurrencySymbol : sourceCurrencySymbol}
                            </Text>
                        </View>

                        <TouchableOpacity
                            style={[styles.saveBtn, { opacity: isSaveDisabled ? 0.5 : 1 }]}
                            disabled={isSaveDisabled}
                            onPress={handleSave}
                        >
                            <Text style={styles.saveBtnText}>Підтвердити переказ</Text>
                        </TouchableOpacity>

                    </ScrollView>
                )}
            </View>
        </DefaultModal>
    );
};