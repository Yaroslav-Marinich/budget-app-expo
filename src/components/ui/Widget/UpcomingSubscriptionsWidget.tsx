import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { AppState, Modal, Text, TouchableOpacity, useWindowDimensions, View } from "react-native";
import { Gesture, GestureDetector, ScrollView } from "react-native-gesture-handler";
import Animated, {
    interpolate,
    runOnJS,
    useAnimatedStyle,
    useSharedValue,
    withTiming
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { auth } from "@/src/config/firebase";
import { SERVICES_DB } from "@/src/constants/ServicesDB";
import { useGlobalData } from "@/src/context/DataContext";
import { useTheme } from "@/src/context/ThemeContext";
import { getSubscriptions, Subscription } from "@/src/services/subscriptions";
import { useFocusEffect } from "expo-router";
import { getStyles } from "./UpcomingSubscriptionsWidget.styles";

const SubscriptionItem = ({ sub, wallets, colors, styles, getNextDate }: any) => {
    const [expanded, setExpanded] = useState(false);
    const animation = useSharedValue(0);

    const toggleExpand = () => {
        setExpanded(!expanded);
        animation.value = withTiming(expanded ? 0 : 1, { duration: 300 });
    };

    const logo = SERVICES_DB.find(s => s.id === sub.predefinedLogo)?.image;
    const date = getNextDate(sub.nextPaymentDate, sub.billingCycle, sub.customDays);
    const wallet = wallets.find((w: any) => w.id === sub.walletId);

    const animatedContentStyle = useAnimatedStyle(() => ({
        height: interpolate(animation.value, [0, 1], [0, 80]),
        opacity: animation.value,
    }));

    const arrowStyle = useAnimatedStyle(() => ({
        transform: [{ rotate: `${interpolate(animation.value, [0, 1], [0, 180])}deg` }],
    }));

    const getDisplayDate = (paymentDate: Date) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);

        const target = new Date(paymentDate);
        target.setHours(0, 0, 0, 0);

        if (target.getTime() === today.getTime()) {
            return "Сьогодні";
        } else if (target.getTime() === tomorrow.getTime()) {
            return "Завтра";
        } else {
            return target.toLocaleDateString('uk-UA', { day: 'numeric', month: 'long' });
        }
    };

    const displayDateString = getDisplayDate(date);
    // const isUrgent = displayDateString === "Сьогодні" || displayDateString === "Завтра";

    return (
        <TouchableOpacity
            activeOpacity={0.9}
            onPress={toggleExpand}
            style={styles.subItemCard}
        >
            <View style={styles.mainCardContent}>
                <Image source={logo} style={styles.subItemLogo} contentFit="contain" />
                <View style={styles.subItemInfo}>
                    <Text style={styles.subItemName}>{sub.name}</Text>
                    <Text style={[
                        styles.subItemDate,
                        // isUrgent && { color: displayDateString === "Сьогодні" ? colors.error : colors.primary, fontWeight: 'bold' }
                    ]}>
                        {displayDateString}
                    </Text>
                </View>
                <Text style={styles.subItemAmount}>{sub.amount} {sub.currency}</Text>
            </View>

            <Animated.View style={[styles.expandedContent, animatedContentStyle]}>
                <View style={styles.expandedRow}>
                    <Text style={styles.expandedLabel}>Періодичність:</Text>
                    <Text style={styles.expandedValue}>
                        {sub.billingCycle === 'monthly' ? 'Щомісяця' :
                            sub.billingCycle === 'yearly' ? 'Щорічно' : `Кожні ${sub.customDays} дн.`}
                    </Text>
                </View>
                <View style={styles.expandedRow}>
                    <Text style={styles.expandedLabel}>Рахунок:</Text>
                    <View style={styles.walletBadge}>
                        <Ionicons name={wallet?.icon || "card-outline"} size={14} color={colors.primary} />
                        <Text style={styles.expandedValue}>{wallet?.title || 'Невідомо'}</Text>
                    </View>
                </View>
            </Animated.View>

            <View style={styles.arrowContainer}>
                <Animated.View style={arrowStyle}>
                    <Ionicons name="chevron-down" size={18} color={colors.textSecondary} />
                </Animated.View>
            </View>
        </TouchableOpacity>
    );
};

