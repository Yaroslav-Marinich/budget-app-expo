import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image"; // <--- Використовуємо Image
import { Href, useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import { ActivityIndicator, FlatList, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { auth } from "@/src/config/firebase";
import { SERVICES_DB } from "@/src/constants/ServicesDB";
import { useGlobalData } from "@/src/context/DataContext";
import { useLoader } from "@/src/context/LoaderContext";
import { useTheme } from "@/src/context/ThemeContext";
import { appAlert } from "@/src/services/alert";
import { deleteSubscription, getSubscriptions, Subscription } from "@/src/services/subscriptions";
import { getStyles } from "./subscriptions.styles";

export const SubscriptionsScreen = () => {
    const insets = useSafeAreaInsets();
    const router = useRouter();
    const { colors } = useTheme();
    const styles = getStyles(colors);

    const { wallets } = useGlobalData();
    const { showLoader, hideLoader } = useLoader();

    const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
    const [loading, setLoading] = useState(true);

    const loadSubscriptions = async () => {
        const userId = auth.currentUser?.uid;
        if (!userId) return;

        try {
            setLoading(true);
            const data = await getSubscriptions(userId);

            const sorted = data.sort((a, b) => {
                const dateA = getNextActualPaymentDate(a.nextPaymentDate, a.billingCycle, a.customDays).getTime();
                const dateB = getNextActualPaymentDate(b.nextPaymentDate, b.billingCycle, b.customDays).getTime();
                return dateA - dateB;
            });

            setSubscriptions(sorted);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            loadSubscriptions();
        }, [])
    );

    const handleDelete = (item: Subscription) => {
        appAlert(
            'Видалення підписки',
            `Ви впевнені, що хочете видалити нагадування про підписку "${item.name}"?`,
            [
                { text: 'Скасувати', style: 'cancel' },
                {
                    text: 'Видалити',
                    style: 'destructive',
                    onPress: async () => {
                        showLoader();
                        try {
                            if (item.id) {
                                await deleteSubscription(item.id);
                                await loadSubscriptions();
                            }
                        } catch (error) {
                            console.error(error);
                            appAlert('Помилка', 'Не вдалося видалити підписку.');
                        } finally {
                            hideLoader();
                        }
                    },
                },
            ],
        );
    };

    const formatPaymentDate = (date: string | Date) => {
        const d = typeof date === 'string' ? new Date(date) : date;

        const day = String(d.getDate()).padStart(2, '0');
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const year = d.getFullYear();

        return `${day}.${month}.${year}`;
    };

    const getNextActualPaymentDate = (startDate: string, cycle: string, customDays?: number | null) => {
        let nextDate = new Date(startDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        while (nextDate < today) {
            if (cycle === 'monthly') {
                nextDate.setMonth(nextDate.getMonth() + 1);
            } else if (cycle === 'yearly') {
                nextDate.setFullYear(nextDate.getFullYear() + 1);
            } else if (cycle === 'days' && customDays) {
                nextDate.setDate(nextDate.getDate() + customDays);
            } else {
                nextDate.setMonth(nextDate.getMonth() + 1);
                break;
            }
        }

        return nextDate;
    };

    const renderEmptyState = () => (
        <View style={styles.emptyContainer}>
            <Ionicons name="infinite-outline" size={80} color={colors.surfaceMuted} />
            <Text style={styles.emptyTitle}>Немає підписок</Text>
            <Text style={styles.emptyText}>
                Додайте свої регулярні платежі (Netflix, Spotify, спортзал), щоб не пропустити день списання.
            </Text>
        </View>
    );

    const renderItem = ({ item }: { item: Subscription }) => {
        const wallet = wallets.find(w => w.id === item.walletId);
        const serviceLogo = SERVICES_DB.find(s => s.id === item.predefinedLogo)?.image;
        const actualDate = getNextActualPaymentDate(item.nextPaymentDate, item.billingCycle, item.customDays);

        return (
            <View style={styles.card}>

                {/* ВЕРХНЯ ЧАСТИНА: Лого, Назва, Дії */}
                <View style={styles.cardTopRow}>
                    {serviceLogo ? (
                        <Image
                            source={serviceLogo}
                            style={styles.logoImage}
                            contentFit="contain"
                        />
                    ) : (
                        <View style={[styles.fallbackLogo, { backgroundColor: `${colors.primary}15` }]}>
                            <Ionicons name="card-outline" size={32} color={colors.primary} />
                        </View>
                    )}

                    <View style={styles.cardHeaderInfo}>
                        <Text style={styles.cardTitle} numberOfLines={1}>{item.name}</Text>
                        <Text style={styles.cardSubtitle}>
                            {item.billingCycle === 'monthly' ? 'Щомісячне списання' :
                                item.billingCycle === 'yearly' ? 'Щорічне списання' :
                                    `Кожні ${item.customDays} днів`}
                        </Text>
                    </View>

                    {/* Кнопки управління (Редагувати / Видалити) */}
                    <View style={styles.cardActions}>
                        <TouchableOpacity
                            style={styles.actionBtn}
                            onPress={() => router.push(`/subscriptions/${item.id}` as Href)}
                        >
                            <Ionicons name="pencil" size={20} color={colors.textSecondary} />
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.actionBtn}
                            onPress={() => handleDelete(item)}
                        >
                            <Ionicons name="trash-outline" size={20} color={colors.error} />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* НИЖНЯ ЧАСТИНА: Інформаційний блок */}
                <View style={styles.cardDetails}>
                    <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Сума:</Text>
                        <Text style={styles.amountText}>{item.amount} {item.currency}</Text>
                    </View>

                    <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>З рахунку:</Text>
                        <View style={styles.walletInfoRow}>
                            {wallet ? (
                                <>
                                    {/* Маленька іконка гаманця з фоном */}
                                    <View style={[
                                        styles.walletIcon,
                                        { backgroundColor: wallet.isCrypto ? `${colors.warningAccent}15` : `${colors.primary}15` }
                                    ]}>
                                        <Ionicons
                                            name={wallet.icon as any}
                                            size={18}
                                            color={wallet.isCrypto ? colors.warningAccent : colors.primary}
                                        />
                                    </View>
                                    <Text style={styles.detailValue}>{wallet.title}</Text>
                                </>
                            ) : (
                                <Text style={styles.detailValue}>Невідомий рахунок</Text>
                            )}
                        </View>
                    </View>

                    <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Наступне списання:</Text>
                        <Text style={styles.dateWarning}>
                            {formatPaymentDate(actualDate)} (орієнтовна)
                        </Text>
                    </View>
                </View>

            </View>
        );
    };

    return (
        <View style={[styles.container, { paddingTop: insets.top + 10 }]}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={{ padding: 5 }}>
                    <Ionicons name="arrow-back" size={28} color={colors.textSecondary} />
                </TouchableOpacity>
                <Text style={styles.title}>Мої підписки</Text>
            </View>

            {loading ? (
                <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 50 }} />
            ) : (
                <FlatList
                    data={subscriptions}
                    keyExtractor={(item) => item.id || Math.random().toString()}
                    contentContainerStyle={[styles.listContainer, { paddingBottom: insets.bottom + 80 }]}
                    renderItem={renderItem}
                    ListEmptyComponent={renderEmptyState}
                    showsVerticalScrollIndicator={false}
                />
            )}

            <TouchableOpacity
                style={[styles.fab, { bottom: insets.bottom + 20 }]}
                activeOpacity={0.8}
                onPress={() => router.push('/subscriptions/add' as Href)}
            >
                <Ionicons name="add" size={32} color={colors.background} />
            </TouchableOpacity>
        </View>
    );
};