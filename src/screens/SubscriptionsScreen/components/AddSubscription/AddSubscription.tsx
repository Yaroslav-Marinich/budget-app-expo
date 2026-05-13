import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Calculator } from "@/src/components/ui/Calculator/Calculator";
import { CurrencyPickerModal } from "@/src/components/ui/CurrencyPickerModal/CurrencyPickerModal";
import { DatePickerModal } from "@/src/components/ui/DatePickerModal/DatePickerModal";
import { DefaultModal } from "@/src/components/ui/DefaultModal/DefaultModal";
import { ServiceLogoPickerModal } from "@/src/components/ui/ServiceLogoPickerModal/ServiceLogoPickerModal";
import { WalletPickerModal } from "@/src/components/ui/WalletPickerModal/WalletPickerModal";
import { auth } from "@/src/config/firebase";
import { SERVICES_DB } from "@/src/constants/ServicesDB";
import { useGlobalData } from "@/src/context/DataContext";
import { useLoader } from "@/src/context/LoaderContext";
import { useTheme } from "@/src/context/ThemeContext";
import { appAlert } from "@/src/services/alert";
import {
    addSubscription,
    deleteSubscription,
    getSubscriptionById,
    updateSubscription
} from "@/src/services/subscriptions";
import { Image } from "expo-image";
import { getStyles } from "./AddSubscription.styles";