export const UpcomingSubscriptionsWidget = () => {
    const { colors } = useTheme();
    const styles = getStyles(colors);
    const insets = useSafeAreaInsets();
    const { wallets } = useGlobalData();
    const { width: screenWidth } = useWindowDimensions();
    const drawerWidth = screenWidth * 0.85;

    const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
    const [isDrawerVisible, setDrawerVisible] = useState(false);
    const slideX = useSharedValue(drawerWidth);

    const getNextActualPaymentDate = (startDate: string, cycle: string, customDays?: number | null) => {
        let nextDate = new Date(startDate);
        nextDate.setHours(0, 0, 0, 0);

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        while (nextDate < today) {
            if (cycle === 'monthly') nextDate.setMonth(nextDate.getMonth() + 1);
            else if (cycle === 'yearly') nextDate.setFullYear(nextDate.getFullYear() + 1);
            else if (cycle === 'days' && customDays) nextDate.setDate(nextDate.getDate() + customDays);
            else { nextDate.setMonth(nextDate.getMonth() + 1); break; }
        }
        return nextDate;
    };

    const drawerGesture = Gesture.Pan()
        .activeOffsetX([15, 1000])
        .failOffsetY([-10, 10])
        .onUpdate(event => {
            if (event.translationX > 0) slideX.value = Math.min(event.translationX, drawerWidth);
        })
        .onEnd(event => {
            const shouldClose = event.translationX > drawerWidth * 0.25 || event.velocityX > 500;
            if (shouldClose) {
                slideX.value = withTiming(drawerWidth, { duration: 250 }, (fin) => { if (fin) runOnJS(setDrawerVisible)(false); });
            } else {
                slideX.value = withTiming(0, { duration: 250 });
            }
        });

    const drawerAnimatedStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: slideX.value }],
    }));

    const fetchSubs = async () => {
        const userId = auth.currentUser?.uid;
        if (userId) {
            const data = await getSubscriptions(userId);
            setSubscriptions(data);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchSubs();
        }, [])
    );

    useEffect(() => {
        const appStateSubscription = AppState.addEventListener('change', nextAppState => {
            if (nextAppState === 'active') {
                fetchSubs();
            }
        });

        return () => {
            appStateSubscription.remove();
        };
    }, []);

    const upcomingSubs = useMemo(() => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const nextWeek = new Date(today);
        nextWeek.setDate(today.getDate() + 7);
        nextWeek.setHours(23, 59, 59, 999);

        return subscriptions.filter(sub => {
            const actualDate = getNextActualPaymentDate(sub.nextPaymentDate, sub.billingCycle, sub.customDays);
            return actualDate >= today && actualDate <= nextWeek;
        }).sort((a, b) => {
            const dateA = getNextActualPaymentDate(a.nextPaymentDate, a.billingCycle, a.customDays);
            const dateB = getNextActualPaymentDate(b.nextPaymentDate, b.billingCycle, b.customDays);
            return dateA.getTime() - dateB.getTime();
        });
    }, [subscriptions]);

    const toggleDrawer = (show: boolean) => {
        if (show) {
            setDrawerVisible(true);
            slideX.value = withTiming(0, { duration: 300 });
        } else {
            slideX.value = withTiming(drawerWidth, { duration: 250 }, f => { if (f) runOnJS(setDrawerVisible)(false); });
        }
    };

    if (upcomingSubs.length === 0) return null;

    return (
        <>
            <TouchableOpacity
                style={[styles.subscriptionsTrigger, { top: insets.top + 177 }]}
                onPress={() => toggleDrawer(true)}
            >
                <View style={styles.subTriggerBadge}>
                    <Text style={styles.subTriggerBadgeText}>{upcomingSubs.length}</Text>
                </View>
                <Ionicons name="card" size={22} color={colors.primary} />
                <Ionicons name="chevron-back" size={14} color={colors.textSecondary} />
            </TouchableOpacity>

            <Modal visible={isDrawerVisible} transparent onRequestClose={() => toggleDrawer(false)}>
                <View style={styles.sideDrawerOverlay}>
                    <TouchableOpacity style={{ flex: 1 }} activeOpacity={1} onPress={() => toggleDrawer(false)} />
                    <GestureDetector gesture={drawerGesture}>
                        <Animated.View style={[styles.sideDrawerContent, drawerAnimatedStyle]}>
                            <View style={styles.drawerHeader}>
                                <Text style={styles.drawerTitle}>Ближчі оплати</Text>
                                <TouchableOpacity onPress={() => toggleDrawer(false)}>
                                    <Ionicons name="close" size={30} color={colors.textSecondary} />
                                </TouchableOpacity>
                            </View>

                            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
                                {upcomingSubs.map(sub => (
                                    <SubscriptionItem
                                        key={sub.id}
                                        sub={sub}
                                        wallets={wallets}
                                        colors={colors}
                                        styles={styles}
                                        getNextDate={getNextActualPaymentDate}
                                    />
                                ))}
                                <Text style={{ textAlign: 'center', color: colors.textSecondary, marginTop: 20, fontSize: 12 }}>
                                    Показані підписки на найближчі 7 днів
                                </Text>
                            </ScrollView>
                        </Animated.View>
                    </GestureDetector>
                </View>
            </Modal>
        </>
    );
};