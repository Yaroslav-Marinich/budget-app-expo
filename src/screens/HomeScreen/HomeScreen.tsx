import { Ionicons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Dimensions, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { CategoryModal } from "@/src/components/ui/CategoryModal/CategoryModal";
import { MonthPickerModal } from "@/src/components/ui/MonthPickerModal/MonthPickerModal";
import { TransactionModal } from "@/src/components/ui/TransactionModal/TransactionModal";
import { UpcomingSubscriptionsWidget } from "@/src/components/ui/Widget/UpcomingSubscriptionsWidget";
import { CURRENCIES } from "@/src/constants/Currencies";
import { useGlobalData } from "@/src/context/DataContext";
import { useTheme } from "@/src/context/ThemeContext";
import { subscribeToMonthlyTransactions } from "@/src/services/transactions";
import { formatMoney } from "@/src/utils/formatMoney";
import { getStyles } from "./home.styles";

export const HomeScreen = () => {
	const insets = useSafeAreaInsets();
	const router = useRouter();
	const walletsListRef = useRef<FlatList>(null);
	const { categories, wallets } = useGlobalData();
	const { colors } = useTheme();
	const styles = getStyles(colors);

	const { width: screenWidth } = Dimensions.get("window");
	const cardWidth = screenWidth * 0.75;
	const cardSpacing = 15;

	const [activeTab, setActiveTab] = useState<"expense" | "income">("expense");

	const [selectedWalletId, setSelectedWalletId] = useState<string | null>(null);
	const [modalVisible, setModalVisible] = useState(false);
	const [selectedCategory, setSelectedCategory] = useState<any>(null);
	const [transactions, setTransactions] = useState<any[]>([]);
	const [currentDate, setCurrentDate] = useState(new Date());
	const [isMonthPickerVisible, setMonthPickerVisible] = useState(false);
	const [isCategoryModalVisible, setCategoryModalVisible] = useState(false);

	const handleWalletPress = (walletId: string, index: number) => {
		setSelectedWalletId(walletId);

		walletsListRef.current?.scrollToIndex({
			index,
			animated: true,
			viewPosition: 0.5,
		});
	};

	const selectedWalletTransactions = useMemo(() => {
		if (!selectedWalletId) return [];
		return transactions.filter((transaction) => transaction.walletId === selectedWalletId);
	}, [transactions, selectedWalletId]);

	const totalExpense = selectedWalletTransactions
		.filter((transaction) => transaction.type === "expense")
		.reduce((sum, transaction) => sum + transaction.amount, 0);

	const totalIncome = selectedWalletTransactions
		.filter((transaction) => transaction.type === "income")
		.reduce((sum, transaction) => sum + transaction.amount, 0);

	const selectedWallet = useMemo(() => {
		return wallets.find((wallet) => wallet.id === selectedWalletId);
	}, [wallets, selectedWalletId]);

	const isCryptoWallet = selectedWallet?.isCrypto || false;

	const activeCategories = categories
		.filter((category) => {
			const isCategoryCrypto = !!category.isCrypto;
			return category.type === activeTab && !category.isArchived && isCategoryCrypto === isCryptoWallet;
		})
		.map((category) => {
			const sum = selectedWalletTransactions
				.filter((transaction) => transaction.categoryId === category.id)
				.reduce((accumulator, transaction) => accumulator + transaction.amount, 0);

			const hasPending = selectedWalletTransactions.some(
				(transaction) => transaction.categoryId === category.id && transaction.isPending,
			);

			return { ...category, sum, hasPending };
		});

	const getFormattedDate = (date: Date) => {
		const monthName = date
			.toLocaleString("uk-UA", { month: "long" })
			.replace(/^./, (char) => char.toUpperCase());
		const monthNum = String(date.getMonth() + 1).padStart(2, "0");
		const year = date.getFullYear();

		return `${monthNum} ${monthName} ${year}`;
	};

	const handleCategoryPress = (category: any) => {
		setSelectedCategory(category);
		setModalVisible(true);
	};

	const handlePrevMonth = () => {
		setCurrentDate((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
	};

	const handleNextMonth = () => {
		setCurrentDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
	};

	const processedWallets = useMemo(() => {
		const activeWallets = wallets
			.filter((wallet) => !wallet.isArchived)
			.sort((left, right) => (left.order ?? Number.MAX_SAFE_INTEGER) - (right.order ?? Number.MAX_SAFE_INTEGER));

		const archivedWithActivity = wallets
			.filter((wallet) => wallet.isArchived)
			.filter((wallet) => transactions.some((transaction) => transaction.walletId === wallet.id))
			.map((wallet) => {
				const monthBalance = transactions
					.filter((transaction) => transaction.walletId === wallet.id)
					.reduce(
						(balance, transaction) =>
							transaction.type === "income" ? balance + transaction.amount : balance - transaction.amount,
						0,
					);

				return { ...wallet, balance: monthBalance };
			});

		return [...activeWallets, ...archivedWithActivity];
	}, [wallets, transactions]);

	const isSelectedWalletArchived = useMemo(() => {
		const selectedWallet = wallets.find((wallet) => wallet.id === selectedWalletId);
		return selectedWallet?.isArchived || false;
	}, [wallets, selectedWalletId]);

	const mainWalletId = useMemo(() => {
		const activeWallets = wallets
			.filter((wallet) => !wallet.isArchived)
			.sort((left, right) => (left.order ?? Number.MAX_SAFE_INTEGER) - (right.order ?? Number.MAX_SAFE_INTEGER));

		return activeWallets.length > 0 ? activeWallets[0].id : null;
	}, [wallets]);

	const selectedWalletCurrencySymbol = useMemo(() => {
		const selectedWallet = wallets.find((wallet) => wallet.id === selectedWalletId);
		const currency = CURRENCIES.find((c) => c.code === selectedWallet?.currency);
		return currency?.symbol ?? selectedWallet?.currency ?? "₴";
	}, [wallets, selectedWalletId]);


	useEffect(() => {
		const year = currentDate.getFullYear();
		const month = String(currentDate.getMonth() + 1).padStart(2, "0");
		const currentMonthStr = `${year}-${month}`;

		const unsubscribe = subscribeToMonthlyTransactions(currentMonthStr, (data) => {
			setTransactions(data);
		});

		return () => unsubscribe();
	}, [currentDate]);

	useEffect(() => {
		if (!wallets.length) return;

		const sortedActive = wallets
			.filter((wallet) => !wallet.isArchived)
			.sort((left, right) => (left.order ?? Number.MAX_SAFE_INTEGER) - (right.order ?? Number.MAX_SAFE_INTEGER));

		setSelectedWalletId((currentSelectedId) => {
			if (sortedActive.length === 0) return null;
			const selectedStillActive = sortedActive.some((wallet) => wallet.id === currentSelectedId);
			if (!currentSelectedId || !selectedStillActive) {
				return sortedActive[0].id;
			}
			return currentSelectedId;
		});
	}, [wallets]);

	// useEffect(() => {
	// 	const unsubscribeWallets = subscribeToWallets((data) => {
	// 		setWallets(data);

	// 		const sortedActive = data
	// 			.filter((wallet) => !wallet.isArchived)
	// 			.sort(
	// 				(left, right) =>
	// 					(left.order ?? Number.MAX_SAFE_INTEGER) - (right.order ?? Number.MAX_SAFE_INTEGER),
	// 			);

	// 		setSelectedWalletId((currentSelectedId) => {
	// 			if (sortedActive.length === 0) {
	// 				return null;
	// 			}

	// 			const selectedStillActive = sortedActive.some((wallet) => wallet.id === currentSelectedId);
	// 			if (!currentSelectedId || !selectedStillActive) {
	// 				return sortedActive[0].id;
	// 			}

	// 			return currentSelectedId;
	// 		});
	// 	});

	// 	return () => unsubscribeWallets();
	// }, []);

	// useEffect(() => {
	// 	const unsubscribeCategories = subscribeToCategories((data) => {
	// 		setCategories(data);
	// 	});

	// 	return () => unsubscribeCategories();
	// }, []);

	const formattedExpense = `${formatMoney(totalExpense)} ${selectedWalletCurrencySymbol}`;
	const formattedIncome = `${formatMoney(totalIncome)} ${selectedWalletCurrencySymbol}`;

	const maxAmountLength = Math.max(formattedExpense.length, formattedIncome.length);

	let amountFontSize = 20;
	if (maxAmountLength > 16) {
		amountFontSize = 13;
	} else if (maxAmountLength > 13) {
		amountFontSize = 16;
	} else if (maxAmountLength > 10) {
		amountFontSize = 18;
	}

	return (
		<View style={[styles.container, { paddingTop: insets.top }]}>
			<Stack.Screen options={{ headerShown: false }} />

			<ScrollView showsVerticalScrollIndicator={false}>
				<Text style={styles.sectionTitle}>Рахунки</Text>
				<FlatList
					ref={walletsListRef}
					data={processedWallets}
					horizontal
					showsHorizontalScrollIndicator={false}
					keyExtractor={(wallet) => wallet.id}
					contentContainerStyle={{ paddingHorizontal: 20 }}
					snapToInterval={cardWidth + cardSpacing}
					decelerationRate="fast"
					snapToAlignment="center"
					getItemLayout={(_, index) => ({
						length: cardWidth + cardSpacing,
						offset: (cardWidth + cardSpacing) * index,
						index,
					})}
					renderItem={({ item: wallet, index }) => {
						const cryptoColor = colors.warningAccent;
						const accentColor = wallet.isCrypto ? cryptoColor : colors.accent;

						return (
							<TouchableOpacity
								activeOpacity={0.9}
								style={[
									styles.walletCard,
									{
										width: cardWidth,
										marginRight: index === processedWallets.length - 1 ? 0 : cardSpacing,
									},
									wallet.isArchived && styles.walletCardArchived,
									wallet.isPending && styles.walletCardPending,
									selectedWalletId === wallet.id && { borderColor: colors.primary, borderWidth: 2 },
									wallet.balance < 0 && { borderColor: colors.error, borderWidth: 2 },
								]}
								onPress={() => handleWalletPress(wallet.id, index)}
							>
								{wallet.isArchived && (
									<View style={styles.archiveBadgeHome}>
										<Text style={styles.archiveBadgeTextHome}>Архів</Text>
									</View>
								)}

								{wallet.id === mainWalletId && !wallet.isArchived && (
									<View style={styles.mainBadgeHome}>
										<Ionicons name="star" size={10} color={colors.background} />
										<Text style={styles.mainBadgeTextHome}>Основний</Text>
									</View>
								)}

								{wallet.isPending && (
									<View style={styles.pendingBadgeHome}>
										<Ionicons name="time-outline" size={12} color={colors.background} />
										<Text style={styles.pendingBadgeTextHome}>Черга</Text>
									</View>
								)}

								<View style={styles.cardHeader}>
									<Ionicons
										name={wallet.icon as any}
										size={24}
										color={wallet.isArchived ? colors.textSecondary : accentColor}
									/>
									<View>
										<Text style={styles.walletTitle}>{wallet.title}</Text>
									</View>
								</View>
								<Text style={styles.walletAmount}>
									{formatMoney(wallet.balance)} <Text style={[styles.currency, { color: wallet.isArchived ? colors.textSecondary : accentColor }]}>
										{wallet.currency}
									</Text>
								</Text>
							</TouchableOpacity>
						)
					}}
				/>

				<View style={styles.dateSelector}>
					<TouchableOpacity onPress={handlePrevMonth} style={{ padding: 10 }}>
						<Ionicons name="chevron-back" size={24} color={colors.textSecondary} />
					</TouchableOpacity>

					<TouchableOpacity onPress={() => setMonthPickerVisible(true)}>
						<Text style={styles.dateText}>{getFormattedDate(currentDate)}</Text>
					</TouchableOpacity>

					<TouchableOpacity onPress={handleNextMonth} style={{ padding: 10 }}>
						<Ionicons name="chevron-forward" size={24} color={colors.textSecondary} />
					</TouchableOpacity>
				</View>

				<View style={styles.transactionsBoard}>
					<View style={styles.toggleContainer}>
						<TouchableOpacity
							style={[styles.toggleBtn, activeTab === "expense" && styles.toggleBtnActive]}
							onPress={() => setActiveTab("expense")}
						>
							<Text style={[styles.toggleLabel, activeTab === "expense" && { color: colors.error }]}>Витрати</Text>
							<Text
								style={[styles.toggleAmount, { fontSize: amountFontSize }]}
								numberOfLines={1}
							>{formatMoney(totalExpense)} {selectedWalletCurrencySymbol}</Text>
						</TouchableOpacity>

						<TouchableOpacity
							style={[styles.toggleBtn, activeTab === "income" && styles.toggleBtnActive]}
							onPress={() => setActiveTab("income")}
						>
							<Text style={[styles.toggleLabel, activeTab === "income" && { color: colors.primary }]}>Доходи</Text>
							<Text
								style={[styles.toggleAmount, { fontSize: amountFontSize }]}
								numberOfLines={1}
							>{formatMoney(totalIncome)} {selectedWalletCurrencySymbol}</Text>
						</TouchableOpacity>
					</View>

					<View style={styles.dividerContainer}>
						<View style={styles.dividerLine} />
						{isSelectedWalletArchived && (
							<View style={styles.lockBadge}>
								<Ionicons name="lock-closed" size={24} color={colors.error} />
							</View>
						)}
					</View>

					<View style={styles.categoriesContainer}>
						{activeCategories.map((category) => {
							const isDisabled = isSelectedWalletArchived;

							return (
								<TouchableOpacity
									key={category.id}
									style={[styles.categoryCard, isDisabled && styles.categoryCardDisabled]}
									onPress={() => {
										if (!isDisabled) {
											handleCategoryPress(category);
										}
									}}
									onLongPress={() => {
										if (!selectedWalletId) {
											return;
										}

										router.push({
											pathname: "/transactions",
											params: {
												initialWalletId: selectedWalletId,
												initialDate: currentDate.toISOString(),
												categoryId: category.id,
												categoryName: category.name,
												lockFilters: "1",
											},
										} as any);
									}}
									delayLongPress={300}
								>
									<View style={[styles.iconContainer, { backgroundColor: `${category.color}15` }]}>
										<Ionicons name={category.icon as any} size={22} color={category.color} />
										{category.hasPending && (
											<View style={styles.pendingCategoryDot}>
												<Ionicons name="time-outline" size={10} color={colors.background} />
											</View>
										)}
									</View>
									<View style={styles.textContainer}>
										<Text style={styles.categoryName} numberOfLines={1}>
											{category.name}
										</Text>
										<Text
											style={[styles.categoryAmount, category.sum === 0 && { color: colors.textSecondary }]}
											numberOfLines={1}
										>
											{formatMoney(category.sum)} {selectedWalletCurrencySymbol}
										</Text>
									</View>
								</TouchableOpacity>
							);
						})}

						<TouchableOpacity
							style={[styles.categoryCard, styles.addCategoryCard]}
							onPress={() => setCategoryModalVisible(true)}
						>
							<View style={[styles.iconContainer, { backgroundColor: colors.surfaceSoft }]}>
								<Ionicons name="add" size={24} color={colors.textSecondary} />
							</View>
							<View style={styles.textContainer}>
								<Text style={[styles.categoryName, { color: colors.textSecondary }]}>Категорія</Text>
								<Text style={styles.categoryAmount}>Нова</Text>
							</View>
						</TouchableOpacity>
					</View>

					<TouchableOpacity
						style={styles.transactionsListBtn}
						onPress={() => router.push({
							pathname: '/transactions',
							params: {
								initialWalletId: selectedWalletId,
								initialDate: currentDate.toISOString()
							}
						} as any)}
					>
						<Text style={styles.transactionsListBtnText}>Всі операції</Text>
						<Ionicons name="arrow-forward" size={20} color={colors.primary} />
					</TouchableOpacity>
				</View>
			</ScrollView>

			<TransactionModal
				visible={modalVisible}
				onClose={() => setModalVisible(false)}
				type={activeTab}
				categoryName={selectedCategory?.name}
				categoryId={selectedCategory?.id}
				walletId={selectedWalletId}
				currencySymbol={selectedWalletCurrencySymbol}
			/>

			<MonthPickerModal
				visible={isMonthPickerVisible}
				onClose={() => setMonthPickerVisible(false)}
				currentDate={currentDate}
				onSelect={(newDate) => setCurrentDate(newDate)}
			/>

			<CategoryModal
				visible={isCategoryModalVisible}
				onClose={() => setCategoryModalVisible(false)}
				type={activeTab}
				existingCategories={categories}
				isCryptoWallet={isCryptoWallet}
			/>

			<UpcomingSubscriptionsWidget />
		</View>
	);
};