export const AddSubscription = () => {
    const { id: routerId } = useLocalSearchParams();
    const id = Array.isArray(routerId) ? routerId[0] : routerId;

    const isEditMode = id && id !== 'add';

    const insets = useSafeAreaInsets();
    const router = useRouter();
    const { colors } = useTheme();
    const styles = getStyles(colors);

    const { wallets } = useGlobalData();
    const { showLoader, hideLoader } = useLoader();

    const [isFetching, setIsFetching] = useState(isEditMode);

    const [name, setName] = useState("");
    const [amount, setAmount] = useState("0");
    const [currency, setCurrency] = useState("UAH");
    const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly' | 'days'>('monthly');
    const [customDays, setCustomDays] = useState("30");
    const [walletId, setWalletId] = useState("");
    const [nextPaymentDate, setNextPaymentDate] = useState(new Date());
    const [predefinedLogo, setPredefinedLogo] = useState<string>("");
    const [showLogoPicker, setShowLogoPicker] = useState(false);


    const [showCalc, setShowCalc] = useState(false);
    const [showCurrency, setShowCurrency] = useState(false);
    const [showWallet, setShowWallet] = useState(false);
    const [showDatePicker, setShowDatePicker] = useState(false);

    useEffect(() => {
        const loadData = async () => {
            if (isEditMode && id) {
                const data = await getSubscriptionById(id);
                if (data) {
                    setName(data.name);
                    setAmount(data.amount.toString());
                    setCurrency(data.currency);
                    setBillingCycle(data.billingCycle);
                    setCustomDays(data.customDays ? data.customDays.toString() : "30");
                    setWalletId(data.walletId);
                    setNextPaymentDate(new Date(data.nextPaymentDate));
                    if (data.predefinedLogo) {
                        setPredefinedLogo(data.predefinedLogo);
                    }
                } else {
                    appAlert("Помилка", "Підписку не знайдено");
                    router.back();
                }
                setIsFetching(false);
            } else {
                const activeWallets = wallets.filter(w => !w.isArchived).sort((a, b) => (a.order ?? 999) - (b.order ?? 999));
                if (activeWallets.length > 0) setWalletId(activeWallets[0].id);

                const date = new Date();
                // date.setMonth(date.getMonth() + 1);
                setNextPaymentDate(date);
            }
        };

        loadData();
    }, [id, isEditMode, wallets]);

    const handleSave = async () => {
        const userId = auth.currentUser?.uid;
        if (!userId) return;

        if (!name.trim()) return appAlert("Помилка", "Введіть назву сервісу");
        if (!amount || amount === "0" || isNaN(Number(amount))) return appAlert("Помилка", "Введіть коректну суму");
        if (!walletId) return appAlert("Помилка", "Оберіть рахунок для списання");

        const subscriptionData = {
            userId,
            name: name.trim(),
            amount: Number(amount),
            currency,
            walletId,
            categoryId: "",
            billingCycle,
            customDays: billingCycle === 'days' ? Number(customDays) : null,
            nextPaymentDate: nextPaymentDate.toISOString(),
            predefinedLogo,
            isActive: true,
        };

        try {
            showLoader();
            if (isEditMode && id) {
                await updateSubscription(id, subscriptionData);
            } else {
                await addSubscription(subscriptionData);
            }
            router.back();
        } catch (error) {
            appAlert("Помилка", "Не вдалося зберегти підписку");
        } finally {
            hideLoader();
        }
    };

    const handleDelete = () => {
        appAlert(
            "Видалити підписку?",
            "Це видалить лише запис у додатку. Ваша реальна підписка у сервісі залишиться активною.",
            [
                { text: "Скасувати", style: "cancel" },
                {
                    text: "Видалити",
                    style: "destructive",
                    onPress: async () => {
                        if (!id) return;
                        showLoader();
                        try {
                            await deleteSubscription(id);
                            router.back();
                        } catch (e) {
                            appAlert("Помилка", "Не вдалося видалити");
                        } finally {
                            hideLoader();
                        }
                    }
                }
            ]
        );
    };

    if (isFetching) {
        return (
            <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <ActivityIndicator size="large" color={colors.primary} />
            </View>
        );
    }

    const selectedWallet = wallets.find(w => w.id === walletId);

    return (
        <View style={[styles.container, { paddingTop: insets.top + 10 }]}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={{ padding: 5 }}>
                    <Ionicons name="arrow-back" size={28} color={colors.textSecondary} />
                </TouchableOpacity>
                <Text style={styles.title}>{isEditMode ? "Редагувати" : "Нова підписка"}</Text>

                {isEditMode && (
                    <TouchableOpacity onPress={handleDelete} style={{ marginLeft: 'auto', padding: 5 }}>
                        <Ionicons name="trash-outline" size={24} color={colors.error} />
                    </TouchableOpacity>
                )}
            </View>

            <ScrollView contentContainerStyle={styles.form} showsVerticalScrollIndicator={false}>
                {/* Назва сервісу */}
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Назва сервісу</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Netflix, Spotify, Спортзал..."
                        placeholderTextColor={colors.textSecondary}
                        value={name}
                        onChangeText={(text) => {
                            setName(text);
                            // Автоматично скидаємо логотип, якщо користувач стирає назву
                            if (text.length === 0) setPredefinedLogo("");
                        }}
                    />
                </View>

                {/* Великий вибір логотипу */}
                <View style={styles.inputGroup}>
                    <Text style={[styles.label, { alignSelf: 'center' }]}>Логотип</Text>
                    <TouchableOpacity
                        onPress={() => setShowLogoPicker(true)}
                        style={[
                            styles.logoSelectorContainer,
                            predefinedLogo && styles.logoSelectorContainerActive
                        ]}
                        activeOpacity={0.8}
                    >
                        {predefinedLogo ? (
                            <Image
                                source={SERVICES_DB.find(s => s.id === predefinedLogo)?.image}
                                style={{ width: '85%', height: '85%' }}
                                contentFit="contain"
                                transition={200}
                            />
                        ) : (
                            <View style={styles.logoSelectorPlaceholder}>
                                <Ionicons name="image-outline" size={32} color={colors.textSecondary} />
                                <Text style={styles.logoSelectorText}>Обрати</Text>
                            </View>
                        )}
                    </TouchableOpacity>
                </View>

                {/* Сума та Валюта */}
                <View style={styles.row}>
                    <View style={[styles.inputGroup, styles.flex1]}>
                        <Text style={styles.label}>Сума</Text>
                        <TouchableOpacity style={styles.input} onPress={() => setShowCalc(true)}>
                            <Text style={{ color: amount === "0" ? colors.textSecondary : colors.text, fontSize: 16 }}>
                                {amount}
                            </Text>
                        </TouchableOpacity>
                    </View>

                    <View style={[styles.inputGroup, { width: 100 }]}>
                        <Text style={styles.label}>Валюта</Text>
                        <TouchableOpacity style={styles.input} onPress={() => setShowCurrency(true)}>
                            <Text style={{ color: colors.text, fontSize: 16, textAlign: 'center' }}>{currency}</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Рахунок списання */}
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>З якого рахунку списується?</Text>
                    <TouchableOpacity style={styles.selectorBtn} onPress={() => setShowWallet(true)}>
                        <Text style={selectedWallet ? styles.selectorText : styles.selectorPlaceholder}>
                            {selectedWallet ? selectedWallet.title : "Оберіть рахунок"}
                        </Text>
                        <Ionicons name="chevron-down" size={20} color={colors.textSecondary} />
                    </TouchableOpacity>
                </View>

                {/* Періодичність */}
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Періодичність списання</Text>
                    <View style={styles.chipContainer}>
                        <TouchableOpacity
                            style={[styles.chip, billingCycle === 'monthly' && styles.chipActive]}
                            onPress={() => setBillingCycle('monthly')}
                        >
                            <Text style={[styles.chipText, billingCycle === 'monthly' && styles.chipTextActive]}>Щомісяця</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.chip, billingCycle === 'yearly' && styles.chipActive]}
                            onPress={() => setBillingCycle('yearly')}
                        >
                            <Text style={[styles.chipText, billingCycle === 'yearly' && styles.chipTextActive]}>Щорічно</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.chip, billingCycle === 'days' && styles.chipActive]}
                            onPress={() => setBillingCycle('days')}
                        >
                            <Text style={[styles.chipText, billingCycle === 'days' && styles.chipTextActive]}>Дні</Text>
                        </TouchableOpacity>
                    </View>


                    {billingCycle === 'days' && (
                        <View style={[styles.inputGroup, { marginTop: 10 }]}>
                            <Text style={styles.label}>Кількість днів</Text>
                            <TextInput
                                style={styles.input}
                                keyboardType="number-pad"
                                value={customDays}
                                onChangeText={setCustomDays}
                                placeholder="Наприклад: 24"
                            />
                        </View>
                    )}
                </View>

                {/* Дата наступного платежу */}
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Дата найближчого платежу</Text>
                    <TouchableOpacity style={styles.selectorBtn} onPress={() => setShowDatePicker(true)}>
                        <Text style={styles.selectorText}>
                            {nextPaymentDate.toLocaleDateString('uk-UA')}
                        </Text>
                        <Ionicons name="calendar-outline" size={20} color={colors.textSecondary} />
                    </TouchableOpacity>
                </View>

                {/* Зберегти */}
                <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
                    <Text style={styles.saveBtnText}>
                        {isEditMode ? "Оновити підписку" : "Зберегти підписку"}
                    </Text>
                </TouchableOpacity>
            </ScrollView>

            {/* МОДАЛКА КАЛЬКУЛЯТОРА */}
            <DefaultModal visible={showCalc} onClose={() => setShowCalc(false)}
                overlayStyle={{ flex: 1, backgroundColor: colors.overlayHeavy, justifyContent: 'flex-end' }}
                contentStyle={{ backgroundColor: colors.surface, borderTopLeftRadius: 30, borderTopRightRadius: 30, padding: 20 }}>
                <Calculator amount={amount} setAmount={setAmount} currencySymbol={currency} />
                <TouchableOpacity style={styles.saveBtn} onPress={() => setShowCalc(false)}>
                    <Text style={styles.saveBtnText}>Готово</Text>
                </TouchableOpacity>
            </DefaultModal>

            {/* МОДАЛКИ ВИБОРУ ВАЛЮТИ */}
            <CurrencyPickerModal
                visible={showCurrency}
                onClose={() => setShowCurrency(false)}
                onSelect={(code) => setCurrency(code)}
                currencyType="fiat"
            />

            {/* МОДАЛКИ ВИБОРУ ГАМАНЦЯ */}
            <WalletPickerModal
                visible={showWallet}
                onClose={() => setShowWallet(false)}
                onSelect={(id) => setWalletId(id)}
            />

            {/* МОДАЛКИ ВИБОРУ ЛОГОТИПУ */}
            <ServiceLogoPickerModal
                visible={showLogoPicker}
                onClose={() => setShowLogoPicker(false)}
                searchQuery={name}
                selectedId={predefinedLogo}
                onSelect={(id) => {
                    setPredefinedLogo(id);
                    if (!name) {
                        const selectedService = SERVICES_DB.find(s => s.id === id);
                        if (selectedService) setName(selectedService.name);
                    }
                }}
            />

            {/* КАСТОМНИЙ DATEPICKER */}
            {showDatePicker && (
                <DatePickerModal
                    visible={showDatePicker}
                    onClose={() => setShowDatePicker(false)}
                    currentDate={nextPaymentDate}
                    onSelect={(date) => setNextPaymentDate(date)}
                />
            )}
        </View>
    );
};